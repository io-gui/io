var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty, Property, NodeArray } from '@io-gui/core';
import { MenuOption, ioMenuItem } from '@io-gui/menus';
import { ioTab } from './IoTab.js';
import { ioTabsHamburger } from './IoTabsHamburger.js';
let IoTabs = class IoTabs extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        background-color: var(--io_bgColorStrong);
        padding-top: var(--io_spacing);
        padding-left: var(--io_spacing);
        padding-right: var(--io_spacing);
      }
      :host io-tab {
        transition: opacity 2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      :host:not([overflow="-1"]) io-tab {
        /* TODO: make niceer animations */
        pointer-events: none;
        opacity: 0;
      }
      :host[overflow="-1"] io-tabs-hamburger {
        /* TODO: make niceer animations */
        display: none;
      }
      :host > io-tabs-hamburger {
        margin-bottom: var(--io_spacing);
        /* transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1); */
      }
      :host > io-menu-item {
        margin-left: auto;
        flex-shrink: 0;
        opacity: 0.125;
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity linear 0.2s;
      }
      :host > io-menu-item:focus,
      :host > io-menu-item:hover {
        opacity: 1;
      }
      :host > io-menu-item > .label,
      :host > io-menu-item > .icon,
      :host > io-menu-item > .hasmore {
        display: none;
      }
    `;
    }
    constructor(args) { super(args); }
    tabsMutated() {
        this.changed();
        this.overflow = -1;
        this.onResized();
    }
    onResized() {
        const addMenu = this.querySelector('.add-tab');
        // TODO: It appears that addMenu rect is required for overflow calculation to work correctly.
        // But it is not guaranteed to be available since addMenuOptions is optional. Fix!
        if (!addMenu)
            return;
        const rect = this.getBoundingClientRect();
        const addMenuRect = addMenu.getBoundingClientRect();
        if (this.overflow === -1) {
            if (addMenuRect.right > rect.right) {
                this.overflow = rect.width;
            }
        }
        else if (rect.width > (this.overflow + 32)) {
            this.overflow = -1;
        }
    }
    changed() {
        const hasOptions = this.addMenuOption && this.addMenuOption.options?.length > 0;
        this.render([
            ioTabsHamburger({ tabs: this.tabs }),
            ...this.tabs.map(tab => ioTab({ tab: tab })),
            hasOptions ? ioMenuItem({
                class: 'add-tab',
                icon: 'io:box_fill_plus',
                direction: 'down',
                option: this.addMenuOption,
            }) : null,
        ]);
    }
};
__decorate([
    ReactiveProperty({ type: NodeArray, init: 'this' })
], IoTabs.prototype, "tabs", void 0);
__decorate([
    ReactiveProperty({ type: Number, value: -1, reflect: true })
], IoTabs.prototype, "overflow", void 0);
__decorate([
    Property({ type: MenuOption })
], IoTabs.prototype, "addMenuOption", void 0);
IoTabs = __decorate([
    Register
], IoTabs);
export { IoTabs };
export const ioTabs = function (arg0) {
    return IoTabs.vConstructor(arg0);
};
//# sourceMappingURL=IoTabs.js.map