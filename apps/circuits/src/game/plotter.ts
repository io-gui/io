import { ReactiveNode, Register } from '@io-gui/core'
import { Pad } from './items/pad.js'
import { Terminal, type TerminalColor } from './items/terminal.js'
import { Line } from './items/line.js'

type vec2 = [number, number]

export interface PointAt {
  id: number
  isTerminal: boolean
}

/**
 * Plotter — position and geometry only.
 * Intersection checks, adding/removing pads, terminals, and lines.
 * No color, propagation, or completion.
 */
@Register
export class Plotter extends ReactiveNode {
  width = 0
  height = 0
  pads: Pad[] = []
  terminals: Terminal[] = []
  lines: Line[] = []

  connect(pads: Pad[], terminals: Terminal[], lines: Line[], width: number, height: number) {
    this.width = width
    this.height = height
    this.pads = pads
    this.terminals = terminals
    this.lines = lines
  }

  getPointAt([x, y]: vec2): Pad | Terminal | undefined {
    for (const pad of this.pads) {
      if (pad.pos[0] === x && pad.pos[1] === y)
        return pad
    }
    for (const term of this.terminals) {
      if (term.pos[0] === x && term.pos[1] === y)
        return term
    }
  }

  getLinesAtPoint([x, y]: vec2, filter?: (line: Line) => boolean): Line[] {
    const lines = []
    for (const line of this.lines) {
      if (line.pos.some(([px, py]) => px === x && py === y) && (filter?.(line) ?? true)) {
        lines.push(line)
      }
    }
    return lines
  }

  getLineById(id: number): Line | undefined {
    return this.lines.find((l) => l.id === id)
  }

  checkDiagonalCrossing(line: Line, [x, y]: vec2): boolean {
    const last = line.pos[line.pos.length - 1]
    const mx = (x + last[0]) / 2
    const my = (y + last[1]) / 2
    for (const other of this.lines) {
      if (other.layer !== line.layer) continue
      if (other.hasDiagonalSegmentAt([mx, my])) return false
    }
    return true
  }

  addPad(id: number, [x, y]: vec2): boolean {
    if (this.getPointAt([x, y])) return false
    this.pads.push(new Pad(id, [x, y]))
    this.dispatch('game-update', undefined, true)
    return true
  }

  addTerminal(id: number, [x, y]: vec2, color: TerminalColor): boolean {
    if (this.getPointAt([x, y])) return false
    this.terminals.push(new Terminal(id, [x, y], color))
    this.dispatch('game-update', undefined, true)
    return true
  }

  delete([x, y]: vec2) {
    const padIdx = this.pads.findIndex((p) => p.pos[0] === x && p.pos[1] === y)
    if (padIdx !== -1) {
      this.pads.splice(padIdx, 1)
    }
    const termIdx = this.terminals.findIndex(
      (t) => t.pos[0] === x && t.pos[1] === y,
    )
    if (termIdx !== -1) {
      this.terminals.splice(termIdx, 1)
    }
    const lineIdx = this.lines.findIndex((l) =>
      l.pos.some(([px, py]) => px === x && py === y),
    )
    if (lineIdx !== -1) {
      this.lines.splice(lineIdx, 1)
    }
    this.dispatch('game-update', undefined, true)
  }

  verifyLineComplete(id: number): boolean {
    const line = this.getLineById(id)
    if (line) {
      const first = line.pos[0]
      const last = line.pos[line.pos.length - 1]
      const p1 = this.getPointAt(first)
      const p2 = this.getPointAt(last)
      if (!p1 || !p2 || (first[0] === last[0] && first[1] === last[1])) {
        const idx = this.lines.findIndex((l) => l.id === id)
        if (idx !== -1) this.lines.splice(idx, 1)
        return false
      }
      return true
    }
    return false
  }

  isInBounds([x, y]: vec2): boolean {
    return x >= 0 && x <= this.width && y >= 0 && y <= this.height
  }

  addLineSegment(id: number, [x, y]: vec2, layer: number): { added: boolean; endDrag: boolean } {
    if (!this.isInBounds([x, y])) return { added: false, endDrag: false }

    // Lookup what's at target cell
    const point = this.getPointAt([x, y])
    const linesAtPoint = this.getLinesAtPoint([x, y], (line) => (line.layer === 0))
    const underlineLinesAtPoint = this.getLinesAtPoint([x, y], (line) => line.layer === -1)
    // Terminals accept 1 connection, pads accept 2, empty cells accept 0
    const connectionLimit = point ? (point instanceof Terminal ? 1 : 2) : 0

    let added = false
    let endDrag = false

    // Reject if point is already at connection capacity
    if (point && (linesAtPoint.length + underlineLinesAtPoint.length) >= connectionLimit) {
      return { added, endDrag }
    }

    const line = this.getLineById(id)

    if (line) {
      // --- Extending existing line ---

      // Reject if diagonal would cross another diagonal on same layer
      if (!this.checkDiagonalCrossing(line, [x, y])) {
        return { added, endDrag }
      }

      // Reject self-intersection (exclude last 2 points to preserve backtracking)
      const posCount = line.pos.length
      if (line.pos.some(([px, py], i) => px === x && py === y && i < posCount - 2)) {
        return { added, endDrag }
      }

      const sameLineAtPoint = this.getLinesAtPoint([x, y], (line) => (line.id === id && line.layer === 0))?.[0] || null

      // Empty cell: allow if no foreign line occupies it (or underline layer bypasses)
      if (!point && ((!linesAtPoint.length || sameLineAtPoint) || layer === -1)) {
        added = line.plotSegment([x, y])
      }

      // Reached a pad/terminal: snap to it and end drag (color must be compatible)
      if (point) {
        if (point.color !== 'white' && line.color !== 'white' && point.color !== line.color) {
          return { added: false, endDrag: false }
        }
        added = line.plotSegment([x, y])
        endDrag = true
      }

    } else {
      // --- Starting new line: must begin on a pad or terminal ---

      if (!point) return { added: false, endDrag: false }
      const newLine = new Line(id, [[x, y]], layer)
      newLine.color = point.color
      this.lines.push(newLine)
      added = true

    }

    if (endDrag) {
      this.dispatch('line-end-drag', {id}, true)
    }

    this.dispatch('game-update', undefined, true)
    return { added, endDrag }
  }
}
