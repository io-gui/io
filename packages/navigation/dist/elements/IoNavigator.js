var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, ReactiveProperty, Register } from 'io-core';
import { MenuOption, ioMenuOptions, ioMenuTree } from 'io-menus';
import { ioSelector } from './IoSelector.js';
let IoNavigator = class IoNavigator extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
      }
      :host[menu=left],
      :host[menu=right] {
        flex-direction: row;
      }
      :host > io-menu-tree {
        align-self: stretch;
        flex: 0 0 auto;
        min-width: 10em;
        border: var(--io_border);
        overflow-y: auto;
        border-radius: 0;
      }
      :host[menu=left] > io-menu-tree {
        border-width: 0 var(--io_borderWidth) 0 0;
      }
      :host[menu=left] > io-menu-tree {
        border-width: 0 var(--io_borderWidth) 0 0;
      }
      :host > io-menu-options {
        border: none;
        border-bottom: var(--io_border);
        border-radius: 0;
      }
    `;
    }
    optionMutated() {
        this.changed();
    }
    changed() {
        const sharedMenuConfig = {
            option: this.option,
            widget: this.widget,
            depth: this.depth
        };
        // TODO: add widget and test collapse!!
        let selected = '';
        if (this.select === 'shallow')
            selected = this.option.selectedIDImmediate;
        if (this.select === 'deep')
            selected = this.option.selectedID;
        if (this.select === 'all')
            selected = '*';
        if (this.select === 'none')
            selected = '';
        if (this.menu === 'top') {
            this.render([
                ioMenuOptions({ horizontal: true, ...sharedMenuConfig }),
                ioSelector({ selected: selected, anchor: this.bind('anchor'), caching: this.caching, elements: this.elements }),
            ]);
        }
        else if (this.menu === 'left') {
            this.render([
                ioMenuTree({ ...sharedMenuConfig }),
                ioSelector({ selected: selected, anchor: this.bind('anchor'), caching: this.caching, elements: this.elements }),
            ]);
        }
        else if (this.menu === 'right') {
            this.render([
                ioSelector({ selected: selected, anchor: this.bind('anchor'), caching: this.caching, elements: this.elements }),
                ioMenuTree({ ...sharedMenuConfig }),
            ]);
        }
    }
};
__decorate([
    ReactiveProperty(Array)
], IoNavigator.prototype, "elements", void 0);
__decorate([
    ReactiveProperty({ type: MenuOption })
], IoNavigator.prototype, "option", void 0);
__decorate([
    ReactiveProperty(null)
], IoNavigator.prototype, "widget", void 0);
__decorate([
    ReactiveProperty({ value: 'left', type: String, reflect: true })
], IoNavigator.prototype, "menu", void 0);
__decorate([
    ReactiveProperty({ value: Infinity, type: Number })
], IoNavigator.prototype, "depth", void 0);
__decorate([
    ReactiveProperty({ value: 'shallow', type: String })
], IoNavigator.prototype, "select", void 0);
__decorate([
    ReactiveProperty({ value: 'none', type: String })
], IoNavigator.prototype, "caching", void 0);
__decorate([
    ReactiveProperty({ value: '', type: String })
], IoNavigator.prototype, "anchor", void 0);
IoNavigator = __decorate([
    Register
], IoNavigator);
export { IoNavigator };
export const ioNavigator = function (arg0) {
    return IoNavigator.vConstructor(arg0);
};
//# sourceMappingURL=IoNavigator.js.map