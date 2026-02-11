import { ReactiveNode, Register } from '@io-gui/core'
import { Vector2 } from 'three/webgpu'
import { Pad } from './items/pad.js'
import { COLORS, type ColorName } from './items/colors.js'
import { Line } from './items/line.js'

const SQRT_2 = Math.sqrt(2)

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
  lines: Line[] = []

  connect(pads: Pad[], lines: Line[], width: number, height: number) {
    this.width = width
    this.height = height
    this.pads = pads
    this.lines = lines
  }

  getPointAt(point: Vector2): Pad | undefined {
    const x = point.x
    const y = point.y
    for (const pad of this.pads) {
      if (pad.pos.x === x && pad.pos.y === y)
        return pad
    }
  }

  getLinesAtPoint(point: Vector2, filter?: (line: Line) => boolean): Line[] {
    const x = point.x
    const y = point.y
    const lines = []
    for (const line of this.lines) {
      if (line.pos.some((linePoint) => linePoint.x === x && linePoint.y === y) && (filter?.(line) ?? true)) {
        lines.push(line)
      }
    }
    return lines
  }

  getLineById(id: number): Line | undefined {
    return this.lines.find((l) => l.id === id)
  }

  checkDiagonalCrossing(line: Line, point: Vector2, lastPoint: Vector2): boolean {
    for (const other of this.lines) {
      if (other.layer !== line.layer) continue
      if (
        other.hasSegmentAt(new Vector2(point.x, lastPoint.y)) &&
        other.hasSegmentAt(new Vector2(lastPoint.x, point.y))
      ) return false
    }
    return true
  }

  addPad(point: Vector2, color?: ColorName, isTerminal: boolean = false): boolean {
    if (this.getPointAt(point)) return false
    this.pads.push(
      new Pad(new Vector2(point.x, point.y), isTerminal, color)
    )
    this.dispatch('game-update', undefined, true)
    return true
  }

  delete(point: Vector2) {
    const x = point.x
    const y = point.y
    const padIdx = this.pads.findIndex((p) => p.pos.x === x && p.pos.y === y)
    if (padIdx !== -1) {
      this.pads.splice(padIdx, 1)
    }
    const lineIdx = this.lines.findIndex((l) =>
      l.pos.some((linePoint) => linePoint.x === x && linePoint.y === y),
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
      if (!p1 || !p2 || (first.x === last.x && first.y === last.y)) {
        const idx = this.lines.findIndex((l) => l.id === id)
        if (idx !== -1) this.lines.splice(idx, 1)
        return false
      }
      return true
    }
    return false
  }

  isInBounds(point: Vector2): boolean {
    const x = point.x
    const y = point.y
    return x >= 0 && x <= this.width && y >= 0 && y <= this.height
  }

  addLineSegment(id: number, point: Vector2, layer: number): { added: boolean; endDrag: boolean } {
    if (!this.isInBounds(point)) return { added: false, endDrag: false }
    const x = point.x
    const y = point.y

    // Lookup what's at target cell
    const padAtPoint = this.getPointAt(point)
    const linesAtPoint = this.getLinesAtPoint(point, (line) => (line.layer === 0))
    const underlineLinesAtPoint = this.getLinesAtPoint(point, (line) => line.layer === -1)
    // Terminal pads accept 1 connection, normal pads accept 2, empty cells accept 0
    const connectionLimit = padAtPoint ? (padAtPoint.isTerminal ? 1 : 2) : 0

    let added = false
    let endDrag = false

    // Reject if point is already at connection capacity
    if (padAtPoint && (linesAtPoint.length + underlineLinesAtPoint.length) >= connectionLimit) {
      return { added, endDrag }
    }

    const line = this.getLineById(id)

    if (line) {
      // --- Extending existing line ---

      // Reject if diagonal would cross another diagonal on same layer
      const lastPoint = line.pos[line.pos.length - 1]
      if (point.distanceTo(lastPoint) === SQRT_2) {
        if (!this.checkDiagonalCrossing(line, point, lastPoint)) {
          return { added, endDrag }
        }
      }

      // Reject self-intersection (exclude last 2 points to preserve backtracking)
      const posCount = line.pos.length
      if (line.pos.some((linePoint, i) => linePoint.x === x && linePoint.y === y && i < posCount - 2)) {
        return { added, endDrag }
      }

      const sameLineAtPoint = this.getLinesAtPoint(point, (line) => (line.id === id && line.layer === 0))?.[0] || null

      // Empty cell: allow if no foreign line occupies it (or underline layer bypasses)
      if (!padAtPoint && ((!linesAtPoint.length || sameLineAtPoint) || layer === -1)) {
        added = line.plotSegment(point)
      }

      // Reached a pad/terminal: snap to it and end drag (color must be compatible)
      if (padAtPoint) {
        if (padAtPoint.renderColor !== COLORS.white && line.renderColor !== COLORS.white && padAtPoint.renderColor !== line.renderColor) {
          return { added: false, endDrag: false }
        }
        added = line.plotSegment(point)
        endDrag = true
      }

    } else {
      // --- Starting new line: must begin on a pad or terminal ---

      if (!padAtPoint) return { added: false, endDrag: false }
      const newLine = new Line(id, [new Vector2(x, y)], layer)
      newLine.renderColor = padAtPoint.renderColor
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
