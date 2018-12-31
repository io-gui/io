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
      background-color: #eee;
    }
    :host > io-inspector-breadcrumbs {
      margin-bottom: 2px;
    }
    :host > io-object {
      padding: 0 !important;
      font-size: 0.9em;
      background-color: #ccc !important;
    }
    :host > io-object > io-boolean {
      display: block;
    }
    :host > io-object > io-object-props {
      padding: 0 !important;
      margin: 2px;
    }
    :host > io-object > io-object-props > div {
      padding: 2px 0;
    }
    :host > io-object > io-object-props > div:not(:last-of-type) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.5);
    }
    :host > io-object > io-object-props > div > :nth-child(1) {
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: right;
      flex: 0 1 6em;
      padding-left: 0.5em;
      min-width: 3em;
    }
    :host > io-object > io-object-props > div > :nth-child(2) {
      flex: 1 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 3em;
    }
    :host > io-object > io-object-props > div > io-inspector-link {
      flex: 0 0 auto !important;
      min-width: 0 !important;
      text-decoration: underline;
      color: #2233cc;
    }
    </style>`;
  }
  static get properties() {
    return {
      // persist: false,
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
  // valueChanged() {
  //   super.valueChanged();
  //   if (this.persist) {
  //     const groupKey = this.label + '-' + (this.value.uuid || this.value.guid || this.value.constructor.name);
  //     const expanded = localStorage.getItem('io-inspector-group-expanded-' + groupKey);
  //     this.expanded = expanded === null ? this.label === 'properties' ? true : false : expanded === 'true' ? true : false;
  //   } else {
  //     this.expanded = this.label === 'properties';
  //   }
  // }
  // expandedChanged() {
  //   if (this.persist) {
  //     const groupKey = this.label + '-' + (this.value.uuid || this.value.guid || this.value.constructor.name);
  //     localStorage.setItem('io-inspector-group-expanded-' + groupKey, this.expanded);
  //   }
  // }
  valueChanged() {
    super.valueChanged();
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
    const elements = [
      ['io-inspector-breadcrumbs', {crumbs: this.crumbs}]
    ];
    // TODO: rewise and document use of storage
    const id = this.value.guid || this.value.uuid || this.value.id;
    const cname = this.value.constructor.name;
    for (let group in this._groups) {
      let expanded = id ? $('io-inspector-group-' + cname + '-' + id + '-' + group, false) : true;
      elements.push(
        ['io-object', {
          value: this.value,
          label: group,
          expanded: expanded,
          props: this._groups[group],
          config: this._config,
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

      for (let g in protoGroups) {
        groups[g] = groups[g] || [];
        if (protoGroups[g].indexOf(typeStr) !== -1) { groups[g].push(k); assigned.push(k); }
        if (protoGroups[g].indexOf(cstrStr) !== -1) { groups[g].push(k); assigned.push(k); }
        if (protoGroups[g].indexOf(keyStr) !== -1) { groups[g].push(k); assigned.push(k); }
        if (protoGroups[g].indexOf(valueStr) !== -1) { groups[g].push(k); assigned.push(k); }
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
