import { ReactiveNode, Register } from '@io-gui/core'
import { Vector2 } from 'three/webgpu'
import { COLORS } from './items/colors.js'
import { Line } from './items/line.js'
import { Pads } from './pads.js'

const SQRT_2 = Math.sqrt(2)
const _vec2_1 = new Vector2()
const _vec2_2 = new Vector2()

/**
 * Plotter — position and geometry only.
 * Intersection checks, adding/removing pads, terminals, and lines.
 * No color, propagation, or completion.
 */
@Register
export class Plotter extends ReactiveNode {
  width = 0
  height = 0
  pads: Pads = new Pads(0, 0)
  lines: Line[] = []

  connect(pads: Pads, lines: Line[], width: number, height: number) {
    this.width = width
    this.height = height
    this.pads = pads
    this.lines = lines
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

  /**
   * Plot a new segment on the line if direction is valid.
   * Erase last segment if user drags back to prev node.
   * Return true if segment was added, false otherwise.
   */
  private _plotSegment(line: Line, point: Vector2): boolean {
    if (this._tryEraseLastSegment(line, point)) return true
    if (this._tryAddNewSegment(line, point)) return true
    return false
  }

  /**
   * Add segment or, if user went 45° backwards, remove one segment and add a 90° turn.
   * Returns false if nothing was done, true if segment was added.
   */
  private _tryAddNewSegment(line: Line, point: Vector2): boolean {
    // Reject if segment is too long
    if (line.lastPt.distanceTo(point) > SQRT_2) return false

    // Reroute if user went 45° backwards
    if (line.secondLastPt) {
      _vec2_1.copy(line.lastPt).sub(line.secondLastPt)
      _vec2_2.copy(point).sub(line.lastPt)
      if (_vec2_1.dot(_vec2_2) === -1) {
        line.pos.pop()
        line.pos.push(point.clone())
        return true
      }
    }

    // Add new segment
    line.pos.push(point.clone())
    return true
  }

  /**
   * Erase last segment if user drags back to prev node.
   * Returns true if segment was erased, false otherwise.
   */
  private _tryEraseLastSegment(line: Line, point: Vector2): boolean {
    if (!line.secondLastPt) return false
    if (line.secondLastPt.distanceTo(point) === 0) {
      line.pos.pop()
      return true
    }
    return false
  }

  delete(point: Vector2) {
    const x = point.x
    const y = point.y
    const lineIdx = this.lines.findIndex((l) =>
      l.pos.some((linePoint) => linePoint.x === x && linePoint.y === y),
    )
    if (lineIdx !== -1) {
      this.lines.splice(lineIdx, 1)
    }
    this.dispatch('game-update', undefined, true)
  }

  finalizeLine(): boolean {
    const line = this.lines[this.lines.length - 1]
    const complete = this.isLineComplete(line)
    if (!complete) this.lines.pop()
    return complete
  }

  private isLineComplete(line: Line): boolean {
    const first = line.pos[0]
    const last = line.lastPt
    const p1 = this.pads.getAt(first.x, first.y)
    const p2 = this.pads.getAt(last.x, last.y)
    return Boolean(p1 && p2 && (first.x !== last.x || first.y !== last.y))
  }

  isInBounds(point: Vector2): boolean {
    const x = point.x
    const y = point.y
    return x >= 0 && x < this.width && y >= 0 && y < this.height
  }

  addLineSegment(point: Vector2, layer: number): { added: boolean; endDrag: boolean } {
    if (!this.isInBounds(point)) return { added: false, endDrag: false }
    const x = point.x
    const y = point.y

    // Lookup what's at target cell
    const padAtPoint = this.pads.getAt(point.x, point.y)
    const linesAtPoint = this.getLinesAtPoint(point, (line) => (line.layer === 1))
    const underlineLinesAtPoint = this.getLinesAtPoint(point, (line) => line.layer === 0)
    // Terminal pads accept 1 connection, normal pads accept 2, empty cells accept 0
    const connectionLimit = padAtPoint ? (padAtPoint.isTerminal ? 1 : 2) : 0

    let added = false
    let endDrag = false

    // Reject if point is already at connection capacity
    if (padAtPoint && (linesAtPoint.length + underlineLinesAtPoint.length) >= connectionLimit) {
      return { added, endDrag }
    }

    const lastLine = this.lines[this.lines.length - 1]
    const line = lastLine && !this.isLineComplete(lastLine) ? lastLine : undefined

    if (line) {
      // --- Extending existing line ---

      // Reject if diagonal would cross another diagonal on same layer
      const lastPoint = line.lastPt
      if (point.distanceTo(lastPoint) === SQRT_2) {
        if (!this.checkDiagonalCrossing(line, point, lastPoint)) {
          return { added, endDrag }
        }
      }

      // Reject self-intersection (exclude last 2 points to preserve backtracking)
      const posCount = line.length
      if (line.pos.some((linePoint, i) => linePoint.x === x && linePoint.y === y && i < posCount - 2)) {
        return { added, endDrag }
      }

      const sameLineAtPoint = this.getLinesAtPoint(point, (otherline) => (otherline === line && line.layer === 1))?.[0] || null

      // Empty cell: allow if no foreign line occupies it (or underline layer bypasses)
      if (!padAtPoint && ((!linesAtPoint.length || sameLineAtPoint) || layer === 0)) {
        added = this._plotSegment(line, point)
      }

      // Reached a pad/terminal: snap to it and end drag (color must be compatible)
      if (padAtPoint) {
        if (padAtPoint.renderColor !== COLORS.white && line.renderColor !== COLORS.white && padAtPoint.renderColor !== line.renderColor) {
          return { added: false, endDrag: false }
        }
        added = this._plotSegment(line, point)
        endDrag = true
      }

    } else {
      // --- Starting new line: must begin on a pad or terminal ---

      if (!padAtPoint) return { added: false, endDrag: false }
      const newLine = new Line([new Vector2(x, y)], layer)
      newLine.renderColor = padAtPoint.renderColor
      this.lines.push(newLine)
      added = true

    }

    if (endDrag) {
      this.dispatch('line-end-drag', undefined, true)
    }

    this.dispatch('game-update', undefined, true)
    return { added, endDrag }
  }
}
