var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, NodeArray, ReactiveProperty } from '@io-gui/core';
import { IoField } from '@io-gui/inputs';
import { ioIcon } from '@io-gui/icons';
import { IoTabsHamburgerMenuSingleton } from './IoTabsHamburgerMenuSingleton.js';
let IoTabsHamburger = class IoTabsHamburger extends IoField {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex-shrink: 0;
      }
    `;
    }
    constructor(args) { super(args); }
    onClick() {
        IoTabsHamburgerMenuSingleton.expand({
            source: this,
            direction: 'over',
            tabs: this.tabs,
            onEditTab: this.onEditTab,
        });
    }
    onEditTab(event) {
        this.dispatch('io-edit-tab', { tab: event.detail.tab, key: event.detail.key }, true);
    }
    changed() {
        this.render([
            ioIcon({ value: 'io:hamburger' })
        ]);
    }
};
__decorate([
    ReactiveProperty({ type: NodeArray, init: 'this' })
], IoTabsHamburger.prototype, "tabs", void 0);
IoTabsHamburger = __decorate([
    Register
], IoTabsHamburger);
export { IoTabsHamburger };
export const ioTabsHamburger = function (arg0) {
    return IoTabsHamburger.vConstructor(arg0);
};
//# sourceMappingURL=IoTabsHamburger.js.map