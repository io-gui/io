import { TerminalColor } from './terminal.js'

export interface PadData {
  id: number
  pos: [number, number]
}

export class Pad {
  id: number
  pos: [number, number]
  _color: TerminalColor = 'white'

  get color(): TerminalColor {
    return this._color
  }

  set color(color: TerminalColor) {
    this._color = color
  }

  constructor(id: number, pos: [number, number]) {
    this.id = id
    this.pos = pos
  }

  toJSON(): PadData {
    return { pos: this.pos, id: this.id }
  }

  static fromJSON(data: PadData): Pad {
    return new Pad(data.id, data.pos)
  }
}
