import { Color, Vector2 } from 'three/webgpu'
import { COLORS } from './colors.js'

export interface LineData {
  pos: [number, number][]
  layer: number
}

export class Line {
  public pos: Vector2[]
  public layer: number
  public renderColor: Color

  constructor(pos: Vector2[], layer: number) {
    this.pos = pos
    this.layer = layer
    this.renderColor = COLORS.white
  }

  toJSON(): LineData {
    return {
      pos: this.pos.map((point) => [point.x, point.y]),
      layer: this.layer,
    }
  }

  static fromJSON(data: LineData): Line {
    return new Line(
      data.pos.map((point) => new Vector2(point[0], point[1])),
      data.layer,
    )
  }

  get length(): number {
    return this.pos.length
  }

  get last(): Vector2 {
    return this.pos[this.length - 1]
  }

  get secondLast(): Vector2 {
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
}
