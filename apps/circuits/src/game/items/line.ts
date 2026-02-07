export interface LineData {
  ID: number;
  pos: [number, number][];
  layer: number;
}

export class Line {
  ID: number;
  pos: [number, number][];
  layer: number;
  constructor(ID: number, pos: [number, number], layer: number) {
    this.ID = ID;
    this.pos = [pos];
    this.layer = layer;
  }

  /**
   * Plot a new segment on the line if direction is valid.
   * Erase last segment if user drags back to prev node.
   * Return true if segment was added, false otherwise.
   */
  plotSegment(x: number, y: number): boolean {
    if (!this._tryEraseLastSegment(x, y)) return false;
    if (!this._tryAddNewSegment(x, y)) return false;
    return true;
  }

  toJSON(): LineData {
    return {
      ID: this.ID,
      pos: this.pos,
      layer: this.layer,
    };
  }

  static fromJSON(data: LineData): Line {
    const line = new Line(data.ID, data.pos[0], data.layer);
    for (let j = 1; j < data.pos.length; j++) {
      line.plotSegment(data.pos[j][0], data.pos[j][1]);
    }
    return line;
  }

  /** Prevent backtracking over more than one step. */
  private _tryAddNewSegment(x: number, y: number): boolean {
    const ln = this.pos.length;
    if (ln > 1) {
      if (y === this.pos[ln - 2][1] && Math.abs(x - this.pos[ln - 2][0]) === 1)
        return false;
      if (x === this.pos[ln - 2][0] && Math.abs(y - this.pos[ln - 2][1]) === 1)
        return false;
    }
    const last = this.pos[ln - 1];
    if (Math.abs(last[0] - x) > 1) return false;
    if (Math.abs(last[1] - y) > 1) return false;

    this.pos.push([x, y]);
    return true;
  }

  /** Erase last segment if user drags back to prev node. */
  private _tryEraseLastSegment(x: number, y: number): boolean {
    const ln = this.pos.length;
    if (ln < 2) return true;
    if (x === this.pos[ln - 2][0] && y === this.pos[ln - 2][1]) {
      this.pos.pop();
      return false;
    }
    return true;
  }
}
