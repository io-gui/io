import {html} from "../ioutil.js"
import {Io} from "../io.js"

export class IoObjectProp extends Io {
  static get shadowStyle() {
    return html`
      <style>
        :host {
          display: inline-block;
        }
        ::slotted(io-number) {
          color: rgb(28, 0, 207);
        }
        ::slotted(io-string) {
          color: rgb(196, 26, 22);
        }
        ::slotted(io-boolean) {
          color: rgb(170, 13, 145);
        }
        ::slotted(io-option) {
          color: rgb(12,125,5);
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
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('io-object-mutated', this._objectMutatedHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
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
      [this.config.tag, Object.assign({
          value: this.value[this.key],
          label: this.key,
          listeners: {'value-set': this._valueSetHandler}},
          this.config.props)]
    ]);
  }
}

window.customElements.define('io-object-prop', IoObjectProp);
