var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveElement, Property, NodeArray } from '@io-gui/core';
import { ioTab } from './IoTab.js';
import { ioButton } from '@io-gui/inputs';
let IoTabs = class IoTabs extends ReactiveElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        padding-top: var(--io_spacing);
        padding-left: var(--io_spacing);
        padding-right: var(--io_spacing);
        border-bottom: var(--io_border);
        border-bottom-color: var(--io_borderColorStrong);
        background-color: var(--io_bgColorLight);
      }
      :host:has(io-tab:focus) {
        border-bottom-color: var(--io_colorWhite) !important;
      }
      :host io-tab {
        margin-bottom: calc(-1.25 * var(--io_borderWidth));
      }
      :host io-tab:not([selected]) {
        margin-bottom: 0;
      }
      :host io-button {
        flex: 0 0 auto;
        background-image: none !important;
        border-color: transparent !important;
        box-shadow: none !important;
        margin-left: auto;
        opacity: 0.2;
        transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      :host:hover io-button {
        opacity: 0.5;
      }
      :host io-button:hover {
        border-color: transparent !important;
        box-shadow: none !important;
        opacity: 1 !important;
      }
    `;
    }
    constructor(args) {
        super(args);
    }
    tabsMutated() {
        this.mutated();
    }
    onAddTab() {
        this.dispatch('io-add-tab-clicked', undefined, true);
    }
    mutated() {
        this.render([
            ...this.tabs.map(tab => ioTab({ model: tab })),
            ioButton({ icon: 'io:layer_add', action: this.onAddTab }),
        ]);
    }
};
__decorate([
    Property({ type: NodeArray, init: 'this' })
], IoTabs.prototype, "tabs", void 0);
IoTabs = __decorate([
    Register
], IoTabs);
export { IoTabs };
export const ioTabs = function (arg0) {
    return IoTabs.vConstructor(arg0);
};
