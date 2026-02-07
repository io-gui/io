export interface PadData {
  ID: number
  pos: [number, number]
}

export class Pad {
  ID: number
  pos: [number, number]

  constructor(ID: number, pos: [number, number]) {
    this.ID = ID
    this.pos = pos
  }

  toJSON(): PadData {
    return { pos: this.pos, ID: this.ID }
  }

  static fromJSON(data: PadData): Pad {
    return new Pad(data.ID, data.pos)
  }
}
