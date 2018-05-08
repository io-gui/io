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
        // value: JSON.parse(localStorage.getItem('app-split-state')) || [
          ['app-split', {'orientation': 'horizontal', 'splits': [
            ['app-tabs', {'tabs': ['app-ctrl'], 'selected': 'app-ctrl'}],
            ['app-split', {'orientation': 'vertical', 'width': 400, 'splits': [
              ['app-tabs', {'tabs': ['inspector']}],
              ['app-tabs', {'height': 400, 'tabs': ['demo', 'menu', 'option', 'object'], 'selected': 'object'}],
            ]}],
          ]}],
        ]
      },
      listeners: {
        'app-changed': '_layoutChangedHandler'
      }
    };
  }
  _layoutChangedHandler() {
    localStorage.setItem('app-split-state', JSON.stringify(this.layout));
  }
  update() {
    this.render([
      ['app-split', {
        elements: {
          'demo': ['demo-io'],
          'menu': ['demo-menu'],
          'option': ['demo-io-option'],
          'object': ['demo-io-object'],
          'inspector': ['three-inspector', {value: this.bind('selected')}],
          'object': ['io-object', {value: this.bind('selected'), expanded: true}],
          'app-ctrl': ['demo-app-ctrl', {value: this.bind('selected')}]
        },
        splits: this.layout
      }]
    ]);
  }
}

DemoApp.Register();
