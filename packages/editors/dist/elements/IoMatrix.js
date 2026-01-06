var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveProperty } from '@io-gui/core';
import { IoVectorArray } from './IoVectorArray.js';
/**
 * Input element for vector arrays dispalayed as 2D matrices. Array `value` can have 4, 9, and 16 elements for 2x2, 3x3 and 4x4 matrices.
 **/
let IoMatrix = class IoMatrix extends IoVectorArray {
    static get Style() {
        return /* css */ `
      :host {
        display: grid;
        align-self: stretch;
        justify-self: stretch;
        grid-gap: var(--io_spacing);
        max-width: 100%;
        overflow: hidden;
      }
      :host > *:not(:last-child) {
        margin-right: 0;
      }
      :host[columns="4"] {
        grid-template-columns: repeat(4, 1fr);
      }
      :host[columns="3"] {
        grid-template-columns: repeat(3, 1fr);
      }
      :host[columns="2"] {
        grid-template-columns: repeat(2, 1fr);
      }
    `;
    }
    _onNumberValueInput(event) {
        const item = event.composedPath()[0];
        this.value[item.id] = event.detail.value;
        if (!this.value._isNode) {
            this.dispatchMutation(this.value);
        }
        this.dispatch('value-input', { property: 'value', value: this.value }, false);
    }
    valueChanged() {
        if (this.value.length === 4) {
            this.setProperties({
                keys: [0, 1, 2, 3],
                columns: 2
            });
        }
        if (this.value.length === 9) {
            this.setProperties({
                keys: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                columns: 3
            });
        }
        if (this.value.length === 16) {
            this.setProperties({
                keys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                columns: 4
            });
        }
        debug: {
            if ([4, 9, 16].indexOf(this.value.length) === -1) {
                console.warn('IoMatrix: Unrecognized matrix type!');
            }
            if (this.value.find(v => typeof v !== 'number')) {
                console.warn('IoMatrix: Unrecognized matrix type!');
            }
            if (this.keys.find(k => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].indexOf(k) === -1)) {
                console.warn('IoMatrix: Unrecognized matrix type!');
            }
        }
    }
};
__decorate([
    ReactiveProperty({ type: Array, init: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] })
], IoMatrix.prototype, "value", void 0);
__decorate([
    ReactiveProperty({ value: 4, reflect: true })
], IoMatrix.prototype, "columns", void 0);
IoMatrix = __decorate([
    Register
], IoMatrix);
export { IoMatrix };
export const ioMatrix = function (arg0) {
    return IoMatrix.vConstructor(arg0);
};
//# sourceMappingURL=IoMatrix.js.map