import {html} from "../../io.js";
import {IoVector4} from "./vector4.js";

export class IoRgba extends IoVector4 {
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
      :host > span {
        cursor: pointer;
        border: var(--io-inset-border);
        border-radius: var(--io-border-radius);
        border-color: var(--io-inset-border-color);
        padding: var(--io-spacing);
        -webkit-tap-highlight-color: transparent;
        width: 1.375em;
        height: 1.375em;
        flex: 1 1 auto;
      }
    </style>`;
  }
  static get Properties() {
    return {
      value: [1, 1, 1, 1],
      min: 0,
      max: 1,
    };
  }
  valueChanged() {
    this._c = this.value instanceof Array ? [0, 1, 2, 3] : ['r', 'g', 'b', 'a'];
  }
  changed() {
    const elements = [];
    for (let i in this._c) {
      const prop = this._c[i];
      if (this.value[prop] !== undefined) {
        elements.push(['io-float', {
          id: prop,
          value: this.value[prop],
          conversion: this.conversion,
          step: this.step,
          min: this.min,
          max: this.max,
          'on-value-set': this._onValueSet
        }]);
      }
    }
    elements.push(['io-rgba-swatch', {id: 'swatch', value: this.value}]);
    this.template(elements);
  }
}

IoRgba.Register();
