import {IoBase, html} from "./io-base.js"
import {IoValue} from "./io-value.js"
import {IoFunction} from "./io-function.js"
import {IoObjectConstructor} from "./io-object-constructor.js"
import {IoObjectProperty} from "./io-object-property.js"

export class IoObject extends IoBase {
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
        observer: '_updateJob'
      },
      expanded: {
        type: Boolean,
        observer: '_updateJob',
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
    for (var i in IoObject.CONFIG) {
      if (i.substring(0,11) == 'instanceof:') {
        let classRef = i.slice(11);
        if (IoObject.CLASSES[classRef] && this.value instanceof IoObject.CLASSES[classRef]) {
          config = IoObject.CONFIG[i];
          config._debug = i;
          configs.push(config);
        }
      }
    }

    // Follow object prototype chain to find first configuration block that matches.
    let proto = this.value.__proto__;
    while (proto) {
      config = IoObject.CONFIG['constructor:' + proto.constructor.name];
      if (config) {
        config._debug = 'constructor:' + proto.constructor.name;
        configs.push(config);
      }
      proto = proto.__proto__;
    }

    let _keys = Object.keys(this.value);
    let _$keys = Object.keys(this.$property);

    if (this.expanded) {
      for (let i = 0; i < _keys.length; i++) {
        if (!this.$property[_keys[i]]) {
          this.$property[_keys[i]] = new IoObjectProperty({value: this.value, key: _keys[i], configs: configs});
        }
        this.appendChild(this.$property[_keys[i]]);
      }
    } else {
      for (let i = 0; i < _$keys.length; i++) {
        this.$property[_$keys[i]] = this.$property[_$keys[i]].parentElement.removeChild(this.$property[_$keys[i]]);
      }
      // TODO: remove unused and take care of garbage.
    }

  }
}

// Default object property configurations.
// Object configurations are looked up in order of prototype inheritance.
// Property selectors are looked up in order: key, value, constructor, type.
// First matching object/property config will be used.
IoObject.CLASSES = {};
IoObject.CONFIG = {
  'constructor:Object' : {
    'value:null': {tag: 'io-value', props: {}},
    'value:undefined': {tag: 'io-value', props: {}},
    'constructor:Array': {tag: 'io-object', props: {expanded: true}},
    'type:string': {tag: 'io-value', props: {type: 'string'}},
    'type:number': {tag: 'io-value', props: {type: 'number', step: 0.1}},
    'type:boolean': {tag: 'io-value', props: {type: 'boolean'}},
    'type:object': {tag: 'io-object', props: {}},
    'type:function': {tag: 'io-function', props: {}}
  },
  'constructor:Array': {
    'type:number': {tag: 'io-value', props: {type: 'number', step: 1}}
  }
};

window.customElements.define(IoObject.is, IoObject);
