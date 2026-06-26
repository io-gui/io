var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Property } from '../decorators/Property.js';
import { Register } from '../decorators/Register.js';
import { ReactiveElement } from './ReactiveElement.js';
/** Inline text element; `value` updates `innerText`. */
let IoSpan = class IoSpan extends ReactiveElement {
    constructor(props) {
        super(props);
    }
    static get Style() {
        return /* css */ `
      :host {
        display: inline-block;
      }
    `;
    }
    valueChanged() {
        this.innerText = this.value;
    }
};
__decorate([
    Property({ type: String, value: '' })
], IoSpan.prototype, "value", void 0);
IoSpan = __decorate([
    Register
], IoSpan);
export { IoSpan };
export const ioSpan = function (props) {
    return IoSpan.vConstructor(props);
};
