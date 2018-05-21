import {IoNode} from "../../../io-node.js";
import * as THREE from "../../../../lib/three.module.js";

export class ThreeShot extends IoNode {
  static get properties() {
    return {
      camera: null,
      scene: null,
    }
  }
  constructor() {
    super();
    this.init();
  }
  init() {
    let camera = this.camera = new THREE.PerspectiveCamera( 45, 1, .1, 20000 );
    let scene = this.scene = new THREE.Scene();
  }
  dispose() {
    // TODO
  }
  play() {

  }
  pause() {

  }
  stop() {

  }
  update(dtime, time, progress) {

  }
  preRender() {

  }
  postRender() {

  }
  path(path, importurl) {
    return new URL(path, importurl).pathname;
  }
}
