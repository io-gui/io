/**
 * Line — data class with segment management and validation logic.
 * Rendering is handled centrally by scene.render().
 */

export interface LineData {
  ID: number;
  c: string;
  pos: [number, number][];
  readonly?: boolean;
}

export class Line {
  pos: [number, number][];
  midpos: [number, number][];
  c: string;
  ID: number;
  c2: string;
  isReadonly: boolean;

  constructor(x: number, y: number, c: string, ID: number, c2?: string) {
    this.pos = [[x, y]];
    this.midpos = [];
    this.c = c;
    this.ID = ID;
    this.c2 = c2 ?? c;
    this.isReadonly = false;
  }

  /**
   * Add a grid segment.
   * `allLines` is the full lines map (needed for crossing check).
   * Returns false if the segment was rejected.
   */
  addSegment(x: number, y: number, allLines?: Record<number, Line>): boolean {
    if (!this._checkErase(x, y)) return false;
    if (allLines && !this._checkCrossing(x, y, allLines)) return false;
    if (!this._checkDirection(x, y)) return false;

    // Track diagonal midpoint for crossing detection
    const last = this.pos[this.pos.length - 1];
    if (Math.abs(last[0] - x) === 1 && Math.abs(last[1] - y) === 1) {
      this.midpos.push([(x + last[0]) / 2, (y + last[1]) / 2]);
    }

    this.pos.push([x, y]);
    return true;
  }

  removeLast(): void {
    const ln = this.pos.length;
    if (ln > 1) {
      const a = this.pos[ln - 1];
      const b = this.pos[ln - 2];
      if (Math.abs(a[0] - b[0]) === 1 && Math.abs(a[1] - b[1]) === 1) {
        this.midpos.pop();
      }
    }
    this.pos.pop();
  }

  /** Prevent backtracking over more than one step. */
  private _checkDirection(x: number, y: number): boolean {
    const ln = this.pos.length;
    if (ln > 1) {
      if (y === this.pos[ln - 2][1] && Math.abs(x - this.pos[ln - 2][0]) === 1) return false;
      if (x === this.pos[ln - 2][0] && Math.abs(y - this.pos[ln - 2][1]) === 1) return false;
    }
    const last = this.pos[ln - 1];
    if (Math.abs(last[0] - x) > 1) return false;
    if (Math.abs(last[1] - y) > 1) return false;
    return true;
  }

  /** Erase last segment if user drags back to prev node. */
  private _checkErase(x: number, y: number): boolean {
    const ln = this.pos.length;
    if (ln < 2) return true;
    if (x === this.pos[ln - 2][0] && y === this.pos[ln - 2][1]) {
      this.removeLast();
      return false;
    }
    return true;
  }

  /** Prevent diagonal lines from crossing other diagonals (unless grey). */
  private _checkCrossing(x: number, y: number, allLines: Record<number, Line>): boolean {
    const last = this.pos[this.pos.length - 1];
    const mx = (x + last[0]) / 2;
    const my = (y + last[1]) / 2;
    let collisions = 0;

    for (const id in allLines) {
      for (const mid of allLines[id].midpos) {
        if (mid[0] === mx && mid[1] === my && this.c !== 'grey' && allLines[id].c !== 'grey') {
          collisions++;
        }
      }
    }
    return collisions === 0;
  }
}

/** Deserialise a lines map from saved JSON data. */
export function linesFromString(data: Record<string, LineData>): Record<number, Line> {
  const lines: Record<number, Line> = {};
  for (const i in data) {
    const key = i as unknown as number;
    lines[key] = new Line(0, 0, data[i].c, data[i].ID);
    let first = true;
    for (const j in data[i].pos) {
      if (first) {
        lines[key].pos[0] = [data[i].pos[j][0], data[i].pos[j][1]];
        first = false;
      } else {
        lines[key].addSegment(data[i].pos[j][0], data[i].pos[j][1], lines);
      }
    }
  }
  return lines;
}
