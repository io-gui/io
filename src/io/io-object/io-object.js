import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoBoolean} from "../io-value/io-boolean.js"
import {IoNumber} from "../io-value/io-number.js"
import {IoString} from "../io-value/io-string.js"
import {IoFunction} from "../io-function/io-function.js"
import {IoObjectConstructor} from "./io-object-constructor.js"
import {IoObjectProperty} from "./io-object-prop.js"

export class IoObject extends Io {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          position: relative;
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
      expanded: {
        type: Boolean,
        observer: '_update',
        reflectToAttribute: true
      },
      label: {
        type: String
      }
    }
  }
  getPropConfigs(keys) {
    let configs = {};
    let proto = this.value.__proto__;

    while (proto) {
      let c = IoObject.CONFIG[proto.constructor.name]
      if (c) configs = Object.assign(configs, c);
      proto = proto.__proto__;
    }

    let propConfigs = {};

    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = this.value[key];
      let type = typeof value;
      let cstr = (value && value.constructor) ? value.constructor.name : 'null';

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
  _update() {
    let propConfigs = this.getPropConfigs(Object.keys(this.value));
    const Prop = entry => ['io-object-prop', {key: entry[0], value: this.value, config: entry[1] }];
    this.render([
      ['io-object-constructor', {value: this.value, expanded: this.expanded, label: this.label}],
      this.expanded ? Object.entries(propConfigs).map(Prop) : null
    ])

  }
}

IoObject.CONFIG = {
  'Object' : {
    'type:string': {tag: 'io-string', props: {}},
    'type:number': {tag: 'io-number', props: {step: 0.1}},
    'type:boolean': {tag: 'io-boolean', props: {}},
    'type:object': {tag: 'io-object', props: {}},
    'type:function': {tag: 'io-function', props: {}},
    'value:null': {tag: 'io-string', props: {}},
    'value:undefined': {tag: 'io-string', props: {}}
  }
};

window.customElements.define('io-object', IoObject);
