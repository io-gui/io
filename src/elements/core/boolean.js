import {html} from "../../io.js";
import {IoItem} from "./item.js";

export class IoBoolean extends IoItem {
  static get Style() {
    return html`<style>
      :host:not([value]) {
        opacity: 0.5;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      role: 'switch',
    };
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
