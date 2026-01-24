var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveProperty, IoElement } from '@io-gui/core';
let IoDivider = class IoDivider extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        position: relative;
        flex: 0 0 var(--io_spacing3);
        background-color: var(--io_colorLight);
        border-style: solid;
        border-width: 0 var(--io_borderWidth);
        border-color: var(--io_color);
        cursor: col-resize;
        @apply --unselectable;
      }
      :host[pressed] {
        border-color: var(--io_borderColorBlue);
        background-color: var(--io_bgColorBlue);
      }
      :host[pressed]:before,
      :host[pressed]:after {
        background-color: var(--io_colorWhite);
      }
      :host:before,
      :host:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 1;
        opacity: 0;
      }
      :host:before {
        width: var(--io_fieldHeight);
        height: var(--io_spacing);
        background-color: var(--io_color);
        transform: translate(-50%, -50%) rotate(90deg);
        border-radius: var(--io_spacing);
        opacity: 0.5;
      }
      :host[orientation='vertical']:before {
        transform: translate(-50%, -50%);
      }
      :host:after {
        width: var(--io_fieldHeight);
        height: var(--io_fieldHeight);
        background-color: var(--io_color);
        transform: translate(-50%, -50%) rotate(45deg);
        border-radius: 25%;
      }
      :host[orientation='vertical'] {
        cursor: row-resize;
        border-width: var(--io_borderWidth) 0;
      }
      :host:hover {
        border-style: dashed;
      }
      :host:hover:before {
        opacity: 1;
      }
    `;
    }
    static get Listeners() {
        return {
            'pointerdown': 'onPointerdown',
            'touchstart': ['onTouchstart', { passive: false }],
        };
    }
    constructor(args) { super(args); }
    onPointerdown(event) {
        event.preventDefault();
        event.stopPropagation();
        this.addEventListener('pointermove', this.onPointermove);
        this.addEventListener('pointerup', this.onPointerup);
        this.addEventListener('pointercancel', this.onPointercancel);
        this.setPointerCapture(event.pointerId);
        this.pressed = true;
    }
    onPointermove(event) {
        event.preventDefault();
        this.dispatch('io-divider-move', {
            clientX: event.clientX,
            clientY: event.clientY,
            element: this,
        }, true);
    }
    onPointerup(event) {
        event.preventDefault();
        this.removeEventListener('pointermove', this.onPointermove);
        this.removeEventListener('pointerup', this.onPointerup);
        this.removeEventListener('pointercancel', this.onPointercancel);
        this.releasePointerCapture(event.pointerId);
        this.pressed = false;
        this.dispatch('io-divider-move-end', {
            clientX: event.clientX,
            clientY: event.clientY,
            element: this,
        }, true);
    }
    onPointercancel(event) {
        event.preventDefault();
        this.removeEventListener('pointermove', this.onPointermove);
        this.removeEventListener('pointerup', this.onPointerup);
        this.removeEventListener('pointercancel', this.onPointercancel);
        this.releasePointerCapture(event.pointerId);
        this.pressed = false;
    }
    onTouchstart(event) {
        this.addEventListener('touchmove', this.onTouchmove, { passive: false });
        this.addEventListener('touchend', this.onTouchend);
    }
    onTouchmove(event) {
        event.preventDefault();
    }
    onTouchend() {
        this.removeEventListener('touchmove', this.onTouchmove);
        this.removeEventListener('touchend', this.onTouchend);
    }
};
__decorate([
    ReactiveProperty({ value: false, type: Boolean, reflect: true })
], IoDivider.prototype, "pressed", void 0);
__decorate([
    ReactiveProperty({ value: 'horizontal', type: String, reflect: true })
], IoDivider.prototype, "orientation", void 0);
IoDivider = __decorate([
    Register
], IoDivider);
export { IoDivider };
export const ioDivider = function (arg0) {
    return IoDivider.vConstructor(arg0);
};
//# sourceMappingURL=IoDivider.js.map