var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty } from '@io-gui/core';
import { ioNumber } from '@io-gui/inputs';
import { ioSliderRange } from './IoSliderRange.js';
/**
 * Input element for `Array(2)` data type combining `IoNumber` and `IoSliderRange`
 **/
let IoNumberSliderRange = class IoNumberSliderRange extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
    }
    :host > io-number {
      flex: 0 0 3.5em;
    }
    :host > io-slider-range {
      margin-left: var(--io_spacing);
      margin-right: var(--io_spacing);
      flex: 1 1 3.5em;
      min-width: 3.5em;
    }
    `;
    }
    constructor(args = {}) { super(args); }
    _onNumberSet(event) {
        const item = event.composedPath()[0];
        if (item === this.$.number0)
            this.value[0] = event.detail.value;
        if (item === this.$.number1)
            this.value[1] = event.detail.value;
        if (!this.value._isNode) {
            this.dispatchMutation(this.value);
        }
    }
    _onSliderSet(event) {
        this.value = event.detail.value;
        if (!this.value._isNode) {
            this.dispatchMutation(this.value);
        }
    }
    ready() {
        this.changed();
    }
    changed() {
        this.render([
            ioNumber({
                id: 'number0',
                value: this.value[0],
                step: this.step,
                min: this.min,
                max: this.max,
                conversion: this.conversion,
                '@value-input': this._onNumberSet,
            }),
            ioSliderRange({
                id: 'slider',
                value: this.value,
                step: this.step,
                min: this.min,
                max: this.max,
                exponent: this.exponent,
                '@value-input': this._onSliderSet,
            }),
            ioNumber({
                id: 'number1',
                value: this.value[1],
                step: this.step,
                min: this.min,
                max: this.max,
                conversion: this.conversion,
                '@value-input': this._onNumberSet,
            }),
        ]);
    }
};
__decorate([
    ReactiveProperty({ type: Array, init: [0, 0] })
], IoNumberSliderRange.prototype, "value", void 0);
__decorate([
    ReactiveProperty(0.01)
], IoNumberSliderRange.prototype, "step", void 0);
__decorate([
    ReactiveProperty(0)
], IoNumberSliderRange.prototype, "min", void 0);
__decorate([
    ReactiveProperty(1)
], IoNumberSliderRange.prototype, "max", void 0);
__decorate([
    ReactiveProperty(1)
], IoNumberSliderRange.prototype, "exponent", void 0);
__decorate([
    ReactiveProperty(1)
], IoNumberSliderRange.prototype, "conversion", void 0);
IoNumberSliderRange = __decorate([
    Register
], IoNumberSliderRange);
export { IoNumberSliderRange };
export const ioNumberSliderRange = function (arg0) {
    return IoNumberSliderRange.vConstructor(arg0);
};
//# sourceMappingURL=IoNumberSliderRange.js.map