import {Io} from "../../../iocore.js";
import "../../io/io-object/io-object-prop.js";

export class ThreeVector extends Io {
  static get style() {
    return `
      <style>
        :host {
          display: flex;
          flex-direction: row;
        }
        :host > io-object-prop > span {
          display: none;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: null,
      columns: {
        type: Number,
        reflect: true
      }
    };
  }
  update() {
    let elements = [];
    if (this.value.x !== undefined) elements.push('x');
    if (this.value.y !== undefined) elements.push('y');
    if (this.value.z !== undefined) elements.push('z');
    if (this.value.w !== undefined) elements.push('w');
    this.columns = elements.length;
    const Prop = i => ['io-object-prop', {key: i, value: this.value, config: {tag: 'io-number'}}];
    this.render([elements.map(Prop)]);
  }
}

ThreeVector.Register();
