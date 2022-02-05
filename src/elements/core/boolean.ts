import {RegisterIoElement} from '../../core/io-element.js';
import {IoItem} from './item.js';

/*
 * Extends `IoButton`.
 *
 * Input element for `Boolean` data type displayed as text. It can be configured to display custom `true` or `false` string depending on its `value`.
 *
 * <io-element-demo element="io-boolean" properties='{"value": true, "true": "true", "false": "false"}'></io-element-demo>
 **/

export class IoBoolean extends IoItem {
  static get Style() {
    return /* css */`
    :host[aria-invalid] {
      border: var(--io-border-error);
      background-image: var(--io-gradient-error);
    }
    `;
  }
  static get Properties(): any {
    return {
      label: 'Boolean',
      value: {
        type: Boolean,
        reflect: 1,
      },
      true: 'true',
      false: 'false',
      role: 'switch',
    };
  }
  _onClick() {
    this.toggle();
  }
  toggle() {
    this.set('value', !this.value);
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

RegisterIoElement(IoBoolean);
