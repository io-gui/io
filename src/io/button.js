import {html} from "./core/element.js";
import {IoItem} from "./item.js";

export class IoButton extends IoItem {
  static get style() {
    return html`<style>
      :host {
        background-color: var(--io-background-color-dark);
        background-image: var(--io-gradient-button);
        border: var(--io-outset-border);
        border-color: var(--io-outset-border-color);
        border-radius: var(--io-border-radius);
        padding: var(--io-spacing);
        padding-left: calc(3 * var(--io-spacing));
        padding-right: calc(3 * var(--io-spacing));
        transition: background-color 0.4s;
      }
    </style>`;
  }
  static get attributes() {
    return {
      label: 'Button',
      role: 'button',
    };
  }
  static get properties() {
    return {
      action: Function,
      value: undefined,
    };
  }
  _onClick() {
    if (this.action) this.action(this.value);
  }
}

IoButton.Register();
