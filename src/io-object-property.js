import {IoBase, html} from "./io-base.js"
import {IoValue} from "./io-value.js"

class IoObjectProperty extends HTMLElement {
  static get is() { return 'io-object-property'; }
  static get template() {
    return html`
      <style>
        :host {
          display: inline;
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
      </style><slot></slot>
    `;
  }

  constructor(key, value) {
    super();
    this._key = key;
    this._value = value;
    this._valueSetListener = this._valueSetHandler.bind(this);
    this._objectMutatedListener = this._objectMutatedHandler.bind(this);

    this._shadowRoot = this.attachShadow({mode: 'open'});
    this._shadowRoot.innerHTML = this.__proto__.constructor.template;

    this._update();
  }
  connectedCallback() {
    window.addEventListener('io-object-mutated', this._objectMutatedListener);
  }
  disconnectedCallback() {
    window.removeEventListener('io-object-mutated', this._objectMutatedListener);
  }
  _valueSetHandler(event) {
    this._value[this._key] = event.detail.value;
    window.dispatchEvent(new CustomEvent('io-object-mutated', {
      detail: {object: this._value, key: this._key},
      bubbles: false,
      composed: true
    }));
  }
  _objectMutatedHandler(event) {
    if (event.detail.object === this._value) {
      if (event.detail.key === this._key || event.detail.key === '*') {
        this._update();
      }
    }
  }
  /* Finds first matching configuration for object property */
  _getConfig() {
    let object = this._value;
    let key = this._key;
    let value = this._value[this._key];
    let type = typeof value;
    let cstr = (value && value.constructor) ? value.constructor.name : 'null';

    // Follow object prototype chain to find first configuration block that matches.
    let proto = object.__proto__;
    let config;

    while (proto) {
      config = IoObjectProperty.config['constructor:' + proto.constructor.name];
      if (config) {
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
      proto = proto.__proto__;
    }
  }
  _update() {
    let config = this._getConfig() || {};
    let params = config.params || {};

    if (this._editor) {
      this.removeChild(this._editor);
      delete this._editor;
    }

    if (!this._editor || this._editor.localName != config.tag) {
      this._editor = document.createElement(config.tag);
      this._editor.addEventListener('value-changed', this._valueSetListener);
      this.appendChild(this._editor);
    }

    for (var c in params) {
      this._editor[c] = config.params[c];
    }

    this._editor.value = this._value[this._key];
  }
}

window.customElements.define(IoObjectProperty.is, IoObjectProperty);

// Default object property configurations.
// Object configurations are looked up in order of prototype inheritance.
// Property selectors are looked up in order: key, value, constructor, type.
// First matching object/property config will be used.
IoObjectProperty.config = {
  'constructor:Object' : {
    'value:null': {tag: 'io-value', params: {disabled: true}},
    'value:undefined': {tag: 'io-value', params: {disabled: true}},
    'constructor:Array': {tag: 'io-object', params: {labeled: false, expanded: true}},
    'type:string': {tag: 'io-value', params: {type: 'string'}},
    'type:number': {tag: 'io-value', params: {type: 'number', step: 0.1}},
    'type:boolean': {tag: 'io-value', params: {type: 'boolean'}},
    'type:object': {tag: 'io-object', params: {labeled: true}}
  },
  'constructor:Array': {
    'type:number': {tag: 'io-value', params: {type: 'number', step: 1 }}
  }
}

export { IoObjectProperty }
