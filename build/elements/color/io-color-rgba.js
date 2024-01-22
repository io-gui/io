var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { IoColorBase } from './io-color-base.js';
/**
 * Input element for color displayed as vector and an interactive picker.
 **/
let IoColorRgba = class IoColorRgba extends IoColorBase {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex: 0 1 auto;
        min-width: var(--iotFieldHeight4);
        width: var(--iotFieldHeight10);
      }
      :host > io-number {
        flex: 1 0 0;

      }
      :host > io-color-picker {
        flex-shrink: 0;
      }
      :host > *:not(:last-child) {
        margin-right: var(--iotSpacing);
      }
    `;
    }
    _onNumberValueInput(event) {
        const item = event.composedPath()[0];
        const id = item.id;
        const newValue = event.detail.value;
        const oldValue = event.detail.oldValue;
        const value = this.value;
        value[id] = newValue;
        const detail = { object: this.value, property: id, value: value, oldValue: oldValue };
        this.dispatchEvent('object-mutated', detail, false, window);
    }
    changed() {
        this.template([
            // Consider removing global id collisions.
            ['io-number', { $: 'r', id: 'r', value: this.value.r, min: 0, max: 1, step: 0.0001, ladder: true, '@value-input': this._onNumberValueInput }],
            ['io-number', { $: 'g', id: 'g', value: this.value.g, min: 0, max: 1, step: 0.0001, ladder: true, '@value-input': this._onNumberValueInput }],
            ['io-number', { $: 'b', id: 'b', value: this.value.b, min: 0, max: 1, step: 0.0001, ladder: true, '@value-input': this._onNumberValueInput }],
            this.value.a !== undefined ? ['io-number', { $: 'a', id: 'a', value: this.value.a, min: 0, max: 1, step: 0.0001, ladder: true, '@value-input': this._onNumberValueInput }] : null,
            ['io-color-picker', { $: 'swatch', value: this.value }],
        ]);
    }
};
IoColorRgba = __decorate([
    Register
], IoColorRgba);
export { IoColorRgba };
//# sourceMappingURL=io-color-rgba.js.map