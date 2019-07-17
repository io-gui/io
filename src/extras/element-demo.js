import {html, IoElement} from "../io.js";

export class IoElementDemo extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
        border-radius: calc(2 * var(--io-border-radius));
        border: var(--io-border);
        overflow: hidden;
      }
      :host[overflow] {
        flex-direction: column;
      }
      :host > div {
        display: flex;
        flex: 1 1 auto;
        overflow: hidden;
        flex-direction: column;
        align-items: flex-start;
        min-height: 1.2em;
        display: flex;
        flex-direction: column;
        border: var(--io-border);
        border-width: 0;
      }
      :host > :first-child {
        border-width: 0 var(--io-border-width) 0 0;
      }
      :host[overflow] > :first-child {
        flex: 0 0 auto;
        border-width: 0 0 var(--io-border-width) 0;
      }
      :host:not([overflow]) > :first-child {
        flex: 0 0 22em;
        max-width: 22em;
      }
      :host > div > span {
        font-weight: bold;
        border: var(--io-border);
        border-width: 0 0 var(--io-border-width) 0;
        background: var(--io-background-color-field);
        padding: var(--io-spacing) calc(2 * var(--io-spacing));
        align-self: stretch;
      }
      :host > div > io-properties {
        margin: var(--io-spacing);
        align-self: stretch;
      }
      :host #demo-element {
        margin: var(--io-spacing);
      }
    </style>`;
  }
  static get Attributes() {
    return {
      element: {
        type: String,
        reflect: -1,
        notify: true,
      },
      properties: {
        type: Object,
        reflect: -1,
        notify: true,
      },
      width: {
        type: String,
        reflect: -1,
      },
      height: {
        type: String,
        reflect: -1,
      },
      config: {
        type: Object,
        reflect: -1,
        notify: true,
      },
      overflow: true,
    };
  }
  static get Properties() {
    return {
      minWidth: 640,
    };
  }
  onResized() {
    this.overflow = this.getBoundingClientRect().width < this.minWidth;
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
        ['div', [
          ['span', '<' + this.element + '>'],
          ['io-properties', {value: this.properties, config: Object.assign({'type:boolean': ['io-switch']}, this.config)}],
        ]],
        ['div', [
          ['span', 'RESULT'],
          [this.element, Object.assign({'on-value-set': this._onPropSet, 'id': 'demo-element'}, this.properties)],
        ]],
       ]);
    } else {
      this.template([null]);
    }
    if (this.width) this.$['demo-element'].style.width = this.width;
    if (this.height) this.$['demo-element'].style.height = this.height;
  }
}

IoElementDemo.Register();
