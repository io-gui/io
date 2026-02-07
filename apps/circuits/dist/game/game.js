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
    pads = {};
    terminals = {};
    lines = {};
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
        this.pads = {};
        this.terminals = {};
        this.lines = {};
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
            for (const i in this.lines)
                this.lines[i].readonly = true;
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
        this.pads = {};
        this.terminals = {};
        const legacyPads = state.pads;
        for (const p of legacyPads) {
            if ('color' in p && p.color !== undefined) {
                if (p.color === 'white') {
                    this.pads[p.ID] = new Pad(p.ID, p.pos);
                }
                else {
                    this.terminals[p.ID] = new Terminal(p.ID, p.pos, p.color);
                }
            }
            else {
                this.pads[p.ID] = Pad.fromJSON(p);
            }
        }
        if (state.terminals) {
            for (const t of state.terminals) {
                this.terminals[t.ID] = Terminal.fromJSON(t);
            }
        }
        this.lines = {};
        for (const l of state.lines) {
            this.lines[l.ID] = Line.fromJSON(l);
        }
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
        return Object.values(this.pads).map((p) => p.toJSON());
    }
    _cleanTerminals() {
        return Object.values(this.terminals).map((t) => t.toJSON());
    }
    _cleanLines() {
        return Object.values(this.lines).map((l) => l.toJSON());
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
        for (const i in this.pads) {
            if (this.pads[i].pos[0] === x && this.pads[i].pos[1] === y)
                return {
                    id: this.pads[i].ID,
                    color: this.padColors[this.pads[i].ID] ?? 'white',
                    isTerminal: false,
                };
        }
        for (const i in this.terminals) {
            if (this.terminals[i].pos[0] === x && this.terminals[i].pos[1] === y)
                return {
                    id: this.terminals[i].ID,
                    color: this.terminalColors[this.terminals[i].ID] ?? this.terminals[i].color,
                    isTerminal: true,
                };
        }
        return false;
    }
    // -- Pad operations --
    addPad(ID, x, y) {
        if (!this.getPointAt(x, y)) {
            this.pads[ID] = new Pad(ID, [x, y]);
            this._renderScene();
        }
    }
    addTerminal(ID, x, y, color) {
        if (!this.getPointAt(x, y)) {
            this.terminals[ID] = new Terminal(ID, [x, y], color);
            this._renderScene();
        }
    }
    deletePad(x, y) {
        for (const i in this.pads) {
            if (this.pads[i] &&
                this.pads[i].pos[0] === x &&
                this.pads[i].pos[1] === y) {
                delete this.pads[i];
                this._renderScene();
                return;
            }
        }
    }
    deleteTerminal(x, y) {
        for (const i in this.terminals) {
            if (this.terminals[i] &&
                this.terminals[i].pos[0] === x &&
                this.terminals[i].pos[1] === y) {
                delete this.terminals[i];
                this._renderScene();
                return;
            }
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
        if (!this.lines[ID]) {
            if (!pointColor) {
                this._renderScene();
                return false;
            }
            this.lines[ID] = new Line(ID, [x, y], layer);
            this.lineColors[ID] = layer === 0 ? pointColor : 'grey';
            this._renderScene();
            return false;
        }
        if (!this._checkCrossing(this.lines[ID], x, y)) {
            this._renderScene();
            return false;
        }
        const lineColor = this.lineColors[ID] ??
            (this.lines[ID].layer === 0 ? 'white' : 'grey');
        let endDrag = false;
        if (!pointColor && (!lineCount || layer === -1)) {
            this.lines[ID].addSegment(x, y);
        }
        else if (pointColor === 'white' ||
            pointColor === lineColor ||
            ((lineColor === 'white' || lineColor === 'grey') && pointColor)) {
            this.lines[ID].addSegment(x, y);
            endDrag = true;
        }
        this._renderScene();
        return endDrag;
    }
    getLineColor(x, y) {
        for (const i in this.lines) {
            const line = this.lines[i];
            for (const pos of line.pos) {
                if (pos[0] === x && pos[1] === y)
                    return this.lineColors[line.ID] ?? (line.layer === 0 ? 'white' : 'grey');
            }
        }
        return false;
    }
    getLineCount(x, y) {
        let count = 0;
        for (const i in this.lines) {
            for (const pos of this.lines[i].pos) {
                if (pos[0] === x && pos[1] === y && this.lines[i].layer === 0)
                    count++;
            }
        }
        return count;
    }
    getUnderlineCount(x, y) {
        let count = 0;
        for (const i in this.lines) {
            for (const pos of this.lines[i].pos) {
                if (pos[0] === x && pos[1] === y && this.lines[i].layer === -1)
                    count++;
            }
        }
        return count;
    }
    checkLine(ID) {
        if (this.lines[ID]) {
            const first = this.lines[ID].pos[0];
            const last = this.lines[ID].pos[this.lines[ID].pos.length - 1];
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
    /** Prevent diagonal lines from crossing other diagonals on the same layer. */
    _checkCrossing(line, x, y) {
        const last = line.pos[line.pos.length - 1];
        const mx = (x + last[0]) / 2;
        const my = (y + last[1]) / 2;
        for (const id in this.lines) {
            const other = this.lines[id];
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
        for (const i in this.lines) {
            const line = this.lines[i];
            this.lineColors[line.ID] = line.layer === 0 ? 'white' : 'grey';
        }
        this.padColors = {};
        for (const i in this.pads)
            this.padColors[this.pads[i].ID] = 'white';
        this.terminalColors = {};
        for (const i in this.terminals)
            this.terminalColors[this.terminals[i].ID] = this.terminals[i].color;
    }
    propagateColors() {
        this.resetColors();
        for (let iter = 0; iter < 16; iter++) {
            for (const i in this.lines) {
                const line = this.lines[i];
                const first = line.pos[0];
                const last = line.pos[line.pos.length - 1];
                const p1 = this.getPointAt(first[0], first[1]);
                const p2 = this.getPointAt(last[0], last[1]);
                if (!p1 || !p2)
                    continue;
                const c1 = p1.isTerminal
                    ? (this.terminalColors[p1.id] ?? this.terminals[p1.id].color)
                    : this.padColors[p1.id];
                const c2 = p2.isTerminal
                    ? (this.terminalColors[p2.id] ?? this.terminals[p2.id].color)
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
        for (const i in this.terminals) {
            const term = this.terminals[i];
            const nConn = this.getLineCount(term.pos[0], term.pos[1]);
            if (nConn !== 1)
                completed = false;
        }
        for (const i in this.pads) {
            const pad = this.pads[i];
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