var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty, Property } from '@io-gui/core';
import { ioNumber, ioBoolean } from '@io-gui/inputs';
let IoVectorBase = class IoVectorBase extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex: 1 1 auto;
        max-width: 100%;
        overflow: hidden;
      }
      :host > io-number {
        flex: 1 1 0;
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
    constructor(args) {
        super(args);
    }
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
    }
    valueMutated() {
        this.debounce(this.changed);
    }
    changed() {
        const vChildren = [];
        for (const k of this.keys) {
            const value = this.value[k];
            if (value !== undefined) {
                vChildren.push(ioNumber({
                    id: k,
                    value: value,
                    conversion: this.conversion,
                    step: this.step,
                    min: this.min,
                    max: this.max,
                    ladder: this.ladder,
                    disabled: this.disabled,
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
    ReactiveProperty({ type: Object, init: null })
], IoVectorBase.prototype, "value", void 0);
__decorate([
    ReactiveProperty(1)
], IoVectorBase.prototype, "conversion", void 0);
__decorate([
    ReactiveProperty(0.001)
], IoVectorBase.prototype, "step", void 0);
__decorate([
    ReactiveProperty(-Infinity)
], IoVectorBase.prototype, "min", void 0);
__decorate([
    ReactiveProperty(Infinity)
], IoVectorBase.prototype, "max", void 0);
__decorate([
    ReactiveProperty(false)
], IoVectorBase.prototype, "linkable", void 0);
__decorate([
    ReactiveProperty(false)
], IoVectorBase.prototype, "linked", void 0);
__decorate([
    ReactiveProperty(true)
], IoVectorBase.prototype, "ladder", void 0);
__decorate([
    ReactiveProperty(false)
], IoVectorBase.prototype, "disabled", void 0);
__decorate([
    Property([])
], IoVectorBase.prototype, "keys", void 0);
IoVectorBase = __decorate([
    Register
], IoVectorBase);
export { IoVectorBase };
//# sourceMappingURL=IoVectorBase.js.map