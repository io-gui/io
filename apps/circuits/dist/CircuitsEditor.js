var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, Register } from '@io-gui/core';
import { ioButton } from '@io-gui/inputs';
const TERMINAL_COLORS = [
    'red',
    'green',
    'blue',
    'pink',
    'yellow',
    'orange',
    'purple',
    'brown',
    'grey',
    'black',
];
let CircuitsEditor = class CircuitsEditor extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex-direction: column;
        background: rgba(0, 0, 0, 0.85);
        align-items: center;
        justify-content: center;
        flex: 1 1 auto;
        gap: 4px;
        padding: 8px;
      }
      :host > io-button {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;
      }
    `;
    }
    ready() {
        this.changed();
    }
    changed() {
        this.render([
            ioButton({ label: 'Pad', action: () => this._select('pad', 'white') }),
            ...TERMINAL_COLORS.map((c) => ioButton({ label: c, action: () => this._select('terminal', c) })),
            this._modeButton('Line W', 'line', 'white'),
            this._modeButton('Line G', 'line', 'grey'),
            this._modeButton('Delete', 'delete', 'red'),
        ]);
    }
    _modeButton(label, mode, color) {
        return ioButton({ label, action: () => this._select(mode, color) });
    }
    _select(mode, color) {
        this.dispatch('editor-select', { mode, color }, true);
    }
};
CircuitsEditor = __decorate([
    Register
], CircuitsEditor);
export { CircuitsEditor };
export const circuitsEditor = CircuitsEditor.vConstructor;
//# sourceMappingURL=CircuitsEditor.js.map