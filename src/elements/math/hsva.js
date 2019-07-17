import {html} from "../../io.js";
import {IoVector4} from "./vector4.js";

export class IoHsva extends IoVector4 {
  static get Style() {
    return html`<style>
      :host > io-number:nth-child(1) {
        background-image: linear-gradient(to top, transparent 2px, var(--io-background-color-field) 2.5px),
        linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);
      }
      :host > io-number:nth-child(2) {
        background-image: linear-gradient(to top, transparent 2px, var(--io-background-color-field) 2.5px),
        linear-gradient(to right, #ffffff 0%, #ff0000 100%);
      }
      :host > io-number:nth-child(3) {
        background-image: linear-gradient(to top, transparent 2px, var(--io-background-color-field) 2.5px),
        linear-gradient(to right, #000000 0%, #ffffff 100%);
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
    this._c = this.value instanceof Array ? [0, 1, 2, 3] : ['h', 's', 'v', 'a'];
  }
  changed() {
    const elements = [];
    for (let i in this._c) {
      const prop = this._c[i];
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
    elements.push(['io-hsva-swatch', {id: 'swatch', value: this.value}]);
    this.template(elements);
  }
}

IoHsva.Register();
