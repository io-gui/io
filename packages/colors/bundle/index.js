import { ReactiveProperty as d, IoElement as E, Register as u, glsl as f, IoOverlaySingleton as j, div as B, Property as K, nudge as T } from "@io-gui/core";
import { IoSlider2d as W, IoSlider as q } from "@io-gui/sliders";
import { ioNumber as m } from "@io-gui/inputs";
const J = function(e) {
  const t = e[0] / 255, i = e[1] / 255, o = e[2] / 255, r = Math.min(t, i, o), s = Math.max(t, i, o), l = s - r;
  let a = 0, c;
  s === r ? a = 0 : t === s ? a = (i - o) / l : i === s ? a = 2 + (o - t) / l : o === s && (a = 4 + (t - i) / l), a = Math.min(a * 60, 360), a < 0 && (a += 360);
  const v = (r + s) / 2;
  return s === r ? c = 0 : v <= 0.5 ? c = l / (s + r) : c = l / (2 - s - r), [a, c * 100, v * 100];
}, X = function(e) {
  let t, i, o, r = 0, s;
  const l = e[0] / 255, a = e[1] / 255, c = e[2] / 255, v = Math.max(l, a, c), _ = v - Math.min(l, a, c), w = function(N) {
    return (v - N) / 6 / _ + 1 / 2;
  };
  return _ === 0 ? (r = 0, s = 0) : (s = _ / v, t = w(l), i = w(a), o = w(c), l === v ? r = o - i : a === v ? r = 1 / 3 + t - o : c === v && (r = 2 / 3 + i - t), r < 0 ? r += 1 : r > 1 && (r -= 1)), [
    r * 360,
    s * 100,
    v * 100
  ];
}, Q = function(e) {
  const t = e[0] / 360, i = e[1] / 100, o = e[2] / 100;
  let r, s, l;
  if (i === 0)
    return l = o * 255, [l, l, l];
  o < 0.5 ? r = o * (1 + i) : r = o + i - o * i;
  const a = 2 * o - r, c = [0, 0, 0];
  for (let v = 0; v < 3; v++)
    s = t + 1 / 3 * -(v - 1), s < 0 && s++, s > 1 && s--, 6 * s < 1 ? l = a + (r - a) * 6 * s : 2 * s < 1 ? l = r : 3 * s < 2 ? l = a + (r - a) * (2 / 3 - s) * 6 : l = a, c[v] = l * 255;
  return c;
}, Y = function(e) {
  const t = e[0] / 60, i = e[1] / 100;
  let o = e[2] / 100;
  const r = Math.floor(t) % 6, s = t - Math.floor(t), l = 255 * o * (1 - i), a = 255 * o * (1 - i * s), c = 255 * o * (1 - i * (1 - s));
  switch (o *= 255, r) {
    case 0:
      return [o, c, l];
    case 1:
      return [a, o, l];
    case 2:
      return [l, o, c];
    case 3:
      return [l, a, o];
    case 4:
      return [c, l, o];
    default:
      return [o, l, a];
  }
};
var Z = Object.defineProperty, ee = Object.getOwnPropertyDescriptor, C = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? ee(t, i) : t, s = e.length - 1, l; s >= 0; s--)
    (l = e[s]) && (r = (o ? l(t, i, r) : l(r)) || r);
  return o && r && Z(t, i, r), r;
};
let g = class extends E {
  ready() {
    this.valueChanged(), this.changed();
  }
  valueMutated() {
    this.valueChanged(), this.changed();
  }
  rgbFromHsv() {
    const e = Y([
      this.hsv[0] * 360,
      this.hsv[1] * 100,
      this.hsv[2] * 100
    ]);
    this.rgba[0] = e[0] / 255, this.rgba[1] = e[1] / 255, this.rgba[2] = e[2] / 255;
  }
  rgbFromHsl() {
    const e = Q([
      this.hsl[0] * 360,
      this.hsl[1] * 100,
      this.hsl[2] * 100
    ]);
    this.rgba[0] = e[0] / 255, this.rgba[1] = e[1] / 255, this.rgba[2] = e[2] / 255;
  }
  valueFromRgb() {
    this.value.r = this.rgba[0], this.value.g = this.rgba[1], this.value.b = this.rgba[2];
  }
  valueChanged() {
    {
      const o = Object.keys(this.value);
      (o.indexOf("r") === -1 || o.indexOf("g") === -1 || o.indexOf("b") === -1) && console.warn("IoColor: Incorrect value type!");
    }
    const e = [this.value.r * 255, this.value.g * 255, this.value.b * 255], t = X(e), i = J(e);
    (t[0] === 0 || t[0] === 360) && (t[0] = this.hsv[0] * 360), (i[0] === 0 || i[0] === 360) && (i[0] = this.hsl[0] * 360), t[1] === 0 && (t[0] = this.hsv[0] * 360), i[1] === 0 && (i[0] = this.hsl[0] * 360), t[2] === 0 && (t[1] = this.hsv[1] * 100), (i[2] === 0 || i[2] === 100) && (i[0] = this.hsl[0] * 360, i[1] = this.hsl[1] * 100), this.rgba[0] = e[0] / 255, this.rgba[1] = e[1] / 255, this.rgba[2] = e[2] / 255, this.rgba[3] = this.value.a ?? 1, this.hsv[0] = t[0] / 360, this.hsv[1] = t[1] / 100, this.hsv[2] = t[2] / 100, this.hsl[0] = i[0] / 360, this.hsl[1] = i[1] / 100, this.hsl[2] = i[2] / 100, this.setProperties({
      rgba: this.rgba,
      hsv: this.hsv,
      hsl: this.hsl
    });
  }
};
C([
  d("throttled")
], g.prototype, "reactivity", 2);
C([
  d({ type: Object, init: { r: 1, g: 1, b: 1, a: 1 } })
], g.prototype, "value", 2);
C([
  d({ type: Array, init: [1, 1, 1, 1] })
], g.prototype, "rgba", 2);
C([
  d({ type: Array, init: [1, 1, 1] })
], g.prototype, "hsv", 2);
C([
  d({ type: Array, init: [1, 1, 1] })
], g.prototype, "hsl", 2);
g = C([
  u
], g);
var te = Object.defineProperty, re = Object.getOwnPropertyDescriptor, n = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? re(t, i) : t, s = e.length - 1, l; s >= 0; s--)
    (l = e[s]) && (r = (o ? l(t, i, r) : l(r)) || r);
  return o && r && te(t, i, r), r;
};
let b = class extends g {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: flex;
      }
    `
    );
  }
  _onValueInput(e) {
    const t = e.detail.value, i = JSON.stringify(this.value);
    switch (this.channel) {
      case "r":
        this.value.r = t;
        break;
      case "g":
        this.value.g = t;
        break;
      case "b":
        this.value.b = t;
        break;
      case "a":
        this.value.a = t;
        break;
      case "h":
        this.hsv[0] = t, this.rgbFromHsv(), this.valueFromRgb();
        break;
      case "s":
        this.hsv[1] = t, this.rgbFromHsv(), this.valueFromRgb();
        break;
      case "v":
        this.hsv[2] = t, this.rgbFromHsv(), this.valueFromRgb();
        break;
      case "l":
        this.hsl[2] = t, this.rgbFromHsl(), this.valueFromRgb();
        break;
      case "hs":
        this.hsv[0] = t[0], this.hsv[1] = t[1], this.rgbFromHsv(), this.valueFromRgb();
        break;
      case "sv":
        this.hsv[1] = t[0], this.hsv[2] = t[1], this.rgbFromHsv(), this.valueFromRgb();
        break;
      case "sl":
        this.hsl[1] = t[0], this.hsl[2] = t[1], this.rgbFromHsl(), this.valueFromRgb();
        break;
    }
    i !== JSON.stringify(this.value) && (this.value._isNode || this.dispatchMutation(this.value), this.dispatch("value-input", { property: "value", value: this.value }, !1));
  }
  changed() {
    const e = this.channel;
    ["r", "g", "b", "a", "h", "s", "v", "l", "hs", "sv", "sl"].indexOf(e) === -1 && console.warn("IoColorSlider: Incorrect channel value!", e);
    let t = null;
    switch (e) {
      case "r":
        t = oe();
        break;
      case "g":
        t = ie();
        break;
      case "b":
        t = se();
        break;
      case "a":
        t = le();
        break;
      case "h":
        t = ae();
        break;
      case "s":
        t = ne();
        break;
      case "v":
        t = ue();
        break;
      case "l":
        t = ce();
        break;
      case "hs":
        t = ve();
        break;
      case "sv":
        t = he();
        break;
      case "sl":
        t = de();
        break;
    }
    let i = 0, o = [0, 0, 0, 0], r = 0, s = 1, l = this.step;
    switch (this.channel) {
      case "r":
        i = this.value.r, o = [...this.rgba];
        break;
      case "g":
        i = this.value.g, o = [...this.rgba];
        break;
      case "b":
        i = this.value.b, o = [...this.rgba];
        break;
      case "a":
        i = this.value.a || 0, o = [...this.rgba];
        break;
      case "h":
        i = this.hsv[0], o = [...this.hsv, 1];
        break;
      case "s":
        i = this.hsv[1], o = [...this.hsv, 1];
        break;
      case "v":
        i = this.hsv[2], o = [...this.hsv, 1];
        break;
      case "l":
        i = this.hsl[2], o = [...this.hsl, 1];
        break;
      case "hs":
        i = [this.hsv[0], this.hsv[1]], o = [...this.hsv, 1], r = [r, r], s = [s, s], l = [l, l];
        break;
      case "sv":
        i = [this.hsv[1], this.hsv[2]], o = [...this.hsv, 1], r = [r, r], s = [s, s], l = [l, l];
        break;
      case "sl":
        i = [this.hsl[1], this.hsl[2]], o = [...this.hsl, 1], r = [r, r], s = [s, s], l = [l, l];
        break;
    }
    t.props = { id: e, value: i, min: r, max: s, step: l, vertical: this.vertical, color: o, "@value-input": this._onValueInput }, this.render([
      t
    ]);
  }
};
n([
  d({ type: Array, init: [0, 0, 0, 0] })
], b.prototype, "color", 2);
n([
  d({ type: Number, value: 0.01 })
], b.prototype, "step", 2);
n([
  d("a")
], b.prototype, "channel", 2);
n([
  d({ value: !1, reflect: !0 })
], b.prototype, "vertical", 2);
b = n([
  u
], b);
const I = function(e) {
  return b.vConstructor(e);
};
class p extends q {
  static get GlUtils() {
    return (
      /* glsl */
      `
      // Note: Implement in subclass!
      // TODO: Allow GlUtils to rewrite inherited functions!
      // vec3 getStartColor(vec2 uv) {}
      // vec3 getEndColor(vec2 uv) {}
      ${f.hue2rgb}
      ${f.hsv2rgb}
      ${f.hsl2rgb}

      vec3 paintHorizontalLine(vec3 dstCol, vec2 p, vec3 color) {
        float lineShape = lineHorizontal(p, io_borderWidth * 2.0);
        return compose(dstCol, vec4(color, lineShape));
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
      float valueInRange = (uValue - uMin) / (uMax - uMin);

      // Colors
      vec3 finalCol = io_bgColorInput.rgb;
      vec3 startCol = getStartColor(uv);
      vec3 gridCol = io_bgColorLight.rgb;
      vec3 endCol = getEndColor(uv);
      vec3 sliderCol = mix(startCol, endCol, uv.x);

      vec2 linePos = translate(size * uv, 0.0, size.y / 2.);
      finalCol = paintHorizontalLine(finalCol, linePos, sliderCol);

      // Grid
      float gridSize = size.x / abs((uMax - uMin) / uStep);
      float gridOffset = mod(uStep - uMin, uStep) / (uMax - uMin) * size.x;
      float gridShape = paintDerivativeGrid2D(translate(position, gridOffset, 0.0), vec2(gridSize, 0.0), io_borderWidth);
      if (size.x * uStep < 4.0) gridShape = 0.0;
      finalCol = compose(finalCol, vec4(sliderCol, gridShape * 0.25));

      // Slider
      float sliderShape = rectangle(position, vec2(size.x * valueInRange, size.y));
      finalCol = compose(finalCol, vec4(sliderCol, sliderShape));
      finalCol = compose(finalCol, vec4(io_bgColorInput.rgb, gridShape * sliderShape * 0.125));

      gl_FragColor = vec4(finalCol, 1.0);
    }`
    );
  }
  // TODO: temp fix
  valueMutated() {
  }
}
n([
  d({ type: Array, init: [0, 0, 0, 0] })
], p.prototype, "color", 2);
class y extends W {
  static get GlUtils() {
    return (
      /* glsl */
      `
      // Note: Implement in subclass!
      // TODO: Allow GlUtils to rewrite inherited functions!
      // vec3 getColor(vec2 uv) {}
      ${f.hue2rgb}
      ${f.hsv2rgb}
      ${f.hsl2rgb}
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
      vec3 finalCol = color_field(uv);
      vec3 gridCol = io_bgColorLight.rgb;
      vec3 sliderCol = color_field(uValue);

      // Grid
      vec2 gridSize = size / abs((uMax - uMin) / uStep);
      vec2 gridOffset = (uMax + uMin) / (uMax - uMin) * size / 2.;
      vec2 gridPosition = translate(position, -gridOffset);
      float gridShape = paintDerivativeGrid2D(gridPosition, gridSize, io_borderWidth);
      if (min(size.x * uStep.x, size.y * uStep.y) < 2.0) gridShape = 0.0;
      finalCol = compose(finalCol, vec4(gridCol, gridShape * 0.5));

      vec2 knobPos = uValue / (uMax - uMin) * size;
      finalCol = paintKnob(finalCol, gridPosition, knobPos, sliderCol);

      gl_FragColor = vec4(finalCol, 1.0);
    }`
    );
  }
  // TODO: temp fix
  valueMutated() {
  }
}
n([
  d({ type: Array, init: [0, 0, 0, 0] })
], y.prototype, "color", 2);
let P = class extends p {
  static get GlUtils() {
    return (
      /* glsl */
      `
      vec3 getStartColor(vec2 uv) {
        return vec3(uv.x, uColor[1], uColor[2]);
      }
      vec3 getEndColor(vec2 uv) {
        return vec3(uv.x, uColor[1], uColor[2]);
      }
    `
    );
  }
};
P = n([
  u
], P);
const oe = function(e) {
  return P.vConstructor(e);
};
let k = class extends p {
  static get GlUtils() {
    return (
      /* glsl */
      `
      vec3 getStartColor(vec2 uv) {
        return vec3(uColor[0], uv.x, uColor[2]);
      }
      vec3 getEndColor(vec2 uv) {
        return vec3(uColor[0], uv.x, uColor[2]);
      }
    `
    );
  }
};
k = n([
  u
], k);
const ie = function(e) {
  return k.vConstructor(e);
};
let O = class extends p {
  static get GlUtils() {
    return (
      /* glsl */
      `
      vec3 getStartColor(vec2 uv) {
        return vec3(uColor[0], uColor[1], uv.x);
      }
      vec3 getEndColor(vec2 uv) {
        return vec3(uColor[0], uColor[1], uv.x);
      }
    `
    );
  }
};
O = n([
  u
], O);
const se = function(e) {
  return O.vConstructor(e);
};
let z = class extends p {
  static get GlUtils() {
    return (
      /* glsl */
      `
      vec3 getStartColor(vec2 uv) {
        vec2 size = uVertical == 1 ? uSize.yx : uSize;
        vec2 position = size * (uv - vec2(0.0, 0.5));
        return mix(vec3(0.5), vec3(1.0), checkerX(position, io_fieldHeight / 4.0));
      }
      vec3 getEndColor(vec2 uv) {
        vec2 size = uVertical == 1 ? uSize.yx : uSize;
        vec2 position = size * (uv - vec2(0.0, 0.5));
        vec3 chkCol = mix(vec3(0.5), vec3(1.0), checkerX(position, io_fieldHeight / 4.0));
        return mix(chkCol, uColor.rgb, 1.0);
      }
    `
    );
  }
};
z = n([
  u
], z);
const le = function(e) {
  return z.vConstructor(e);
};
let M = class extends p {
  static get GlUtils() {
    return (
      /* glsl */
      `
      vec3 getStartColor(vec2 uv) {
        return hsv2rgb(vec3(uv.x, uColor[1], uColor[2]));
      }
      vec3 getEndColor(vec2 uv) {
        return hsv2rgb(vec3(uv.x, uColor[1], uColor[2]));
      }
    `
    );
  }
};
M = n([
  u
], M);
const ae = function(e) {
  return M.vConstructor(e);
};
let V = class extends p {
  static get GlUtils() {
    return (
      /* glsl */
      `
      vec3 getStartColor(vec2 uv) {
        return hsv2rgb(vec3(uColor[0], uv.x, uColor[2]));
      }
      vec3 getEndColor(vec2 uv) {
        return hsv2rgb(vec3(uColor[0], uv.x, uColor[2]));
      }
    `
    );
  }
};
V = n([
  u
], V);
const ne = function(e) {
  return V.vConstructor(e);
};
let D = class extends p {
  static get GlUtils() {
    return (
      /* glsl */
      `
      vec3 getStartColor(vec2 uv) {
        return hsv2rgb(vec3(uColor[0], uColor[1], uv.x));
      }
      vec3 getEndColor(vec2 uv) {
        return hsv2rgb(vec3(uColor[0], uColor[1], uv.x));
      }
    `
    );
  }
};
D = n([
  u
], D);
const ue = function(e) {
  return D.vConstructor(e);
};
let U = class extends p {
  static get GlUtils() {
    return (
      /* glsl */
      `
      vec3 getStartColor(vec2 uv) {
        return hsl2rgb(vec3(uColor[0], uColor[1], uv.x));
      }
      vec3 getEndColor(vec2 uv) {
        return hsl2rgb(vec3(uColor[0], uColor[1], uv.x));
      }
    `
    );
  }
};
U = n([
  u
], U);
const ce = function(e) {
  return U.vConstructor(e);
};
let F = class extends y {
  static get GlUtils() {
    return (
      /* glsl */
      `
      vec3 color_field(vec2 uv) {
        return hsv2rgb(vec3(uv, uColor[2]));
      }
    `
    );
  }
};
F = n([
  u
], F);
const ve = function(e) {
  return F.vConstructor(e);
};
let $ = class extends y {
  static get GlUtils() {
    return (
      /* glsl */
      `
      vec3 color_field(vec2 uv) {
        return hsv2rgb(vec3(uColor[0], uv));
      }
    `
    );
  }
};
$ = n([
  u
], $);
const he = function(e) {
  return $.vConstructor(e);
};
let G = class extends y {
  static get GlUtils() {
    return (
      /* glsl */
      `
      vec3 color_field(vec2 uv) {
        return hsl2rgb(vec3(uColor[0], uv));
      }
    `
    );
  }
};
G = n([
  u
], G);
const de = function(e) {
  return G.vConstructor(e);
};
var ge = Object.defineProperty, pe = Object.getOwnPropertyDescriptor, L = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? pe(t, i) : t, s = e.length - 1, l; s >= 0; s--)
    (l = e[s]) && (r = (o ? l(t, i, r) : l(r)) || r);
  return o && r && ge(t, i, r), r;
};
let S = class extends g {
  static get Style() {
    return (
      /* css */
      `
    :host {
      display: flex;
      flex-direction: row;
      border: var(--io_border);
      border-color: var(--io_borderColorOutset);
      background-color: var(--io_bgColorLight);
      padding: var(--io_spacing2);
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing2));
    }
    :host:not([expanded]) {
      display: none;
    }
    :host > *:not(:last-child) {
      margin: 0 var(--io_spacing2) 0 0;
    }
    `
    );
  }
  static get Listeners() {
    return {
      keydown: "onKeydown",
      "io-focus-to": "onIoFocusTo"
    };
  }
  onKeydown(e) {
    (e.key === "Escape" || e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.expanded = !1);
  }
  onIoFocusTo(e) {
    const t = e.detail.source, i = e.detail.command, o = Array.from(this.querySelectorAll("[tabindex]")), r = Array.from(o).indexOf(t);
    i === "ArrowDown" || i === "ArrowLeft" && r === 0 ? (o[o.length - 1].focus(), e.stopPropagation()) : (i === "ArrowUp" || i === "ArrowRight" && r === o.length - 1) && (o[0].focus(), e.stopPropagation());
  }
  onValueInput() {
    this.dispatch("value-input", { property: "value", value: this.value }, !0);
  }
  changed() {
    this.render([
      I({ value: this.value, channel: "sv", "@value-input": this.onValueInput }),
      I({ value: this.value, channel: "h", vertical: !0, "@value-input": this.onValueInput }),
      this.value.a !== void 0 ? I({ value: this.value, channel: "a", "@value-input": this.onValueInput, vertical: !0 }) : null
    ]);
  }
};
L([
  d({ value: !1, reflect: !0 })
], S.prototype, "expanded", 2);
S = L([
  u
], S);
const h = new S();
setTimeout(() => {
  j.appendChild(h);
}, 100);
var be = Object.getOwnPropertyDescriptor, fe = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? be(t, i) : t, s = e.length - 1, l; s >= 0; s--)
    (l = e[s]) && (r = l(r) || r);
  return r;
};
let H = class extends g {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: inline-block;
        min-width: var(--io_fieldHeight);
        height: var(--io_fieldHeight);
        background-color: white;
        background-image: linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%);
        background-size: 12px 12px;
        background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
        overflow: visible;
      }
      :host > div { 
        width: 100%;
        height: 100%;
      }
    `
    );
  }
  valueChanged() {
    super.valueChanged(), this.render([
      B({ style: { "background-color": `rgba(${this.rgba[0] * 255},${this.rgba[1] * 255}, ${this.rgba[2] * 255}, ${this.rgba[3]})` } })
    ]);
  }
};
H = fe([
  u
], H);
const Ce = function(e) {
  return H.vConstructor(e);
};
var xe = Object.defineProperty, me = Object.getOwnPropertyDescriptor, R = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? me(t, i) : t, s = e.length - 1, l; s >= 0; s--)
    (l = e[s]) && (r = (o ? l(t, i, r) : l(r)) || r);
  return o && r && xe(t, i, r), r;
};
let x = class extends E {
  static get Style() {
    return (
      /* css */
      `
      :host {
        position: relative;
        height: var(--io_fieldHeight);
        border: var(--io_border);
        border-color: var(--io_borderColorInset);
        border-radius: var(--io_borderRadius);
        overflow: hidden;
      }
      :host:focus {
        @apply --io_focus;
      }
      :host > io-color-swatch {
        width: 100%;
        height: 100%;
      }
    `
    );
  }
  static get Listeners() {
    return {
      click: "onClick",
      keydown: "onKeydown"
    };
  }
  get expanded() {
    return h.expanded && h.value === this.value;
  }
  ready() {
    this.valueChanged();
  }
  onClick() {
    this.expanded || this.expand();
  }
  onKeydown(e) {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault(), this.expanded || this.expand();
        break;
      default:
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"].includes(e.key) && (e.preventDefault(), this.dispatch("io-focus-to", { source: this, command: e.key }, !0));
    }
  }
  onValueSet() {
    this.dispatch("value-input", { property: "value", value: this.value }, !0);
  }
  onPanelCollapse() {
    this.expanded || (h.removeEventListener("value-input", this.onValueSet), h.removeEventListener("expanded-changed", this.onPanelCollapse));
  }
  expand() {
    h.value = this.value, h.expanded = !0, h.addEventListener("value-input", this.onValueSet), h.addEventListener("expanded-changed", this.onPanelCollapse), T(h, this, "right"), h.firstChild?.firstChild?.focus();
  }
  collapse() {
    h.expanded = !1, h.value = { r: 1, g: 1, b: 1, a: 1 };
  }
  valueChanged() {
    this.render([
      Ce({ value: this.value })
    ]);
  }
};
R([
  d({ value: { r: 1, g: 1, b: 1, a: 1 } })
], x.prototype, "value", 2);
R([
  K(0)
], x.prototype, "tabIndex", 2);
x = R([
  u
], x);
const Se = function(e) {
  return x.vConstructor(e);
};
var ye = Object.getOwnPropertyDescriptor, _e = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? ye(t, i) : t, s = e.length - 1, l; s >= 0; s--)
    (l = e[s]) && (r = l(r) || r);
  return r;
};
let A = class extends g {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: flex;
        flex: 0 1 auto;
      }
      :host > io-number {
        flex: 1 0 0;
      }
      :host > io-number#r {
        border-bottom-color: var(--io_bgColorRed);
      }
      :host > io-number#g {
        border-bottom-color: var(--io_bgColorGreen);
      }
      :host > io-number#b {
        border-bottom-color: var(--io_bgColorBlue);
      }
      :host > io-number#a {
        border-bottom-color: var(--io_color);
      }
      :host > io-color-picker {
        flex-shrink: 0;
      }
      :host > *:not(:last-child) {
        margin-right: var(--io_spacing);
      }
    `
    );
  }
  _onNumberValueInput(e) {
    e.stopPropagation();
    const t = e.composedPath()[0];
    ["r", "g", "b"].includes(t.id) && (this.value[t.id] = e.detail.value), this.dispatch("value-input", { property: "value", value: this.value }, !1);
  }
  changed() {
    this.render([
      // Consider removing global id collisions.
      m({ id: "r", value: this.value.r, min: 0, max: 1, step: 1e-3, ladder: !0, "@value-input": this._onNumberValueInput }),
      m({ id: "g", value: this.value.g, min: 0, max: 1, step: 1e-3, ladder: !0, "@value-input": this._onNumberValueInput }),
      m({ id: "b", value: this.value.b, min: 0, max: 1, step: 1e-3, ladder: !0, "@value-input": this._onNumberValueInput }),
      this.value.a !== void 0 ? m({ id: "a", value: this.value.a, min: 0, max: 1, step: 1e-4, ladder: !0, "@value-input": this._onNumberValueInput }) : null,
      Se({ id: "swatch", value: this.value, "@value-input": this._onNumberValueInput })
    ]);
  }
};
A = _e([
  u
], A);
const ke = function(e) {
  return A.vConstructor(e);
};
export {
  g as IoColorBase,
  h as IoColorPanelSingleton,
  x as IoColorPicker,
  A as IoColorRgba,
  b as IoColorSlider,
  z as IoColorSliderA,
  O as IoColorSliderB,
  k as IoColorSliderG,
  M as IoColorSliderH,
  F as IoColorSliderHs,
  U as IoColorSliderL,
  P as IoColorSliderR,
  V as IoColorSliderS,
  G as IoColorSliderSl,
  $ as IoColorSliderSv,
  D as IoColorSliderV,
  H as IoColorSwatch,
  Q as hsl2rgb,
  Y as hsv2rgb,
  Se as ioColorPicker,
  ke as ioColorRgba,
  I as ioColorSlider,
  le as ioColorSliderA,
  se as ioColorSliderB,
  ie as ioColorSliderG,
  ae as ioColorSliderH,
  ve as ioColorSliderHs,
  ce as ioColorSliderL,
  oe as ioColorSliderR,
  ne as ioColorSliderS,
  de as ioColorSliderSl,
  he as ioColorSliderSv,
  ue as ioColorSliderV,
  Ce as ioColorSwatch,
  J as rgb2hsl,
  X as rgb2hsv
};
//# sourceMappingURL=index.js.map
