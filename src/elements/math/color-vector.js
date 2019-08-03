import {html} from "../../io.js";
import {IoVector} from "./vector.js";
import {IoColorMixin} from "./color.js";

export class IoColorVector extends IoColorMixin(IoVector) {
  static get Style() {
    return html`<style>
      :host > io-color-picker {
        width: calc(var(--io-line-height) + calc(2 * var(--io-spacing)));
      }
    </style>`;
  }
  static get Properties() {
    return {
      min: 0,
      max: 1,
      step: 0.01,
    };
  }
  getSlotted() {
    return ['io-color-picker', {id: 'swatch', value: this.value}];
  }
}

IoColorVector.Register();
