import {IoVector} from "./io-vector.js"
import {IoObjectProperty} from "../io-object/io-object-prop.js"

export class IoColor extends IoVector {
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('io-object-mutated', this._objectMutatedHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('io-object-mutated', this._objectMutatedHandler);
  }
  _objectMutatedHandler(event) {
    if (event.detail.object === this.value) {
      this._update();
    }
  }
  _update() {
    let elements = [];
    if (this.value.r !== undefined) elements.push('r');
    if (this.value.g !== undefined) elements.push('g');
    if (this.value.b !== undefined) elements.push('b');
    if (this.value.a !== undefined) elements.push('a');
    this.columns = elements.length + 1;
    const Prop = i => ['io-object-prop', {key: i, value: this.value, config: {tag: 'io-number'}}];
    this.render([
      ['div', {style: 'background: rgb(' + parseInt(this.value.r * 255) + ',' + parseInt(this.value.g * 255) + ',' + parseInt(this.value.b * 255) + ');'}],
      elements.map(Prop)
    ]);
  }
}

window.customElements.define('io-color', IoColor);
