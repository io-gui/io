var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty } from '@io-gui/core';
import { ioNumber } from '@io-gui/inputs';
import { ioSlider } from './IoSlider.js';
/**
 * Input element for `Number` data type combining `IoNumber` and `IoSlider`
 **/
let IoNumberSlider = class IoNumberSlider extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
    }
    :host > io-number {
      flex: 0 0 3.8em;
      margin-right: var(--io_spacing);
    }
    :host > io-slider {
      flex: 1 1 3em;
      min-width: 3em;
    }
    `;
    }
    constructor(args = {}) { super(args); }
    _onNumberSet(event) {
        this.value = event.detail.value;
        this.dispatch('value-input', event.detail, false);
    }
    _onSliderSet(event) {
        event.detail.value = event.detail.value / this.conversion;
        this.value = event.detail.value;
        this.dispatch('value-input', event.detail, false);
    }
    ready() {
        this.changed();
    }
    changed() {
        this.render([
            ioNumber({
                id: 'number',
                value: this.value,
                step: this.step,
                conversion: this.conversion,
                '@value-input': this._onNumberSet,
            }),
            ioSlider({
                id: 'slider',
                value: this.value * this.conversion,
                step: this.step * this.conversion,
                min: this.min * this.conversion,
                max: this.max * this.conversion,
                exponent: this.exponent,
                '@value-input': this._onSliderSet,
            }),
        ]);
    }
};
__decorate([
    ReactiveProperty({ value: 0 })
], IoNumberSlider.prototype, "value", void 0);
__decorate([
    ReactiveProperty(0.01)
], IoNumberSlider.prototype, "step", void 0);
__decorate([
    ReactiveProperty(0)
], IoNumberSlider.prototype, "min", void 0);
__decorate([
    ReactiveProperty(1)
], IoNumberSlider.prototype, "max", void 0);
__decorate([
    ReactiveProperty(1)
], IoNumberSlider.prototype, "exponent", void 0);
__decorate([
    ReactiveProperty(1)
], IoNumberSlider.prototype, "conversion", void 0);
IoNumberSlider = __decorate([
    Register
], IoNumberSlider);
export { IoNumberSlider };
export const ioNumberSlider = function (arg0) {
    return IoNumberSlider.vConstructor(arg0);
};
//# sourceMappingURL=IoNumberSlider.js.map