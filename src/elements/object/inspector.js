import {html, IoElement, IoStorage as $} from "../../io.js";
import "./breadcrumbs.js";
// import {Item} from "../../io-elements-core.js";

class Item {
  constructor(value) {
    if (typeof value === 'object' && (value.options !== undefined || value.action !== undefined || value.value !== undefined)) {
      Object.assign(this, value);
    } else {
      this.value = value;
    }
    if (this.label === undefined) {
      if (this.value instanceof Array) {
        this.label = String(`${this.value.constructor.name} (${this.value.length})`);
      } else if (typeof this.value === 'object') {
        this.label = String(`${this.value.constructor.name}`);
      } else if (this.value !== undefined) {
        this.label = String(this.value);
      } else {
        console.warn('Option must have label or value!');
      }
    }
  }
}

export function isValuePropertyOf(prop, object) {
  for (let key in object) if (object[key] === prop) return key;
  return null;
}

export class IoInspector extends IoElement {
  static get Style() {
    return html`<style>
    :host {
      display: flex;
      flex-direction: column;
      align-self: stretch;
      justify-self: stretch;
      border: var(--io-border);
      border-radius: var(--io-border-radius);
      padding: var(--io-spacing);
      background: var(--io-background-color);
    }
    :host > io-breadcrumbs {
      margin-bottom: var(--io-spacing);
    }
    :host io-item.io-property-editor {
      color: var(--io-color-link);
    }
    :host io-item.io-property-editor:hover {
      text-decoration: underline;
    }
    </style>`;
  }
  static get Properties() {
    return {
      value: Object,
      config: Object,
      _options: Array,
    };
  }
  static get Listeners() {
    return {
      'item-clicked': '_onSetInspectorValue',
    };
  }
  get groups() {
    return this.__proto__.__config.getConfig(this.value, this.config);
  }
  _onSetInspectorValue(event) {
    event.stopImmediatePropagation();
    const value = event.detail.value;
    if (value && typeof value === 'object') {
      this.set('value', value);
    }
  }
  valueChanged() {
    const option = this._options.find((option) => {
      return option.value === this.value;
    });
    if (!option) {
      const lastOption = this._options[this._options.length - 1];
      if (!lastOption || !isValuePropertyOf(this.value, lastOption.value)) this._options.length = 0;
      this._options.push(new Item(this.value));
      this.dispatchEvent('object-mutated', {object: this._options}, false, window);
    }
  }
  changed() {
    const elements = [
      ['io-breadcrumbs', {value: this.value, options: this._options, trim: true, 'on-value-set': this._onSetInspectorValue}],
    ];
    // TODO: rewise and document use of storage
    let uuid = this.value.constructor.name;
    uuid += this.value.guid || this.value.uuid || this.value.id || '';
    for (let group in this.groups) {
      // TODO: replace with io-object
      elements.push(
        ['io-collapsable', {
          label: group,
          expanded: $('io-inspector-group-' + uuid + '-' + group, true),
          elements: [
            ['io-properties', {
              value: this.value,
              properties: this.groups[group],
              config: Object.assign({
                'type:object': ['io-item'],
              }, this.config),
            }]
          ]
        }],
      );
    }
    this.template(elements);
  }
  static get Config() {
    return {
      'Object|hidden': [/^_/],
      'HTMLElement|hidden': [/^_/, 'innerText', 'outerText', 'innerHTML', 'outerHTML', 'textContent'],
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
    for (let g in config) {
      this[g] = this[g] || [];
      this[g] = [...this[g], ...config[g]];
    }
  }
  getConfig(object, customGroups) {
    const keys = Object.keys(object);
    const prototypes = [];

    let proto = object.__proto__;
    while (proto) {
      keys.push(...Object.keys(proto));
      prototypes.push(proto.constructor.name);
      proto = proto.__proto__;
    }

    const protoGroups = {};

    for (let i in this) {
      const grp = i.split('|');
      if (grp.length === 1) grp.splice(0, 0, 'Object');
      if (prototypes.indexOf(grp[0]) !== -1) {
        protoGroups[grp[1]] = protoGroups[grp[1]] || [];
        protoGroups[grp[1]].push(...this[i]);
      }
    }

    for (let i in customGroups) {
      const grp = i.split('|');
      if (grp.length === 1) grp.splice(0, 0, 'Object');
      if (prototypes.indexOf(grp[0]) !== -1) {
        protoGroups[grp[1]] = protoGroups[grp[1]] || [];
        protoGroups[grp[1]].push(customGroups[i]);
      }
    }

    const groups = {};
    const assigned = [];

    for (let g in protoGroups) {
      groups[g] = groups[g] || [];
      for (let gg in protoGroups[g]) {
        const gKey = protoGroups[g][gg];
        const reg = new RegExp(gKey);
        for (let i = 0; i < keys.length; i++) {
          const k = keys[i];
          if (typeof gKey === 'string') {
            if (k == gKey) {
              groups[g].push(k);
              assigned.push(k);
            }
          } else if (typeof gKey === 'object') {
            if (reg.exec(k)) {
              groups[g].push(k);
              assigned.push(k);
            }
          }
        }
      }
    }

    if (assigned.length === 0) {
      groups['properties'] = keys;
    } else {
      for (let i = 0; i < keys.length; i++) {
        groups['properties'] = groups['properties'] || [];
        if (assigned.indexOf(keys[i]) === -1) groups['properties'].push(keys[i]);
      }
    }

    for (let group in groups) { if (groups[group].length === 0) delete groups[group]; }
    delete groups.hidden;

    return groups;
  }
}

IoInspector.Register = function() {
  IoElement.Register.call(this);
  Object.defineProperty(this.prototype, '__config', {value: new Config(this.prototype.__protochain)});
};

IoInspector.Register();
// IoInspector.RegisterConfig = function(config) {
//   this.prototype.__config.registerConfig(config);
// };
