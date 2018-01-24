import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoInspectorGroup} from "./io-inspector-group.js"

export class IoInspector extends Io {
  static get is() { return 'io-inspector'; }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          min-width: 10em;
          position: relative;
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
  connectedCallback() {
    this._update();
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

    // TODO: better itterate
    let groupElements = [];

    for (let group in groups) {
      groupElements.push(['io-inspector-group', {value: this.value, props: groups[group]}]);
    }

    this.render(groupElements);

  }
}

IoInspector.GROUPS = {
  'Object' : {
    'main': ['name', 'uuid'],
  },
  'Light' : {
    'main': ['userData', 'layers'],
    'rendering': ['color', 'intensity']
  },
  'Object3D' : {
    'main': ['parent', 'type'],
    'rendering': ['visible', 'frustrumCulled']
  }
};

window.customElements.define(IoInspector.is, IoInspector);
