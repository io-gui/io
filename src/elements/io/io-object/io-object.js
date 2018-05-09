import {Io, html} from "../../../iocore.js";
import "../io-boolean/io-boolean.js";
import "../io-number/io-number.js";
import "../io-string/io-string.js";
import "../../app/app-collapsable/app-collapsable.js";
import "./io-object-prop.js";

export class IoObject extends Io {
  static get style() {
    return html`
      <style>
        :host {
          display: inline-block;
          line-height: 1em;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        type: Object
      },
      expanded: {
        type: Boolean,
        reflect: true
      },
      label: {
        type: String
      }
    };
  }

  getPropConfigs(keys) {
    let configs = {};

    let proto = this.value.__proto__;
    let configchain = this.__proto__.constructor.configchain;

    while (proto) {
      for (let i = configchain.length; i--;) {
        let c = configchain[i][proto.constructor.name];
        if (c) configs = Object.assign(configs, c);
      }
      proto = proto.__proto__;
    }

    let propConfigs = {};

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = this.value[key];
      let type = typeof value;
      let cstr = (value && value.constructor) ? value.constructor.name : 'null';

      if (type == 'function') continue;

      propConfigs[key] = {};

      if (configs.hasOwnProperty('type:' + type)) {
        propConfigs[key] = configs['type:' + type];
      }
      if (configs.hasOwnProperty('constructor:'+cstr)) {
        propConfigs[key] = configs['constructor:'+cstr];
      }
      if (configs.hasOwnProperty('key:' + key)) {
        propConfigs[key] = configs['key:' + key];
      }
      if (configs.hasOwnProperty('value:' + String(value))) {
        propConfigs[key] = configs['value:' + String(value)];
      }
    }
    return propConfigs;
  }
  update() {
    let label = this.label || this.value.constructor.name;
    let propConfigs = this.getPropConfigs(Object.keys(this.value));
    const Prop = entry => ['io-object-prop', {key: entry[0], value: this.value, config: entry[1]}];
    this.render([
      ['app-collapsable', {label: label, expanded: this.bind('expanded'), elements:
        Object.entries(propConfigs).map(Prop)
      }]
    ]);
  }
}

IoObject.CONFIG = {
  'Object' : {
    'type:string': {tag: 'io-string', props: {}},
    'type:number': {tag: 'io-number', props: {step: 0.1}},
    'type:boolean': {tag: 'io-boolean', props: {}},
    'type:object': {tag: 'io-object', props: {}},
    'value:null': {tag: 'io-string', props: {}},
    'value:undefined': {tag: 'io-string', props: {}}
  }
};

IoObject.Register = function() {
    Io.Register.apply(this, arguments);
    this.configchain = [];
    let proto = this.prototype;
    while (proto && proto.constructor !== Element) {
      if (proto.constructor.CONFIG) {
        let cfg = proto.constructor.CONFIG;
        this.configchain.push(cfg);
      }
      proto = proto.__proto__;
    }
};

IoObject.Register();

// let c =[]
// let proto = this.constructor;
// while (proto && proto.constructor !== Io) {
//   c.push(proto.CONFIG);
//   // console.log(proto.CONFIG);
//   proto = proto.__proto__;
// }
// console.log(c);
