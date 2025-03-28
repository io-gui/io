var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, Property } from 'io-gui';
import './io-slider.js';
/**
 * Input element for `Number` data type combining `IoNumber` and `IoSlider`
 *
 * <io-element-demo element="io-number-slider" properties='{"value": 0, "step": 0.01, "conversion": 1, "min": -0.5, "max": 0.5, "exponent": 1}'></io-element-demo>
 * <io-element-demo element="io-number-slider" properties='{"value": 0, "step": 0.2617993877991494, "conversion": 57.29577951308232, "min": -6.283185307179586, "max": 6.283185307179586, "exponent": 1}'></io-element-demo>
 * <io-element-demo element="io-number-slider" properties='{"value": 0, "step": 0.1, "conversion": 0.2, "min": -0.5, "max": 0.5, "exponent": 1}'></io-element-demo>
 **/
let IoNumberSlider = class IoNumberSlider extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      min-width: var(--io_fieldHeight5);
      width: var(--io_fieldHeight10);
    }
    :host > io-number {
      flex: 0 0 3.25em;
      margin-right: var(--io_spacing);
    }
    :host > io-slider {
      flex: 1 1 3em;
      min-width: 3em;
    }
    `;
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
    init() {
        this.changed();
    }
    changed() {
        this.template([
            ['io-number', {
                    $: 'number',
                    value: this.value,
                    step: this.step,
                    conversion: this.conversion,
                    label: this.label,
                    '@value-input': this._onNumberSet,
                }],
            ['io-slider', {
                    $: 'slider',
                    value: this.value * this.conversion,
                    step: this.step * this.conversion,
                    min: this.min * this.conversion,
                    max: this.max * this.conversion,
                    exponent: this.exponent,
                    label: this.label,
                    '@value-input': this._onSliderSet,
                }]
        ]);
    }
};
__decorate([
    Property({ value: 0 })
], IoNumberSlider.prototype, "value", void 0);
__decorate([
    Property(0.01)
], IoNumberSlider.prototype, "step", void 0);
__decorate([
    Property(0)
], IoNumberSlider.prototype, "min", void 0);
__decorate([
    Property(1)
], IoNumberSlider.prototype, "max", void 0);
__decorate([
    Property(1)
], IoNumberSlider.prototype, "exponent", void 0);
__decorate([
    Property(1)
], IoNumberSlider.prototype, "conversion", void 0);
IoNumberSlider = __decorate([
    Register
], IoNumberSlider);
export { IoNumberSlider };
//# sourceMappingURL=io-number-slider.js.map