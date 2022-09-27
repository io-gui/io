import {RegisterIoElement, IoProperty } from '../../iogui.js';
import {IoItem} from './item.js';

/*
 * Extends `IoButton`.
 *
 * Input element for `Boolean` data type displayed as text. It can be configured to display custom `true` or `false` string depending on its `value`.
 *
 * <io-element-demo element="io-boolean" properties='{"value": true, "true": "true", "false": "false"}'></io-element-demo>
 **/
@RegisterIoElement
export class IoBoolean extends IoItem {
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
  changed() {
    this.title = this.label;
    this.textNode = this.value ? this.true : this.false;
  }
  applyAria() {
    super.applyAria();
    this.setAttribute('aria-checked', String(!!this.value));
    this.setAttribute('aria-invalid', typeof this.value !== 'boolean' ? 'true' : false);
  }
}