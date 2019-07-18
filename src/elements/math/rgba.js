import {html} from "../../io.js";
import {IoVector} from "./vector.js";

export class IoRgba extends IoVector {
  static get Style() {
    return html`<style>
      :host > io-float:nth-child(1) {
        border-bottom-color: red;
      }
      :host > io-float:nth-child(2) {
        border-bottom-color: green;
      }
      :host > io-float:nth-child(3) {
        border-bottom-color: blue;
      }
    </style>`;
  }
  static get Properties() {
    return {
      value: [1, 1, 1, 1],
      min: 0,
      max: 1,
      step: 0.01,
    };
  }
  valueChanged() {
    this._c = this.value instanceof Array ? [0, 1, 2, 3] : ['r', 'g', 'b', 'a'];
  }
  getSlotted() {
    return ['io-rgba-swatch', {id: 'swatch', value: this.value}];
  }
}

IoRgba.Register();
