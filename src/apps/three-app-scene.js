import {Io} from "../io/io.js";
import * as THREE from "../../lib/three.module.js";

let color = new THREE.Color(1,0.5,0.2);
let mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(), new THREE.MeshBasicMaterial({color: color}));
let light = new THREE.Light();
light.color = color;
let renderer = new THREE.WebGLRenderer();
let texture = new THREE.Texture();
mesh.add(light);

export class ThreeAppScene extends Io {
  static get properties() {
    return {
      value: {
        value: mesh
      },
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
}

customElements.define('three-app-scene', ThreeAppScene);
