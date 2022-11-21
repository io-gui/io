import { RegisterIoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import { IoField } from './io-field.js';

/**
 * Button element.
 * When clicked or activated by space/enter key, it calls the `action` property function with optional `value` argument.
 *
 * <io-element-demo element="io-button" properties='{"label": "Button", "action": "null"}'></io-element-demo>
 **/
@RegisterIoElement
export class IoButton extends IoField {
  static get Style() {
    return /* css */`
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

  @Property(undefined)
  declare action?: any;

  @Property(undefined)
  declare value: any;

  @Property({value: false, reflect: 'prop'})
  declare pressed: boolean;

  @Property('button')
  declare role: string;

  _onPointerdown(event: PointerEvent) {
    super._onPointerdown(event);
    this.pressed = true;
  }
  _onPointerleave(event: PointerEvent) {
    super._onPointerleave(event);
    this.pressed = false;
  }
  _onPointerup(event: PointerEvent) {
    super._onPointerup(event);
    this.pressed = false;
  }
  _onKeydown(event: KeyboardEvent) {
    super._onKeydown(event);
    if (event.key === 'Enter' || event.key === ' ') {
      this.pressed = true;
    }
  }
  _onKeyup(event: KeyboardEvent) {
    super._onKeyup(event);
    this.pressed = false;
  }
  _onClick() {
    if (typeof this.action === 'function') this.action(this.value);
    this.dispatchEvent('io-button-clicked', {value: this.value}, true);
  }
  init() {
    this.changed();
  }
  changed() {
    this.setAttribute('aria-pressed', String(this.pressed));
    this.template([
      this.icon ? ['io-icon', {icon: this.icon}] : null,
      this.label ? ['io-label', {label: this.label}] : null
    ]);
  }
}
