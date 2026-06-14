var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveProperty, span, Property } from '@io-gui/core';
import { ioIcon } from '@io-gui/icons';
import { IoField } from './IoField.js';
/**
 * Button element.
 * When clicked or activated by space/enter key, it calls the `action` property function with optional `value` argument.
 **/
let IoButton = class IoButton extends IoField {
    static get Style() {
        return /* css */ `
      :host {
        text-align: center;
        color: var(--io_colorStrong);
      }
      :host > io-icon {
        margin-right: var(--io_spacing);
      }
      :host > span {
        vertical-align: top;
      }
    `;
    }
    constructor(args = {}) { super(args); }
    onPointerdown(event) {
        event.preventDefault();
        super.onPointerdown(event);
    }
    onKeydown(event) {
        super.onKeydown(event);
        if (event.key === 'Enter' || event.key === ' ') {
            this.pressed = true;
        }
    }
    onKeyup(event) {
        super.onKeyup(event);
        this.pressed = false;
    }
    onClick(event) {
        if (typeof this.action === 'function')
            this.action(this.value);
        this.dispatch('io-button-clicked', { value: this.value }, true);
    }
    ready() {
        this.changed();
    }
    changed() {
        this.setAttribute('aria-pressed', String(this.pressed));
        this.render([
            this.icon ? ioIcon({ value: this.icon }) : null,
            this.label ? span(this.label) : null
        ]);
    }
};
__decorate([
    ReactiveProperty({ value: undefined })
], IoButton.prototype, "value", void 0);
__decorate([
    ReactiveProperty()
], IoButton.prototype, "action", void 0);
__decorate([
    ReactiveProperty({ value: 'outset', type: String, reflect: true })
], IoButton.prototype, "appearance", void 0);
__decorate([
    Property('button')
], IoButton.prototype, "role", void 0);
IoButton = __decorate([
    Register
], IoButton);
export { IoButton };
export const ioButton = function (arg0) {
    return IoButton.vConstructor(arg0);
};
//# sourceMappingURL=IoButton.js.map