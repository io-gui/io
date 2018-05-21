/**
* @author arodic / http://akirodic.com/
*/

/**
THREE.WebGLRenderer wrapper that manages GL rendering context across multiple instances of
ThreeRenderer. All instances of this element will share a single WebGL canvas.
An element instance becomes a host of the canvas any time WebGL API is used through one of
its methods. Before this happens, the previous host needs to store the framebuffer data in a
2D canvas before the WebGL canvas can be handed out.

IMPORTANT: Keep in mind that WebGL canvas migration is expensive and should not be performed
continuously. In other words, you cannot render with mutliple instances of
ThreeRenderer in realtime without severe performance penalties.
*/

import {Io} from "../../../iocore.js";
import * as THREE from "../../../../lib/three.module.js";

const renderer = new THREE.WebGLRenderer();
const gl = renderer.getContext();
renderer.domElement.className = 'canvas3d';

let host;

var perfNow = 0;
var perfDelta = 1000;
var perfAverage = 1000;
var perfWarned;

/**
 * This function runs every time renderer migrates to another three-renderer host
 * It is designed to detect if migration feature is overrused by the user.
 */
var _performanceCheck = function() {
  if (perfWarned) return;
  perfDelta = performance.now() - perfNow;
  perfAverage = Math.min((perfAverage * 10 + perfDelta) / 11, 1000);
  perfNow = performance.now();
  if (perfAverage < 16) {
    console.warn('ThreeRenderer performance warning: rendering multiple canvases!');
    perfWarned = true;
  }
};

export class ThreeRenderer extends Io {
  static get style() {
    return html`<style>
      :host {
        position: relative;
      }
      :host > canvas {
        position: absolute;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
      }
      :host > canvas.canvas3d {
        background: green;
        display: none;
      }
      :host > canvas.canvas2d {
        background: blue;
      }
      :host[ishost] > canvas.canvas3d {
        display: block;
      }
      :host[ishost] canvas.canvas2d {
        display: none;
      }
    </style>`;
  }
  static get properties() {
    return {
      ishost: {
        value: false,
        reflect: true
      }
    };
  }
  static get listeners() {
    return {
      'click': '_onSetHost'
    }
  }
  constructor() {
    super();

    // TODO: implement smarter resize

    this._canvas2d = document.createElement('canvas');
    this._canvas2d.className = 'canvas2d';
    this._context2d = this._canvas2d.getContext('2d');
    this.appendChild(this._canvas2d);

    this._renderer = renderer;
    Object.defineProperty(this, '_props', { value: {} });
    for (let key in renderer) {
      // console.log(key);
      if (typeof renderer[key] === 'object') {
        this[key] = renderer[key];
      } else if (typeof renderer[key] === 'function') {
        this[key] = function() {
          this._setHost();
          renderer[key].apply(renderer, arguments);
        }.bind(this);
      } else {
        Object.defineProperty(this, key, {
          get: function() {
            return this._props[key];
          },
          set: function(value) {
            this._props[key] = value;
          },
          enumerable: true,
          configurable: true
        });
        this._props[key] = renderer[key];
      }
    }
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this._onResize);
    // window.addEventListener('app-split-changed', this._onResize);
    this._onResize();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this._onResize);
    // window.removeEventListener('app-split-changed', this._onResize);
  }
  _onSetHost() {
    this._setHost();
  }
  _setHost() {
    if (!this.ishost) {
      _performanceCheck();
      if (host) {
        // host._onResize();
        host._context2d.drawImage(renderer.domElement, 0, 0, host._canvas2d.width, host._canvas2d.height);
        gl.flush();
        host.ishost = false;
      }
      host = this;
      this.ishost = true;
      this.appendChild(renderer.domElement);
      this._onResize();
    }
    for (let key in this.props) {
      renderer[key] = this._props[key];
    }
    // renderer.setClearColor(_clearColor);
    // renderer.setClearAlpha(_clearAlpha);
  }
  _setSize() {
    let rect = this.getBoundingClientRect();
    var ratio = this._context2d.webkitBackingStorePixelRatio ||
                this._context2d.mozBackingStorePixelRatio ||
                this._context2d.msBackingStorePixelRatio ||
                this._context2d.oBackingStorePixelRatio ||
                this._context2d.backingStorePixelRatio || 1;

    this._c2Dratio = (window.devicePixelRatio || 1) / ratio;

    this._canvas2d.width = rect.width * this._c2Dratio;
    this._canvas2d.height = rect.height * this._c2Dratio;

    if (this.ishost) {
      renderer.setSize(rect.width, rect.height);
      renderer.setPixelRatio( window.devicePixelRatio );
    }
  }
  _onResize() {
    this._setSize();
  }
}

ThreeRenderer.Register();
