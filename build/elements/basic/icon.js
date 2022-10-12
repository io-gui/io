var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoElement, RegisterIoElement } from '../../core/element.js';
import { IoProperty } from '../../core/internals/property.js';
import { IoIconsetSingleton } from './iconset.js';
let IoIcon = class IoIcon extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        @apply --io-icon;
        fill: currentcolor;
      }
      :host:not([icon]) {
        display: none;
      }
      :host[stroke] {
        stroke: currentcolor;
        stroke-width: var(--io-stroke-width);
      }
      :host > svg {
        height: 100%;
      }
      :host > svg > g {
        transform-origin: 0px 0px;
      }
    `;
    }
    iconChanged() {
        if (this.icon.search(':') !== -1) {
            this.innerHTML = IoIconsetSingleton.getIcon(this.icon);
        }
        else {
            this.textNode = this.icon;
        }
    }
};
__decorate([
    IoProperty({ value: '', reflect: 'prop' })
], IoIcon.prototype, "icon", void 0);
__decorate([
    IoProperty({ value: false, reflect: 'prop' })
], IoIcon.prototype, "stroke", void 0);
IoIcon = __decorate([
    RegisterIoElement
], IoIcon);
export { IoIcon };
//# sourceMappingURL=icon.js.map