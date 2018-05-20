import {ThreeVector} from "../three-vector/three-vector.js";
import "../../io/io-object/io-object-prop.js";

export class ThreeMatrix extends ThreeVector {
  static get style() {
    return html`<style>
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
      :host > io-object-prop {
        padding: 0;
      }
      :host > io-object-prop > io-number {
        // width: 100%;
        flex: 1 1;
        color: #6ef;
      }
      :host > io-object-prop > span {
        display: none;
      }
      :host > io-object-prop > io-number {
      }
      :host > io-object-prop:nth-child(even) > io-number {
        padding-left: 0.25em;
        background: rgba(255,255,255, 0.05);
      }
      :host > io-object-prop:nth-child(odd) > io-number {
        padding-left: 0.25em;
      }
    </style>`;
  }
  update() {
    let elements = this.value;
    this.columns = Math.sqrt(elements.length);
    const Prop = (elem, i) => ['io-object-prop', {key: i, value: elements, config: {tag: 'io-number'}}];
    this.render([elements.map(Prop)]);
  }
}

ThreeMatrix.Register();
