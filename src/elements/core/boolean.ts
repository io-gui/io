import { RegisterIoElement } from '../../core/element.js';
import { IoProperty } from '../../core/internals/property.js';
import { IoField } from './field.js';

@RegisterIoElement
export class IoBoolean extends IoField {
  static get Style() {
    return /* css */`
      :host[aria-invalid] {
        border: var(--io-border-error);
        background-image: var(--io-gradient-error);
      }
    `;
  }

  @IoProperty('Boolean')
  declare label: string;

  @IoProperty({value: false, reflect: 'prop'})
  declare value: boolean;

  @IoProperty('true')
  declare true: string;

  @IoProperty('false')
  declare false: string;

  @IoProperty({value: false, reflect: 'prop'})
  declare stroke: boolean;

  @IoProperty('switch')
  declare role: string;

  _onClick() {
    this.toggle();
  }
  toggle() {
    this.inputValue(!this.value);
  }
  valueChanged() {
    this.setAttribute('value', Boolean(this.value));
  }
  init() {
    this.changed();
  }
  changed() {
    this.title = this.label;
    const value = this.value ? this.true : this.false;
    if (value.search(':') !== -1) {
      this.template([
        ['io-icon', {icon: this.icon}],
        ['io-icon', {icon: value}]
      ]);
    } else {
      this.template([
        ['io-icon', {icon: this.icon}],
        ['io-label', {label: value}]
      ]);
    }
  }
  applyAria() {
    this.setAttribute('aria-checked', String(!!this.value));
    this.setAttribute('aria-invalid', typeof this.value !== 'boolean' ? 'true' : false);
  }
}