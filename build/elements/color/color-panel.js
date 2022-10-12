var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, RegisterIoElement } from '../../core/element.js';
import { IoLayerSingleton } from '../../core/layer.js';
import { IoColorMixin } from './color.js';
/*
 * Extends `IoColorMixin(IoElement)`.
 *
 * Input element for color displayed as a set of sliders.
 *
 * <io-element-demo element="io-color-panel"
 * width= "192px"
 * height= "128px"
 * properties='{"mode": 0, "value": [1, 0.5, 0, 1], "horizontal": true}'
 * config='{"value": ["io-properties"], "mode": ["io-option-menu", {"options": [{"value": 0, "label": "0 - rgb"}, {"value": 1, "label": "1 - hsv"}, {"value": 2, "label": "2 - hsl"}, {"value": 3, "label": "3 - cmyk"}]}]}
 * '></io-element-demo>
 *
 * ## `IoColorPanelSingleton`
 *
 * Implements `IoColorPanel` and `IoLayerSingleton`.
 *
 * A singleton instance of `IoColorPanel` floating inside `IoLayerSingleton`. It is used by `IoColorPicker` and other elements.
 **/
let IoColorPanel = class IoColorPanel extends IoColorMixin(IoElement) {
    static get Style() {
        return /* css */ `
    :host {
      @apply --io-panel;
      display: flex;
      cursor: move;
      align-items: stretch;
      min-width: var(--io-line-height);
      min-height: var(--io-line-height);
      flex-direction: column;
    }
    :host:not([expanded]) {
      display: none;
    }
    :host[horizontal] {
      flex-direction: row;
    }
    :host > * {
      border-radius: calc(var(--io-border-radius) - var(--io-border-width));
    }
    :host > io-color-slider-sl,
    :host > io-color-slider-sv {
      flex: 1 1;
    }
    :host > *:not(:last-child) {
      margin: 0 0 var(--io-spacing) 0;
    }
    :host[horizontal] > *:not(:last-child) {
      margin: 0 var(--io-spacing) 0 0;
    }
    `;
    }
    static get Properties() {
        return {
            expanded: {
                type: Boolean,
                reflect: 'prop',
            },
            horizontal: {
                value: true,
                reflect: 'prop',
            },
        };
    }
    static get Listeners() {
        return {
            'keydown': '_onKeydown',
        };
    }
    _onKeydown(event) {
        if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.expanded = false;
        }
    }
    onValueSet() {
        this.dispatchEvent('value-input', { property: 'value', value: this.value }, true);
    }
    changed() {
        this.template([
            this.mode === 2 ?
                ['io-color-slider-sl', { value: this.value, mode: this.mode, 'on-value-input': this.onValueSet }] :
                ['io-color-slider-sv', { value: this.value, mode: this.mode, 'on-value-input': this.onValueSet }],
            ['io-color-slider-hue', { value: this.value, mode: this.mode, 'on-value-input': this.onValueSet, horizontal: !this.horizontal }],
            this.alpha !== undefined ? ['io-color-slider-alpha', { value: this.value, 'on-value-input': this.onValueSet, horizontal: !this.horizontal }] : null,
        ]);
    }
};
IoColorPanel = __decorate([
    RegisterIoElement
], IoColorPanel);
export { IoColorPanel };
export const IoColorPanelSingleton = new IoColorPanel();
IoLayerSingleton.appendChild(IoColorPanelSingleton);
//# sourceMappingURL=color-panel.js.map