import {Io} from "../io/io.js"
import {html} from "../io/ioutil.js"
import {IoObject} from "../io/io-object/io-object.js"
import {IoInspector} from "../io/io-inspector/io-inspector.js"

import "./three-config.js"

import * as THREE from "../../lib/three.module.js"

export class ThreeApp extends Io {
  static get style() {
    return html`
      <style>
      :host {
        font-family: "Lucida Grande", sans-serif;
      }
      :host .row {
        display: flex;
        flex-direction: row;
      }
      :host .row > * {
        margin-right: 1em;
      }
      :host io-inspector {
        width: 300px;
      }
      </style>
    `;
  }
  constructor() {
    super();
    let mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(), new THREE.MeshDepthMaterial());
    let light = new THREE.Light();
    mesh.add(light);
    light.color = new THREE.Color(1,0.5,0.2);
    this.render([
      ['div', {className: 'demo'}, [
        ['h3', 'io-inspector'],
        ['div', {className: 'row'}, [
          ['io-inspector', {value: mesh}],
          ['io-object', {value: light, expanded: true}]
        ]]
      ]],
      ['div', {className: 'demo'}, [
        ['h3', 'io-object'],
        ['io-object', {value: mesh }],
        ['io-object', {value: new THREE.WebGLRenderer()}],
        ['io-object', {value: new THREE.Texture()}]
      ]]
    ]);
  }
}

customElements.define('three-app', ThreeApp);
