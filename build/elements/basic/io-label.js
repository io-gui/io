var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { IoElement } from '../../core/element.js';
let IoLabel = class IoLabel extends IoElement {
    static get Style() {
        return /* css */ `
      --ioLabel: {
        display: inline-block;
        height: var(--iotLineHeight);
        line-height: var(--iotLineHeight);
        font-size: var(--iotFontSize);
        padding: 0 var(--iotSpacing);
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
//# sourceMappingURL=io-label.js.map