import { ReactiveNode, Register } from "@io-gui/core";
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
@Register
export class Plotter extends ReactiveNode {
  pads: Pad[] = [];
  terminals: Terminal[] = [];
  lines: Line[] = [];

  connect(pads: Pad[], terminals: Terminal[], lines: Line[]) {
    this.pads = pads;
    this.terminals = terminals;
    this.lines = lines;
  }

  getPointAt(x: number, y: number): PointAt | false {
    for (const pad of this.pads) {
      if (pad.pos[0] === x && pad.pos[1] === y)
        return { id: pad.ID, isTerminal: false };
    }
    for (const term of this.terminals) {
      if (term.pos[0] === x && term.pos[1] === y)
        return { id: term.ID, isTerminal: true };
    }
    return false;
  }

  getLineCount(x: number, y: number): number {
    let count = 0;
    for (const line of this.lines) {
      for (const pos of line.pos) {
        if (pos[0] === x && pos[1] === y && line.layer === 0) count++;
      }
    }
    return count;
  }

  getUnderlineCount(x: number, y: number): number {
    let count = 0;
    for (const line of this.lines) {
      for (const pos of line.pos) {
        if (pos[0] === x && pos[1] === y && line.layer === -1) count++;
      }
    }
    return count;
  }

  getLineById(id: number): Line | undefined {
    return this.lines.find((l) => l.ID === id);
  }

  checkCrossing(line: Line, x: number, y: number): boolean {
    const last = line.pos[line.pos.length - 1];
    const mx = (x + last[0]) / 2;
    const my = (y + last[1]) / 2;

    for (const other of this.lines) {
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

  addPad(id: number, x: number, y: number): boolean {
    if (this.getPointAt(x, y)) return false;
    this.pads.push(new Pad(id, [x, y]));
    this.dispatch("game-render", undefined, true);
    return true;
  }

  addTerminal(id: number, x: number, y: number, color: TerminalColor): boolean {
    if (this.getPointAt(x, y)) return false;
    this.terminals.push(new Terminal(id, [x, y], color));
    this.dispatch("game-render", undefined, true);
    return true;
  }

  deletePad(x: number, y: number): boolean {
    const idx = this.pads.findIndex((p) => p.pos[0] === x && p.pos[1] === y);
    if (idx === -1) return false;
    this.pads.splice(idx, 1);
    this.dispatch("game-render", undefined, true);
    return true;
  }

  deleteTerminal(x: number, y: number): boolean {
    const idx = this.terminals.findIndex(
      (t) => t.pos[0] === x && t.pos[1] === y,
    );
    if (idx === -1) return false;
    this.terminals.splice(idx, 1);
    this.dispatch("game-render", undefined, true);
    return true;
  }

  deleteLine(x: number, y: number): boolean {
    const idx = this.lines.findIndex((l) =>
      l.pos.some(([px, py]) => px === x && py === y),
    );
    if (idx === -1) return false;
    this.lines.splice(idx, 1);
    this.dispatch("game-render", undefined, true);
    return true;
  }

  deleteLineById(id: number): boolean {
    const idx = this.lines.findIndex((l) => l.ID === id);
    if (idx === -1) return false;
    this.lines.splice(idx, 1);
    this.dispatch("game-render", undefined, true);
    return true;
  }

  verifyLineComplete(id: number): boolean {
    const line = this.getLineById(id);
    if (line) {
      const first = line.pos[0];
      const last = line.pos[line.pos.length - 1];
      const p1 = this.getPointAt(first[0], first[1]);
      const p2 = this.getPointAt(last[0], last[1]);
      if (!p1 || !p2 || (first[0] === last[0] && first[1] === last[1])) {
        this.deleteLineById(id);
        return false;
      }
      return true;
    }
    return false;
  }

  addLineSegment(id: number, x: number, y: number, layer: number): { added: boolean; endDrag: boolean } {
    const point = this.getPointAt(x, y);
    const lineCount = this.getLineCount(x, y);
    const connectionLimit = point ? (point.isTerminal ? 1 : 2) : 0;

    let added = false;
    let endDrag = false;

    if (point && lineCount >= connectionLimit) {
      return { added, endDrag };
    }

    const line = this.getLineById(id);

    if (line) {

      if (!this.checkCrossing(line, x, y)) {
        return { added, endDrag };
      }
  
      if (!point && (!lineCount || layer === -1)) {
        line.plotSegment(x, y);
        added = true;
      }
  
      if (point) {
        line.plotSegment(x, y);
        added = true;
        endDrag = true;
      }

    } else {

      if (!point) return { added: false, endDrag: false };
      this.lines.push(new Line(id, [x, y], layer));
      added = true;

    }

    this.dispatch("game-render", undefined, true);
    return { added, endDrag };
  }
}
