import {IoBase, html} from "./io-base.js"
import {IoValue} from "./io-value.js"

export class IoObjectProperty extends IoBase {
  static get is() { return 'io-object-property'; }
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
          /* background: rgba(0,0,255,0.1); */
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
        ::slotted(.io-label) {
          /* background: rgba(0,0,0,0.1); */
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
      </style><slot></slot>
    `;
  }
  static get properties() {
    return {
      value: {
        type: Object
      },
      key: {
        type: String
      },
      configs: {
        type: Array
      }
    }
  }
  constructor(props) {
    super(props);
    this._valueSetListener = this._valueSetHandler.bind(this);
    this._objectMutatedListener = this._objectMutatedHandler.bind(this);
    this.$label = this.appendHTML(html`<span class='io-label'>${this.key}</span>`);
    this._update();
  }
  connectedCallback() {
    window.addEventListener('io-object-mutated', this._objectMutatedListener);
  }
  disconnectedCallback() {
    window.removeEventListener('io-object-mutated', this._objectMutatedListener);
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
  /* Finds first matching configuration for object property */
  _getConfig() {
    let object = this._value;
    let key = this.key;
    let value = this._value[this.key];
    let type = typeof value;
    let cstr = (value && value.constructor) ? value.constructor.name : 'null';

    let config;

    for (var i = 0; i < this.configs.length; i++) {
      config = this.configs[i];
      if ('key:' + key in config) {
        return config['key:' + key];
      }
      if ('value:' + String(value) in config) {
        return config['value:' + String(value)];
      }
      if ('constructor:' + cstr in config) {
        return config['constructor:' + cstr];
      }
      if ('type:' + type in config) {
        return config['type:' + type];
      }
    }
  }
  _update() {
    let config = this._getConfig();
    let props = config.props || {};

    if (this._editor && this._editor.localName != config.tag) {
      this.removeChild(this._editor);
      delete this._editor;
    }

    if (!this._editor) {
      if (customElements.get(config.tag)) {
        let ConstructorClass = customElements.get(config.tag);
        this._editor = new ConstructorClass(config.props);
      } else {
        this._editor = document.createElement(config.tag);
        for (var c in props) {
          this._editor[c] = config.props[c];
        }
      }

      this._editor.addEventListener('io-value-set', this._valueSetListener);
      this.appendChild(this._editor);
    }

    this._editor.label = this.key;
    this._editor.value = this._value[this.key];

    // Hide key label if io-object
    // TODO: make configurable
    this.$label.classList.toggle('hidden', this._editor.localName == 'io-object');
  }
}

window.customElements.define(IoObjectProperty.is, IoObjectProperty);
