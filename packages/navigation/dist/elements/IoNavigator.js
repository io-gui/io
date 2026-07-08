var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ReactiveElement, Property, Register, div } from '@io-gui/core';
import { Option, ioMenu, ioMenuTree } from '@io-gui/menus';
import { ioSelector } from './IoSelector.js';
import { ioNavigatorDrawer } from './IoNavigatorDrawer.js';
let IoNavigator = class IoNavigator extends ReactiveElement {
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
      :host > io-menu {
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
        if (this.menu !== 'left') {
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
    modelMutated() {
        this.mutated();
    }
    mutated() {
        const sharedMenuConfig = {
            model: this.model,
            widget: this.widget,
            depth: this.depth
        };
        // Selection is derived from the model scope on mutation — no bound projection properties.
        let selected = '';
        if (this.select === 'shallow')
            selected = this.model.getSelectedIDImmediate();
        if (this.select === 'deep') {
            // Derived deep selection — works for Menu roots and branch Options alike.
            const chain = this.model.getSelectedChain();
            selected = chain.length ? chain[chain.length - 1].id : '';
        }
        if (this.select === 'all')
            selected = '*';
        if (this.select === 'none')
            selected = '';
        const selectorElement = ioSelector({ selected: selected, anchor: this.bind('anchor'), caching: this.caching, elements: this.elements });
        const veil = div({ class: 'io-veil', '@click': this.onVeilClick });
        if (this.menu === 'none') {
            this.render([selectorElement]);
        }
        else if (this.menu === 'top') {
            this.render([
                selectorElement,
                ioMenu({ horizontal: true, ...sharedMenuConfig }),
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
    Property({ type: Array, init: null })
], IoNavigator.prototype, "elements", void 0);
__decorate([
    Property({ type: Option })
], IoNavigator.prototype, "model", void 0);
__decorate([
    Property(null)
], IoNavigator.prototype, "widget", void 0);
__decorate([
    Property({ value: 'left', type: String, reflect: true })
], IoNavigator.prototype, "menu", void 0);
__decorate([
    Property({ value: Infinity, type: Number })
], IoNavigator.prototype, "depth", void 0);
__decorate([
    Property({ value: 'shallow', type: String })
], IoNavigator.prototype, "select", void 0);
__decorate([
    Property({ value: 'none', type: String })
], IoNavigator.prototype, "caching", void 0);
__decorate([
    Property({ value: 570, type: Number })
], IoNavigator.prototype, "minWidth", void 0);
__decorate([
    Property({ value: '', type: String })
], IoNavigator.prototype, "anchor", void 0);
__decorate([
    Property({ value: false, type: Boolean, reflect: true })
], IoNavigator.prototype, "collapsed", void 0);
__decorate([
    Property({ value: false, type: Boolean, reflect: true })
], IoNavigator.prototype, "showVeil", void 0);
IoNavigator = __decorate([
    Register
], IoNavigator);
export { IoNavigator };
export const ioNavigator = function (arg0) {
    return IoNavigator.vConstructor(arg0);
};
