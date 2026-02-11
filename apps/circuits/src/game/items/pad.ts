import { TerminalColor } from './terminal.js'

type vec2 = [number, number]

export interface PadData {
  id: number
  pos: vec2
}

export class Pad {
  public id: number
  public pos: vec2
  private _color: TerminalColor = 'white'

  get color(): TerminalColor {
    return this._color
  }

  set color(color: TerminalColor) {
    this._color = color
  }

  constructor(id: number, pos: vec2) {
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
