import { Register, ReactiveNode } from "@io-gui/core";
import { Pad, type PadData } from "./items/pad.js";
import {
  Terminal,
  type TerminalData,
  type TerminalColor,
} from "./items/terminal.js";
import { Line, type LineData } from "./items/line.js";
import { Plotter } from "./plotter.js";

export type DrawMode = "pad" | "terminal" | "line" | "delete";

interface LevelData {
  width: number;
  height: number;
  pads: PadData[];
  terminals: TerminalData[];
  lines: LineData[];
}

/**
 * Game — central state machine.
 * Manages pads, lines, load/save, undo/redo, colour propagation,
 * and completion checking.
 */
@Register
export class Game extends ReactiveNode {
  width = 4;
  height = 5;
  pads: Pad[] = [];
  terminals: Terminal[] = [];
  lines: Line[] = [];
  private plotter = new Plotter();
  padColors: Record<number, TerminalColor> = {};
  terminalColors: Record<number, TerminalColor> = {};
  lineColors: Record<number, TerminalColor> = {};
  drawMode: DrawMode = "line";
  drawColor: TerminalColor = "white";
  drawLayer = 0;
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
    this.pads = [];
    this.terminals = [];
    this.lines = [];
    this.drawMode = "line";
    this.drawColor = "white";
    this.drawLayer = 0;
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
      void this.reset(level);
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
    this.pads = state.pads.map((p) => Pad.fromJSON(p));
    this.terminals = state.terminals.map((t) => Terminal.fromJSON(t));
    this.lines = state.lines.map((l) => Line.fromJSON(l as LineData));
    this.initScene();
  }

  toJSON(): string {
    return JSON.stringify({
      width: this.width,
      height: this.height,
      pads: this.pads.map((p) => p.toJSON()),
      terminals: this.terminals.map((t) => t.toJSON()),
      lines: this.lines.map((l) => l.toJSON()),
    });
  }

  private _getLineById(id: number): Line | undefined {
    return this.plotter.getLineById(this.lines, id);
  }

  private _getTerminalById(id: number): Terminal | undefined {
    return this.terminals.find((t) => t.ID === id);
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

  getPointAt(
    x: number,
    y: number,
  ): { id: number; color: string; isTerminal: boolean } | false {
    const point = this.plotter.getPointAt(this.pads, this.terminals, x, y);
    if (!point) return false;
    const color = point.isTerminal
      ? (this.terminalColors[point.id] ??
        this._getTerminalById(point.id)?.color ??
        "white")
      : (this.padColors[point.id] ?? "white");
    return { id: point.id, color, isTerminal: point.isTerminal };
  }

  // -- Pad operations --

  addPad(ID: number, x: number, y: number): void {
    if (this.plotter.addPad(this.pads, this.terminals, ID, x, y)) {
      this._renderScene();
    }
  }

  addTerminal(ID: number, x: number, y: number, color: TerminalColor): void {
    if (this.plotter.addTerminal(this.pads, this.terminals, ID, x, y, color)) {
      this._renderScene();
    }
  }

  deletePad(x: number, y: number): void {
    if (this.plotter.deletePad(this.pads, x, y)) this._renderScene();
  }

  deleteTerminal(x: number, y: number): void {
    if (this.plotter.deleteTerminal(this.terminals, x, y)) this._renderScene();
  }

  // -- Line operations --

  /**
   * Add / extend a line.
   * Returns true if the line reached a destination pad or terminal (drag should stop).
   */
  addLine(ID: number, x: number, y: number, layer: number): boolean {
    const point = this.getPointAt(x, y);
    const pointColor = point ? point.color : false;
    const line = this._getLineById(ID);
    const lineColor =
      line && (this.lineColors[ID] ?? (line.layer === 0 ? "white" : "grey"));

    const shouldEndDrag = (p: { id: number; isTerminal: boolean }) => {
      const c = p.isTerminal
        ? (this.terminalColors[p.id] ??
          this._getTerminalById(p.id)?.color ??
          "white")
        : (this.padColors[p.id] ?? "white");
      return (
        c === "white" ||
        c === lineColor ||
        ((lineColor === "white" || lineColor === "grey") && !!c)
      );
    };

    const result = this.plotter.addLine( this.pads, this.terminals, this.lines, ID, x, y, layer, shouldEndDrag );

    if (result.added && !line) {
      this.lineColors[ID] =
        layer === 0 ? (pointColor as TerminalColor) : ("grey" as TerminalColor);
    }

    this._renderScene();
    return result.endDrag;
  }

  getLineColor(x: number, y: number): string | false {
    for (const line of this.lines) {
      for (const pos of line.pos) {
        if (pos[0] === x && pos[1] === y)
          return (
            this.lineColors[line.ID] ?? (line.layer === 0 ? "white" : "grey")
          );
      }
    }
    return false;
  }

  getLineCount(x: number, y: number): number {
    return this.plotter.getLineCount(this.lines, x, y);
  }

  getUnderlineCount(x: number, y: number): number {
    return this.plotter.getUnderlineCount(this.lines, x, y);
  }

  checkLine(ID: number): void {
    const line = this._getLineById(ID);
    if (line) {
      const first = line.pos[0];
      const last = line.pos[line.pos.length - 1];
      const p1 = this.getPointAt(first[0], first[1]);
      const p2 = this.getPointAt(last[0], last[1]);
      if (!p1 || !p2 || (first[0] === last[0] && first[1] === last[1])) {
        this.undo();
      }
      this.redoStack = [];
    }
  }

  deleteLine(x: number, y: number): void {
    if (this.plotter.deleteLine(this.lines, x, y)) this._renderScene();
  }

  // -- Colour propagation --

  resetColors(): void {
    this.lineColors = {};
    for (const line of this.lines)
      this.lineColors[line.ID] = line.layer === 0 ? "white" : "grey";
    this.padColors = {};
    for (const pad of this.pads) this.padColors[pad.ID] = "white";
    this.terminalColors = {};
    for (const term of this.terminals)
      this.terminalColors[term.ID] = term.color;
  }

  propagateColors(): void {
    this.resetColors();

    for (let iter = 0; iter < 16; iter++) {
      for (const line of this.lines) {
        const first = line.pos[0];
        const last = line.pos[line.pos.length - 1];

        const p1 = this.getPointAt(first[0], first[1]);
        const p2 = this.getPointAt(last[0], last[1]);
        if (!p1 || !p2) continue;

        const c1 = p1.isTerminal
          ? (this.terminalColors[p1.id] ?? this._getTerminalById(p1.id)?.color)
          : this.padColors[p1.id];
        const c2 = p2.isTerminal
          ? (this.terminalColors[p2.id] ?? this._getTerminalById(p2.id)?.color)
          : this.padColors[p2.id];

        if (c1 !== "white" && c2 !== "white") {
          if (c1 === c2) this.lineColors[line.ID] = c1;
        } else {
          if (c1 !== "white") {
            this.lineColors[line.ID] = c1;
            if (!p1.isTerminal) this.padColors[p1.id] = c1;
            if (!p2.isTerminal) this.padColors[p2.id] = c1;
          } else {
            this.lineColors[line.ID] = c2;
            if (!p1.isTerminal) this.padColors[p1.id] = c2;
            if (!p2.isTerminal) this.padColors[p2.id] = c2;
          }
        }
      }
    }

    this._renderScene();
  }

  // -- Completion check --

  checkCompletion(): void {
    let completed = true;

    for (const term of this.terminals) {
      const nConn = this.getLineCount(term.pos[0], term.pos[1]);
      if (nConn !== 1) completed = false;
    }

    for (const pad of this.pads) {
      const nConn = this.getLineCount(pad.pos[0], pad.pos[1]);
      const nUnder = this.getUnderlineCount(pad.pos[0], pad.pos[1]);
      const pc = this.padColors[pad.ID] ?? "white";
      if (nConn !== 2 && pc !== "white") completed = false;
      if (nConn !== 1 && nUnder !== 1 && pc !== "white") completed = false;
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
