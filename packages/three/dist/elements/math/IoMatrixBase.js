var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, Property, ReactiveProperty } from '@io-gui/core';
import { ioNumber } from '@io-gui/inputs';
/**
 * Input element for vector arrays and objects.
 **/
let IoMatrixBase = class IoMatrixBase extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: grid;
        align-self: stretch;
        justify-self: stretch;
        grid-gap: var(--io_spacing);
        max-width: 100%;
        overflow: hidden;
        flex: 1 1 auto;
      }
      :host > io-number {
        flex: 1 1 auto;
      }
      :host > *:not(:last-child) {
        margin-right: 0;
      }
      :host > io-boolicon {
        flex-shrink: 0;
        padding: var(--io_spacing);
      }
    `;
    }
    constructor(args) {
        super(args);
    }
    _onNumberValueInput(event) {
        const item = event.composedPath()[0];
        this.value[item.id] = event.detail.value;
        if (!this.value._isNode) {
            this.dispatchMutation(this.value);
        }
        // TODO: Rewise and normalize 'value-input' event
        this.dispatch('value-input', { property: item.id, value: this.value }, false);
    }
    valueChanged() {
        this.keys.length = 0;
        this.keys = Array.from(Array(this.value.length).keys());
    }
    valueMutated() {
        this.debounce(this.changed);
    }
    changed() {
        const vChildren = [];
        for (const k of this.keys) {
            if (this.value[k] !== undefined) {
                vChildren.push(ioNumber({
                    id: String(k),
                    value: this.value[k],
                    step: 0.00001,
                    disabled: this.disabled,
                    '@value-input': this._onNumberValueInput,
                }));
            }
        }
        this.render(vChildren);
    }
};
__decorate([
    ReactiveProperty({ type: Array })
], IoMatrixBase.prototype, "value", void 0);
__decorate([
    ReactiveProperty({ value: false, type: Boolean })
], IoMatrixBase.prototype, "disabled", void 0);
__decorate([
    Property({ type: Array, init: null })
], IoMatrixBase.prototype, "keys", void 0);
IoMatrixBase = __decorate([
    Register
], IoMatrixBase);
export { IoMatrixBase };
//# sourceMappingURL=IoMatrixBase.js.map