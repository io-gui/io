import {IoItem} from "./item.js";

export class IoBoolean extends IoItem {
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
    this.setAttribute('aria-checked', String(!!this.value));
    this.setAttribute('aria-invalid', typeof this.value !== 'boolean' ? 'true' : false);
    this.setAttribute('aria-label', this.label);
    this.title = this.label;
    this.textNode = this.value ? this.true : this.false;
  }
}

IoBoolean.Register();
