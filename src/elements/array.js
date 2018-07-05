import {html} from "../core/element.js";
import {IoObject} from "./object.js";

//TODO: test

export class IoArray extends IoObject {
  static get style() {
    return html`<style>
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

    </style>`;
  }
  static get properties() {
    return {
      columns: {
        value: 0
      }
    };
  }
  update() {
    const elements = this.value;
    this.setAttribute('columns', this.columns || Math.sqrt(elements.length) || 1);
    const Prop = (elem, i) => ['io-number', {key: i, value: elements[i], config: {tag: 'io-number'}}];
    this.render([elements.map(Prop)]);
  }
}

IoArray.Register();
