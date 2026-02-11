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
      :host > .game-toolbar > io-button {
        flex: 1 1 auto;
        height: calc(var(--io_fieldHeight) * 1.5);
        display: flex;
        align-items: center;
      }
      :host > .game-toolbar > io-button > io-icon {
        margin-left: auto;
      }
      :host > .game-toolbar > io-button > span {
        margin-right: auto;
      }
    `;
    }
    constructor(args) { super(args); }
    ready() {
        this.changed();
    }
    changed() {
        this.render([
            circuitsBoard({ id: 'board', game: this.game }),
            div({ class: 'game-toolbar' }, [
                ioButton({ label: 'Undo', icon: 'io:undo', action: this.onUndo }),
                ioButton({ label: 'Reset', icon: 'io:reload', action: this.onReset }),
                ioButton({ label: 'Redo', icon: 'io:redo', action: this.onRedo }),
            ]),
        ]);
    }
    levelChanged() {
        this.game.currentLevel = this.level;
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