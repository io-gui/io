import {Io, html} from "../io/io.js";
import "../ui/ui-layout/ui-layout.js";
import "../io/io-object/io-object.js";
import "../io/io-inspector/io-inspector.js";

import {ThreeAppScene} from "./three-app-scene.js";
import {ThreeAppCtrl} from "./three-app-ctrl.js";
import {IoApp} from "./io-app.js";
import "./three-io-config.js";

let scene = new ThreeAppScene();
window.scene = scene;

let layout = JSON.parse(localStorage.getItem('io-layout-state'));

export class ThreeApp extends Io {
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
        :host > .header {
          height: 1em;
        }
        :host > .footer {
          height: 1em;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      layout: {
        value: layout || [
          ['ui-layout-split', {'orientation': 'horizontal', 'splits': [
            ['ui-layout-split', {'orientation': 'vertical', 'width': 300, 'splits': [
              ['ui-tabs', {'height': 30, 'tabs': ['app-ctrl']}],
              ['ui-layout-split', {'orientation': 'horizontal', 'splits': [
                ['ui-tabs', {'width': 30, 'tabs': ['app-ctrl']}],
                ['ui-tabs', {'tabs': ['inspector']}],
                ['ui-tabs', {'width': 50, 'tabs': ['app-ctrl']}]]}],
              ['ui-tabs', {'height': 30, 'tabs': ['object']}]]}],
            ['ui-tabs', {'tabs': ['app-ctrl', 'inspector'], 'selected': 'app-ctrl'}],
            ['ui-tabs', {'width': 400, 'tabs': ['io-app']}]]}]
        ]
      },
      listeners: {
        'layout-changed': '_layoutChangedHandler'
      }
    };
  }
  _layoutChangedHandler(event) {
    localStorage.setItem('io-layout-state', JSON.stringify(this.layout));
  }
  update() {
    this.render([
      ['div', {class: 'header'}],
      ['ui-layout', {
        elements: {
          'io-app': ['io-app'],
          'inspector': ['io-inspector', {value: scene.bind('value')}],
          'object': ['io-object', {value: scene.bind('value'), expanded: true}],
          'app-ctrl': ['three-app-ctrl', {value: scene.bind('value'), scene: scene}]
        },
        layout: this.layout
      }],
      ['div', {class: 'footer'}]
    ]);
  }
}

customElements.define('three-app', ThreeApp);
