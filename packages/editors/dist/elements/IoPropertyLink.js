var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Property, Register, span } from '@io-gui/core';
import { IoButton } from '@io-gui/inputs';
let IoPropertyLink = class IoPropertyLink extends IoButton {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
    }
    :host > span {
      color: var(--io_colorBlue);
      flex: 0 1 auto;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    :host:hover > span {
      text-decoration: underline;
    }
    `;
    }
    valueMutated() {
        this.mutated();
    }
    mutated() {
        let label;
        if (this.value instanceof Array) {
            label = `${this.value.constructor.name} (${this.value.length})`;
        }
        else {
            label = `${this.value.constructor.name}`;
        }
        if (this.showName) {
            const named = this.value;
            const name = named.name || named.title || named.id;
            if (name) {
                label += ` "${name}"`;
            }
        }
        this.render([span(label)]);
    }
};
__decorate([
    Property()
], IoPropertyLink.prototype, "value", void 0);
__decorate([
    Property({ value: false, type: Boolean })
], IoPropertyLink.prototype, "showName", void 0);
__decorate([
    Property({ value: 'neutral', type: String, reflect: true })
], IoPropertyLink.prototype, "appearance", void 0);
IoPropertyLink = __decorate([
    Register
], IoPropertyLink);
export { IoPropertyLink };
export const ioPropertyLink = function (arg0) {
    return IoPropertyLink.vConstructor(arg0);
};
