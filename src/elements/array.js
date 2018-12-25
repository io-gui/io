import {html} from "../core/element.js";
import {IoObject} from "./object.js";

//TODO: test

export class IoArray extends IoObject {
  static get style() {
    return html`<style>
      :host {
        display: grid;
      }
      :host > io-number {
        /* margin: 1px;
        padding: 0.1em 0.2em; */
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
      // TODO: labeled?
    };
  }
  changed() {
    const elements = [];
    this.setAttribute('columns', this.columns || Math.sqrt(this.value.length) || 1);
    for (let i = 0; i < this.value.length; i++) {
      elements.push(['io-number', {id: i, value: this.value[i], 'on-value-set': this._onValueSet}]);
    }
    this.template(elements);
  }
}

IoArray.Register();
