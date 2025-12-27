import { ReactiveProperty as r, Property as _, IoGl as D, Register as P, IoElement as z } from "@io-gui/core";
import { ioNumber as R } from "@io-gui/inputs";
var A = Object.defineProperty, p = (t, e, i, s) => {
  for (var o = void 0, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (o = a(e, i, o) || o);
  return o && A(e, i, o), o;
};
const N = (t, e, i) => i > e ? Math.min(Math.max(t, e), i) : Math.min(Math.max(t, i), e);
class h extends D {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: flex;
        cursor: ew-resize;
        border: var(--io_border);
        border-radius: var(--io_borderRadius);
        border-color: var(--io_borderColorInset);
        min-height: var(--io_fieldHeight);
        min-width: var(--io_fieldHeight);
        flex-grow: 1;
      }
      :host[vertical] {
        cursor: ns-resize;
        width: var(--io_fieldHeight);
        min-height: calc(var(--io_fieldHeight) * 5);
        flex-basis: var(--io_fieldHeight);
        flex-grow: 0;
      }
      :host[invalid] {
        color: var(--io_colorWhite);
        background-color: var(--io_bgColorRed);
        border-color: var(--io_colorRed);
      }
      :host:focus {
        @apply --io_focus;
      }
    `
    );
  }
  _startX = 0;
  _startY = 0;
  _rect = null;
  _active = -1;
  get _min() {
    return typeof this.min == "number" ? [this.min, this.min] : this.min instanceof Array ? [...this.min] : [-1 / 0, -1 / 0];
  }
  get _max() {
    return typeof this.max == "number" ? [this.max, this.max] : this.max instanceof Array ? [...this.max] : [1 / 0, 1 / 0];
  }
  get _step() {
    return typeof this.step == "number" ? [this.step, this.step] : this.step instanceof Array ? [...this.step] : [0.01, 0.01];
  }
  get _value() {
    return typeof this.value == "number" ? [this.value, this.value] : this.value instanceof Array ? [...this.value] : [NaN, NaN];
  }
  static get Listeners() {
    return {
      focus: "onFocus",
      contextmenu: "onContextmenu",
      pointerdown: "onPointerdown",
      touchstart: ["onTouchstart", { passive: !1 }]
    };
  }
  constructor(e = {}) {
    super(e);
  }
  onFocus() {
    this.addEventListener("blur", this.onBlur), this.addEventListener("keydown", this.onKeydown);
  }
  onBlur() {
    this.removeEventListener("blur", this.onBlur), this.removeEventListener("keydown", this.onKeydown);
  }
  onContextmenu(e) {
    e.stopPropagation(), e.preventDefault();
  }
  onTouchstart(e) {
    this._rect = this.getBoundingClientRect(), this.addEventListener("touchmove", this.onTouchmove, { passive: !1 }), this.addEventListener("touchend", this.onTouchend), this._startX = e.changedTouches[0].clientX, this._startY = e.changedTouches[0].clientY, this._active = this.noscroll ? 1 : -1;
  }
  onTouchmove(e) {
    const i = Math.abs(this._startX - e.changedTouches[0].clientX), s = Math.abs(this._startY - e.changedTouches[0].clientY);
    this._active === -1 && (this.vertical ? s > 5 && s > i && (this._active = s > i && i < 5 ? 1 : 0) : i > 5 && i > s && (this._active = i > s && s < 5 ? 1 : 0)), this._active === 1 && e.cancelable && (e.stopPropagation(), e.preventDefault());
  }
  onTouchend() {
    this.removeEventListener("touchmove", this.onTouchmove), this.removeEventListener("touchend", this.onTouchend);
  }
  onPointerdown(e) {
    e.stopPropagation(), this._rect = this.getBoundingClientRect(), this.setPointerCapture(e.pointerId), this.addEventListener("pointermove", this.onPointermove), this.addEventListener("pointerup", this.onPointerup), this.addEventListener("pointercancel", this.onPointerup);
  }
  onPointermove(e) {
    e.pointerType !== "touch" && (this._active = 1), this.throttle(this.onPointermoveThrottled, e);
  }
  onPointerup(e) {
    this.releasePointerCapture(e.pointerId), this.removeEventListener("pointermove", this.onPointermove), this.removeEventListener("pointerup", this.onPointerup), this.removeEventListener("pointercancel", this.onPointerup), this._active = -1;
  }
  _getPointerCoord(e) {
    const i = this._rect || this.getBoundingClientRect();
    let s = Math.max(0, Math.min(1, (e.clientX - i.x) / i.width)), o = Math.max(0, Math.min(1, 1 - (e.clientY - i.y) / i.height));
    return s = Math.pow(s, this.exponent), o = Math.pow(o, this.exponent), this.vertical ? [o, s] : [s, o];
  }
  _getValueFromCoord(e) {
    const i = [0, 0], s = this._min, o = this._max;
    return i[0] = s[0] * (1 - e[0]) + o[0] * e[0], i[1] = s[1] * (1 - e[1]) + o[1] * e[1], i;
  }
  onPointermoveThrottled(e) {
    if (this._active === 1) {
      document.activeElement !== this && this.focus();
      const i = this._getPointerCoord(e), s = this._getValueFromCoord(i);
      this._inputValue(s);
    }
  }
  _inputValue(e) {
    const i = this._min, s = this._max, o = this._step;
    if (e[0] = N(e[0], s[0], i[0]), e[1] = N(e[1], s[1], i[1]), e[0] = Math.round(e[0] / o[0]) * o[0], e[1] = Math.round(e[1] / o[1]) * o[1], e[0] = Number(e[0].toFixed(5)), e[1] = Number(e[1].toFixed(5)), typeof this.value == "number") {
      if (this.value === e[0]) return;
      this.inputValue(e[0]);
    } else if (this.value instanceof Array) {
      const n = JSON.stringify(this.value);
      if (this.value[0] = e[0], this.value[1] = e[1], n === JSON.stringify(this.value)) return;
      this.inputValue(this.value), this.dispatchMutation(this.value);
    } else if (typeof this.value == "object") {
      const n = JSON.stringify(this.value), a = this.value;
      if (a.x = e[0], a.y = e[1], n === JSON.stringify(this.value)) return;
      this.inputValue(this.value), this.dispatchMutation(this.value);
    }
  }
  inputValue(e) {
    if (this.value !== e || typeof this.value == "object") {
      const i = this.value;
      this.setProperty("value", e), this.dispatch("value-input", { value: e, oldValue: i }, !1);
    }
  }
  onKeydown(e) {
    const i = typeof this.value == "number";
    if (e.shiftKey) switch (e.key) {
      case "ArrowLeft":
        i ? this._setDecrease() : this._setLeft();
        break;
      case "ArrowUp":
        i ? this._setIncrease() : this._setUp();
        break;
      case "ArrowRight":
        i ? this._setIncrease() : this._setRight();
        break;
      case "ArrowDown":
        i ? this._setDecrease() : this._setDown();
        break;
    }
    else ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab", "Home", "End", "PageUp", "PageDown"].includes(e.key) && (e.preventDefault(), this.dispatch("io-focus-to", { source: this, command: e.key }, !0));
  }
  _setIncrease() {
    const e = this._value, i = this._step;
    e[0] = e[0] + i[0], e[1] = e[1] + i[1], this._inputValue(e);
  }
  _setDecrease() {
    const e = this._value, i = this._step;
    e[0] = e[0] - i[0], e[1] = e[1] - i[1], this._inputValue(e);
  }
  _setMin() {
    const e = this._min;
    this._inputValue(e);
  }
  _setMax() {
    const e = this._max;
    this._inputValue(e);
  }
  _setUp() {
    const e = this._value, i = this._step;
    e[0] = e[0] + i[0], this._inputValue(e);
  }
  _setDown() {
    const e = this._value, i = this._step;
    e[0] = e[0] - i[0], this._inputValue(e);
  }
  _setLeft() {
    const e = this._value, i = this._step;
    e[1] = e[1] - i[1], this._inputValue(e);
  }
  _setRight() {
    const e = this._value, i = this._step;
    e[1] = e[1] + i[1], this._inputValue(e);
  }
  ready() {
    this.changed();
  }
  valueChanged() {
    let e = !1;
    this.value instanceof Array ? e = isNaN(this.value[0]) || isNaN(this.value[1]) : isNaN(this.value) && (e = !0), this.invalid = e;
  }
  invalidChanged() {
    this.invalid ? this.setAttribute("aria-invalid", "true") : this.removeAttribute("aria-invalid");
  }
  valueMutated() {
    this.changed(), this.dispatchMutation();
  }
  changed() {
    super.changed(), this.setAttribute("aria-valuemin", JSON.stringify(this.min)), this.setAttribute("aria-valuemax", JSON.stringify(this.max)), this.setAttribute("aria-valuestep", JSON.stringify(this.step));
    const e = this._value;
    typeof e[0] != "number" || isNaN(e[0]) ? this.setAttribute("aria-invalid", "true") : this.removeAttribute("aria-invalid"), this.setAttribute("aria-valuenow", JSON.stringify(this.value));
  }
}
p([
  r({ type: Number, value: 0 })
], h.prototype, "value");
p([
  r({ type: Number, value: 0.01 })
], h.prototype, "step");
p([
  r({ type: Number, value: 0 })
], h.prototype, "min");
p([
  r({ type: Number, value: 1 })
], h.prototype, "max");
p([
  r({ type: Number, value: 1 })
], h.prototype, "exponent");
p([
  r({ value: !1, reflect: !0 })
], h.prototype, "vertical");
p([
  r({ value: !1, type: Boolean, reflect: !0 })
], h.prototype, "invalid");
p([
  _(!1)
], h.prototype, "noscroll");
p([
  _("slider")
], h.prototype, "role");
p([
  _(0)
], h.prototype, "tabIndex");
var O = Object.defineProperty, T = Object.getOwnPropertyDescriptor, w = (t, e, i, s) => {
  for (var o = s > 1 ? void 0 : s ? T(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (o = (s ? a(e, i, o) : a(o)) || o);
  return s && o && O(e, i, o), o;
};
let m = class extends h {
  _index = 0;
  constructor(t = {}) {
    super(t);
  }
  _getCoordFromValue(t) {
    const e = [0, 0], i = this._min, s = this._max;
    return e[0] = (t[0] - i[0]) / (s[0] - i[0]), e[1] = (t[1] - i[1]) / (s[1] - i[1]), e;
  }
  onPointerdown(t) {
    super.onPointerdown(t);
    const e = this._value, i = this._getPointerCoord(t), s = this._getCoordFromValue(e);
    this._index = Math.abs(s[0] - i[0]) < Math.abs(s[1] - i[0]) ? 0 : 1;
  }
  onPointermoveThrottled(t) {
    if (this._active === 1) {
      document.activeElement !== this && this.focus();
      const e = this._value, i = this._getPointerCoord(t), s = this._getValueFromCoord(i);
      this._index === 0 ? this._inputValue([s[0], e[1]]) : this._index === 1 && this._inputValue([e[0], s[0]]);
    }
  }
  static get Frag() {
    return (
      /* glsl */
      `
    varying vec2 vUv;

    void main(void) {
      // Dimensions
      vec2 size = uVertical == 1 ? uSize.yx : uSize;
      vec2 uv = uVertical == 1 ? vUv.yx : vUv;
      vec2 position = size * vec2(uv.x, uv.y - 0.5);
      vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y - 0.5);

      vec2 valueInRange = (uValue - vec2(uMin)) / (vec2(uMax) - vec2(uMin));

      vec2 valueSign = sign(valueInRange);
      vec2 expValueInRange = pow(abs(valueInRange), vec2(1./uExponent)) * valueSign;
      float valueInRangeWidth = valueInRange[1] - valueInRange[0];
      float valueInRangeCenter = (valueInRange[1] + valueInRange[0]) / 2.0;
      float signRange = sign(valueInRangeWidth);

      // Colors
      vec3 finalCol = io_bgColorInput.rgb;
      vec3 gridCol = io_bgColorLight.rgb;
      vec3 sliderCol = signRange > 0.0 ? io_bgColorBlue.rgb : io_bgColorRed.rgb;
      vec3 lineCol1 = io_color.rgb;
      vec3 lineCol2 = io_bgColor.rgb;

      // Grid
      float gridSize = size.x / abs((uMax - uMin) / uStep);
      float gridOffset = mod(uStep - uMin, uStep) / (uMax - uMin) * size.x;
      float gridShape = paintDerivativeGrid2D(translate(expPosition, gridOffset, 0.0), vec2(gridSize, 0.0), io_borderWidth);
      finalCol = compose(finalCol, vec4(gridCol, gridShape * 0.5));

      // Slider
      float sliderShape = rectangle(translate(expPosition, size.x * valueInRangeCenter, 0.0), vec2(size.x * abs(valueInRangeWidth) * 0.5, size.y));
      finalCol = compose(finalCol, vec4(sliderCol, sliderShape));
      finalCol = compose(finalCol, vec4(io_bgColorInput.rgb, gridShape * sliderShape * 0.125));

      // Lines
      float maxPos = expValueInRange[0];
      float minPos = expValueInRange[1];

      float lineMinShape1 = lineVertical(translate(position, maxPos * size.x, 0.0), io_borderWidth);
      finalCol = compose(finalCol, vec4(lineCol1, lineMinShape1));
      float lineMinShape2 = lineVertical(translate(position, maxPos * size.x + io_borderWidth * signRange, 0.0), io_borderWidth);
      finalCol = compose(finalCol, vec4(lineCol2, lineMinShape2));
      
      float lineMaxShape1 = lineVertical(translate(position, minPos * size.x, 0.0), io_borderWidth);
      finalCol = compose(finalCol, vec4(lineCol1, lineMaxShape1));
      float lineMaxShape2 = lineVertical(translate(position, minPos * size.x - io_borderWidth * signRange, 0.0), io_borderWidth);
      finalCol = compose(finalCol, vec4(lineCol2, lineMaxShape2));

      gl_FragColor = vec4(finalCol, 1.0);
    }
    `
    );
  }
};
w([
  r({ type: Array, value: void 0, init: [0, 0] })
], m.prototype, "value", 2);
w([
  r({ type: Number, value: 0.01 })
], m.prototype, "step", 2);
w([
  r({ type: Number, value: 0 })
], m.prototype, "min", 2);
w([
  r({ type: Number, value: 1 })
], m.prototype, "max", 2);
m = w([
  P
], m);
const W = function(t) {
  return m.vConstructor(t);
};
var F = Object.defineProperty, B = Object.getOwnPropertyDescriptor, b = (t, e, i, s) => {
  for (var o = s > 1 ? void 0 : s ? B(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (o = (s ? a(e, i, o) : a(o)) || o);
  return s && o && F(e, i, o), o;
};
let d = class extends z {
  static get Style() {
    return (
      /* css */
      `
    :host {
      display: flex;
    }
    :host > io-number {
      flex: 0 0 3.5em;
    }
    :host > io-slider-range {
      margin-left: var(--io_spacing);
      margin-right: var(--io_spacing);
      flex: 1 1 3.5em;
      min-width: 3.5em;
    }
    `
    );
  }
  constructor(t = {}) {
    super(t);
  }
  _onNumberSet(t) {
    const e = t.composedPath()[0];
    e === this.$.number0 && (this.value[0] = t.detail.value), e === this.$.number1 && (this.value[1] = t.detail.value), this.value._isNode || this.dispatchMutation(this.value);
  }
  _onSliderSet(t) {
    this.value = t.detail.value, this.value._isNode || this.dispatchMutation(this.value);
  }
  ready() {
    this.changed();
  }
  changed() {
    this.render([
      R({
        id: "number0",
        value: this.value[0],
        step: this.step,
        min: this.min,
        max: this.max,
        conversion: this.conversion,
        "@value-input": this._onNumberSet
      }),
      W({
        id: "slider",
        value: this.value,
        step: this.step,
        min: this.min,
        max: this.max,
        exponent: this.exponent,
        "@value-input": this._onSliderSet
      }),
      R({
        id: "number1",
        value: this.value[1],
        step: this.step,
        min: this.min,
        max: this.max,
        conversion: this.conversion,
        "@value-input": this._onNumberSet
      })
    ]);
  }
};
b([
  r({ type: Array, init: [0, 0] })
], d.prototype, "value", 2);
b([
  r(0.01)
], d.prototype, "step", 2);
b([
  r(0)
], d.prototype, "min", 2);
b([
  r(1)
], d.prototype, "max", 2);
b([
  r(1)
], d.prototype, "exponent", 2);
b([
  r(1)
], d.prototype, "conversion", 2);
d = b([
  P
], d);
const q = function(t) {
  return d.vConstructor(t);
};
var U = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, E = (t) => {
  throw TypeError(t);
}, u = (t, e, i, s) => {
  for (var o = s > 1 ? void 0 : s ? $(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (o = (s ? a(e, i, o) : a(o)) || o);
  return s && o && U(e, i, o), o;
}, L = (t, e, i) => e.has(t) || E("Cannot " + i), y = (t, e, i) => (L(t, e, "read from private field"), e.get(t)), M = (t, e, i) => e.has(t) ? E("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), v = (t, e, i, s) => (L(t, e, "write to private field"), e.set(t, i), i), V, I, c, S;
const H = (t, e, i) => i > e ? Math.min(Math.max(t, e), i) : Math.min(Math.max(t, i), e);
let l = class extends D {
  constructor(t = {}) {
    super(t), M(this, V, 0), M(this, I, 0), M(this, c, -1), M(this, S, null);
  }
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: flex;
        cursor: ew-resize;
        border: var(--io_border);
        border-radius: var(--io_borderRadius);
        border-color: var(--io_borderColorInset);
        min-height: var(--io_fieldHeight);
        min-width: var(--io_fieldHeight);
        flex-grow: 1;
      }
      :host[vertical] {
        cursor: ns-resize;
        width: var(--io_fieldHeight);
        min-height: calc(var(--io_fieldHeight) * 5);
        flex-basis: var(--io_fieldHeight);
        flex-grow: 0;
      }
      :host[invalid] {
        border-color: var(--io_colorRed);
      }
      :host[disabled] {
        opacity: 0.5;
      }
      :host:focus {
        @apply --io_focus;
      }
    `
    );
  }
  static get Frag() {
    return (
      /* glsl */
      `
    varying vec2 vUv;

    void main(void) {
      // Dimensions
      vec2 size = uVertical == 1 ? uSize.yx : uSize;
      vec2 uv = uVertical == 1 ? vUv.yx : vUv;
      vec2 position = size * vec2(uv.x, uv.y - 0.5);
      vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y - 0.5);
      float valueInRange = (uValue - uMin) / (uMax - uMin);
      if (uInvalid == 1) valueInRange = 0.0;
      float valueSign = sign(valueInRange);
      float expValueInRange = pow(abs(valueInRange), 1./uExponent) * valueSign;

      // Colors
      vec3 finalCol = io_bgColorInput.rgb;
      vec3 gridCol = io_bgColorLight.rgb;
      vec3 sliderCol = io_bgColorBlue.rgb;
      vec3 lineCol1 = io_color.rgb;
      vec3 lineCol2 = io_bgColor.rgb;

      // Grid
      float gridSize = size.x / abs((uMax - uMin) / uStep);
      float gridOffset = mod(uStep - uMin, uStep) / (uMax - uMin) * size.x;
      float gridShape = paintDerivativeGrid2D(translate(expPosition, gridOffset, 0.0), vec2(gridSize, 0.0), io_borderWidth);
      finalCol = compose(finalCol, vec4(gridCol, gridShape * 0.5));

      // Slider
      float sliderShape = rectangle(expPosition, vec2(size.x * valueInRange, size.y));
      finalCol = compose(finalCol, vec4(sliderCol, sliderShape));
      finalCol = compose(finalCol, vec4(io_bgColorInput.rgb, gridShape * sliderShape * 0.125));

      // Lines
      float lineShape1 = lineVertical(translate(position, expValueInRange * size.x, 0.0), io_borderWidth);
      finalCol = compose(finalCol, vec4(lineCol1, lineShape1));
      float lineShape2 = lineVertical(translate(position, expValueInRange * size.x - io_borderWidth, 0.0), io_borderWidth);
      finalCol = compose(finalCol, vec4(lineCol2, lineShape2));

      gl_FragColor = vec4(finalCol, 1.0);
    }`
    );
  }
  static get Listeners() {
    return {
      focus: "onFocus",
      contextmenu: "onContextmenu",
      pointerdown: "onPointerdown",
      touchstart: ["onTouchstart", { passive: !1 }]
    };
  }
  onFocus() {
    this.addEventListener("blur", this.onBlur), this.addEventListener("keydown", this.onKeydown);
  }
  onBlur() {
    this.removeEventListener("blur", this.onBlur), this.removeEventListener("keydown", this.onKeydown);
  }
  onContextmenu(t) {
    t.preventDefault();
  }
  onTouchstart(t) {
    v(this, S, this.getBoundingClientRect()), this.addEventListener("touchmove", this.onTouchmove, { passive: !1 }), this.addEventListener("touchend", this.onTouchend), v(this, V, t.changedTouches[0].clientX), v(this, I, t.changedTouches[0].clientY), v(this, c, this.noscroll ? 1 : -1);
  }
  onTouchmove(t) {
    const e = Math.abs(y(this, V) - t.changedTouches[0].clientX), i = Math.abs(y(this, I) - t.changedTouches[0].clientY);
    y(this, c) === -1 && (this.vertical ? i > 5 && i > e && v(this, c, i > e && e < 5 ? 1 : 0) : e > 5 && e > i && v(this, c, e > i && i < 5 ? 1 : 0)), y(this, c) === 1 && t.cancelable && t.preventDefault();
  }
  onTouchend() {
    this.removeEventListener("touchmove", this.onTouchmove), this.removeEventListener("touchend", this.onTouchend);
  }
  onPointerdown(t) {
    t.stopPropagation(), v(this, S, this.getBoundingClientRect()), this.setPointerCapture(t.pointerId), this.addEventListener("pointermove", this.onPointermove), this.addEventListener("pointerup", this.onPointerup), this.addEventListener("pointercancel", this.onPointerup);
  }
  onPointermove(t) {
    t.pointerType !== "touch" && v(this, c, 1), this.throttle(this.onPointermoveThrottled, t);
  }
  onPointerup(t) {
    this.releasePointerCapture(t.pointerId), this.removeEventListener("pointermove", this.onPointermove), this.removeEventListener("pointerup", this.onPointerup), this.removeEventListener("pointercancel", this.onPointerup), v(this, c, -1);
  }
  _getPointerCoord(t) {
    const e = y(this, S) || this.getBoundingClientRect();
    let i = Math.max(0, Math.min(1, (t.clientX - e.x) / e.width)), s = Math.max(0, Math.min(1, 1 - (t.clientY - e.y) / e.height));
    return Math.pow(this.vertical ? s : i, this.exponent);
  }
  _getValueFromCoord(t) {
    return this.min * (1 - t) + this.max * t;
  }
  onPointermoveThrottled(t) {
    if (y(this, c) === 1) {
      document.activeElement !== this && this.focus();
      const e = this._getPointerCoord(t), i = this._getValueFromCoord(e);
      this._inputValue(i);
    }
  }
  _incrementValue(t) {
    this._inputValue(this.value + t);
  }
  _inputValue(t) {
    t = H(t, this.max, this.min), t = Math.round(t / this.step) * this.step, t = Number(t.toFixed(5)), !isNaN(t) && this.value !== t && this.inputValue(t);
  }
  inputValue(t) {
    if (this.value !== t || typeof this.value == "object") {
      const e = this.value;
      this.setProperty("value", t), this.dispatch("value-input", { value: t, oldValue: e }, !1);
    }
  }
  onKeydown(t) {
    const e = this.max < this.min;
    if (t.shiftKey) switch (t.key) {
      case "ArrowLeft":
        this._incrementValue(e ? this.step : -this.step);
        break;
      case "ArrowUp":
        this._incrementValue(e ? -this.step : this.step);
        break;
      case "ArrowRight":
        this._incrementValue(e ? -this.step : this.step);
        break;
      case "ArrowDown":
        this._incrementValue(e ? this.step : -this.step);
        break;
      case "Home":
        t.preventDefault(), this._inputValue(this.min);
        break;
      case "End":
        t.preventDefault(), this._inputValue(this.max);
        break;
      case "PageUp":
        t.preventDefault(), this._incrementValue(e ? -this.step : this.step);
        break;
      case "PageDown":
        t.preventDefault(), this._incrementValue(e ? this.step : -this.step);
        break;
    }
    else ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab", "Home", "End", "PageUp", "PageDown"].includes(t.key) && (t.preventDefault(), this.dispatch("io-focus-to", { source: this, command: t.key }, !0));
  }
  ready() {
    this.valueChanged(), this.minChanged(), this.maxChanged(), this.changed();
  }
  invalidChanged() {
    this.ariaInvalid = String(this.invalid);
  }
  disabledChanged() {
    this.inert = this.disabled, this.ariaDisabled = String(this.disabled);
  }
  valueChanged() {
    this.invalid = isNaN(this.value), this.ariaValueNow = String(this.value);
  }
  minChanged() {
    this.ariaValueMin = String(this.min);
  }
  maxChanged() {
    this.ariaValueMax = String(this.max);
  }
};
V = /* @__PURE__ */ new WeakMap();
I = /* @__PURE__ */ new WeakMap();
c = /* @__PURE__ */ new WeakMap();
S = /* @__PURE__ */ new WeakMap();
u([
  r(0)
], l.prototype, "value", 2);
u([
  r(0.01)
], l.prototype, "step", 2);
u([
  r(0)
], l.prototype, "min", 2);
u([
  r(1)
], l.prototype, "max", 2);
u([
  r(1)
], l.prototype, "exponent", 2);
u([
  r({ value: !1, reflect: !0 })
], l.prototype, "vertical", 2);
u([
  r({ value: !1, type: Boolean, reflect: !0 })
], l.prototype, "invalid", 2);
u([
  r({ value: !1, type: Boolean, reflect: !0 })
], l.prototype, "disabled", 2);
u([
  _(!1)
], l.prototype, "noscroll", 2);
u([
  _("slider")
], l.prototype, "role", 2);
u([
  _(0)
], l.prototype, "tabIndex", 2);
l = u([
  P
], l);
const k = function(t) {
  return l.vConstructor(t);
};
var K = Object.defineProperty, j = Object.getOwnPropertyDescriptor, x = (t, e, i, s) => {
  for (var o = s > 1 ? void 0 : s ? j(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (o = (s ? a(e, i, o) : a(o)) || o);
  return s && o && K(e, i, o), o;
};
let f = class extends z {
  static get Style() {
    return (
      /* css */
      `
    :host {
      display: flex;
    }
    :host > io-number {
      flex: 0 0 3.5em;
      margin-right: var(--io_spacing);
    }
    :host > io-slider {
      flex: 1 1 3em;
      min-width: 3em;
    }
    `
    );
  }
  constructor(t = {}) {
    super(t);
  }
  _onNumberSet(t) {
    this.value = t.detail.value, this.dispatch("value-input", t.detail, !1);
  }
  _onSliderSet(t) {
    t.detail.value = t.detail.value / this.conversion, this.value = t.detail.value, this.dispatch("value-input", t.detail, !1);
  }
  ready() {
    this.changed();
  }
  changed() {
    this.render([
      R({
        id: "number",
        value: this.value,
        step: this.step,
        min: this.min * this.conversion,
        max: this.max * this.conversion,
        conversion: this.conversion,
        "@value-input": this._onNumberSet
      }),
      k({
        id: "slider",
        value: this.value * this.conversion,
        step: this.step * this.conversion,
        min: this.min * this.conversion,
        max: this.max * this.conversion,
        exponent: this.exponent,
        "@value-input": this._onSliderSet
      })
    ]);
  }
};
x([
  r({ value: 0 })
], f.prototype, "value", 2);
x([
  r(0.01)
], f.prototype, "step", 2);
x([
  r(0)
], f.prototype, "min", 2);
x([
  r(1)
], f.prototype, "max", 2);
x([
  r(1)
], f.prototype, "exponent", 2);
x([
  r(1)
], f.prototype, "conversion", 2);
f = x([
  P
], f);
const Q = function(t) {
  return f.vConstructor(t);
};
var X = Object.defineProperty, Y = Object.getOwnPropertyDescriptor, C = (t, e, i, s) => {
  for (var o = s > 1 ? void 0 : s ? Y(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (o = (s ? a(e, i, o) : a(o)) || o);
  return s && o && X(e, i, o), o;
};
let g = class extends h {
  static get Style() {
    return (
      /* css */
      `
      :host {
        cursor: crosshair;
        border: var(--io_border);
        border-radius: var(--io_borderRadius);
        border-color: var(--io_borderColorInset);
        flex-grow: 0;
      }
      :host:not([vertical]),
      :host[vertical] {
        min-width: calc(var(--io_fieldHeight) * 5);
        min-height: calc(var(--io_fieldHeight) * 5);
        cursor: crosshair;
      }
    `
    );
  }
  constructor(t = {}) {
    super(t);
  }
  static get GlUtils() {
    return (
      /* glsl */
      `
      vec3 paintKnob(vec3 dstCol, vec2 p, vec2 center, vec3 color) {
        vec4 finalCol = vec4(0.0);
        vec2 pCenter = translate(p, center);
        float radius = io_fieldHeight * 0.25;
        float stroke = io_borderWidth;
        float strokeShape = circle(pCenter, radius + stroke + stroke);
        float fillShape   = circle(pCenter, radius + stroke);
        float colorShape  = circle(pCenter, radius);
        finalCol = mix(io_colorStrong, finalCol, strokeShape);
        finalCol = mix(vec4(io_bgColor.rgb, 1.0), finalCol, fillShape);
        finalCol = mix(vec4(color, 1.0), finalCol, colorShape);
        return compose(dstCol, finalCol);
      }
    `
    );
  }
  static get Frag() {
    return (
      /* glsl */
      `
    varying vec2 vUv;

    void main(void) {
      // Dimensions
      vec2 size = uVertical == 1 ? uSize.yx : uSize;
      vec2 uv = uVertical == 1 ? vUv.yx : vUv;
      vec2 position = size * (uv - vec2(0.5));

      // Colors
      vec3 finalCol = io_bgColorInput.rgb;
      vec3 gridCol = io_bgColorLight.rgb;
      vec3 sliderCol = io_bgColorBlue.rgb;
      vec3 lineCol1 = io_color.rgb;
      vec3 lineCol2 = io_bgColor.rgb;

      // Grid
      vec2 gridSize = size / abs((uMax - uMin) / uStep);
      vec2 gridOffset = (uMax + uMin) / (uMax - uMin) * size / 2.;
      vec2 gridPosition = translate(position, -gridOffset);
      float gridShape = paintDerivativeGrid2D(gridPosition, gridSize, io_borderWidth);
      finalCol = compose(finalCol, vec4(gridCol, gridShape * 0.5));

      // Axis
      float axisShape = lineCross2d(gridPosition, io_borderWidth);
      finalCol = compose(finalCol, vec4(gridCol, axisShape));

      // Knob
      vec2 knobPos = uValue / (uMax - uMin) * size;
      finalCol = paintKnob(finalCol, gridPosition, knobPos, sliderCol);

      gl_FragColor = vec4(finalCol, 1.0);
    }`
    );
  }
};
C([
  r({ type: Array, value: void 0, init: [0, 0] })
], g.prototype, "value", 2);
C([
  r({ type: Array, value: void 0, init: [0.01, 0.01] })
], g.prototype, "step", 2);
C([
  r({ type: Array, value: void 0, init: [-1, -1] })
], g.prototype, "min", 2);
C([
  r({ type: Array, value: void 0, init: [1, 1] })
], g.prototype, "max", 2);
C([
  _(!0)
], g.prototype, "noscroll", 2);
g = C([
  P
], g);
const Z = function(t) {
  return g.vConstructor(t);
};
export {
  f as IoNumberSlider,
  d as IoNumberSliderRange,
  l as IoSlider,
  g as IoSlider2d,
  h as IoSliderBase,
  m as IoSliderRange,
  Q as ioNumberSlider,
  q as ioNumberSliderRange,
  k as ioSlider,
  Z as ioSlider2d,
  W as ioSliderRange
};
//# sourceMappingURL=index.js.map
