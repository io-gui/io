import {IoString} from "../io-string/io-string.js";

export class IoNumber extends IoString {
  static get properties() {
    return {
      value: Number,
      step: 0.0001,
      min: -Infinity,
      max: Infinity
    };
  }
  _onBlur() {
    let value = Math.round(Number(this.innerText) / this.step) * this.step;
    if (!isNaN(value)) this.set('value', value);
    this.update();
  }
  _onKeydown(event) {
    if (event.which == 13) {
      event.preventDefault();
      let value = Math.round(Number(this.innerText) / this.step) * this.step;
      if (!isNaN(value)) this.set('value', value);
      this.update();
    }
  }
  update() {
    let value = this.value;
    if (typeof value == 'number' && !isNaN(value)) {
      value = Math.min(this.max, Math.max(this.min, (Math.round(value / this.step) * this.step)));
      value = value.toFixed(-Math.round(Math.log(this.step) / Math.LN10));
    }
    this.innerText = String(parseFloat(value));
  }
}

IoNumber.Register();
