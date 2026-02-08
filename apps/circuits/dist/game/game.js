var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveNode, ReactiveProperty, Property, Storage as $ } from '@io-gui/core';
import { Pad } from './items/pad.js';
import { Terminal, } from './items/terminal.js';
import { Line } from './items/line.js';
import { Plotter } from './plotter.js';
/**
 * Game — central state machine.
 * Manages pads, lines, load/save, undo/redo, colour propagation,
 * and completion checking.
 */
let Game = class Game extends ReactiveNode {
    width = 4;
    height = 5;
    pads = [];
    terminals = [];
    lines = [];
    drawMode = 'line';
    drawColor = 'white';
    drawLayer = 0;
    undoStack = [];
    redoStack = [];
    clear() {
        this.width = 4;
        this.height = 5;
        this.pads = [];
        this.terminals = [];
        this.lines = [];
        this.plotter.connect(this.pads, this.terminals, this.lines, this.width, this.height);
        this.drawMode = 'line';
        this.drawColor = 'white';
        this.drawLayer = 0;
        this.redoStack = [];
        this.undoStack = [];
    }
    async initialize() {
        this.clear();
        this.storedState = $({ key: `${this.currentLevel}-level-state`, value: {}, storage: 'local' });
        if (this.currentLevel) {
            if (Object.keys(this.storedState.value).length === 0) {
                await this.load(this.currentLevel);
            }
            else {
                this.clear();
                this.fromJSON(JSON.stringify(this.storedState.value));
                this.propagateColors();
            }
        }
        this.undoStack = [this.toJSON()];
        this.redoStack = [];
        this.dispatch('game-update', undefined, true);
    }
    currentLevelChanged() {
        void this.initialize().then(() => {
            this.dispatch('game-init-scene', undefined, true);
        });
    }
    reload() {
        this.storedState.value = {};
        void this.initialize();
    }
    async load(level) {
        try {
            const resp = await fetch('./public/levels/' + level + '.json');
            if (!resp.ok)
                console.error('Level not found');
            const text = await resp.text();
            this.clear();
            this.fromJSON(text);
            this.propagateColors();
            this.save();
        }
        catch (e) {
            console.warn('Could not load level:', level, e);
        }
    }
    save() {
        this.storedState.value = {
            width: this.width,
            height: this.height,
            pads: this.pads.map((p) => p.toJSON()),
            terminals: this.terminals.map((t) => t.toJSON()),
            lines: this.lines.map((l) => l.toJSON()),
        };
    }
    fromJSON(jsonText) {
        const state = JSON.parse(jsonText);
        this.width = state.width;
        this.height = state.height;
        this.pads = state.pads.map((p) => Pad.fromJSON(p));
        this.terminals = state.terminals.map((t) => Terminal.fromJSON(t));
        this.lines = state.lines.map((l) => Line.fromJSON(l));
        this.plotter.connect(this.pads, this.terminals, this.lines, this.width, this.height);
    }
    toJSON() {
        return JSON.stringify({
            width: this.width,
            height: this.height,
            pads: this.pads.map((p) => p.toJSON()),
            terminals: this.terminals.map((t) => t.toJSON()),
            lines: this.lines.map((l) => l.toJSON()),
        });
    }
    updateUndoStack() {
        const state = this.toJSON();
        if (state !== this.undoStack[this.undoStack.length - 1]) {
            this.undoStack.push(state);
        }
    }
    undo() {
        if (this.undoStack.length >= 2) {
            const currentState = this.undoStack.pop();
            this.fromJSON(this.undoStack[this.undoStack.length - 1]);
            this.redoStack.push(currentState);
            this.propagateColors();
            this.save();
            this.dispatch('game-update', undefined, true);
        }
    }
    redo() {
        if (this.redoStack.length > 0) {
            const state = this.redoStack.pop();
            this.fromJSON(state);
            this.undoStack.push(state);
            this.propagateColors();
            this.save();
            this.dispatch('game-update', undefined, true);
        }
    }
    resetColors() {
        for (const line of this.lines)
            line._color = 'white';
        for (const pad of this.pads)
            pad._color = 'white';
    }
    propagateColors() {
        this.resetColors();
        for (let iter = 0; iter < 16; iter++) {
            for (const line of this.lines) {
                const first = line.pos[0];
                const last = line.pos[line.pos.length - 1];
                const p1 = this.plotter.getPointAt(first[0], first[1]);
                const p2 = this.plotter.getPointAt(last[0], last[1]);
                if (!p1 || !p2)
                    continue;
                const c1 = p1.color;
                const c2 = p2.color;
                if (c1 !== 'white' && c2 !== 'white') {
                    if (c1 === c2)
                        line._color = c1;
                }
                else if (c1 === 'white' && c2 === 'white') {
                    line._color = 'white';
                }
                else {
                    if (c1 !== 'white') {
                        line._color = c1;
                        if (p2 instanceof Pad)
                            p2.color = c1;
                    }
                    else if (c2 !== 'white') {
                        line._color = c2;
                        if (p1 instanceof Pad)
                            p1.color = c2;
                    }
                }
            }
        }
        this.dispatch('game-update', undefined, true);
        let completed = true;
        // TODO: Check for completeness correctly
        for (const term of this.terminals) {
            const nConn = this.plotter.getLinesAtPoint(term.pos[0], term.pos[1]).length;
            if (nConn !== 1)
                completed = false;
        }
        for (const pad of this.pads) {
            const nConn = this.plotter.getLinesAtPoint(pad.pos[0], pad.pos[1]).length;
            if (nConn !== 2 && pad._color !== 'white')
                completed = false;
        }
        console.log('game-complete', this.currentLevel, completed);
        this.dispatch('game-complete', { level: this.currentLevel, completed }, true);
    }
    finalizeMove(lineID) {
        if (this.plotter.verifyLineLegality(lineID)) {
            this.updateUndoStack();
            this.propagateColors();
            this.save();
        }
        this.dispatch('game-update', undefined, true);
    }
};
__decorate([
    ReactiveProperty({ value: '', type: String })
], Game.prototype, "currentLevel", void 0);
__decorate([
    ReactiveProperty({ type: Plotter, init: null })
], Game.prototype, "plotter", void 0);
__decorate([
    Property($({ key: 'null-level-state', value: {}, storage: 'local' }))
], Game.prototype, "storedState", void 0);
Game = __decorate([
    Register
], Game);
export { Game };
//# sourceMappingURL=game.js.map