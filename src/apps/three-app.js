import {Io} from "../io/io.js"
import {html} from "../io/ioutil.js"
import "../ui/ui-layout/ui-layout.js"
import "../io/io-object/io-object.js"
import "../io/io-inspector/io-inspector.js"

import {ThreeAppScene} from "./three-app-scene.js"
import {ThreeAppCtrl} from "./three-app-ctrl.js"
import {IoApp} from "./io-app.js"

let scene = new ThreeAppScene();
window.scene = scene;

var layout = JSON.parse(localStorage.getItem('io-layout-state'));

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
        value: layout || {'horizontal': [
          {'width': 300, 'vertical': [
            {'height': 10, 'tabs': ['app-ctrl']},
            {'horizontal': [
              {'width': 10, 'tabs': ['app-ctrl']},
              {'tabs': ['inspector']},
              {'width': 20, 'tabs': ['app-ctrl']}
            ]},
            {'tabs': ['object']},
          ]},
          {'tabs': ['app-ctrl', 'inspector']},
          {'width': 400, 'tabs': ['io-app']}
        ]}
      },
      listeners: {
        'layout-changed': '_layoutChangedHandler'
      }
    }
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
        value: this.layout
      }],
      ['div', {class: 'footer'}]
    ]);
  }
}

customElements.define('three-app', ThreeApp);
