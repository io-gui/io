import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoValue} from "../io-value/io-value.js"
import {IoFunction} from "../io-function/io-function.js"
import {IoObjectConstructor} from "./io-object-constructor.js"
import {IoObjectProperty} from "./io-object-property.js"

export class IoObject extends Io {
  static get is() { return 'io-object'; }
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          position: relative;
        }
        ::slotted(io-object-property):before {
          content: "\\00a0\\00a0─\\00a0";
        }
        ::slotted(.io-tree-line) {
          display: inline-block;
          position: absolute;
          pointer-events: none;
          width: 0.5em;
          border-right: 1px solid black;
          top: 1.5em;
          bottom: 0.5em;
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
  constructor(props) {
    super(props);
    this._update();
  }
  _update() {
    let configs = {};
    let proto = this.value.__proto__;
    while (proto) {
      let c = IoObject.CONFIG[proto.constructor.name];
      if (c) configs = Object.assign(configs, c);
      proto = proto.__proto__;
    }

    let keys = Object.keys(this.value);
    let propConfig = [];

    if (this.expanded) {
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let value = this.value[key];
        let type = typeof this.value[key];
        let cstr = (value && value.constructor) ? value.constructor.name : 'null';

        propConfig[key] = {};

        if (configs.hasOwnProperty('type:' + type)) {
          propConfig[key] = configs['type:' + type];
        }
        if (configs.hasOwnProperty(cstr)) {
          propConfig[key] = configs[cstr];
        }
        if (configs.hasOwnProperty('key:' + key)) {
          propConfig[key] = configs['key:' + key];
        }
        if (configs.hasOwnProperty('value:' + String(value))) {
          propConfig[key] = configs['value:' + String(value)];
        }
      }
    }

    this.render([
      ['div', {className: 'io-tree-line'}], // TODO: optionsl
      ['io-object-constructor', {object: this.value, expanded: this.expanded, label: this.label}],
      this.expanded ? keys.map(key => ['io-object-property', { key: key, value: this.value, config: propConfig[key] } ]) : null
    ])

  }
}

IoObject.CONFIG = {
  'Object' : {
    'type:string': {tag: 'io-value', props: {type: 'string'}},
    'type:number': {tag: 'io-value', props: {type: 'number', step: 0.1}},
    'type:boolean': {tag: 'io-value', props: {type: 'boolean'}},
    'type:object': {tag: 'io-object', props: {}},
    'type:function': {tag: 'io-function', props: {}},
    'value:null': {tag: 'io-value', props: {}},
    'value:undefined': {tag: 'io-value', props: {}}
  }
};

window.customElements.define(IoObject.is, IoObject);
