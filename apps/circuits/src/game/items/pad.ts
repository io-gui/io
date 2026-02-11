import { Color, Vector2 } from 'three/webgpu'
import { COLORS, type ColorName } from './colors.js'

export interface PadData {
  pos: [number, number]
  isTerminal?: boolean
  color?: ColorName
}

export class Pad {
  public pos: Vector2
  public isTerminal: boolean
  public color: ColorName | undefined
  public renderColor: Color

  constructor(pos: Vector2, isTerminal: boolean = false, color?: ColorName) {
    if (isTerminal && color === undefined) console.error('Terminal pad must have a color')
    if (!isTerminal && color !== undefined) console.error('Non-terminal pad cannot have a color')

    this.pos = pos
    this.isTerminal = isTerminal
    this.color = isTerminal ? (color ?? 'red') : undefined
    this.renderColor = this.color ? COLORS[this.color] : COLORS.white
  }

  toJSON(): PadData {
    if (this.isTerminal) {
      debug: if (this.color === undefined) console.error('Terminal pad must have a color')
      return { pos: [this.pos.x, this.pos.y], isTerminal: this.isTerminal, color: this.color }
    } else {
      debug: if (this.color !== undefined) console.error('Non-terminal pad cannot have a color')
      return { pos: [this.pos.x, this.pos.y] }
    }
  }

  static fromJSON(data: PadData): Pad {
    return new Pad(new Vector2(data.pos[0], data.pos[1]), data.isTerminal, data.color)
  }
}
