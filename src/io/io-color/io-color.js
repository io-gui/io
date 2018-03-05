import {html} from "../../iocore.js";
import {IoVector} from "../io-vector/io-vector.js";
import "../io-object/io-object-prop.js";
import "./io-color-picker.js";

export class IoColor extends IoVector {
  static get style() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
        }
        :host > span {
          min-width: 1.22em;
        }
      </style>
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
      ['io-color-picker', {value: this.bind('value')}],
    ]);
  }
}

window.customElements.define('io-color', IoColor);
