import {html, IoElement} from "../core/element.js";

export class IoElementDemo extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        position: relative;
        padding: var(--io-padding);
        border: var(--io-inset-border);
        border-color: var(--io-inset-border-color);
        background: rgba(127, 127, 127, 0.2);
      }
      :host > io-properties {
        margin: 0.5em;
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
      _properties: Object,
    };
  }
  _onPropSet(event) {
    this.properties[event.detail.property] = event.detail.value;
    this.dispatchEvent('object-mutated', {
      object: this.properties,
      property: event.detail.property,
      value: event.detail.value,
      oldValue: event.detail.oldValue,
    }, false, window);
  }
  changed() {
    if (this.element) {
      this.template([
        ['div', {className: 'demo-tag'}, '<' + this.element + '>'],
        ['io-properties', {value: this.properties}],
        [this.element, Object.assign({'on-value-set': this._onPropSet}, this.properties)],
      ]);
    } else {
      this.template([null]);
    }
  }
}

IoElementDemo.Register();
