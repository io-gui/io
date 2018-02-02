import {Io} from "../io/io.js"
import {html} from "../io/ioutil.js"
import {IoObject} from "../io/io-object/io-object.js"
import {IoInspector} from "../io/io-inspector/io-inspector.js"

import "./three-config.js"
import * as THREE from "../../lib/three.module.js"

let mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(), new THREE.MeshBasicMaterial({color: 0xffffff}));
let color = new THREE.Color(1,0.5,0.2);
let light = new THREE.Light({color: color});
let renderer = new THREE.WebGLRenderer();
let texture = new THREE.Texture();
mesh.add(light);

export class ThreeApp extends Io {
  static get style() {
    return html`
      <style>
      :host .row {
        display: flex;
        flex-direction: row;
      }
      :host .row > * {
        margin-right: 1em;
      }
      :host io-inspector {
        width: 400px;
      }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        value: mesh,
        observer: '_update'
      }
    }
  }
  _valueChangedHandler(event) {
    this.value = event.detail.value;
  }
  _update() {
    this.render([
      ['div', {className: 'demo'}, [
        ['div', [
          ['span', 'io-inspector: '],
          ['io-option', {value: this.bind('value'), options: [
            {value: light, label: 'Light'},
            {value: mesh, label: 'Mesh'},
            {value: color, label: 'Color'},
            {value: renderer, label: 'Renderer'},
            {value: texture, label: 'Texture'}
          ]}]
        ]],
        ['div', {className: 'row'}, [
          ['io-inspector', {value: this.value}],
          ['io-object', {value: this.value, expanded: true}]
        ]]
      ]]
    ]);
  }
}

customElements.define('three-app', ThreeApp);
