import {html} from "../io.js";
import {IoVector4} from "./vector4.js";
import "./color-swatch.js";

export class IoRgba extends IoVector4 {
  static get Style() {
    return html`<style>
      :host > io-number:nth-child(1) {
        border-bottom-color: red;
      }
      :host > io-number:nth-child(2) {
        border-bottom-color: green;
      }
      :host > io-number:nth-child(3) {
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
    this._components = this.value instanceof Array ? [0, 1, 2, 3] : ['r', 'g', 'b', 'a'];
  }
  _onValueSet(event) {
    super._onValueSet(event);
    this.updateSwatch();
  }
  updateSwatch() {
    const r = this.value[this._components[0]];
    const g = this.value[this._components[1]];
    const b = this.value[this._components[2]];
    const a = this.value[this._components[3]] !== undefined ? this.value[this._components[3]] : 1;
    this.$.swatch.value = [r, g, b, a];
  }
  changed() {
    const elements = [];
    for (let i in this._components) {
      const prop = this._components[i];
      if (this.value[prop] !== undefined) {
        elements.push(['io-number', {
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
    elements.push(['io-color-swatch', {id: 'swatch'}]);
    this.template(elements);
    this.updateSwatch();
  }
}

IoRgba.Register();
