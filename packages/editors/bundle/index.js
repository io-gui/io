import { ReactiveProperty as s, IoElement as I, Register as C, HTML_ELEMENTS as te, div as F, span as V, Storage as oe, Property as q, Node as ie, IoGl as ne, Theme as re, Color as ae, IoOverlaySingleton as se, nudge as le } from "@io-gui/core";
import { ioNumber as A, ioBoolean as U, ioString as h, ioSwitch as ce, ioField as x, IoButton as ue, ioButton as G } from "@io-gui/inputs";
import { ioOptionSelect as p, MenuOption as d } from "@io-gui/menus";
import { ioNumberSlider as pe } from "@io-gui/sliders";
import { ioColorRgba as de } from "@io-gui/colors";
var he = Object.defineProperty, fe = Object.getOwnPropertyDescriptor, b = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? fe(t, i) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && he(t, i, o), o;
};
let f = class extends I {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: flex;
        flex: 1 1 auto;
      }
      :host > io-number {
        flex: 1 1 auto;
      }
      :host > *:not(:last-child) {
        margin-right: var(--io_spacing);
      }
      :host > io-boolicon {
        flex-shrink: 0;
        padding: var(--io_spacing);
      }
    `
    );
  }
  _ratios = {};
  _onNumberPointerDown(e) {
    const i = e.composedPath()[0].id;
    if (this._ratios = {}, this.linked && this.value[i] !== 0) {
      const n = this.value;
      for (const o of this.keys) this._ratios[o] = n[o] / n[i];
    }
  }
  _onNumberValueInput(e) {
    const t = e.composedPath()[0], i = Number(t.id);
    if (this.value[i] = e.detail.value, this.linked)
      for (const n of this.keys) {
        const o = this.value;
        n !== i && this._ratios[n] && (o[n] = o[i] * this._ratios[n]);
      }
    this.value._isNode || this.dispatchMutation(this.value), this.dispatch("value-input", { property: "value", value: this.value }, !1);
  }
  valueChanged() {
    this.keys.length = 0, this.keys = Array.from(Array(this.value.length).keys()), this.keys.find((e) => [0, 1, 2, 3].indexOf(e) === -1) && console.warn("IoVectorArray: Unrecognized vector type!");
  }
  valueMutated() {
    this.debounce(this.changed);
  }
  changed() {
    const e = [];
    for (const t of this.keys)
      this.value[t] !== void 0 && e.push(A({
        id: String(t),
        // Consider removing global id collisions
        value: this.value[t],
        conversion: this.conversion,
        step: this.step,
        min: this.min,
        max: this.max,
        ladder: this.ladder,
        "@pointerdown": this._onNumberPointerDown,
        "@value-input": this._onNumberValueInput
      }));
    e.push(this.linkable ? U({ value: this.bind("linked"), true: "io:link", false: "io:unlink" }) : null), this.render(e);
  }
};
b([
  s({ type: Array, init: null })
], f.prototype, "value", 2);
b([
  s(1)
], f.prototype, "conversion", 2);
b([
  s(1e-3)
], f.prototype, "step", 2);
b([
  s(-1 / 0)
], f.prototype, "min", 2);
b([
  s(1 / 0)
], f.prototype, "max", 2);
b([
  s(!1)
], f.prototype, "linkable", 2);
b([
  s(!1)
], f.prototype, "linked", 2);
b([
  s(!0)
], f.prototype, "ladder", 2);
b([
  s({ type: Array, init: null })
], f.prototype, "keys", 2);
f = b([
  C
], f);
const K = function(e) {
  return f.vConstructor(e);
}, ge = [
  "$",
  "ELEMENT_NODE",
  "ATTRIBUTE_NODE",
  "TEXT_NODE",
  "CDATA_SECTION_NODE",
  "ENTITY_REFERENCE_NODE",
  "ENTITY_NODE",
  "PROCESSING_INSTRUCTION_NODE",
  "COMMENT_NODE",
  "DOCUMENT_NODE",
  "DOCUMENT_TYPE_NODE",
  "DOCUMENT_FRAGMENT_NODE",
  "NOTATION_NODE",
  "DOCUMENT_POSITION_DISCONNECTED",
  "DOCUMENT_POSITION_PRECEDING",
  "DOCUMENT_POSITION_FOLLOWING",
  "DOCUMENT_POSITION_CONTAINS",
  "DOCUMENT_POSITION_CONTAINED_BY",
  "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC",
  // Event Handlers
  "onbeforecopy",
  "onbeforecut",
  "onbeforepaste",
  "onsearch",
  "onfullscreenchange",
  "onfullscreenerror",
  "onwebkitfullscreenchange",
  "onwebkitfullscreenerror",
  "namespaceURI",
  "onbeforexrselect",
  "onabort",
  "onbeforeinput",
  "onbeforematch",
  "onbeforetoggle",
  "onblur",
  "oncancel",
  "oncanplay",
  "oncanplaythrough",
  "onchange",
  "onclick",
  "onclose",
  "oncontentvisibilityautostatechange",
  "oncontextlost",
  "oncontextmenu",
  "oncontextrestored",
  "oncuechange",
  "ondblclick",
  "ondrag",
  "ondragend",
  "ondragenter",
  "ondragleave",
  "ondragover",
  "ondragstart",
  "ondrop",
  "ondurationchange",
  "onemptied",
  "onended",
  "onerror",
  "onfocus",
  "onformdata",
  "oninput",
  "oninvalid",
  "onkeydown",
  "onkeypress",
  "onkeyup",
  "onload",
  "onloadeddata",
  "onloadedmetadata",
  "onloadstart",
  "onmousedown",
  "onmouseenter",
  "onmouseleave",
  "onmousemove",
  "onmouseout",
  "onmouseover",
  "onmouseup",
  "onmousewheel",
  "onpause",
  "onplay",
  "onplaying",
  "onprogress",
  "onratechange",
  "onreset",
  "onresize",
  "onscroll",
  "onsecuritypolicyviolation",
  "onseeked",
  "onseeking",
  "onselect",
  "onslotchange",
  "onstalled",
  "onsubmit",
  "onsuspend",
  "ontimeupdate",
  "ontoggle",
  "onvolumechange",
  "onwaiting",
  "onwebkitanimationend",
  "onwebkitanimationiteration",
  "onwebkitanimationstart",
  "onwebkittransitionend",
  "onwheel",
  "onauxclick",
  "ongotpointercapture",
  "onlostpointercapture",
  "onpointerdown",
  "onpointermove",
  "onpointerrawupdate",
  "onpointerup",
  "onpointercancel",
  "onpointerover",
  "onpointerout",
  "onpointerenter",
  "onpointerleave",
  "onselectstart",
  "onselectionchange",
  "onanimationend",
  "onanimationiteration",
  "onanimationstart",
  "ontransitionrun",
  "ontransitionstart",
  "ontransitionend",
  "ontransitioncancel",
  "oncopy",
  "oncut",
  "onpaste",
  "oncommand",
  "onscrollend",
  "onscrollsnapchange",
  "onscrollsnapchangin",
  "onscrollsnapchanging",
  "onafterprint",
  "onbeforeprint",
  "onbeforeunload",
  "onhashchange",
  "onlanguagechange",
  "onmessage",
  "onmessageerror",
  "onoffline",
  "ononline",
  "onpagehide",
  "onpageshow",
  "onpopstate",
  "onrejectionhandled",
  "onstorage",
  "onunhandledrejection",
  "onunload",
  "onenterpictureinpicture",
  "onreadystatechange",
  "onpointerlockchange",
  "onpointerlockerror",
  "onfreeze",
  "onprerenderingchange",
  "onresume",
  "onvisibilitychange",
  "onleavepictureinpicture"
];
function T(e) {
  const t = [];
  let i = e;
  do
    if (Object.getOwnPropertyNames(i).forEach((o) => {
      t.indexOf(o) === -1 && typeof e[o] != "function" && !ge.includes(o) && t.push(o);
    }), i.constructor === Node) break;
  while (i = Object.getPrototypeOf(i));
  return t;
}
const z = /* @__PURE__ */ new Map([
  [Object, {
    Hidden: [new RegExp(/^_/)]
  }],
  [Node, {
    Main: [
      "textContent"
    ],
    Input: [
      "lang",
      "translate",
      "dir",
      "inert",
      "accessKey",
      "draggable",
      "writingSuggestions",
      "spellcheck",
      "autocapitalize",
      "editContext",
      "contentEditable",
      "enterKeyHint",
      "inputMode",
      "virtualKeyboardPolicy"
    ],
    Hierarchy: [
      "isConnected",
      "ownerDocument",
      "parentNode",
      "parentElement",
      "childNodes",
      "firstChild",
      "lastChild",
      "previousSibling",
      "nextSibling",
      "children",
      "firstElementChild",
      "lastElementChild",
      "childElementCount",
      "previousElementSibling",
      "nextElementSibling",
      "elementTiming"
    ],
    Layout: [
      "scrollTop",
      "scrollLeft",
      "scrollWidth",
      "scrollHeight",
      "clientTop",
      "clientLeft",
      "clientWidth",
      "clientHeight",
      "currentCSSZoom",
      "offsetParent",
      "offsetTop",
      "offsetLeft",
      "offsetWidth",
      "offsetHeight"
    ],
    Aria: [
      "role",
      "ariaAtomic",
      "ariaAutoComplete",
      "ariaBusy",
      "ariaBrailleLabel",
      "ariaBrailleRoleDescription",
      "ariaChecked",
      "ariaColCount",
      "ariaColIndex",
      "ariaColSpan",
      "ariaCurrent",
      "ariaDescription",
      "ariaDisabled",
      "ariaExpanded",
      "ariaHasPopup",
      "ariaHidden",
      "ariaInvalid",
      "ariaKeyShortcuts",
      "ariaLabel",
      "ariaLevel",
      "ariaLive",
      "ariaModal",
      "ariaMultiLine",
      "ariaMultiSelectable",
      "ariaOrientation",
      "ariaPlaceholder",
      "ariaPosInSet",
      "ariaPressed",
      "ariaReadOnly",
      "ariaRelevant",
      "ariaRequired",
      "ariaRoleDescription",
      "ariaRowCount",
      "ariaRowIndex",
      "ariaRowSpan",
      "ariaSelected",
      "ariaSetSize",
      "ariaSort",
      "ariaValueMax",
      "ariaValueMin",
      "ariaValueNow",
      "ariaValueText",
      "ariaColIndexText",
      "ariaRowIndexText",
      "ariaActiveDescendantElement",
      "ariaControlsElements",
      "ariaDescribedByElements",
      "ariaDetailsElements",
      "ariaErrorMessageElements",
      "ariaFlowToElements",
      "ariaLabelledByElements"
    ],
    Hidden: []
  }]
]);
function ve(e, t = /* @__PURE__ */ new Map()) {
  if (!e || !(e instanceof Object))
    return console.warn("`getEditorGroups` should be used with an Object instance"), {};
  const i = {
    Main: []
  };
  function n(r) {
    for (const [a, l] of r)
      if (e instanceof a)
        for (const c in l) {
          i[c] = i[c] || [], i[c].push(...l[c]);
          for (const y in i)
            if (y !== c)
              for (const E of l[c])
                i[y].includes(E) && i[y].splice(i[y].indexOf(E), 1);
        }
  }
  n(z), n(t);
  const o = {
    Main: []
  };
  for (const r of T(e)) {
    let a = !1;
    for (const l of Object.keys(i)) {
      o[l] = o[l] || [];
      for (const c of i[l])
        if (c === r) {
          o[l].push(r), a = !0;
          continue;
        } else c instanceof RegExp && c.test(r) && (o[l].push(r), a = !0);
    }
    a || o.Main.push(r);
  }
  return o;
}
function Be(e, t) {
  const i = z.get(e) || {};
  for (const n in t) {
    i[n] = i[n] || [], i[n].push(...t[n]);
    for (const o in i)
      if (o !== n)
        for (const r of t[n])
          i[o].includes(r) && i[o].splice(i[o].indexOf(r), 1);
  }
  z.set(e, i);
}
const Y = /* @__PURE__ */ new Map([
  // TODO: remove outerHTML debug view
  // [HTMLElement, {tag: 'io-property-editor', props: {properties: ['outerHTML'], config: new Map([
  //   [HTMLElement, [['outerHTML', div()]]]
  // ]), labeled: false}}],
]);
function me(e, t = /* @__PURE__ */ new Map()) {
  if (!e || !(e instanceof Object))
    return console.warn("`getEditorGroups` should be used with an Object instance"), null;
  function i(o) {
    let r = null;
    for (const [a, l] of o)
      e instanceof a && (r = l);
    return r;
  }
  let n = i(Y);
  return n = i(t) || n, n;
}
function We(e, t) {
  Y.set(e, t);
}
var ye = Object.defineProperty, be = Object.getOwnPropertyDescriptor, P = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? be(t, i) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && ye(t, i, o), o;
};
let m = class extends I {
  static get Style() {
    return (
      /* css */
      `
    :host {
      display: flex;
      flex-direction: column;
      color: var(--io_colorInput);
      background-color: var(--io_bgColor);
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing));
      font-size: var(--io_fontSize);
    }
    :host[orientation="horizontal"] {
      flex-direction: row;
    }
    :host > .row {
      display: flex;
      flex-direction: row;
      margin: var(--io_spacing);
      padding: var(--io_spacing) 0;
      border-radius: var(--io_borderRadius);
      margin-bottom: 0;
      background-color: var(--io_bgColorLight);
    }
    :host[orientation="horizontal"] > .row {
      flex-direction: column;
    }
    :host > .row:last-of-type {
      margin-bottom: var(--io_spacing);
    }
    :host > .row > span {
      padding: var(--io_borderWidth); /* TODO: verify correctness */
      margin: var(--io_spacing);
      margin-left: var(--io_spacing2);
      line-height: var(--io_lineHeight);
      height: var(--io_lineHeight);
      text-wrap: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    :host > .row > span:after {
      display: inline-block;
      margin-left: var(--io_spacing);
      opacity: 0.5;
      content: ':';
    }
    :host io-object {
      margin-right: var(--io_spacing);
    }
    `
    );
  }
  init() {
    this.changeThrottled = this.changeThrottled.bind(this), this._observedObjectProperties.push("value"), window.addEventListener("io-object-mutation", this.onPropertyMutated);
  }
  _onValueInput(e) {
    e.stopImmediatePropagation();
    const t = e.target.id;
    t !== void 0 ? (this.value[t] = e.detail.value, this.value._isNode || this.dispatchMutation(this.value)) : console.warn('IoPropertyEditor: "value-input" recieved from an input without a property id');
  }
  valueMutated() {
    this.changeThrottled();
  }
  changeThrottled() {
    this.throttle(this.changeThrottled);
  }
  changed() {
    const e = Oe(this.value, this.config), t = ve(this.value, this.groups), i = me(this.value, this.widgets), n = [], o = [];
    if (this.properties.length)
      n.push(...this.properties);
    else {
      if (i) {
        const l = {
          tag: i.tag,
          props: Object.assign({ value: this.value }, i.props),
          children: i.children
        };
        o.push(l);
      }
      n.push(...t.Main);
    }
    const r = T(this.value);
    for (let l = 0; l < n.length; l++)
      if (r.includes(n[l])) {
        const c = n[l], y = this.value[c], E = e[c].tag, ee = e[c].props || {}, k = { id: c, value: y, "@value-input": this._onValueInput };
        Object.assign(k, ee);
        let W;
        te.includes(E) && typeof y == "string" && (W = y), (E === "io-object" || E === "io-property-editor") && (k.config = k.config || this.config, k.groups = k.groups || this.groups), o.push(F({ class: "row" }, [
          this.labeled ? V(c) : null,
          { tag: E, props: k, children: W }
        ]));
      } else
        console.warn(`IoPropertyEditor: property "${n[l]}" not found in value`);
    const a = _e(this.value);
    if (!this.properties.length)
      for (const l in t)
        l !== "Main" && l !== "Hidden" && t[l].length && o.push(
          X({
            label: l,
            expanded: oe({ value: !1, storage: "local", key: a + "-" + l }),
            value: this.value,
            properties: t[l],
            config: this.config
          })
        );
    this.render(o);
  }
  dispose() {
    super.dispose(), window.removeEventListener("io-object-mutation", this.onPropertyMutated);
  }
};
P([
  s()
], m.prototype, "value", 2);
P([
  s({ type: Array, init: null })
], m.prototype, "properties", 2);
P([
  s(!0)
], m.prototype, "labeled", 2);
P([
  s({ type: String, value: "vertical", reflect: !0 })
], m.prototype, "orientation", 2);
P([
  s({ type: Map, init: null })
], m.prototype, "config", 2);
P([
  s({ type: Map, init: null })
], m.prototype, "groups", 2);
P([
  s({ type: Map, init: null })
], m.prototype, "widgets", 2);
m = P([
  C
], m);
const J = function(e) {
  return m.vConstructor(e);
};
function _e(e) {
  let t = "io-object-collapse-state-" + e.constructor.name;
  t += "-" + (e.guid || e.uuid || e.id || "");
  const i = JSON.stringify(Object.keys(e));
  let n = 0;
  for (let o = 0; o < i.length; o++)
    n = (n << 5) - n + i.charCodeAt(o), n |= 0;
  return n = (-n).toString(16), t += "-" + n, t;
}
var we = Object.defineProperty, xe = Object.getOwnPropertyDescriptor, _ = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? xe(t, i) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && we(t, i, o), o;
};
let g = class extends I {
  static get Style() {
    return (
      /* css */
      `
    :host {
      display: flex;
      flex-direction: column;
      color: var(--io_colorInput);
      background-color: var(--io_bgColor);
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing));
    }
    :host > io-boolean {
      padding: var(--io_spacing) var(--io_spacing2);
      align-self: stretch;
    }
    :host > io-boolean:before {
      display: inline-block;
      width: 0.75em;
      content: "▸"
    }
    :host > io-boolean[value]:before {
      content: "▾";
    }
    :host > io-property-editor {
      margin: var(--io_spacing);
      border: var(--io_border);
      border-color: var(--io_borderColorInset);
    }
    `
    );
  }
  changed() {
    const e = this.label || this.value.constructor.name, t = [];
    t.push(U(
      {
        appearance: "neutral",
        true: e,
        false: e,
        value: this.bind("expanded")
      }
    )), this.expanded && t.push(J({
      value: this.value,
      properties: this.properties,
      config: this.config,
      groups: this.groups,
      widgets: this.widgets,
      labeled: this.labeled
    })), this.render(t), this.setAttribute("aria-expanded", String(this.expanded));
  }
};
_([
  s({ type: Object })
], g.prototype, "value", 2);
_([
  s({ type: Array, init: null })
], g.prototype, "properties", 2);
_([
  s(!0)
], g.prototype, "labeled", 2);
_([
  s("")
], g.prototype, "label", 2);
_([
  s({ value: !1, reflect: !0 })
], g.prototype, "expanded", 2);
_([
  s({ type: Map, init: null })
], g.prototype, "config", 2);
_([
  s({ type: Map, init: null })
], g.prototype, "groups", 2);
_([
  s({ type: Map, init: null })
], g.prototype, "widgets", 2);
_([
  q("region")
], g.prototype, "role", 2);
g = _([
  C
], g);
const X = function(e) {
  return g.vConstructor(e);
};
function u(e) {
  for (let i = 0; i < e.length; i++)
    e[i] === null && (e[i] = { value: null, id: "Null" });
  const t = new d({ options: e });
  return p({ option: t });
}
const R = /* @__PURE__ */ new Map([
  [Object, [
    [String, h()],
    [Number, A({ step: 0.01 })],
    [Boolean, ce()],
    [Object, X()],
    [null, x({ disabled: !0 })],
    [void 0, x({ disabled: !0 })]
  ]],
  [Array, [
    [Number, A({ step: 0.01 })]
  ]],
  [window.Node, [
    ["tabIndex", p({ option: new d({ options: [{ value: "", id: "None" }, "-1", "0", "1", "2", "3"] }) })],
    ["innerHTML", h({ disabled: !0, style: { maxWidth: "10em" } })],
    //TODO
    ["outerHTML", h({ disabled: !0, style: { maxWidth: "10em" } })],
    //TODO
    ["autocapitalize", p({ option: new d({ options: ["off", "sentences", "words", "characters", { value: "", id: "None" }] }) })],
    ["writingSuggestions", p({ option: new d({ options: ["true", "false"] }) })],
    ["dir", p({ option: new d({ options: ["ltr", "rtl", "auto", { value: "", id: "None" }] }) })],
    ["virtualKeyboardPolicy", p({ option: new d({ options: ["manual", "auto", { value: "", id: "None" }] }) })],
    ["enterKeyHint", p({ option: new d({ options: ["enter", "done", "go", "next", "previous", "search", "send", { value: "", id: "None" }] }) })],
    ["contentEditable", p({ option: new d({ options: ["true", "false", "plaintext-only", "inherit"] }) })],
    ["inputMode", p({ option: new d({ options: ["decimal", "email", "numeric", "tel", "search", "url", "text", { value: "", id: "None" }] }) })],
    ["lang", p({ option: new d({ options: [
      { value: "", id: "None" },
      "ab",
      "aa",
      "af",
      "ak",
      "sq",
      "am",
      "ar",
      "an",
      "hy",
      "as",
      "av",
      "ae",
      "ay",
      "az",
      "bm",
      "ba",
      "eu",
      "be",
      "bn",
      "bh",
      "bi",
      "bs",
      "br",
      "bg",
      "my",
      "ca",
      "ch",
      "ce",
      "ny",
      "zh",
      "zh-ans",
      "zh-ant",
      "cv",
      "kw",
      "co",
      "cr",
      "hr",
      "cs",
      "da",
      "dv",
      "nl",
      "dz",
      "en",
      "eo",
      "et",
      "ee",
      "fo",
      "fj",
      "fi",
      "fr",
      "ff",
      "gl",
      "gd",
      "ka",
      "de",
      "el",
      "kl",
      "gn",
      "gu",
      "ht",
      "ha",
      "he",
      "hz",
      "hi",
      "ho",
      "hu",
      "is",
      "io",
      "ig",
      "id in",
      "ia",
      "ie",
      "iu",
      "ik",
      "ga",
      "it",
      "ja",
      "jv",
      "kn",
      "kr",
      "ks",
      "kk",
      "km",
      "ki",
      "rw",
      "rn",
      "ky",
      "kv",
      "kg",
      "ko",
      "ku",
      "kj",
      "lo",
      "la",
      "lv",
      "li",
      "ln",
      "lt",
      "lu",
      "lg",
      "lb",
      "gv",
      "mk",
      "mg",
      "ms",
      "ml",
      "mt",
      "mi",
      "mr",
      "mh",
      "mo",
      "mn",
      "na",
      "nv",
      "ng",
      "nd",
      "ne",
      "no",
      "nb",
      "nn",
      "oc",
      "oj",
      "cu",
      "or",
      "om",
      "os",
      "pi",
      "ps",
      "fa",
      "pl",
      "pt",
      "pa",
      "qu",
      "rm",
      "ro",
      "ru",
      "se",
      "sm",
      "sg",
      "sa",
      "sr",
      "sh",
      "st",
      "tn",
      "sn",
      "ii",
      "sd",
      "si",
      "ss",
      "sk",
      "sl",
      "so",
      "nr",
      "es",
      "su",
      "sw",
      "sv",
      "tl",
      "ty",
      "tg",
      "ta",
      "tt",
      "te",
      "th",
      "bo",
      "ti",
      "to",
      "ts",
      "tr",
      "tk",
      "tw",
      "ug",
      "uk",
      "ur",
      "uz",
      "ve",
      "vi",
      "vo",
      "wa",
      "cy",
      "wo",
      "fy",
      "xh",
      "yi",
      "ji",
      "yo",
      "za",
      "zu"
    ] }) })],
    ["role", p({ option: new d({ options: [
      "alert",
      "alertdialog",
      "application",
      "article",
      "banner",
      "button",
      "cell",
      "checkbox",
      "columnheader",
      "combobox",
      "complementary",
      "contentinfo",
      "definition",
      "dialog",
      "directory",
      "document",
      "feed",
      "figure",
      "form",
      "grid",
      "gridcell",
      "group",
      "heading",
      "img",
      "link",
      "list",
      "listbox",
      "listitem",
      "log",
      "main",
      "marquee",
      "math",
      "menu",
      "menubar",
      "menuitem",
      "menuitemcheckbox",
      "menuitemradio",
      "navigation",
      "none",
      "note",
      "option",
      "presentation",
      "progressbar",
      "radio",
      "radiogroup",
      "region",
      "row",
      "rowgroup",
      "rowheader",
      "scrollbar",
      "search",
      "searchbox",
      "separator",
      "slider",
      "spinbutton",
      "status",
      "switch",
      "tab",
      "table",
      "tablist",
      "tabpanel",
      "term",
      "textbox",
      "timer",
      "toolbar",
      "tooltip",
      "tree",
      "treegrid",
      "treeitem"
    ] }) })],
    ["ariaAtomic", u(["true", "false", null])],
    ["ariaAutoComplete", p({ option: new d({ options: ["inline", "list", "both", "none"] }) })],
    ["ariaBusy", u(["true", "false", null])],
    ["ariaBrailleLabel", h()],
    ["ariaBrailleRoleDescription", h()],
    ["ariaChecked", u(["true", "false", "mixed", null])],
    ["ariaColCount", u([...[...Array(32)].map((e, t) => t + 1), null])],
    ["ariaColIndex", u([...[...Array(32)].map((e, t) => t + 1), null])],
    ["ariaColSpan", u([...[...Array(32)].map((e, t) => t + 1), null])],
    ["ariaCurrent", u(["true", "false", "page", "step", "location", "date", "time", null])],
    ["ariaDescription", h()],
    ["ariaDisabled", u(["true", "false", null])],
    ["ariaExpanded", u(["true", "false", null])],
    ["ariaHasPopup", u(["true", "false", "menu", "listbox", "tree", "grid", "dialog", null])],
    ["ariaHidden", u(["true", "false", null])],
    ["ariaInvalid", u(["true", "false", "grammar", "spelling", null])],
    ["ariaKeyShortcuts", h()],
    ["ariaLabel", h()],
    ["ariaLevel", u([...[...Array(32)].map((e, t) => t + 1), null])],
    ["ariaLive", p({ option: new d({ options: ["assertive", "polite", "off"] }) })],
    ["ariaModal", u(["true", "false", null])],
    ["ariaMultiLine", u(["true", "false", null])],
    ["ariaMultiSelectable", u(["true", "false", null])],
    ["ariaOrientation", p({ option: new d({ options: ["horizontal", "vertical", "undefined"] }) })],
    ["ariaPlaceholder", h()],
    ["ariaPosInSet", u([...[...Array(32)].map((e, t) => t + 1), null])],
    ["ariaPressed", u(["true", "false", "mixed", null])],
    ["ariaReadOnly", u(["true", "false", null])],
    ["ariaRequired", u(["true", "false", null])],
    ["ariaRelevant", p({ option: new d({ options: ["additions", "all", "removals", "text"] }) })],
    ["ariaRoleDescription", h()],
    ["ariaRowCount", u([...[...Array(32)].map((e, t) => t + 1), null])],
    ["ariaRowIndex", u([...[...Array(32)].map((e, t) => t + 1), null])],
    ["ariaRowSpan", u([...[...Array(32)].map((e, t) => t + 1), null])],
    ["ariaSelected", u(["true", "false", null])],
    ["ariaSetSize", u([...[...Array(32)].map((e, t) => t + 1), null])],
    ["ariaSort", p({ option: new d({ options: ["none", "ascending", "descending", "other"] }) })],
    ["ariaValueMax", u([...[...Array(32)].map((e, t) => t + 1), null])],
    ["ariaValueMin", u([...[...Array(32)].map((e, t) => t + 1), null])],
    ["ariaValueNow", u([...[...Array(32)].map((e, t) => t + 1), null])],
    ["ariaValueText", h()],
    ["ariaColIndexText", h()],
    ["ariaRowIndexText", h()]
  ]],
  [Element, []],
  [HTMLElement, []],
  [ie, [
    ["reactivity", p({ option: new d({ options: ["none", "debounced", "immediate"] }) })]
  ]],
  [I, [
    ["reactivity", p({ option: new d({ options: ["none", "debounced", "immediate"] }) })]
  ]],
  [ne, [
    ["size", K({ step: 1 })],
    ["color", K({ step: 1 })]
  ]],
  [re, [
    [Number, pe({ step: 1, min: 0, max: 20 })],
    ["themeID", p({ option: new d({ options: ["light", "dark"] }) })],
    ["spacing2", x({ disabled: !0 })],
    ["spacing3", x({ disabled: !0 })],
    ["spacing5", x({ disabled: !0 })],
    ["spacing8", x({ disabled: !0 })],
    ["fieldHeight", x({ disabled: !0 })],
    [ae, de()]
  ]]
]);
R.forEach((e, t) => {
  const i = Object.getOwnPropertyDescriptors(t.prototype);
  for (const [n, o] of Object.entries(i)) {
    const r = o.writable !== !1, a = o.get !== void 0, l = o.set !== void 0;
    if (a && !l || !r) {
      const c = e.find((y) => y[0] === n);
      c ? (console.warn(t, `.${n} has getter but no setter or is not writable. Invalidating editor config.`), c.length = 0, c.push(n, x({ disabled: !0 }))) : e.push([n, x({ disabled: !0 })]);
    }
  }
});
function Oe(e, t = /* @__PURE__ */ new Map()) {
  if (!e || !(e instanceof Object))
    return console.warn("`getObjectConfig` should be used with an Object instance"), {};
  const i = /* @__PURE__ */ new Map();
  for (const [o, r] of R)
    if (e instanceof o)
      for (const [a, l] of r)
        i.set(a, l);
  for (const [o, r] of t)
    if (e instanceof o)
      for (const [a, l] of r)
        i.set(a, l);
  const n = {};
  for (const o of T(e)) {
    const r = e[o];
    for (const [a, l] of i) {
      let c;
      typeof a == "function" && r instanceof a || typeof a == "function" && r?.constructor === a ? c = l : typeof a == "string" && o === a ? typeof r == "object" && r !== null && l.tag === "io-field" || (c = l) : (a instanceof RegExp && a.test(o) || a === null && r === null || a === void 0 && r === void 0) && (c = l), c && (n[o] = c);
    }
  }
  for (const o of T(e)) {
    if (o === "textNode") continue;
    const r = e[o];
    n[o] || console.warn("No config found for", o, r);
  }
  return n;
}
function Ge(e, t) {
  const i = R.get(e) || [];
  for (const [n, o] of t) {
    const r = i.find((a) => a[0] === n);
    r ? r[1] = o : i.push([n, o]);
  }
  R.set(e, i);
}
var Ce = Object.defineProperty, Pe = Object.getOwnPropertyDescriptor, $ = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Pe(t, i) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && Ce(t, i, o), o;
};
let S = class extends ue {
  static get Style() {
    return (
      /* css */
      `
    :host {
      display: flex;
    }
    :host > span {
      color: var(--io_colorBlue);
      flex: 0 1 auto;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    :host:hover > span {
      text-decoration: underline;
    }
    `
    );
  }
  valueMutated() {
    this.changed();
  }
  changed() {
    let e = "";
    if (this.value instanceof Array ? e = `${this.value.constructor.name} (${this.value.length})` : e = `${this.value.constructor.name}`, this.showName) {
      const t = this.value.name || this.value.title || this.value.id;
      t && (e += ` "${t}"`);
    }
    this.render([V(e)]);
  }
};
$([
  s()
], S.prototype, "value", 2);
$([
  s({ value: !1, type: Boolean })
], S.prototype, "showName", 2);
$([
  s({ value: "neutral", type: String, reflect: !0 })
], S.prototype, "appearance", 2);
S = $([
  C
], S);
const Z = function(e) {
  return S.vConstructor(e);
};
var Ee = Object.defineProperty, Ne = Object.getOwnPropertyDescriptor, j = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Ne(t, i) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && Ee(t, i, o), o;
};
let N = class extends I {
  static get Style() {
    return (
      /* css */
      `
    :host {
      display: flex;
    }
    :host > div {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex: 1 1 auto;
      border: var(--io_border);
      border-color: var(--io_borderColorInset);
      border-radius: var(--io_borderRadius);
      background-color: var(--io_bgColorInput);
      overflow: hidden;
    }
    :host > io-button {
      padding-left: var(--io_spacing);
      padding-right: var(--io_spacing);
      margin: var(--io_borderWidth);
      flex: 0 0 auto;
    }
    :host:not([search]) > io-button.clear-button {
      display: none;
    }
    :host > div > io-property-link:last-of-type {
      flex-shrink: 0;
    }
    :host > div > io-property-link:last-of-type > span {
      flex-shrink: 0;
      text-overflow: clip;
    }
    :host > div > io-property-link:not(:first-of-type):before {
      content: '>';
      padding-right: calc(var(--io_fontSize) / 2);
      color: var(--io_colorStrong);
      opacity: 0.5;
    }
    :host > .search-input {
      flex: 0 0 auto;
      overflow: hidden;
      min-width: calc(var(--io_fieldHeight) + var(--io_borderWidth) * 2);
      height: calc(var(--io_fieldHeight) + var(--io_borderWidth) * 2);
      margin-left: var(--io_spacing);
    }
    :host > .search-input:empty::before {
      content: '🔍';
      font-size: 0.9em;
    }
    `
    );
  }
  valueChanged() {
    this._crumbs.length = 0, this._crumbs.push(this.value);
  }
  selectedChanged() {
    const e = this._crumbs.indexOf(this.selected);
    e !== -1 ? this._crumbs.length = e + 1 : this._crumbs.push(this.selected);
  }
  onClearSearch() {
    this.search = "";
  }
  changed() {
    const e = [];
    this._crumbs.length > 1 && e.push(G({
      icon: "io:arrow_left",
      class: "back-button",
      value: this._crumbs[this._crumbs.length - 2]
    }));
    const t = F();
    t.children = [];
    for (let i = Math.max(0, this._crumbs.length - 2); i < this._crumbs.length; i++)
      t.children.push(Z({
        value: this._crumbs[i],
        showName: i === this._crumbs.length - 1
      }));
    e.push(
      t,
      G({ icon: "io:close", class: "clear-button", action: this.onClearSearch }),
      h({ id: "search", class: "search-input", value: this.bind("search"), live: !0 })
    ), this.render(e);
  }
};
j([
  s({ type: Object, init: null })
], N.prototype, "value", 2);
j([
  s({ type: Object, init: null })
], N.prototype, "selected", 2);
j([
  s({ type: String, reflect: !0 })
], N.prototype, "search", 2);
j([
  q(Array)
], N.prototype, "_crumbs", 2);
N = j([
  C
], N);
const Ie = function(e) {
  return N.vConstructor(e);
};
var Me = Object.defineProperty, ke = Object.getOwnPropertyDescriptor, Q = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? ke(t, i) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && Me(t, i, o), o;
};
let L = class extends m {
  static get Style() {
    return (
      /* css */
      `
      :host {
        z-index: 2;
      }
      :host:not([expanded]) {
      visibility: hidden;
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
    (e.key === "Escape" || e.key === "Enter") && (e.preventDefault(), this.expanded = !1);
  }
  onIoFocusTo(e) {
    const t = e.detail.source, i = e.detail.command, n = Array.from(this.querySelectorAll('[tabindex="0"]')), o = [...n].indexOf(t);
    let r = "";
    this.horizontal ? (i === "ArrowRight" && (r = "next"), i === "ArrowLeft" && (r = "prev")) : (i === "ArrowDown" && (r = "next"), i === "ArrowUp" && (r = "prev")), r && (r === "next" ? n[(o + 1) % n.length].focus() : r === "prev" ? n[(o - 1 + n.length) % n.length].focus() : r === "out" && this.$parent && this.$parent.focus(), e.stopPropagation());
  }
  expand(e) {
    this.setProperties({
      value: e.value,
      properties: e.properties || [],
      labeled: e.labeled || !0,
      orientation: e.orientation || "vertical",
      config: e.config || /* @__PURE__ */ new Map(),
      groups: e.groups || /* @__PURE__ */ new Map(),
      widgets: e.widgets || /* @__PURE__ */ new Map(),
      expanded: !0
    }), this.onClose = e.onClose || null, le(this, e.source, e.direction), this.debounce(this.onExpand);
  }
  onExpand() {
    this.querySelector('[tabindex="0"]:not([inert])')?.focus();
  }
  expandedChanged() {
    this.expanded || (this.setProperties({
      value: {},
      properties: [],
      labeled: !0,
      orientation: "vertical",
      config: /* @__PURE__ */ new Map(),
      groups: /* @__PURE__ */ new Map(),
      widgets: /* @__PURE__ */ new Map()
    }), this.onClose && (this.onClose(), this.onClose = null));
  }
};
Q([
  s({ type: Boolean, value: !1, reflect: !0 })
], L.prototype, "expanded", 2);
L = Q([
  C
], L);
const Se = new L();
setTimeout(() => {
  se.appendChild(Se);
}, 100);
var Te = Object.defineProperty, De = Object.getOwnPropertyDescriptor, M = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? De(t, i) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && Te(t, i, o), o;
};
function H(e, t) {
  return e === t ? !0 : e instanceof Array ? e.some((i) => H(i, t)) : e instanceof Object ? Object.keys(e).some((i) => H(e[i], t)) : !1;
}
let O = class extends I {
  static get Style() {
    return (
      /* css */
      `
    :host {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      flex: 0 1 calc(var(--io_lineHeight) * 17.5);
      padding: var(--io_spacing);
      background-color: var(--io_bgColor);
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing));
    }
    :host > io-breadcrumbs {
      margin: 0 var(--io_spacing);
      z-index: 1;
    }
    :host > span {
      padding: var(--io_spacing) var(--io_spacing3);
      color: var(--io_colorStrong);
    }
    :host io-property-editor > .row > span {
      min-width: 6em;
      text-align: right;
    }
    `
    );
  }
  static get Listeners() {
    return {
      "io-button-clicked": "onLinkClicked"
    };
  }
  init() {
    this.changeThrottled = this.changeThrottled.bind(this), this._observedObjectProperties.push("value", "selected"), window.addEventListener("io-object-mutation", this.onPropertyMutated);
  }
  onLinkClicked(e) {
    e.stopPropagation();
    const t = e.detail.value, i = e.composedPath()[0];
    t && typeof t == "object" && (i.localName === "io-property-link" || i.className === "back-button") && this.setProperty("selected", t);
  }
  valueChanged() {
    this.selected = this.value;
  }
  valueMutated() {
    H(this.value, this.selected) || (this.selected = this.value), this.changed();
  }
  selectedMutated() {
    this.changed();
  }
  selectedChanged() {
    this.search = "";
  }
  changed() {
    this.throttle(this.changeThrottled, void 0, 1);
  }
  changeThrottled() {
    const e = [
      Ie({ value: this.value, selected: this.bind("selected"), search: this.bind("search") })
    ], t = new Map(this.config);
    t.has(Object) || t.set(Object, []), t.get(Object).push([Object, Z({ showName: !0 })]);
    const i = [];
    if (this.search)
      for (const n of T(this.selected))
        n.toLowerCase().includes(this.search.toLowerCase()) && i.push(n);
    this.search && i.length === 0 ? e.push(
      V(`No results found for "${this.search}"`)
    ) : e.push(
      J({
        value: this.selected,
        config: t,
        groups: this.groups,
        widgets: this.widgets,
        properties: i
      })
    ), this.render(e);
  }
  dispose() {
    super.dispose(), window.removeEventListener("io-object-mutation", this.onPropertyMutated);
  }
};
M([
  s()
], O.prototype, "value", 2);
M([
  s()
], O.prototype, "selected", 2);
M([
  s({ type: String })
], O.prototype, "search", 2);
M([
  s({ type: Map, init: null })
], O.prototype, "config", 2);
M([
  s({ type: Map, init: null })
], O.prototype, "groups", 2);
M([
  s({ type: Map, init: null })
], O.prototype, "widgets", 2);
O = M([
  C
], O);
const Ke = function(e) {
  return O.vConstructor(e);
};
var je = Object.defineProperty, Ae = Object.getOwnPropertyDescriptor, w = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Ae(t, i) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && je(t, i, o), o;
};
let v = class extends I {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: flex;
        flex: 1 1 auto;
      }
      :host > io-number {
        flex: 1 1 auto;
      }
      :host > *:not(:last-child) {
        margin-right: var(--io_spacing);
      }
      :host > io-boolicon {
        flex-shrink: 0;
        padding: var(--io_spacing);
      }
    `
    );
  }
  _ratios = {};
  _onNumberPointerDown(e) {
    const i = e.composedPath()[0].id;
    if (this._ratios = {}, this.linked && this.value[i] !== 0) {
      const n = this.value;
      for (const o of this.keys) this._ratios[o] = n[o] / n[i];
    }
  }
  _onNumberValueInput(e) {
    const i = e.composedPath()[0].id;
    if (this.value[i] = e.detail.value, this.linked)
      for (const n of this.keys) {
        const o = this.value;
        n !== i && this._ratios[n] && (o[n] = o[i] * this._ratios[n]);
      }
    this.value._isNode || this.dispatchMutation(this.value), this.dispatch("value-input", { property: "value", value: this.value }, !1);
  }
  valueChanged() {
    this.keys.length = 0, this.keys.push(...Object.keys(this.value).filter((e) => typeof this.value[e] == "number")), this.keys.find((e) => ["0", "1", "2", "3", "x", "y", "z", "w", "r", "g", "b", "a", "u", "v"].indexOf(e) === -1) && console.warn("IoVector: Unrecognized vector type!");
  }
  valueMutated() {
    this.debounce(this.changed);
  }
  changed() {
    const e = [];
    for (const t of this.keys)
      this.value[t] !== void 0 && e.push(A({
        id: t,
        value: this.value[t],
        conversion: this.conversion,
        step: this.step,
        min: this.min,
        max: this.max,
        ladder: this.ladder,
        "@pointerdown": this._onNumberPointerDown,
        "@value-input": this._onNumberValueInput
      }));
    e.push(this.linkable ? U({ value: this.bind("linked"), true: "io:link", false: "io:unlink" }) : null), this.render(e);
  }
};
w([
  s({ type: Object })
], v.prototype, "value", 2);
w([
  s(1)
], v.prototype, "conversion", 2);
w([
  s(1e-3)
], v.prototype, "step", 2);
w([
  s(-1 / 0)
], v.prototype, "min", 2);
w([
  s(1 / 0)
], v.prototype, "max", 2);
w([
  s(!1)
], v.prototype, "linkable", 2);
w([
  s(!1)
], v.prototype, "linked", 2);
w([
  s(!0)
], v.prototype, "ladder", 2);
w([
  s({ type: Array, init: null })
], v.prototype, "keys", 2);
v = w([
  C
], v);
const Fe = function(e) {
  return v.vConstructor(e);
};
var Re = Object.defineProperty, Le = Object.getOwnPropertyDescriptor, B = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Le(t, i) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && Re(t, i, o), o;
};
let D = class extends f {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: grid;
        align-self: stretch;
        justify-self: stretch;
        grid-gap: var(--io_spacing);
      }
      :host > *:not(:last-child) {
        margin-right: 0;
      }
      :host[columns="4"] {
        grid-template-columns: repeat(4, 1fr);
      }
      :host[columns="3"] {
        grid-template-columns: repeat(3, 1fr);
      }
      :host[columns="2"] {
        grid-template-columns: repeat(2, 1fr);
      }
    `
    );
  }
  _onNumberValueInput(e) {
    const t = e.composedPath()[0];
    this.value[t.id] = e.detail.value, this.value._isNode || this.dispatchMutation(this.value), this.dispatch("value-input", { property: "value", value: this.value }, !1);
  }
  valueChanged() {
    this.value.length === 4 && this.setProperties({
      keys: [0, 1, 2, 3],
      columns: 2
    }), this.value.length === 9 && this.setProperties({
      keys: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      columns: 3
    }), this.value.length === 16 && this.setProperties({
      keys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      columns: 4
    }), [4, 9, 16].indexOf(this.value.length) === -1 && console.warn("IoMatrix: Unrecognized matrix type!"), this.value.find((e) => typeof e != "number") && console.warn("IoMatrix: Unrecognized matrix type!"), this.keys.find((e) => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].indexOf(e) === -1) && console.warn("IoMatrix: Unrecognized matrix type!");
  }
};
B([
  s({ type: Array, init: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] })
], D.prototype, "value", 2);
B([
  s({ value: 4, reflect: !0 })
], D.prototype, "columns", 2);
D = B([
  C
], D);
const qe = function(e) {
  return D.vConstructor(e);
};
export {
  N as IoBreadcrumbs,
  Se as IoContextEditorSingleton,
  O as IoInspector,
  D as IoMatrix,
  g as IoObject,
  m as IoPropertyEditor,
  v as IoVector,
  f as IoVectorArray,
  ge as SKIPPED_PROPERTIES,
  T as getAllPropertyNames,
  Oe as getEditorConfig,
  ve as getEditorGroups,
  me as getEditorWidget,
  Ie as ioBreadcrumbs,
  Ke as ioInspector,
  qe as ioMatrix,
  X as ioObject,
  J as ioPropertyEditor,
  Fe as ioVector,
  K as ioVectorArray,
  Ge as registerEditorConfig,
  Be as registerEditorGroups,
  We as registerEditorWidget
};
//# sourceMappingURL=index.js.map
