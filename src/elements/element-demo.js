import {html, IoElement} from "../core/element.js";

export class IoElementDemo extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: block;
        position: relative;
        padding: var(--io-padding);
        border: var(--io-inset-border);
        border-color: var(--io-inset-border-color);
        background: rgba(127, 127, 127, 0.2);
      }
      :host > io-properties {
        margin: 0 0.5em;
      }
    </style>`;
  }
  static get properties() {
    return {
      element: {
        type: String,
        observe: true,
      },
      properties: {
        type: Object,
        observe: true,
      },
    };
  }
  _onValueSet(event) {
    this.properties.value = event.detail.value;
    this.dispatchEvent('object-mutated', {object: this.properties, key: 'value'}, false, window);
  }
  changed() {
    if (this.element) {
      this.template([
        [this.element, Object.assign({'on-value-set': this._onValueSet}, this.properties)],
        ['div', {className: 'demo-tag'}, '<' + this.element],
        ['io-properties', {value: this.properties}],
        ['div', {className: 'demo-tag'}, '></' + this.element + '>'],
      ])
    } else {
      this.template([null])
    }
  }
}

IoElementDemo.Register();
