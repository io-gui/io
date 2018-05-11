import {Io, html} from "../io.js";

import "./demo-app-ctrl.js";
import "../elements/io/demo.js";
import "../elements/menu/demo.js";

export class DemoApp extends Io {
  static get style() {
    return html`
      <style>
        :host {
          position: fixed;
          display: flex;
          width: 100%;
          height: 100%;
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
      layout: null,
      elements: Object,
      listeners: {
        'app-split-changed': '_layoutChangedHandler',
        'app-block-changed': '_layoutChangedHandler'
      }
    };
  }
  constructor() {
    super();
    this.elements = {
      'io-demo': ['io-demo'],
      'menu-demo': ['menu-demo'],
      'inspector': ['three-inspector', {value: this.bind('selected')}],
      'app-ctrl': ['demo-app-ctrl', {value: this.bind('selected')}]
    };
    this.layout = JSON.parse(localStorage.getItem('app-split-state')) || [
      ['app-split', {'orientation': 'horizontal', 'splits': [
        ['app-block', {'tabs': ['app-ctrl']}],
        ['app-split', {'orientation': 'vertical', 'splits': [
          ['app-block', {'tabs': ['inspector']}],
          ['app-block', {'tabs': ['io-demo', 'menu-demo'], 'selected': 1}, 200],
        ]}, 400],
      ]}],
    ];
    this.render([
      ['app-split', {
        elements: this.elements,
        splits: this.layout
      }]
    ]);
  }
  _layoutChangedHandler() {
    this.debounce(this.saveLayoutHandler, 1000);
  }
  saveLayoutHandler() {
    localStorage.setItem('app-split-state', JSON.stringify(this.layout));
  }
}

DemoApp.Register();
