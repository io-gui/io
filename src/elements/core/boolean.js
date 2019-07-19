import {html} from "../../io.js";
import {IoItem} from "./item.js";
import {IoThemeMixinSingleton as mixin} from "../../io.js";

export class IoBoolean extends IoItem {
  static get Style() {
    return html`<style>
      :host {
        ${mixin.button}
      }
      :host:not([value]) {
        opacity: 0.75;
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
    this.textNode = this.value ? this.true : this.false;
  }
}

IoBoolean.Register();
