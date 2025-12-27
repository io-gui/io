import { ReactiveProperty as l, Property as R, IoElement as C, Register as m, Node as V, ThemeSingleton as S, span as Q, NodeArray as B, IoOverlaySingleton as bt, nudge as gt } from "@io-gui/core";
import { ioOptionSelect as vt, MenuOption as j, ioMenuItem as mt } from "@io-gui/menus";
import { ioSelector as yt } from "@io-gui/navigation";
import { IoField as Z, ioField as xt, ioString as _t } from "@io-gui/inputs";
import { IoContextEditorSingleton as wt } from "@io-gui/editors";
import { ioIcon as W, IconsetDB as rt } from "@io-gui/icons";
var Pt = Object.defineProperty, Ot = Object.getOwnPropertyDescriptor, X = (t, e, i, r) => {
  for (var o = r > 1 ? void 0 : r ? Ot(e, i) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (r ? n(e, i, o) : n(o)) || o);
  return r && o && Pt(e, i, o), o;
};
let M = class extends C {
  static get Style() {
    return (
      /* css */
      `
      :host {
        position: relative;
        flex: 0 0 var(--io_spacing3);
        background-color: var(--io_colorLight);
        border-style: solid;
        border-width: 0 var(--io_borderWidth);
        border-color: var(--io_color);
        cursor: col-resize;
        @apply --unselectable;
      }
      :host[pressed] {
        border-color: var(--io_borderColorBlue);
        background-color: var(--io_bgColorBlue);
      }
      :host[pressed]:before,
      :host[pressed]:after {
        background-color: var(--io_colorWhite);
      }
      :host:before,
      :host:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 1;
        opacity: 0;
      }
      :host:before {
        width: var(--io_fieldHeight);
        height: var(--io_spacing);
        background-color: var(--io_color);
        transform: translate(-50%, -50%) rotate(90deg);
        border-radius: var(--io_spacing);
        opacity: 0.5;
      }
      :host[orientation='vertical']:before {
        transform: translate(-50%, -50%);
      }
      :host:after {
        width: var(--io_fieldHeight);
        height: var(--io_fieldHeight);
        background-color: var(--io_color);
        transform: translate(-50%, -50%) rotate(45deg);
        border-radius: 25%;
      }
      :host[orientation='vertical'] {
        cursor: row-resize;
        border-width: var(--io_borderWidth) 0;
      }
      :host:hover {
        border-style: dashed;
      }
      :host:hover:before {
        opacity: 1;
      }
    `
    );
  }
  static get Listeners() {
    return {
      pointerdown: "onPointerdown",
      touchstart: ["onTouchstart", { passive: !1 }]
    };
  }
  constructor(t) {
    super(t);
  }
  onPointerdown(t) {
    t.preventDefault(), t.stopPropagation(), this.addEventListener("pointermove", this.onPointermove), this.addEventListener("pointerleave", this.onPointerleave), this.addEventListener("pointerup", this.onPointerup), this.setPointerCapture(t.pointerId), this.pressed = !0;
  }
  onPointermove(t) {
    t.preventDefault(), this.dispatch("io-divider-move", {
      index: this.index,
      clientX: t.clientX,
      clientY: t.clientY
    }, !0);
  }
  onPointerleave(t) {
    t.preventDefault(), this.removeEventListener("pointermove", this.onPointermove), this.removeEventListener("pointerleave", this.onPointerleave), this.removeEventListener("pointerup", this.onPointerup), this.pressed = !1;
  }
  onPointerup(t) {
    t.preventDefault(), this.removeEventListener("pointermove", this.onPointermove), this.removeEventListener("pointerleave", this.onPointerleave), this.removeEventListener("pointerup", this.onPointerup), this.releasePointerCapture(t.pointerId), this.pressed = !1, this.dispatch("io-divider-move-end", {
      index: this.index,
      clientX: t.clientX,
      clientY: t.clientY
    }, !0);
  }
  onTouchstart(t) {
    this.addEventListener("touchmove", this.onTouchmove, { passive: !1 }), this.addEventListener("touchend", this.onTouchend);
  }
  onTouchmove(t) {
    t.preventDefault();
  }
  onTouchend() {
    this.removeEventListener("touchmove", this.onTouchmove), this.removeEventListener("touchend", this.onTouchend);
  }
};
X([
  l({ value: !1, type: Boolean, reflect: !0 })
], M.prototype, "pressed", 2);
X([
  l({ value: "horizontal", type: String, reflect: !0 })
], M.prototype, "orientation", 2);
X([
  R(Number)
], M.prototype, "index", 2);
M = X([
  m
], M);
const St = function(t) {
  return M.vConstructor(t);
};
var Tt = Object.defineProperty, Dt = Object.getOwnPropertyDescriptor, N = (t, e, i, r) => {
  for (var o = r > 1 ? void 0 : r ? Dt(e, i) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (r ? n(e, i, o) : n(o)) || o);
  return r && o && Tt(e, i, o), o;
};
let _ = class extends V {
  constructor(t) {
    t.label = t.label ?? t.id, super(t);
  }
  toJSON() {
    return {
      id: this.id,
      label: this.label,
      icon: this.icon,
      selected: this.selected
    };
  }
  fromJSON(t) {
    return this.setProperties({
      id: t.id,
      label: t.label ?? t.id,
      icon: t.icon ?? "",
      selected: t.selected ?? !1
    }), this;
  }
};
N([
  l({ type: String, value: "" })
], _.prototype, "id", 2);
N([
  l({ type: String, value: "" })
], _.prototype, "label", 2);
N([
  l({ type: String, value: "" })
], _.prototype, "icon", 2);
N([
  l({ type: Boolean, value: !1 })
], _.prototype, "selected", 2);
_ = N([
  m
], _);
var Ct = Object.defineProperty, Mt = Object.getOwnPropertyDescriptor, Y = (t, e, i, r) => {
  for (var o = r > 1 ? void 0 : r ? Mt(e, i) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (r ? n(e, i, o) : n(o)) || o);
  return r && o && Ct(e, i, o), o;
};
let $ = class extends C {
  static get Style() {
    return (
      /* css */
      `
      :host {
        position: fixed;
        height: calc(var(--io_fieldHeight) - var(--io_borderWidth) - var(--io_borderRadius));
        width: var(--io_spacing);
        background-color: var(--io_bgColorBlue);
        margin-bottom: var(--io_borderWidth);
        z-index: 100000;
        display: none;
      }
      :host:not([dropindex="-1"]) {
        display: block;
      }
      :host:not([splitdirection="none"]) {
        display: block;
        opacity: 0.25;
      }
    `
    );
  }
  constructor(t = {}) {
    super(t);
  }
  changed() {
    if (this.dropTarget && this.dropIndex !== -1) {
      const t = this.dropTarget.querySelectorAll("io-tab");
      if (this.style.width = "", this.style.height = "", t.length === 0) {
        const e = this.dropTarget.getBoundingClientRect();
        this.style.top = `${e.top + S.borderRadius}px`, this.style.left = `${e.left}px`;
      } else if (this.dropIndex > t.length - 1) {
        const i = t[t.length - 1].getBoundingClientRect();
        this.style.top = `${i.top + S.borderRadius}px`, this.style.left = `${i.left + i.width}px`;
      } else {
        const i = t[this.dropIndex].getBoundingClientRect();
        this.style.top = `${i.top + S.borderRadius}px`, this.style.left = `${i.left - S.spacing}px`;
      }
    } else if (this.dropTarget && this.splitDirection !== "none") {
      const t = this.dropTarget.getBoundingClientRect();
      this.splitDirection === "top" ? (this.style.top = `${t.top}px`, this.style.left = `${t.left}px`, this.style.width = `${t.width}px`, this.style.height = `${t.height / 2}px`) : this.splitDirection === "bottom" ? (this.style.top = `${t.top + t.height / 2}px`, this.style.left = `${t.left}px`, this.style.width = `${t.width}px`, this.style.height = `${t.height / 2}px`) : this.splitDirection === "left" ? (this.style.top = `${t.top}px`, this.style.left = `${t.left}px`, this.style.width = `${t.width / 2}px`, this.style.height = `${t.height}px`) : this.splitDirection === "right" ? (this.style.top = `${t.top}px`, this.style.left = `${t.left + t.width / 2}px`, this.style.width = `${t.width / 2}px`, this.style.height = `${t.height}px`) : this.splitDirection === "center" && (this.style.top = `${t.top}px`, this.style.left = `${t.left}px`, this.style.width = `${t.width}px`, this.style.height = `${t.height}px`);
    }
  }
};
Y([
  l(null)
], $.prototype, "dropTarget", 2);
Y([
  l({ type: String, value: "none", reflect: !0 })
], $.prototype, "splitDirection", 2);
Y([
  l({ type: Number, value: -1, reflect: !0 })
], $.prototype, "dropIndex", 2);
$ = Y([
  m
], $);
const lt = new $();
setTimeout(() => {
  document.body.appendChild(lt);
}, 100);
var $t = Object.defineProperty, It = Object.getOwnPropertyDescriptor, T = (t, e, i, r) => {
  for (var o = r > 1 ? void 0 : r ? It(e, i) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (r ? n(e, i, o) : n(o)) || o);
  return r && o && $t(e, i, o), o;
};
let w = class extends Z {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        transform: translate(-50%, -50%);
        z-index: 100000;
        pointer-events: none;
        border-color: var(--io_borderColorLight);
        background-color: var(--io_bgColorLight) !important;
        opacity: 0.75;
      }
      :host[dragging] {
        display: flex;
      }
      :host > * {
        display: inline-block;
        white-space: nowrap;
        padding: 0 var(--io_spacing);
      }
      :host > .label {}
    `
    );
  }
  constructor(t = {}) {
    super(t);
  }
  changed() {
    lt.setProperties({
      dropTarget: this.dropTarget,
      splitDirection: this.splitDirection,
      dropIndex: this.dropIndex
    }), this.render([
      W({ value: this.tab?.icon || " " }),
      Q({ class: "label" }, this.tab?.label || "")
    ]);
  }
};
T([
  l({ type: Boolean, reflect: !0 })
], w.prototype, "dragging", 2);
T([
  l(null)
], w.prototype, "tab", 2);
T([
  l(null)
], w.prototype, "dropSource", 2);
T([
  l(null)
], w.prototype, "dropTarget", 2);
T([
  l({ type: String, value: "none", reflect: !0 })
], w.prototype, "splitDirection", 2);
T([
  l({ type: Number, value: -1 })
], w.prototype, "dropIndex", 2);
T([
  R(-1)
], w.prototype, "tabIndex", 2);
w = T([
  m
], w);
const b = new w();
document.body.appendChild(b);
var Et = Object.defineProperty, zt = Object.getOwnPropertyDescriptor, k = (t, e, i, r) => {
  for (var o = r > 1 ? void 0 : r ? zt(e, i) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (r ? n(e, i, o) : n(o)) || o);
  return r && o && Et(e, i, o), o;
};
const at = [];
for (const t of Object.keys(rt))
  for (const e of Object.keys(rt[t])) {
    const i = `${t}:${e}`;
    at.push({ value: i, label: e, icon: i });
  }
const Lt = vt({ label: "Select", option: new j({ id: "iconselect", options: at }) });
let st = 0, nt = 0, A = class extends Z {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: flex;
        position: relative;
        height: inherit;
        min-height: inherit;
        /* TODO: use vars for this */
        min-width: calc(var(--io_fieldHeight) * 1.25);
        margin: 0;
        margin-right: var(--io_spacing);
        background-color: var(--io_bgColor) !important;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-color: var(--io_borderColorLight);
        padding-right: var(--io_lineHeight);
      }
      :host[pressed] {
        border-color: unset !important;
        box-shadow: unset !important;
      }
      :host[selected] {
        color: var(--io_colorStrong);
        background-color: var(--io_bgColorLight) !important;
        border-color: var(--io_borderColorStrong);
        border-bottom-color: var(--io_bgColorLight);
        z-index: 1;
      }
      :host[overflow]:not([selected]) > .io-close-icon {
        display: none;
      }
      :host[selected]:focus {
        color: var(--io_colorWhite);
        z-index: 2;
      }
      :host > .io-icon:not([value=' ']) {
        margin: 0 var(--io_spacing2) 0 0;
      }
      :host > .marker {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-color: var(--io_bgColorBlue);
        border-bottom-right-radius: var(--io_borderRadius);
      }
      :host > span {
        padding: 0 var(--io_spacing);
        overflow: hidden; 
        text-overflow: ellipsis !important;
      }
      :host > * {
        pointer-events: none;
        display: inline-block;
        white-space: nowrap;
      }
      :host:not(:hover) > .io-close-icon {
        opacity: 0;
        transform: scale(0.2);
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity linear 0.2s;
      }
      :host:hover > .io-close-icon {
        opacity: 1;
        transform: scale(0.4);
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity linear 0.2s;
      }
      :host > .io-close-icon {
        position: absolute;
        right: var(--io_spacing);
        top: var(--io_spacing);
        pointer-events: inherit;
        background: linear-gradient(to right, transparent 0%, var(--io_bgColor) 25%);
      }
      :host[selected] > .io-close-icon {
        background: linear-gradient(to right, transparent 0%, var(--io_bgColorLight) 25%);
      }
      :host > .io-close-icon:hover {
        transform: scale(0.5);
        fill: var(--io_colorStrong);
        stroke: var(--io_colorStrong);
      }
    `
    );
  }
  static get Listeners() {
    return {
      click: "preventDefault",
      contextmenu: "preventDefault"
    };
  }
  constructor(t) {
    super(t);
  }
  onResized() {
    const t = this.querySelector("span");
    this.overflow = t.scrollWidth > t.clientWidth;
  }
  onTouchmove(t) {
    t.preventDefault();
  }
  preventDefault(t) {
    t.stopPropagation(), t.preventDefault();
  }
  onPointerdown(t) {
    t.preventDefault(), t.stopPropagation(), this.setPointerCapture(t.pointerId), st = t.clientX, nt = t.clientY, super.onPointerdown(t), t.buttons === 2 ? this.expandContextEditor() : this.focus();
  }
  onPointermove(t) {
    if (t.preventDefault(), t.buttons !== 1) return;
    const e = this.parentElement.parentElement;
    if (!b.dragging) {
      const a = Math.abs(st - t.clientX), h = Math.abs(nt - t.clientY);
      (a > 10 || h > 10) && (b.setProperties({
        tab: this.tab,
        dragging: !0,
        dropSource: e,
        dropTarget: null,
        dropIndex: -1
      }), b.style.top = t.clientY + "px", b.style.left = t.clientX + "px");
      return;
    }
    b.style.top = t.clientY + "px", b.style.left = t.clientX + "px";
    const i = t.clientX, r = t.clientY, o = S.spacing, s = document.querySelectorAll("io-tabs");
    for (let a = 0; a < s.length; a++) {
      const h = s[a], u = h.parentElement, g = h.getBoundingClientRect();
      if (r >= g.top && r <= g.bottom && i >= g.left && i <= g.right) {
        const v = h.querySelectorAll("io-tab");
        if (v.length === 0) {
          b.setProperties({
            dropTarget: u,
            splitDirection: "none",
            dropIndex: 0
          });
          return;
        }
        for (let d = 0; d < v.length; d++) {
          const P = v[d].getBoundingClientRect(), p = d === v.length - 1;
          if (r >= P.top - o && r <= P.bottom + o && i >= P.left - o && (i <= P.right + o || p && i <= g.right)) {
            const c = (i < P.left + P.width / 2 ? "left" : "right") === "left" ? d : d + 1;
            b.setProperties({
              dropTarget: u,
              splitDirection: "none",
              dropIndex: c
            });
            return;
          }
        }
      }
    }
    const n = document.querySelectorAll("io-panel");
    for (let a = 0; a < n.length; a++) {
      const h = n[a], u = h.getBoundingClientRect();
      if (r >= u.top && r <= u.bottom && i >= u.left && i <= u.right) {
        const g = (i - u.left - u.width / 2) / u.width * 2, v = (r - u.top - u.height / 2) / u.height * 2;
        let d = "none";
        Math.abs(g) < 0.5 && Math.abs(v) < 0.5 ? d = "center" : v > 0 && Math.abs(v) > Math.abs(g) ? d = "bottom" : v < 0 && Math.abs(v) > Math.abs(g) ? d = "top" : g > 0 && Math.abs(g) > Math.abs(v) ? d = "right" : g < 0 && Math.abs(g) > Math.abs(v) && (d = "left"), b.setProperties({
          dropTarget: h,
          splitDirection: d,
          dropIndex: -1
        });
        return;
      }
    }
  }
  onPointerup(t) {
    if (t.preventDefault(), super.onPointerup(t), this.releasePointerCapture(t.pointerId), b.dragging) {
      const e = b.dropSource, i = b.dropTarget, r = b.dropIndex, o = b.splitDirection;
      i && r !== -1 ? (e && e !== i && e.removeTab(this.tab), i.addTab(this.tab, r)) : e && i && o !== "none" && i.moveTabToSplit(e, this.tab, o), b.setProperties({
        dragging: !1,
        dropSource: null,
        dropTarget: null,
        splitDirection: "none",
        dropIndex: -1
      });
    } else
      this.onClick();
  }
  onPointercancel(t) {
    t.preventDefault(), t.stopPropagation(), super.onPointercancel(t), b.setProperties({
      dragging: !1,
      dropSource: null,
      dropTarget: null,
      splitDirection: "none",
      dropIndex: -1
    });
  }
  onPointerleave(t) {
    t.preventDefault(), t.stopPropagation();
  }
  onClick() {
    this.dispatch("io-edit-tab", { tab: this.tab, key: "Select" }, !0);
  }
  onDeleteClick() {
    this.dispatch("io-edit-tab", { tab: this.tab, key: "Backspace" }, !0);
  }
  expandContextEditor() {
    wt.expand({
      source: this,
      direction: "down",
      value: this.tab,
      properties: ["id", "label", "icon"],
      orientation: "horizontal",
      config: /* @__PURE__ */ new Map([
        [Object, [
          ["id", xt({ inert: !0 })],
          ["label", _t({ live: !0 })],
          ["icon", Lt]
        ]]
      ])
    });
  }
  onKeydown(t) {
    t.shiftKey && ["Backspace", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(t.key) ? (t.preventDefault(), this.dispatch("io-edit-tab", { tab: this.tab, key: t.key }, !0)) : t.shiftKey && t.key === "Enter" ? this.expandContextEditor() : super.onKeydown(t);
  }
  tabMutated() {
    this.changed();
  }
  changed() {
    this.setAttribute("selected", this.tab.selected), this.render([
      this.tab.selected ? Q({ class: "marker" }) : null,
      W({ class: "io-icon", value: this.tab.icon || " " }),
      Q({ class: "label" }, this.tab.label),
      W({ value: "io:close", size: "small", class: "io-close-icon", "@click": this.onDeleteClick, "@pointerdown": this.preventDefault })
    ]);
  }
};
k([
  l({ type: _ })
], A.prototype, "tab", 2);
k([
  l({ type: Boolean, reflect: !0 })
], A.prototype, "overflow", 2);
A = k([
  m
], A);
const pt = function(t) {
  return A.vConstructor(t);
};
var ct = Object.defineProperty, Rt = Object.getOwnPropertyDescriptor, At = (t, e, i) => e in t ? ct(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[e] = i, tt = (t, e, i, r) => {
  for (var o = r > 1 ? void 0 : r ? Rt(e, i) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (r ? n(e, i, o) : n(o)) || o);
  return r && o && ct(e, i, o), o;
}, Bt = (t, e, i) => At(t, e + "", i);
let I = class extends C {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: flex;
        flex-direction: column;
        border: var(--io_border);
        border-radius: calc(var(--io_borderRadius) + var(--io_spacing2));
        border-color: var(--io_borderColorOutset);
        background-color: var(--io_bgColorLight);
        padding: calc(var(--io_spacing) + var(--io_borderWidth));
        position: absolute;
        overflow-y: auto;
        box-shadow: 1px 1px 16px var(--io_shadowColor),
                    1px 1px 8px var(--io_shadowColor), 
                    1px 1px 4px var(--io_shadowColor);
      }
      :host:not([expanded]) {
        visibility: hidden;
        opacity: 0;
      }
      :host > io-tab {
        border-color: transparent !important;
        background-color: var(--io_bgColorLight) !important;
        border-radius: var(--io_borderRadius) !important;
      }
      :host > io-tab[selected] {
        background-color: var(--io_bgColor) !important;
      }
      :host > io-tab > .marker {
        border-radius: 0;
      }
    `
    );
  }
  static get Listeners() {
    return {
      touchstart: ["stopPropagation", { passive: !1 }],
      // TODO: why?
      "io-focus-to": "onIoFocusTo",
      "io-edit-tab": "onEditTabCapture"
    };
  }
  constructor(t = {}) {
    super(t);
  }
  stopPropagation(t) {
    t.stopPropagation();
  }
  onIoFocusTo(t) {
    const e = t.detail.source, i = t.detail.command, r = Array.from(this.querySelectorAll("io-tab")), o = r.indexOf(e);
    let s = "";
    i === "ArrowDown" && (s = "Next"), i === "ArrowUp" && (s = "Prev"), i === "ArrowLeft" && (s = "First"), i === "ArrowRight" && (s = "Last"), s && (s === "Next" ? r[(o + 1) % r.length].focus() : s === "Prev" ? r[(o - 1 + r.length) % r.length].focus() : s === "First" ? r[0].focus() : s === "Last" && r[r.length - 1].focus(), t.stopPropagation());
  }
  onEditTabCapture(t) {
    t.stopPropagation(), this.onEditTab(t), this.expanded = !1;
  }
  expand(t) {
    this.setProperties({
      tabs: t.tabs,
      expanded: !0
    }), this.onEditTab = t.onEditTab, gt(this, t.source, t.direction), this.debounce(this.onExpand);
  }
  onExpand() {
    this.querySelector("[selected]")?.focus();
  }
  changed() {
    this.render([
      ...this.tabs.map((t) => pt({ tab: t }))
    ]);
  }
};
Bt(I, "vConstructor");
tt([
  l({ type: B, init: "this" })
], I.prototype, "tabs", 2);
tt([
  l({ type: Boolean, reflect: !0 })
], I.prototype, "expanded", 2);
I = tt([
  m
], I);
const ht = new I();
setTimeout(() => {
  bt.appendChild(ht);
}, 100);
var jt = Object.defineProperty, Nt = Object.getOwnPropertyDescriptor, dt = (t, e, i, r) => {
  for (var o = r > 1 ? void 0 : r ? Nt(e, i) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (r ? n(e, i, o) : n(o)) || o);
  return r && o && jt(e, i, o), o;
};
let H = class extends Z {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: flex;
        flex-shrink: 0;
      }
    `
    );
  }
  constructor(t) {
    super(t);
  }
  onClick() {
    ht.expand({
      source: this,
      direction: "over",
      tabs: this.tabs,
      onEditTab: this.onEditTab
    });
  }
  onEditTab(t) {
    this.dispatch("io-edit-tab", { tab: t.detail.tab, key: t.detail.key }, !0);
  }
  changed() {
    this.render([
      W({ value: "io:hamburger" })
    ]);
  }
};
dt([
  l({ type: B, init: "this" })
], H.prototype, "tabs", 2);
H = dt([
  m
], H);
const Wt = function(t) {
  return H.vConstructor(t);
};
var Ht = Object.defineProperty, Xt = Object.getOwnPropertyDescriptor, q = (t, e, i, r) => {
  for (var o = r > 1 ? void 0 : r ? Xt(e, i) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (r ? n(e, i, o) : n(o)) || o);
  return r && o && Ht(e, i, o), o;
};
let E = class extends C {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: flex;
        background-color: var(--io_bgColorStrong);
        padding-top: var(--io_spacing);
        padding-left: var(--io_spacing);
        padding-right: var(--io_spacing);
      }
      :host io-tab {
        transition: opacity 2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      :host:not([overflow="-1"]) io-tab {
        /* TODO: make niceer animations */
        pointer-events: none;
        opacity: 0;
      }
      :host[overflow="-1"] io-tabs-hamburger {
        /* TODO: make niceer animations */
        display: none;
      }
      :host > io-tabs-hamburger {
        margin-bottom: var(--io_spacing);
        /* transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1); */
      }
      :host > io-menu-item {
        margin-left: auto;
        flex-shrink: 0;
        opacity: 0.125;
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity linear 0.2s;
      }
      :host > io-menu-item:focus,
      :host > io-menu-item:hover {
        opacity: 1;
      }
      :host > io-menu-item > .label,
      :host > io-menu-item > .icon,
      :host > io-menu-item > .hasmore {
        display: none;
      }
    `
    );
  }
  constructor(t) {
    super(t);
  }
  tabsMutated() {
    this.changed(), this.overflow = -1, this.onResized();
  }
  onResized() {
    const t = this.getBoundingClientRect(), e = this.querySelector(".add-tab").getBoundingClientRect();
    this.overflow === -1 ? e.right > t.right && (this.overflow = t.width) : t.width > this.overflow + 32 && (this.overflow = -1);
  }
  changed() {
    this.render([
      Wt({ tabs: this.tabs }),
      ...this.tabs.map((t) => pt({ tab: t })),
      mt({
        class: "add-tab",
        icon: "io:box_fill_plus",
        direction: "down",
        option: this.addMenuOption
      })
    ]);
  }
};
q([
  l({ type: B, init: "this" })
], E.prototype, "tabs", 2);
q([
  l({ type: Number, value: -1, reflect: !0 })
], E.prototype, "overflow", 2);
q([
  R({ type: j })
], E.prototype, "addMenuOption", 2);
E = q([
  m
], E);
const Yt = function(t) {
  return E.vConstructor(t);
};
var qt = Object.defineProperty, Jt = Object.getOwnPropertyDescriptor, J = (t, e, i, r) => {
  for (var o = r > 1 ? void 0 : r ? Jt(e, i) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (r ? n(e, i, o) : n(o)) || o);
  return r && o && qt(e, i, o), o;
};
let z = class extends C {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: flex;
        overflow: hidden;
        flex-direction: column;
        flex: 1 1 auto;
        background-color: var(--io_bgColorLight);
      }
      :host > io-selector {
        margin-top: calc(-1 * var(--io_borderWidth));
        border-top: var(--io_border);
        border-top-color: var(--io_borderColorStrong);
      }
    `
    );
  }
  static get Listeners() {
    return {
      "io-edit-tab": "onEditTab"
    };
  }
  onEditTab(t) {
    t.stopPropagation();
    const e = t.detail.tab, i = t.detail.key, r = this.panel.tabs.indexOf(e);
    if (r === -1) {
      console.warn("IoTabs:Tab not found in panel", e);
      return;
    }
    switch (i) {
      case "Select": {
        this.selectTab(e);
        break;
      }
      case "Backspace": {
        this.removeTab(e);
        break;
      }
      case "ArrowLeft": {
        this.moveTab(e, r - 1);
        break;
      }
      case "ArrowRight": {
        this.moveTab(e, r + 1);
        break;
      }
    }
  }
  init() {
    this.focusTabDebounced = this.focusTabDebounced.bind(this);
  }
  onNewTabClicked(t) {
    t.stopPropagation();
    const e = t.detail.option;
    if (e.id && e.options.length === 0) {
      const i = new _({ id: e.id, label: e.label, icon: e.icon });
      this.addTab(i);
      const r = this.querySelector(".add-tab");
      r && (r.expanded = !1);
    }
  }
  selectIndex(t) {
    t = Math.min(t, this.panel.tabs.length - 1), this.panel.setSelected(this.panel.tabs[t].id), this.debounce(this.focusTabDebounced, t);
  }
  selectTab(t) {
    const e = this.panel.tabs.indexOf(t);
    this.panel.setSelected(t.id), this.debounce(this.focusTabDebounced, e);
  }
  moveTabToSplit(t, e, i) {
    const r = this.parentElement;
    i === "center" ? (t.removeTab(e), this.addTab(e)) : r.moveTabToSplit(t, this.panel, e, i);
  }
  addTab(t, e) {
    const i = this.panel.tabs.findIndex((r) => r.id === t.id);
    i !== -1 && this.panel.tabs.splice(i, 1), e = e ?? this.panel.tabs.length, e = Math.min(e, this.panel.tabs.length), this.panel.tabs.splice(e, 0, t), this.selectIndex(e);
  }
  removeTab(t) {
    const e = this.parentElement;
    if ((e.parentElement instanceof D ? e.parentElement : null) && e.split.children.length === 1 && this.panel.tabs.length === 1)
      return;
    const r = this.panel.tabs.indexOf(t);
    if (this.panel.tabs.splice(r, 1), this.panel.tabs.length > 0) {
      const o = Math.min(r, this.panel.tabs.length - 1);
      this.selectIndex(o);
    } else
      this.dispatch("io-panel-remove", { panel: this.panel }, !0);
  }
  moveTab(t, e) {
    e = Math.max(Math.min(e, this.panel.tabs.length - 1), 0);
    const i = this.panel.tabs.findIndex((r) => r.id === t.id);
    this.panel.tabs.splice(i, 1), e = Math.min(e, this.panel.tabs.length), this.panel.tabs.splice(e, 0, t), this.selectIndex(e);
  }
  focusTabDebounced(t) {
    const e = Array.from(this.querySelectorAll("io-tab"));
    t = Math.min(t, e.length - 1), e[t] && e[t].focus();
  }
  panelMutated() {
    this.changed();
  }
  changed() {
    this.render([
      Yt({
        tabs: this.panel.tabs,
        addMenuOption: this.addMenuOption,
        "@io-menu-option-clicked": this.onNewTabClicked
      }),
      yt({
        selected: this.panel.getSelected(),
        elements: this.elements,
        anchor: ""
      })
    ]);
  }
};
J([
  l({ type: Object })
], z.prototype, "panel", 2);
J([
  l(Array)
], z.prototype, "elements", 2);
J([
  R(j)
], z.prototype, "addMenuOption", 2);
z = J([
  m
], z);
const Ft = function(t) {
  return z.vConstructor(t);
};
var Kt = Object.defineProperty, Ut = Object.getOwnPropertyDescriptor, et = (t, e, i, r) => {
  for (var o = r > 1 ? void 0 : r ? Ut(e, i) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (r ? n(e, i, o) : n(o)) || o);
  return r && o && Kt(e, i, o), o;
};
let x = class extends V {
  constructor(t) {
    t = { ...t }, t.tabs.length > 0 && !t.tabs.find((e) => e.selected) && (t.tabs[0].selected = !0), t.tabs = t.tabs.map((e) => new _({ ...e })), super(t);
  }
  tabsMutated() {
    this.debounce(this.onTabsMutatedDebounced);
  }
  onTabsMutatedDebounced() {
    this.dispatchMutation();
  }
  getSelected() {
    let t = "";
    for (let e = 0; e < this.tabs.length; e++) {
      const i = this.tabs[e];
      if (i.selected && i.id) {
        t = i.id;
        break;
      }
    }
    return t;
  }
  setSelected(t) {
    this.tabs.withInternalOperation(() => {
      for (let e = 0; e < this.tabs.length; e++) {
        const i = this.tabs[e];
        i.id === t ? i.selected = !0 : i.selected = !1;
      }
    }), this.tabs.dispatchMutation();
  }
  toJSON() {
    return {
      tabs: this.tabs.map((t) => t.toJSON()),
      flex: this.flex
    };
  }
  fromJSON(t) {
    return this.setProperties({
      tabs: t.tabs.map((e) => new _(e)),
      flex: t.flex ?? "1 1 100%"
    }), this;
  }
  dispose() {
    this.tabs.length = 0, super.dispose();
  }
};
et([
  l({ type: B, init: "this" })
], x.prototype, "tabs", 2);
et([
  l({ type: String, value: "1 1 100%" })
], x.prototype, "flex", 2);
x = et([
  m
], x);
var Gt = Object.defineProperty, Qt = Object.getOwnPropertyDescriptor, F = (t, e, i, r) => {
  for (var o = r > 1 ? void 0 : r ? Qt(e, i) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (r ? n(e, i, o) : n(o)) || o);
  return r && o && Gt(e, i, o), o;
};
let O = class extends V {
  constructor(t) {
    t = { ...t };
    for (let e = 0; e < t.children.length; e++) {
      const i = t.children[e], r = t.children[e];
      i.tabs ? t.children[e] = new x(i) : r.children && (t.children[e] = new O(r));
    }
    super(t);
  }
  childrenMutated() {
    this.debounce(this.onChildrenMutatedDebounced);
  }
  onChildrenMutatedDebounced() {
    this.dispatchMutation();
  }
  toJSON() {
    return {
      children: this.children.map((t) => t.toJSON()),
      orientation: this.orientation,
      flex: this.flex
    };
  }
  fromJSON(t) {
    return this.setProperties({
      children: t.children.map((e) => {
        const i = e, r = e;
        if (i.tabs)
          return new x(i);
        if (r.children)
          return new O(r);
      }),
      orientation: t.orientation ?? "horizontal",
      flex: t.flex ?? "1 1 100%"
    }), this;
  }
  dispose() {
    this.children.length = 0, super.dispose();
  }
};
F([
  l({ type: B, init: "this" })
], O.prototype, "children", 2);
F([
  l({ type: String, value: "horizontal" })
], O.prototype, "orientation", 2);
F([
  l({ type: String, value: "1 1 100%" })
], O.prototype, "flex", 2);
O = F([
  m
], O);
var Vt = Object.defineProperty, Zt = Object.getOwnPropertyDescriptor, K = (t, e, i, r) => {
  for (var o = r > 1 ? void 0 : r ? Zt(e, i) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (r ? n(e, i, o) : n(o)) || o);
  return r && o && Vt(e, i, o), o;
};
let L = class extends C {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: flex;
        overflow: hidden;
        flex-direction: row;
      }
      :host[orientation='vertical'] {
        flex-direction: column;
      }
    `
    );
  }
  static get Listeners() {
    return {
      "io-divider-move": "onDividerMove",
      "io-divider-move-end": "onDividerMoveEnd",
      "io-panel-remove": "onPanelRemove",
      "io-split-remove": "onSplitRemove",
      "io-split-convert-to-panel": "onSplitConvertToPanel"
    };
  }
  // TODO: Make sure one panel is available even when all tabs are removed.
  constructor(t) {
    super(t), this.splitMutatedDebounced = this.splitMutatedDebounced.bind(this);
  }
  onDividerMove(t) {
    t.stopPropagation();
    const e = t.detail.index, i = this.getBoundingClientRect(), r = this.split.orientation, o = S.spacing3, s = (r === "horizontal" ? i.width : i.height) - o * (this.children.length - 1) / 2, n = r === "horizontal" ? S.fieldHeight * 4 : S.fieldHeight, a = [], h = [], u = [];
    for (let p = 0; p < this.children.length; p += 2) {
      const f = this.children[p], c = f.getBoundingClientRect(), y = r === "horizontal" ? c.width : c.height;
      let it = t.detail.clientX - c.left - o / 2, ot = t.detail.clientY - c.top - o / 2;
      p === this.children.length - 1 && (it = i.width - (t.detail.clientX - i.left) - o / 2, ot = i.height - (t.detail.clientY - i.top) - o / 2);
      let ft = r === "horizontal" ? it : ot;
      a.push(f), h.push(y), u.push(ft);
    }
    let g = 0, v = 0, d = 0, G = 0, P = 0;
    for (let p = 0; p < a.length; p++) {
      let f = e;
      f === a.length - 2 && (f = a.length - 1), a[p].style.flex.endsWith("%") ? (d += h[p], p < f ? G++ : p > f && P++) : p < f ? g += h[p] : p > f && (v += h[p]);
    }
    if (e === 0) {
      const p = s - n * P - v, f = Math.max(n, Math.min(p, u[0]));
      a[e].style.flex = `0 0 ${f}px`;
      for (let c = 0; c < a.length; c++)
        a[c].style.flex.endsWith("%") && c !== e && (a[c].style.flex = `1 1 ${Math.max(n, h[c]) / d * 100}%`);
    } else if (e === a.length - 2) {
      const p = s - n * G - g, f = Math.max(n, Math.min(p, u[e + 1]));
      a[e + 1].style.flex = `0 0 ${f}px`;
      for (let c = 0; c < a.length; c++)
        a[c].style.flex.endsWith("%") && c !== e + 1 && (a[c].style.flex = `1 1 ${Math.max(n, h[c]) / d * 100}%`);
    } else {
      const p = h[e] + h[e + 1] - n, f = Math.max(n, Math.min(p, u[e])), c = h[e + 1] - (f - h[e]);
      for (let y = 0; y < a.length; y++)
        a[y].style.flex.endsWith("%") && (y === e ? a[y].style.flex = `1 1 ${f / d * 100}%` : y === e + 1 ? a[y].style.flex = `1 1 ${c / d * 100}%` : a[y].style.flex = `1 1 ${Math.max(n, h[y]) / d * 100}%`);
    }
  }
  onDividerMoveEnd(t) {
    t.stopPropagation();
    let e = 0;
    for (let i = 0; i < this.children.length; i += 2) {
      const r = this.children[i];
      this.split.children[e].flex = r.style.flex, e++;
    }
  }
  onPanelRemove(t) {
    if (t.detail.panel !== this.split) {
      t.stopPropagation();
      for (let e = this.split.children.length; e--; ) {
        const i = this.split.children[e];
        i instanceof x && i.tabs.length === 0 && this.split.children.splice(e, 1);
      }
      this.split.children.length === 0 ? this.dispatch("io-split-remove", { split: this.split }, !0) : this.split.children.length === 1 && this.dispatch("io-split-convert-to-panel", { split: this.split }, !0);
    }
  }
  onSplitRemove(t) {
    if (t.detail.split === this.split) return;
    t.stopPropagation();
    const e = this.split.children.indexOf(t.detail.split);
    this.split.children.splice(e, 1), this.split.children.length === 2 && (this.split.children[1].flex = "1 1 100%");
  }
  onSplitConvertToPanel(t) {
    t.detail.split !== this.split && (t.stopPropagation(), this.convertToPanel(t.detail.split));
  }
  convertToSplit(t, e, i, r) {
    const o = this.split.children.indexOf(t);
    this.split.children.splice(o, 1, new O({ orientation: r, children: [e, i] }));
  }
  convertToPanel(t) {
    const e = t.children[0], i = this.split.children.indexOf(t);
    e.flex = "1 1 100%", this.split.children.splice(i, 1, e);
  }
  moveTabToSplit(t, e, i, r) {
    const o = this.split.children.indexOf(e);
    let s = "horizontal";
    (r === "top" || r === "bottom") && (s = "vertical");
    let n = ["left", "top"].includes(r) ? o - 1 : o + 1;
    this.split.orientation === s ? (n = Math.max(0, n), this.split.children.splice(n, 0, new x({ tabs: [i] })), t.removeTab(i)) : (e.tabs.length > 1 || e !== t.panel) && (t.removeTab(i), n === -1 ? this.convertToSplit(e, new x({ tabs: [i] }), e, s) : this.convertToSplit(e, e, new x({ tabs: [i] }), s));
  }
  splitMutated() {
    this.debounce(this.splitMutatedDebounced);
  }
  splitMutatedDebounced() {
    this.changed();
  }
  changed() {
    this.setAttribute("orientation", this.split.orientation), this.style.flex = this.split.flex;
    const t = [];
    for (let e = 0; e < this.split.children.length; e++) {
      const i = this.split.children[e];
      i instanceof O ? t.push(ut({
        split: i,
        style: { flex: i.flex },
        elements: this.elements,
        addMenuOption: this.addMenuOption
      })) : i instanceof x ? t.push(Ft({
        panel: i,
        style: { flex: i.flex },
        elements: this.elements,
        addMenuOption: this.addMenuOption
      })) : console.warn("IOSplit: Invalid child type", i), e < this.split.children.length - 1 && t.push(St({ orientation: this.split.orientation, index: e }));
    }
    this.render(t);
  }
};
K([
  l({ type: Object })
], L.prototype, "split", 2);
K([
  l(Array)
], L.prototype, "elements", 2);
K([
  R({ type: j })
], L.prototype, "addMenuOption", 2);
L = K([
  m
], L);
const ut = function(t) {
  return L.vConstructor(t);
};
var kt = Object.defineProperty, te = Object.getOwnPropertyDescriptor, U = (t, e, i, r) => {
  for (var o = r > 1 ? void 0 : r ? te(e, i) : e, s = t.length - 1, n; s >= 0; s--)
    (n = t[s]) && (o = (r ? n(e, i, o) : n(o)) || o);
  return r && o && kt(e, i, o), o;
};
let D = class extends C {
  static get Style() {
    return (
      /* css */
      `
      :host {
        position: relative;
        display: flex;
        flex: 1 1 100%;
        max-width: 100%;
        max-height: 100%;
      }
      :host > io-split {
        max-width: 100%;
        max-height: 100%;
      }
    `
    );
  }
  changed() {
    this.render([
      ut({
        split: this.split,
        elements: this.elements,
        addMenuOption: this.addMenuOption
      })
    ]);
  }
};
U([
  l({ type: Object })
], D.prototype, "split", 2);
U([
  l(Array)
], D.prototype, "elements", 2);
U([
  R({ type: j })
], D.prototype, "addMenuOption", 2);
D = U([
  m
], D);
const le = function(t) {
  return D.vConstructor(t);
};
export {
  M as IoDivider,
  D as IoLayout,
  z as IoPanel,
  L as IoSplit,
  A as IoTab,
  E as IoTabs,
  H as IoTabsHamburger,
  ht as IoTabsHamburgerMenuSingleton,
  x as Panel,
  O as Split,
  _ as Tab,
  St as ioDivider,
  le as ioLayout,
  Ft as ioPanel,
  ut as ioSplit,
  pt as ioTab,
  Yt as ioTabs,
  Wt as ioTabsHamburger,
  b as tabDragIconSingleton,
  lt as tabDropMarkerSingleton
};
//# sourceMappingURL=index.js.map
