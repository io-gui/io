import {Io} from "../io.js";

import * as THREE from "../../lib/three.module.js";

let color = new THREE.Color(1,0.5,0.2);
let mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(), new THREE.MeshBasicMaterial({color: color}));
let light = new THREE.Light();
light.color = color;
let renderer = new THREE.WebGLRenderer();
let texture = new THREE.Texture();
mesh.add(light);

export class DemoAppCtrl extends Io {
  static get properties() {
    return {
      value: {},
      options: {
        value: [
          {value: light, label: 'Light'},
          {value: mesh, label: 'Mesh'},
          {value: color, label: 'Color'},
          {value: renderer, label: 'Renderer'},
          {value: texture, label: 'Texture'}
        ]
      }
    };
  }
  clearLocalStorage() {
    localStorage.clear();
  }
  update() {
    this.render([
      ['span', 'select: '],
      ['io-option', {value: this.bind('value'), options: this.bind('options')}],
      ['br'],
      ['io-button', {label: 'Reset layout', action: this.clearLocalStorage.bind(this)}]
    ]);
  }
}

DemoAppCtrl.Register();
