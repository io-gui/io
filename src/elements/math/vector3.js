import {IoVector2} from "./vector2.js";

export class IoVector3 extends IoVector2 {
  static get Properties() {
    return {
      value: [0, 0, 0],
    };
  }
  valueChanged() {
    this._components = this.value instanceof Array ? [0, 1, 2] : ['x', 'y', 'z'];
  }
}

IoVector3.Register();
