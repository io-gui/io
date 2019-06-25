import {html, IoElement} from "../core/element.js";

export class IoElementDemo extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        position: relative;
        border: var(--io-inset-border);
        border-color: var(--io-inset-border-color);
        background: rgba(0, 0, 0, 0.125);
      }
      :host > .demo-tag {
        margin: var(--io-spacing);
        margin-bottom: 0;
      }
      :host > io-properties {
        margin-left: 0.5em;
      }
      :host > .io-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: var(--io-spacing);
        min-height: 1.2em;
        background: rgba(255, 255, 255, 0.125);
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
      config: {
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
  _onObjectMutation(event) {
    super._onObjectMutation(event);
    for (let p in this.properties) {
      if (typeof this.properties[p] === 'object') {
        this._bubbleMutation(this.properties[p], this.properties, event.detail.object);
      }
    }
  }
  _bubbleMutation(object, parentObject, srcObject) {
    if (object === srcObject) {
      this.dispatchEvent('object-mutated', {
        object: parentObject,
      }, false, window);
    } else {
      for (let p in object) {
        if (typeof object[p] === 'object') {
          this._bubbleMutation(object[p], object, srcObject);
        }
      }
    }
  }
  changed() {
    for (let prop in this.properties) {
      if (this.properties[prop] === 'undefined') {
        this.properties[prop] = undefined;
      }
    }
    if (this.element) {
      this.template([
        ['div', {class: 'demo-tag'}, '<' + this.element + '>'],
        ['io-properties', {value: this.properties, config: this.config}],
        ['div', {class: 'io-content'}, [
          [this.element, Object.assign({'on-value-set': this._onPropSet}, this.properties)],
        ]],
      ]);
    } else {
      this.template([null]);
    }
  }
}

IoElementDemo.Register();
