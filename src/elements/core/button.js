import {html} from "../../io.js";
import {IoItem} from "./item.js";

export class IoButton extends IoItem {
  static get Style() {
    return html`<style>
      :host {
        background-color: var(--io-background-color-dark);
        background-image: var(--io-gradient-button);
        border: var(--io-outset-border);
        border-color: var(--io-outset-border-color);
        border-radius: var(--io-border-radius);
        padding: var(--io-spacing);
        padding-left: calc(2 * var(--io-spacing));
        padding-right: calc(2 * var(--io-spacing));
        box-shadow: var(--io-shadow-outset);
        transition: background-color 0.4s;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      label: 'Button',
      role: 'button',
    };
  }
  static get Properties() {
    return {
      action: Function,
      value: undefined,
    };
  }
  _onClick() {
    if (typeof this.action === 'function') this.action(this.value);
  }
}

IoButton.Register();
