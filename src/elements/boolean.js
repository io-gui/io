import {html} from "../core/element.js";
import {IoButton} from "./button.js";

export class IoBoolean extends IoButton {
  static get style() {
    return html`<style>
      :host {
        border: var(--io-inset-border);
        border-color: var(--io-inset-border-color);
        color: var(--io-field-color);
        background-color: var(--io-field-background-color);
      }
      :host[aria-invalid] {
        color: var(--io-error-color);
      }
    </style>`;
  }
  static get properties() {
    return {
      value: {
        type: Boolean,
        reflect: true
      },
      true: 'true',
      false: 'false',
      role: 'switch',
    };
  }
  constructor(props) {
    super(props);
    this.__properties.action.value = this.toggle;
  }
  toggle() {
    this.set('value', !this.value);
  }
  changed() {
    this.setAttribute('aria-checked', String(this.value));
    this.setAttribute('aria-invalid', typeof this.value !== 'boolean');
    this.innerText = this.value ? this.true : this.false;
  }
}

IoBoolean.Register();
