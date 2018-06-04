import {IoNode} from "../../../io-node.js";
import * as THREE from "../../../../lib/three.module.js";

export class ThreeShot extends IoNode {
  static get properties() {
    return {
      camera: THREE.PerspectiveCamera,
      scene: THREE.Scene,
      time: {
        value: 0,
        config: {step: 0.01}
      }
    };
  }
  constructor() {
    super();
    this.init();
  }
  init() {
  }
  dispose() {
    // TODO
  }
  onPropertyChange() {

  }
  play() {

  }
  pause() {

  }
  stop() {

  }
  update() {

  }
  preRender() {

  }
  postRender() {

  }
  path(path, importurl) {
    return new URL(path, importurl).pathname;
  }
}
