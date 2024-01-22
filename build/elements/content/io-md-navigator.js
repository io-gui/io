var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement } from '../../core/element.js';
import { Register } from '../../core/node.js';
import { MenuOptions } from '../menus/models/menu-options.js';
import { Property } from '../../core/internals/property.js';
import './io-selector.js';
let IoMdNavigator = class IoMdNavigator extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        align-items: stretch;
        align-self: stretch;
        overflow: auto;
      }
      :host[menu=left],
      :host[menu=right] {
        flex-direction: row;
      }
      :host > io-menu-tree,
      :host > io-menu-options {
        align-self: stretch;
        border-radius: 0;
        padding: 0;
        border-color: var(--iotBorderColorLight);
      }
      :host > io-menu-options {
        flex: 0 0 auto;
        min-height: calc(var(--iotFieldHeight) - var(--iotBorderWidth));
      }
      :host > io-menu-tree {
        flex: 0 0 auto;
        min-width: 10em;
        overflow-y: auto;
      }
      :host[menu=top] > io-menu-options {
        border-width: 0 0 var(--iotBorderWidth) 0;
      }
      :host[menu=bottom] > io-menu-options {
        border-width: var(--iotBorderWidth) 0 0 0;
      }
      :host > io-menu-options > io-menu-item {
        border-radius: 0;
      }
    `;
    }
    onResized() {
        this.collapsed = this.offsetWidth < this.collapseWidth;
    }
    changed() {
        const sharedMenuConfig = {
            options: this.options,
            slotted: this.slotted,
            depth: this.depth
        };
        this.template([
            this.menu === 'top' ? ['io-menu-options', { horizontal: true, ...sharedMenuConfig }] : null,
            this.menu === 'left' ? ['io-menu-tree', { ...sharedMenuConfig }] : null,
            this.options.last ? ['io-md-view', { src: this.options.last }] : null,
            this.menu === 'right' ? ['io-menu-tree', { ...sharedMenuConfig }] : null,
            this.menu === 'bottom' ? ['io-menu-options', { horizontal: true, direction: 'up', ...sharedMenuConfig }] : null,
        ]);
    }
};
__decorate([
    Property(Array)
], IoMdNavigator.prototype, "slotted", void 0);
__decorate([
    Property({ type: MenuOptions, observe: true })
], IoMdNavigator.prototype, "options", void 0);
__decorate([
    Property({ value: 'none', reflect: true })
], IoMdNavigator.prototype, "menu", void 0);
__decorate([
    Property(Infinity)
], IoMdNavigator.prototype, "depth", void 0);
__decorate([
    Property(false)
], IoMdNavigator.prototype, "collapsed", void 0);
__decorate([
    Property(420)
], IoMdNavigator.prototype, "collapseWidth", void 0);
IoMdNavigator = __decorate([
    Register
], IoMdNavigator);
export { IoMdNavigator };
//# sourceMappingURL=io-md-navigator.js.map