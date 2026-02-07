import { Pad } from "./items/pad.js";
import { Terminal, type TerminalColor } from "./items/terminal.js";
import { Line } from "./items/line.js";

export interface PointAt {
  id: number;
  isTerminal: boolean;
}

/**
 * Plotter — position and geometry only.
 * Intersection checks, adding/removing pads, terminals, and lines.
 * No color, propagation, or completion.
 */
export class Plotter {
  getPointAt(
    pads: Pad[],
    terminals: Terminal[],
    x: number,
    y: number,
  ): PointAt | false {
    for (const pad of pads) {
      if (pad.pos[0] === x && pad.pos[1] === y)
        return { id: pad.ID, isTerminal: false };
    }
    for (const term of terminals) {
      if (term.pos[0] === x && term.pos[1] === y)
        return { id: term.ID, isTerminal: true };
    }
    return false;
  }

  getLineCount(lines: Line[], x: number, y: number): number {
    let count = 0;
    for (const line of lines) {
      for (const pos of line.pos) {
        if (pos[0] === x && pos[1] === y && line.layer === 0) count++;
      }
    }
    return count;
  }

  getUnderlineCount(lines: Line[], x: number, y: number): number {
    let count = 0;
    for (const line of lines) {
      for (const pos of line.pos) {
        if (pos[0] === x && pos[1] === y && line.layer === -1) count++;
      }
    }
    return count;
  }

  getLineById(lines: Line[], id: number): Line | undefined {
    return lines.find((l) => l.ID === id);
  }

  checkCrossing(lines: Line[], line: Line, x: number, y: number): boolean {
    const last = line.pos[line.pos.length - 1];
    const mx = (x + last[0]) / 2;
    const my = (y + last[1]) / 2;

    for (const other of lines) {
      if (other.layer !== line.layer) continue;
      const pos = other.pos;
      for (let i = 1; i < pos.length; i++) {
        if (
          Math.abs(pos[i][0] - pos[i - 1][0]) === 1 &&
          Math.abs(pos[i][1] - pos[i - 1][1]) === 1 &&
          (pos[i][0] + pos[i - 1][0]) / 2 === mx &&
          (pos[i][1] + pos[i - 1][1]) / 2 === my
        ) {
          return false;
        }
      }
    }
    return true;
  }

  addPad(
    pads: Pad[],
    terminals: Terminal[],
    id: number,
    x: number,
    y: number,
  ): boolean {
    if (this.getPointAt(pads, terminals, x, y)) return false;
    pads.push(new Pad(id, [x, y]));
    return true;
  }

  addTerminal(
    pads: Pad[],
    terminals: Terminal[],
    id: number,
    x: number,
    y: number,
    color: TerminalColor,
  ): boolean {
    if (this.getPointAt(pads, terminals, x, y)) return false;
    terminals.push(new Terminal(id, [x, y], color));
    return true;
  }

  deletePad(pads: Pad[], x: number, y: number): boolean {
    const idx = pads.findIndex((p) => p.pos[0] === x && p.pos[1] === y);
    if (idx === -1) return false;
    pads.splice(idx, 1);
    return true;
  }

  deleteTerminal(terminals: Terminal[], x: number, y: number): boolean {
    const idx = terminals.findIndex(
      (t) => t.pos[0] === x && t.pos[1] === y,
    );
    if (idx === -1) return false;
    terminals.splice(idx, 1);
    return true;
  }

  deleteLine(lines: Line[], x: number, y: number): boolean {
    const idx = lines.findIndex((l) =>
      l.pos.some(([px, py]) => px === x && py === y),
    );
    if (idx === -1) return false;
    lines.splice(idx, 1);
    return true;
  }

  addLine(
    pads: Pad[],
    terminals: Terminal[],
    lines: Line[],
    lineId: number,
    x: number,
    y: number,
    layer: number,
    shouldEndDrag: (point: PointAt) => boolean,
  ): { added: boolean; endDrag: boolean } {
    const point = this.getPointAt(pads, terminals, x, y);
    const lineCount = this.getLineCount(lines, x, y);
    const connectionLimit = point ? (point.isTerminal ? 1 : 2) : 0;

    if (point && lineCount >= connectionLimit) {
      return { added: false, endDrag: false };
    }

    const line = this.getLineById(lines, lineId);
    if (!line) {
      if (!point) return { added: false, endDrag: false };
      lines.push(new Line(lineId, [x, y], layer));
      return { added: true, endDrag: false };
    }

    if (!this.checkCrossing(lines, line, x, y)) {
      return { added: false, endDrag: false };
    }

    if (!point && (!lineCount || layer === -1)) {
      line.plotSegment(x, y);
      return { added: true, endDrag: false };
    }

    if (point && shouldEndDrag(point)) {
      line.plotSegment(x, y);
      return { added: true, endDrag: true };
    }

    return { added: false, endDrag: false };
  }
}
