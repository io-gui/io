var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty, Property } from '@io-gui/core';
import { MenuOption } from '@io-gui/menus';
import { ioSplit } from './IoSplit.js';
export function sizeToFlex(size) {
    return size === 'auto' ? '1 1 auto' : `0 0 ${size}px`;
}
let IoLayout = class IoLayout extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        position: relative;
        display: flex;
        flex: 1 1 100%;
        max-width: 100%;
        max-height: 100%;
      }
      :host > io-split {
        max-width: 100%;
        max-height: 100%;
      }
      :host[frozen] .io-close-icon,
      :host[frozen] .io-tabs-add-tab {
        display: none;
      }
    `;
    }
    changed() {
        this.render([
            ioSplit({
                split: this.split,
                style: { flex: this.split.flex },
                elements: this.elements,
                addMenuOption: this.addMenuOption,
            })
        ]);
    }
};
__decorate([
    ReactiveProperty({ type: Object })
], IoLayout.prototype, "split", void 0);
__decorate([
    ReactiveProperty(Array)
], IoLayout.prototype, "elements", void 0);
__decorate([
    Property({ type: MenuOption })
], IoLayout.prototype, "addMenuOption", void 0);
__decorate([
    ReactiveProperty({ type: Boolean, value: false, reflect: true })
], IoLayout.prototype, "frozen", void 0);
IoLayout = __decorate([
    Register
], IoLayout);
export { IoLayout };
export const ioLayout = function (arg0) {
    return IoLayout.vConstructor(arg0);
};
//# sourceMappingURL=IoLayout.js.map