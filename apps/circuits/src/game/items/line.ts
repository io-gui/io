import { Color, Vector2 } from 'three/webgpu'
import { COLORS } from './colors.js'

export type LineData = [number, number][]

export class Line {
  public pos: Vector2[]
  public renderColor: Color
  public isFinalized: boolean

  constructor(pos: Vector2[], isFinalized: boolean = false) {
    this.pos = pos
    this.renderColor = COLORS.white
    this.isFinalized = isFinalized
  }

  toJSON(): LineData {
    return this.pos.map((point) => [point.x, point.y])
  }

  static fromJSON(data: LineData): Line {
    return new Line(
      data.map((point) => new Vector2(point[0], point[1])),
      true
    )
  }

  get length(): number {
    return this.pos.length
  }

  get firstPt(): Vector2 {
    return this.pos[0]
  }

  get lastPt(): Vector2 {
    return this.pos[this.length - 1]
  }

  get secondLastPt(): Vector2 {
    return this.pos[this.length - 2]
  }

  hasSegmentAt(point: Vector2): boolean {
    for (let i = 1; i < this.length; i++) {
      if (this.pos[i].distanceTo(point) === 0) {
        return true
      }
    }
    return false
  }

  resetColor() {
    this.renderColor = COLORS.white
  }

  finalize() {
    this.isFinalized = true
  }
}
