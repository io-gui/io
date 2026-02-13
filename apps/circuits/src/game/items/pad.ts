import { Color } from 'three/webgpu'
import { COLORS, type ColorName } from './colors.js'

export interface PadData {
  color?: ColorName
}

export class Pad {
  public color: ColorName | undefined
  public isTerminal: boolean
  public renderColor: Color

  constructor(color?: ColorName) {
    this.color = color
    this.isTerminal = color !== undefined
    this.renderColor = this.color ? COLORS[this.color] : COLORS.white
  }

  toJSON(): PadData {
    if (this.isTerminal) {
      debug: if (this.color === undefined) console.error('Terminal pad must have a color')
      return {color: this.color}
    } else {
      debug: if (this.color !== undefined) console.error('Non-terminal pad cannot have a color')
      return {}
    }
  }

  resetColor() {
    this.renderColor = this.color ? COLORS[this.color] : COLORS.white
  }
}
