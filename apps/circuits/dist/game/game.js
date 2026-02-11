var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveNode, ReactiveProperty, Property, Storage as $ } from '@io-gui/core';
import { Pad } from './items/pad.js';
import { Line } from './items/line.js';
import { Plotter } from './plotter.js';
/**
 * Game — central state machine.
 * Manages pads, lines, load/save, undo/redo, colour propagation,
 * and completion checking.
 */
let Game = class Game extends ReactiveNode {
    drawMode = 'line';
    drawColor = 'white';
    drawLayer = 0;
    undoStack = [];
    redoStack = [];
    clear() {
        this.width = 4;
        this.height = 5;
        this.pads = [];
        this.lines = [];
        this.plotter.connect(this.pads, this.lines, this.width, this.height);
        this.drawMode = 'line';
        this.drawColor = 'white';
        this.drawLayer = 0;
        this.redoStack = [];
        this.undoStack = [];
    }
    async initialize() {
        this.clear();
        this.storedState = $({ key: `${this.level}-level-state`, value: {}, storage: 'local' });
        if (this.level) {
            if (Object.keys(this.storedState.value).length === 0) {
                await this.load(this.level);
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
    levelChanged() {
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
            lines: this.lines.map((l) => l.toJSON()),
        };
    }
    fromJSON(jsonText) {
        const state = JSON.parse(jsonText);
        this.width = state.width;
        this.height = state.height;
        this.pads = state.pads.map((p) => Pad.fromJSON(p));
        this.lines = state.lines.map((l) => Line.fromJSON(l));
        this.plotter.connect(this.pads, this.lines, this.width, this.height);
    }
    toJSON() {
        return JSON.stringify({
            width: this.width,
            height: this.height,
            pads: this.pads.map((p) => p.toJSON()),
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
            line.color = 'white';
        for (const pad of this.pads) {
            pad.renderColor = pad.isTerminal ? (pad.color ?? 'red') : 'white';
        }
    }
    propagateColors() {
        this.resetColors();
        for (let iter = 0; iter < 16; iter++) {
            for (const line of this.lines) {
                const first = line.pos[0];
                const last = line.pos[line.pos.length - 1];
                const p1 = this.plotter.getPointAt(first);
                const p2 = this.plotter.getPointAt(last);
                if (!p1 || !p2)
                    continue;
                const c1 = p1.renderColor;
                const c2 = p2.renderColor;
                if (c1 !== 'white' && c2 !== 'white') {
                    if (c1 === c2)
                        line.color = c1;
                }
                else if (c1 === 'white' && c2 === 'white') {
                    line.color = 'white';
                }
                else {
                    if (c1 !== 'white') {
                        line.color = c1;
                        if (p2 instanceof Pad)
                            p2.renderColor = c1;
                    }
                    else if (c2 !== 'white') {
                        line.color = c2;
                        if (p1 instanceof Pad)
                            p1.renderColor = c2;
                    }
                }
            }
        }
        this.dispatch('game-update', undefined, true);
        let completed = true;
        // TODO: Check for completeness correctly
        for (const pad of this.pads) {
            const nConn = this.plotter.getLinesAtPoint(pad.pos).length;
            if (pad.isTerminal) {
                if (nConn !== 1)
                    completed = false;
            }
            else if (nConn !== 2 && pad.renderColor !== 'white') {
                completed = false;
            }
        }
        if (completed)
            console.log('game-complete', this.level, completed);
        this.dispatch('game-complete', { level: this.level, completed }, true);
    }
    finalizeMove(lineID) {
        if (this.plotter.verifyLineComplete(lineID)) {
            this.updateUndoStack();
            this.propagateColors();
            this.save();
        }
        this.dispatch('game-update', undefined, true);
    }
};
__decorate([
    ReactiveProperty({ value: '', type: String })
], Game.prototype, "level", void 0);
__decorate([
    ReactiveProperty({ type: Array })
], Game.prototype, "pads", void 0);
__decorate([
    ReactiveProperty({ type: Array })
], Game.prototype, "lines", void 0);
__decorate([
    ReactiveProperty({ type: Number })
], Game.prototype, "width", void 0);
__decorate([
    ReactiveProperty({ type: Number })
], Game.prototype, "height", void 0);
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