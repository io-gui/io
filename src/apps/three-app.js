import {Io} from "../io/io.js"
import {html} from "../io/ioutil.js"
import "../ui/ui-layout/ui-layout.js"
import "../io/io-object/io-object.js"
import "../io/io-inspector/io-inspector.js"

import {ThreeAppScene} from "./three-app-scene.js"

let scene = new ThreeAppScene();
window.scene = scene;

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
    }
  }
  _update() {
    this.render([
      ['div', {class: 'header'}],
      ['ui-layout', {elements: {
        inspector: ['io-inspector', {value: scene.bind('value')}],
        object: ['io-object', {value: scene.bind('value'), expanded: true}],
        option: ['io-option', {value: scene.bind('value'), options: scene.options}]
      }}],
      ['div', {class: 'footer'}]
    ]);
  }
}

customElements.define('three-app', ThreeApp);
