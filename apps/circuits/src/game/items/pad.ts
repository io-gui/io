import { Color } from 'three/webgpu'
import { COLORS, type ColorName } from './colors.js'

export interface PadData {
  isTerminal?: boolean
  color?: ColorName
}

export class Pad {
  public isTerminal: boolean
  public color: ColorName | undefined
  public renderColor: Color

  constructor(isTerminal: boolean = false, color?: ColorName) {
    if (isTerminal && color === undefined) console.error('Terminal pad must have a color')
    if (!isTerminal && color !== undefined) console.error('Non-terminal pad cannot have a color')

    this.isTerminal = isTerminal
    this.color = isTerminal ? (color ?? 'red') : undefined
    this.renderColor = this.color ? COLORS[this.color] : COLORS.white
  }

  toJSON(): PadData {
    if (this.isTerminal) {
      debug: if (this.color === undefined) console.error('Terminal pad must have a color')
      return {isTerminal: true, color: this.color}
    } else {
      debug: if (this.color !== undefined) console.error('Non-terminal pad cannot have a color')
      return {isTerminal: false}
    }
  }

  resetColor() {
    this.renderColor = this.color ? COLORS[this.color] : COLORS.white
  }
}
