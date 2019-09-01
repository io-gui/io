import {html} from "../../io.js";
import {IoItem} from "./item.js";

export class IoButton extends IoItem {
  static get Style() {
    return html`<style>
    :host {
      text-align: center;
      border: var(--io-border);
      border-color: var(--io-color-border-outset);
      background-color: var(--io-background-color-dark);
      background-image: var(--io-gradient-button);
      padding-left: calc(2 * var(--io-spacing));
      padding-right: calc(2 * var(--io-spacing));
    }
    :host[pressed] {
      border: var(--io-border);
      border-color: var(--io-color-border-inset);
    }
    </style>`;
  }
  static get Properties() {
    return {
      action: Function,
      value: undefined,
      label: 'Button',
      role: 'button',
    };
  }
  _onClick() {
    if (typeof this.action === 'function') this.action(this.value);
  }
}

IoButton.Register();
