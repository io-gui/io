import {html, IoElement} from "../classes/element.js";
import "./object-group.js";

const __configsMap = new WeakMap();

export class IoObject extends IoElement {
  static get properties() {
    return {
      value: Object,
      label: String,
      expanded: Boolean,
      props: Array,
      config: Object,
      _config: Object,
    };
  }
  valueChanged() {
    if (__configsMap.has(this.value)) {
      this._config = __configsMap.get(this.value);
    } else {
      this._config = this.__proto__.__configs.getConfig(this.value, this.config);
      __configsMap.set(this.value, this._config);
    }
  }
  configChanged() {
    this._config = this.__proto__.__configs.getConfig(this.value, this.config);
  }
  changed() {
    this.template([
      ['io-object-group', {
        value: this.value,
        label: this.label || this.value.constructor.name,
        expanded: this.bind('expanded'),
        props: this.props.length ? this.props : Object.keys(this._config),
        config: this._config,
      }],
    ]);
  }
  static get config() {
    return {
      'Object': {
        'type:string': ['io-string', {}],
        'type:number': ['io-number', {step: 0.01}],
        'type:boolean': ['io-boolean', {}],
        'type:object': ['io-object', {}],
        'value:null': ['io-string', {}],
        'value:undefined': ['io-string', {}],
      },
      'Array': {
        'type:number': ['io-number', {step: 0.1}],
      },
    };
  }
}

export class Config {
  constructor(prototypes) {
    for (let i = 0; i < prototypes.length; i++) {
      const config = prototypes[i].constructor.config || {};
      for (let cstr in config) {
        this[cstr] = this[cstr] || {};
        this.extend(this[cstr], config[cstr]);
      }
    }
  }
  extend(configs, configsEx) {
    for (let c in configsEx) {
      configs[c] = configs[c] || [];
      configs[c] = [configs[c][0] || configsEx[c][0], Object.assign(configs[c][1] || {}, configsEx[c][1] || {})];
    }
  }
  getConfig(object, instanceConfig = {}) {
    const keys = Object.keys(object);
    const prototypes = [];

    let proto = object.__proto__;
    while (proto) {
      keys.push(...Object.keys(proto));
      prototypes.push(proto.constructor.name);
      proto = proto.__proto__;
    }

    const protoConfigs = {};
    for (var i = prototypes.length; i--;) {
      this.extend(protoConfigs, this[prototypes[i]]);
    }
    this.extend(protoConfigs, instanceConfig);

    const config = {};

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const value = object[k];
      const type = typeof value;
      const cstr = (value && value.constructor) ? value.constructor.name : 'null';

      const typeStr = 'type:' + type;
      const cstrStr = 'constructor:' + cstr;
      const keyStr = k;
      const valueStr = 'value:' + String(value); // TODO: consider optimizing against large strings.

      if (type == 'function') continue;

      config[k] = {};

      if (protoConfigs[typeStr]) config[k] = protoConfigs[typeStr];
      if (protoConfigs[cstrStr]) config[k] = protoConfigs[cstrStr];
      if (protoConfigs[keyStr]) config[k] = protoConfigs[keyStr];
      if (protoConfigs[valueStr]) config[k] = protoConfigs[valueStr];
    }

    return config;
  }
}

IoObject.Register = function() {
  IoElement.Register.call(this);
  Object.defineProperty(this.prototype, '__configs', {value: new Config(this.prototype.__prototypes)});
};

IoObject.Register();
