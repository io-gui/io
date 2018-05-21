import {Io} from "../../../iocore.js";

export class IoObject extends Io {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        flex: 0 0;
        line-height: 1em;
      }
      :host > div {
        display: flex;
        flex-direction: row;
      }
      :host > div > span {
        padding: 0 0.2em 0 0.5em;
        flex: 0 0 auto;
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
    </style>`;
  }
  static get properties() {
    return {
      value: Object,
      props: Array,
      configs: Object,
      expanded: {
        type: Boolean,
        reflect: true
      },
      label: String
    };
  }
  static get listeners() {
    return {
      'value-set': '_onValueSet'
    }
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('io-object-mutated', this._onIoObjectMutated);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('io-object-mutated', this._onIoObjectMutated);
  }
  _onIoObjectMutated(event) {
    let key = event.detail.key;
    if (event.detail.object === this.value && this.$[key]) {
      this.$[key].__props.value.value = this.value[key];
      this.$[key].update();
    }
  }
  _onValueSet(event) {
    event.stopPropagation();
    let key = event.path[0].id;
    if (key !== undefined) {
      this.value[key] = event.detail.value;
      window.dispatchEvent(new CustomEvent('io-object-mutated', {
        detail: {object: this.value, key: key},
        bubbles: false,
        composed: true
      }));
    }
  }
  getPropConfigs(keys) {
    let configs = {};

    let proto = this.value.__proto__;
    while (proto) {
      let c = IoObjectConfig[proto.constructor.name];
      if (c) configs = Object.assign(configs, c);
      c = this.configs[proto.constructor.name];
      if (c) configs = Object.assign(configs, c);
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
    let elements = [];
    if (this.expanded) {
      let proplist = this.props.length ? this.props : Object.keys(this.value);
      let configs = this.getPropConfigs(proplist);
      for (var key in configs) {
        let editor = [configs[key].tag, Object.assign({value: this.value[key], id: key}, configs[key].props)];
        elements.push(
        ['div', [['span', configs[key].label || key + ':'], editor]]);
      }
    }
    this.render([['io-boolean', {true: '▾' + label, false: '▸' + label, value: this.bind('expanded')}], elements]);
  }
}

const IoObjectConfig = {
  'Object' : {
    'type:string': {tag: 'io-string', props: {}},
    'type:number': {tag: 'io-number', props: {step: 0.1}},
    'type:boolean': {tag: 'io-boolean', props: {}},
    'type:object': {tag: 'io-object', props: {}},
    'value:null': {tag: 'io-string', props: {}},
    'value:undefined': {tag: 'io-string', props: {}}
  }
};

IoObject.Register();
