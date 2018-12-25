import {html} from "../core/element.js";
import {IoObject} from "./object.js";


import "./inspector-breadcrumbs.js";
import "./inspector-link.js";

function isValueOfPropertyOf(prop, object) {
  for (let key in object) if (object[key] === prop) return key;
  return null;
}

const __groupsMap = new WeakMap();

export class IoInspector extends IoObject {
  static get style() {
    return html`<style>
    :host {
    }
    :host > io-object-group > io-boolean {
      padding: 0.2em;
      font-size: 1.1em;
      border: 1px outset rgba(255, 255, 255, 1);
      background: rgba(0, 0, 0, 0.33);
    }
    :host > io-object-group > div {
      padding: 0.2em 0;
      border: 1px outset rgba(255, 255, 255, 0.5);
      background: rgba(128, 128, 128, 0.4);
      overflow: hidden;
    }
    :host > io-object-group > div > :nth-child(1) {
      text-align: right;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 0 1 9em;
      padding-left: 0.5em;
      min-width: 3em;
    }
    :host > io-object-group > div > :nth-child(2) {
      flex: 1 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 3em;
    }
    :host > io-object-group > div > io-inspector-link {
      flex: 0 0 auto !important;
      min-width: 0 !important;
      text-decoration: underline;
      color: #2233cc;
    }
    :host > io-object-group > div *:focus {
      outline: none;
      border-color: #acf;
    }
    :host > io-object-group > div io-boolean {
    }
    :host > io-object-group > div io-boolean:not([value]) {
      opacity: 0.5;
    }
    :host > io-object-group > div io-string {
      color: #cfa;
    }
    :host > io-object-group > div io-number {
      color: #ccf;
    }
    :host > io-object-group > div io-string,
    :host > io-object-group > div io-number,
    :host > io-object-group > div io-color-hex {
      font-size: 0.9em;
      background: rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 0, 0, 0.5);
      padding: 0 0.2em;
      margin: 0 0.1em;
    }
    :host > io-object-group > div io-boolean {
      flex: 0 1 auto !important;
    }
    :host > io-object-group > div io-menu-option::after {
      content: '▼';
      margin-left: 0.15em;
      opacity: 0.25;
    }
    :host > io-object-group > div io-menu-option {
      padding: 0 0.5em;
      font-size: 0.5em;
      border: 1px outset rgba(150, 150, 150, 0.5);
      border-radius: 0.5em;
      background: rgba(255, 255, 255, 0.4) !important;
      flex: 0 1 auto !important;
    }
    </style>`;
  }
  static get properties() {
    return {
      persist: false,
      crumbs: Array,
      groups: Object,
      _groups: Object,
    };
  }
  static get listeners() {
    return {
      'io-inspector-link-clicked': '_onLinkClicked',
    };
  }
  _onLinkClicked(event) {
    event.stopPropagation();
    this.value = event.detail.value;
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

    if (__groupsMap.has(this.value)) {
      this._groups = __groupsMap.get(this.value);
    } else {
      this._groups = this.__proto__.__groups.getGroups(this.value, this.groups);
      __groupsMap.set(this.value, this._groups);
    }

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
    for (let group in this._groups) {
      elements.push(
        ['io-object-group', {
          value: this.value,
          label: group,
          expanded: true,
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
