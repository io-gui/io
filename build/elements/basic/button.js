var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { RegisterIoElement } from '../../core/element.js';
import { IoProperty } from '../../core/internals/property.js';
import { IoField } from './field.js';
let IoButton = class IoButton extends IoField {
    static get Style() {
        return /* css */ `
      :host {
        text-align: center;
        border: var(--io-border);
        border-color: var(--io-color-border-outset);
        background-color: var(--io-background-color-dark);
        background-image: var(--io-gradient-button);
        padding-left: calc(2 * var(--io-spacing));
        padding-right: calc(2 * var(--io-spacing));
      }
      :host[pressed] {
        border: var(--io-border);
        border-color: var(--io-color-border-inset);
      }
      :host > io-label {
        vertical-align: top;
      }
    `;
    }
    _onPointerdown(event) {
        super._onPointerdown(event);
        this.pressed = true;
    }
    _onPointerleave(event) {
        super._onPointerleave(event);
        this.pressed = false;
    }
    _onPointerup(event) {
        super._onPointerup(event);
        this.pressed = false;
    }
    _onKeydown(event) {
        super._onKeydown(event);
        if (event.key === 'Enter' || event.key === ' ') {
            this.pressed = true;
        }
    }
    _onKeyup(event) {
        super._onKeyup(event);
        this.pressed = false;
    }
    _onClick() {
        if (typeof this.action === 'function')
            this.action(this.value);
        this.dispatchEvent('io-button-clicked', { value: this.value }, true);
    }
    init() {
        this.changed();
    }
    changed() {
        this.setAttribute('aria-pressed', String(this.pressed));
        this.template([
            this.icon ? ['io-icon', { icon: this.icon }] : null,
            this.label ? ['io-label', { label: this.label }] : null
        ]);
    }
};
__decorate([
    IoProperty(undefined)
], IoButton.prototype, "action", void 0);
__decorate([
    IoProperty(undefined)
], IoButton.prototype, "value", void 0);
__decorate([
    IoProperty({ value: false, reflect: 'prop' })
], IoButton.prototype, "pressed", void 0);
__decorate([
    IoProperty('button')
], IoButton.prototype, "role", void 0);
IoButton = __decorate([
    RegisterIoElement
], IoButton);
export { IoButton };
//# sourceMappingURL=button.js.map