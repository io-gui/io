import {Io} from "../io/io.js"
import {html} from "../io/ioutil.js"
import "../layout/layout-block/layout-block.js"
import "../layout/layout-divider/layout-divider.js"
import "../io/io-object/io-object.js"
import "../io/io-inspector/io-inspector.js"

import {ThreeAppScene} from "./three-app-scene.js"

let scene = new ThreeAppScene();

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
        :host > .main {
          flex: 1;
          display: flex;
          flex-direction: row;
        }
        :host > .footer {
          height: 1em;
        }
        :host > .main > .left {
          background: #999;
        }
        :host > .main > .center {
          flex: 1;
          background: #ccc;
          display: block;
        }
        :host > .main > .right {
          background: green;
          flex-direction: column;
        }
        :host io-inspector {
          display: block;
          flex: 1;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      leftWidth: {
        value: 300,
        type: Number
      },
      rightWidth: {
        value: 500,
        type: Number
      }
    }
  }
  _update() {
    this.render([
      ['div', {class: 'header'}],
      ['div', {class: 'main'}, [
        ['layout-block', {class: 'left', width: this.bind('leftWidth')}, [
          ['io-object', {value: scene.bind('value'), expanded: true}]
        ]],
        ['layout-divider'],
        ['layout-block', {class: 'center'}, [
          ['io-option', {value: scene.bind('value'), options: scene.options}]
        ]],
        ['layout-divider'],
        ['layout-block', {class: 'right', width: this.bind('rightWidth')}, [
          ['io-inspector', {value: scene.bind('value')}],
        ]],
      ]],
      ['div', {class: 'footer'}]
    ]);
  }
}

customElements.define('three-app', ThreeApp);
