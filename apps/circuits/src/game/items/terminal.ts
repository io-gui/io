export const TERMINAL_COLORS = {
  white: "#ffffff",
  red: "#e52800",
  green: "#005923",
  blue: "#06afff",
  pink: "#ef47cc",
  yellow: "#fec41a",
  orange: "#ff6910",
  purple: "#760281",
  brown: "#820419",
  grey: "#555555",
  black: "#222222",
};

export type TerminalColor = keyof typeof TERMINAL_COLORS;

export interface TerminalData {
  ID: number;
  pos: [number, number];
  color: TerminalColor;
}

export class Terminal {
  ID: number;
  pos: [number, number];
  color: TerminalColor;

  constructor(ID: number, pos: [number, number], color: TerminalColor) {
    this.ID = ID;
    this.pos = pos;
    this.color = color;
  }

  toJSON(): TerminalData {
    return { ID: this.ID, pos: this.pos, color: this.color };
  }

  static fromJSON(data: TerminalData): Terminal {
    return new Terminal(data.ID, data.pos, data.color);
  }
}
