import {html} from "../core/element.js";
import {IoProperties} from "./properties.js";

export class IoArray extends IoProperties {
  static get style() {
    return html`<style>
      :host {
        display: grid;
        grid-row-gap: var(--io-theme-spacing);
        grid-column-gap: var(--io-theme-spacing);
      }
      :host[columns="2"] {
        grid-template-columns: auto auto;
      }
      :host[columns="3"] {
        grid-template-columns: auto auto auto;
      }
      :host[columns="4"] {
        grid-template-columns: auto auto auto auto;
      }
    </style>`;
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
