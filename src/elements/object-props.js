import {html, IoElement} from "../core/element.js";

export class IoObjectProps extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        flex: 0 0;
        line-height: 1em;
      }
      :host > div.io-object-group {
        font-weight: bold;
      }
      :host > div.io-object-prop {
        display: flex !important;
        flex-direction: row;
      }
      :host > div > span {
        padding: 0 0.2em 0 0.5em;
        flex: 0 0 auto;
      }
      :host > div > io-number,
      :host > div > io-string,
      :host > div > io-boolean {
        border: none;
        background: none;
        margin: 0;
        padding: 0;
      }
      :host > div > io-number {
        color: rgb(28, 0, 207);
      }
      :host > div > io-string {
        color: rgb(196, 26, 22);
      }
      :host > div > io-boolean {
        color: rgb(170, 13, 145);
      }
      :host > div > io-option {
        color: rgb(0, 32, 135);
      }
    </style>`;
  }
  static get properties() {
    return {
      value: Object,
      // config: Object,
      props: Array,
      labeled: true,
    };
  }
  get _config() {
    return this.__proto__.__config.getConfig(this.value, this.config);
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('object-mutated', this._onIoObjectMutated);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('object-mutated', this._onIoObjectMutated);
  }
  _onIoObjectMutated(event) {
    let key = event.detail.key;
    if (event.detail.object === this.value) {
      if (key && this.$[key]) {
        this.$[key].__props.value.value = this.value[key];
        this.$[key].changed();
      } else if (!key || key === '*') {
        for (let k in this.$) {
          this.$[k].__props.value.value = this.value[k];
          this.$[k].changed();
        }
      }
    }
  }
  _onValueSet(event) {
    const path = event.composedPath();
    if (path[0] === this) return;
    if (event.detail.object) return; // TODO: unhack
    event.stopPropagation();
    let key = path[0].id;
    if (key !== null) {
      this.value[key] = event.detail.value;
      let detail = Object.assign({object: this.value, key: key}, event.detail);
      this.dispatchEvent('object-mutated', detail, false, window);
      this.dispatchEvent('value-set', detail, false); // TODO
    }
  }
  changed() {
    // this.__protoConfig.merge(this.config);
    const config = this._config;
    const elements = [];
    for (let c in config) {
      if (!this.props.length || this.props.indexOf(c) !== -1) {
        if (config[c]) {
          const tag = config[c][0];
          const protoConfig = config[c][1];
          const label = config[c].label || c;
          const itemConfig = {title: label, id: c, value: this.value[c], 'on-value-set': this._onValueSet};
          elements.push(
            ['div', {className: 'io-object-prop'}, [
              this.labeled ? ['span', {title: label}, label + ':'] : null,
              [tag, Object.assign(itemConfig, protoConfig)]
            ]]);
        }
      }
    }
    this.template(elements);
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
  getConfig(object) {
    const keys = Object.keys(object);
    const prototypes = [];

    let proto = object.__proto__;
    while (proto) {
      keys.push(...Object.keys(proto));
      prototypes.push(proto.constructor.name);
      proto = proto.__proto__;
    }

    const protoConfigs = {};
    for (let i = prototypes.length; i--;) {
      // if (instanceConfig) {
      //   this.extend(protoConfigs, instanceConfig[prototypes[i]]);
      //   console.log(instanceConfig);
      // }
      if (this[prototypes[i]]) this.extend(protoConfigs, this[prototypes[i]]);
    }

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

export class ProtoConfig {
  constructor(prototypes) {
    for (let i = 0; i < prototypes.length; i++) {
      this.extend(this, prototypes[i].constructor.config || {});
    }
  }
  extend(a, b) {
    for (let i in b) {
      a[i] = a[i] || {};
      for (let j in b[i]) {
        a[i][j] = a[i][j] || [];
        a[i][j] = [b[i][j][0] || a[i][j][0], Object.assign(a[i][j][1] || {}, b[i][j][1] || {})];
      }
    }
  }
  getKeys() {

  }
  merge(config) {
    let _config = {};
    this.extend(_config, config);
    this.extend(_config, this);
    return _config;
  }
}

IoObjectProps.Register = function() {
  IoElement.Register.call(this);
  Object.defineProperty(this.prototype, '__config', {value: new Config(this.prototype.__prototypes)});
  Object.defineProperty(this.prototype, '__protoConfig', {value: new ProtoConfig(this.prototype.__prototypes)});
};

IoObjectProps.Register();
