import {IoVector} from "./vector.js";

export class IoHsva extends IoVector {
  static get Properties() {
    return {
      value: [1, 1, 1, 1],
      min: 0,
      max: 1,
      step: 0.01,
    };
  }
  valueChanged() {
    this._c = this.value instanceof Array ? [0, 1, 2, 3] : ['h', 's', 'v', 'a'];
  }
  getSlotted() {
    return ['io-hsva-swatch', {id: 'swatch', value: this.value}];
  }
}

IoHsva.Register();
