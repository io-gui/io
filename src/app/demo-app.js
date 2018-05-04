import {Io, html} from "../io.js";

import "./demo-app-ctrl.js";
import "./demo-io.js";
import "./demo-io-menu.js";
import "./demo-io-option.js";
import "./demo-io-object.js";
import "./three-io-config.js";

export class DemoApp extends Io {
  static get style() {
    return html`
      <style>
        :host {
          position: fixed;
          display: flex;
          width: 100%;
          height: 100%;
          background: #222;
          flex-direction: column;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      selected: {
        value: document.location
      },
      layout: {
        value: [
        // value: JSON.parse(localStorage.getItem('io-layout-state')) || [
          ['io-layout-split', {'orientation': 'horizontal', 'splits': [
            ['io-tabs', {'tabs': ['app-ctrl'], 'selected': 'app-ctrl'}],
            ['io-layout-split', {'orientation': 'vertical', 'width': 400, 'splits': [
              ['io-tabs', {'tabs': ['inspector']}],
              ['io-tabs', {'height': 400, 'tabs': ['demo', 'menu', 'option', 'object'], 'selected': 'demo'}],
            ]}],
          ]}],
        ]
      },
      listeners: {
        'layout-changed': '_layoutChangedHandler'
      }
    };
  }
  _layoutChangedHandler() {
    localStorage.setItem('io-layout-state', JSON.stringify(this.layout));
  }
  update() {
    this.render([
      ['io-layout', {
        elements: {
          'demo': ['demo-io'],
          'menu': ['demo-io-menu'],
          'option': ['demo-io-option'],
          'object': ['demo-io-object'],
          'inspector': ['io-inspector', {value: this.bind('selected')}],
          'object': ['io-object', {value: this.bind('selected'), expanded: true}],
          'app-ctrl': ['demo-app-ctrl', {value: this.bind('selected')}]
        },
        layout: this.layout
      }]
    ]);
  }
}

customElements.define('demo-app', DemoApp);
