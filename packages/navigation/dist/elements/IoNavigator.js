var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, ReactiveProperty, Register, div } from '@io-gui/core';
import { MenuOption, ioMenuOptions, ioMenuTree } from '@io-gui/menus';
import { ioSelector } from './IoSelector.js';
import { ioNavigatorDrawer } from './IoNavigatorDrawer.js';
let IoNavigator = class IoNavigator extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex: 1 1 100%;
        max-width: 100%;
        max-height: 100%;
        position: relative;
        overflow: hidden;
        flex-direction: row-reverse;
      }
      :host[menu='top'] {
        flex-direction: column-reverse;
      }
      :host > io-menu-tree {
        align-self: stretch;
        flex: 0 0 auto;
        min-width: 10em;
        border: var(--io_border);
        overflow-y: auto;
        border-radius: 0;
      }
      :host > io-menu-tree {
        border-width: 0 var(--io_borderWidth) 0 0;
      }
      :host > io-menu-options {
        border: none;
        border-bottom: var(--io_border);
        border-radius: 0;
      }
      :host > .io-veil {
        position: absolute;
        opacity: 0;
        transition: opacity 0.125s ease-out;
        background-color: rgba(0, 0, 0, 1);
        pointer-events: none;
        inset: 0;
      }
      :host[showveil] > .io-veil {
        display: block;
        opacity: 0.5;
        pointer-events: auto;
        cursor: pointer;
      }
    `;
    }
    static get Listeners() {
        return {
            'io-drawer-expanded-changed': 'onDrawerExpandedChanged',
        };
    }
    onResized() {
        this.debounce(this.calculateCollapsedDebounced);
    }
    calculateCollapsedDebounced() {
        this.calculateCollapsed();
    }
    calculateCollapsed() {
        if (this.menu === 'top') {
            this.collapsed = false;
            return;
        }
        const rect = this.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0)
            return;
        this.collapsed = rect.width < this.minWidth;
    }
    onDrawerExpandedChanged(event) {
        event.stopPropagation();
        const srcDrawer = event.detail.element;
        this.showVeil = srcDrawer.expanded;
    }
    collapseDrawer() {
        const drawer = this.querySelector('io-navigator-drawer');
        if (drawer)
            drawer.expanded = false;
    }
    onVeilClick(event) {
        event.stopPropagation();
        this.collapseDrawer();
    }
    collapsedChanged() {
        this.collapseDrawer();
    }
    menuChanged() {
        this.calculateCollapsed();
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
        let selected = '';
        if (this.select === 'shallow')
            selected = this.option.selectedIDImmediate;
        if (this.select === 'deep')
            selected = this.option.selectedID;
        if (this.select === 'all')
            selected = '*';
        if (this.select === 'none')
            selected = '';
        const selectorElement = ioSelector({ selected: selected, anchor: this.bind('anchor'), caching: this.caching, elements: this.elements });
        const veil = div({ class: 'io-veil', '@click': this.onVeilClick });
        if (this.menu === 'top') {
            this.render([
                selectorElement,
                ioMenuOptions({ horizontal: true, ...sharedMenuConfig }),
            ]);
        }
        else if (this.menu === 'left') {
            if (this.collapsed) {
                this.render([
                    selectorElement,
                    veil,
                    ioNavigatorDrawer({
                        direction: 'left',
                        menuContent: ioMenuTree({ ...sharedMenuConfig }),
                    }),
                ]);
            }
            else {
                this.render([
                    selectorElement,
                    ioMenuTree({ ...sharedMenuConfig }),
                ]);
            }
        }
    }
};
__decorate([
    ReactiveProperty({ type: Array, init: null })
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
    ReactiveProperty({ value: 570, type: Number })
], IoNavigator.prototype, "minWidth", void 0);
__decorate([
    ReactiveProperty({ value: '', type: String })
], IoNavigator.prototype, "anchor", void 0);
__decorate([
    ReactiveProperty({ value: false, type: Boolean, reflect: true })
], IoNavigator.prototype, "collapsed", void 0);
__decorate([
    ReactiveProperty({ value: false, type: Boolean, reflect: true })
], IoNavigator.prototype, "showVeil", void 0);
IoNavigator = __decorate([
    Register
], IoNavigator);
export { IoNavigator };
export const ioNavigator = function (arg0) {
    return IoNavigator.vConstructor(arg0);
};
//# sourceMappingURL=IoNavigator.js.map