var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveProperty, IoOverlaySingleton } from 'io-core';
import { IoColorBase } from './IoColorBase.js';
import { ioColorSlider } from './IoColorSliders.js';
/**
 * Input element for color displayed as a set of sliders.
 * This element has a singleton instance `IoColorPanelSingleton` used by `IoColorPicker` and other elements.
 **/
let IoColorPanel = class IoColorPanel extends IoColorBase {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      flex-direction: row;
      border: var(--io_border);
      border-color: var(--io_borderColorOutset);
      background-color: var(--io_bgColorLight);
      padding: var(--io_spacing2);
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing2));
    }
    :host:not([expanded]) {
      display: none;
    }
    :host > *:not(:last-child) {
      margin: 0 var(--io_spacing2) 0 0;
    }
    `;
    }
    static get Listeners() {
        return {
            'keydown': 'onKeydown',
            'io-focus-to': 'onIoFocusTo',
        };
    }
    onKeydown(event) {
        if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.expanded = false;
        }
    }
    onIoFocusTo(event) {
        const source = event.detail.source;
        const command = event.detail.command;
        const sliders = Array.from(this.querySelectorAll('[tabindex]'));
        const index = Array.from(sliders).indexOf(source);
        if (command === 'ArrowDown' || (command === 'ArrowLeft' && index === 0)) {
            sliders[sliders.length - 1].focus();
            event.stopPropagation();
        }
        else if (command === 'ArrowUp' || (command === 'ArrowRight' && index === sliders.length - 1)) {
            sliders[0].focus();
            event.stopPropagation();
        }
    }
    onValueInput() {
        this.dispatch('value-input', { property: 'value', value: this.value }, true);
    }
    changed() {
        this.render([
            ioColorSlider({ value: this.value, channel: 'sv', '@value-input': this.onValueInput }),
            ioColorSlider({ value: this.value, channel: 'h', vertical: true, '@value-input': this.onValueInput }),
            this.value.a !== undefined ? ioColorSlider({ value: this.value, channel: 'a', '@value-input': this.onValueInput, vertical: true }) : null,
        ]);
    }
};
__decorate([
    ReactiveProperty({ value: false, reflect: true })
], IoColorPanel.prototype, "expanded", void 0);
IoColorPanel = __decorate([
    Register
], IoColorPanel);
export const IoColorPanelSingleton = new IoColorPanel();
setTimeout(() => {
    IoOverlaySingleton.appendChild(IoColorPanelSingleton);
}, 100);
//# sourceMappingURL=IoColorPanelSingleton.js.map