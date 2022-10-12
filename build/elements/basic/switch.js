var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterIoElement } from '../../core/element.js';
import { IoBoolean } from './boolean.js';
let IoSwitch = class IoSwitch extends IoBoolean {
    static get Style() {
        return /* css */ `
      :host {
        position: relative;
        width: calc(1.5 * var(--io-field-height));
      }
      :host:before {
        display: inline-block;
        box-sizing: border-box;
        position: absolute;
        content: '';
        top: var(--io-spacing);
        left: 0;
        width: calc(100% - calc(2 * var(--io-border-width)));
        height: var(--io-line-height);
        border-radius: var(--io-line-height);
        border: var(--io-border);
        border-color: var(--io-color-border-inset);
        background-color: var(--io-background-color);
        box-shadow: var(--io-shadow-inset);
        transition: background-color 0.4s;
      }
      :host:after {
        display: inline-block;
        box-sizing: border-box;
        position: absolute;
        content: '';
        top: calc(var(--io-border-width) + var(--io-spacing));
        left: var(--io-border-width);
        height: calc(var(--io-line-height) - calc(2 * var(--io-border-width)));
        width: calc(var(--io-line-height) - calc(2 * var(--io-border-width)));
        background-color: var(--io-background-color-dark);
        border: var(--io-border);
        border-color: var(--io-color-border-outset);
        border-radius: var(--io-line-height);
        transition-timing-function: ease-in-out;
        transition: left 0.25s;
      }
      :host[value]:before {
        background-color: var(--io-background-color-dark);
      }
      :host[value]:after {
        background-color: rgba(80, 210, 355, 0.75);
        left: calc(calc(100% - var(--io-line-height)) - var(--io-border-width));
      }
      :host[aria-invalid] {
        border: var(--io-border-error);
        background-image: var(--io-gradient-error);
      }
      :host:hover:before,
      :host[display="switch"][value]:not([aria-invalid]):before {
        background-color: var(--io-background-color);
      }
      :host:focus:before,
      :host:focus:after {
        border-color: var(--io-color-focus);
      }
      :host:focus {
        outline-color: var(--io-color-focus);
      }
    `;
    }
    init() {
        this.setAttribute('aria-checked', String(!!this.value));
    }
    changed() {
        this.title = this.label;
    }
    valueChanged() {
        this.setAttribute('aria-checked', String(!!this.value));
        if (typeof this.value !== 'boolean') {
            this.setAttribute('aria-invalid', 'true');
        }
        else {
            this.removeAttribute('aria-invalid');
        }
    }
};
IoSwitch = __decorate([
    RegisterIoElement
], IoSwitch);
export { IoSwitch };
//# sourceMappingURL=switch.js.map