import {html} from "./core/element.js";
import {IoButton} from "./button.js";

export class IoSwitch extends IoButton {
  static get Style() {
    return html`<style>
      :host {
        --io-switch-size: 1.375em;
        text-align: center;
        position: relative;
        border: var(--io-inset-border);
        border-color: var(--io-inset-border-color);
        color: var(--io-color-field);
        background-image: none;
        background-color: var(--io-background-color-dark);
        padding: 0;
        margin: var(--io-spacing);
        width: 3.5em;
        height: 1.375em;
        height: var(--io-switch-size);
        border-radius: var(--io-switch-size);
        transition: background-color 0.4s;
      }
      :host:focus {
        outline: none;
        border-color: var(--io-color-focus);
      }
      :host:hover,
      :host[value] {
        background-color: var(--io-background-color);
      }
      :host:after {
        display: inline-block;
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        height: calc(var(--io-switch-size) - calc(2 * var(--io-border-width)));
        width: calc(var(--io-switch-size) - calc(2 * var(--io-border-width)));
        background-color: var(--io-background-color-dark);
        border: var(--io-outset-border);
        border-color: var(--io-outset-border-color);
        border-radius: var(--io-switch-size);
        transition-timing-function: ease-in-out;
        transition: left 0.25s;
      }
      :host[value]:after {
        background-color: rgba(80, 210, 355, 0.75);
        left: calc(100% - var(--io-switch-size));
      }
      :host[aria-invalid] > div:after {
        background-color: var(--io-color-error);
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
        reflect: 1
      },
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
    this.setAttribute('aria-invalid', (typeof this.value !== 'boolean') ? 'true' : false);
  }
}

IoSwitch.Register();
