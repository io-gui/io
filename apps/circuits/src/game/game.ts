import { Pad } from "./pad.js";
import { Line } from "./line.js";
import type { PadData } from "./pad.js";
import type { LineData } from "./line.js";

export type DrawMode = "pad" | "line" | "delete";

interface LevelData {
  width: number;
  height: number;
  pads: PadData[];
  lines: LineData[];
}

/**
 * Game — central state machine.
 * Manages pads, lines, load/save, undo/redo, colour propagation,
 * and completion checking.
 */
export class Game {
  width = 4;
  height = 5;
  pads: Record<number, Pad> = {};
  lines: Record<number, Line> = {};
  padColors: Record<number, string> = {};
  lineColors: Record<number, string> = {};
  drawMode: DrawMode = "line";
  drawColor = "white";
  undoStack: string[] = [];
  redoStack: string[] = [];
  currentLevel = "";

  /** Callback invoked after save — host element persists state. */
  onSave: ((level: string, json: string) => void) | null = null;
  /** Callback invoked on completion change. */
  onComplete: ((level: string, completed: boolean) => void) | null = null;
  /** Callback invoked when grid dimensions change and scene needs re-init. */
  onInitScene: (() => void) | null = null;
  /** Callback invoked when game state changes and scene needs re-render. */
  onRender: (() => void) | null = null;

  init(): void {
    this.width = 4;
    this.height = 5;
    this.pads = {};
    this.lines = {};
    this.drawMode = "line";
    this.drawColor = "white";
    this._renderScene();
  }

  // -- Level loading --

  load(level: string, savedState?: string): void {
    this.init();
    this.redoStack = [];
    this.undoStack = [];
    this.currentLevel = level;

    if (savedState) {
      this.fromJSON(savedState);
      this.save();
      this.updateUndoStack();
      this.propagateColors();
    } else {
      this.reset(level);
    }
  }

  clear() {
    this.init();
  }

  async reset(level: string): Promise<void> {
    try {
      const resp = await fetch("./public/levels/" + level + ".json");
      if (!resp.ok) throw new Error("Level not found");
      const text = await resp.text();
      this.fromJSON(text);
      for (const i in this.lines) this.lines[i].readonly = true;
      this.save();
      this.updateUndoStack();
      this.propagateColors();
    } catch (e) {
      console.warn("Could not load level:", level, e);
    }
  }

  // -- Serialisation --

  fromJSON(jsonText: string): void {
    const state: LevelData = JSON.parse(jsonText);
    this.width = state.width;
    this.height = state.height;
    this.pads = {};
    for (const p of state.pads) {
      this.pads[p.ID] = Pad.fromJSON(p);
    }
    this.lines = {};
    for (const l of state.lines) {
      this.lines[l.ID] = Line.fromJSON(l);
    }
    this.initScene();
  }

  toJSON(): string {
    return JSON.stringify({
      width: this.width,
      height: this.height,
      pads: this._cleanPads(),
      lines: this._cleanLines(),
    });
  }

  private _cleanPads(): PadData[] {
    return Object.values(this.pads).map(p => p.toJSON());
  }

  private _cleanLines(): LineData[] {
    return Object.values(this.lines).map(l => l.toJSON());
  }

  save(): void {
    if (this.currentLevel && this.onSave) {
      this.onSave(this.currentLevel, this.toJSON());
    }
  }

  // -- Undo / Redo --

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

  // -- Pad operations --

  addPad(ID: number, x: number, y: number, color: string): void {
    if (!this.getPadColor(x, y)) {
      this.pads[ID] = new Pad(ID, [x, y], color);
      this._renderScene();
    }
  }

  deletePad(x: number, y: number): void {
    for (const i in this.pads) {
      if (this.pads[i] && this.pads[i].pos[0] === x && this.pads[i].pos[1] === y) {
        delete this.pads[i];
      }
    }
    this._renderScene();
  }

  getPadColor(x: number, y: number): string | false {
    for (const i in this.pads) {
      if (this.pads[i].pos[0] === x && this.pads[i].pos[1] === y) return this.padColors[this.pads[i].ID] ?? this.pads[i].color;
    }
    return false;
  }

  getPadID(x: number, y: number): number | false {
    for (const i in this.pads) {
      if (this.pads[i].pos[0] === x && this.pads[i].pos[1] === y) return this.pads[i].ID;
    }
    return false;
  }

  // -- Line operations --

  /**
   * Add / extend a line.
   * Returns true if the line reached a destination pad (drag should stop).
   */
  addLine(ID: number, x: number, y: number, color: string): boolean {
    const padID = this.getPadID(x, y);
    const padColor = this.getPadColor(x, y);
    const lineCount = this.getLineCount(x, y);

    // Connection limit: colored pads allow 1, white pads allow 2
    const connectionLimit = (padID !== false && this.pads[padID].color !== "white") ? 1 : 2;
    if (lineCount >= connectionLimit) {
      this._renderScene();
      return false;
    }

    // --- Start a new line from a pad ---
    if (!this.lines[ID]) {
      if (!padColor) { this._renderScene(); return false; }
      this.lines[ID] = new Line(ID, [x, y], color);
      this.lineColors[ID] = padColor as string;
      this._renderScene();
      return false;
    }

    // --- Extend existing line ---
    if (!this._checkCrossing(this.lines[ID], x, y)) {
      this._renderScene();
      return false;
    }

    const lineColor = this.lineColors[ID] ?? this.lines[ID].color;
    let endDrag = false;

    if (!padColor && (!lineCount || color === "grey")) {
      this.lines[ID].addSegment(x, y);
    } else if (
      padColor === "white" ||
      padColor === lineColor ||
      ((lineColor === "white" || lineColor === "grey") && padColor)
    ) {
      this.lines[ID].addSegment(x, y);
      endDrag = true;
    }

    this._renderScene();
    return endDrag;
  }

  getLineColor(x: number, y: number): string | false {
    for (const i in this.lines) {
      for (const pos of this.lines[i].pos) {
        if (pos[0] === x && pos[1] === y) return this.lines[i].color;
      }
    }
    return false;
  }

  getLineCount(x: number, y: number): number {
    let count = 0;
    for (const i in this.lines) {
      for (const pos of this.lines[i].pos) {
        if (pos[0] === x && pos[1] === y && this.lines[i].color === "white")
          count++;
      }
    }
    return count;
  }

  getUnderlineCount(x: number, y: number): number {
    let count = 0;
    for (const i in this.lines) {
      for (const pos of this.lines[i].pos) {
        if (pos[0] === x && pos[1] === y && this.lines[i].color === "grey") count++;
      }
    }
    return count;
  }

  checkLine(ID: number): void {
    if (this.lines[ID]) {
      const first = this.lines[ID].pos[0];
      const last = this.lines[ID].pos[this.lines[ID].pos.length - 1];
      const pc1 = this.getPadColor(first[0], first[1]);
      const pc2 = this.getPadColor(last[0], last[1]);
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
          this._renderScene();
          return;
        }
      }
    }
  }

  /** Prevent diagonal lines from crossing other diagonals (unless grey). */
  private _checkCrossing(line: Line, x: number, y: number): boolean {
    const last = line.pos[line.pos.length - 1];
    const mx = (x + last[0]) / 2;
    const my = (y + last[1]) / 2;

    for (const id in this.lines) {
      const other = this.lines[id];
      if (line.color === "grey" || other.color === "grey") continue;
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

  // -- Colour propagation --

  resetColors(): void {
    this.lineColors = {};
    this.padColors = {};
    for (const i in this.lines) this.lineColors[this.lines[i].ID] = this.lines[i].color;
    for (const i in this.pads) this.padColors[this.pads[i].ID] = this.pads[i].color;
  }

  propagateColors(): void {
    this.resetColors();

    for (let iter = 0; iter < 16; iter++) {
      for (const i in this.lines) {
        const line = this.lines[i];
        const first = line.pos[0];
        const last = line.pos[line.pos.length - 1];

        const pad1ID = this.getPadID(first[0], first[1]);
        const pad2ID = this.getPadID(last[0], last[1]);
        if (pad1ID === false || pad2ID === false) continue;

        const c1 = this.padColors[pad1ID];
        const c2 = this.padColors[pad2ID];

        if (c1 !== "white" && c2 !== "white") {
          if (c1 === c2) this.lineColors[line.ID] = c1;
        } else {
          if (c1 !== "white") {
            this.lineColors[line.ID] = c1;
            this.padColors[pad1ID] = c1;
            this.padColors[pad2ID] = c1;
          } else {
            this.lineColors[line.ID] = c2;
            this.padColors[pad1ID] = c2;
            this.padColors[pad2ID] = c2;
          }
        }
      }
    }

    this._renderScene();
  }

  // -- Completion check --

  checkCompletion(): void {
    let completed = true;

    for (const i in this.pads) {
      const pad = this.pads[i];
      const nConn = this.getLineCount(pad.pos[0], pad.pos[1]);
      const nUnder = this.getUnderlineCount(pad.pos[0], pad.pos[1]);

      if (pad.color !== "white") {
        if (nConn !== 1) completed = false;
      } else {
        const pc = this.padColors[pad.ID] ?? pad.color;
        if (nConn !== 2 && pc !== "white")
          completed = false;
        if (
          nConn !== 1 &&
          nUnder !== 1 &&
          pc !== "white"
        )
          completed = false;
      }
    }


    if (this.onComplete) {
      this.onComplete(this.currentLevel, completed);
    }
  }

  // -- Move finalisation --

  finalizeMove(lineID: number): void {
    this.save();
    this.updateUndoStack();
    this.checkLine(lineID);
    this.propagateColors();
    this.checkCompletion();
  }

  // -- Internal --

  initScene(): void {
    this.onInitScene?.();
  }

  private _renderScene(): void {
    this.onRender?.();
  }
}
