import {html, IoElement} from "../core/element.js";
import {IoButton} from "./button.js";
import "./breadcrumbs.js";
import {isValuePropertyOf, getObjectLabel} from "../utils/utility-functions.js";
import {IoStorage} from "../utils/storage.js";

export class IoInspector extends IoElement {
  static get style() {
    return html`<style>
    :host {
      display: flex;
      flex-direction: column;
      border: var(--io-border);
      border-radius: var(--io-border-radius);
      padding: var(--io-spacing);
      background: var(--io-background-color);
    }
    :host > io-breadcrumbs {
      margin-bottom: var(--io-spacing);
    }
    :host > io-collapsable > .io-content {
      padding: 0;
    }
    :host io-properties > .io-property {
      overflow: hidden;
      background-color: var(--io-background-color);
    }
    :host io-properties > .io-property:nth-child(2n) {
      background-color: var(--io-background-color-light);
    }
    :host io-properties > .io-property > * {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    :host io-properties > .io-property > :nth-child(1) {
      text-align: right;
      flex: 0 1 8em;
      min-width: 3em;
    }
    :host io-properties > .io-property > :nth-child(2) {
      flex: 1 1 8em;
      min-width: 3em;
    }
    :host io-number,
    :host io-string {
      border-color: var(--io-inset-border-color) !important;
      color: var(--io-field-color) !important;
      background: var(--io-field-background-color) !important;
      padding: 0 var(--io-spacing) !important;
    }
    :host io-properties > .io-property > io-properties {
      border: var(--io-inset-border);
      border-radius: var(--io-border-radius);
    }
    </style>`;
  }
  static get properties() {
    return {
      value: Object,
      properties: Array,
      config: Object,
      _options: Array,
    };
  }
  static get listeners() {
    return {
      'set-inspector-value': '_onSetInspectorValue',
    };
  }
  get groups() {
    return this.__proto__.__config.getConfig(this.value, this.config);
  }
  _onSetInspectorValue(event) {
    event.stopPropagation();
    this.set('value', event.detail.value);
  }
  _onBreadcrumbsValue(event) {
    this.set('value', event.detail.value);
  }
  valueChanged() {
    const option = this._options.find((option) => {
      return option.value === this.value;
    });
    if (!option) {
      const lastOption = this._options[this._options.length - 1];
      if (!lastOption || !isValuePropertyOf(this.value, lastOption.value)) this._options.length = 0;
      this._options.push({value: this.value, label: getObjectLabel(this.value)});
      this.dispatchEvent('object-mutated', {object: this._options}, false, window);
    }
  }
  changed() {
    const elements = [
      ['io-breadcrumbs', {value: this.value, options: this._options, trim: true, 'on-value-set': this._onBreadcrumbsValue}],
    ];
    // TODO: rewise and document use of storage
    let uuid = this.value.constructor.name;
    uuid += this.value.guid || this.value.uuid || this.value.id || '';
    for (let group in this.groups) {
      elements.push(
        ['io-collapsable', {
          label: group,
          expanded: IoStorage('io-inspector-group-' + uuid + '-' + group, true),
          elements: [
            ['io-properties', {
              value: this.value,
              properties: this.groups[group],
              config: Object.assign({
                'type:object': ['io-inspector-link'],
              }, this.config),
            }]
          ]
        }],
      );
    }
    this.template(elements);
  }
  static get config() {
    return {
      'Object|hidden': [/^_/],
      'HTMLElement|hidden': [/^_/, 'innerText', 'outerText', 'innerHTML', 'outerHTML', 'textContent'],
    };
  }
}

export class Config {
  constructor(prototypes) {
    for (let i = 0; i < prototypes.length; i++) {
      this.registerConfig(prototypes[i].constructor.config || {});
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

export class IoInspectorLink extends IoButton {
  static get style() {
    return html`<style>
    :host {
      color: var(--io-link-color) !important;
    }
    :host:hover {
      text-decoration: underline;
    }
    </style>`;
  }
  static get listeners() {
    return {
      'button-action': '_onButtonAction',
    };
  }
  _onButtonAction() {
    this.dispatchEvent('set-inspector-value', {value: this.value}, true);
  }
  changed() {
    this.title = getObjectLabel(this.value);
    this.innerText = getObjectLabel(this.value);
  }
}

IoInspectorLink.Register();
