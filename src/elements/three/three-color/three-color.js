import {ThreeVector} from "../three-vector/three-vector.js";
import "../../io/io-object/io-object-prop.js";
import "./three-color-picker.js";

export class ThreeColor extends ThreeVector {
  static get style() {
    return `
      :host {
        display: flex;
        flex-direction: row;
      }
      :host > span {
        min-width: 1.22em;
      }
    `;
  }
  update() {
    let elements = [];
    if (this.value.r !== undefined) elements.push('r');
    if (this.value.g !== undefined) elements.push('g');
    if (this.value.b !== undefined) elements.push('b');
    if (this.value.a !== undefined) elements.push('a');
    this.columns = elements.length + 1;
    const Prop = i => ['io-object-prop', {key: i, value: this.value, config: {tag: 'io-number'}}];
    this.render([
      elements.map(Prop),
      ['three-color-picker', {value: this.bind('value')}],
    ]);
  }
}

ThreeColor.Register();
