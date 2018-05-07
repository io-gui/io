import {Io, html} from "../io.js";

import "./demo-app-ctrl.js";
import "./demo-io.js";
import "./demo-menu.js";
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
        // value: JSON.parse(localStorage.getItem('layout-split-state')) || [
          ['layout-split', {'orientation': 'horizontal', 'splits': [
            ['layout-tabs', {'tabs': ['app-ctrl'], 'selected': 'app-ctrl'}],
            ['layout-split', {'orientation': 'vertical', 'width': 400, 'splits': [
              ['layout-tabs', {'tabs': ['inspector']}],
              ['layout-tabs', {'height': 400, 'tabs': ['demo', 'menu', 'option', 'object'], 'selected': 'demo'}],
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
    localStorage.setItem('layout-split-state', JSON.stringify(this.layout));
  }
  update() {
    this.render([
      ['layout-split', {
        elements: {
          'demo': ['demo-io'],
          'menu': ['demo-menu'],
          'option': ['demo-io-option'],
          'object': ['demo-io-object'],
          'inspector': ['io-inspector', {value: this.bind('selected')}],
          'object': ['io-object', {value: this.bind('selected'), expanded: true}],
          'app-ctrl': ['demo-app-ctrl', {value: this.bind('selected')}]
        },
        splits: this.layout
      }]
    ]);
  }
}

DemoApp.Register();
