import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoValue} from "../io-value/io-value.js"

export class IoObjectProperty extends Io {
  static get is() { return 'io-object-prop'; }
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
        }
        ::slotted(io-value[type="number"]) {
          color: rgb(28, 0, 207);
        }
        ::slotted(io-value[type="string"]) {
          color: rgb(196, 26, 22);
        }
        ::slotted(io-value[type="boolean"]) {
          color: rgb(170, 13, 145);
        }
        ::slotted(io-option) {
          background: rgba(64,64,128,0.1);
        }
        ::slotted(.io-label):after {
          content: ":\\00a0";
        }
        ::slotted(.io-label) {
          position: relative;
        }
        ::slotted(.io-label.hidden) {
          display: none;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        type: Object,
        observer: '_update'
      },
      key: {
        type: String,
        observer: '_update'
      },
      config: {
        type: Array,
        observer: '_update'
      }
    }
  }
  constructor(props) {
    super(props);
    this._update();
  }
  connectedCallback() {
    window.addEventListener('io-object-mutated', this._objectMutatedHandler);
  }
  disconnectedCallback() {
    window.removeEventListener('io-object-mutated', this._objectMutatedHandler);
  }
  _valueSetHandler(event) {
    this.value[this.key] = event.detail.value;
    window.dispatchEvent(new CustomEvent('io-object-mutated', {
      detail: {object: this.value, key: this.key},
      bubbles: false,
      composed: true
    }));
  }
  _objectMutatedHandler(event) {
    if (event.detail.object === this.value) {
      if (event.detail.key === this.key || event.detail.key === '*') {
        this._update();
      }
    }
  }
  _update() {
    this.render([
      this.config.tag == 'io-object' ? null : ['span', {className: 'io-label'}, this.key],
      [this.config.tag, Object.assign({value: this.value[this.key], label: this.key}, this.config.props) ]
    ])
  }
}

window.customElements.define(IoObjectProperty.is, IoObjectProperty);
