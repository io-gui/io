import {html} from "./core/element.js";
import "./properties.js";
import {IoCollapsable} from "./collapsable.js";

export class IoObject extends IoCollapsable {
  static get style() {
    return html`<style>
      :host {
        padding: 0;
        border: none;
        background: none;
      }
      :host > .io-content {
        display: block;
        overflow: auto;
        padding: 0;
        border: none;
        background: none;
      }
    </style>`;
  }
  static get properties() {
    return {
      value: Object,
      properties: Array,
      config: Object,
      labeled: true,
    };
  }
  changed() {
    const label = this.label || this.value.constructor.name;
    this.template([
      ['io-boolean', {true: label, false: label, value: this.expanded, 'on-value-set': this._onButtonValueSet}],
      this.expanded ? [
        ['io-properties', {
          class: 'io-content',
          value: this.value,
          properties: this.properties,
          config: this.config,
          labeled: this.labeled,
        }]
      ] : null
    ]);
    this.setAttribute('aria-expanded', String(this.expanded));
  }
}

IoObject.Register();
