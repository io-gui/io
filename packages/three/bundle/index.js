import { ReactiveProperty as n, Node as O, Register as y, Property as C, IoElement as D } from "@io-gui/core";
import { Scene as _, Box3 as z, Sphere as A, Vector3 as d, Camera as V, PerspectiveCamera as P, OrthographicCamera as f, WebGPURenderer as j, CanvasTarget as R } from "three/webgpu";
import T from "three/addons/capabilities/WebGPU.js";
import { OrbitControls as I } from "three/addons/controls/OrbitControls.js";
var M = Object.defineProperty, E = Object.getOwnPropertyDescriptor, x = (t, e, i, o) => {
  for (var s = o > 1 ? void 0 : o ? E(e, i) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (s = (o ? a(e, i, s) : a(s)) || s);
  return o && s && M(e, i, s), s;
};
let b = class extends O {
  renderer = null;
  width = 0;
  height = 0;
  setViewportSize(t, e) {
    (this.width !== t || this.height !== e) && t && e && (this.width = t, this.height = e, this.onResized(t, e));
  }
  isRendererInitialized() {
    return !!this.renderer && this.renderer.initialized === !0;
  }
  onRendererInitialized(t) {
    this.renderer = t;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onResized(t, e) {
  }
  onAnimate() {
  }
};
x([
  n({ type: _, init: null })
], b.prototype, "scene", 2);
b = x([
  y
], b);
var $ = Object.defineProperty, k = Object.getOwnPropertyDescriptor, l = (t, e, i, o) => {
  for (var s = o > 1 ? void 0 : o ? k(e, i) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (s = (o ? a(e, i, s) : a(s)) || s);
  return o && s && $(e, i, s), s;
};
const g = new z(), B = new A(), w = new d(), m = new d();
function W(t, e, i) {
  const o = e / i;
  if (t instanceof P)
    t.aspect = o;
  else if (t instanceof f) {
    const s = t.top - t.bottom;
    t.left = -s * o / 2, t.right = s * o / 2;
  }
  t.updateProjectionMatrix();
}
class N {
  perspective;
  top;
  bottom;
  left;
  right;
  front;
  back;
  constructor() {
    this.perspective = new P(75, 1, 0.1, 1e3), this.top = new f(-1, 1, 1, -1, 0, 1e3), this.bottom = new f(-1, 1, 1, -1, 0, 1e3), this.left = new f(-1, 1, 1, -1, 0, 1e3), this.right = new f(-1, 1, 1, -1, 0, 1e3), this.front = new f(-1, 1, 1, -1, 0, 1e3), this.back = new f(-1, 1, 1, -1, 0, 1e3), this.perspective.position.set(0.5, 0.25, 1), this.perspective.lookAt(0, 0, 0), this.perspective.name = "perspective", this.top.userData.position = new d(0, 1, 0), this.top.position.copy(this.top.userData.position), this.top.lookAt(0, 0, 0), this.top.name = "top", this.bottom.userData.position = new d(0, -1, 0), this.bottom.position.copy(this.bottom.userData.position), this.bottom.lookAt(0, 0, 0), this.bottom.name = "bottom", this.left.userData.position = new d(-1, 0, 0), this.left.position.copy(this.left.userData.position), this.left.lookAt(0, 0, 0), this.left.name = "left", this.right.userData.position = new d(1, 0, 0), this.right.position.copy(this.right.userData.position), this.right.lookAt(0, 0, 0), this.right.name = "right", this.front.userData.position = new d(0, 0, 1), this.front.position.copy(this.front.userData.position), this.front.lookAt(0, 0, 0), this.front.name = "front", this.back.userData.position = new d(0, 0, -1), this.back.position.copy(this.back.userData.position), this.back.lookAt(0, 0, 0), this.back.name = "back";
  }
  get cameras() {
    return [this.perspective, this.top, this.bottom, this.left, this.right, this.front, this.back];
  }
  getCamera(e) {
    return this.cameras.find((i) => i.name === e);
  }
}
let h = class extends O {
  constructor(t) {
    super(t), this.orbitControls.connect(this.viewport), this.orbitControls.addEventListener("change", () => {
      this.state.dispatchMutation();
    }), this.camera === void 0 && (this.camera = this.defaultCameras.perspective);
  }
  cameraSelectChanged() {
    if (this.cameraSelect.startsWith("scene")) {
      const t = this.cameraSelect.split(":")[1] || "", e = this.state.scene.getObjectsByProperty("isPerspectiveCamera", !0), i = this.state.scene.getObjectsByProperty("isOrthographicCamera", !0), o = [...e, ...i];
      let s;
      t ? s = o.find((r) => r.name === t) : s = o[0], s ? this.camera = s : (this.camera = this.defaultCameras.perspective, console.warn(`Camera ${t} not found in the scene, using default perspective camera`));
    } else
      this.camera = this.defaultCameras.getCamera(this.cameraSelect) || this.defaultCameras.perspective;
    this.orbitControls.object = this.camera;
  }
  setSize(t, e) {
    if (!(t === 0 || e === 0) && (this.width !== t || this.height !== e)) {
      for (const i of this.defaultCameras.cameras)
        W(i, t, e);
      this.width = t, this.height = e;
    }
  }
  cameraChanged() {
  }
  stateChanged() {
    for (const t of this.defaultCameras.cameras)
      this.frameObject(this.state.scene, t);
  }
  frameObject(t, e) {
    let i;
    if (g.setFromObject(t), g.isEmpty() === !1 ? (g.getCenter(w), i = g.getBoundingSphere(B).radius) : (w.setFromMatrixPosition(e.matrixWorld), i = 0.1), m.set(0, 0, 1), m.applyQuaternion(e.quaternion), m.multiplyScalar(i * 2), e instanceof P)
      e.near = i * 1e-3, e.far = i * 16, e.updateProjectionMatrix(), e.position.copy(w).add(m);
    else if (e instanceof f) {
      m.copy(e.userData.position).multiplyScalar(i);
      const o = this.width / this.height;
      e.top = i, e.bottom = -i, e.left = -i * o, e.right = i * o, e.near = 0, e.far = i * 8, e.position.copy(w).add(m), e.lookAt(w), e.updateProjectionMatrix();
    }
  }
  dispose() {
    this.orbitControls.dispose(), super.dispose();
  }
};
l([
  C(0)
], h.prototype, "width", 2);
l([
  C(0)
], h.prototype, "height", 2);
l([
  C()
], h.prototype, "viewport", 2);
l([
  n({ type: b })
], h.prototype, "state", 2);
l([
  n({ type: String, value: "perspective" })
], h.prototype, "cameraSelect", 2);
l([
  n({ type: V })
], h.prototype, "camera", 2);
l([
  n({ type: N, init: null })
], h.prototype, "defaultCameras", 2);
l([
  n({ type: I, init: ["this.defaultCameras.perspective"] })
], h.prototype, "orbitControls", 2);
h = l([
  y
], h);
var G = Object.defineProperty, U = Object.getOwnPropertyDescriptor, u = (t, e, i, o) => {
  for (var s = o > 1 ? void 0 : o ? U(e, i) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (s = (o ? a(e, i, s) : a(s)) || s);
  return o && s && G(e, i, s), s;
};
if (T.isAvailable() === !1)
  throw new Error("No WebGPU support");
const S = new IntersectionObserver((t) => {
  t.forEach((e) => {
    e.target.visible = e.isIntersecting;
  });
}), p = new j({ antialias: !1, alpha: !0 });
p.setPixelRatio(window.devicePixelRatio);
p.init();
const v = [];
new Promise((t, e) => {
  p.setAnimationLoop((i) => {
    for (const o of v)
      o.onAnimate(i);
  }).then(t).catch(e);
}).then(() => {
  console.log("animation loop initialized");
}).catch((t) => {
  console.error("animation loop initialization failed", t);
});
let c = class extends D {
  width = 0;
  height = 0;
  visible = !1;
  static get Style() {
    return (
      /* css */
      `
      :host {
        position: relative;
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        max-width: 100%;
        max-height: 100%;
        overflow: hidden;
      }
      :host > canvas {
        position: absolute;
      }
    `
    );
  }
  constructor(t) {
    super(t), this.renderViewport = this.renderViewport.bind(this), this.renderTarget = new R(document.createElement("canvas")), this.appendChild(this.renderTarget.domElement), this.viewCameras = new h({ viewport: this, state: this.state, cameraSelect: this.bind("cameraSelect") }), this.debounce(this.renderViewport);
  }
  connectedCallback() {
    super.connectedCallback(), S.observe(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), S.unobserve(this), this.visible = !1;
  }
  playingChanged() {
    this.playing ? v.push(this) : v.includes(this) && v.splice(v.indexOf(this), 1);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAnimate(t) {
    this.visible && this.debounce(this.renderViewport);
  }
  onResized() {
    const t = this.getBoundingClientRect();
    this.width = Math.floor(t.width), this.height = Math.floor(t.height), this.renderTarget.setSize(this.width, this.height), this.renderTarget.setPixelRatio(window.devicePixelRatio), this.viewCameras.setSize(this.width, this.height), this.renderViewport();
  }
  stateChanged() {
    this.debounce(this.renderViewport);
  }
  stateMutated() {
    this.debounce(this.renderViewport);
  }
  changed() {
    this.debounce(this.renderViewport);
  }
  renderViewport() {
    if (p.initialized === !1) {
      this.debounce(this.renderViewport);
      return;
    }
    this.state.isRendererInitialized() === !1 && this.state.onRendererInitialized(p), !(!this.width || !this.height) && (p.setCanvasTarget(this.renderTarget), p.setClearColor(this.clearColor, this.clearAlpha), p.setSize(this.width, this.height), p.clear(), this.state.setViewportSize(this.width, this.height), this.state.onAnimate(), p.render(this.state.scene, this.viewCameras.camera));
  }
  dispose() {
    super.dispose(), this.renderTarget.dispose(), this.viewCameras.dispose();
  }
};
u([
  n({ type: Number, value: 0 })
], c.prototype, "clearColor", 2);
u([
  n({ type: Number, value: 1 })
], c.prototype, "clearAlpha", 2);
u([
  n({ type: String, value: "throttled" })
], c.prototype, "reactivity", 2);
u([
  n({ type: b, init: null })
], c.prototype, "state", 2);
u([
  n({ type: Boolean })
], c.prototype, "playing", 2);
u([
  n({ type: String, value: "perspective" })
], c.prototype, "cameraSelect", 2);
c = u([
  y
], c);
const Q = function(t) {
  return c.vConstructor(t);
};
export {
  c as IoThreeViewport,
  b as ThreeState,
  Q as ioThreeViewport
};
//# sourceMappingURL=index.js.map
