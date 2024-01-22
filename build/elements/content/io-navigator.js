var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement } from '../../core/element.js';
import { Register } from '../../core/node.js';
import { MenuOptions } from '../menus/models/menu-options.js';
import { MenuItem } from '../menus/models/menu-item.js';
import { Property } from '../../core/internals/property.js';
import './io-selector.js';
let IoNavigator = class IoNavigator extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex-direction: column;
        overflow: auto;
        flex: 1 1 auto;
      }
      :host[menu=left],
      :host[menu=right] {
        flex-direction: row;
      }
      :host > io-menu-tree,
      :host > io-menu-options {
        align-self: stretch;
        border-radius: 0;
        border-color: var(--iotBorderColorLight);
      }
      :host[collapsed] > io-menu-options {
        min-height: calc(var(--iotFieldHeight) + 1em);
        padding: calc(var(--iotSpacing) + 0.5em) !important;
      }
      :host[collapsed] > io-menu-options > io-menu-item.hamburger {
        top: 0;
        padding: calc(var(--iotSpacing) + 0.5em);
        padding-right: calc(var(--iotSpacing2) + 0.5em);
        min-height: calc(var(--iotFieldHeight) + 1em);
        background-color: transparent;
      }
      :host > io-menu-options {
        flex: 0 0 auto;
        padding: 0;
      }
      :host > io-menu-tree {
        flex: 0 0 auto;
        min-width: 10em;
        overflow-y: auto;
        padding: var(--iotBorderWidth) 0;
      }
      :host[menu=left] > io-menu-tree {
        border-width: 0 var(--iotBorderWidth) 0 0;
      }
      :host[menu=left] > io-menu-tree {
        border-width: 0 var(--iotBorderWidth) 0 0;
      }
      :host > io-menu-item.hamburger {
        border-radius: 0;
        padding: calc(var(--iotSpacing) + 0.5em);
        height: 100%;
        flex: 0 0 auto;
        background-color: var(--iotBackgroundColorDimmed);
        border-color: transparent !important;
      }
      :host > io-menu-item.hamburger > .hasmore {
        display: none;
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
      :host > io-selector {
        overflow: auto;
        flex: 1 1 auto;
        max-height: 100%;
      }
      /* :host > io-selector, */
      :host > io-scroller,
      :host > io-scroller > io-selector {
        flex: 1 1 auto;
      }
      :host > io-scroller > io-selector {
        overflow: unset !important;
      }
    `;
    }
    init() {
        this.throttle(this._computeCollapsed);
        this.changed();
    }
    onResized() {
        this.throttle(this._computeCollapsed);
    }
    _computeCollapsed() {
        this.collapsed = this.offsetWidth < this.collapseWidth;
    }
    changed() {
        const sharedMenuConfig = {
            options: this.options,
            slotted: this.slotted,
            depth: this.depth
        };
        const contentNavigation = ['io-scroller', { options: this.options }, [
                ['io-selector', { options: this.options, cache: this.cache, precache: this.precache, select: this.select, elements: this.elements }]
            ]];
        const hamburger = ['io-menu-item', {
                depth: this.depth,
                role: 'navigation',
                class: 'hamburger',
                direction: this.menu === 'left' ? 'right' : 'left',
                item: new MenuItem({
                    label: '',
                    icon: 'icons:hamburger',
                    options: this.options,
                })
            }];
        if (this.menu === 'top') {
            this.template([
                ['io-menu-options', { horizontal: true, noPartialCollapse: this.collapsed, ...sharedMenuConfig }],
                contentNavigation,
            ]);
        }
        else if (this.menu === 'left') {
            this.template([
                this.collapsed ? hamburger : ['io-menu-tree', { ...sharedMenuConfig }],
                contentNavigation,
            ]);
        }
        else if (this.menu === 'bottom') {
            this.template([
                contentNavigation,
                ['io-menu-options', { horizontal: true, noPartialCollapse: this.collapsed, direction: 'up', ...sharedMenuConfig }],
            ]);
        }
        else if (this.menu === 'right') {
            this.template([
                contentNavigation,
                this.collapsed ? hamburger : ['io-menu-tree', { ...sharedMenuConfig }],
            ]);
        }
    }
};
__decorate([
    Property(Array)
], IoNavigator.prototype, "slotted", void 0);
__decorate([
    Property(Array)
], IoNavigator.prototype, "elements", void 0);
__decorate([
    Property({ type: MenuOptions, observe: true })
], IoNavigator.prototype, "options", void 0);
__decorate([
    Property({ value: 'left', reflect: true })
], IoNavigator.prototype, "menu", void 0);
__decorate([
    Property('first')
], IoNavigator.prototype, "select", void 0);
__decorate([
    Property('select')
], IoNavigator.prototype, "mode", void 0);
__decorate([
    Property(Infinity)
], IoNavigator.prototype, "depth", void 0);
__decorate([
    Property(false)
], IoNavigator.prototype, "cache", void 0);
__decorate([
    Property(false)
], IoNavigator.prototype, "precache", void 0);
__decorate([
    Property({ value: false, reflect: true })
], IoNavigator.prototype, "collapsed", void 0);
__decorate([
    Property(580)
], IoNavigator.prototype, "collapseWidth", void 0);
IoNavigator = __decorate([
    Register
], IoNavigator);
export { IoNavigator };
//# sourceMappingURL=io-navigator.js.map