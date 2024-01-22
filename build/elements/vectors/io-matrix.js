var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { Property } from '../../core/internals/property.js';
import { IoVector } from './io-vector.js';
/**
 * Input element for vector arrays dispalayed as 2D matrices. Array `value` can have 4, 9, and 16 elements for 2x2, 3x3 and 4x4 matrices.
 *
 * <io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 1]}'></io-element-demo>
 *
 * <io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 0, 1, 0, 0, 0, 1]}'></io-element-demo>
 *
 * <io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]}'></io-element-demo>
 **/
let IoMatrix = class IoMatrix extends IoVector {
    static get Style() {
        return /* css */ `
      :host {
        display: grid;
        align-self: stretch;
        justify-self: stretch;
        grid-gap: var(--iotSpacing);
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
        const id = item.id;
        const value = event.detail.value;
        const oldValue = event.detail.oldValue;
        this.value[id] = value;
        const detail = { object: this.value, property: id, value: value, oldValue: oldValue };
        this.dispatchEvent('object-mutated', detail, false, window);
    }
    valueChanged() {
        if (this.value.length === 4) {
            this.setProperties({
                keys: ['0', '1', '2', '3'],
                columns: 2
            });
        }
        if (this.value.length === 9) {
            this.setProperties({
                keys: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
                columns: 3
            });
        }
        if (this.value.length === 16) {
            this.setProperties({
                keys: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
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
            if (this.keys.find(k => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'].indexOf(k) === -1)) {
                console.warn('IoMatrix: Unrecognized matrix type!');
            }
        }
    }
};
__decorate([
    Property({ type: Array, init: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] })
], IoMatrix.prototype, "value", void 0);
__decorate([
    Property({ value: 4, reflect: true })
], IoMatrix.prototype, "columns", void 0);
IoMatrix = __decorate([
    Register
], IoMatrix);
export { IoMatrix };
//# sourceMappingURL=io-matrix.js.map