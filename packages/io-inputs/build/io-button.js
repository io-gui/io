var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, IoField } from 'io-gui';
/**
 * Button element.
 * When clicked or activated by space/enter key, it calls the `action` property function with optional `value` argument.
 *
 * <io-element-demo element="io-button" properties='{"label": "Button", "action": "null"}'></io-element-demo>
 **/
let IoButton = class IoButton extends IoField {
    static get Style() {
        return /* css */ `
      :host {
        text-align: center;
        padding-left: calc(2 * var(--io_spacing));
        padding-right: calc(2 * var(--io_spacing));
        color: var(--io_colorStrong);
      }
      :host[pressed] {
        border-color: var(--io_borderColorInset);
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
    Property(undefined)
], IoButton.prototype, "action", void 0);
__decorate([
    Property(undefined)
], IoButton.prototype, "value", void 0);
__decorate([
    Property({ value: 'outset', type: String, reflect: true })
], IoButton.prototype, "appearance", void 0);
__decorate([
    Property({ value: false, type: Boolean, reflect: true })
], IoButton.prototype, "pressed", void 0);
__decorate([
    Property('button')
], IoButton.prototype, "role", void 0);
IoButton = __decorate([
    Register
], IoButton);
export { IoButton };
//# sourceMappingURL=io-button.js.map