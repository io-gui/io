export const TERMINAL_COLORS = {
  white: '#ffffff',
  red: '#e52800',
  green: '#005923',
  blue: '#06afff',
  pink: '#ef47cc',
  yellow: '#fec41a',
  orange: '#ff6910',
  purple: '#760281',
}

export type TerminalColor = keyof typeof TERMINAL_COLORS

export interface TerminalData {
  id: number
  pos: [number, number]
  color: TerminalColor
}

export class Terminal {
  id: number
  pos: [number, number]
  color: TerminalColor

  constructor(id: number, pos: [number, number], color: TerminalColor) {
    this.id = id
    this.pos = pos
    this.color = color
  }

  toJSON(): TerminalData {
    return { id: this.id, pos: this.pos, color: this.color }
  }

  static fromJSON(data: TerminalData): Terminal {
    return new Terminal(data.id, data.pos, data.color)
  }
}
