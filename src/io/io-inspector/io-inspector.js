import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoInspectorBreadcrumbs} from "./io-inspector-breadcrumbs.js"
import {IoInspectorGroup} from "./io-inspector-group.js"
import {IoCollapsable} from "../io-collapsable/io-collapsable.js"

export class IoInspector extends Io {
  static get shadowStyle() {
    return html`
      <style>
        :host {
          display: block;
          background: #444;
          color: #ccc;
          padding: 0.1em;
          border-radius: 0.2em;
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
      listeners: {
        'io-link-clicked': "_linkClickedHandler"
      }
    }
  }
  _linkClickedHandler(event) {
    event.stopPropagation();
    if (this.value[event.detail.key] instanceof Object) {
      this.value = this.value[event.detail.key];
    }
  }
  _update() {
    let groups = {};
    let assigned = [];
    let proto = this.value.__proto__;
    let keys = Object.keys(this.value);
    while (proto) {
      let config = IoInspector.CONFIG[proto.constructor.name] || {};
      for (let group in config) {
        groups[group] = groups[group] || [];
        for (let i = 0; i < config[group].length; i++) {
          let key = config[group][i];
          if (this.value.hasOwnProperty(key) && groups[group].indexOf(key) === -1) {
            groups[group].push(key);
            assigned.push(key);
          }
        }
      }
      proto = proto.__proto__;
    }

    for (let group in groups) {
      if (groups[group].length === 0) delete groups[group];
    }
    delete groups.hidden;

    if (assigned.length === 0) {
      groups.main = keys;
    } else {
      for (let i = 0; i < keys.length; i++) {
        groups['advanced'] = groups['advanced'] || [];
        if (assigned.indexOf(keys[i]) === -1) {
          groups['advanced'].push(keys[i]);
        }
      }
    }
    const GroupItem = entry => ['io-inspector-group', {value: this.value, props: entry[1], label: entry[0]}];
    this.render([
      ['io-inspector-breadcrumbs', {value: this.value}],
      Object.entries(groups).map(GroupItem)
    ]);

  }
}

IoInspector.CONFIG = {};

window.customElements.define('io-inspector', IoInspector);
