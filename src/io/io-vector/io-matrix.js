import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoObjectProperty} from "../io-object/io-object-prop.js"

export class IoMatrix extends Io {
  static get style() {
    return html`
      <style>
        :host {
          display: grid;
          grid-template-columns: 25% 25% 25% 25%;
        }
        :host > io-object-prop > io-number {
          width: 100%;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        observer: '_update'
      }
    }
  }
  _update() {
    let elements = (this.value instanceof Array) ? this.value : this.value.elements;
    const Prop = (elem, i) => ['io-object-prop', {key: i, value: elements, config: {tag: 'io-number'}}];
    this.render([elements.map(Prop)]);
  }
}

window.customElements.define('io-matrix', IoMatrix);
