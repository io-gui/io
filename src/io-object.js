import {html} from "./ioutil.js"
import {Io} from "./io.js"
import {IoValue} from "./io-value.js"
import {IoFunction} from "./io-function.js"
import {IoObjectConstructor} from "./io-object-constructor.js"
import {IoObjectProperty} from "./io-object-property.js"

export class IoObject extends Io {
  static get is() { return 'io-object'; }
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          /* background: rgba(255,0,0,0.1); */
          position: relative;
        }
        ::slotted(io-object-property):before {
          content: "\\00a0\\00a0─\\00a0";
        }
        :host #tree-line {
          display: none;
        }
        :host([expanded]) > #tree-line {
          display: inline-block;
          position: absolute;
          pointer-events: none;
          width: 0.5em;
          border-right: 1px solid black;
          top: 1.5em;
          bottom: 0.5em;
        }
      </style><div id="tree-line"></div><slot></slot>
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
    this.$constructor = new IoObjectConstructor({object: this.value, expanded: this.expanded, label: this.label});
    this.bind('expanded', this.$constructor, 'expanded');
    this.bind('label', this.$constructor, 'label', true);
    this.bind('value', this.$constructor, 'object', true);
    this.appendChild(this.$constructor);
    this.$property = {};
  }
  _update() {
    if (this.value instanceof Object === false) return;

    let config, configs = [];
    let _c = {};

    let proto = this.value.__proto__;
    while (proto) {
      config = IoObject.CONFIG['constructor:' + proto.constructor.name];
      if (config) {
        configs.push(config); //TODO:remove
        _c = Object.assign(_c, config);
      }
      proto = proto.__proto__;
    }

    for (var i in IoObject.CONFIG) {
      if (i.substring(0,11) == 'instanceof:') {
        let classRef = i.slice(11);
        if (IoObject.CLASSES[classRef] && this.value instanceof IoObject.CLASSES[classRef]) {
          config = IoObject.CONFIG[i];
          configs.push(config);//TODO:remove
          _c = Object.assign(_c, config);
        }
      }
    }

    let _keys = Object.keys(this.value);
    let _$keys = Object.keys(this.$property);

    if (this.expanded) {
      for (let i = 0; i < _keys.length; i++) {
        let key = _keys[i];
        let value = this.value[key];
        let type = typeof this.value[key];

        let cstr = (value && value.constructor) ? value.constructor.name : 'null';
        // console.log(key, value, 'type:' + type, 'type:' + type in _c);
        let _cfg = {};
        if ('type:' + type in _c) {
          _cfg = _c['type:' + type];
        }
        if ('constructor:' + cstr in _c) {
          _cfg = _c['constructor:' + cstr];
        }
        if ('key:' + key in _c) {
          _cfg = _c['key:' + key];
        }
        if ('value:' + String(value) in _c) {
          _cfg = _c['value:' + String(value)];
        }

        if (!this.$property[key]) {
          this.$property[key] = new IoObjectProperty({value: this.value, key: key, config: _cfg});
        }
        this.appendChild(this.$property[key]);
      }
    } else {
      for (let i = 0; i < _$keys.length; i++) {
        this.$property[_$keys[i]] = this.$property[_$keys[i]].parentElement.removeChild(this.$property[_$keys[i]]);
      }
      // TODO: remove unused and take care of garbage.
    }
  }
}

IoObject.CLASSES = {
  'Number': Number,
  'String': String,
  'Boolean': Boolean,
  'Object': Object,
  'Array': Array
}
IoObject.CONFIG = {
  'constructor:Object' : {
    'type:string': {tag: 'io-value', props: {type: 'string'}},
    'type:number': {tag: 'io-value', props: {type: 'number', step: 0.1}},
    'type:boolean': {tag: 'io-value', props: {type: 'boolean'}},
    'type:object': {tag: 'io-object', props: {}},
    'type:function': {tag: 'io-function', props: {}},
    'value:null': {tag: 'io-value', props: {}},
    'value:undefined': {tag: 'io-value', props: {}},
    // TODO
    'instanceof:Array': {tag: 'io-object', props: {expanded: true}},
  } ,
  // 'instanceof:Object' : {
  //   'key:name': {tag: 'input', props: { type: 'string' }}
  // }
};

window.customElements.define(IoObject.is, IoObject);
