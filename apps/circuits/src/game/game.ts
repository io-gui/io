import { Register, ReactiveNode, ReactiveProperty, Property, Storage as $, Binding } from "@io-gui/core";
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

  drawMode: DrawMode = "line";
  drawColor: TerminalColor = "white";
  drawLayer = 0;

  undoStack: string[] = [];
  redoStack: string[] = [];

  padColors: Record<number, TerminalColor> = {};
  terminalColors: Record<number, TerminalColor> = {};
  lineColors: Record<number, TerminalColor> = {};

  @ReactiveProperty({value: '', type: String})
  declare currentLevel: string;
  
  @ReactiveProperty({type: Plotter, init: null})
  declare plotter: Plotter;

  @Property($({key: 'null-level-state', value: {}, storage: 'local'}))
  declare storedState: Binding;

  clear() {
    this.width = 4;
    this.height = 5;
    this.pads = [];
    this.terminals = [];
    this.lines = [];
    this.plotter.connect(this.pads, this.terminals, this.lines);
    this.drawMode = "line";
    this.drawColor = "white";
    this.drawLayer = 0;
    this.redoStack = [];
    this.undoStack = [];
  }

  async initialize() {
    this.clear();
    this.storedState = $({key: `${this.currentLevel}-level-state`, value: {}, storage: 'local'});

    if (this.currentLevel) {
      if (Object.keys(this.storedState.value).length === 0) {
        await this.load(this.currentLevel);
      } else {
        this.fromJSON(JSON.stringify(this.storedState.value));
        this.propagateColors();
      }
    }

    this.dispatch("game-render", undefined, true);
  }

  currentLevelChanged() {
    this.initialize().then(() => {
      this.dispatch("game-init-scene", undefined, true);
    });
  }

  reload() {
    this.storedState.value = {};
    void this.initialize();
  }

  async load(level: string): Promise<void> {
    try {
      const resp = await fetch("./public/levels/" + level + ".json");
      if (!resp.ok) console.error("Level not found");
      const text = await resp.text();
      this.fromJSON(text);
      this.propagateColors();
      this.save();
    } catch (e) {
      console.warn("Could not load level:", level, e);
    }
  }

  save(): void {
    this.storedState.value = {
      width: this.width,
      height: this.height,
      pads: this.pads.map((p) => p.toJSON()),
      terminals: this.terminals.map((t) => t.toJSON()),
      lines: this.lines.map((l) => l.toJSON()),
    }
  }

  fromJSON(jsonText: string): void {
    this.clear();
    const state: LevelData = JSON.parse(jsonText);
    this.width = state.width;
    this.height = state.height;
    this.pads = state.pads.map((p) => Pad.fromJSON(p));
    this.terminals = state.terminals.map((t) => Terminal.fromJSON(t));
    this.lines = state.lines.map((l) => Line.fromJSON(l as LineData));
    this.plotter.connect(this.pads, this.terminals, this.lines);
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
      this.propagateColors();
      this.save();
      this.dispatch("game-render", undefined, true);
    }
  }

  redo(): void {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop()!;
      this.fromJSON(state);
      this.undoStack.push(state);
      this.propagateColors();
      this.save();
      this.dispatch("game-render", undefined, true);
    }
  }

  private _getTerminalById(id: number): Terminal | undefined {
    return this.terminals.find((t) => t.ID === id);
  }

  getPointAt(x: number, y: number): { id: number; color: string; isTerminal: boolean } | false {
    const point = this.plotter.getPointAt(x, y);
    if (!point) return false;
    const color = point.isTerminal
      ? (this.terminalColors[point.id] ??
        this._getTerminalById(point.id)?.color ??
        "white")
      : (this.padColors[point.id] ?? "white");
    return { id: point.id, color, isTerminal: point.isTerminal };
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

    this.dispatch("game-render", undefined, true);

    let completed = true;

    for (const term of this.terminals) {
      const nConn = this.plotter.getLineCount(term.pos[0], term.pos[1]);
      if (nConn !== 1) completed = false;
    }

    for (const pad of this.pads) {
      const nConn = this.plotter.getLineCount(pad.pos[0], pad.pos[1]);
      const nUnder = this.plotter.getUnderlineCount(pad.pos[0], pad.pos[1]);
      const pc = this.padColors[pad.ID] ?? "white";
      if (nConn !== 2 && pc !== "white") completed = false;
      if (nConn !== 1 && nUnder !== 1 && pc !== "white") completed = false;
    }

    this.dispatch("game-complete", { level: this.currentLevel, completed }, true);
  }

  finalizeMove(lineID: number): void {
    if (this.plotter.verifyLineComplete(lineID)) {
      this.updateUndoStack();
      this.propagateColors();
      this.save();
    }
    this.dispatch("game-render", undefined, true);
  }
}
