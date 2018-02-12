import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoObjectProp} from "../io-object/io-object-prop.js"

export class IoVector extends Io {
  static get style() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        observer: 'update'
      },
      columns: {
        type: Number,
        reflectToAttribute: true
      }
    }
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

window.customElements.define('io-vector', IoVector);
