export interface PadData {
  ID: number;
  pos: [number, number];
  color: string;
}

export class Pad {
  ID: number;
  pos: [number, number];
  color: string;

  constructor(ID: number, pos: [number, number], color: string) {
    this.ID = ID;
    this.pos = pos;
    this.color = color;
  }

  toJSON(): PadData {
    return { pos: this.pos, color: this.color, ID: this.ID };
  }

  static fromJSON(data: PadData): Pad {
    return new Pad(data.ID, data.pos, data.color);
  }
}
