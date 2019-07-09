import {html} from "../core/element.js";
import {IoButton} from "./button.js";

export class IoBoolean extends IoButton {
  static get style() {
    return html`<style>
      :host {
        border: var(--io-outset-border);
        border-color: var(--io-outset-border-color);
        color: var(--io-color-field);
        background-color: var(--io-background-color-field);
      }
      :host[aria-invalid] {
        color: var(--io-color-error);
      }
    </style>`;
  }
  static get properties() {
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
  constructor(props) {
    super(props);
    this.__properties.action.value = this.toggle;
  }
  toggle() {
    this.set('value', !this.value);
  }
  changed() {
    this.setAttribute('aria-checked', String(!!this.value));
    // this.setAttribute('aria-invalid', typeof this.value !== 'boolean' ? 'true' : false);
    this.innerText = this.value ? this.true : this.false;
  }
}

IoBoolean.Register();
