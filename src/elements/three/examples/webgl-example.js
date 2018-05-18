import * as THREE from "../../../../lib/three.module.js";
import {ThreeViewport} from "../three-viewport/three-viewport.js";

export class WebglExample extends ThreeViewport {
  static get properties() {
    return {
      pointermode: 'viewport',
      renderer: null,
      camera: null,
      scene: null
    }
  }
  init() {}
  update() {}
}

WebglExample.Register();
