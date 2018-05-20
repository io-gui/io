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
  static get style() {
    return html`
    <style>

    <style>
    `;
  }
  static get properties() {
    return {
      value: null
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.value = mesh;
  }
  selectDemo(demo) {
    this.value = demo;
  }
  reset() {
    localStorage.clear();
    window.location.reload();
  }
  update() {
    this.render([
      ['h4', 'Select Demo:'],
      ['io-button', {label: 'Mesh', action: this.selectDemo.bind(this), value: mesh}],
      ['io-button', {label: 'Light', action: this.selectDemo.bind(this), value: light}],
      ['io-button', {label: 'Color', action: this.selectDemo.bind(this), value: color}],
      ['io-button', {label: 'Renderer', action: this.selectDemo.bind(this), value: renderer}],
      ['io-button', {label: 'Texture', action: this.selectDemo.bind(this), value: texture}],
      ['io-button', {label: 'Reset', action: this.reset.bind(this)}],
    ]);
  }
}

DemoAppCtrl.Register();
