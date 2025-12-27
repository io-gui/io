import { ReactiveProperty as l, NodeArray as G, Node as Q, Register as _, IoOverlaySingleton as v, Property as x, IoElement as L, nudge as Z, span as F, Storage as ee } from "@io-gui/core";
import { ioIcon as $ } from "@io-gui/icons";
import { ioString as J, ioField as U, IoField as te, ioBoolean as oe } from "@io-gui/inputs";
var ie = Object.defineProperty, ne = Object.getOwnPropertyDescriptor, u = (e, t, o, i) => {
  for (var n = i > 1 ? void 0 : i ? ne(t, o) : t, s = e.length - 1, r; s >= 0; s--)
    (r = e[s]) && (n = (i ? r(t, o, n) : r(n)) || n);
  return i && n && ie(t, o, n), n;
};
let a = class extends Q {
  static get Listeners() {
    return {
      "option-selected-changed": "onOptionSelectedChanged"
    };
  }
  constructor(e) {
    (typeof e == "string" || typeof e == "number" || typeof e == "boolean" || e === null || e === void 0) && (e = {
      id: String(e),
      value: e
    }), e = { ...e }, e.id = e.id ?? "null", e.label = e.label ?? e.id, e.value = e.value ?? e.id, e.options = e.options ?? [], e.options = e.options.map((i) => i instanceof a ? i : new a(i));
    const o = e.options.filter((i) => i.mode === "select" && i.selected);
    for (let i = 1; i < o.length; i++)
      console.warn('Duplicate selected options with mode "select" found!', o), o[i].selected = !1;
    super(e);
  }
  getAllOptions() {
    const e = [this];
    for (let t = 0; t < this.options.length; t++)
      e.push(...this.options[t].getAllOptions());
    {
      const t = /* @__PURE__ */ new Set();
      for (let o = 0; o < e.length; o++)
        t.has(e[o].id) && console.warn(`Duplicate id "${e[o].id}"`, this), t.add(e[o].id);
    }
    return e;
  }
  findItemByValue(e) {
    const t = this.getAllOptions();
    for (let o = 0; o < t.length; o++)
      if (t[o].value === e) return t[o];
  }
  findItemById(e) {
    const t = this.getAllOptions();
    for (let o = 0; o < t.length; o++)
      if (t[o].id === e) return t[o];
  }
  selectDefault() {
    let e = this.mode === "select" ? this : void 0;
    for (; e; ) {
      const t = e.options.find((o) => o.mode === "select");
      if (e.mode === "select" && t)
        e = t;
      else
        break;
    }
    e && (e.selected = !0);
  }
  selectedChanged() {
    this.selected === !1 && this.unselectSuboptions(), this.dispatch("option-selected-changed", { option: this }, !0);
  }
  selectedIDChanged() {
    const e = this.findItemById(this.selectedID);
    e && (e.selected = !0, this.dispatch("option-selected", { option: e }, !1));
  }
  selectedIDImmediateChanged() {
    if (this.selectedIDImmediate) {
      this.selected = !0;
      const e = this.options.find((t) => t.id === this.selectedIDImmediate);
      e && (e.selected = !0);
    }
    this.updatePaths();
  }
  getSelectedIDImmediate() {
    let e = "";
    for (let t = 0; t < this.options.length; t++) {
      const o = this.options[t];
      if (o.selected && o.id && o.mode === "select") {
        e = o.id;
        break;
      }
    }
    return e;
  }
  setSelectedIDImmediate(e) {
    this.options.withInternalOperation(() => {
      for (let t = 0; t < this.options.length; t++) {
        const o = this.options[t];
        o.id === e ? o.selected = !0 : o.selected = !1;
      }
    }), this.options.dispatchMutation();
  }
  onOptionSelectedChanged(e) {
    if (this.options.indexOf(e.detail.option) === -1 || e.detail.option === this) return;
    const t = e.detail.option;
    if (t.selected)
      for (let i = 0; i < this.options.length; i++) {
        const n = this.options[i];
        n !== t && n.mode === "select" && t.mode === "select" && (n.selected = !1);
      }
    this.options.some((i) => i.selected && i.mode === "select") || this.setProperties({
      selectedID: "",
      selectedIDImmediate: "",
      path: ""
    });
  }
  unselectSuboptions() {
    for (let e = 0; e < this.options.length; e++) {
      const t = this.options[e];
      t.mode === "select" && (t.selected = !1, t.unselectSuboptions());
    }
  }
  updatePaths() {
    const e = [];
    if (this.mode !== "select" || !this.selected) {
      this.path = "";
      return;
    }
    let t = this.getSelectedIDImmediate(), o = t ? this.options.find((i) => i.mode === "select" && i.selected && i.id === t) : void 0;
    if (o) {
      for (; o; )
        e.push(o.id), t = o.getSelectedIDImmediate(), o = t ? o.options.find((i) => i.mode === "select" && i.selected && i.id === t) : void 0;
      this.path = e.join(",");
    }
  }
  pathChanged() {
    const e = this.path ? [...this.path.split(",")] : [];
    e.length && (this.selectedID = e[e.length - 1]);
  }
  optionsMutated(e) {
    const t = this.getSelectedIDImmediate();
    this.mode === "select" && t && this.options.length && this.setProperties({
      // selected: !!selectedIDImmediate,
      selectedIDImmediate: t
    }), this.updatePaths(), this.dispatchMutation();
  }
  toJSON() {
    return {
      id: this.id,
      value: this.value,
      label: this.label,
      icon: this.icon,
      hint: this.hint,
      disabled: this.disabled,
      // action: N/A for serialization
      mode: this.mode,
      options: this.options.map((e) => e.toJSON())
    };
  }
  fromJSON(e) {
    return this.setProperties({
      id: e.id,
      value: e.value ?? void 0,
      label: e.label ?? e.id,
      icon: e.icon ?? "",
      hint: e.hint ?? "",
      disabled: e.disabled ?? !1,
      // action: N/A for serialization
      mode: e.mode ?? "select",
      selected: e.selected ?? !1,
      options: e.options?.map((t) => new a(t)) ?? []
    }), this;
  }
  changed() {
    ["select", "toggle", "none"].indexOf(this.mode) === -1 && console.warn(`Unknown "mode" property "${this.mode}"!`, this), this.selected && ["select", "toggle"].indexOf(this.mode) === -1 && console.warn('"selected" property is only valid when mode is "select" or "toggle"!', this), this.id || console.warn('"id" property is required!', this), this.action && typeof this.action != "function" && console.warn(`Invalid type "${typeof this.action}" of "action" property!`, this);
  }
  dispose() {
    this.options.length = 0, super.dispose();
  }
};
u([
  l({ value: "", type: String })
], a.prototype, "id", 2);
u([
  l({ value: void 0 })
], a.prototype, "value", 2);
u([
  l({ value: "", type: String })
], a.prototype, "label", 2);
u([
  l({ value: "", type: String })
], a.prototype, "icon", 2);
u([
  l({ value: "", type: String })
], a.prototype, "hint", 2);
u([
  l({ value: !1, type: Boolean })
], a.prototype, "disabled", 2);
u([
  l()
], a.prototype, "action", 2);
u([
  l({ value: "select", type: String })
], a.prototype, "mode", 2);
u([
  l({ value: !1, type: Boolean })
], a.prototype, "selected", 2);
u([
  l({ value: "", type: String })
], a.prototype, "selectedIDImmediate", 2);
u([
  l({ value: "", type: String })
], a.prototype, "selectedID", 2);
u([
  l({ value: "", type: String })
], a.prototype, "path", 2);
u([
  l({ type: G, init: "this" })
], a.prototype, "options", 2);
a = u([
  _
], a);
const W = ["io-menu-item", "io-menu-options", "io-menu-hamburger", "io-option-select", "io-string", "io-menu-tree"], j = W.join(", ");
function se(e) {
  const t = Array.from(v.querySelectorAll("io-menu-item, io-menu-options")), o = [];
  if (v.expanded)
    for (let i = t.length; i--; )
      re(e, t[i]) && o.push(t[i]);
  if (o.length) {
    o.sort((s, r) => s.depth > r.depth ? 1 : s.depth < r.depth ? -1 : s.localName === "io-menu-item" ? 1 : r.localName === "io-menu-item" ? -1 : 0);
    const i = o[0], n = o[1];
    if (i.localName === "io-menu-item")
      return i;
    if (i.localName === "io-menu-options" && n && n.localName === "io-menu-item" && n.depth === i.depth)
      return n;
  }
}
function S(e) {
  const t = [];
  if (e.$options) {
    t.push(e.$options);
    const o = e.$options.querySelectorAll(j);
    for (let i = o.length; i--; )
      t.push(o[i]), t.push(...S(o[i]));
  } else {
    const o = Array.from(e.querySelectorAll(j));
    for (let i = o.length; i--; )
      t.push(o[i]), t.push(...S(o[i]));
  }
  return t;
}
function q(e) {
  const t = [];
  let o = e;
  for (; o && o.$parent; )
    o = o.$parent, o && t.push(o);
  return t;
}
function X(e) {
  const t = [], o = e.parentElement;
  return o && t.push(...Array.from(o.querySelectorAll(j))), t;
}
function z(e) {
  let t = e;
  for (; t && t.$parent; )
    t = t.$parent;
  return t;
}
function re(e, t) {
  if (W.indexOf(t.localName) !== -1 && !t.disabled && t.parentElement !== v && t.parentElement.expanded) {
    const o = t.getBoundingClientRect(), i = e.clientX, n = e.clientY;
    return o.top <= n && o.bottom >= n && o.left <= i && o.right >= i;
  }
  return !1;
}
function le(e, t) {
  return e.options.length ? !1 : !!(e.value !== void 0 && String(e.value).toLowerCase().indexOf(t) !== -1 || e.label && e.label.toLowerCase().indexOf(t) !== -1 || e.hint && e.hint.toLowerCase().indexOf(t) !== -1);
}
function k(e, t, o = 5, i = 0) {
  t = t.toLowerCase();
  const n = [];
  if (i <= o) for (let s = 0; s < e.options.length; s++)
    le(e.options[s], t) && n.push(e.options[s]), e.options[s].options.length && n.push(...k(e.options[s], t, o, i + 1));
  return n;
}
var ae = Object.defineProperty, pe = Object.getOwnPropertyDescriptor, m = (e, t, o, i) => {
  for (var n = i > 1 ? void 0 : i ? pe(t, o) : t, s = e.length - 1, r; s >= 0; s--)
    (r = e[s]) && (n = (i ? r(t, o, n) : r(n)) || n);
  return i && n && ae(t, o, n), n;
};
let c = class extends L {
  static get Style() {
    return (
      /* css */
      `
    :host {
      display: flex;
      flex-direction: column;
      align-self: flex-start;
      border: var(--io_border);
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing2));
      border-color: var(--io_borderColorOutset);
      background-color: var(--io_bgColorLight);
      padding: calc(var(--io_spacing) + var(--io_borderWidth));
      transition: opacity 0.3s ease-in-out;
      @apply --unselectable;
    }
    :host[horizontal] {
      padding: var(--io_spacing) 0;
      flex-direction: row;
      align-self: stretch;
    }
    :host[inoverlay] {
      overflow-y: auto;
      box-shadow: 1px 1px 16px var(--io_shadowColor),
                  1px 1px 8px var(--io_shadowColor), 
                  1px 1px 4px var(--io_shadowColor);
    }
    :host[inoverlay]:not([expanded]) {
      visibility: hidden;
      opacity: 0;
    }
    :host > io-menu-item[hidden] ~ span.divider {
      display: none;
    }
    :host > span.divider {
      flex: 0 0 0;
      border: var(--io_border);
      border-color: var(--io_borderColorInset);
      margin: var(--io_spacing) 0;
      opacity: 0.1;
    }
    :host[horizontal] > span.divider {
      margin: 0 var(--io_spacing);
    }
    :host[horizontal] > io-menu-item > .hint {
      display: none;
    }
    :host:not([horizontal]) > #search {
      margin: var(--io_spacing);
      margin-top: 0;
    }
    :host[horizontal] > #search {
      margin: 0 var(--io_spacing);
      flex: 0 0 10em;
    }
    `
    );
  }
  static get Listeners() {
    return {
      touchstart: ["stopPropagation"],
      "io-focus-to": "onIoFocusTo"
    };
  }
  get inoverlay() {
    return v.contains(this.parentElement);
  }
  constructor(e = {}) {
    super(e);
  }
  stopPropagation(e) {
    this.inoverlay && e.stopPropagation();
  }
  connectedCallback() {
    super.connectedCallback(), this.inoverlay && this.setAttribute("inoverlay", "true");
  }
  onIoFocusTo(e) {
    const t = e.detail.source, o = e.detail.command, i = X(t), n = i.indexOf(t), s = this.inoverlay;
    let r = !1, p = !1, h = !1, I = !1;
    if (this.$parent) {
      const M = this.getBoundingClientRect(), R = this.$parent.getBoundingClientRect();
      r = M.top > R.top, p = M.bottom < R.bottom, h = M.left > R.left, I = M.right < R.right;
    }
    let f = "";
    this.horizontal ? (o === "ArrowRight" && s && (f = "Next"), o === "ArrowLeft" && s && (f = "Prev"), o === "ArrowUp" && r && (f = "Out"), o === "ArrowDown" && p && (f = "Out")) : (o === "ArrowDown" && s && (f = "Next"), o === "ArrowUp" && s && (f = "Prev"), o === "ArrowLeft" && h && (f = "Out"), o === "ArrowRight" && I && (f = "Out")), o === "Tab" && s && (f = "Next"), f && (f === "Next" ? i[(n + 1) % i.length].focus() : f === "Prev" ? i[(n - 1 + i.length) % i.length].focus() : f === "Out" && this.$parent && this.$parent.focus(), e.stopPropagation());
  }
  collapse() {
    const e = this.contains(document.activeElement), t = this.searchable && !!this.search;
    S(this).forEach((o) => {
      o.expanded = !1;
    }), this.expanded = !1, t && e && !this.inoverlay && (this.search = "", this.$.search.focus());
  }
  expandedChanged() {
    this.expanded ? this.inoverlay && this.debounce(this.onExpandInOverlay) : (this.style.top = "", this.style.height = "", this.scrollTop = 0, this.search = "");
  }
  searchChanged() {
    this.inoverlay && this.$parent && this.debounce(this.onExpandInOverlay);
  }
  // TODO: Move functionality to Overlay
  onExpandInOverlay() {
    this.$parent && Z(this, this.$parent, this.direction, !0);
  }
  changed() {
    const e = this.widget ? [this.widget] : [];
    if (this.searchable && e.push(J({
      id: "search",
      role: "search",
      value: this.bind("search"),
      placeholder: "Search",
      live: !0
    })), this.search) {
      const t = k(this.option, this.search, this.depth);
      if (t.length === 0)
        e.push(U({ label: "No matches" }));
      else
        for (let o = 0; o < t.length; o++)
          e.push(A({ option: t[o], depth: 0 })), o < t.length - 1 && e.push({ tag: "span", props: { class: "divider" } });
    } else {
      let t = this.horizontal ? "down" : "right";
      this.horizontal && this.direction === "up" && (t = "up");
      for (let o = 0; o < this.option.options.length; o++)
        e.push(A({
          option: this.option.options[o],
          direction: t,
          $parent: this,
          depth: this.depth
        })), o < this.option.options.length - 1 && e.push(F({ class: "divider" }));
    }
    this.render(e);
  }
};
m([
  l({ type: a })
], c.prototype, "option", 2);
m([
  l({ value: !1, reflect: !0 })
], c.prototype, "expanded", 2);
m([
  l({ value: !1, reflect: !0 })
], c.prototype, "horizontal", 2);
m([
  l(!1)
], c.prototype, "searchable", 2);
m([
  l("")
], c.prototype, "search", 2);
m([
  l({ value: "none", reflect: !0 })
], c.prototype, "direction", 2);
m([
  l(100)
], c.prototype, "depth", 2);
m([
  l({ value: "", reflect: !0 })
], c.prototype, "overflow", 2);
m([
  l(null)
], c.prototype, "widget", 2);
m([
  x()
], c.prototype, "$parent", 2);
m([
  x("listbox")
], c.prototype, "role", 2);
c = m([
  _
], c);
const De = function(e) {
  return c.vConstructor(e);
};
var he = Object.defineProperty, ce = Object.getOwnPropertyDescriptor, O = (e, t, o, i) => {
  for (var n = i > 1 ? void 0 : i ? ce(t, o) : t, s = e.length - 1, r; s >= 0; s--)
    (r = e[s]) && (n = (i ? r(t, o, n) : r(n)) || n);
  return i && n && he(t, o, n), n;
};
let H = -1, d, E;
function Y(e) {
  d = void 0, E = void 0;
}
function V(e) {
  if (clearTimeout(H), d = se(e), d && d !== E) {
    const t = Math.abs(e.movementY) - Math.abs(e.movementX), o = d.parentElement?.horizontal;
    E?.parentElement !== d.parentElement || (o ? t < -0.25 : t > 0.25) ? (E = d, d.focus()) : H = setTimeout(() => {
      E = d, d && d.focus();
    }, 250);
  }
}
function de(e) {
  d && d.onClick();
}
v.addEventListener("pointermove", V);
let g = class extends te {
  static get Style() {
    return (
      /* css */
      `
      :host > * {
        pointer-events: none;
        text-overflow: ellipsis;
      }
      :host > .label {
        flex: 1 1 auto;
        padding: 0 var(--io_spacing2);
      }
      :host > .hint {
        flex: 0 1 auto;
        opacity: 0.25;
        padding: 0 var(--io_spacing2);
      }
      :host > .hasmore {
        opacity: 0.5;
      }
    `
    );
  }
  static get Listeners() {
    return {
      click: "preventDefault",
      focus: "onFocus",
      blur: "onBlur"
    };
  }
  constructor(e = {}) {
    super(e);
  }
  preventDefault(e) {
    e.stopPropagation(), e.preventDefault();
  }
  get hasmore() {
    return this.option.options.length && this.depth > 0;
  }
  get inoverlay() {
    return v.contains(this.parentElement?.parentElement);
  }
  connectedCallback() {
    super.connectedCallback(), this.$options && v.appendChild(this.$options);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.$options && v.removeChild(this.$options);
  }
  onClick() {
    const e = this.option;
    this.hasmore ? this.expanded || (this.expanded = !0) : e.mode === "toggle" ? e.selected = !e.selected : (e.action && (e.action.apply(null, [e.value]), this.collapseRoot()), e.mode === "select" && (e.options.length && this.depth <= 0 ? e.selectDefault() : e.selected = !0, this.collapseRoot())), z(this).dispatch("io-menu-option-clicked", { option: e }, !0);
  }
  onPointerdown(e) {
    super.onPointerdown(e), e.pointerType !== "touch" && (this.setPointerCapture(e.pointerId), e.stopPropagation(), this.hasmore && (this.expanded = !0), Y.call(this, e));
  }
  onPointermove(e) {
    e.stopPropagation(), e.pointerType !== "touch" && V.call(this, e);
  }
  onPointerup(e) {
    super.onPointerup(e), e.stopPropagation(), this.onPointerupAction(e);
  }
  onPointerupAction(e) {
    this.onClick();
  }
  onFocus(e) {
    super.onFocus(e), this.hasmore && this.inoverlay && (this.expanded = !0);
    const t = S(z(this)), o = q(this);
    for (let i = t.length; i--; )
      t[i] !== this && t[i] !== this.$options && o.indexOf(t[i]) === -1 && t[i].expanded && t[i].collapse();
  }
  onBlur(e) {
    super.onBlur(e), this.debounce(this.onBlurDebounced);
  }
  onBlurDebounced() {
    if (this._disposed) return;
    const e = S(this), t = X(this), o = q(this), i = e.some((h) => h === document.activeElement), n = t.some((h) => h === document.activeElement), s = o.some((h) => h === document.activeElement), r = document.activeElement === document.body, p = !v.contains(document.activeElement);
    i || r || (s || n ? this.collapse() : p && this.collapseRoot());
  }
  onKeydown(e) {
    const t = this.inoverlay;
    let o = this.direction, i = !1, n = !1, s = !1, r = !1;
    if (this.expanded && this.$options) {
      const h = this.getBoundingClientRect(), I = this.$options.getBoundingClientRect();
      i = h.top > I.top, n = h.bottom < I.bottom, s = h.left > I.left, r = h.right < I.right;
    }
    o === "up" && n && (o = "down"), o === "down" && i && (o = "up"), o === "left" && r && (o = "right"), o === "right" && s && (o = "left");
    let p = null;
    if (e.key === "Enter" || e.key === " ")
      if (this.hasmore)
        p = "In";
      else {
        e.preventDefault(), this.onClick();
        return;
      }
    else e.key === "Backspace" ? p = "Out" : e.key === "Escape" ? p = "Collapse" : e.key === "ArrowLeft" && (t || this.expanded) ? this.hasmore && o === "left" ? p = "In" : o === "right" && (p = "Out") : e.key === "ArrowRight" && (t || this.expanded) ? this.hasmore && o === "right" ? p = "In" : o === "left" && (p = "Out") : e.key === "ArrowUp" && (t || this.expanded) ? this.hasmore && o === "up" ? p = "In" : o === "down" && (p = "Out") : e.key === "ArrowDown" && (t || this.expanded) && (this.hasmore && o === "down" ? p = "In" : o === "up" && (p = "Out"));
    if (p)
      switch (e.preventDefault(), p) {
        case "Collapse":
          this.collapseRoot();
          break;
        case "In":
          if (this.hasmore && (this.expanded = !0), this.$options && this.$options.children.length) {
            const h = this.$options.querySelector("[selected]");
            h ? h.focus() : this.$options.children[0].focus();
          }
          break;
        case "Out":
          this.$parent && this.$parent.$parent && (this.$parent.$parent.focus(), this.$parent.$parent.collapse());
          break;
      }
    else
      super.onKeydown(e);
  }
  collapse() {
    S(this).forEach((e) => {
      e.expanded = !1;
    }), this.expanded = !1;
  }
  collapseRoot() {
    z(this).collapse();
  }
  optionChanged() {
    this.setProperties({
      selected: this.option.selected,
      disabled: this.option.disabled
    }), this.initOptions();
  }
  optionMutated() {
    this.setProperties({
      selected: this.option.selected,
      disabled: this.option.disabled
    }), this.changed();
  }
  initOptions() {
    this.option.options && this.depth > 0 && (this.$options === void 0 ? this.$options = new c({
      expanded: this.bind("expanded"),
      depth: this.depth - 1,
      option: this.option,
      direction: this.direction,
      $parent: this
    }) : this.$options.option = this.option);
  }
  changed() {
    const e = this.icon || this.option.icon, t = this.label || this.option.label;
    this.render([
      this.hasmore && this.direction === "left" ? $({ value: "io:triangle_left", class: "hasmore" }) : null,
      this.hasmore && this.direction === "up" ? $({ value: "io:triangle_up", class: "hasmore" }) : null,
      e ? $({ value: e }) : null,
      t ? F({ class: "label" }, t) : null,
      this.option.hint ? F({ class: "hint" }, this.option.hint) : null,
      this.hasmore && this.direction === "right" ? $({ value: "io:triangle_right", class: "hasmore" }) : null,
      this.hasmore && this.direction === "down" ? $({ value: "io:triangle_down", class: "hasmore" }) : null
    ]);
  }
  dispose() {
    super.dispose(), delete this.$options;
  }
};
O([
  l({ type: a })
], g.prototype, "option", 2);
O([
  x("")
], g.prototype, "label", 2);
O([
  l({ value: !1, reflect: !0 })
], g.prototype, "expanded", 2);
O([
  l({ value: "right", reflect: !0 })
], g.prototype, "direction", 2);
O([
  l({ value: 1e3, reflect: !0 })
], g.prototype, "depth", 2);
O([
  x("false")
], g.prototype, "contentEditable", 2);
O([
  x()
], g.prototype, "$parent", 2);
g = O([
  _
], g);
const A = function(e) {
  return g.vConstructor(e);
};
var ue = Object.defineProperty, fe = Object.getOwnPropertyDescriptor, K = (e, t, o, i) => {
  for (var n = i > 1 ? void 0 : i ? fe(t, o) : t, s = e.length - 1, r; s >= 0; s--)
    (r = e[s]) && (n = (i ? r(t, o, n) : r(n)) || n);
  return i && n && ue(t, o, n), n;
};
let T = class extends g {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: flex;
        flex-shrink: 0;
      }
      :host > * {
        pointer-events: none;
        text-overflow: ellipsis;
      }
    `
    );
  }
  changed() {
    this.render([$({ value: "io:hamburger" })]);
  }
};
K([
  l({ value: "down", reflect: !0 })
], T.prototype, "direction", 2);
T = K([
  _
], T);
const Ae = T.vConstructor;
var ve = Object.defineProperty, me = Object.getOwnPropertyDescriptor, B = (e, t, o, i) => {
  for (var n = i > 1 ? void 0 : i ? me(t, o) : t, s = e.length - 1, r; s >= 0; s--)
    (r = e[s]) && (n = (i ? r(t, o, n) : r(n)) || n);
  return i && n && ve(t, o, n), n;
};
let P = class extends L {
  static get Style() {
    return (
      /* css */
      `
    :host {
      display: flex;
      flex-direction: column;
    }
    :host > io-boolean {
      overflow: visible;
      padding-left: var(--io_spacing3);
      padding-right: var(--io_spacing3);
    }
    :host > io-boolean:before {
      display: inline-block;
      width: var(--io_fontSize);
      content: "▸"
    }
    :host > io-boolean[value]:before {
      content: "▾"
    }
    :host > io-menu-tree {
      background: transparent;
      border: none;
      border-left: var(--io_border);
      border-color: var(--io_colorLight);
      margin-left: var(--io_spacing5);
    }
    `
    );
  }
  optionMutated() {
    this.option.selected && (this.expanded = this.option.selected);
  }
  changed() {
    this.render([
      oe({ icon: this.option.icon, true: this.option.label, false: this.option.label, value: this.bind("expanded") }),
      this.expanded ? Oe({ option: this.option, depth: this.depth + 1 }) : null
    ]);
  }
};
B([
  l(Number)
], P.prototype, "depth", 2);
B([
  l({ type: a })
], P.prototype, "option", 2);
B([
  l({ value: !1, type: Boolean, reflect: !0 })
], P.prototype, "expanded", 2);
B([
  x("region")
], P.prototype, "role", 2);
P = B([
  _
], P);
const ge = function(e) {
  return P.vConstructor(e);
};
var ye = Object.defineProperty, be = Object.getOwnPropertyDescriptor, w = (e, t, o, i) => {
  for (var n = i > 1 ? void 0 : i ? be(t, o) : t, s = e.length - 1, r; s >= 0; s--)
    (r = e[s]) && (n = (i ? r(t, o, n) : r(n)) || n);
  return i && n && ye(t, o, n), n;
};
function xe(e) {
  const t = JSON.stringify(e);
  let o = 0;
  for (let i = 0; i < t.length; i++)
    o = Math.imul(31, o) + t.charCodeAt(i) | 0;
  return "io-local-state-" + String(o);
}
function _e(e, t, o = 0) {
  const i = [];
  if (o <= t) for (let n = 0; n < e.options.length; n++) {
    const s = e.options[n];
    if (s.options.length) {
      const r = ee({ value: !1, storage: "local", key: xe(s) });
      s.selected === !0 && (r.value = !0), i.push(ge({ option: s, depth: o, expanded: r }));
    } else
      i.push(A({ option: s, depth: o }));
  }
  return i;
}
let y = class extends L {
  static get Style() {
    return (
      /* css */
      `
    :host {
      display: flex;
      flex-direction: column;
      align-self: flex-start;
      border: var(--io_border);
      border-radius: var(--io_borderRadius);
      border-color: var(--io_borderColorOutset);
      background-color: var(--io_bgColorLight);
      padding: var(--io_spacing);
      @apply --unselectable;
    }
    :host io-menu-tree {
      padding: 0 !important;
    }
    :host > io-menu-item {
      padding-left: var(--io_spacing);
      padding-right: var(--io_spacing3);
    }
    :host > io-menu-item[selected] {
      border-color: transparent var(--io_colorBlue) transparent transparent;
    }
    :host > io-menu-item:before {
      display: inline-block;
      width: var(--io_fontSize);
      content: ""
    }
    `
    );
  }
  constructor(e = {}) {
    super(e);
  }
  changed() {
    const e = this.widget ? [this.widget] : [];
    if (this.searchable && e.push(J({
      id: "search",
      role: "search",
      value: this.bind("search"),
      placeholder: "Search",
      live: !0
    })), this.search) {
      const t = k(this.option, this.search, this.depth);
      if (t.length === 0)
        e.push(U({ label: "No matches" }));
      else for (let o = 0; o < t.length; o++)
        e.push(A({ option: t[o], depth: 0 }));
    } else
      e.push(..._e(this.option, this.depth));
    this.render(e);
  }
};
w([
  l({ type: a })
], y.prototype, "option", 2);
w([
  l({ value: !1, type: Boolean })
], y.prototype, "searchable", 2);
w([
  l({ value: "", type: String })
], y.prototype, "search", 2);
w([
  l({ value: 1 / 0, type: Number })
], y.prototype, "depth", 2);
w([
  l(null)
], y.prototype, "widget", 2);
w([
  x()
], y.prototype, "$parent", 2);
w([
  x("listbox")
], y.prototype, "role", 2);
y = w([
  _
], y);
const Oe = function(e) {
  return y.vConstructor(e);
};
var we = Object.defineProperty, Ie = Object.getOwnPropertyDescriptor, C = (e, t, o, i) => {
  for (var n = i > 1 ? void 0 : i ? Ie(t, o) : t, s = e.length - 1, r; s >= 0; s--)
    (r = e[s]) && (n = (i ? r(t, o, n) : r(n)) || n);
  return i && n && we(t, o, n), n;
};
let b = class extends L {
  static get Style() {
    return (
      /* css */
      `
    :host {
      display: inline-block;
      text-align: center;
      border-radius: var(--io_borderRadius);
      border: var(--io_border);
      border-color: var(--io_borderColorOutset);
      background-color: var(--io_bgColorLight);
      background-image: var(--io_gradientOutset);
      text-align: left;
    }
    :host > io-menu-item {
      margin: calc(-1 * var(--io_borderWidth));
      background-color: transparent !important;
      border-color: transparent !important;
    }
    `
    );
  }
  constructor(e) {
    super(e);
  }
  // TODO: Consider triggering inputValue() only by user-input!
  onOptionSelected(e) {
    this._disposed || (this.selectBy === "value" ? this.inputValue(e.detail.option.value) : this.selectBy === "id" && this.inputValue(e.detail.option.id));
  }
  inputValue(e) {
    if (this.value !== e || typeof this.value == "object") {
      const t = this.value;
      this.setProperty("value", e), this.dispatch("value-input", { value: e, oldValue: t }, !1);
    }
  }
  optionChanged(e) {
    e.oldValue && e.oldValue.removeEventListener("option-selected", this.onOptionSelected), e.value && e.value.addEventListener("option-selected", this.onOptionSelected);
  }
  changed() {
    let e;
    this.selectBy === "value" ? e = this.option.findItemByValue(this.value) : this.selectBy === "id" && (e = this.option.findItemById(this.value));
    const t = e ? e.label : this.label || String(this.value);
    this.render([A({ option: this.option, label: t, icon: this.icon, direction: "down" })]);
  }
};
C([
  l({ value: void 0 })
], b.prototype, "value", 2);
C([
  l("")
], b.prototype, "label", 2);
C([
  l("")
], b.prototype, "icon", 2);
C([
  l("value")
], b.prototype, "selectBy", 2);
C([
  l({ type: a })
], b.prototype, "option", 2);
C([
  x("button")
], b.prototype, "role", 2);
b = C([
  _
], b);
const Le = function(e) {
  return b.vConstructor(e);
};
var Pe = Object.defineProperty, Ce = Object.getOwnPropertyDescriptor, N = (e, t, o, i) => {
  for (var n = i > 1 ? void 0 : i ? Ce(t, o) : t, s = e.length - 1, r; s >= 0; s--)
    (r = e[s]) && (n = (i ? r(t, o, n) : r(n)) || n);
  return i && n && Pe(t, o, n), n;
};
let D = class extends L {
  static get ReactiveProperties() {
    return {
      $options: null
    };
  }
  constructor(e) {
    super(e), this.$options = new c({
      expanded: this.bind("expanded"),
      option: this.option,
      $parent: this
    });
  }
  init() {
    this.collapse = this.collapse.bind(this);
  }
  optionChanged() {
    this.$options && (this.$options.option = this.option);
  }
  connectedCallback() {
    super.connectedCallback(), v.appendChild(this.$options), this.parentElement.addEventListener("pointerdown", this.onPointerdown), this.parentElement.addEventListener("click", this.onClick), this.parentElement.addEventListener("contextmenu", this.onContextmenu);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), v.removeChild(this.$options), this.parentElement.removeEventListener("pointerdown", this.onPointerdown), this.parentElement.removeEventListener("click", this.onClick), this.parentElement.removeEventListener("contextmenu", this.onContextmenu);
  }
  getBoundingClientRect() {
    return this.parentElement.getBoundingClientRect();
  }
  onContextmenu(e) {
    this.button === 2 && e.preventDefault();
  }
  onPointerdown(e) {
    e.stopPropagation(), this.$options.style.left = `${e.clientX}px`, this.$options.style.top = `${e.clientY}px`, this.parentElement.addEventListener("pointermove", this.onPointermove), this.parentElement.addEventListener("pointerleave", this.onPointerleave), this.parentElement.addEventListener("pointerup", this.onPointerup), clearTimeout(this._contextTimeout), e.pointerType !== "touch" ? e.button === this.button && (this.setPointerCapture(e.pointerId), this.expanded = !0) : (e.preventDefault(), this._contextTimeout = setTimeout(() => {
      this.setPointerCapture(e.pointerId), this.expanded = !0;
    }, 150)), Y.call(this, e);
  }
  onPointermove(e) {
    e.stopPropagation(), clearTimeout(this._contextTimeout), !(e.pointerType === "touch" && !this.expanded) && V.call(this, e);
  }
  onPointerup(e) {
    clearTimeout(this._contextTimeout), this.releasePointerCapture(e.pointerId), this.parentElement.removeEventListener("pointermove", this.onPointermove), this.parentElement.removeEventListener("pointerleave", this.onPointerleave), this.parentElement.removeEventListener("pointerup", this.onPointerup), de.call(this, e);
  }
  onPointerleave(e) {
    this.releasePointerCapture(e.pointerId), this.parentElement.removeEventListener("pointermove", this.onPointermove), this.parentElement.removeEventListener("pointerleave", this.onPointerleave), this.parentElement.removeEventListener("pointerup", this.onPointerup);
  }
  collapse() {
    v.collapse();
  }
};
N([
  l({ type: a })
], D.prototype, "option", 2);
N([
  l({ value: !1, reflect: !0 })
], D.prototype, "expanded", 2);
N([
  l(0)
], D.prototype, "button", 2);
D = N([
  _
], D);
const Be = function(e) {
  return D.vConstructor(e);
};
export {
  D as IoContextMenu,
  T as IoMenuHamburger,
  g as IoMenuItem,
  c as IoMenuOptions,
  y as IoMenuTree,
  P as IoMenuTreeBranch,
  b as IoOptionSelect,
  a as MenuOption,
  Be as ioContextMenu,
  Ae as ioMenuHamburger,
  A as ioMenuItem,
  De as ioMenuOptions,
  Oe as ioMenuTree,
  ge as ioMenuTreeBranch,
  Le as ioOptionSelect,
  Y as onOverlayPointerdown,
  V as onOverlayPointermove,
  de as onOverlayPointeup
};
//# sourceMappingURL=index.js.map
