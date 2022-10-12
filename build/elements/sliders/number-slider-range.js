var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, RegisterIoElement } from '../../core/element.js';
import './slider.js';
let IoNumberSliderRange = class IoNumberSliderRange extends IoElement {
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
    }
    :host > io-slider-range {
      margin-left: var(--io-spacing);
      margin-right: var(--io-spacing);
      flex: 1 1 3em;
      min-width: 3em;
    }
    `;
    }
    static get Properties() {
        return {
            value: {
                type: Array,
                value: [0, 0],
                observe: true,
            },
            step: 0.01,
            conversion: 1,
            min: 0,
            max: 1,
            exponent: 1,
        };
    }
    _onNumberSet(event) {
        const item = event.composedPath()[0];
        if (item === this.$.number0)
            this.value[0] = event.detail.value;
        if (item === this.$.number1)
            this.value[1] = event.detail.value;
        event.detail.value = this.value;
        this.dispatchEvent('object-mutated', { object: this.value }, false, window);
        this.dispatchEvent('value-input', event.detail, false);
    }
    _onSliderSet(event) {
        this.value = event.detail.value;
        this.dispatchEvent('object-mutated', { object: this.value }, false, window);
        this.dispatchEvent('value-input', event.detail, false);
    }
    changed() {
        this.template([
            ['io-number', {
                    id: 'number0',
                    value: this.value[0],
                    step: this.step,
                    conversion: this.conversion,
                    label: this.label,
                    'on-value-input': this._onNumberSet,
                }],
            ['io-slider-range', {
                    id: 'slider',
                    value: this.value,
                    step: this.step,
                    min: this.min,
                    max: this.max,
                    exponent: this.exponent,
                    label: this.label,
                    'on-value-input': this._onSliderSet,
                }],
            ['io-number', {
                    id: 'number1',
                    value: this.value[1],
                    step: this.step,
                    conversion: this.conversion,
                    label: this.label,
                    'on-value-input': this._onNumberSet,
                }],
        ]);
    }
};
IoNumberSliderRange = __decorate([
    RegisterIoElement
], IoNumberSliderRange);
export { IoNumberSliderRange };
//# sourceMappingURL=number-slider-range.js.map