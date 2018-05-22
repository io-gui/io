import {IoElement}from "../../../io-element.js";
import "./three-inspector-breadcrumbs.js";
import "./three-inspector-link.js";
import {threeInspectorConfig} from "./three-inspector-config.js";

function isPropertyOf(prop, object) {
  for (let key in object) if (object[key] === prop) return key;
  return null;
}

export class ThreeInspector extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        white-space: nowrap;
        background: linear-gradient(90deg, #666, #484848);
        color: #ccc;
        overflow: auto;
        min-width: 250px;
      }
      :host > io-object {
        flex: 0 0 auto;
        overflow: hidden;
        margin: 2px;
        border-radius: 6px;
        background: linear-gradient(45deg, #333, #555);
      }
      :host > io-object > io-boolean {
        background: linear-gradient(90deg, #333, #444);
        border-radius: 6px 6px 0 0;
        padding: 4px;
      }
      :host > io-object > io-boolean:not([value]) {
        border-radius: 6px;
      }
      :host > io-object > div {
        border-top: 0.5px solid #252525;
        font-size: 0.85em;
        padding: 0.25em;
      }
      :host > io-object > div > span {
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        flex-basis: 9em;
        padding: 0.25em 0.25em;
      }
      :host > io-object > div > :nth-child(2) {
        flex: 1 1;
        padding: 0.25em 0.5em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      :host > io-object > div > three-inspector-link {
        border-radius: 6px;
        color: #6af;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 0 1 auto !important;
      }
      :host > io-object > div > io-option {
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.05);
        padding: 0.25em 0.25em 0.25em 0.5em !important;
        border: 0.5px outset #666;
        color: #ff4;
        flex: 0 1 auto !important;
      }
      :host > io-object > div > io-option:after {
        content: '▾';
        background: rgba(0, 0, 0, 0.125);
        padding: 0.05em 0.2em;
        border-radius: 4px;
        margin-left: 0.3em;
      }
      :host > io-object > div > io-string,
      :host > io-object > div > io-number,
      :host > io-object > div > three-vector,
      :host > io-object > div > three-color,
      :host > io-object > div > three-matrix {
        background: rgba(0, 0, 0, 0.15);
        border: 0.5px inset #888;
      }
      :host > io-object > div > three-vector,
      :host > io-object > div > three-color,
      :host > io-object > div > three-matrix {
        padding: 0 !important;
      }
      :host io-string,
      :host io-number {
        color: #6ef !important;
        padding-left: 0.25em !important;
      }
      :host io-boolean {
        color: #9f9;
      }
      :host io-boolean:not([value]) {
        color: #696;
      }
      :host > io-object > div > io-slider {
        background: rgba(255, 255, 255, 0.05);
        border: 0.5px inset #888;
        padding: 0 !important;
      }
    </style>`;
  }
  static get properties() {
    return {
      value: Object,
      crumbs: Array
    };
  }
  static get listeners() {
    return {
      'io-button-clicked': '_onLinkClicked',
      'mousedown': '_stopEvent',
      'touchstart': '_stopEvent',
      'keydown': '_stopEvent',
      'wheel': '_stopEvent'
    }
  }
  _stopEvent(event) {
    event.stopPropagation();
  }
  _onLinkClicked(event) {
    event.stopPropagation();
    if (isPropertyOf(event.detail.value, this.value) && event.path[0].localName === 'three-inspector-link') {
      this.value = event.detail.value;
    }
  }
  update() {
    window.value = this.value;
    let groups = {};
    let assigned = [];
    let proto = this.value;
    let keys = [];
    // TODO: optimize?
    while (proto) {
      keys = [...keys, ...Object.keys(proto)];
      let config = threeInspectorConfig.groups[proto.constructor.name] || {};
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

    let crumb = this.crumbs.find((crumb) => { return crumb.value === this.value; });
    let lastrumb = this.crumbs[this.crumbs.length - 1];
    if (crumb) {
      this.crumbs.length = this.crumbs.indexOf(crumb) + 1;
    } else {
      if (!lastrumb || !isPropertyOf(this.value, lastrumb.value)) {
        this.crumbs.length = 0;
      }
      this.crumbs.push({
        label: this.value.constructor.name,
        value: this.value
      });
    }

    threeInspectorConfig['Object'] = Object.assign(threeInspectorConfig['Object'], this.configs);

    let elements = [];
    for (var key in groups) {
      elements.push(['io-object', {
        value: this.value, props: groups[key], label: key, expanded: true, configs: threeInspectorConfig}
      ]);
    }

    this.render([
      ['three-inspector-breadcrumbs', {value: this.bind('value'), crumbs: this.bind('crumbs')}],
      elements
    ]);

  }
}

ThreeInspector.Register();
