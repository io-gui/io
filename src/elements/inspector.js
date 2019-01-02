import {html} from "../core/element.js";
import {storage as $} from "../core/storage.js";
import {IoObject} from "./object.js";

import "./inspector-breadcrumbs.js";
import "./inspector-link.js";

function isValueOfPropertyOf(prop, object) {
  for (let key in object) if (object[key] === prop) return key;
  return null;
}

export class IoInspector extends IoObject {
  static get style() {
    return html`<style>
    :host {
      padding: 2px;
      background-color: #666;
      border-color: #444;
    }
    :host > io-inspector-breadcrumbs {
      margin-bottom: 2px;
    }
    :host > io-object {
      padding: 1px !important;
      font-size: 0.9em;
      background-color: #ccc !important;
    }
    :host > io-object > io-boolean {
      display: block;
      padding-bottom: 0.15em;
    }
    :host > io-object > io-object-props {
      padding: 0 !important;
    }
    :host > io-object > io-object-props > div {
      overflow: hidden;
      padding: 2px;
    }
    :host > io-object > io-object-props > div:not(:last-of-type) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }
    :host > io-object > io-object-props > div > :nth-child(1) {
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: right;
      flex: 0 1 8em;
      padding-left: 0.5em;
      min-width: 3em;
    }
    :host > io-object > io-object-props > div > :nth-child(2) {
      flex: 1 0 8em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 2em;
    }
    :host > io-object > io-object-props > div > io-option {
      flex: 0 1 auto !important;
    }
    </style>`;
  }
  static get properties() {
    return {
      crumbs: Array,
      groups: Object,
      _groups: Object,
    };
  }
  static get listeners() {
    return {
      'io-button-clicked': '_onLinkClicked',
    };
  }
  _onLinkClicked(event) {
    event.stopPropagation();
    if (event.path[0].localName === 'io-inspector-link') {
      this.value = event.detail.value;
    }
  }
  valueChanged() {
    // super.valueChanged();
    this._groups = this.__proto__.__groups.getGroups(this.value, this.groups);
    let crumb = this.crumbs.find((crumb) => { return crumb === this.value; });
    let lastrumb = this.crumbs[this.crumbs.length - 1];
    if (crumb) {
      this.crumbs.length = this.crumbs.indexOf(crumb) + 1;
    } else {
      if (!lastrumb || !isValueOfPropertyOf(this.value, lastrumb)) this.crumbs.length = 0;
      this.crumbs.push(this.value);
    }
    this.crumbs = [...this.crumbs];
  }
  groupsChanged() {
    this._groups = this.__proto__.__groups.getGroups(this.value, this.groups);
  }
  changed() {
    const elements = [['io-inspector-breadcrumbs', {crumbs: this.crumbs}]];
    // TODO: rewise and document use of storage
    // const id = this.value.guid || this.value.uuid || this.value.id;
    for (let group in this._groups) {
      let expanded = $('io-inspector-group-' + this.value.constructor.name + '-' + group, false);
      elements.push(
        ['io-object', {
          value: this.value,
          label: group,
          expanded: expanded,
          props: this._groups[group],
          config: this.constructor.config,
          // config: [this.config, this.constructor.config],
        }],
      );
    }
    this.template(elements);
  }
  static get config() {
    return {
      'Object': {
        'type:object': ['io-inspector-link'],
        'type:boolean': ['io-boolean', {true: '⦿ true', false: '⦾ false'}],
      },
    };
  }
  static get groups() {
    return {
      'Object': {
        'hidden': ['constructor'],
      },
    };
  }
}

export class Groups {
  constructor(prototypes) {
    for (let i = 0; i < prototypes.length; i++) {
      const groups = prototypes[i].constructor.groups || {};
      for (let cstr in groups) {
        this[cstr] = this[cstr] || {};
        this.extend(this[cstr], groups[cstr]);
      }
    }
  }
  extend(groups, groupsEx) {
    for (let g in groupsEx) {
      groups[g] = groups[g] || [];
      for (let i = 0; i < groupsEx[g].length; i++) {
        if (groups[g].indexOf(groupsEx[g][i]) === -1) {
          groups[g].push(groupsEx[g][i]);
        }
      }
    }
  }
  getGroups(object, instanceGroups = {}) {
    const keys = Object.keys(object);
    const prototypes = [];

    let proto = object.__proto__;
    while (proto) {
      keys.push(...Object.keys(proto));
      prototypes.push(proto.constructor.name);
      proto = proto.__proto__;
    }

    const protoGroups = {};
    for (let i = prototypes.length; i--;) {
      this.extend(protoGroups, this[prototypes[i]]);
    }
    this.extend(protoGroups, instanceGroups);

    const groups = {};
    const assigned = [];

    for (let g in protoGroups) {

      groups[g] = groups[g] || [];

      for (let gg in protoGroups[g]) {

        const reg = new RegExp(protoGroups[g][gg]);

        for (let i = 0; i < keys.length; i++) {

          if (typeof value == 'function') continue;
          const k = keys[i];
          if (reg.exec(k)) { groups[g].push(k); assigned.push(k); }

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
  IoObject.Register.call(this);
  Object.defineProperty(this.prototype, '__groups', {value: new Groups(this.prototype.__prototypes)});
};

IoInspector.Register();
