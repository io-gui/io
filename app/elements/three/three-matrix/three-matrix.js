import {html} from "../../../../src/io.js";
import {ThreeVector} from "../three-vector/three-vector.js";

export class ThreeMatrix extends ThreeVector {
  static get style() {
    return html`<style>
      :host {
        display: grid;
        background: red;
        border: 0.5px inset #888;
      }
      :host > io-number:nth-child(n+5) {
        border-top: 0.5px solid #666;
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

    </style>`;
  }
  static get properties() {
    return {
      columns: {
        reflect: true
      }
    };
  }
  update() {
    let elements = this.value;
    this.columns = Math.sqrt(elements.length);
    const Prop = (elem, i) => ['io-number', {key: i, value: elements[i], config: {tag: 'io-number'}}];
    this.render([elements.map(Prop)]);
  }
}

ThreeMatrix.Register();
