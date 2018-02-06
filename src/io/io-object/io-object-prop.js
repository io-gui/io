import {html} from "../ioutil.js"
import {Io} from "../io.js"

export class IoObjectProp extends Io {
  static get style() {
    return html`
      <style>
        :host {
          display: inline-block;
        }
        :host > io-number {
          color: rgb(28, 0, 207);
        }
        :host > io-string {
          color: rgb(196, 26, 22);
        }
        :host > io-boolean {
          color: rgb(170, 13, 145);
        }
        :host > io-option {
          color: rgb(32,135,0);
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
      tag: {
        type: String,
        reflectToAttribute: true
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
    this.tag = this.config.tag;
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
