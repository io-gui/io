import { TerminalColor } from './terminal.js'

export interface LineData {
  id: number
  pos: [number, number][]
  layer: number
}

export class Line {
  public id: number
  public pos: [number, number][]
  public layer: number
  private _color: TerminalColor = 'white'

  get color(): TerminalColor {
    return this._color
  }

  set color(color: TerminalColor) {
    this._color = color
  }

  constructor(id: number, pos: [number, number][], layer: number) {
    this.id = id
    this.pos = pos
    this.layer = layer
  }

  toJSON(): LineData {
    return {
      id: this.id,
      pos: this.pos,
      layer: this.layer,
    }
  }

  static fromJSON(data: LineData): Line {
    return new Line(data.id, data.pos, data.layer)
  }

  hasDiagonalSegmentAt(mx: number, my: number): boolean {
    const pos = this.pos
    for (let i = 1; i < pos.length; i++) {
      const ax = pos[i - 1][0]
      const ay = pos[i - 1][1]
      const bx = pos[i][0]
      const by = pos[i][1]
      if (
        Math.abs(bx - ax) === 1 && Math.abs(by - ay) === 1 &&
        (ax + bx) / 2 === mx && (ay + by) / 2 === my
      ) {
        return true
      }
    }
    return false
  }

  /**
   * Plot a new segment on the line if direction is valid.
   * Erase last segment if user drags back to prev node.
   * Return true if segment was added, false otherwise.
   */
  plotSegment(x: number, y: number): boolean {
    if (this._tryEraseLastSegment(x, y)) return true
    if (this._tryAddNewSegment(x, y)) return true
    return false
  }

  /**
   * Add segment or, if user went 45° backwards, remove one segment and add a 90° turn.
   * Returns true if nothing was done, false if path was updated.
   */
  private _tryAddNewSegment(x: number, y: number): boolean {
    const ln = this.pos.length
    if (ln > 1) {
      if (y === this.pos[ln - 2][1] && Math.abs(x - this.pos[ln - 2][0]) === 1) {
        this.pos.pop()
        this.pos.push([x, y])
        return false
      }
      if (x === this.pos[ln - 2][0] && Math.abs(y - this.pos[ln - 2][1]) === 1) {
        this.pos.pop()
        this.pos.push([x, y])
        return false
      }
    }
    const last = this.pos[ln - 1]
    if (Math.abs(last[0] - x) > 1) return true
    if (Math.abs(last[1] - y) > 1) return true

    this.pos.push([x, y])
    return false
  }

  /** Erase last segment if user drags back to prev node. */
  private _tryEraseLastSegment(x: number, y: number): boolean {
    const ln = this.pos.length
    if (ln < 2) return false
    if (x === this.pos[ln - 2][0] && y === this.pos[ln - 2][1]) {
      this.pos.pop()
      return true
    }
    return false
  }
}
