var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterIoElement } from '../../core/element.js';
import { IoProperty } from '../../core/internals/property.js';
import { IoField } from './field.js';
let IoBoolean = class IoBoolean extends IoField {
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
        if (label.search(':') !== -1) {
            this.template([
                this.icon ? ['io-icon', { icon: this.icon, stroke: this.stroke }] : null,
                ['io-icon', { icon: label, stroke: this.stroke }]
            ]);
        }
        else {
            this.template([
                this.icon ? ['io-icon', { icon: this.icon, stroke: this.stroke }] : null,
                label ? ['io-label', { label: label }] : null
            ]);
        }
    }
};
__decorate([
    IoProperty({ value: false, reflect: 'prop' })
], IoBoolean.prototype, "value", void 0);
__decorate([
    IoProperty('true')
], IoBoolean.prototype, "true", void 0);
__decorate([
    IoProperty('false')
], IoBoolean.prototype, "false", void 0);
__decorate([
    IoProperty('switch')
], IoBoolean.prototype, "role", void 0);
IoBoolean = __decorate([
    RegisterIoElement
], IoBoolean);
export { IoBoolean };
//# sourceMappingURL=boolean.js.map