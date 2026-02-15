var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveNode, ReactiveProperty, Property, Storage as $ } from '@io-gui/core';
import { Plotter } from './plotter.js';
import { COLORS } from './items/colors.js';
import { Pads } from './pads.js';
import { Layer } from './layer.js';
/**
 * Game — central state machine.
 * Manages pads, lines, load/save, undo/redo, colour propagation,
 * and completion checking.
 */
let Game = class Game extends ReactiveNode {
    redoStack = [];
    static get Listeners() {
        return {
            'game-init': 'onGameInit',
            'game-update': 'onGameUpdate',
        };
    }
    async load(level) {
        try {
            const resp = await fetch('./public/levels/' + level + '.json');
            if (!resp.ok)
                console.error('Level not found');
            const text = await resp.text();
            this.storedState.value = JSON.parse(text);
        }
        catch (e) {
            console.warn('Could not load level:', level, e);
        }
    }
    async initialize() {
        this.storedState = $({ key: `${this.level}-level-state`, value: {}, storage: 'local' });
        if (Object.keys(this.storedState.value).length === 0) {
            await this.load(this.level);
        }
        this.fromJSON(JSON.stringify(this.storedState.value));
        this.propagateColors();
        this.undoStack = [this.toJSON()];
        this.redoStack = [];
        this.dispatch('game-init', undefined, true);
    }
    onGameInit() {
        this.onGameUpdate();
    }
    ;
    onGameUpdate() {
        this.updateTextures();
    }
    ;
    levelChanged() {
        void this.initialize();
    }
    reload() {
        this.storedState.value = {};
        void this.initialize();
    }
    save() {
        this.storedState.value = {
            width: this.width,
            height: this.height,
            pads: this.pads.toJSON(),
            layer0: this.layer0.toJSON(),
            layer1: this.layer1.toJSON(),
        };
    }
    fromJSON(jsonText) {
        const state = JSON.parse(jsonText);
        this.width = state.width;
        this.height = state.height;
        this.pads = new Pads(this.width, this.height, state.pads);
        this.layer0 = new Layer(this.width, this.height, state.layer0);
        this.layer1 = new Layer(this.width, this.height, state.layer1);
        this.plotter.connect(this.pads, this.layer0, this.layer1);
    }
    toJSON() {
        return JSON.stringify({
            width: this.width,
            height: this.height,
            pads: this.pads.toJSON(),
            layer0: this.layer0.toJSON(),
            layer1: this.layer1.toJSON(),
        });
    }
    updateUndoStack() {
        const state = this.toJSON();
        if (state !== this.undoStack[this.undoStack.length - 1]) {
            this.undoStack.push(state);
            this.redoStack = [];
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
        this.layer0.forEach((line) => line.resetColor());
        this.layer1.forEach((line) => line.resetColor());
        this.pads.forEach((pad) => pad.resetColor());
    }
    propagateColors() {
        this.resetColors();
        const lines = [...this.layer0.lines, ...this.layer1.lines];
        for (let iter = 0; iter < 16; iter++) {
            for (const line of lines) {
                const first = line.pos[0];
                const last = line.pos[line.pos.length - 1];
                const p1 = this.pads.getAt(first.x, first.y);
                const p2 = this.pads.getAt(last.x, last.y);
                if (!p1 || !p2)
                    continue;
                const c1 = p1.renderColor;
                const c2 = p2.renderColor;
                const w = COLORS.white;
                if (c1 !== w && c2 !== w) {
                    if (c1 === c2)
                        line.renderColor = c1;
                }
                else if (c1 === w && c2 === w) {
                    line.renderColor = w;
                }
                else {
                    if (c1 !== w) {
                        line.renderColor = c1;
                        p2.renderColor = c1;
                    }
                    else if (c2 !== w) {
                        line.renderColor = c2;
                        p1.renderColor = c2;
                    }
                }
            }
        }
        this.dispatch('game-update', undefined, true);
        let completed = true;
        // TODO: Check for completeness correctly
        this.pads.forEach((pad, x, y) => {
            const line0 = this.layer0.getLinesAt(x, y);
            const line1 = this.layer1.getLinesAt(x, y);
            const nConn = line0.length + line1.length;
            if (pad.isTerminal) {
                if (nConn !== 1)
                    completed = false;
            }
            else if (nConn !== 2 && pad.renderColor !== COLORS.white) {
                completed = false;
            }
        });
        if (completed)
            console.log('game-complete', this.level, completed);
        this.dispatch('game-complete', { level: this.level, completed }, true);
    }
    updateTextures() {
        this.pads.updateTexture(this.width, this.height);
        this.layer0.updateTexture(this.width, this.height);
        this.layer1.updateTexture(this.width, this.height);
    }
    finalizeMove() {
        if (this.plotter.finalizeLine()) {
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
    ReactiveProperty({ type: Number })
], Game.prototype, "width", void 0);
__decorate([
    ReactiveProperty({ type: Number })
], Game.prototype, "height", void 0);
__decorate([
    ReactiveProperty({ type: Pads, init: null })
], Game.prototype, "pads", void 0);
__decorate([
    ReactiveProperty({ type: Layer, init: null })
], Game.prototype, "layer0", void 0);
__decorate([
    ReactiveProperty({ type: Layer, init: null })
], Game.prototype, "layer1", void 0);
__decorate([
    ReactiveProperty({ type: Plotter, init: null })
], Game.prototype, "plotter", void 0);
__decorate([
    Property($({ key: 'null-level-state', value: {}, storage: 'local' }))
], Game.prototype, "storedState", void 0);
__decorate([
    Property(Array)
], Game.prototype, "undoStack", void 0);
__decorate([
    Property(Array)
], Game.prototype, "redoStack", void 0);
Game = __decorate([
    Register
], Game);
export { Game };
//# sourceMappingURL=game.js.map