import {Io, html} from "../../../iocore.js";
import {IoPointerMixin} from "../../../mixins/iopointer.js";
import * as THREE from "../../../../lib/three.module.js";

export class ThreeViewport extends IoPointerMixin(Io) {
  static get style() {
    return html`
      <style>
      :host {
        position: relative;
        overflow: hidden;
      }
      :host > canvas {
        position: absolute;
        top: 0 !important;
        left: 0 !important;
      }
      </style>
    `;
  }
  static get properties() {
    return {
      pointermode: 'viewport',
      renderer: null,
      camera: null,
      scene: null,
      attributes: {
        'tabindex' : 0
      }
    }
  }
  constructor(props) {
    super(props);
    this.__state.camera.value = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, .1, 20000 );
    this.__state.scene.value = new THREE.Scene();
    this.__state.renderer.value = new THREE.WebGLRenderer( { antialias: false } );
    this.appendChild(this.renderer.domElement);
    this.init();
  }
  connectedCallback() {
    super.connectedCallback();
    this._connected = true;
    this._onAnimate();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._connected = false;
  }
  _onAnimate() {
    if (!this._connected) return;
    let rect = this.getBoundingClientRect();

    if (rect.width !== this._width || rect.height !== this._height) {
      let _ctx = this.renderer.context;
      var _ratio = _ctx.webkitBackingStorePixelRatio ||
                  _ctx.mozBackingStorePixelRatio ||
                  _ctx.msBackingStorePixelRatio ||
                  _ctx.oBackingStorePixelRatio ||
                  _ctx.backingStorePixelRatio || 1;

      this._width = rect.width;
      this._height = rect.height;
      this.renderer.setPixelRatio((window.devicePixelRatio || 1) * _ratio);
      this.renderer.setSize(Math.floor(rect.width), Math.floor(rect.height));

      if (this.camera instanceof THREE.PerspectiveCamera) {
        this.camera.aspect = rect.width / rect.height;
      }
      if (this.camera instanceof THREE.OrthographicCamera) {
        var a = rect.width / rect.height;
        var h = this.camera.top - this.camera.bottom;
        this.camera.top = h / 2;
        this.camera.bottom = - h / 2;
        this.camera.right = h / 2 * a;
        this.camera.left = - h / 2 * a;
      }

      this.camera.updateProjectionMatrix();
    }

    this.animate();
    requestAnimationFrame(this._onAnimate);
  }
  init() {}
  update() {}
  animate() {
    this.update();
    this.debounce(this.render, 1);
  }
  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

ThreeViewport.Register();
