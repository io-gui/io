import {html, IoElement} from "../../io.js";

export class IoProperties extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        display: grid;
        grid-gap: var(--io-spacing);
        justify-items: start;
        overflow: hidden;
        white-space: nowrap;
      }
      :host:not([horizontal]) {
        grid-template-columns: auto;
      }
      :host[horizontal] {
        grid-auto-flow: column;
        grid-template-rows: auto;
      }
      :host:not([horizontal])[labeled] {
        grid-template-columns: auto 1fr;
      }
      :host[horizontal][labeled] {
        grid-template-rows: auto auto;
      }
      :host:not([horizontal])[labeled] > io-item:nth-child(2n+1) {
        align-self: start;
        min-width: 0;
        max-width: 100%;
      }
      :host > io-object,
      :host > io-properties,
      :host > io-number,
      :host > io-string {
        width: auto;
        justify-self: stretch;
      }
    </style>`;
  }
  static get Properties() {
    return {
      labeled: {
        value: true,
        reflect: 1,
      },
      horizontal: {
        value: false,
        reflect: 1,
      },
      value: Object,
      properties: Array,
      config: Object,
    };
  }
  get _config() {
    return this.__proto__.__config.getConfig(this.value, this.config);
  }
  _onValueSet(event) {
    if (event.detail.object) return; // TODO: unhack/remove?
    const item = event.composedPath()[0];
    if (item === this) return;
    event.stopImmediatePropagation();
    const prop = item.id;
    if (prop !== null && event.detail.property === 'value') {
      const value = event.detail.value;
      const oldValue = event.detail.oldValue;
      this.value[prop] = value;
      const detail = {object: this.value, property: prop, value: value, oldValue: oldValue};
      this.dispatchEvent('object-mutated', detail, false, window); // TODO: test
    }
  }
  // TODO: Consider valueMutated() instead
  changed() {
    const config = this._config;
    const elements = [];
    for (let c in config) {
      if (!this.properties.length || this.properties.indexOf(c) !== -1) {
        // if (config[c]) {
        const tag = config[c][0];
        const protoConfig = config[c][1];
        const label = config[c].label || c;
        const itemConfig = {class: 'io-property-editor', title: label, id: c, value: this.value[c], 'on-value-set': this._onValueSet};
        // if (tag === 'io-properties') {
        // }
        itemConfig.config = this.config;
        elements.push(
          this.labeled ? ['io-item', {label: label + ':'}] : null,
          [tag, Object.assign(itemConfig, protoConfig)],
        );
        // }
      }
    }
    this.template(elements);
  }
  static get Config() {
    return {
      'type:string': ['io-string', {}],
      'type:number': ['io-number', {step: 0.0000001}],
      'type:boolean': ['io-boolean', {}],
      'type:object': ['io-object', {}],
      'type:null': ['io-string', {}],
      'type:undefined': ['io-string', {}],
    };
  }
}

export class Config {
  constructor(prototypes) {
    for (let i = 0; i < prototypes.length; i++) {
      this.registerConfig(prototypes[i].constructor.Config || {});
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
      const keyStr = k.replace('type:', '').replace('constructor:', '');

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
