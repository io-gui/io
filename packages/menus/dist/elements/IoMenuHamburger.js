var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ReactiveProperty, Register } from '@io-gui/core';
import { ioIcon } from '@io-gui/icons';
import { IoMenuItem } from './IoMenuItem.js';
let IoMenuHamburger = class IoMenuHamburger extends IoMenuItem {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex-shrink: 0;
      }
      :host > * {
        pointer-events: none;
        text-overflow: ellipsis;
      }
    `;
    }
    changed() {
        this.render([ioIcon({ value: 'io:hamburger' })]);
    }
};
__decorate([
    ReactiveProperty({ value: 'down', reflect: true })
], IoMenuHamburger.prototype, "direction", void 0);
IoMenuHamburger = __decorate([
    Register
], IoMenuHamburger);
export { IoMenuHamburger };
export const ioMenuHamburger = IoMenuHamburger.vConstructor;
//# sourceMappingURL=IoMenuHamburger.js.map