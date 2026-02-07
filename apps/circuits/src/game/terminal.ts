export interface TerminalData {
  ID: number
  pos: [number, number]
  color: string
}

export class Terminal {
  ID: number
  pos: [number, number]
  color: string

  constructor(ID: number, pos: [number, number], color: string) {
    this.ID = ID
    this.pos = pos
    this.color = color
  }

  toJSON(): TerminalData {
    return { pos: this.pos, color: this.color, ID: this.ID }
  }

  static fromJSON(data: TerminalData): Terminal {
    return new Terminal(data.ID, data.pos, data.color)
  }
}
