var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty, Storage as $, div } from '@io-gui/core';
import { ioSplit, Split } from '@io-gui/layout';
import { ioButton } from '@io-gui/inputs';
import { TERMINAL_COLORS } from './game/items/terminal.js';
import { circuitsLevels } from './CircuitsLevels.js';
import { circuitsGame } from './CircuitsGame.js';
import { Game } from './game/game.js';
$.permit();
const $level = $({ key: 'level', storage: 'hash', value: 'lvl_0101' });
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
                        { type: 'panel', flex: '1 1 800px', tabs: [{ id: 'game' }] },
                        { type: 'panel', flex: '0 0 120px', tabs: [{ id: 'editor' }] },
                    ],
                }),
                elements: [
                    circuitsLevels({ id: 'levels' }),
                    circuitsGame({ id: 'game', level: $level, game: this.game }),
                    div({ id: 'editor' }, [
                        ioButton({ label: 'Pad', action: () => this._select('pad', '') }),
                        ...Object.keys(TERMINAL_COLORS).map((c) => ioButton({ label: c, action: () => this._select('terminal', c) })),
                        ioButton({
                            label: 'Line (top)',
                            action: () => this.dispatch('editor-select', { mode: 'line', layer: 0 }, true),
                        }),
                        ioButton({
                            label: 'Line (bottom)',
                            action: () => this.dispatch('editor-select', { mode: 'line', layer: -1 }, true),
                        }),
                        ioButton({ label: 'Delete', action: () => this._select('delete', 'red') }),
                    ])
                ],
            }),
        ]);
    }
    _select(mode, color) {
        this.dispatch('editor-select', { mode, color }, true);
    }
    onEditorSelect(event) {
        event.stopPropagation();
        const { mode, color, layer } = event.detail;
        this.game.drawMode = mode;
        console.log(mode);
        if (mode === 'line' && layer !== undefined) {
            this.game.drawLayer = layer;
        }
        else if (color !== undefined) {
            this.game.drawColor = color;
        }
        this.changed();
    }
    onLevelSelect(event) {
        event.stopPropagation();
        const { level } = event.detail;
        $level.value = level;
    }
};
__decorate([
    ReactiveProperty({ type: Game })
], CircuitsApp.prototype, "game", void 0);
CircuitsApp = __decorate([
    Register
], CircuitsApp);
export { CircuitsApp };
//# sourceMappingURL=CircuitsApp.js.map