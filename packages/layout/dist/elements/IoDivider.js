var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, ReactiveElement } from '@io-gui/core';
let IoDivider = class IoDivider extends ReactiveElement {
    static get Style() {
        return /* css */ `
      :host {
        position: relative;
        flex: 0 0 var(--io_spacing3);
        background-color: var(--io_colorLight);
        border-style: solid;
        border-color: var(--io_color);
        @apply --io-unselectable;
        z-index: 1;
      }
      :host[orientation='horizontal'] {
        width: var(--io_spacing3);
        cursor: col-resize;
        border-width: 0 var(--io_borderWidth);
      }
      :host[orientation='vertical'] {
        height: var(--io_spacing3);
        cursor: row-resize;
        border-width: var(--io_borderWidth) 0;
      }
      :host:hover {
        border-style: dashed;
      }
      :host[pressed] {
        border-color: var(--io_borderColorBlue);
        background-color: var(--io_bgColorBlue);
      }
      :host:before,
      :host:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        opacity: 0;
      }
      :host:before {
        width: var(--io_fieldHeight);
        height: var(--io_spacing);
        background-color: var(--io_color);
        border-radius: var(--io_spacing);
        opacity: 0.5;
      }
      :host[orientation='vertical']:before {
        transform: translate(-50%, -50%);
      }
      :host[orientation='horizontal']:before {
        transform: translate(-50%, -50%) rotate(90deg);
      }
      :host:hover:before {
        opacity: 1;
      }
      :host[pressed]:before {
        background-color: var(--io_colorWhite);
      }
      :host:after {
        background-color: var(--io_color);
        border-radius: 50px;
        transform: translate(-50%, -50%)
      }
      :host[orientation='vertical']:after {
        width: 150px;
        height: 10px;
      }
      :host[orientation='horizontal']:after {
        width: 10px;
        height: 150px;
      }
      :host:hover[orientation='vertical']:after {
        width: 150px;
        height: 20px;
      }
      :host:hover[orientation='horizontal']:after {
        width: 20px;
        height: 150px;
      }
    `;
    }
    static get Listeners() {
        return {
            'pointerdown': 'onPointerdown',
            'touchstart': ['onTouchstart', { passive: false }],
            'contextmenu': 'onContextmenuDisable',
        };
    }
    constructor(args) { super(args); }
    onContextmenuDisable(event) {
        event.preventDefault();
        event.stopPropagation();
    }
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
    Property({ value: false, type: Boolean, reflect: true })
], IoDivider.prototype, "pressed", void 0);
__decorate([
    Property({ value: 'horizontal', type: String, reflect: true })
], IoDivider.prototype, "orientation", void 0);
IoDivider = __decorate([
    Register
], IoDivider);
export { IoDivider };
export const ioDivider = function (arg0) {
    return IoDivider.vConstructor(arg0);
};
