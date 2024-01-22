var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { IoMenuItem } from './io-menu-item.js';
let IoMenuHamburger = class IoMenuHamburger extends IoMenuItem {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        user-select: none;
      }
      :host > * {
        pointer-events: none;
        text-overflow: ellipsis;
      }
    `;
    }
    changed() {
        if (this.$options !== undefined && this.item.options) {
            this.$options.options = this.item.options;
        }
        this.setAttribute('selected', this.item.selected);
        this.setAttribute('hidden', this.item.hidden);
        this.disabled = this.item.disabled; // TODO: reconsider this
        this.template([['io-icon', { icon: 'icons:hamburger' }]]);
    }
};
IoMenuHamburger = __decorate([
    Register
], IoMenuHamburger);
export { IoMenuHamburger };
//# sourceMappingURL=io-menu-hamburger.js.map