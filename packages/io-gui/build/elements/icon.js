var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../core/decorators/register';
import { Property } from '../core/decorators/property';
import { IoElement } from '../core/element';
import { IoIconsetSingleton } from '../nodes/iconset';
/**
 * SVG icon element.
 * It displays SVG content specified via `icon` parameter. Custom SVG assets need to be registered with `IoIconsetSingleton`.
 **/
let IoIcon = class IoIcon extends IoElement {
    static get Style() {
        return /* css */ `
      --ioIcon: {
        display: inline-block;
        width: var(--io_lineHeight);
        height: var(--io_lineHeight);
        min-width: var(--io_lineHeight);
        line-height: var(--io_lineHeight);
        font-size: var(--io_fontSize);
        text-align: center;
        fill: var(--io_color);
      }
      :host {
        @apply --ioIcon;
      }
      :host:not([icon]) {
        display: none;
      }
      :host[stroke] {
        stroke: var(--io_colorStrong);
        stroke-width: var(--io_borderWidth);
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
    Property({ value: '', type: String, reflect: true })
], IoIcon.prototype, "icon", void 0);
__decorate([
    Property({ value: false, type: Boolean, reflect: true })
], IoIcon.prototype, "stroke", void 0);
IoIcon = __decorate([
    Register
], IoIcon);
export { IoIcon };
//# sourceMappingURL=icon.js.map