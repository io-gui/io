var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, Property } from 'io-gui';
import './io-slider-range.js';
/**
 * Input element for `Array(2)` data type combining `IoNumber` and `IoSliderRange`
 *
 * <io-element-demo element="io-number-slider-range" properties='{"value": [0, 2], "step": 0.05, "min": -1, "max": 2}'></io-element-demo>
 **/
let IoNumberSliderRange = class IoNumberSliderRange extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      min-width: var(--io_fieldHeight5);
      width: var(--io_fieldHeight10);
    }
    :host > io-number {
      flex: 0 0 3.25em;
    }
    :host > io-slider-range {
      margin-left: var(--io_spacing);
      margin-right: var(--io_spacing);
      flex: 1 1 3.25em;
      min-width: 3.25em;
    }
    `;
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
    init() {
        this.changed();
    }
    changed() {
        this.template([
            ['io-number', {
                    $: 'number0',
                    value: this.value[0],
                    step: this.step,
                    conversion: this.conversion,
                    label: this.label,
                    '@value-input': this._onNumberSet,
                }],
            ['io-slider-range', {
                    $: 'slider',
                    value: this.value,
                    step: this.step,
                    min: this.min,
                    max: this.max,
                    exponent: this.exponent,
                    label: this.label,
                    '@value-input': this._onSliderSet,
                }],
            ['io-number', {
                    $: 'number1',
                    value: this.value[1],
                    step: this.step,
                    conversion: this.conversion,
                    label: this.label,
                    '@value-input': this._onNumberSet,
                }],
        ]);
    }
};
__decorate([
    Property({ type: Array, init: [0, 0] })
], IoNumberSliderRange.prototype, "value", void 0);
__decorate([
    Property(0.01)
], IoNumberSliderRange.prototype, "step", void 0);
__decorate([
    Property(0)
], IoNumberSliderRange.prototype, "min", void 0);
__decorate([
    Property(1)
], IoNumberSliderRange.prototype, "max", void 0);
__decorate([
    Property(1)
], IoNumberSliderRange.prototype, "exponent", void 0);
__decorate([
    Property(1)
], IoNumberSliderRange.prototype, "conversion", void 0);
IoNumberSliderRange = __decorate([
    Register
], IoNumberSliderRange);
export { IoNumberSliderRange };
//# sourceMappingURL=io-number-slider-range.js.map