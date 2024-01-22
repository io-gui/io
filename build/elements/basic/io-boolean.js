var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { Property } from '../../core/internals/property.js';
import { IoField } from './io-field.js';
/**
 * Input element for `Boolean` data type displayed as text.
 * It can be configured to display custom `true` or `false` string or icon depending on its `value`.
 *
 * <io-element-demo element="io-boolean" properties='{"value": true, "true": "true", "false": "false"}'></io-element-demo>
 **/
let IoBoolean = class IoBoolean extends IoField {
    static get Style() {
        return /* css */ `
      :host {
        background-color: transparent;
      }
    `;
    }
    _onClick() {
        this.toggle();
        this.dispatchEvent('io-boolean-clicked', { value: this.value }, true);
    }
    toggle() {
        this.inputValue(!this.value);
    }
    init() {
        this.changed();
    }
    changed() {
        this.setAttribute('value', Boolean(this.value));
        this.setAttribute('aria-checked', String(!!this.value));
        this.setAttribute('aria-invalid', typeof this.value !== 'boolean' ? 'true' : false);
        const label = this.value ? this.true : this.false;
        this.template([
            this.icon ? ['io-icon', { icon: this.icon, stroke: this.stroke }] : null,
            label ? ['io-label', { label: label }] : null
        ]);
    }
};
__decorate([
    Property({ value: false, reflect: true })
], IoBoolean.prototype, "value", void 0);
__decorate([
    Property('true')
], IoBoolean.prototype, "true", void 0);
__decorate([
    Property('false')
], IoBoolean.prototype, "false", void 0);
__decorate([
    Property('switch')
], IoBoolean.prototype, "role", void 0);
IoBoolean = __decorate([
    Register
], IoBoolean);
export { IoBoolean };
//# sourceMappingURL=io-boolean.js.map