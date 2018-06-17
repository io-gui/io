import {IoString} from "./string.js";

export class IoNumber extends IoString {
  static get properties() {
    return {
      value: Number,
      step: 0.001,
      min: -Infinity,
      max: Infinity
    };
  }
  _onBlur() {
    this.setFromText(this.innerText);
    this.scrollTop = 0;
    this.scrollLeft = 0;
  }
  _onKeydown(event) {
    if (event.which == 13) {
      event.preventDefault();
      this.setFromText(this.innerText);
    }
  }
  setFromText(text) {
    let value = Math.round(Number(text) / this.step) * this.step;
    value = Math.min(this.max, Math.max(this.min, (Math.round(value / this.step) * this.step)));
    if (!isNaN(value)) this.set('value', value);
  }
  update() {
    let value = this.value;
    if (typeof value == 'number' && !isNaN(value)) {
      value = value.toFixed(-Math.round(Math.log(this.step) / Math.LN10));
    }
    this.innerText = String(parseFloat(value));
  }
}

IoNumber.Register();
