var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveProperty, span, Property } from 'io-core';
import { ioIcon } from 'io-icons';
import { IoField } from './IoField.js';
/**
 * Input element for `Boolean` data type displayed as text.
 * It can be configured to display custom `true` or `false` strings.
 **/
let IoBoolean = class IoBoolean extends IoField {
    static get Style() {
        return /* css */ `
      :host {
        padding: var(--io_spacing);
      }
    `;
    }
    constructor(args = {}) { super(args); }
    onClick() {
        this.toggle();
        this.dispatch('io-boolean-clicked', { value: this.value }, true);
    }
    toggle() {
        this.inputValue(!this.value);
    }
    ready() {
        this.valueChanged();
        this.changed();
    }
    valueChanged() {
        this.invalid = typeof this.value !== 'boolean';
        this.setAttribute('aria-checked', String(!!this.value));
    }
    changed() {
        const value = this.value ? this.true : this.false;
        this.render([
            this.icon ? ioIcon({ value: this.icon }) : null,
            this.label ? span(this.label + ':') : null,
            value ? value.includes('io:') ? ioIcon({ value: value }) : span(value) : null
        ]);
    }
};
__decorate([
    ReactiveProperty({ value: false, type: Boolean, reflect: true })
], IoBoolean.prototype, "value", void 0);
__decorate([
    ReactiveProperty({ value: 'true', type: String })
], IoBoolean.prototype, "true", void 0);
__decorate([
    ReactiveProperty({ value: 'false', type: String })
], IoBoolean.prototype, "false", void 0);
__decorate([
    Property('checkbox')
], IoBoolean.prototype, "role", void 0);
IoBoolean = __decorate([
    Register
], IoBoolean);
export { IoBoolean };
export const ioBoolean = function (arg0) {
    return IoBoolean.vConstructor(arg0);
};
//# sourceMappingURL=IoBoolean.js.map