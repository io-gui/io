import { ReactiveProperty as a, Property as d, IoElement as M, span as v, Register as m, IoOverlaySingleton as B, ThemeSingleton as F } from "@io-gui/core";
import { ioIcon as C } from "@io-gui/icons";
var U = Object.defineProperty, X = Object.getOwnPropertyDescriptor, u = (e, t, o, r) => {
  for (var i = r > 1 ? void 0 : r ? X(t, o) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (i = (r ? n(t, o, i) : n(i)) || i);
  return r && i && U(t, o, i), i;
};
let l = class extends M {
  static get Style() {
    return (
      /* css */
      `
      :host {
        cursor: pointer;
        height: var(--io_fieldHeight);
        min-height: var(--io_fieldHeight);
        line-height: var(--io_lineHeight);
        border: var(--io_border);
        border-color: transparent;
        border-radius: var(--io_borderRadius);
        padding: var(--io_spacing) calc(var(--io_spacing3) + var(--io_borderWidth));
        color: var(--io_color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: var(--io_fontSize);
        text-size-adjust: 100%;
        @apply --unselectable;
      }
      :host:focus {
        text-overflow: inherit;
        @apply --io_focus;
      }
      :host[hidden] {
        display: none;
      }
      :host[disabled] {
        opacity: 0.5;
      }
      :host[pressed] {
        border-color: var(--io_borderColorInset) !important;
        box-shadow: var(--io_shadowInset) !important;
      }
      :host span {
        height: var(--io_lineHeight);
        vertical-align: top;
      }
      :host[appearance=neutral] {
        color: var(--io_color);
        background-color: transparent;
      }
      :host[appearance=inset] {
        color: var(--io_colorInput);
        background-color: var(--io_bgColorInput);
        border-color: var(--io_borderColorInset);
        padding-top: calc(var(--io_spacing) + 0.05em);
        padding-bottom: calc(var(--io_spacing) - 0.05em);
        box-shadow: var(--io_shadowInset);
      }
      :host[appearance=outset] {
        border-color: var(--io_borderColorOutset);
        background-image: var(--io_gradientOutset);
        box-shadow: var(--io_shadowOutset);
      }
      :host.red,
      :host[invalid] {
        color: var(--io_colorWhite);
        background-color: var(--io_bgColorRed);
        border-color: var(--io_borderColorRed);
      }
      :host.green {
        color: var(--io_colorWhite);
        background-color: var(--io_bgColorGreen);
        border-color: var(--io_borderColorGreen);
      }
      :host.blue,
      :host[selected] {
        color: var(--io_colorWhite);
        background-color: var(--io_bgColorBlue);
        border-color: var(--io_borderColorBlue);
      }
    `
    );
  }
  static get Listeners() {
    return {
      focus: "onFocus",
      pointerdown: "onPointerdown",
      touchstart: ["onTouchstart", { passive: !1 }],
      click: "onClick"
    };
  }
  constructor(e = {}) {
    super(e);
  }
  onFocus(e) {
    this.addEventListener("blur", this.onBlur), this.addEventListener("keydown", this.onKeydown), this.addEventListener("keyup", this.onKeyup);
  }
  onBlur(e) {
    this.removeEventListener("blur", this.onBlur), this.removeEventListener("keydown", this.onKeydown), this.removeEventListener("keyup", this.onKeyup);
  }
  onPointerdown(e) {
    e.stopPropagation(), this.setPointerCapture(e.pointerId), this.addEventListener("pointermove", this.onPointermove), this.addEventListener("pointerleave", this.onPointerleave), this.addEventListener("pointerup", this.onPointerup), this.addEventListener("pointercancel", this.onPointercancel), this.pressed = !0;
  }
  onPointermove(e) {
    e.stopPropagation();
  }
  onPointercancel(e) {
    e.stopPropagation(), this.releasePointerCapture(e.pointerId), this.removeEventListener("pointermove", this.onPointermove), this.removeEventListener("pointerleave", this.onPointerleave), this.removeEventListener("pointerup", this.onPointerup), this.removeEventListener("pointercancel", this.onPointercancel), this.pressed = !1;
  }
  onPointerleave(e) {
    e.stopPropagation(), this.removeEventListener("pointermove", this.onPointermove), this.removeEventListener("pointerleave", this.onPointerleave), this.removeEventListener("pointerup", this.onPointerup), this.removeEventListener("pointercancel", this.onPointercancel), this.pressed = !1;
  }
  onPointerup(e) {
    e.stopPropagation(), this.releasePointerCapture(e.pointerId), this.removeEventListener("pointermove", this.onPointermove), this.removeEventListener("pointerleave", this.onPointerleave), this.removeEventListener("pointerup", this.onPointerup), this.removeEventListener("pointercancel", this.onPointercancel), this.pressed = !1;
  }
  onTouchstart(e) {
    e.stopPropagation(), this.addEventListener("touchmove", this.onTouchmove, { passive: !1 }), this.addEventListener("touchend", this.onTouchend), this.focus();
  }
  onTouchmove(e) {
    e.stopPropagation();
  }
  onTouchend(e) {
    e.stopPropagation(), this.removeEventListener("touchmove", this.onTouchmove), this.removeEventListener("touchend", this.onTouchend);
  }
  inputValue(e) {
    if (this.value !== e || typeof this.value == "object") {
      const t = this.value;
      this.setProperty("value", e), this.dispatch("value-input", { value: e, oldValue: t }, !1);
    }
  }
  onClick(e) {
  }
  onKeydown(e) {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault(), this.onClick();
        break;
      default:
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab", "Home", "End", "PageUp", "PageDown"].includes(e.key) && (e.preventDefault(), this.dispatch("io-focus-to", { source: this, command: e.key }, !0));
    }
  }
  onKeyup(e) {
  }
  getCaretPosition() {
    let e = 0;
    const t = window.getSelection();
    if (t && t.rangeCount) {
      const o = t.getRangeAt(0), r = o.toString().length, i = o.cloneRange();
      i.selectNodeContents(this), i.setEnd(o.endContainer, o.endOffset), e = i.toString().length - r;
    }
    return e;
  }
  setCaretPosition(e = 0) {
    const t = window.getSelection();
    this._flattenTextNode(this);
    const o = this._textNode;
    if (t) {
      const r = document.createRange();
      r.setStart(o, Math.max(0, Math.min(e, o.length))), r.collapse(!0), t.removeAllRanges(), t.addRange(r);
    }
  }
  selectAll() {
    const e = window.getSelection();
    this._flattenTextNode(this);
    const t = this._textNode;
    if (e && t) {
      const o = document.createRange();
      o.selectNodeContents(t), e.removeAllRanges(), e.addRange(o);
    }
  }
  labelChanged() {
    this.label ? this.setAttribute("aria-label", this.label) : this.removeAttribute("aria-label");
  }
  selectedChanged() {
    this.selected ? this.setAttribute("aria-selected", "true") : this.removeAttribute("aria-selected");
  }
  invalidChanged() {
    this.invalid ? this.setAttribute("aria-invalid", "true") : this.removeAttribute("aria-invalid");
  }
  disabledChanged() {
    this.inert = this.disabled, this.disabled ? this.setAttribute("aria-disabled", "true") : this.removeAttribute("aria-disabled");
  }
  changed() {
    this.render([
      this.icon ? C({ value: this.icon }) : null,
      this.label ? v(this.label) : null,
      this.value !== void 0 ? v(String(this.value)) : null
    ]);
  }
};
u([
  a({ value: "" })
], l.prototype, "value", 2);
u([
  a({ type: String, value: "" })
], l.prototype, "icon", 2);
u([
  a({ type: String, value: "", reflect: !0 })
], l.prototype, "label", 2);
u([
  a({ value: !1, type: Boolean, reflect: !0 })
], l.prototype, "selected", 2);
u([
  a({ value: !1, type: Boolean, reflect: !0 })
], l.prototype, "invalid", 2);
u([
  a({ value: !1, type: Boolean, reflect: !0 })
], l.prototype, "disabled", 2);
u([
  a({ value: !1, type: Boolean, reflect: !0 })
], l.prototype, "pressed", 2);
u([
  a({ value: "neutral", reflect: !0 })
], l.prototype, "appearance", 2);
u([
  a({ value: "", type: String, reflect: !0 })
], l.prototype, "pattern", 2);
u([
  d(!1)
], l.prototype, "spellcheck", 2);
u([
  d(0)
], l.prototype, "tabIndex", 2);
l = u([
  m
], l);
const ue = function(e) {
  return l.vConstructor(e);
};
var q = Object.defineProperty, J = Object.getOwnPropertyDescriptor, S = (e, t, o, r) => {
  for (var i = r > 1 ? void 0 : r ? J(t, o) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (i = (r ? n(t, o, i) : n(i)) || i);
  return r && i && q(t, o, i), i;
};
let g = class extends l {
  static get Style() {
    return (
      /* css */
      `
      :host {
        padding: var(--io_spacing);
      }
    `
    );
  }
  constructor(e = {}) {
    super(e);
  }
  onClick() {
    this.toggle(), this.dispatch("io-boolean-clicked", { value: this.value }, !0);
  }
  toggle() {
    this.inputValue(!this.value);
  }
  ready() {
    this.valueChanged(), this.changed();
  }
  valueChanged() {
    this.invalid = typeof this.value != "boolean", this.setAttribute("aria-checked", String(!!this.value));
  }
  changed() {
    const e = this.value ? this.true : this.false;
    this.render([
      this.icon ? C({ value: this.icon }) : null,
      this.label ? v(this.label + ":") : null,
      e ? e.includes("io:") ? C({ value: e }) : v(e) : null
    ]);
  }
};
S([
  a({ value: !1, type: Boolean, reflect: !0 })
], g.prototype, "value", 2);
S([
  a({ value: "true", type: String })
], g.prototype, "true", 2);
S([
  a({ value: "false", type: String })
], g.prototype, "false", 2);
S([
  d("checkbox")
], g.prototype, "role", 2);
g = S([
  m
], g);
const pe = function(e) {
  return g.vConstructor(e);
};
var G = Object.defineProperty, Q = Object.getOwnPropertyDescriptor, L = (e, t, o, r) => {
  for (var i = r > 1 ? void 0 : r ? Q(t, o) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (i = (r ? n(t, o, i) : n(i)) || i);
  return r && i && G(t, o, i), i;
};
let y = class extends l {
  static get Style() {
    return (
      /* css */
      `
      :host {
        text-align: center;
        color: var(--io_colorStrong);
      }
      :host > io-icon {
        margin-right: var(--io_spacing);
      }
      :host > span {
        vertical-align: top;
      }
    `
    );
  }
  constructor(e = {}) {
    super(e);
  }
  onPointerdown(e) {
    e.preventDefault(), super.onPointerdown(e);
  }
  onKeydown(e) {
    super.onKeydown(e), (e.key === "Enter" || e.key === " ") && (this.pressed = !0);
  }
  onKeyup(e) {
    super.onKeyup(e), this.pressed = !1;
  }
  onClick(e) {
    typeof this.action == "function" && this.action(this.value), this.dispatch("io-button-clicked", { value: this.value }, !0);
  }
  ready() {
    this.changed();
  }
  changed() {
    this.setAttribute("aria-pressed", String(this.pressed)), this.render([
      this.icon ? C({ value: this.icon }) : null,
      this.label ? v(this.label) : null
    ]);
  }
};
L([
  a({ value: void 0 })
], y.prototype, "value", 2);
L([
  a()
], y.prototype, "action", 2);
L([
  a({ value: "outset", type: String, reflect: !0 })
], y.prototype, "appearance", 2);
L([
  d("button")
], y.prototype, "role", 2);
y = L([
  m
], y);
const de = function(e) {
  return y.vConstructor(e);
};
var Y = Object.defineProperty, Z = Object.getOwnPropertyDescriptor, A = (e, t, o, r) => {
  for (var i = r > 1 ? void 0 : r ? Z(t, o) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (i = (r ? n(t, o, i) : n(i)) || i);
  return r && i && Y(t, o, i), i;
};
let _ = class extends l {
  static get Style() {
    return (
      /* css */
      `
      :host {
        pointer-events: all;
        display: inline-block;
        cursor: ew-resize;
        text-align: center;
        background-color: var(--io_bgColorStrong) !important;
        color: var(--io_color);
        align-self: stretch;
        touch-action: none;
        width: 6em;
      }
      :host:focus {
        background-color: var(--io_bgColor) !important;
      }
      /* TODO: use icons */
      :host:before {
        float: left;
        content: '<';
        opacity: 0.25;
      }
      :host:after {
        float: right;
        content: '>';
        opacity: 0.25;
      }
    `
    );
  }
  constructor(e) {
    super(e);
  }
  onKeydown(e) {
    let t = 0;
    switch (e.key) {
      case "Enter":
      case "Escape":
      case " ":
        this.dispatch("ladder-step-collapse", {}, !0);
        break;
      case "ArrowLeft":
      case "Backspace":
        e.preventDefault(), t = this.value * -1;
        break;
      case "ArrowUp":
        e.preventDefault(), this.dispatch("io-focus-to", { source: this, command: e.key }, !0);
        break;
      case "ArrowRight":
        e.preventDefault(), t = this.value * 1;
        break;
      case "ArrowDown":
        e.preventDefault(), this.dispatch("io-focus-to", { source: this, command: e.key }, !0);
        break;
    }
    t !== 0 && this.dispatch("ladder-step-change", { step: Number(t.toFixed(5)), round: e.shiftKey }, !0);
  }
  onPointerdown(e) {
    this.setPointerCapture(e.pointerId), this.addEventListener("pointermove", this.onPointermove), this.addEventListener("pointerup", this.onPointerup), this.startX = e.clientX;
  }
  onPointermove(e) {
    const t = e.clientX - this.startX;
    if (Math.abs(t) > 5) {
      const o = Math.pow(t / 5, 2) * t < 0 ? -1 : 1, r = t > 0 ? Math.floor(o) : Math.ceil(o), i = this.value * r;
      this.startX = e.clientX, this.dispatch("ladder-step-change", { step: Number(i.toFixed(5)), round: e.shiftKey }, !0);
    }
  }
  onPointerup(e) {
    this.releasePointerCapture(e.pointerId), this.removeEventListener("pointermove", this.onPointermove), this.removeEventListener("pointerup", this.onPointerup), this.dispatch("ladder-step-collapse", {}, !0);
  }
  ready() {
    this.changed();
  }
  changed() {
    this.render([v(this.label)]), this.setAttribute("aria-label", this.label), this.setAttribute("aria-valuestep", this.label);
  }
};
A([
  a({ value: 1, type: Number })
], _.prototype, "value", 2);
A([
  a({ value: "", type: String })
], _.prototype, "label", 2);
A([
  d("spinbutton")
], _.prototype, "role", 2);
_ = A([
  m
], _);
const f = function(e) {
  return _.vConstructor(e);
};
var ee = Object.defineProperty, te = Object.getOwnPropertyDescriptor, E = (e, t, o, r) => {
  for (var i = r > 1 ? void 0 : r ? te(t, o) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (i = (r ? n(t, o, i) : n(i)) || i);
  return r && i && ee(t, o, i), i;
};
let w = class extends M {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: flex;
        flex-direction: column;
        position: absolute;
        pointer-events: none;
        box-shadow: unset;
        @apply --unselectable;
      }
      :host:not([expanded]) {
        visibility: hidden;
      }
      :host > io-number-ladder-step {
        box-shadow: var(--io_shadow);
      }
      :host > .io-up1,
      :host > .io-up2,
      :host > .io-up3,
      :host > .io-up4 {
        margin-bottom: var(--io_borderWidth);
        box-shadow: 0px -2px 6px var(--io_shadowColor), 0 -1px 3px var(--io_shadowColor);
      }
      :host > .io-down1,
      :host > .io-down2,
      :host > .io-down3,
      :host > .io-down4 {
        margin-top: var(--io_borderWidth);
        box-shadow: 0px 2px 6px var(--io_shadowColor), 0 1px 3px var(--io_shadowColor);
      }
      :host > .io-up1,
      :host > .io-down1{
        z-index: 4;
      }
      :host > .io-up2,
      :host > .io-down2 {
        z-index: 3;
      }
      :host > .io-up3,
      :host > .io-down3 {
        z-index: 2;
      }
      :host > .io-up4,
      :host > .io-down4 {
        z-index: 1;
      }
      :host > io-number-ladder-step:focus {
        background-color: var(--io_bgColorStrong);
        border-color: var(--io_colorBlue);
      }
      :host > .io-number-ladder-empty {
        height: var(--io_fieldHeight);
      }
      :host > .io-number-ladder-center {
        height: calc(1.5 * var(--io_fieldHeight));
      }
    `
    );
  }
  static get Listeners() {
    return {
      "ladder-step-change": "_onLadderStepChange",
      "ladder-step-collapse": "onLadderStepCollapse",
      "io-focus-to": "onIoFocusTo"
    };
  }
  get value() {
    return this.src ? this.src.value : 0;
  }
  get min() {
    return this.src ? this.src.min : -1 / 0;
  }
  get max() {
    return this.src ? this.src.max : 1 / 0;
  }
  get step() {
    return this.src ? this.src.step : 1e-4;
  }
  get conversion() {
    return this.src ? this.src.conversion : 1;
  }
  constructor(e = {}) {
    super(e);
  }
  onIoFocusTo(e) {
    const t = e.detail.source, o = e.detail.command;
    this.src && (o === "ArrowDown" && t === this.querySelector(".io-up1") || o === "ArrowUp" && t === this.querySelector(".io-down1")) && (e.stopPropagation(), this.src.focus(), this.src.setCaretPosition(this.src.textNode.length));
  }
  _onLadderStepChange(e) {
    const t = this.src;
    if (t) {
      const o = e.detail.step, r = e.detail.round ? Math.round(this.value / o) * o : this.value;
      let i = Math.min(this.max, Math.max(this.min, r + o));
      i = Number(i.toFixed(5)), t.inputValue(i);
    }
  }
  onLadderStepCollapse() {
    this.setProperty("expanded", !1);
  }
  expandedChanged() {
    if (this.expanded) {
      if (this.src) {
        const e = this.src.getBoundingClientRect(), t = this.getBoundingClientRect(), o = B.getBoundingClientRect();
        this.style.top = e.bottom - o.top + "px", this.style.left = e.left - o.left + "px", this.style.marginTop = -(t.height / 2 + F.lineHeight / 2 + F.spacing) + "px";
      }
    } else
      setTimeout(() => {
        this.src?.setCaretPosition(this.src.textNode.length);
      }), this.removeAttribute("style");
    this.dispatch("expanded", { value: this.expanded }, !0);
  }
  changed() {
    const e = this.max - this.min, t = v({ class: "io-number-ladder-empty" });
    let o = this.step / 1e4;
    for (; o < 0.1; ) o = o * 10;
    const r = 1e4 * o, i = 1e3 * o, s = 100 * o, n = 10 * o, D = 1 * o, O = 0.1 * o, T = 0.01 * o, I = 1e-3 * o, K = Number((r * this.conversion).toFixed(6)), R = Number((i * this.conversion).toFixed(6)), $ = Number((s * this.conversion).toFixed(6)), j = Number((n * this.conversion).toFixed(6)), H = Number((D * this.conversion).toFixed(6)), W = Number((O * this.conversion).toFixed(6)), z = Number((T * this.conversion).toFixed(6)), V = Number((I * this.conversion).toFixed(6));
    this.render([
      e >= r ? f({ class: "io-up4", value: r, label: String(K) }) : t,
      e >= i ? f({ class: "io-up3", value: i, label: String(R) }) : t,
      e >= s ? f({ class: "io-up2", value: s, label: String($) }) : t,
      e >= n ? f({ class: "io-up1", value: n, label: String(j) }) : t,
      v({ class: "io-number-ladder-center" }),
      this.step <= D ? f({ class: "io-down1", value: D, label: String(H) }) : t,
      this.step <= O ? f({ class: "io-down2", value: O, label: String(W) }) : t,
      this.step <= T ? f({ class: "io-down3", value: T, label: String(z) }) : t,
      this.step <= I ? f({ class: "io-down4", value: I, label: String(V) }) : t
    ]), this.setAttribute("aria-valuemin", this.min), this.setAttribute("aria-valuemax", this.max), this.setAttribute("aria-valuenow", this.value), this.setAttribute("aria-valuestep", this.step), this.setAttribute("aria-invalid", typeof this.value != "number" || isNaN(this.value) ? "true" : !1);
    const P = this.querySelectorAll("io-number-ladder-step");
    for (let N = P.length; N--; )
      P[N].setAttribute("aria-valuemin", String(this.min)), P[N].setAttribute("aria-valuemax", String(this.max)), P[N].setAttribute("aria-valuenow", String(this.value)), P[N].changed();
  }
};
E([
  a({ value: void 0, type: M, init: null })
], w.prototype, "src", 2);
E([
  a({ value: !1, type: Boolean, reflect: !0 })
], w.prototype, "expanded", 2);
E([
  d("listbox")
], w.prototype, "role", 2);
w = E([
  m
], w);
const p = new w();
setTimeout(() => {
  B.appendChild(p);
}, 100);
var oe = Object.defineProperty, ie = Object.getOwnPropertyDescriptor, c = (e, t, o, r) => {
  for (var i = r > 1 ? void 0 : r ? ie(t, o) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (i = (r ? n(t, o, i) : n(i)) || i);
  return r && i && oe(t, o, i), i;
};
let h = class extends l {
  static get Style() {
    return (
      /* css */
      `
      :host {
        cursor: text;
        user-select: text;
        -webkit-user-select: text;
        -webkit-touch-callout: default;
        font-family: monospace;
      }
      :host[placeholder]:empty:before {
        content: attr(placeholder);
        visibility: visible;
        color: var(--io_colorInput);
        padding: 0 calc(var(--io_spacing) + var(--io_borderWidth));
        opacity: 0.5;
      }
    `
    );
  }
  constructor(e = {}) {
    super(e);
  }
  get textNode() {
    return this._flattenTextNode(this), this._textNode.nodeValue;
  }
  set textNode(e) {
    this._flattenTextNode(this), this._textNode.nodeValue = String(e);
  }
  onBlur(e) {
    super.onBlur(e), this._setFromTextNode(), this.scrollTop = 0, this.scrollLeft = 0, setTimeout(() => {
      document.activeElement.parentElement !== p && (p.expanded = !1);
    });
  }
  onPointerdown(e) {
    e.pointerType === "touch" && e.preventDefault(), this.addEventListener("pointermove", this.onPointermove), this.addEventListener("pointerup", this.onPointerup), document.activeElement === this && e.button;
  }
  onPointerup(e) {
    this.removeEventListener("pointermove", this.onPointermove), this.removeEventListener("pointerup", this.onPointerup), this.ladder || e.button === 1 ? (e.pointerType === "touch" ? (e.preventDefault(), document.activeElement.blur()) : document.activeElement !== this && (this.focus(), this.setCaretPosition(this.textNode.length)), this.expandLadder()) : document.activeElement !== this && (this.focus(), this.setCaretPosition(this.textNode.length));
  }
  expandLadder() {
    p.src = this, p.expanded = !0;
  }
  collapseLadder() {
    p.expanded = !1;
  }
  onKeydown(e) {
    const t = window.getSelection().getRangeAt(0), o = t.startOffset, r = t.endOffset, i = this.childNodes[0] ? this.childNodes[0].length : 0, s = t.startContainer === t.endContainer && (t.startContainer === this.childNodes[0] || t.startContainer === this);
    switch (e.key) {
      case "Escape":
      case "Enter":
      case " ":
        e.preventDefault(), this._setFromTextNode(), re() && this.blur();
        break;
      case "Home":
        e.preventDefault(), this.textNode = String(this.min), this._setFromTextNode();
        break;
      case "End":
        e.preventDefault(), this.textNode = String(this.max), this._setFromTextNode();
        break;
      case "ArrowLeft":
        (e.ctrlKey || s && o === r && o === 0) && (e.preventDefault(), this.dispatch("io-focus-to", { source: this, command: e.key }, !0));
        break;
      case "ArrowUp":
        if (p.expanded) {
          e.preventDefault();
          const n = p.querySelector(".io-up1");
          n && n.focus();
        } else (e.ctrlKey || s && o === r && o === 0) && (e.preventDefault(), this.dispatch("io-focus-to", { source: this, command: e.key }, !0));
        break;
      case "ArrowRight":
        (e.ctrlKey || s && o === r && o === i) && (e.preventDefault(), this.dispatch("io-focus-to", { source: this, command: e.key }, !0));
        break;
      case "ArrowDown":
        if (p.expanded) {
          e.preventDefault();
          const n = p.querySelector(".io-down1");
          n && n.focus();
        } else (e.ctrlKey || s && o === r && o === i) && (e.preventDefault(), this.dispatch("io-focus-to", { source: this, command: e.key }, !0));
        break;
    }
  }
  onKeyup(e) {
    if (e.key === "Control" || e.key === "Shift" ? p.expanded ? this.collapseLadder() : this.expandLadder() : (e.key === "Escape" || e.key === "Enter" || e.key === " ") && this.collapseLadder(), this.live) {
      const t = this.getCaretPosition();
      this._setFromTextNode(), this.setCaretPosition(t);
    }
  }
  _setFromTextNode() {
    let e = this.textNode.trim().replace(",", "."), t = Number(e) / this.conversion;
    t = Math.min(this.max, Math.max(this.min, t)), t = Math.round(t / this.step) * this.step;
    const o = Math.max(0, Math.min(100, -Math.floor(Math.log(this.step) / Math.LN10)));
    t = Number(t.toFixed(o)), isNaN(t) ? (this._reactiveProperties.get("invalid").value = !0, this.setAttribute("invalid", "true"), this.setAttribute("aria-invalid", "true")) : (this._reactiveProperties.get("invalid").value = !1, this.removeAttribute("invalid"), this.removeAttribute("aria-invalid"), this.inputValue(t));
  }
  ready() {
    this.disabledChanged(), this.changed();
  }
  changed() {
    this.setAttribute("aria-valuenow", this.value), this.setAttribute("aria-valuemin", this.min), this.setAttribute("aria-valuemax", this.max), this.setAttribute("aria-valuestep", this.step), typeof this.value != "number" || isNaN(this.value) ? (this.setAttribute("invalid", "true"), this.setAttribute("aria-invalid", "true")) : (this.removeAttribute("invalid"), this.removeAttribute("aria-invalid"));
    let e = this.value, t;
    if (typeof e == "number" && !isNaN(e)) {
      e *= this.conversion;
      let o = -Math.floor(Math.log(this.step * this.conversion) / Math.LN10);
      o = Math.max(0, Math.min(100, o)), e = Number(e.toFixed(o)), t = String(e);
    } else
      t = "NaN";
    this.setAttribute("value", t), this.setAttribute("positive", this.value >= 0), this.textNode = t;
  }
};
c([
  a({ value: 0, type: Number })
], h.prototype, "value", 2);
c([
  a({ value: !1, type: Boolean })
], h.prototype, "live", 2);
c([
  a({ value: 1, type: Number })
], h.prototype, "conversion", 2);
c([
  a({ value: 1e-4, type: Number })
], h.prototype, "step", 2);
c([
  a({ value: -1 / 0, type: Number })
], h.prototype, "min", 2);
c([
  a({ value: 1 / 0, type: Number })
], h.prototype, "max", 2);
c([
  a({ value: !1, type: Boolean })
], h.prototype, "ladder", 2);
c([
  a({ value: "inset", type: String, reflect: !0 })
], h.prototype, "appearance", 2);
c([
  d("true")
], h.prototype, "contentEditable", 2);
c([
  a({ value: 'pattern="-?[0-9]*?[0-9]*"', type: String, reflect: !0 })
], h.prototype, "pattern", 2);
c([
  d("text")
], h.prototype, "inputMode", 2);
c([
  d("textbox")
], h.prototype, "role", 2);
h = c([
  m
], h);
function re() {
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent) || "ontouchstart" in window && !window.matchMedia("(pointer: fine)").matches;
}
const ve = function(e) {
  return h.vConstructor(e);
};
var se = Object.defineProperty, ne = Object.getOwnPropertyDescriptor, x = (e, t, o, r) => {
  for (var i = r > 1 ? void 0 : r ? ne(t, o) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (i = (r ? n(t, o, i) : n(i)) || i);
  return r && i && se(t, o, i), i;
};
let b = class extends l {
  static get Style() {
    return (
      /* css */
      `
      :host {
        cursor: text;
        user-select: text;
        -webkit-user-select: text;
        -webkit-touch-callout: default;
      }
      :host[placeholder]:empty:before {
        content: attr(placeholder);
        visibility: visible;
        color: var(--io_colorInput);
        padding: 0 calc(var(--io_spacing) + var(--io_borderWidth));
        opacity: 0.5;
      }
    `
    );
  }
  constructor(e = {}) {
    super(e);
  }
  get textNode() {
    return this._flattenTextNode(this), this._textNode.nodeValue;
  }
  set textNode(e) {
    this._flattenTextNode(this), this._textNode.nodeValue = String(e);
  }
  _setFromTextNode() {
    const e = this.textNode;
    typeof this.value == "string" && e !== String(this.value) && this.inputValue(e);
  }
  // TODO: reconsider this feature
  _setObjectFromTextNodeJSON() {
    const e = this.textNode;
    try {
      const t = JSON.parse(e.replace(/[\t\n\r ]+/g, " "));
      this.inputValue(t);
    } catch (t) {
      console.warn("IoString: Cannot parse value", e), console.error(t), this._setFromTextNode();
    }
  }
  onBlur(e) {
    super.onBlur(e), this._setFromTextNode(), this.scrollTop = 0, this.scrollLeft = 0;
  }
  onPointerup(e) {
    super.onPointerup(e), document.activeElement !== this && (this.focus(), this.setCaretPosition(this.textNode.length));
  }
  onKeydown(e) {
    const t = window.getSelection().getRangeAt(0), o = t.startOffset, r = t.endOffset, i = this.childNodes[0] ? this.childNodes[0].length : 0, s = t.startContainer === t.endContainer && (t.startContainer === this.childNodes[0] || t.startContainer === this);
    switch (e.key) {
      case "Enter":
        e.preventDefault(), e.shiftKey ? this._setObjectFromTextNodeJSON() : this._setFromTextNode();
        break;
      case "ArrowLeft":
        (e.ctrlKey || s && o === r && o === 0) && (e.preventDefault(), this.dispatch("io-focus-to", { source: this, command: "ArrowLeft" }, !0));
        break;
      case "ArrowUp":
        (e.ctrlKey || s && o === r && o === 0) && (e.preventDefault(), this.dispatch("io-focus-to", { source: this, command: "ArrowUp" }, !0));
        break;
      case "ArrowRight":
        (e.ctrlKey || s && o === r && o === i) && (e.preventDefault(), this.dispatch("io-focus-to", { source: this, command: "ArrowRight" }, !0));
        break;
      case "ArrowDown":
        (e.ctrlKey || s && o === r && o === i) && (e.preventDefault(), this.dispatch("io-focus-to", { source: this, command: "ArrowDown" }, !0));
        break;
      default:
        ["Tab", "Home", "End", "PageUp", "PageDown"].includes(e.key) && (e.preventDefault(), this.dispatch("io-focus-to", { source: this, command: e.key }, !0));
    }
  }
  onKeyup(e) {
    if (super.onKeyup(e), this.live) {
      const t = this.getCaretPosition();
      this._setFromTextNode(), this.setCaretPosition(t);
    }
  }
  ready() {
    this.disabledChanged();
  }
  valueChanged() {
    this.invalid = typeof this.value != "string" && this.value !== null && this.value !== void 0;
  }
  changed() {
    this.textNode = String(this.value || "");
  }
};
x([
  a({ value: "", type: String })
], b.prototype, "value", 2);
x([
  a({ value: !1, type: Boolean })
], b.prototype, "live", 2);
x([
  a({ value: "", type: String, reflect: !0 })
], b.prototype, "placeholder", 2);
x([
  a({ value: "inset", reflect: !0 })
], b.prototype, "appearance", 2);
x([
  d("true")
], b.prototype, "contentEditable", 2);
x([
  d("textbox")
], b.prototype, "role", 2);
b = x([
  m
], b);
const be = function(e) {
  return b.vConstructor(e);
};
var ae = Object.getOwnPropertyDescriptor, le = (e, t, o, r) => {
  for (var i = r > 1 ? void 0 : r ? ae(t, o) : t, s = e.length - 1, n; s >= 0; s--)
    (n = e[s]) && (i = n(i) || i);
  return i;
};
let k = class extends g {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: flex;
        position: relative;
        overflow: visible;
        padding: var(--io_spacing) var(--io_spacing);
      }
      :host:focus {
        outline: 0 !important;
        border-color: transparent !important;
        z-index: 1;
      }
      :host:focus > span:before {
        @apply --io_focus;
      }
      :host[pressed] {
        border-color: transparent !important;
        box-shadow: none !important;
      }
      :host > span {
        position: relative;
        width: calc(1.5 * var(--io_fieldHeight));
      }
      :host > span:before {
        content: '';
        box-sizing: border-box;
        position: absolute;
        visibility: visible;
        left: 0;
        width: 100%;
        height: var(--io_lineHeight);
        border-radius: var(--io_lineHeight);
        border: var(--io_border);
        border-color: var(--io_borderColorInset);
        background-color: var(--io_bgColorInput);
        box-shadow: var(--io_shadowInset);
        transition: background-color 0.4s;
      }
      :host > span:after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        visibility: visible;
        top: var(--io_borderWidth);
        left: var(--io_borderWidth);
        height: calc(var(--io_lineHeight) - calc(2 * var(--io_borderWidth)));
        width: calc(var(--io_lineHeight) - calc(2 * var(--io_borderWidth)));
        background-color: var(--io_bgColorLight);
        box-shadow: var(--io_shadowOutset);
        border: var(--io_border);
        border-color: var(--io_borderColorOutset);
        border-radius: var(--io_lineHeight);
        transition-timing-function: ease-in-out;
        transition: left 0.25s;
        z-index: 2;
      }
      :host[value] > span:after {
        background-color: var(--io_bgColorBlue);
        left: calc(100% - calc(var(--io_lineHeight) - var(--io_borderWidth)));
      }
    `
    );
  }
  changed() {
    this.render([
      this.icon ? C({ value: this.icon }) : null,
      v()
    ]);
  }
};
k = le([
  m
], k);
const fe = function(e) {
  return k.vConstructor(e);
};
export {
  g as IoBoolean,
  y as IoButton,
  l as IoField,
  h as IoNumber,
  p as IoNumberLadderSingleton,
  _ as IoNumberLadderStep,
  b as IoString,
  k as IoSwitch,
  pe as ioBoolean,
  de as ioButton,
  ue as ioField,
  ve as ioNumber,
  f as ioNumberLadderStep,
  be as ioString,
  fe as ioSwitch
};
//# sourceMappingURL=index.js.map
