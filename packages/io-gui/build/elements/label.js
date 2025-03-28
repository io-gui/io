var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../core/decorators/register';
import { IoElement } from '../core/element';
let IoLabel = class IoLabel extends IoElement {
    static get Style() {
        return /* css */ `
      --ioLabel: {
        display: inline-block;
        height: var(--io_lineHeight);
        line-height: var(--io_lineHeight);
        font-size: var(--io_fontSize);
        padding: 0 var(--io_spacing);
      }
      :host {
        @apply --ioLabel;
      }
      :host:not([label]) {
        display: none;
      }
    `;
    }
    labelChanged() {
        super.labelChanged();
        this.textNode = this.label;
    }
};
IoLabel = __decorate([
    Register
], IoLabel);
export { IoLabel };
//# sourceMappingURL=label.js.map