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
let IoVectorArray = class IoVectorArray extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex: 1 1 auto;
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
        const index = Number(item.id);
        this.value[index] = event.detail.value;
        if (this.linked) {
            for (const k of this.keys) {
                const value = this.value;
                if (k !== index && this._ratios[k])
                    value[k] = value[index] * this._ratios[k];
            }
        }
        // TODO: this was replaced in earlier commit but not sure why. Nodes should dispatch mutations on their own.
        if (!this.value._isNode) {
            this.dispatchMutation(this.value);
        }
        // Remove this later if no regressions are spotted and no tests are broken.
        // this.dispatchMutation(this.value)
        this.dispatch('value-input', { property: 'value', value: this.value }, false);
    }
    valueChanged() {
        this.keys.length = 0;
        this.keys = Array.from(Array(this.value.length).keys());
        debug: if (this.keys.find(k => [0, 1, 2, 3].indexOf(k) === -1)) {
            console.warn('IoVectorArray: Unrecognized vector type!');
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
                    id: String(k), // Consider removing global id collisions
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
    ReactiveProperty({ type: Array })
], IoVectorArray.prototype, "value", void 0);
__decorate([
    ReactiveProperty(1)
], IoVectorArray.prototype, "conversion", void 0);
__decorate([
    ReactiveProperty(0.001)
], IoVectorArray.prototype, "step", void 0);
__decorate([
    ReactiveProperty(-Infinity)
], IoVectorArray.prototype, "min", void 0);
__decorate([
    ReactiveProperty(Infinity)
], IoVectorArray.prototype, "max", void 0);
__decorate([
    ReactiveProperty(false)
], IoVectorArray.prototype, "linkable", void 0);
__decorate([
    ReactiveProperty(false)
], IoVectorArray.prototype, "linked", void 0);
__decorate([
    ReactiveProperty(true)
], IoVectorArray.prototype, "ladder", void 0);
__decorate([
    ReactiveProperty({ type: Array, init: null })
], IoVectorArray.prototype, "keys", void 0);
IoVectorArray = __decorate([
    Register
], IoVectorArray);
export { IoVectorArray };
export const ioVectorArray = function (arg0) {
    return IoVectorArray.vConstructor(arg0);
};
//# sourceMappingURL=IoVectorArray.js.map