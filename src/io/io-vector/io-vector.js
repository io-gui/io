import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoObjectProperty} from "../io-object/io-object-prop.js"

export class IoVector extends Io {
  static get style() {
    return html`
      <style>
        :host {
          display: grid;
        }
        :host[columns="2"] {
          grid-template-columns: 50% 50%;
        }
        :host[columns="3"] {
          grid-template-columns: 33.3% 33.3% 33.3%;
        }
        :host[columns="4"] {
          grid-template-columns: 25% 25% 25% 25%;
        }
        :host[columns="5"] {
          grid-template-columns: 20% 20% 20% 20% 20%;
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
      },
      columns: {
        type: Number,
        reflectToAttribute: true
      }
    }
  }
  _update() {
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
