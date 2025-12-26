var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveProperty, IoElement } from '@io-gui/core';
import { IconsetSingleton } from '../nodes/Iconset.js';
/**
 * SVG icon element.
 * It displays SVG content specified via `icon` parameter.
 * Custom SVG assets need to be registered with `IconsetSingleton`.
 **/
let IoIcon = class IoIcon extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: inline-block;
        fill: var(--io_color);
      }
      :host[size=small] {
        width: var(--io_lineHeight);
        height: var(--io_lineHeight);
        min-width: var(--io_lineHeight);
      }
      :host[size=medium] {
        width: var(--io_fieldHeight);
        height: var(--io_fieldHeight);
        min-width: var(--io_fieldHeight);
      }
      :host:not([value]) {
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
    constructor(args) { super(args); }
    valueChanged() {
        if (this.value.search(':') !== -1) {
            this.innerHTML = IconsetSingleton.getIcon(this.value);
        }
        else {
            this.innerText = this.value;
        }
    }
};
__decorate([
    ReactiveProperty({ value: '', type: String, reflect: true })
], IoIcon.prototype, "value", void 0);
__decorate([
    ReactiveProperty({ value: false, type: Boolean, reflect: true })
], IoIcon.prototype, "stroke", void 0);
__decorate([
    ReactiveProperty({ value: 'small', type: String, reflect: true })
], IoIcon.prototype, "size", void 0);
IoIcon = __decorate([
    Register
], IoIcon);
export { IoIcon };
export const ioIcon = function (arg0) {
    return IoIcon.vConstructor(arg0);
};
//# sourceMappingURL=IoIcon.js.map