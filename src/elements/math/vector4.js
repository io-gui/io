import {IoVector2} from "./vector2.js";

export class IoVector4 extends IoVector2 {
  static get Properties() {
    return {
      value: [0, 0, 0, 0],
    };
  }
  valueChanged() {
    this._c = this.value instanceof Array ? [0, 1, 2, 3] : ['x', 'y', 'z', 'w'];
  }
}

IoVector4.Register();
