import { Pin, pinsFromString } from './pin';
import { Line, linesFromString } from './line';
import type { PinData } from './pin';
import type { LineData } from './line';
import scene from './scene';
import local from '../app/local';
import score from './score';

export type DrawMode = 'pin' | 'line' | 'delete';

interface LevelData {
  width: number;
  height: number;
  pins: Record<string, PinData>;
  lines: Record<string, LineData>;
}

/**
 * Game — central state machine.
 * Manages pins, lines, load/save, undo/redo, colour propagation,
 * and completion checking.
 */
export class Game {
  width = 4;
  height = 5;
  pins: Record<number, Pin> = {};
  lines: Record<number, Line> = {};
  drawMode: DrawMode = 'line';
  drawColor = 'white';
  undoStack: string[] = [];
  redoStack: string[] = [];

  init(): void {
    this.width = 4;
    this.height = 5;
    this.pins = {};
    this.lines = {};
    this.drawMode = 'line';
    this.drawColor = 'white';
    scene.initGrid(this.width, this.height);
    scene.render(this.pins, this.lines);
  }

  // ── Level loading ─────────────────────────────────────────────────

  load(level: string): void {
    this.init();
    this.redoStack = [];
    this.undoStack = [];
    local.set('currentLevel', level);

    const localLevel = local.get(level);
    if (localLevel) {
      this.fromJSON(String(localLevel));
      this.save();
      this.updateUndoStack();
      this.propagateColors();
    } else {
      this.reset(level);
    }
  }

  async reset(level: string): Promise<void> {
    try {
      const resp = await fetch('/levels/' + level + '.json');
      if (!resp.ok) throw new Error('Level not found');
      const text = await resp.text();
      this.fromJSON(text);
      for (const i in this.pins)  this.pins[i].isReadonly = true;
      for (const i in this.lines) this.lines[i].isReadonly = true;
      this.save();
      this.updateUndoStack();
      this.propagateColors();
    } catch (e) {
      console.warn('Could not load level:', level, e);
    }
  }

  // ── Serialisation ─────────────────────────────────────────────────

  fromJSON(jsonText: string): void {
    const state: LevelData = JSON.parse(jsonText);
    this.width = state.width;
    this.height = state.height;
    this.pins = pinsFromString(state.pins);
    this.lines = linesFromString(state.lines);
    scene.initGrid(this.width, this.height);
    scene.render(this.pins, this.lines);
  }

  toJSON(): string {
    return JSON.stringify({
      width:  this.width,
      height: this.height,
      pins:   this._cleanPins(),
      lines:  this._cleanLines(),
    });
  }

  private _cleanPins(): Record<string, PinData> {
    const out: Record<string, PinData> = {};
    for (const i in this.pins) {
      const p = this.pins[i];
      out[i] = { x: p.x, y: p.y, c: p.c, readonly: p.isReadonly, ID: p.ID };
    }
    return out;
  }

  private _cleanLines(): Record<string, LineData> {
    const out: Record<string, LineData> = {};
    for (const i in this.lines) {
      const l = this.lines[i];
      out[i] = { ID: l.ID, c: l.c, pos: l.pos };
    }
    return out;
  }

  save(): void {
    const currentLevel = local.get('currentLevel');
    if (currentLevel) localStorage[String(currentLevel)] = this.toJSON();
  }

  // ── Undo / Redo ───────────────────────────────────────────────────

  updateUndoStack(): void {
    const state = this.toJSON();
    if (state !== this.undoStack[this.undoStack.length - 1]) {
      this.undoStack.push(state);
    }
  }

  undo(): void {
    if (this.undoStack.length > 1) {
      this.fromJSON(this.undoStack[this.undoStack.length - 2]);
      this.redoStack.push(this.undoStack.pop()!);
      this.save();
      this.propagateColors();
      this.checkCompletion();
    }
  }

  redo(): void {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop()!;
      this.fromJSON(state);
      this.undoStack.push(state);
      this.save();
      this.propagateColors();
      this.checkCompletion();
    }
  }

  // ── Pin operations ────────────────────────────────────────────────

  addPin(x: number, y: number, c: string, ID: number): void {
    if (!this.getPinColor(x, y)) {
      this.pins[ID] = new Pin(x, y, c, ID);
      scene.render(this.pins, this.lines);
    }
  }

  deletePin(x: number, y: number): void {
    for (const i in this.pins) {
      if (this.pins[i] && this.pins[i].x === x && this.pins[i].y === y) {
        delete this.pins[i];
      }
    }
    scene.render(this.pins, this.lines);
  }

  getPinColor(x: number, y: number): string | false {
    for (const i in this.pins) {
      if (this.pins[i].x === x && this.pins[i].y === y) return this.pins[i].c2;
    }
    return false;
  }

  getPinID(x: number, y: number): number | false {
    for (const i in this.pins) {
      if (this.pins[i].x === x && this.pins[i].y === y) return this.pins[i].ID;
    }
    return false;
  }

  // ── Line operations ───────────────────────────────────────────────

  /**
   * Add / extend a line.
   * Returns true if the line reached a destination pin (drag should stop).
   */
  addLine(x: number, y: number, c: string, ID: number): boolean {
    const pinID = this.getPinID(x, y);
    const pinColor = this.getPinColor(x, y);
    const lineCount = this.getLineCount(x, y);
    let endDrag = false;

    let connectionLimit = 2;
    if (pinID !== false && this.pins[pinID].c !== 'white') {
      connectionLimit = 1;
    }

    if (lineCount < connectionLimit) {
      if (!this.lines[ID] && pinColor) {
        // Start a new line from a pin
        this.lines[ID] = new Line(x, y, c, ID, pinColor);
      } else if (this.lines[ID]) {
        const lineColor = this.lines[ID].c2;

        if (!pinColor && (!lineCount || c === 'grey')) {
          this.lines[ID].addSegment(x, y, this.lines);
        } else if (
          pinColor === 'white' ||
          pinColor === lineColor ||
          ((lineColor === 'white' || lineColor === 'grey') && pinColor)
        ) {
          this.lines[ID].addSegment(x, y, this.lines);
          endDrag = true;
        }
      }
    }

    scene.render(this.pins, this.lines);
    return endDrag;
  }

  getLineColor(x: number, y: number): string | false {
    for (const i in this.lines) {
      for (const pos of this.lines[i].pos) {
        if (pos[0] === x && pos[1] === y) return this.lines[i].c;
      }
    }
    return false;
  }

  getLineCount(x: number, y: number): number {
    let count = 0;
    for (const i in this.lines) {
      for (const pos of this.lines[i].pos) {
        if (pos[0] === x && pos[1] === y && this.lines[i].c === 'white') count++;
      }
    }
    return count;
  }

  getUnderlineCount(x: number, y: number): number {
    let count = 0;
    for (const i in this.lines) {
      for (const pos of this.lines[i].pos) {
        if (pos[0] === x && pos[1] === y && this.lines[i].c === 'grey') count++;
      }
    }
    return count;
  }

  checkLine(ID: number): void {
    if (this.lines[ID]) {
      const first = this.lines[ID].pos[0];
      const last  = this.lines[ID].pos[this.lines[ID].pos.length - 1];
      const pc1 = this.getPinColor(first[0], first[1]);
      const pc2 = this.getPinColor(last[0], last[1]);
      if (!pc1 || !pc2 || (first[0] === last[0] && first[1] === last[1])) {
        this.undo();
      }
      this.redoStack = [];
    }
  }

  deleteLine(x: number, y: number): void {
    for (const i in this.lines) {
      for (const pos of this.lines[i].pos) {
        if (pos[0] === x && pos[1] === y) {
          delete this.lines[i];
          scene.render(this.pins, this.lines);
          return;
        }
      }
    }
  }

  // ── Colour propagation ────────────────────────────────────────────

  resetColors(): void {
    for (const i in this.lines) this.lines[i].c2 = this.lines[i].c;
    for (const i in this.pins)  this.pins[i].c2 = this.pins[i].c;
  }

  propagateColors(): void {
    this.resetColors();

    for (let iter = 0; iter < 16; iter++) {
      for (const i in this.lines) {
        const line = this.lines[i];
        const first = line.pos[0];
        const last  = line.pos[line.pos.length - 1];

        const pin1ID = this.getPinID(first[0], first[1]);
        const pin2ID = this.getPinID(last[0], last[1]);
        if (pin1ID === false || pin2ID === false) continue;

        const c1 = this.pins[pin1ID].c2;
        const c2 = this.pins[pin2ID].c2;

        if (c1 !== 'white' && c2 !== 'white') {
          if (c1 === c2) line.c2 = c1;
        } else {
          if (c1 !== 'white') {
            line.c2 = c1;
            this.pins[pin1ID].c2 = c1;
            this.pins[pin2ID].c2 = c1;
          } else {
            line.c2 = c2;
            this.pins[pin1ID].c2 = c2;
            this.pins[pin2ID].c2 = c2;
          }
        }
      }
    }

    scene.render(this.pins, this.lines);
  }

  // ── Completion check ──────────────────────────────────────────────

  checkCompletion(): void {
    let completed = true;

    for (const i in this.pins) {
      const pin = this.pins[i];
      const nConn  = this.getLineCount(pin.x, pin.y);
      const nUnder = this.getUnderlineCount(pin.x, pin.y);

      if (pin.isReadonly) {
        if (nConn !== 1 && pin.c !== 'white') completed = false;
      } else {
        if (nConn !== 2 && pin.c === 'white' && pin.c2 !== 'white') completed = false;
        if (nConn !== 1 && nUnder !== 1 && pin.c === 'white' && pin.c2 !== 'white') completed = false;
      }
    }

    const currentLevel = String(local.get('currentLevel') ?? '');
    if (completed) {
      score.set(currentLevel, true);
      console.log(currentLevel, 'completed!');
    } else {
      score.set(currentLevel, false);
    }
  }
}

const game = new Game();
export default game;
