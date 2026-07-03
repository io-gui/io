var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, span } from '@io-gui/core';
import { IoField } from '@io-gui/inputs';
import { ioIcon } from '@io-gui/icons';
import { Tab } from '../nodes/Tab.js';
// TODO: fix and improve keyboard navigation in all cases.
let IoTab = class IoTab extends IoField {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        position: relative;
        height: inherit;
        min-height: inherit;
        /* TODO: use vars for this */
        min-width: calc(var(--io_fieldHeight) * 1.25);
        margin: 0;
        margin-right: var(--io_spacing);
        background-color: var(--io_bgColor) !important;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-color: var(--io_borderColorLight);
        padding-right: calc(var(--io_lineHeight) / 2);
        padding-left: calc(var(--io_lineHeight) / 2);
        border-bottom-color: var(--io_borderColorStrong);
      }
      :host[pressed] {
        border-color: unset !important;
        box-shadow: unset !important;
      }
      :host[selected] {
        color: var(--io_colorStrong);
        background-color: var(--io_bgColorLight) !important;
        border-color: var(--io_borderColorStrong);
        border-bottom-color: var(--io_bgColorLight);
      }
      :host[selected]:focus {
        color: var(--io_colorWhite);
      }
      :host > .io-icon:not([value=' ']) {
        margin: 0 var(--io_spacing2) 0 0;
      }
      :host > span {
        padding: 0 var(--io_spacing);
        overflow: hidden; 
        text-overflow: ellipsis !important;
      }
      :host > * {
        pointer-events: none;
        display: inline-block;
        white-space: nowrap;
      }
    `;
    }
    constructor(args) { super(args); }
    onResized() {
        const span = this.querySelector('span');
        this.overflow = span.scrollWidth > span.clientWidth;
    }
    onClick() {
        this.dispatch('io-tab-action', { tab: this.tab, action: 'Select' }, true);
    }
    onKeydown(event) {
        // if (event.shiftKey && ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
        //   event.preventDefault()
        //   this.dispatch('io-tab-action', {tab: this.tab, action: event.key}, true)
        // } else {
        // }
        super.onKeydown(event);
    }
    tabMutated() {
        this.mutated();
    }
    mutated() {
        this.setAttribute('selected', this.tab.selected);
        this.setAttribute('title', this.tab.label);
        this.render([
            this.tab.icon ? ioIcon({ value: this.tab.icon }) : null,
            span({ class: 'io-tab-label' }, this.tab.label),
        ]);
    }
};
__decorate([
    Property({ type: Tab })
], IoTab.prototype, "tab", void 0);
__decorate([
    Property({ type: Boolean, reflect: true })
], IoTab.prototype, "overflow", void 0);
IoTab = __decorate([
    Register
], IoTab);
export { IoTab };
export const ioTab = function (arg0) {
    return IoTab.vConstructor(arg0);
};
