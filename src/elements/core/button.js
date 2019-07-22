import {html} from "../../io.js";
import {IoItem} from "./item.js";
import {IoThemeSingleton as mixin} from "../../io.js";

export class IoButton extends IoItem {
  static get Style() {
    return html`<style>
      :host {
        ${mixin.button}
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
