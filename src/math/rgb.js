import {IoRgba} from "./rgba.js";

export class IoRgb extends IoRgba {
  static get Properties() {
    return {
      value: [1, 1, 1],
    };
  }
  valueChanged() {
    this._components = this.value instanceof Array ? [0, 1, 2] : ['r', 'g', 'b'];
  }
}

IoRgb.Register();
