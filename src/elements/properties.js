import {html, IoElement} from "../core/element.js";

export class IoProperties extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        line-height: 1em;
      }
      :host > .io-property {
        display: flex !important;
        flex-direction: row;
      }
      :host > .io-property > .io-property-label {
        padding: 0 0.2em 0 0.5em;
        flex: 0 0 auto;
        color: var(--io-theme-color);
      }
      :host > .io-property > .io-property-editor {
        margin: 0;
        padding: 0;
      }
      :host > .io-property > io-object,
      :host > .io-property > io-object > io-boolean,
      :host > .io-property > io-object > io-properties {
        padding: 0 !important;
        border: none !important;
        background: none !important;
      }
      :host > .io-property > io-number,
      :host > .io-property > io-string,
      :host > .io-property > io-boolean {
        border: none;
        background: none;
      }
      :host > .io-property > io-number {
        color: var(--io-theme-number-color);
      }
      :host > .io-property > io-string {
        color: var(--io-theme-string-color);
      }
      :host > .io-property > io-boolean {
        color: var(--io-theme-boolean-color);
      }
    </style>`;
  }
  static get properties() {
    return {
      value: Object,
      config: Object,
      props: Array,
      labeled: true,
    };
  }
  get _config() {
    return this.__proto__.__config.getConfig(this.value, this.config);
  }
  _onValueSet(event) {
    const path = event.composedPath();
    if (path[0] === this) return;
    if (event.detail.object) return; // TODO: unhack
    event.stopPropagation();
    const key = path[0].id;
    if (key !== null) {
      this.value[key] = event.detail.value;
      const detail = Object.assign({object: this.value, key: key}, event.detail);
      this.dispatchEvent('object-mutated', detail, false, window); // TODO: test
      this.dispatchEvent('value-set', detail, false);
    }
  }
  // TODO: Consider valueMutated() instead
  changed() {
    const config = this._config;
    const elements = [];
    for (let c in config) {
      if (!this.props.length || this.props.indexOf(c) !== -1) {
        // if (config[c]) {
        const tag = config[c][0];
        const protoConfig = config[c][1];
        const label = config[c].label || c;
        const itemConfig = {className: 'io-property-editor', title: label, id: c, value: this.value[c], 'on-value-set': this._onValueSet};
        elements.push(
          ['div', {className: 'io-property'}, [
            this.labeled ? ['span', {className: 'io-property-label', title: label}, label + ':'] : null,
            [tag, Object.assign(itemConfig, protoConfig)]
          ]]);
        // }
      }
    }
    this.template(elements);
  }
  static get config() {
    return {
      'type:string': ['io-string', {}],
      'type:number': ['io-number', {step: 0.01}],
      'type:boolean': ['io-boolean', {true: '☑ true', false: '☐ false'}],
      'type:object': ['io-object', {}],
      'type:null': ['io-string', {}],
      'type:undefined': ['io-string', {}],
    };
  }
}

export class Config {
  constructor(prototypes) {
    for (let i = 0; i < prototypes.length; i++) {
      this.registerConfig(prototypes[i].constructor.config || {});
    }
  }
  registerConfig(config) {
    for (let c in config) {
      this[c] = this[c] || [];
      this[c] = [config[c][0] || this[c][0], Object.assign(this[c][1] || {}, config[c][1] || {})];
    }
  }
  getConfig(object, customConfig) {
    const keys = Object.keys(object);
    const prototypes = [];

    let proto = object.__proto__;
    while (proto) {
      if (proto.constructor !== HTMLElement
          && proto.constructor !== Element
          && proto.constructor !== Node
          && proto.constructor !== EventTarget
          && proto.constructor !== Object) {
        keys.push(...Object.keys(proto));
      }
      prototypes.push(proto.constructor.name);
      proto = proto.__proto__;
    }

    const protoConfigs = {};

    for (let i in this) {
      const cfg = i.split('|');
      if (cfg.length === 1) cfg.splice(0, 0, 'Object');
      if (prototypes.indexOf(cfg[0]) !== -1) protoConfigs[cfg[1]] = this[i];
    }

    for (let i in customConfig) {
      const cfg = i.split('|');
      if (cfg.length === 1) cfg.splice(0, 0, 'Object');
      if (prototypes.indexOf(cfg[0]) !== -1) protoConfigs[cfg[1]] = customConfig[i];
    }

    const config = {};

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const value = object[k];
      const type = value === null ? 'null' : typeof value;
      const cstr = (value != undefined && value.constructor) ? value.constructor.name : 'null';

      if (type == 'function') continue;

      const typeStr = 'type:' + type;
      const cstrStr = 'constructor:' + cstr;
      const keyStr = k;

      config[k] = {};

      if (protoConfigs[typeStr]) config[k] = protoConfigs[typeStr];
      if (protoConfigs[cstrStr]) config[k] = protoConfigs[cstrStr];
      if (protoConfigs[keyStr]) config[k] = protoConfigs[keyStr];
    }

    return config;
  }
}

IoProperties.Register = function() {
  IoElement.Register.call(this);
  Object.defineProperty(this.prototype, '__config', {value: new Config(this.prototype.__protochain)});
};

IoProperties.Register();
IoProperties.RegisterConfig = function(config) {
  this.prototype.__config.registerConfig(config);
};
