import {IoString} from "../io-string/io-string.js";

export class IoNumber extends IoString {
  static get properties() {
    return {
      value: {
        type: Number,
        observer: 'update'
      },
      step: {
        type: Number,
        value: 0.0001
      },
      min: {
        type: Number,
        value: -Infinity
      },
      max: {
        type: Number,
        value: Infinity
      }
    };
  }
  _blurHandler() {
    let value = Math.round(Number(this.innerText) / this.step) * this.step;
    if (!isNaN(value)) this.set('value', value);
    this.update();
  }
  _keydownhandler(event) {
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
      value = Math.round(value / this.step) * this.step;
      value = value.toFixed(-Math.round(Math.log(this.step) / Math.LN10));
    }
    this.innerText = String(parseFloat(value));
  }
}

IoNumber.Register();
