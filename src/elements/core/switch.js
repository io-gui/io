import {html} from "../../io.js";
import {IoBoolean} from "./boolean.js";

export class IoSwitch extends IoBoolean {
  static get Style() {
    return html`<style>
      :host {
        position: relative;
        border: var(--io-inset-border);
        border-color: var(--io-inset-border-color);
        color: var(--io-color-field);
        background-image: none;
        background-color: var(--io-background-color-dark);
        box-shadow: var(--io-shadow-inset);
        padding: 0;
        margin: var(--io-spacing);
        width: calc(2 * var(--io-line-height));
        height: var(--io-line-height);
        border-radius: var(--io-line-height);
        transition: background-color 0.4s;
      }
      :host:after {
        display: inline-block;
        position: absolute;
        visibility: visible;
        content: '';
        top: 0;
        left: 0;
        height: calc(var(--io-line-height) - calc(4 * var(--io-border-width)));
        width: calc(var(--io-line-height) - calc(4 * var(--io-border-width)));
        background-color: var(--io-background-color-dark);
        border: var(--io-outset-border);
        border-color: var(--io-outset-border-color);
        border-radius: var(--io-line-height);
        transition-timing-function: ease-in-out;
        transition: left 0.25s;
      }
      :host[value]:after {
        background-color: rgba(80, 210, 355, 0.75);
        left: calc(calc(100% - var(--io-line-height)) + calc(2 * var(--io-border-width)));
      }
      :host:not([value]) {
        opacity: 0.5;
      }
      :host[aria-invalid] {
        border: var(--io-border-error);
        background-image: var(--io-gradient-error);
      }
      :host:hover,
      :host[display="switch"][value]:not([aria-invalid]) {
        background-color: var(--io-background-color);
      }
      :host:focus {
        outline: none;
        border-color: var(--io-color-focus);
      }
    </style>`;
  }
  changed() {
    this.setAttribute('aria-checked', String(!!this.value));
    this.setAttribute('aria-invalid', typeof this.value !== 'boolean' ? 'true' : false);
    this.setAttribute('aria-label', this.label);
    this.title = this.label;
  }
}

IoSwitch.Register();
