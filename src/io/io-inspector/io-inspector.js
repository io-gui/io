import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoInspectorGroup} from "./io-inspector-group.js"
import {IoCollapsable} from "../io-collapsable/io-collapsable.js"

export class IoInspector extends Io {
  static get rootStyle() {
    return html`
      <style>
        :host {
          display: block;
          background: #282828;
          color: #ccc;
          border-radius: 0.2em;
          padding: 2px;
        }
        h4 {
          margin: 0.2em;
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
      }
    }
  }
  _update() {
    let groups = {};
    let proto = this.value.__proto__;
    while (proto) {
      let config = IoInspector.GROUPS[proto.constructor.name] || {};
      for (let group in config) {
        groups[group] = groups[group] || [];
        for (let i = 0; i < config[group].length; i++) {
          if (groups[group].indexOf(config[group][i]) === -1) {
            groups[group].push(config[group][i]);
          }
        }
      }
      proto = proto.__proto__;
    }
    const GroupItem = entry => ['io-inspector-group', {value: this.value, props: entry[1], label: entry[0]}];
    this.render([
      ['h4', this.value.__proto__.constructor.name],
      ['slot']
    ], this.shadowRoot);
    this.render([
      Object.entries(groups).map(GroupItem)
    ]);

  }
}

IoInspector.GROUPS = {
  'Object3D' : {
    'main': ['name', 'parent', 'children'],
    'transform': ['position', 'rotation', 'scale'],
    'rendering': ['layers', 'visible', 'castShadow', 'receiveShadow', 'frustumCulled', 'renderOrder'],
    'advanced': ['uuid', 'userData', 'up', 'quaternion', 'matrix', 'matrixWorld', 'matrixAutoUpdate', 'matrixWorldNeedsUpdate'],
    'hidden': ['type']
  },
  'Light' : {
    'main': ['intensity', 'color']
  }
};

window.customElements.define('io-inspector', IoInspector);
