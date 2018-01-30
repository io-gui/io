import {IoVector} from "./io-vector.js"
import {IoObjectProperty} from "../io-object/io-object-prop.js"

export class IoMatrix extends IoVector {
  _update() {
    let elements = (this.value instanceof Array) ? this.value : this.value.elements;
    this.columns = Math.sqrt(elements.length);
    const Prop = (elem, i) => ['io-object-prop', {key: i, value: elements, config: {tag: 'io-number'}}];
    this.render([elements.map(Prop)]);
  }
}

window.customElements.define('io-matrix', IoMatrix);
