import { Register } from '../../core/node.js';
import { Property } from '../../core/internals/property.js';
import { IoField } from './io-field.js';

/**
 * Input element for `Boolean` data type displayed as text.
 * It can be configured to display custom `true` or `false` string or icon depending on its `value`.
 *
 * <io-element-demo element="io-boolean" properties='{"value": true, "true": "true", "false": "false"}'></io-element-demo>
 **/
@Register
export class IoBoolean extends IoField {
  static get Style() {
    return /* css */`
      :host {
        background-color: transparent;
      }
    `;
  }

  @Property({value: false, reflect: true})
  declare value: boolean;

  @Property('true')
  declare true: string;

  @Property('false')
  declare false: string;

  @Property('switch')
  declare role: string;

  _onClick() {
    this.toggle();
    this.dispatchEvent('io-boolean-clicked', {value: this.value}, true);
  }
  toggle() {
    this.inputValue(!this.value);
  }
  init() {
    this.changed();
  }
  changed() {
    this.setAttribute('value', Boolean(this.value));
    this.setAttribute('aria-checked', String(!!this.value));
    this.setAttribute('aria-invalid', typeof this.value !== 'boolean' ? 'true' : false);
    const label = this.value ? this.true : this.false;
    this.template([
      this.icon ? ['io-icon', {icon: this.icon, stroke: this.stroke}] : null,
      label ? ['io-label', {label: label}] : null
    ]);
  }
}