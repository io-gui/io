var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, Register, ReactiveProperty, div } from '@io-gui/core';
import { ioButton } from '@io-gui/inputs';
import { Game } from './game/game.js';
import { circuitsBoard } from './CircuitsBoard.js';
export class CircuitsGame extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      :host > .game-toolbar {
        display: flex;
        gap: 2px;
        padding: 2px;
        flex-shrink: 0;
      }
    `;
    }
    static get Listeners() {
        return {
            'game-complete': 'onGameComplete',
        };
    }
    completeFn = null;
    constructor(args) { super(args); }
    ready() {
        this.changed();
    }
    onGameComplete(event) {
        if (this.completeFn)
            this.completeFn(event.detail.level, event.detail.completed);
    }
    changed() {
        this.render([
            div({ class: 'game-toolbar' }, [
                ioButton({ label: 'Undo', action: this.onUndo }),
                ioButton({ label: 'Edit', action: this.onEdit }),
                ioButton({ label: 'Reset', action: this.onReset }),
                ioButton({ label: 'Redo', action: this.onRedo }),
                ioButton({ label: 'Back', action: this.onBack }),
            ]),
            circuitsBoard({ id: 'board', game: this.game }),
        ]);
    }
    levelChanged() {
        this.game.currentLevel = this.level;
        const board = this.querySelector('circuits-board');
        if (board)
            board.gameChanged();
    }
    onUndo() {
        this.game.undo();
    }
    onRedo() {
        this.game.redo();
    }
    onReset() {
        this.game.reload();
    }
    onEdit() {
        this.changed();
    }
    onBack() {
        this.dispatch('back-to-levels', undefined, true);
    }
}
__decorate([
    ReactiveProperty({ value: '', type: String })
], CircuitsGame.prototype, "level", void 0);
__decorate([
    ReactiveProperty({ type: Game, init: null })
], CircuitsGame.prototype, "game", void 0);
Register(CircuitsGame);
export const circuitsGame = function (arg0) {
    return CircuitsGame.vConstructor(arg0);
};
//# sourceMappingURL=CircuitsGame.js.map