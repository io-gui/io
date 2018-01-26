 import {Io} from "./io/io.js"
import {html} from "./io/ioutil.js"
import {IoObject} from "./io/io-object/io-object.js"
import {IoInspector} from "./io/io-inspector/io-inspector.js"

import "./three-config.js"

import * as THREE from "../lib/three.module.js"

export class ThreeApp extends Io {
  static get template() {
    return html`
      <style>
      :host {
        font-family: "Lucida Grande", sans-serif;
      }
      </style>
    `;
  }
  constructor() {
    super();
    let light = new THREE.Light();
    light.color = new THREE.Color(1,0.5,0.2);
    this.render([
      ['div', {className: 'demo'}, [
        ['h3', 'io-inspector'],
        ['io-inspector', {value: light}]
      ]],
      ['div', {className: 'demo'}, [
        ['h3', 'io-object'],
        ['io-object', {value: new THREE.Light()}],
        ['io-object', {value: new THREE.Mesh(new THREE.SphereBufferGeometry(), new THREE.MeshDepthMaterial()) }],
        ['io-object', {value: new THREE.WebGLRenderer()}],
        ['io-object', {value: new THREE.Texture()}]
      ]]
    ]);
  }
}

customElements.define('three-app', ThreeApp);
