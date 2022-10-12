var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, RegisterIoElement } from '../../core/element.js';
import './slider.js';
let IoNumberSlider = class IoNumberSlider extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      align-self: stretch;
      justify-self: stretch;
      flex-basis: 18em;
    }
    :host > io-number {
      flex: 0 0 3em;
      margin-right: var(--io-spacing);
    }
    :host > io-slider {
      flex: 1 1 3em;
      min-width: 3em;
    }
    `;
    }
    static get Properties() {
        return {
            value: 0,
            step: 0.01,
            conversion: 1,
            min: 0,
            max: 1,
            exponent: 1,
        };
    }
    _onNumberSet(event) {
        this.value = event.detail.value;
        this.dispatchEvent('value-input', event.detail, false);
    }
    _onSliderSet(event) {
        event.detail.value = event.detail.value / this.conversion;
        this.value = event.detail.value;
        this.dispatchEvent('value-input', event.detail, false);
    }
    changed() {
        this.template([
            ['io-number', {
                    id: 'number',
                    value: this.value,
                    step: this.step,
                    conversion: this.conversion,
                    label: this.label,
                    'on-value-input': this._onNumberSet,
                }],
            ['io-slider', {
                    id: 'slider',
                    value: this.value * this.conversion,
                    step: this.step * this.conversion,
                    min: this.min * this.conversion,
                    max: this.max * this.conversion,
                    exponent: this.exponent,
                    label: this.label,
                    'on-value-input': this._onSliderSet,
                }]
        ]);
    }
};
IoNumberSlider = __decorate([
    RegisterIoElement
], IoNumberSlider);
export { IoNumberSlider };
//# sourceMappingURL=number-slider.js.map