import {html} from "../../../iocore.js";
import {IoVector} from "../io-vector/io-vector.js";
import "../io-object/io-object-prop.js";

export class IoMatrix extends IoVector {
  static get style() {
    return html`
      <style>
        :host {
          display: grid;
          line-height: 1em;
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
  update() {
    let elements = this.value;
    this.columns = Math.sqrt(elements.length);
    const Prop = (elem, i) => ['io-object-prop', {key: i, value: elements, config: {tag: 'io-number'}}];
    this.render([elements.map(Prop)]);
  }
}

IoMatrix.Register();
