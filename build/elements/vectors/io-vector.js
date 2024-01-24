var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { IoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import '../basic/io-boolicon.js';
/**
 * Input element for vector arrays and objects.
 *
 * <io-element-demo element="io-vector" properties='{"value": {"x": 1, "y": 0.5}, "linkable": false}'></io-element-demo>
 *
 * <io-element-demo element="io-vector" properties='{"value": [0, 0.5, 1], "linkable": true}'></io-element-demo>
 **/
let IoVector = class IoVector extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex: 0 1 auto;
        min-width: var(--iotFieldHeight4);
        width: var(--iotFieldHeight8);
      }
      :host > io-number {
        flex: 1 1 100%;
      }
      :host > *:not(:last-child) {
        margin-right: var(--iotSpacing);
      }
      :host > io-boolicon {
        flex-shrink: 0;
        padding: var(--iotSpacing);
      }
    `;
    }
    _ratios = {};
    _onNumberPointerDown(event) {
        const item = event.composedPath()[0];
        const id = item.id;
        this._ratios = {};
        if (this.linked && this.value[id] !== 0) {
            for (const k of this.keys)
                this._ratios[k] = this.value[k] / this.value[id];
        }
    }
    _onNumberValueInput(event) {
        const item = event.composedPath()[0];
        const id = item.id;
        const newValue = event.detail.value;
        const oldValue = event.detail.oldValue;
        const value = this.value;
        value[id] = newValue;
        if (this.linked) {
            for (const k of this.keys) {
                if (k !== id && this._ratios[k])
                    value[k] = value[id] * this._ratios[k];
            }
        }
        const detail = this.linked ? { object: this.value } : { object: this.value, property: id, value: value, oldValue: oldValue };
        this.dispatchEvent('object-mutated', detail, false, window);
    }
    valueChanged() {
        this.keys = Object.keys(this.value).filter(key => typeof this.value[key] === 'number');
        debug: {
            if (this.keys.find(k => ['0', '1', '2', '3', 'x', 'y', 'z', 'w', 'r', 'g', 'b', 'a', 'u', 'v'].indexOf(k) === -1)) {
                console.warn('IoVector: Unrecognized vector type!');
            }
        }
    }
    changed() {
        const elements = [];
        for (const k of this.keys) {
            if (this.value[k] !== undefined) {
                elements.push(['io-number', {
                        id: k, // Consider removing global id collisions
                        value: this.value[k],
                        conversion: this.conversion,
                        step: this.step,
                        min: this.min,
                        max: this.max,
                        ladder: this.ladder,
                        '@pointerdown': this._onNumberPointerDown,
                        '@value-input': this._onNumberValueInput,
                    }]);
            }
        }
        elements.push(this.getSlotted());
        this.template(elements);
    }
    getSlotted() {
        return this.linkable ? ['io-boolicon', { value: this.bind('linked'), true: 'icons:link', false: 'icons:unlink' }] : null;
    }
};
__decorate([
    Property({ observe: true })
], IoVector.prototype, "value", void 0);
__decorate([
    Property(1)
], IoVector.prototype, "conversion", void 0);
__decorate([
    Property(0.001)
], IoVector.prototype, "step", void 0);
__decorate([
    Property(-Infinity)
], IoVector.prototype, "min", void 0);
__decorate([
    Property(Infinity)
], IoVector.prototype, "max", void 0);
__decorate([
    Property(false)
], IoVector.prototype, "linkable", void 0);
__decorate([
    Property(false)
], IoVector.prototype, "linked", void 0);
__decorate([
    Property(true)
], IoVector.prototype, "ladder", void 0);
__decorate([
    Property({ reactive: false })
], IoVector.prototype, "keys", void 0);
IoVector = __decorate([
    Register
], IoVector);
export { IoVector };
//# sourceMappingURL=io-vector.js.map