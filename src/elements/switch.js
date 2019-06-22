import {html} from "../core/element.js";
import {IoButton} from "./button.js";

export class IoSwitch extends IoButton {
  static get style() {
    return html`<style>
      :host {
        background: none;
        border: none;
        padding: 0;
        --io-toggle-size: 1.39em;
        display: flex;
        align-items: center;
      }
      :host:focus {
        outline: none;
      }
      :host > div {
        position: relative;
        flex: 0 0 calc(var(--io-toggle-size) * 2.5);
        border: var(--io-inset-border);
        border-color: var(--io-inset-border-color);
        color: var(--io-field-color);
        background-color: var(--io-field-background-color);
        width: calc(var(--io-toggle-size) * 2.5);
        height: var(--io-toggle-size);
        border-radius: var(--io-toggle-size);
        transition: background-color 0.4s;
      }
      :host[value] > div {
        background-color: rgba(80, 210, 355, 0.2);
      }
      :host:hover {
        background-color: inherit;
      }
      :host:hover > div {
        background-color: var(--io-hover-bg);
      }
      :host:focus > div {
        border-color: var(--io-focus-color);
      }
      :host > div:after {
        display: inline-block;
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        height: calc(var(--io-toggle-size) - calc(2 * var(--io-border-width)));
        width: calc(var(--io-toggle-size) - calc(2 * var(--io-border-width)));
        background-color: var(--io-hover-bg);
        border: var(--io-outset-border);
        border-color: var(--io-outset-border-color);
        border-radius: var(--io-toggle-size);

        transition-timing-function: ease-in-out;
        transition: left 0.25s;
      }
      :host[value] > div:after {
        background-color: rgba(80, 210, 355, 0.75);
        left: calc(100% - var(--io-toggle-size));
      }
      :host[aria-invalid] > div:after {
        background-color: var(--io-error-color);
      }
    </style>`;
  }
  static get properties() {
    return {
      value: {
        type: Boolean,
        reflect: true
      },
      role: 'switch',
    };
  }
  constructor(props) {
    super(props);
    this.__properties.action.value = this.toggle;
    this.template([['div']]);
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
