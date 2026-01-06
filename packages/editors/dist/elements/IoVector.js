var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty } from '@io-gui/core';
import { ioNumber, ioBoolean } from '@io-gui/inputs';
/**
 * Input element for vector arrays and objects.
 **/
let IoVector = class IoVector extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex: 1 1 auto;
        max-width: 100%;
        overflow: hidden;
      }
      :host > io-number {
        flex: 1 1 auto;
      }
      :host > *:not(:last-child) {
        margin-right: var(--io_spacing);
      }
      :host > io-boolicon {
        flex-shrink: 0;
        padding: var(--io_spacing);
      }
    `;
    }
    _ratios = {};
    _onNumberPointerDown(event) {
        const item = event.composedPath()[0];
        const id = item.id;
        this._ratios = {};
        if (this.linked && this.value[id] !== 0) {
            const value = this.value;
            for (const k of this.keys)
                this._ratios[k] = value[k] / value[id];
        }
    }
    _onNumberValueInput(event) {
        const item = event.composedPath()[0];
        const id = item.id;
        this.value[id] = event.detail.value;
        if (this.linked) {
            for (const k of this.keys) {
                const value = this.value;
                if (k !== id && this._ratios[k])
                    value[k] = value[id] * this._ratios[k];
            }
        }
        if (!this.value._isNode) {
            this.dispatchMutation(this.value);
        }
        this.dispatch('value-input', { property: 'value', value: this.value }, false);
    }
    valueChanged() {
        this.keys.length = 0;
        this.keys.push(...Object.keys(this.value).filter(key => typeof this.value[key] === 'number'));
        debug: if (this.keys.find(k => ['0', '1', '2', '3', 'x', 'y', 'z', 'w', 'r', 'g', 'b', 'a', 'u', 'v'].indexOf(k) === -1)) {
            console.warn('IoVector: Unrecognized vector type!');
        }
    }
    valueMutated() {
        this.debounce(this.changed);
    }
    changed() {
        const vChildren = [];
        for (const k of this.keys) {
            if (this.value[k] !== undefined) {
                vChildren.push(ioNumber({
                    id: k,
                    value: this.value[k],
                    conversion: this.conversion,
                    step: this.step,
                    min: this.min,
                    max: this.max,
                    ladder: this.ladder,
                    '@pointerdown': this._onNumberPointerDown,
                    '@value-input': this._onNumberValueInput,
                }));
            }
        }
        vChildren.push(this.linkable ? ioBoolean({ value: this.bind('linked'), true: 'io:link', false: 'io:unlink' }) : null);
        this.render(vChildren);
    }
};
__decorate([
    ReactiveProperty({ type: Object })
], IoVector.prototype, "value", void 0);
__decorate([
    ReactiveProperty(1)
], IoVector.prototype, "conversion", void 0);
__decorate([
    ReactiveProperty(0.001)
], IoVector.prototype, "step", void 0);
__decorate([
    ReactiveProperty(-Infinity)
], IoVector.prototype, "min", void 0);
__decorate([
    ReactiveProperty(Infinity)
], IoVector.prototype, "max", void 0);
__decorate([
    ReactiveProperty(false)
], IoVector.prototype, "linkable", void 0);
__decorate([
    ReactiveProperty(false)
], IoVector.prototype, "linked", void 0);
__decorate([
    ReactiveProperty(true)
], IoVector.prototype, "ladder", void 0);
__decorate([
    ReactiveProperty({ type: Array, init: null })
], IoVector.prototype, "keys", void 0);
IoVector = __decorate([
    Register
], IoVector);
export { IoVector };
export const ioVector = function (arg0) {
    return IoVector.vConstructor(arg0);
};
//# sourceMappingURL=IoVector.js.map