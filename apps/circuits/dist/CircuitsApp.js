var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty, Storage as $, } from '@io-gui/core';
import { ioSplit, Split } from '@io-gui/layout';
import { circuitsLevels } from './CircuitsLevels.js';
import { circuitsGame } from './CircuitsGame.js';
import { circuitsEditor } from './CircuitsEditor.js';
import { Game } from './game/game.js';
$.permit();
const $level = $({ key: 'level', storage: 'hash', value: '' });
let CircuitsApp = class CircuitsApp extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        position: fixed;
        inset: 0;
        background-color: var(--io_bgColor);
        color: var(--io_color);
        user-select: none;
        -webkit-user-select: none;
        -webkit-text-size-adjust: none;
        -webkit-touch-callout: none;
      }
    `;
    }
    static get Listeners() {
        return {
            'level-select': 'onLevelSelect',
            'editor-select': 'onEditorSelect',
        };
    }
    ready() {
        this.render([
            ioSplit({
                split: new Split({
                    type: 'split',
                    children: [
                        { type: 'panel', flex: '0 0 110px', tabs: [{ id: 'levels' }] },
                        { type: 'panel', flex: '1 1 auto', tabs: [{ id: 'game' }] },
                        { type: 'panel', flex: '0 0 120px', tabs: [{ id: 'editor' }] },
                    ],
                }),
                elements: [
                    circuitsLevels({ id: 'levels' }),
                    circuitsGame({ id: 'game', level: $level, game: this.game }),
                    circuitsEditor({ id: 'editor' }),
                ],
            }),
        ]);
    }
    onEditorSelect(event) {
        event.stopPropagation();
        const { mode, color } = event.detail;
        this.game.drawMode = mode;
        this.game.drawColor = color;
        this.changed();
    }
    onLevelSelect(event) {
        event.stopPropagation();
        const { level } = event.detail;
        $level.value = level;
    }
};
__decorate([
    ReactiveProperty({ type: Game, init: null })
], CircuitsApp.prototype, "game", void 0);
CircuitsApp = __decorate([
    Register
], CircuitsApp);
export { CircuitsApp };
//# sourceMappingURL=CircuitsApp.js.map