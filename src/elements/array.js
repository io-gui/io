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
  changed() {
    const elements = [];
    this.setAttribute('columns', this.columns || Math.sqrt(this.value.length) || 1);
    for (let i = 0; i < this.value.length; i++) {
      elements.push(['io-number', {
        id: String(i),
        value: this.value[i],
        config: {tag: 'io-number'},
        'on-value-set': this._onValueSet
      }]);
    }
    this.template(elements);
  }
}

IoArray.Register();
