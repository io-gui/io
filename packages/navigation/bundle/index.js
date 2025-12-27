import { ReactiveProperty as s, Property as g, IoElement as m, div as x, Register as v, span as C, disposeChildren as w } from "@io-gui/core";
import { ioBoolean as P } from "@io-gui/inputs";
import { MenuOption as T, ioMenuOptions as D, ioMenuTree as _ } from "@io-gui/menus";
var O = Object.defineProperty, N = Object.getOwnPropertyDescriptor, f = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? N(t, i) : t, h = e.length - 1, l; h >= 0; h--)
    (l = e[h]) && (r = (o ? l(t, i, r) : l(r)) || r);
  return o && r && O(t, i, r), r;
};
let d = class extends m {
  static get Style() {
    return (
      /* css */
      `
    :host {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      align-self: stretch;
      box-sizing: content-box;
      align-items: stretch;
      align-self: stretch;
      border: var(--io_border);
      border-radius: calc(var(--io_borderRadius) - var(--io_spacing));
      border-color: var(--io_borderColorOutset);
      min-height: var(--io_fieldHeight);
      background-color: var(--io_bgColorLight);
    }
    :host > io-boolean {
      flex: 0 0 auto;
      padding-left: 0;
      margin: var(--io_spacing) var(--io_spacing2);
      border-radius: 0;
      background-color: transparent;
    }
    :host > io-boolean:before {
      text-align: center;
      width: var(--io_lineHeight);
      margin-right: var(--io_spacing2);
      content: "▸"
    }
    :host > io-boolean[value]:before {
      content: "▾"
    }
    :host > div.io-collapsible-content {
      position: relative;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      overflow: auto;
      background-color: var(--io_bgColorStrong);
    }
    :host[direction=row] > div.io-collapsible-content {
      flex-direction: row;
    }
    :host > div.io-collapsible-content:not(:empty) {
      margin: var(--io_spacing);
      margin-top: 0;
      padding: var(--io_spacing);
      border-radius: var(--io_borderRadius);
    }
    `
    );
  }
  changed() {
    this.render([
      // TODO: consider implementing caching
      P({ icon: this.icon, true: this.label, false: this.label, value: this.bind("expanded") }),
      x({ class: "io-collapsible-content" }, this.expanded ? this.elements : [])
    ]);
  }
};
f([
  s(Array)
], d.prototype, "elements", 2);
f([
  s("")
], d.prototype, "label", 2);
f([
  s({ value: "column", reflect: !0 })
], d.prototype, "direction", 2);
f([
  s("")
], d.prototype, "icon", 2);
f([
  s({ value: !1, reflect: !0 })
], d.prototype, "expanded", 2);
f([
  g("region")
], d.prototype, "role", 2);
d = f([
  v
], d);
const H = function(e) {
  return d.vConstructor(e);
};
var I = Object.defineProperty, M = Object.getOwnPropertyDescriptor, a = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? M(t, i) : t, h = e.length - 1, l; h >= 0; h--)
    (l = e[h]) && (r = (o ? l(t, i, r) : l(r)) || r);
  return o && r && I(t, i, r), r;
};
const u = document.createElement("div"), y = {};
function S(e) {
  const t = new URL(e, String(window.location)).pathname;
  return new Promise((i) => {
    !e || y[t] ? i(t) : import(
      /* @vite-ignore */
      t
    ).then(() => {
      y[t] = !0, i(t);
    });
  });
}
let n = class extends m {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: flex;
        flex-direction: column;
        position: relative;
        overflow-y: auto !important;
        flex: 1 1 auto;
        justify-content: stretch;
      }
      @keyframes io-loading-spinner {
        to {
          transform: rotate(360deg);
        }
      }
      :host[loading]:after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 4em;
        height: 4em;
        margin-top: calc(-1 * var(--io_fieldHeight));
        margin-left: calc(-1 * var(--io_fieldHeight));
        border-radius: 50%;
        border: var(--io_border);
        border-color: var(--io_borderColorStrong);
        border-top-color: var(--io_colorBlue);
        animation: io-loading-spinner .6s linear infinite;
      }
    `
    );
  }
  static get Listeners() {
    return {
      scroll: "onScrollChanged"
    };
  }
  constructor(e = {}) {
    super(e);
  }
  init() {
    this.preacheNext = this.preacheNext.bind(this), this.startPreache = this.startPreache.bind(this), this.renderDebounced = this.renderDebounced.bind(this), this.anchorChangedDebounced = this.anchorChangedDebounced.bind(this), this.scrollToUnsuspend = this.scrollToUnsuspend.bind(this), this.onScrollUnsuspend = this.onScrollUnsuspend.bind(this);
  }
  anchorChanged() {
    this.scrollToSuspended || (this.onScrollSuspended = !0, this.debounce(this.onScrollUnsuspend, void 0, 120)), this.debounce(this.anchorChangedDebounced, void 0, 3);
  }
  anchorChangedDebounced() {
    const e = this.anchor.split("#")[1] || this.anchor;
    if (!e || this.scrollToSuspended) return;
    const t = this.querySelector(`[data-heading="${e}"]`);
    if (t) {
      const i = window.getComputedStyle(t), o = t.offsetTop - parseInt(i.marginTop);
      this.scrollTo({ top: o, behavior: "smooth" });
    } else
      this.scrollTo(0, 0);
  }
  scrollToUnsuspend() {
    this.scrollToSuspended = !1;
  }
  onScrollUnsuspend() {
    this.onScrollSuspended = !1;
  }
  onScrollChanged() {
    if (this.onScrollSuspended) return;
    const e = this.anchor.split("#")[1] || this.anchor, t = this.querySelectorAll("[data-heading]"), i = Array.from(t).reduce((o, r) => Math.abs(r.offsetTop - this.scrollTop) < Math.abs(o.offsetTop - this.scrollTop) ? r : o, t[0]);
    if (i) {
      const o = i.getAttribute("data-heading");
      o && o !== e && (this.scrollToSuspended = !0, this.anchor.split("#").length === 2 ? this.anchor = this.anchor.split("#")[0] + "#" + o : this.anchor = o, this.debounce(this.scrollToUnsuspend, void 0, 120));
    }
  }
  elementsChanged() {
    this.startPreache();
  }
  selectedChanged() {
    this.selected ? this.selected === "*" ? this.render(this.elements) : this.renderSelectedId(this.selected) : this.render([], this, !0), this.debounce(this.anchorChangedDebounced, void 0, 2);
  }
  renderSelectedId(e) {
    const t = this.caching === "proactive" || this.caching === "reactive";
    if (!e) {
      this.render([], this, t), this.scrollTo(0, 0);
      return;
    }
    if (e = e.split("#")[0], e === this.childNodes[0]?.id) return;
    this.render([], this, t), this.scrollTo(0, 0);
    const i = this.elements.find((r) => r.props?.id === e);
    if (!i) {
      console.warn(`IoSelector: Could not find elements with id: "${e}"!`), this.render([C(`Could not find elements with id: "${e}"!`)], this, t);
      return;
    }
    const o = i.props?.import;
    o ? (this.loading = !0, this._preaching = !1, S(o).then(() => {
      this.loading = !1, this.debounce(this.renderDebounced, i), this.debounce(this.startPreache);
    })) : this.debounce(this.renderDebounced, i);
  }
  renderDebounced(e) {
    const t = this.caching === "proactive" || this.caching === "reactive", i = e.props?.id, o = this._caches[i];
    t && o ? o.parentElement !== this && (this.firstChild && this.removeChild(this.firstChild), this.appendChild(o)) : (this.render([e], this, t), t && (this._caches[i] = this.childNodes[0]));
  }
  startPreache() {
    this.caching === "proactive" && !this._preaching && (this._preaching = !0, this.debounce(this.preacheNext));
  }
  preacheNext() {
    if (this._preaching) {
      for (let e = 0; e < this.elements.length; e++) {
        const t = this.elements[e], i = t.props, o = i.id;
        if (o && this._caches[o] === void 0)
          if (i.import) {
            S(i.import).then(() => {
              this._preaching && (this.render([t], u, !0), this._caches[o] = u.childNodes[0], u.removeChild(u.childNodes[0]), this.debounce(this.preacheNext), delete i.import);
            });
            return;
          } else {
            this.render([t], u, !0), this._caches[o] = u.childNodes[0], u.removeChild(u.childNodes[0]), this.debounce(this.preacheNext);
            return;
          }
      }
      this._preaching = !1;
    }
  }
  dispose() {
    for (const e in this._caches)
      this._caches[e].parentElement || w(this._caches[e]), delete this._caches[e];
    super.dispose();
  }
};
a([
  s(Array)
], n.prototype, "elements", 2);
a([
  s({ value: "", type: String })
], n.prototype, "selected", 2);
a([
  s({ value: "", type: String })
], n.prototype, "anchor", 2);
a([
  s({ value: "reactive", type: String })
], n.prototype, "caching", 2);
a([
  s({ value: !1, type: Boolean, reflect: !0 })
], n.prototype, "loading", 2);
a([
  g(Object)
], n.prototype, "_caches", 2);
a([
  g(!1)
], n.prototype, "_preaching", 2);
a([
  g(!1)
], n.prototype, "scrollToSuspended", 2);
a([
  g(!1)
], n.prototype, "onScrollSuspended", 2);
n = a([
  v
], n);
const b = function(e) {
  return n.vConstructor(e);
};
var U = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, p = (e, t, i, o) => {
  for (var r = o > 1 ? void 0 : o ? $(t, i) : t, h = e.length - 1, l; h >= 0; h--)
    (l = e[h]) && (r = (o ? l(t, i, r) : l(r)) || r);
  return o && r && U(t, i, r), r;
};
let c = class extends m {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
      }
      :host[menu=left],
      :host[menu=right] {
        flex-direction: row;
      }
      :host > io-menu-tree {
        align-self: stretch;
        flex: 0 0 auto;
        min-width: 10em;
        border: var(--io_border);
        overflow-y: auto;
        border-radius: 0;
      }
      :host[menu=left] > io-menu-tree {
        border-width: 0 var(--io_borderWidth) 0 0;
      }
      :host[menu=left] > io-menu-tree {
        border-width: 0 var(--io_borderWidth) 0 0;
      }
      :host > io-menu-options {
        border: none;
        border-bottom: var(--io_border);
        border-radius: 0;
      }
    `
    );
  }
  optionMutated() {
    this.changed();
  }
  changed() {
    const e = {
      option: this.option,
      widget: this.widget,
      depth: this.depth
    };
    let t = "";
    this.select === "shallow" && (t = this.option.selectedIDImmediate), this.select === "deep" && (t = this.option.selectedID), this.select === "all" && (t = "*"), this.select === "none" && (t = ""), this.menu === "top" ? this.render([
      D({ horizontal: !0, ...e }),
      b({ selected: t, anchor: this.bind("anchor"), caching: this.caching, elements: this.elements })
    ]) : this.menu === "left" ? this.render([
      _({ ...e }),
      b({ selected: t, anchor: this.bind("anchor"), caching: this.caching, elements: this.elements })
    ]) : this.menu === "right" && this.render([
      b({ selected: t, anchor: this.bind("anchor"), caching: this.caching, elements: this.elements }),
      _({ ...e })
    ]);
  }
};
p([
  s(Array)
], c.prototype, "elements", 2);
p([
  s({ type: T })
], c.prototype, "option", 2);
p([
  s(null)
], c.prototype, "widget", 2);
p([
  s({ value: "left", type: String, reflect: !0 })
], c.prototype, "menu", 2);
p([
  s({ value: 1 / 0, type: Number })
], c.prototype, "depth", 2);
p([
  s({ value: "shallow", type: String })
], c.prototype, "select", 2);
p([
  s({ value: "none", type: String })
], c.prototype, "caching", 2);
p([
  s({ value: "", type: String })
], c.prototype, "anchor", 2);
c = p([
  v
], c);
const R = function(e) {
  return c.vConstructor(e);
};
export {
  d as IoCollapsible,
  c as IoNavigator,
  n as IoSelector,
  H as ioCollapsible,
  R as ioNavigator,
  b as ioSelector
};
//# sourceMappingURL=index.js.map
