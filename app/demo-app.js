import {Io, html} from "../build/io.js";

import "./demo-app-values.js";
import "./demo-app-ctrl.js";
import "./demo-io.js";
import "./demo-io-menu.js";
import "./demo-io-option.js";
import "./demo-io-object.js";

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
      layout: {
        value: [
        // value: JSON.parse(localStorage.getItem('io-layout-state')) || [
          ['ui-layout-split', {'orientation': 'horizontal', 'splits': [
            ['ui-tabs', {'tabs': ['app-ctrl'], 'selected': 'app-ctrl'}],
            ['ui-layout-split', {'orientation': 'vertical', 'width': 400, 'splits': [
              ['ui-tabs', {'tabs': ['inspector']}],
              ['ui-tabs', {'height': 400, 'tabs': ['demo', 'menu', 'option', 'object'], 'selected': 'option'}],
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
      ['ui-layout', {
        elements: {
          'demo': ['demo-io'],
          'menu': ['demo-io-menu'],
          'option': ['demo-io-option'],
          'object': ['demo-io-object'],
          'inspector': ['io-inspector', {value: window}],
          // 'object': ['io-object', {value: scene.bind('value'), expanded: true}],
          'app-ctrl': ['demo-app-ctrl', {value: this.layout, scene: this}]
        },
        layout: this.layout
      }]
    ]);
  }
}

customElements.define('demo-app', DemoApp);
