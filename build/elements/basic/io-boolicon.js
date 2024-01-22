var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { IoBoolean } from './io-boolean.js';
let IoBoolicon = class IoBoolicon extends IoBoolean {
    changed() {
        this.setAttribute('value', Boolean(this.value));
        this.setAttribute('aria-checked', String(!!this.value));
        this.setAttribute('aria-invalid', typeof this.value !== 'boolean' ? 'true' : false);
        const label = this.value ? this.true : this.false;
        this.template([
            this.icon ? ['io-icon', { icon: this.icon, stroke: this.stroke }] : null,
            ['io-icon', { icon: label, stroke: this.stroke }]
        ]);
    }
};
IoBoolicon = __decorate([
    Register
], IoBoolicon);
export { IoBoolicon };
//# sourceMappingURL=io-boolicon.js.map