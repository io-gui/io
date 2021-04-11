import {RegisterIoElement} from '../../../srcj/components/io-element.js';
import {IoItem} from './item.js';

export class IoBoolean extends IoItem {
  static get Style() {
    return /* css */`
    :host[aria-invalid] {
      border: var(--io-border-error);
      background-image: var(--io-gradient-error);
    }
    `;
  }
  static get Properties() {
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
