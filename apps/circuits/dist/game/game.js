import { Pad } from './pad.js';
import { Terminal } from './terminal.js';
import { Line } from './line.js';
/**
 * Game — central state machine.
 * Manages pads, lines, load/save, undo/redo, colour propagation,
 * and completion checking.
 */
export class Game {
    width = 4;
    height = 5;
    pads = [];
    terminals = [];
    lines = [];
    padColors = {};
    terminalColors = {};
    lineColors = {};
    drawMode = 'line';
    drawColor = 'white';
    drawLayer = 0;
    undoStack = [];
    redoStack = [];
    currentLevel = '';
    /** Callback invoked after save — host element persists state. */
    onSave = null;
    /** Callback invoked on completion change. */
    onComplete = null;
    /** Callback invoked when grid dimensions change and scene needs re-init. */
    onInitScene = null;
    /** Callback invoked when game state changes and scene needs re-render. */
    onRender = null;
    init() {
        this.width = 4;
        this.height = 5;
        this.pads = [];
        this.terminals = [];
        this.lines = [];
        this.drawMode = 'line';
        this.drawColor = 'white';
        this.drawLayer = 0;
        this._renderScene();
    }
    // -- Level loading --
    load(level, savedState) {
        this.init();
        this.redoStack = [];
        this.undoStack = [];
        this.currentLevel = level;
        if (savedState) {
            this.fromJSON(savedState);
            this.save();
            this.updateUndoStack();
            this.propagateColors();
        }
        else {
            void this.reset(level);
        }
    }
    clear() {
        this.init();
    }
    async reset(level) {
        try {
            const resp = await fetch('./public/levels/' + level + '.json');
            if (!resp.ok)
                throw new Error('Level not found');
            const text = await resp.text();
            this.fromJSON(text);
            for (const line of this.lines)
                line.readonly = true;
            this.save();
            this.updateUndoStack();
            this.propagateColors();
        }
        catch (e) {
            console.warn('Could not load level:', level, e);
        }
    }
    // -- Serialisation --
    fromJSON(jsonText) {
        const state = JSON.parse(jsonText);
        this.width = state.width;
        this.height = state.height;
        this.pads = [];
        this.terminals = [];
        const legacyPads = state.pads;
        const terminalIds = new Set();
        for (const p of legacyPads) {
            if ('color' in p && p.color !== undefined) {
                if (p.color === 'white') {
                    this.pads.push(new Pad(p.ID, p.pos));
                }
                else {
                    this.terminals.push(new Terminal(p.ID, p.pos, p.color));
                    terminalIds.add(p.ID);
                }
            }
            else {
                this.pads.push(Pad.fromJSON(p));
            }
        }
        if (state.terminals) {
            for (const t of state.terminals) {
                if (!terminalIds.has(t.ID)) {
                    this.terminals.push(Terminal.fromJSON(t));
                }
            }
        }
        this.lines = state.lines.map((l) => Line.fromJSON(l));
        this.initScene();
    }
    toJSON() {
        return JSON.stringify({
            width: this.width,
            height: this.height,
            pads: this._cleanPads(),
            terminals: this._cleanTerminals(),
            lines: this._cleanLines(),
        });
    }
    _cleanPads() {
        return this.pads.map((p) => p.toJSON());
    }
    _cleanTerminals() {
        return this.terminals.map((t) => t.toJSON());
    }
    _cleanLines() {
        return this.lines.map((l) => l.toJSON());
    }
    _getLineById(id) {
        return this.lines.find((l) => l.ID === id);
    }
    _getTerminalById(id) {
        return this.terminals.find((t) => t.ID === id);
    }
    save() {
        if (this.currentLevel && this.onSave) {
            this.onSave(this.currentLevel, this.toJSON());
        }
    }
    // -- Undo / Redo --
    updateUndoStack() {
        const state = this.toJSON();
        if (state !== this.undoStack[this.undoStack.length - 1]) {
            this.undoStack.push(state);
        }
    }
    undo() {
        if (this.undoStack.length > 1) {
            this.fromJSON(this.undoStack[this.undoStack.length - 2]);
            this.redoStack.push(this.undoStack.pop());
            this.save();
            this.propagateColors();
            this.checkCompletion();
        }
    }
    redo() {
        if (this.redoStack.length > 0) {
            const state = this.redoStack.pop();
            this.fromJSON(state);
            this.undoStack.push(state);
            this.save();
            this.propagateColors();
            this.checkCompletion();
        }
    }
    getPointAt(x, y) {
        for (const pad of this.pads) {
            if (pad.pos[0] === x && pad.pos[1] === y)
                return {
                    id: pad.ID,
                    color: this.padColors[pad.ID] ?? 'white',
                    isTerminal: false,
                };
        }
        for (const term of this.terminals) {
            if (term.pos[0] === x && term.pos[1] === y)
                return {
                    id: term.ID,
                    color: this.terminalColors[term.ID] ?? term.color,
                    isTerminal: true,
                };
        }
        return false;
    }
    // -- Pad operations --
    addPad(ID, x, y) {
        if (!this.getPointAt(x, y)) {
            this.pads.push(new Pad(ID, [x, y]));
            this._renderScene();
        }
    }
    addTerminal(ID, x, y, color) {
        if (!this.getPointAt(x, y)) {
            this.terminals.push(new Terminal(ID, [x, y], color));
            this._renderScene();
        }
    }
    deletePad(x, y) {
        const idx = this.pads.findIndex((p) => p.pos[0] === x && p.pos[1] === y);
        if (idx !== -1) {
            this.pads.splice(idx, 1);
            this._renderScene();
        }
    }
    deleteTerminal(x, y) {
        const idx = this.terminals.findIndex((t) => t.pos[0] === x && t.pos[1] === y);
        if (idx !== -1) {
            this.terminals.splice(idx, 1);
            this._renderScene();
        }
    }
    // -- Line operations --
    /**
     * Add / extend a line.
     * Returns true if the line reached a destination pad or terminal (drag should stop).
     */
    addLine(ID, x, y, layer) {
        const point = this.getPointAt(x, y);
        const pointColor = point ? point.color : false;
        const lineCount = this.getLineCount(x, y);
        const connectionLimit = point ? (point.isTerminal ? 1 : 2) : 0;
        if (point && lineCount >= connectionLimit) {
            this._renderScene();
            return false;
        }
        const line = this._getLineById(ID);
        if (!line) {
            if (!pointColor) {
                this._renderScene();
                return false;
            }
            this.lines.push(new Line(ID, [x, y], layer));
            this.lineColors[ID] = layer === 0 ? pointColor : 'grey';
            this._renderScene();
            return false;
        }
        if (!this._checkCrossing(line, x, y)) {
            this._renderScene();
            return false;
        }
        const lineColor = this.lineColors[ID] ?? (line.layer === 0 ? 'white' : 'grey');
        let endDrag = false;
        if (!pointColor && (!lineCount || layer === -1)) {
            line.addSegment(x, y);
        }
        else if (pointColor === 'white' ||
            pointColor === lineColor ||
            ((lineColor === 'white' || lineColor === 'grey') && pointColor)) {
            line.addSegment(x, y);
            endDrag = true;
        }
        this._renderScene();
        return endDrag;
    }
    getLineColor(x, y) {
        for (const line of this.lines) {
            for (const pos of line.pos) {
                if (pos[0] === x && pos[1] === y)
                    return this.lineColors[line.ID] ?? (line.layer === 0 ? 'white' : 'grey');
            }
        }
        return false;
    }
    getLineCount(x, y) {
        let count = 0;
        for (const line of this.lines) {
            for (const pos of line.pos) {
                if (pos[0] === x && pos[1] === y && line.layer === 0)
                    count++;
            }
        }
        return count;
    }
    getUnderlineCount(x, y) {
        let count = 0;
        for (const line of this.lines) {
            for (const pos of line.pos) {
                if (pos[0] === x && pos[1] === y && line.layer === -1)
                    count++;
            }
        }
        return count;
    }
    checkLine(ID) {
        const line = this._getLineById(ID);
        if (line) {
            const first = line.pos[0];
            const last = line.pos[line.pos.length - 1];
            const p1 = this.getPointAt(first[0], first[1]);
            const p2 = this.getPointAt(last[0], last[1]);
            if (!p1 ||
                !p2 ||
                (first[0] === last[0] && first[1] === last[1])) {
                this.undo();
            }
            this.redoStack = [];
        }
    }
    deleteLine(x, y) {
        const idx = this.lines.findIndex((l) => l.pos.some(([px, py]) => px === x && py === y));
        if (idx !== -1) {
            this.lines.splice(idx, 1);
            this._renderScene();
        }
    }
    /** Prevent diagonal lines from crossing other diagonals on the same layer. */
    _checkCrossing(line, x, y) {
        const last = line.pos[line.pos.length - 1];
        const mx = (x + last[0]) / 2;
        const my = (y + last[1]) / 2;
        for (const other of this.lines) {
            if (other.layer !== line.layer)
                continue;
            const pos = other.pos;
            for (let i = 1; i < pos.length; i++) {
                if (Math.abs(pos[i][0] - pos[i - 1][0]) === 1 &&
                    Math.abs(pos[i][1] - pos[i - 1][1]) === 1 &&
                    (pos[i][0] + pos[i - 1][0]) / 2 === mx &&
                    (pos[i][1] + pos[i - 1][1]) / 2 === my) {
                    return false;
                }
            }
        }
        return true;
    }
    // -- Colour propagation --
    resetColors() {
        this.lineColors = {};
        for (const line of this.lines)
            this.lineColors[line.ID] = line.layer === 0 ? 'white' : 'grey';
        this.padColors = {};
        for (const pad of this.pads)
            this.padColors[pad.ID] = 'white';
        this.terminalColors = {};
        for (const term of this.terminals)
            this.terminalColors[term.ID] = term.color;
    }
    propagateColors() {
        this.resetColors();
        for (let iter = 0; iter < 16; iter++) {
            for (const line of this.lines) {
                const first = line.pos[0];
                const last = line.pos[line.pos.length - 1];
                const p1 = this.getPointAt(first[0], first[1]);
                const p2 = this.getPointAt(last[0], last[1]);
                if (!p1 || !p2)
                    continue;
                const c1 = p1.isTerminal
                    ? (this.terminalColors[p1.id] ?? this._getTerminalById(p1.id)?.color)
                    : this.padColors[p1.id];
                const c2 = p2.isTerminal
                    ? (this.terminalColors[p2.id] ?? this._getTerminalById(p2.id)?.color)
                    : this.padColors[p2.id];
                if (c1 !== 'white' && c2 !== 'white') {
                    if (c1 === c2)
                        this.lineColors[line.ID] = c1;
                }
                else {
                    if (c1 !== 'white') {
                        this.lineColors[line.ID] = c1;
                        if (!p1.isTerminal)
                            this.padColors[p1.id] = c1;
                        if (!p2.isTerminal)
                            this.padColors[p2.id] = c1;
                    }
                    else {
                        this.lineColors[line.ID] = c2;
                        if (!p1.isTerminal)
                            this.padColors[p1.id] = c2;
                        if (!p2.isTerminal)
                            this.padColors[p2.id] = c2;
                    }
                }
            }
        }
        this._renderScene();
    }
    // -- Completion check --
    checkCompletion() {
        let completed = true;
        for (const term of this.terminals) {
            const nConn = this.getLineCount(term.pos[0], term.pos[1]);
            if (nConn !== 1)
                completed = false;
        }
        for (const pad of this.pads) {
            const nConn = this.getLineCount(pad.pos[0], pad.pos[1]);
            const nUnder = this.getUnderlineCount(pad.pos[0], pad.pos[1]);
            const pc = this.padColors[pad.ID] ?? 'white';
            if (nConn !== 2 && pc !== 'white')
                completed = false;
            if (nConn !== 1 && nUnder !== 1 && pc !== 'white')
                completed = false;
        }
        if (this.onComplete) {
            this.onComplete(this.currentLevel, completed);
        }
    }
    // -- Move finalisation --
    finalizeMove(lineID) {
        this.save();
        this.updateUndoStack();
        this.checkLine(lineID);
        this.propagateColors();
        this.checkCompletion();
    }
    // -- Internal --
    initScene() {
        this.onInitScene?.();
    }
    _renderScene() {
        this.onRender?.();
    }
}
//# sourceMappingURL=game.js.map