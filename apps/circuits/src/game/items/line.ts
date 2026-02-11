import { Color, Vector2 } from 'three/webgpu'
import { COLORS } from './colors.js'

const SQRT_2 = Math.sqrt(2)
const _vec2_1 = new Vector2()
const _vec2_2 = new Vector2()

export interface LineData {
  id: number
  pos: [number, number][]
  layer: number
}

export class Line {
  public id: number
  public pos: Vector2[]
  public layer: number
  public renderColor: Color

  constructor(id: number, pos: Vector2[], layer: number) {
    this.id = id
    this.pos = pos
    this.layer = layer
    this.renderColor = COLORS.white
  }

  toJSON(): LineData {
    return {
      id: this.id,
      pos: this.pos.map((point) => [point.x, point.y]),
      layer: this.layer,
    }
  }

  static fromJSON(data: LineData): Line {
    return new Line(
      data.id,
      data.pos.map((point) => new Vector2(point[0], point[1])),
      data.layer,
    )
  }

  hasSegmentAt(point: Vector2): boolean {
    for (let i = 1; i < this.pos.length; i++) {
      if (this.pos[i].distanceTo(point) === 0) {
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
  plotSegment(point: Vector2): boolean {
    if (this._tryEraseLastSegment(point)) return true
    if (this._tryAddNewSegment(point)) return true
    return false
  }

  /**
   * Add segment or, if user went 45° backwards, remove one segment and add a 90° turn.
   * Returns false if nothing was done, true if segment was added.
   */
  private _tryAddNewSegment(point: Vector2): boolean {
    const l = this.pos.length
    const last = this.pos[l - 1]

    // Reject if segment is too long
    if (last.distanceTo(point) > SQRT_2) return false

    // Reroute if user went 45° backwards
    if (l > 1) {
      const secondLast = this.pos[l - 2]
      _vec2_1.copy(last).sub(secondLast)
      _vec2_2.copy(point).sub(last)
      if (_vec2_1.dot(_vec2_2) === -1) {
        this.pos.pop()
        this.pos.push(point.clone())
        return true
      }
    }

    // Add new segment
    this.pos.push(point.clone())
    return true
  }

  /** 
   * Erase last segment if user drags back to prev node.
   * Returns true if segment was erased, false otherwise.
   */
  private _tryEraseLastSegment(point: Vector2): boolean {
    const l = this.pos.length
    if (l < 2) return false
    const secondLast = this.pos[l - 2]
    if (secondLast.distanceTo(point) === 0) {
      this.pos.pop()
      return true
    }
    return false
  }
}
