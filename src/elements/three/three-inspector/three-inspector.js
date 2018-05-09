import {Io, html} from "../../../iocore.js";
import "../../app/app-breadcrumbs/app-breadcrumbs.js";
import "./three-inspector-group.js";

function isPropertyOf(prop, object) {
  for (let p in object) if (object[p] === prop) return true;
  return false;
}

export class ThreeInspector extends Io {
  static get style() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: column;
          background: #444;
          color: #ccc;
          padding: 0.1em;
          border-radius: 0.2em;
          line-height: 1em;
        }
        :host .io-wrapper {
          flex: 1;
          overflow-x: hidden;
          overflow-y: auto;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        type: Object
      },
      crumbs: {
        type: Array
      },
      listeners: {
        'three-inspector-item-clicked': "_linkClickedHandler"
      }
    };
  }
  _linkClickedHandler(event) {
    event.stopPropagation();
    if (event.detail.value instanceof Object) {
      this.value = event.detail.value;
    }
  }
  update() {
    let groups = {};
    let assigned = [];
    let proto = this.value.__proto__;
    let keys = Object.keys(this.value);
    while (proto) {
      let config = ThreeInspector.CONFIG[proto.constructor.name] || {};
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

    const GroupItem = entry => ['three-inspector-group', {
      value: this.value, props: entry[1], label: entry[0], expanded: true}];
    this.render([
      ['app-breadcrumbs', {value: this.bind('value'), crumbs: this.bind('crumbs')}],
      ['div', {class: 'io-wrapper'}, [
        Object.entries(groups).map(GroupItem)
      ]]
    ]);

  }
}

ThreeInspector.CONFIG = {
  'Object': {
    'advanced': ['uuid'],
    'hidden': ['type']
  },
  'Object3D' : {
    'main': ['name', 'geometry', 'material', 'parent', 'children'],
    'transform': ['position', 'rotation', 'scale'],
    'rendering': ['drawMode', 'layers', 'visible', 'castShadow', 'receiveShadow', 'frustumCulled', 'renderOrder'],
    'advanced': ['userData', 'up', 'quaternion', 'matrix', 'matrixWorld', 'matrixAutoUpdate', 'matrixWorldNeedsUpdate']
  },
  'Material' : {
    'main': ['opacity', 'side', 'transparent', 'depthTest', 'depthWrite', 'depthFunc', 'wireframe'],
    'rendering': ['dithering', 'flatShading'],
    'advanced': ['skinning']
  },
  'Light' : {
    'main': ['intensity', 'color']
  }
};

ThreeInspector.Register();
