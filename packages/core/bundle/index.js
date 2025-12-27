const we = function(t, e) {
  return typeof t == "number" && isNaN(t) && typeof e == "number" && isNaN(e);
}, at = (t, e) => t === e ? !0 : typeof t == "function" && typeof e == "function" ? t instanceof e || e instanceof t : !1;
class S {
  node;
  property;
  targets = [];
  targetProperties = /* @__PURE__ */ new WeakMap();
  /**
   * Creates a binding object for specified source `node` and `property`.
   * It attaches a `[propName]-changed` listener to the source node.
   * @param {Node | IoElement} node - Source node
   * @param {string} property - Name of the sourceproperty
   */
  constructor(e, i) {
    !e._isNode && !e._isIoElement && console.warn("Source node is not a Node or IoElement instance!"), e._reactiveProperties.has(i) || console.warn(`Source node does not have a reactive property "${i}"!`), this.node = e, this.property = i, this.onSourceChanged = this.onSourceChanged.bind(this), this.onTargetChanged = this.onTargetChanged.bind(this), this.node.addEventListener(`${this.property}-changed`, this.onSourceChanged);
  }
  set value(e) {
    this.node[this.property] = e;
  }
  get value() {
    return this.node[this.property];
  }
  /**
   * Adds a target node and property.
   * Sets itself as the binding reference on the target `ReactivePropertyInstance`.
   * Adds a `[propName]-changed` listener to the target node.
   * @param {Node | IoElement} target - Target node
   * @param {string} property - Target property
   */
  addTarget(e, i) {
    const s = this.getTargetProperties(e);
    if (!e._isNode && !e._isIoElement && console.warn("Target node is not a Node or IoElement instance!"), e._reactiveProperties.has(i) || console.warn(`Target node does not have a reactive property "${i}"!`), s.indexOf(i) !== -1 && console.error(`Target property "${i}" already added!`), this.targets.indexOf(e) === -1 && this.targets.push(e), s.indexOf(i) === -1) {
      s.push(i);
      const r = e._reactiveProperties.get(i);
      r.binding && r.binding !== this && (console.warn("Improper usage detected!"), console.info("Target property is already a target of another binding. Undinding previous binding!"), r.binding.removeTarget(e, i)), r.binding = this;
      {
        const o = this.node._reactiveProperties.get(this.property), n = o.value !== void 0 && r.value !== void 0 && typeof o.value != typeof r.value, a = o.type !== void 0 && r.type !== void 0 && !at(o.type, r.type);
        (n || a) && (console.warn(`Source property "${this.property}" does not match type of target property "${i}"!`), console.info(`Source "${this.property}" value: ${o.value} type: ${o.type} typeof: ${typeof o.value}`), console.info(`Target "${i}" value: ${r.value} type: ${r.type} typeof: ${typeof r.value}`));
      }
      e.addEventListener(`${i}-changed`, this.onTargetChanged), e.setProperty(i, this.value, !0);
    }
  }
  /**
   * Removes target node and property.
   * If `property` is not specified, it removes all target properties.
   * Removes binding reference from the target `ReactivePropertyInstance`.
   * Removes `[propName]-changed` listener from the target node.
   * @param {Node | IoElement} target - Target node
   * @param {string} property - Target property
   */
  removeTarget(e, i) {
    const s = this.getTargetProperties(e);
    if (i) {
      const r = s.indexOf(i);
      r === -1 && console.error("Target property not found!"), s.splice(r, 1);
      const o = e._reactiveProperties.get(i);
      o.binding !== this && console.error("Target property has a different binding!"), o.binding = void 0, e.removeEventListener(`${i}-changed`, this.onTargetChanged);
    } else {
      for (let r = s.length; r--; ) {
        const o = s[r], n = e._reactiveProperties.get(o);
        n.binding !== this && console.error("Target property has a different binding!"), n.binding = void 0, e.removeEventListener(`${o}-changed`, this.onTargetChanged);
      }
      s.length = 0;
    }
    s.length === 0 && this.targets.splice(this.targets.indexOf(e), 1);
  }
  /**
   * Event handler that updates source property when one of the targets emits `[propName]-changed` event.
   * @param {ChangeEvent} event - Property change event.
   */
  onTargetChanged(e) {
    this.targets.indexOf(e.target) === -1 && console.error("onTargetChanged() should never fire if target is not accounted for!");
    const i = this.value, s = e.detail.value;
    if (i !== s) {
      if (we(s, i)) return;
      this.node[this.property] = s;
    }
  }
  /**
   * Event handler that updates bound properties on target nodes when source node emits `[propName]-changed` event.
   * @param {ChangeEvent} event - Property change event.
   */
  onSourceChanged(e) {
    e.target !== this.node && console.error("onSourceChanged() should always originate form source node!");
    const i = e.detail.value;
    for (let s = this.targets.length; s--; ) {
      const r = this.targets[s], o = this.getTargetProperties(r);
      for (let n = o.length; n--; ) {
        const a = o[n], h = r[a];
        if (h !== i) {
          if (we(i, h)) continue;
          r[a] = i;
        }
      }
    }
  }
  /**
   * Returns a list of target properties for specified target node.
   * @param {Node | IoElement} target - Target node.
   * @return {Properties} list of target property names.
   */
  getTargetProperties(e) {
    return this.targetProperties.has(e) || this.targetProperties.set(e, []), this.targetProperties.get(e);
  }
  /**
   * Returns a JSON representation of the binding.
   * This is required for `JSON.stringify(protoProperties)` in `ProtoChain`.
   * @return {string} JSON representation of the binding.
   */
  toJSON() {
    const e = [];
    for (let i = 0; i < this.targets.length; i++) {
      const s = this.targets[i], r = this.getTargetProperties(s);
      e[i] = r;
    }
    return {
      node: this.node.constructor.name,
      property: this.property,
      targets: this.targets.map((i) => i.constructor.name),
      targetProperties: e
    };
  }
  /**
   * Disposes the binding and removes all targets and listeners.
   */
  dispose() {
    this.node.removeEventListener(`${this.property}-changed`, this.onSourceChanged);
    for (let e = this.targets.length; e--; )
      this.removeTarget(this.targets[e]);
    this.targets.length = 0, delete this.node, delete this.property, delete this.targets, delete this.targetProperties;
  }
}
class Me {
  dispatchedChange = !1;
  dispatching = !1;
  /**
   * Creates change queue for the specified owner instance of `Node`.
   * @param {Node} node - Owner node.
   */
  constructor(e) {
    this.changes = [], this.node = e, Object.defineProperty(this, "dispatch", {
      value: this.dispatch.bind(this),
      enumerable: !1,
      writable: !1,
      configurable: !1
    });
  }
  /**
   * Adds property change payload to the queue by specifying property name, previous and the new value.
   * If the change is already in the queue, the new value is updated in-queue.
   * If the new value is the same as the original value, the change is removed from the queue.
   * @param {string} property - Property name.
   * @param {any} value Property value.
   * @param {any} oldValue Old property value.
   */
  queue(e, i, s) {
    i === s && console.warn("ChangeQueue: queuing change with same value and oldValue!");
    const r = this.changes.findIndex((o) => o.property === e);
    r === -1 ? this.changes.push({ property: e, value: i, oldValue: s }) : i === this.changes[r].oldValue ? this.changes.splice(r, 1) : this.changes[r].value = i;
  }
  /**
   * Dispatches and clears the queue.
   * For each property change in the queue:
   *  - It executes node's `[propName]Changed(change)` change handler function if it is defined.
   *  - It fires the `'[propName]-changed'` `ChangeEvent` from the owner node with `Change` data as `event.detail`.
   * After all changes are dispatched it invokes `.changed()` function of the owner node instance and fires `'changed'` event.
   */
  dispatch() {
    if (this.dispatching === !0) {
      console.error("ChangeQueue: dispatching already in progress!");
      return;
    }
    this.dispatching = !0;
    const e = [];
    for (; this.changes.length; ) {
      const i = this.changes[0];
      this.changes.splice(0, 1);
      const s = i.property;
      i.value !== i.oldValue && (this.dispatchedChange = !0, this.node[s + "Changed"] && this.node[s + "Changed"](i), this.node.dispatch(s + "-changed", i), e.push(s));
    }
    this.dispatchedChange && (this.node.changed(), this.node._isNode && this.node.dispatchMutation(this.node, e)), this.dispatchedChange = !1, this.dispatching = !1;
  }
  /**
   * Clears the queue and removes the node reference for garbage collection.
   * Use this when node queue is no longer needed.
   */
  dispose() {
    this.changes.length = 0, delete this.node, delete this.changes;
  }
}
const je = (t) => Array.isArray(t) ? t : [t], ce = ["capture", "passive"], _e = (t, e) => {
  const i = e[0], s = e[1];
  {
    if (typeof i != "string" && typeof i != "function" && console.error("listenerFromDefinition: Listener must be a function or method name"), s)
      if (typeof s != "object")
        console.error("listenerFromDefinition: Listener options must be an object");
      else {
        const o = Object.keys(s).filter((n) => !ce.includes(n));
        o.length > 0 && console.error(`listenerFromDefinition: Invalid listener options: ${o.join(", ")}`);
      }
    typeof i == "string" && !(i in t) && console.error(`listenerFromDefinition: Method "${i}" not found on node`);
  }
  const r = typeof i == "string" ? t[i] : i;
  return s ? [r, s] : [r];
};
class ue {
  node;
  nodeIsEventTarget;
  protoListeners = {};
  propListeners = {};
  addedListeners = {};
  /**
   * Creates an instance of `EventDispatcher` for specified `Node` instance.
   * It initializes `protoListeners` from `ProtoChain`.
   * @param {Node | IoElement | EventTarget} node owner Node
   */
  constructor(e) {
    this.node = e, this.nodeIsEventTarget = e instanceof EventTarget, this.setProtoListeners(e);
  }
  /**
   * Sets `protoListeners` specified as `get Listeners()` class definitions.
   * Definitions from subclass replace the ones from parent class.
   * @param {Node | IoElement} node owner Node
   */
  setProtoListeners(e) {
    for (const i in e._protochain?.listeners) {
      for (let s = 0; s < e._protochain.listeners[i].length; s++) {
        const r = _e(e, e._protochain.listeners[i][s]);
        this.protoListeners[i] = [r];
      }
      if (this.nodeIsEventTarget && this.protoListeners[i]) {
        const s = this.protoListeners[i][0];
        EventTarget.prototype.addEventListener.call(this.node, i, s[0], s[1]);
      }
    }
  }
  /**
   * Sets `propListeners` specified as inline properties prefixed with "@".
   * It removes existing `propListeners` that are no longer specified and it replaces the ones that changed.
   * @param {Record<string, any>} properties - Inline properties
   */
  applyPropListeners(e) {
    const i = {};
    for (const r in e) {
      if (!r.startsWith("@")) continue;
      const o = r.slice(1), n = je(e[r]), a = _e(this.node, n);
      i[o] = [a];
    }
    const s = this.propListeners;
    for (const r in s)
      if (!i[r]) {
        if (this.nodeIsEventTarget) {
          const o = s[r][0];
          EventTarget.prototype.removeEventListener.call(this.node, r, o[0], o[1]);
        }
        delete s[r];
      }
    for (const r in i) {
      if (this.nodeIsEventTarget) {
        const o = i[r][0];
        if (s[r]) {
          const n = s[r][0];
          (n !== o || o[1] && JSON.stringify(n[1]) !== JSON.stringify(o[1])) && EventTarget.prototype.removeEventListener.call(this.node, r, n[0], n[1]);
        }
        EventTarget.prototype.addEventListener.call(this.node, r, o[0], o[1]);
      }
      s[r] = i[r];
    }
  }
  /**
   * Proxy for `addEventListener` method.
   * Adds an event listener to the node's `addedListeners` collection.
   * If the node is an EventTarget, also registers the listener with the DOM.
   * @param {string} name - Name of the event
   * @param {AnyEventListener} listener - Event listener handler
   * @param {AddEventListenerOptions} [options] - Event listener options
   */
  addEventListener(e, i, s) {
    if (typeof i != "function" && console.error("EventDispatcher.addEventListener: Invalid listener type - must be a function"), s)
      if (typeof s != "object")
        console.error("EventDispatcher.addEventListener: Invalid listener options type - must be an object");
      else {
        const n = Object.keys(s).filter((a) => !ce.includes(a));
        n.length > 0 && console.warn(`EventDispatcher.addEventListener: Invalid listener options: ${n.join(", ")}`);
      }
    if (this.addedListeners[e] || (this.addedListeners[e] = []), this.addedListeners[e].findIndex((n) => n[0] === i) !== -1) {
      console.warn(`EventDispatcher.addEventListener: Listener for '${e}' event already added`, this.node);
      return;
    }
    const o = s ? [i, s] : [i];
    this.addedListeners[e].push(o), this.nodeIsEventTarget && EventTarget.prototype.addEventListener.call(this.node, e, i, s);
  }
  /**
   * Proxy for `removeEventListener` method.
   * Removes an event listener from the node's `addedListeners` collection.
   * If `listener` is not specified it removes all listeners for specified `type`.
   * @param {string} name - Name of the event
   * @param {AnyEventListener} listener - Event listener handler
   * @param {AddEventListenerOptions} [options] - Event listener options
  */
  removeEventListener(e, i, s) {
    {
      if (i && typeof i != "function" && console.error("EventDispatcher.removeEventListener: Invalid listener type!"), s)
        if (typeof s != "object")
          console.error("EventDispatcher.removeEventListener: Invalid listener options type - must be an object");
        else {
          const r = Object.keys(s).filter((o) => !ce.includes(o));
          r.length > 0 && console.warn(`EventDispatcher.removeEventListener: Invalid listener options: ${r.join(", ")}`);
        }
      this.addedListeners[e] || console.error(`EventDispatcher.removeEventListener: Listener ${e} not found!`);
    }
    if (this.addedListeners[e]) {
      if (i) {
        const r = this.addedListeners[e].findIndex((o) => o[0] === i);
        r === -1 && console.error(`EventDispatcher.removeEventListener: Listener ${e} not found!`), r !== -1 && (this.addedListeners[e].splice(r, 1), this.nodeIsEventTarget && EventTarget.prototype.removeEventListener.call(this.node, e, i, s));
      } else {
        for (let r = 0; r < this.addedListeners[e].length; r++)
          if (this.nodeIsEventTarget) {
            const o = this.addedListeners[e][r];
            EventTarget.prototype.removeEventListener.call(this.node, e, o[0], o[1]);
          }
        this.addedListeners[e].length = 0;
      }
      this.addedListeners[e].length === 0 && delete this.addedListeners[e];
    }
  }
  /**
   * Shorthand for custom event dispatch.
   * @param {string} name - Name of the event
   * @param {any} detail - Event detail data
   * @param {boolean} [bubbles] - Makes event bubble
   * @param {Node | IoElement | EventTarget} [node] - Event target override to dispatch the event from
   */
  dispatchEvent(e, i, s = !0, r = this.node, o = []) {
    if (o = [...o, r], r instanceof EventTarget)
      EventTarget.prototype.dispatchEvent.call(r, new CustomEvent(e, { detail: i, bubbles: s, composed: !0, cancelable: !0 }));
    else {
      const n = { detail: i, target: r, path: o };
      if (this.protoListeners[e])
        for (let a = 0; a < this.protoListeners[e].length; a++)
          this.protoListeners[e][a][0].call(r, n);
      if (this.propListeners[e] && (this.propListeners[e].length > 1 && console.error(`EventDispatcher.dispathEvent: PropListeners[${e}] array too long!`), this.propListeners[e][0][0].call(r, n)), this.addedListeners[e])
        for (let a = 0; a < this.addedListeners[e].length; a++)
          this.addedListeners[e][a][0].call(r, n);
      if (s)
        for (const a of r._parents)
          a._isNode && a._eventDispatcher.dispatchEvent(e, i, s, a, o);
    }
  }
  /**
   * Disconnects all event listeners and removes all references for garbage collection.
   * Use this when node is discarded.
   */
  dispose() {
    for (const e in this.protoListeners) {
      if (this.nodeIsEventTarget)
        for (let i = 0; i < this.protoListeners[e].length; i++) {
          const s = this.protoListeners[e][i];
          EventTarget.prototype.removeEventListener.call(this.node, e, s[0], s[1]);
        }
      this.protoListeners[e].length = 0, delete this.protoListeners[e];
    }
    for (const e in this.propListeners) {
      if (this.nodeIsEventTarget) {
        const i = this.propListeners[e][0];
        EventTarget.prototype.removeEventListener.call(this.node, e, i[0], i[1]);
      }
      this.propListeners[e].length = 0, delete this.propListeners[e];
    }
    for (const e in this.addedListeners) {
      if (this.nodeIsEventTarget)
        for (let i = this.addedListeners[e].length; i--; ) {
          const s = this.addedListeners[e][i];
          EventTarget.prototype.removeEventListener.call(this.node, e, s[0], s[1]);
        }
      this.addedListeners[e].length = 0, delete this.addedListeners[e];
    }
    delete this.node, delete this.protoListeners, delete this.propListeners, delete this.addedListeners;
  }
}
class U extends Array {
  constructor(e, ...i) {
    super(...i), this.node = e, this.itemMutated = this.itemMutated.bind(this), this.dispatchMutation = this.dispatchMutation.bind(this), !e._isNode && !e._isIoElement && console.error("NodeArray constructor called with non-node!");
    const s = this, r = new Proxy(this, {
      get(o, n) {
        if (typeof n == "symbol")
          return o[n];
        const a = Number(n);
        return !isNaN(a) && a >= 0 ? o[a] : o[n];
      },
      set(o, n, a) {
        if (n === "length") {
          if (!s._isInternalOperation) {
            const d = o.length, p = Number(a);
            if (p < d)
              for (let y = p; y < d; y++) {
                const u = o[y];
                u._isNode && (u.removeEventListener("io-object-mutation", s.itemMutated), u.removeParent(s.node));
              }
            else if (p > d)
              return console.warn("NodeArray: cannot extend array with empty slots"), !0;
          }
          return o[n] = a, s._isInternalOperation || s.dispatchMutation(), !0;
        }
        const h = Number(n);
        if (!isNaN(h) && h >= 0) {
          const d = o[h];
          return d !== void 0 && d._isNode && !s._isInternalOperation && (d.removeEventListener("io-object-mutation", s.itemMutated), d.removeParent(s.node)), o[n] = a, a._isNode && !s._isInternalOperation && (a.addEventListener("io-object-mutation", s.itemMutated), a.addParent(s.node)), s._isInternalOperation || s.dispatchMutation(), !0;
        }
        return o[n] = a, !0;
      }
    });
    return Object.defineProperty(this, "proxy", { value: r, enumerable: !1, configurable: !1 }), r;
  }
  _isInternalOperation = !1;
  static get [Symbol.species]() {
    return Array;
  }
  // TODO: test!
  withInternalOperation(e) {
    this._isInternalOperation = !0;
    try {
      return e();
    } finally {
      this._isInternalOperation = !1;
    }
  }
  splice(e, i, ...s) {
    return this.withInternalOperation(() => {
      for (let o = e; o < e + i; o++) {
        const n = this[o];
        n._isNode && (n.removeEventListener("io-object-mutation", this.itemMutated), n.removeParent(this.node));
      }
      const r = super.splice(e, i, ...s);
      for (let o = e; o < e + s.length; o++) {
        const n = this[o];
        n._isNode && (n.addEventListener("io-object-mutation", this.itemMutated), n.addParent(this.node));
      }
      return (i || s.length) && this.dispatchMutation(), r;
    });
  }
  push(...e) {
    return this.withInternalOperation(() => {
      const i = super.push(...e);
      for (const s of e)
        s._isNode && (s.addEventListener("io-object-mutation", this.itemMutated), s.addParent(this.node));
      return e.length && this.dispatchMutation(), i;
    });
  }
  unshift(...e) {
    return this.withInternalOperation(() => {
      const i = super.unshift(...e);
      for (const s of e)
        s._isNode && (s.addEventListener("io-object-mutation", this.itemMutated), s.addParent(this.node));
      return e.length && this.dispatchMutation(), i;
    });
  }
  pop() {
    return this.withInternalOperation(() => {
      const e = super.pop();
      return e !== void 0 && e._isNode && (e.removeEventListener("io-object-mutation", this.itemMutated), e.removeParent(this.node)), e !== void 0 && this.dispatchMutation(), e;
    });
  }
  shift() {
    return this.withInternalOperation(() => {
      const e = super.shift();
      return e !== void 0 && e._isNode && (e.removeEventListener("io-object-mutation", this.itemMutated), e.removeParent(this.node)), e !== void 0 && this.dispatchMutation(), e;
    });
  }
  reverse() {
    return this.withInternalOperation(() => {
      const e = super.reverse();
      return e.length && this.dispatchMutation(), e;
    });
  }
  sort(e) {
    return this.withInternalOperation(() => {
      const i = super.sort(e);
      return i.length && this.dispatchMutation(), i;
    });
  }
  fill() {
    return console.warn("NodeArray: fill is not supported"), this;
  }
  copyWithin() {
    return console.warn("NodeArray: copyWithin is not supported"), this;
  }
  itemMutated(e) {
    this.node.dispatch("io-object-mutation", { object: this.proxy }, !1, window);
  }
  dispatchMutation() {
    this.node.dispatch("io-object-mutation", { object: this.proxy }, !1, window);
  }
}
class Pe {
  /**
   * Creates a property definition from various input types.
   * @param {ReactivePropertyDefinitionLoose} def Input definition which can be:
   * - `undefined` or `null`: Sets as value
   * - `AnyConstructor`: Sets as type
   * - `Binding`: Sets value from binding and stores binding reference
   * - `ReactivePropertyDefinition`: Copies all defined fields
   * - Other values: Sets as value
   * @example
   * new ReactiveProtoProperty(String) // {type: String}
   * new ReactiveProtoProperty('hello') // {value: 'hello'}
   * new ReactiveProtoProperty({value: 42, type: Number}) // {value: 42, type: Number}
   * new ReactiveProtoProperty(new Binding(node, 'value')) // {value: node.value, binding: ...}
   */
  constructor(e) {
    if (e == null)
      this.value = e;
    else if (typeof e == "function")
      this.type = e;
    else if (e instanceof S)
      this.value = e.value, this.binding = e;
    else if (e && e.constructor === Object) {
      const i = e;
      Object.hasOwn(i, "value") && (this.value = i.value), Object.hasOwn(i, "type") && (this.type = i.type), i.binding instanceof S && (this.binding = i.binding, this.value = this.binding.value), Object.hasOwn(i, "reflect") && (this.reflect = i.reflect), Object.hasOwn(i, "init") && (this.init = i.init);
    } else e && e.constructor === Object || (this.value = e);
  }
  /**
   * Assigns values of another ReactiveProtoProperty to itself, unless they are default values.
   * @param {ReactiveProtoProperty} protoProp Source ReactiveProtoProperty
   */
  assign(e) {
    Object.hasOwn(e, "value") && (this.value = e.value), Object.hasOwn(e, "type") && (this.type = e.type), Object.hasOwn(e, "reflect") && (this.reflect = e.reflect), Object.hasOwn(e, "init") && (this.init = e.init), Object.hasOwn(e, "binding") && (this.binding = e.binding);
  }
  /**
   * Creates a serializable representation of the property definition.
   * Handles special cases for better JSON serialization:
   * - Converts object values to their constructor names
   * - Converts function types to their names
   * - Only includes defined fields
   * @returns {object} A plain object suitable for JSON serialization
   */
  toJSON() {
    const e = {
      value: this.value,
      type: this.type,
      reflect: this.reflect,
      init: this.init,
      binding: this.binding
    };
    return e.value && typeof e.value == "object" && (e.value = e.value.constructor.name), e.type && typeof e.type == "function" && (e.type = e.type.name), e;
  }
}
function oe(t, e) {
  if (t === "this")
    return e;
  if (typeof t == "string" && t.startsWith("this.")) {
    const i = t.split(".");
    let s = e;
    for (let r = 1; r < i.length; r++)
      s = s[i[r]];
    if (s) return s;
    console.error(`ReactivePropertyInstance: Invalid path ${t}`);
  } else return t;
}
class lt {
  // Property value.
  value;
  // Constructor of the property value.
  type;
  // Binding object.
  binding;
  // Reflects to HTML attribute.
  reflect = !1;
  // Initialize property with provided constructor arguments. `null` prevents initialization.
  init = void 0;
  /**
   * Creates the property configuration object and copies values from `ReactiveProtoProperty`.
   * @param node owner Node instance
   * @param propDef ReactiveProtoProperty object
   */
  constructor(e, i) {
    if (Object.keys(i).forEach((s) => {
      ["value", "type", "reflect", "init", "binding"].indexOf(s) === -1 && console.warn(`ReactiveProtoProperty: Invalid field ${s}`);
    }), i.type !== void 0 && typeof i.type != "function" && console.warn('Incorrect type for "type" field'), i.type === U && i.init !== "this" && console.warn('NodeArray property should be initialized with "this"'), i.binding !== void 0 && i.binding.constructor !== S && console.warn('Incorrect type for "binding" field'), i.reflect !== void 0 && typeof i.reflect != "boolean" && console.error(`Invalid reflect field ${i.reflect}!`), this.value = i.value, this.type = i.type, this.binding = i.binding, typeof i.reflect == "boolean" && (this.reflect = i.reflect), i.init !== void 0 && (this.init = i.init), this.binding instanceof S)
      this.value = this.binding.value;
    else if (this.value === void 0) {
      if (this.type === Boolean) this.value = !1;
      else if (this.type === String) this.value = "";
      else if (this.type === Number) this.value = 0;
      else if (typeof this.type == "function" && this.init !== void 0)
        if (this.init instanceof Array) {
          const s = this.init.map((r) => oe(r, e));
          this.value = new this.type(...s);
        } else if (this.init instanceof Object) {
          const s = {};
          Object.keys(this.init).forEach((r) => {
            s[r] = oe(this.init[r], e);
          }), this.value = new this.type(s);
        } else if (this.init === null)
          this.value = new this.type();
        else {
          const s = oe(this.init, e);
          this.value = new this.type(s);
        }
    }
    this.value !== void 0 && this.init !== void 0 && ([String, Number, Boolean].indexOf(this.type) !== -1 ? (this.type === Boolean && typeof this.value != "boolean" || this.type === Number && typeof this.value != "number" || this.type === String && typeof this.value != "string") && console.warn(`Property: Uninitialized value for type "${this.type.name}"!`) : typeof this.type == "function" && !(this.value instanceof this.type) && console.warn(`Property: Incorrect value "${this.value}" for type "${this.type.name}"!`));
  }
}
const he = /* @__PURE__ */ new WeakMap(), de = /* @__PURE__ */ new WeakMap();
function ct(t = void 0) {
  return (e, i) => {
    const s = e.constructor, r = he.get(s) || {};
    he.set(s, r), r[i] = t;
  };
}
function P(t = {}) {
  return (e, i) => {
    const s = e.constructor, r = de.get(s) || {};
    de.set(s, r), r[i] = t;
  };
}
const Te = /* @__PURE__ */ new WeakMap();
function oi(t) {
  return (e) => {
    Object.defineProperty(e, "Style", {
      get() {
        return t;
      },
      configurable: !0,
      enumerable: !0
    }), Te.set(e, t);
  };
}
class $e {
  /**
   * Array of inherited class constructors
   */
  constructors = [];
  /**
   * Aggregated initial value for properties declared in `static get Properties()` or @Property() decorators
  */
  properties = {};
  /**
   * Aggregated reactive property definition declared in `static get ReactiveProperties()` or @ReactiveProperty() decorators
   */
  reactiveProperties = {};
  /**
   * Aggregated listener definition declared in `static get Listeners()`
   */
  listeners = {};
  /**
   * Aggregated CSS style definition declared in `static get Style()`
   */
  style = "";
  /**
   * Array of function names that start with "on[A-Z]" or "_on[A-Z]" for auto-binding.
   */
  handlers = [];
  /**
   * Creates an instance of `ProtoChain` for specified class constructor.
   * @param {NodeConstructor} ioNodeConstructor - Owner `Node` constructor.
   */
  constructor(e) {
    let i = e.prototype;
    for (; i && e !== HTMLElement && e !== Object; )
      this.constructors.push(e), i = Object.getPrototypeOf(i), e = i.constructor;
    let s = "", r = "";
    for (let o = this.constructors.length; o--; )
      e = this.constructors[o], this.addPropertiesFromDecorators(e), r = this.addProperties(e.Properties, r), this.addReactivePropertiesFromDecorators(e), s = this.addReactiveProperties(e.ReactiveProperties, s), this.addListeners(e.Listeners), this.addStyle(e.Style), this.addStyleFromDecorators(e), this.addHandlers(e.prototype);
    this.validateReactiveProperties();
  }
  /**
   * Auto-binds event handler methods (starting with 'on[A-Z]' or '_on[A-Z]') to preserve their 'this' context.
   * NOTE: Defining handlers as arrow functions will not work because they are not defined before constructor has finished.
   * @param {Node | IoElement} node - Target node instance
   */
  init(e) {
    for (let i = this.handlers.length; i--; )
      Object.defineProperty(e, this.handlers[i], {
        value: e[this.handlers[i]].bind(e),
        writable: !0,
        configurable: !0
      });
    this.constructors[0] !== e.constructor && console.error(`${e.constructor.name} not registered!
Use @Register decorator before using ${e.constructor.name} class!`);
  }
  /**
   * Adds properties defined in decorators to the properties array.
   * @param {NodeConstructor} ioNodeConstructor - Owner `Node` constructor.
   */
  addPropertiesFromDecorators(e) {
    const i = he.get(e);
    if (i) for (const s in i)
      this.properties[s] = i[s];
  }
  addProperties(e = {}, i = "") {
    const s = JSON.stringify(e);
    if (s !== i) {
      for (const r in e)
        this.properties[r] = e[r];
      i = s;
    }
    return i;
  }
  /**
   * Adds reactive properties defined in decorators to the properties array.
   * @param {NodeConstructor} ioNodeConstructor - Owner `Node` constructor.
   */
  addReactivePropertiesFromDecorators(e) {
    const i = de.get(e);
    if (i) for (const s in i) {
      const r = new Pe(i[s]);
      this.reactiveProperties[s] || (this.reactiveProperties[s] = r), this.reactiveProperties[s].assign(r);
    }
  }
  /**
   * Adds reactive properties from `static get ReactiveProperties()` to the properties array.
   * Only process properties if they differ from superclass.
   * This prevents 'static get ReactiveProperties()' from overriding subclass properties defined in decorators.
   * @param {ReactivePropertyDefinitions} properties - Properties to add
   * @param {string} prevHash - Previous properties hash
   * @returns {string} - Updated properties hash
   */
  addReactiveProperties(e = {}, i = "") {
    const s = {};
    for (const o in e)
      s[o] = new Pe(e[o]);
    const r = JSON.stringify(s);
    if (r !== i) {
      for (const o in e)
        this.reactiveProperties[o] ? this.reactiveProperties[o].assign(s[o]) : this.reactiveProperties[o] = s[o];
      i = r;
    }
    return i;
  }
  /**
   * Merges or appends a listener definitions to the existing listeners array.
   * @param {ListenerDefinitions} listenerDefs - Listener definitions to add
   */
  addListeners(e) {
    for (const i in e)
      if (e[i]) {
        const s = je(e[i]), r = this.listeners[i] = this.listeners[i] || [], o = r.findIndex((n) => n[0] === s[0]);
        o !== -1 ? r[o][1] ? r[o][1] = Object.assign(r[o][1], s[1]) : s[1] && (r[o][1] = s[1]) : r.push(s);
      }
  }
  /**
   * Adds a style string to the styles array.
   * @param {string} style - Style string to add
   */
  addStyle(e) {
    e && this.style.indexOf(e) === -1 && (this.style = this.style ? this.style + `
` + e : e);
  }
  /**
   * Adds style defined in decorators to the style string.
   * @param {NodeConstructor} ioNodeConstructor - Owner `Node` constructor.
   */
  addStyleFromDecorators(e) {
    const i = Te.get(e);
    i && (this.style = this.style ? this.style + `
` + i : i);
  }
  /**
   * Adds function names that start with "on[A-Z]" or "_on[A-Z]" to the handlers array.
   * @param {Node} proto - Prototype object to search for handlers
   */
  addHandlers(e) {
    const i = Object.getOwnPropertyNames(e);
    for (let s = 0; s < i.length; s++) {
      const r = i[s];
      if (/^on[A-Z]/.test(r) || /^_on[A-Z]/.test(r) || r.endsWith("Changed") || r.endsWith("Mutated") || r === "changed") {
        const o = Object.getOwnPropertyDescriptor(e, r);
        if (o === void 0 || o.get || o.set) continue;
        typeof e[r] == "function" && this.handlers.indexOf(r) === -1 && this.handlers.push(r);
      }
    }
  }
  /**
   * Validates reactive property definitions in debug mode.
   * Logs warnings for incorrect property definitions.
   * @returns {void}
   */
  validateReactiveProperties() {
    for (const e in this.reactiveProperties) {
      const i = this.reactiveProperties[e];
      if ([String, Number, Boolean].indexOf(i.type) !== -1)
        (i.type === Boolean && i.value !== void 0 && typeof i.value != "boolean" || i.type === Number && i.value !== void 0 && typeof i.value != "number" || i.type === String && i.value !== void 0 && typeof i.value != "string") && console.warn(`Reactive property "${e}" value "${i.value}" type for ${i.type.name} property!`);
      else {
        const s = i.value === null, r = i.value === void 0;
        typeof i.type == "function" && !(i.value instanceof i.type) && !s && !r && console.warn(`Reactive property "${e}" value "${i.value}" type for ${i.type.name} property!`);
      }
    }
  }
}
let C = 0;
const fe = [], ht = [], pe = /* @__PURE__ */ new WeakMap(), dt = /* @__PURE__ */ new WeakMap();
let E = fe, _ = pe;
async function ni() {
  return new Promise((t) => {
    E.push(t), _.set(t, {
      arg: void 0,
      node: void 0,
      frame: C + 1
    });
  });
}
function Re(t, e, i, s = 1) {
  if (E.indexOf(t) === -1 && E.push(t), !_.has(t))
    _.set(t, {
      arg: e,
      node: i,
      frame: C + s
    });
  else {
    const r = _.get(t);
    r.arg = e;
  }
}
function Ne(t, e, i, s = 1) {
  if (E.indexOf(t) === -1 && E.push(t), !_.has(t))
    _.set(t, {
      arg: e,
      node: i,
      frame: C + s
    });
  else {
    const r = _.get(t);
    r.arg = e, r.frame = C + s;
  }
}
function Ce() {
  C++;
  const t = E, e = _;
  E = E === fe ? ht : fe, _ = _ === pe ? dt : pe;
  for (let i = 0; i < t.length; i++) {
    const s = t[i], r = e.get(s);
    if (e.delete(s), r === void 0) {
      console.warn(s);
      continue;
    }
    if (r.frame > C) {
      E.indexOf(s) === -1 && E.push(s), _.has(s) || _.set(s, r);
      continue;
    }
    if (!r.node?._disposed)
      try {
        r.arg !== void 0 ? s(r.arg) : s();
      } catch (o) {
        console.error(o);
      }
  }
  t.length = 0, requestAnimationFrame(Ce);
}
requestAnimationFrame(Ce);
const Ee = /* @__PURE__ */ new WeakMap(), ke = function(t, e) {
  let i = Ee.get(t) || {};
  Ee.set(t, i);
  for (const s in e) {
    const r = s, o = e[r];
    if (o instanceof S && console.warn(`VDOM: Cannot set binding on "${t.localName}.${s}"`), Object.hasOwn(i, r) || (i[r] = t[r]), r === "style")
      for (const n in o)
        t.style.setProperty(n, o[n]);
    else r === "class" ? t.className = o : r.startsWith("data-") ? o === void 0 ? t.removeAttribute(r) : t.setAttribute(r, o) : o === void 0 ? t[r] = i[r] : t[r] = o;
    (o === void 0 || o === i[r]) && t.removeAttribute(r);
  }
  for (const s in i) {
    const r = s;
    Object.hasOwn(e, r) || (t[r] = i[r], t.removeAttribute(r));
  }
  t._eventDispatcher || Object.defineProperty(t, "_eventDispatcher", { enumerable: !1, configurable: !0, value: new ue(t) }), t._eventDispatcher.applyPropListeners(e);
}, Oe = function(t) {
  const e = t.props || {}, i = window.customElements ? window.customElements.get(t.tag) : null;
  if (i && i._isIoElement)
    return new i(e);
  const s = document.createElement(t.tag);
  return ke(s, e), s;
}, xe = function(t) {
  requestAnimationFrame(() => {
    const e = Array.from(t.querySelectorAll("*")).concat([t]);
    for (let i = e.length; i--; )
      typeof e[i].dispose == "function" ? e[i].dispose() : e[i]._eventDispatcher && (e[i]._eventDispatcher.dispose(), delete e[i]._eventDispatcher);
  });
}, ft = function(t) {
  const e = {};
  for (let i = 0; i < t.attributes.length; i++) {
    const s = t.attributes[i].name, r = t.getAttribute(s);
    r !== null && (e[s] = r);
  }
  return e;
}, pt = function(t) {
  const e = [];
  for (let i = 0; i < t.length; i++)
    e.push(De(t[i]));
  return e;
}, De = function(t) {
  return {
    tag: t.localName,
    props: ft(t),
    children: t.children.length > 0 ? pt(t.children) : t.textContent
  };
};
function F(t) {
  t.prototype.Register(t);
}
const ne = {}, ut = new RegExp("(\\/\\*[\\s\\S]*?\\*\\/)", "gi"), gt = new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi"), vt = new RegExp("((@media [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi"), Se = new RegExp("(( --[\\s\\S]*?): {([\\s\\S]*?)})", "gi"), bt = new RegExp("(@apply\\s.*?;)", "gi"), yt = new RegExp("((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})", "gi");
function mt(t, e) {
  let i = "";
  const s = e.match(Se);
  if (s)
    for (let n = 0; n < s.length; n++) {
      const a = s[n].split(": {"), h = a[0].replace(" --", "--"), d = a[1].replace(/}/g, "").trim().replace(/^ +/gm, "");
      ne[h] = d, i += s[n].replace(" --", ".").replace(": {", " {");
    }
  e = e.replace(Se, "");
  const r = e.match(bt);
  if (r)
    for (let n = 0; n < r.length; n++) {
      const a = r[n].split("@apply ")[1].replace(";", "");
      ne[a] ? e = e.replace(r[n], ne[a]) : console.warn("IoElement: cound not find mixin:", a);
    }
  {
    let n = e;
    n = n.replace(ut, ""), n = n.replace(gt, ""), n = n.replace(vt, "");
    const a = n.match(yt);
    a && a.forEach((h) => {
      h = h.trim(), h.startsWith(":host") || (console.warn(t + ': CSS Selector not prefixed with ":host"! This will cause style leakage!'), console.warn(h));
    });
  }
  e = i + e.replace(new RegExp(":host", "g"), t);
  const o = document.createElement("style");
  o.innerHTML = e, o.setAttribute("id", "io-style-" + t.replace("io-", "")), document.head.appendChild(o);
}
var wt = Object.defineProperty, _t = Object.getOwnPropertyDescriptor, ge = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? _t(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (s ? n(e, i, r) : n(r)) || r);
  return s && r && wt(e, i, r), r;
};
const Le = new ResizeObserver((t) => {
  for (const e of t) e.target.onResized();
});
let M = class extends HTMLElement {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: block;
        box-sizing: border-box;
        -webkit-touch-callout: none;
      }
      :host[hidden] {
        display: none;
      }
      --unselectable: {
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }
      --io_focus: {
        border-color: var(--io_colorWhite) !important;
        outline: var(--io_borderWidth) solid var(--io_borderColorBlue) !important;
        z-index: 1;
      }
    `
    );
  }
  static get ReactiveProperties() {
    return {};
  }
  static get Properties() {
    return {};
  }
  static get Listeners() {
    return {};
  }
  constructor(t = {}) {
    super(), this._protochain.init(this), Object.defineProperty(this, "_changeQueue", { enumerable: !1, configurable: !0, value: new Me(this) }), Object.defineProperty(this, "_reactiveProperties", { enumerable: !1, configurable: !0, value: /* @__PURE__ */ new Map() }), Object.defineProperty(this, "_bindings", { enumerable: !1, configurable: !0, value: /* @__PURE__ */ new Map() }), Object.defineProperty(this, "_eventDispatcher", { enumerable: !1, configurable: !0, value: new ue(this) }), Object.defineProperty(this, "_observedObjectProperties", { enumerable: !1, configurable: !0, value: [] }), Object.defineProperty(this, "_observedNodeProperties", { enumerable: !1, configurable: !0, value: [] }), this.init(), Fe(this), Be(this), this.applyProperties(t, !0), this.ready(), this.dispatchQueue();
  }
  // TODO: add types
  applyProperties(t, e = !1) {
    for (const i in t)
      if (this._reactiveProperties.has(i))
        this.setProperty(i, t[i], !0);
      else if (i === "class")
        this.className = t[i];
      else if (i === "style")
        for (const s in t[i])
          this.style[s] = t[i][s];
      else i.startsWith("data-") ? t[i] === void 0 ? this.removeAttribute(i) : this.setAttribute(i, t[i]) : i.startsWith("@") || (t[i] instanceof S && console.warn(`IoElement: Not a ReactiveProperty! Cannot set binding to "${i}" property on element "${this.localName}"`), this[i] = t[i], t[i] === void 0 && this.hasAttribute(i) && this.removeAttribute(i));
    this._eventDispatcher.applyPropListeners(t), e || this.dispatchQueue();
  }
  // TODO: add types
  setProperties(t) {
    Ve(this, t);
  }
  setProperty(t, e, i = !1) {
    if (this._disposed) return;
    Ue(this, t, e, i), this._reactiveProperties.get(t).reflect && this.setAttribute(t.toLowerCase(), e);
  }
  init() {
  }
  ready() {
  }
  changed() {
  }
  queue(t, e, i) {
    this._changeQueue.queue(t, e, i);
  }
  dispatchQueue(t = !1) {
    He(this, t);
  }
  throttle(t, e, i = 1) {
    Re(t, e, this, i);
  }
  debounce(t, e, i = 1) {
    Ne(t, e, this, i);
  }
  onPropertyMutated(t) {
    return ze(this, t);
  }
  dispatchMutation(t = this, e = []) {
    t._isNode || t._isIoElement ? this.dispatch("io-object-mutation", { object: t, properties: e }) : this.dispatch("io-object-mutation", { object: t, properties: e }, !1, window);
  }
  bind(t) {
    return Ge(this, t);
  }
  unbind(t) {
    qe(this, t);
  }
  addEventListener(t, e, i) {
    this._disposed || this._eventDispatcher.addEventListener(t, e, i);
  }
  removeEventListener(t, e, i) {
    this._disposed || this._eventDispatcher.removeEventListener(t, e, i);
  }
  dispatch(t, e = void 0, i = !1, s) {
    this._disposed || this._eventDispatcher.dispatchEvent(t, e, i, s);
  }
  dispose() {
    Je(this);
  }
  connectedCallback() {
    typeof this.onResized == "function" && Le.observe(this);
  }
  disconnectedCallback() {
    typeof this.onResized == "function" && Le.unobserve(this);
  }
  /**
   * Renders DOM from virtual DOM arrays.
   * @param {Array} vDOMElements - Array of VDOMElement[] children.
   * @param {HTMLElement} [host] - Optional template target.
   * @param {boolean} [noDispose] - Skip disposal of existing elements.
   */
  render(t, e, i) {
    e = e || this;
    const s = t.filter((r) => r !== null);
    this.$ = {}, this.traverse(s, e, i);
  }
  /**
   * Recurively traverses virtual DOM elements.
   * TODO: test element.traverse() function!
   * @param {Array} vDOMElements - Array of VDOMElements elements.
   * @param {HTMLElement} [host] - Optional template target.
   * @param {boolean} [noDispose] - Skip disposal of existing elements.
   */
  traverse(t, e, i) {
    const s = e.children;
    for (; s.length > t.length; ) {
      const r = s[s.length - 1];
      e.removeChild(r), i || xe(r);
    }
    for (let r = 0; r < s.length; r++) {
      const o = s[r];
      if (o.localName !== t[r].tag || i) {
        const n = o, a = Oe(t[r]);
        e.insertBefore(a, n), e.removeChild(n), i || xe(n);
      } else
        o.removeAttribute("className"), o.removeAttribute("style"), t[r].props && (o._isIoElement ? o.applyProperties(t[r].props) : ke(o, t[r].props));
    }
    if (s.length < t.length) {
      const r = document.createDocumentFragment();
      for (let o = s.length; o < t.length; o++) {
        const n = Oe(t[o]);
        r.appendChild(n);
      }
      e.appendChild(r);
    }
    for (let r = 0; r < t.length; r++) {
      const o = t[r], n = s[r];
      if (o.props?.id && (this.$[o.props.id] !== void 0 && console.warn("IoElement: Duplicate id in template."), this.$[o.props.id] = n), o.children !== void 0) {
        if (typeof o.children == "string")
          this._flattenTextNode(n), n._textNode.nodeValue = String(o.children);
        else if (o.children instanceof Array) {
          const a = o.children.filter((h) => h !== null);
          this.traverse(a, n, i);
        }
      }
    }
  }
  /**
  * Helper function to flatten textContent into a single TextNode.
  * Update textContent via TextNode is better for layout performance.
  * TODO: Consider using normalize()? Is it the same function?
  * @param {HTMLElement} element - Element to flatten.
  */
  _flattenTextNode(t) {
    if (t.childNodes.length === 0 && t.appendChild(document.createTextNode("")), t.childNodes[0].nodeName !== "#text" && (t.innerHTML = "", t.appendChild(document.createTextNode(""))), t._textNode = t.childNodes[0], t.childNodes.length > 1) {
      const e = t.textContent;
      for (let i = t.childNodes.length; i--; )
        i !== 0 && t.removeChild(t.childNodes[i]);
      t._textNode.nodeValue = e;
    }
  }
  /**
  * Alias for HTMLElement setAttribute where falsey values remove the attribute.
  * @param {string} attr - Attribute name.
  * @param {*} value - Attribute value.
  */
  setAttribute(t, e) {
    e === !0 ? HTMLElement.prototype.setAttribute.call(this, t, "") : e === !1 || e === "" ? this.removeAttribute(t) : (typeof e == "string" || typeof e == "number") && this.getAttribute(t) !== String(e) && HTMLElement.prototype.setAttribute.call(this, t, String(e));
  }
  /**
   * Returns a vDOM-like representation of the element with children and attributes. This feature is used in testing.
   */
  toVDOM() {
    return De(this);
  }
  Register(t) {
    Object.defineProperty(t.prototype, "_protochain", { value: new $e(t) });
    const e = t.name.replace(/([a-z])([A-Z,0-9])/g, "$1-$2").toLowerCase();
    Object.defineProperty(t, "localName", { value: e }), Object.defineProperty(t.prototype, "localName", { value: e }), Object.defineProperty(t, "_isIoElement", { enumerable: !1, value: !0, writable: !1 }), Object.defineProperty(t.prototype, "_isIoElement", { enumerable: !1, value: !0, writable: !1 }), Object.defineProperty(window, t.name, { value: t }), window.customElements.define(e, t), mt(e, t.prototype._protochain.style), Object.defineProperty(t, "vConstructor", { value: function(i, s) {
      const r = { tag: e };
      return i !== void 0 && (typeof i == "string" || i instanceof Array ? r.children = i : typeof i == "object" && (r.props = i), s !== void 0 && (typeof s == "string" || s instanceof Array) && (r.children = s)), r;
    } });
  }
};
ge([
  P({ type: String, value: "immediate" })
], M.prototype, "reactivity", 2);
ge([
  ct(Object)
], M.prototype, "$", 2);
M = ge([
  F
], M);
const ai = M.vConstructor;
var Pt = Object.defineProperty, Et = Object.getOwnPropertyDescriptor, We = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Et(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (s ? n(e, i, r) : n(r)) || r);
  return s && r && Pt(e, i, r), r;
};
const ae = {
  active: /* @__PURE__ */ new Set(),
  disposed: /* @__PURE__ */ new Set()
};
function Ot(t) {
  return typeof t == "object" && t !== null && !t._isNode;
}
let k = class extends Object {
  static get ReactiveProperties() {
    return {};
  }
  static get Properties() {
    return {};
  }
  static get Listeners() {
    return {};
  }
  constructor(t) {
    super(), this._protochain.init(this), Object.defineProperty(this, "_changeQueue", { enumerable: !1, configurable: !0, value: new Me(this) }), Object.defineProperty(this, "_reactiveProperties", { enumerable: !1, configurable: !0, value: /* @__PURE__ */ new Map() }), Object.defineProperty(this, "_bindings", { enumerable: !1, configurable: !0, value: /* @__PURE__ */ new Map() }), Object.defineProperty(this, "_eventDispatcher", { enumerable: !1, configurable: !0, value: new ue(this) }), Object.defineProperty(this, "_observedObjectProperties", { enumerable: !1, configurable: !0, value: [] }), Object.defineProperty(this, "_observedNodeProperties", { enumerable: !1, configurable: !0, value: [] }), Object.defineProperty(this, "_parents", { enumerable: !1, configurable: !0, value: [] }), this.init(), Fe(this), Be(this), this.applyProperties(typeof t == "object" ? t : {}, !0), ae.active.add(this), this.ready(), this.dispatchQueue();
  }
  // TODO: add types
  applyProperties(t, e = !1) {
    for (const i in t)
      this._reactiveProperties.has(i) ? this.setProperty(i, t[i], !0) : i.startsWith("@") || (this[i] = t[i], t[i] instanceof S && console.warn(`IoElement: Not a ReactiveProperty! Cannot set binding to "${i}" property on "${this.constructor.name}"`));
    this._eventDispatcher.applyPropListeners(t), e || this.dispatchQueue();
  }
  // TODO: add types
  setProperties(t) {
    Ve(this, t);
  }
  setProperty(t, e, i = !1) {
    this._disposed || Ue(this, t, e, i);
  }
  init() {
  }
  ready() {
  }
  changed() {
  }
  queue(t, e, i) {
    this._changeQueue.queue(t, e, i);
  }
  dispatchQueue(t = !1) {
    He(this, t);
  }
  throttle(t, e, i = 1) {
    Re(t, e, this, i);
  }
  debounce(t, e, i = 1) {
    Ne(t, e, this, i);
  }
  onPropertyMutated(t) {
    return ze(this, t);
  }
  dispatchMutation(t = this, e = []) {
    t._isNode || t._isIoElement ? this.dispatch("io-object-mutation", { object: t, properties: e }) : this.dispatch("io-object-mutation", { object: t, properties: e }, !1, window);
  }
  bind(t) {
    return Ge(this, t);
  }
  unbind(t) {
    qe(this, t);
  }
  addEventListener(t, e, i) {
    this._eventDispatcher.addEventListener(t, e, i);
  }
  removeEventListener(t, e, i) {
    this._eventDispatcher.removeEventListener(t, e, i);
  }
  dispatch(t, e = void 0, i = !1, s) {
    this._eventDispatcher.dispatchEvent(t, e, i, s);
  }
  // TODO: test!
  addParent(t) {
    t._isNode && this._parents.push(t);
  }
  removeParent(t) {
    t._isNode && (this._parents.includes(t) || console.error("Node.removeParent(): Parent not found!", t), this._parents.splice(this._parents.indexOf(t), 1));
  }
  dispose() {
    Je(this), ae.active.delete(this), ae.disposed.add(this);
  }
  Register(t) {
    Object.defineProperty(t, "_isNode", { enumerable: !1, value: !0, writable: !1 }), Object.defineProperty(t.prototype, "_isNode", { enumerable: !1, value: !0, writable: !1 }), Object.defineProperty(t, "_isIoElement", { enumerable: !1, value: !1, writable: !1 }), Object.defineProperty(t.prototype, "_isIoElement", { enumerable: !1, value: !1, writable: !1 }), Object.defineProperty(t.prototype, "_protochain", { value: new $e(t) });
  }
};
We([
  P({ type: String, value: "immediate" })
], k.prototype, "reactivity", 2);
k = We([
  F
], k);
function Fe(t) {
  for (const e in t._protochain.reactiveProperties) {
    Object.defineProperty(t, e, {
      get: function() {
        return t._reactiveProperties.get(e).value;
      },
      set: function(s) {
        t.setProperty(e, s);
      },
      configurable: !0,
      enumerable: !0
    });
    const i = new lt(t, t._protochain.reactiveProperties[e]);
    t._reactiveProperties.set(e, i), i.binding && i.binding.addTarget(t, e), Qe(t, e, i), xt(t, e, i), t instanceof M && i.reflect && i.value !== void 0 && i.value !== null && t.setAttribute(e, i.value);
  }
}
function Be(t) {
  for (const e in t._protochain.properties) {
    let i = t._protochain.properties[e];
    typeof i == "function" ? i = new i() : i instanceof Array ? i = i.slice() : typeof i == "object" && (i = Object.assign({}, i)), t[e] = i;
  }
}
function Ve(t, e) {
  for (const i in e) {
    if (!t._reactiveProperties.has(i)) {
      console.warn(`Property "${i}" is not defined`, t);
      continue;
    }
    t.setProperty(i, e[i], !0);
  }
  t.dispatchQueue();
}
function Ue(t, e, i, s = !1) {
  const r = t._reactiveProperties.get(e), o = r.value;
  if (i !== o) {
    const n = i instanceof S ? i : null;
    if (n) {
      const a = r.binding;
      if (n !== a) {
        a && a.removeTarget(t, e), n.addTarget(t, e);
        return;
      } else
        return;
    }
    if (Qe(t, e, r), r.type === U && i.constructor === Array) {
      const a = r.value;
      i.some((h) => !h._isNode) && console.error(`Node: Property "${e}" should be assigned as an Array of nodes!`, i), a.constructor !== U && console.error(`Node: Property "${e}" should be initialized as a NodeArray!`, a), a.withInternalOperation(() => {
        a.length = 0, a.push(...i), i.length === 0 && a.dispatchMutation();
      });
      return;
    }
    if (r.value = i, i !== o) {
      let a = !1, h = !1;
      t._reactiveProperties.forEach((d, p) => {
        d.value === i && p !== e && (a = !0), d.value === o && p !== e && (h = !0);
      }), i?._isNode && !a && (t._observedNodeProperties.push(e), i.addEventListener("io-object-mutation", t.onPropertyMutated), i.addParent(t)), o?._isNode && !h && !o._disposed && (t._observedNodeProperties.splice(t._observedNodeProperties.indexOf(e), 1), o.removeEventListener("io-object-mutation", t.onPropertyMutated), o.removeParent(t));
    }
    r.type === String ? typeof i != "string" && console.warn(`Wrong type of property "${e}". Value: "${i}". Expected type: ${r.type.name}`, t) : r.type === Number ? typeof i != "number" && console.warn(`Wrong type of property "${e}". Value: "${i}". Expected type: ${r.type.name}`, t) : r.type === Boolean ? typeof i != "boolean" && console.warn(`Wrong type of property "${e}". Value: "${i}". Expected type: ${r.type.name}`, t) : r.type === Array ? i instanceof Array || console.warn(`Wrong type of property "${e}". Value: "${i}". Expected type: ${r.type.name}`, t) : r.type === Object ? i instanceof Array && console.warn(`Wrong type of property "${e}". Value: "${JSON.stringify(i)}". Expected type: ${r.type.name}`, t) : r.type === U ? (i instanceof U || console.error(`Wrong type of property "${e}". Value: "${i}". Expected type: ${r.type.name}`, t), i.some((a) => !a._isNode) && console.error(`Wrong type of property "${e}". NodeArray items should be nodes!`, i)) : typeof r.type == "function" && (i instanceof r.type || console.warn(`Wrong type of property "${e}". Value: "${i}". Expected type: ${r.type.name}`, t)), o !== i && (t.queue(e, i, o), t.dispatchQueue(s));
  }
}
function He(t, e = !1) {
  t.reactivity === "debounced" || e || t._changeQueue.dispatching ? t.debounce(t._changeQueue.dispatch) : t.reactivity === "throttled" ? t.throttle(t._changeQueue.dispatch) : t.reactivity === "immediate" && t._changeQueue.dispatch(), ["immediate", "throttled", "debounced"].indexOf(t.reactivity) === -1 && console.warn(`Node.dispatchQueue(): Invalid reactivity property value: "${t.reactivity}". Expected one of: "immediate", "throttled", "debounced".`);
}
function ze(t, e) {
  const i = e.detail.object;
  let s = !1;
  const r = [.../* @__PURE__ */ new Set([...t._observedObjectProperties, ...t._observedNodeProperties])];
  for (let o = 0; o < r.length; o++) {
    const n = r[o];
    if (t._reactiveProperties.get(n).value === i) {
      const h = n + "Mutated";
      typeof t[h] == "function" && t[h](e), s = !0;
    }
  }
  return s;
}
function Qe(t, e, i) {
  t._observedObjectProperties.includes(e) || Ot(i.value) && (t._observedObjectProperties.push(e), t._observedObjectProperties.length === 1 && window.addEventListener("io-object-mutation", t.onPropertyMutated));
}
function xt(t, e, i) {
  if (i.value?._isNode) {
    let s = !1;
    t._reactiveProperties.forEach((r, o) => {
      r.value === i.value && o !== e && (s = !0);
    }), s || (t._observedNodeProperties.push(e), i.value.addEventListener("io-object-mutation", t.onPropertyMutated));
  }
}
function Ge(t, e) {
  return t._reactiveProperties.has(e) || console.warn(`IoGUI Node: cannot bind to ${e} property. Does not exist!`), t._bindings.has(e) || t._bindings.set(e, new S(t, e)), t._bindings.get(e);
}
function qe(t, e) {
  const i = t._bindings.get(e);
  i && (i.dispose(), t._bindings.delete(e)), t._reactiveProperties.get(e)?.binding?.removeTarget(t, e);
}
function Je(t) {
  if (t._disposed && console.warn("Node.dispose(): Already disposed!", t.constructor.name), t._disposed) return;
  t._bindings.forEach((i, s) => {
    i.dispose(), t._bindings.delete(s);
  }), delete t._bindings, t._observedObjectProperties.length && (window.removeEventListener("io-object-mutation", t.onPropertyMutated), t._observedObjectProperties.length = 0, delete t._observedObjectProperties), delete t._protochain, t._changeQueue.dispose(), delete t._changeQueue;
  let e = [];
  t._reactiveProperties.forEach((i, s) => {
    i.binding?.removeTarget(t, s), i.value?._isNode && !e.includes(i.value) && !i.value._disposed && (i.value.removeEventListener("io-object-mutation", t.onPropertyMutated), e.push(i.value));
  });
  for (const i in t._protochain.properties)
    delete t[i];
  t._eventDispatcher.dispose(), delete t._eventDispatcher, delete t._reactiveProperties, t._parents && (t._parents.length = 0, delete t._parents), Object.defineProperty(t, "_disposed", { value: !0 });
}
var St = Object.defineProperty, Lt = Object.getOwnPropertyDescriptor, ee = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Lt(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (s ? n(e, i, r) : n(r)) || r);
  return s && r && St(e, i, r), r;
};
class At {
  constructor() {
    Object.defineProperty(this, "store", { value: /* @__PURE__ */ new Map() }), Object.defineProperty(this, "warned", { value: !1, writable: !0 });
  }
  get permitted() {
    try {
      return self.localStorage.getItem("Storage:user-permitted") === "true";
    } catch {
      console.warn("Storage: Cannot access localStorage. Check browser privacy settings!");
    }
    return !1;
  }
  set permitted(e) {
    try {
      e ? (console.info("Storage: localStorage permission granted."), this.store.set("Storage:user-permitted", String(e)), this.store.forEach((i, s) => {
        self.localStorage.setItem(s, String(i)), this.store.delete(s);
      })) : (console.info("Storage: localStorage permission revoked."), self.localStorage.setItem("Storage:user-permitted", String(e)), new Map(Object.entries(self.localStorage)).forEach((i, s) => {
        this.store.set(s, i);
      }), self.localStorage.clear());
    } catch {
      console.warn("Storage: Cannot access localStorage. Check browser privacy settings!");
    }
  }
  setItem(e, i) {
    const s = typeof i == "object" ? JSON.stringify(i) : String(i);
    if (e === "Storage:user-permitted") {
      this.permitted = i === "true";
      return;
    }
    this.permitted ? self.localStorage.setItem(e, s) : (this.store.set(e, s), !this.warned && !this.permitted && (console.warn("Storage: localStorage permission not set."), this.warned = !0));
  }
  getItem(e) {
    return this.permitted ? self.localStorage.getItem(e) : this.store.has(e) ? this.store.get(e) : null;
  }
  removeItem(e) {
    if (this.permitted)
      return self.localStorage.removeItem(e);
    this.store.delete(e);
  }
  clear() {
    if (this.permitted)
      return self.localStorage.clear();
    this.store.clear();
  }
}
const N = new At(), T = {
  local: /* @__PURE__ */ new Map(),
  hash: /* @__PURE__ */ new Map()
};
let b = {}, D = class extends k {
  constructor(t) {
    if (typeof t != "object" ? console.warn("Ivalid Storage arguments!") : ((typeof t.key != "string" || !t.key) && console.warn("Ivalid Storage key!"), t.storage && ["hash", "local"].indexOf(t.storage) === -1 && console.warn("Ivalid Storage storage!")), t.storage === void 0 && (t.storage = "local"), T[t.storage].has(t.key))
      return T[t.storage].get(t.key);
    {
      let e, i;
      typeof t.value == "object" && t.value !== null ? (i = t.value.constructor, e = JSON.stringify(t.value)) : e = t.value;
      let s = null;
      switch (t.storage) {
        case "hash":
          s = It(t.key);
          break;
        case "local":
          s = N.getItem("Storage:" + t.key);
          break;
      }
      if (s !== null)
        try {
          const r = JSON.parse(s);
          t.value = i ? new i(r) : r;
        } catch {
          t.value = s;
        }
      return super(t), this.valueMutatedDebounced = this.valueMutatedDebounced.bind(this), this.default = e, this.binding = this.bind("value"), this.binding.dispose = () => {
        this.clearStorage();
      }, t.key !== "__proto__" && T[t.storage].set(t.key, this), this;
    }
  }
  dispose() {
    this.clearStorage(), super.dispose();
  }
  clearStorage() {
    switch (this.storage) {
      case "hash": {
        this.removeValueToHash();
        break;
      }
      case "local": {
        N.removeItem("Storage:" + this.key);
        break;
      }
    }
    const t = this.storage;
    T[t].delete(this.key);
  }
  valueMutated() {
    this.debounce(this.valueMutatedDebounced);
  }
  valueMutatedDebounced() {
    this.valueChanged();
  }
  valueChanged() {
    switch (this.storage) {
      case "hash": {
        this.saveValueToHash();
        break;
      }
      case "local": {
        this.value === null || this.value === void 0 || this.value === this.default && typeof this.value != "object" ? N.removeItem("Storage:" + this.key) : N.setItem("Storage:" + this.key, JSON.stringify(this.value));
        break;
      }
    }
  }
  removeValueToHash() {
    b = Y(self.location.hash), delete b[this.key];
    let t = "";
    for (const e in b)
      t += e + "=" + b[e] + "&";
    t ? (t = t.slice(0, -1), self.location.hash = t) : history.replaceState("", document.title, self.location.pathname + self.location.search);
  }
  saveValueToHash() {
    b = Y(self.location.hash);
    const t = this.value;
    t !== void 0 && t !== "" && t !== this.default ? typeof t == "string" ? isNaN(t) ? b[this.key] = t : b[this.key] = '"' + t + '"' : b[this.key] = JSON.stringify(t) : delete b[this.key];
    let e = "";
    for (const i in b)
      e += i + "=" + b[i] + "&";
    e ? (e = e.slice(0, -1), self.location.hash = e) : history.replaceState("", document.title, self.location.pathname + self.location.search);
  }
};
ee([
  P({ value: "", type: String })
], D.prototype, "key", 2);
ee([
  P()
], D.prototype, "value", 2);
ee([
  P({ value: "local", type: String })
], D.prototype, "storage", 2);
D = ee([
  F
], D);
const Ye = Object.assign(
  (t) => new D(t).binding,
  {
    permit() {
      N.permitted = !0;
    },
    unpermit() {
      N.permitted = !1;
    }
  }
);
function Y(t) {
  return t.substring(1).split("&").reduce(function(e, i) {
    const s = i.split("=");
    return s[0] && s[1] && (e[s[0]] = s[1].replace(/%22/g, '"').replace(/%20/g, " ")), e;
  }, {});
}
function It(t) {
  return b = Y(self.location.hash), b[t] || null;
}
function Xe() {
  b = Y(self.location.hash);
  for (const t in b)
    if (T.hash.has(t)) {
      const e = T.hash.get(t);
      try {
        e.value = JSON.parse(b[t]);
      } catch {
        e.value = b[t];
      }
    }
  for (const [t, e] of T.hash.entries())
    b[t] === void 0 && (e.value = e.default);
}
self.addEventListener("hashchange", Xe, !1);
Xe();
var Mt = Object.defineProperty, jt = Object.getOwnPropertyDescriptor, te = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? jt(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (s ? n(e, i, r) : n(r)) || r);
  return s && r && Mt(e, i, r), r;
};
const ve = "v0.11", be = document.createElement("style");
be.setAttribute("id", "io-theme-variables-" + ve);
document.head.appendChild(be);
class c {
  r;
  g;
  b;
  a;
  constructor(e, i, s, r) {
    this.r = e, this.g = i, this.b = s, this.a = r;
  }
  toCss() {
    const e = Math.floor(this.r * 255), i = Math.floor(this.g * 255), s = Math.floor(this.b * 255);
    return this.a !== void 0 && this.a !== 1 ? `rgba(${e}, ${i}, ${s}, ${this.a})` : `rgb(${e}, ${i}, ${s})`;
  }
}
const Q = {
  spacing: 2,
  spacing2: 0,
  spacing3: 0,
  spacing5: 0,
  spacing8: 0,
  lineHeight: 20,
  fontSize: 14,
  fieldHeight: 0,
  borderRadius: 2,
  borderWidth: 1,
  borderColor: new c(0.2, 0.2, 0.2, 1),
  borderColorLight: new c(0.3, 0.3, 0.3, 1),
  borderColorStrong: new c(0.6, 0.6, 0.6, 1),
  borderColorRed: new c(1, 0.35, 0.15, 1),
  borderColorGreen: new c(0.1, 0.7, 0.2, 1),
  borderColorBlue: new c(0.2, 0.4, 0.95, 1),
  bgColor: new c(0.85, 0.85, 0.85, 1),
  bgColorStrong: new c(0.9, 0.9, 0.9, 1),
  bgColorLight: new c(0.8, 0.8, 0.8, 1),
  bgColorRed: new c(1, 0.5, 0.3, 1),
  bgColorGreen: new c(0.2, 0.9, 0.3, 1),
  bgColorBlue: new c(0.2, 0.5, 0.9, 1),
  bgColorInput: new c(0.95, 0.96, 0.95, 1),
  color: new c(0.25, 0.25, 0.2, 1),
  colorStrong: new c(0, 0, 0, 1),
  colorLight: new c(0.6, 0.6, 0.6, 1),
  colorRed: new c(1, 0.2, 0, 1),
  colorGreen: new c(0, 0.6, 0.1, 1),
  colorBlue: new c(0.2, 0.3, 1, 1),
  colorWhite: new c(1, 1, 1, 1),
  colorInput: new c(0, 0.05, 0.02, 1),
  gradientColorStart: new c(0.9, 0.9, 0.9, 1),
  gradientColorEnd: new c(0.75, 0.75, 0.75, 1),
  shadowColor: new c(0, 0, 0, 0.2)
}, Tt = {
  spacing: 2,
  spacing2: 0,
  spacing3: 0,
  spacing5: 0,
  spacing8: 0,
  lineHeight: 20,
  fontSize: 14,
  fieldHeight: 0,
  borderRadius: 2,
  borderWidth: 1,
  borderColor: new c(0.5, 0.5, 0.5, 1),
  borderColorLight: new c(0.3, 0.3, 0.3, 1),
  borderColorStrong: new c(0, 0, 0, 1),
  borderColorRed: new c(1, 0.2, 0, 1),
  borderColorBlue: new c(0.4, 0.5, 0.9, 1),
  borderColorGreen: new c(0, 0.6, 0.1, 1),
  bgColor: new c(0.2, 0.2, 0.2, 1),
  bgColorStrong: new c(0.15, 0.15, 0.15, 1),
  bgColorLight: new c(0.25, 0.25, 0.25, 1),
  bgColorRed: new c(0.7, 0.2, 0.1, 1),
  bgColorGreen: new c(0.1, 0.5, 0.2, 1),
  bgColorBlue: new c(0.2, 0.4, 0.8, 1),
  bgColorInput: new c(0.02, 0.02, 0.02, 1),
  color: new c(0.6, 0.6, 0.6, 1),
  colorStrong: new c(0.86, 0.86, 0.86, 1),
  colorLight: new c(0.3, 0.3, 0.3, 1),
  colorRed: new c(1, 0.4, 0.4, 1),
  colorGreen: new c(0.4, 0.95, 0.3, 1),
  colorBlue: new c(0.6, 0.9, 1, 1),
  colorWhite: new c(1, 1, 1, 1),
  colorInput: new c(0.65, 0.7, 0.68, 1),
  gradientColorStart: new c(0.45, 0.45, 0.45, 1),
  gradientColorEnd: new c(0.2, 0.2, 0.2, 1),
  shadowColor: new c(0, 0, 0, 0.2)
}, $t = Ye({
  value: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  storage: "local",
  key: "theme-" + ve
}), O = Ye({
  value: {},
  storage: "local",
  key: "io-themes-" + ve
}), Rt = (
  /* css */
  `
  body {
    --io_border: var(--io_borderWidth) solid var(--io_borderColor);
    --io_borderColorInset: var(--io_borderColorStrong) var(--io_borderColorLight) var(--io_borderColorLight) var(--io_borderColorStrong);
    --io_borderColorOutset: var(--io_borderColorLight) var(--io_borderColorStrong) var(--io_borderColorStrong) var(--io_borderColorLight);
    --io_gradientOutset: linear-gradient(180deg, var(--io_gradientColorStart), var(--io_gradientColorEnd) 100%);
    --io_gradientInset: linear-gradient(0deg, var(--io_gradientColorStart), var(--io_gradientColorEnd) 150%);
    --io_shadow: 2px 2px 6px var(--io_shadowColor), 1px 1px 1px var(--io_shadowColor);
    --io_shadowInset: 0.75px 0.75px 2px inset var(--io_shadowColor);
    --io_shadowOutset: 1px 1px 2px var(--io_shadowColor);
  }
`
);
let W = class extends k {
  static get ReactiveProperties() {
    const t = {};
    for (const e in Q) {
      const i = Q[e];
      i instanceof Object ? t[e] = { value: i, type: c, init: null } : t[e] = i;
    }
    return t;
  }
  ready() {
    this.registerTheme("light", Q), this.registerTheme("dark", Tt), this.themeIDChanged();
  }
  registerTheme(t, e) {
    this.themeDefaults[t] = e, this.setProperty("themeDefaults", JSON.parse(JSON.stringify(this.themeDefaults)), !0), O.value[t] = O.value[t] || e, O.value = JSON.parse(JSON.stringify(O.value));
  }
  reset() {
    O.value = JSON.parse(JSON.stringify(this.themeDefaults)), this.themeIDChanged();
  }
  themeIDChanged() {
    const t = O.value[this.themeID];
    for (const e in t)
      t[e] instanceof Object && JSON.stringify(Object.keys(t[e])) === '["r","g","b","a"]' && (t[e] = new c(t[e].r, t[e].g, t[e].b, t[e].a));
    this.setProperties(t);
  }
  onPropertyMutated(t) {
    return super.onPropertyMutated(t) ? (this.changed(), this.dispatchMutation(), !0) : !1;
  }
  fontSizeChanged() {
    this.lineHeight = Math.max(this.fontSize, this.lineHeight);
  }
  lineHeightChanged() {
    this.fontSize = Math.min(this.lineHeight, this.fontSize);
  }
  changed() {
    this.fieldHeight = this.lineHeight + 2 * (this.spacing + this.borderWidth), this.spacing2 = this.spacing * 2, this.spacing3 = this.spacing * 3, this.spacing5 = this.spacing * 5, this.spacing8 = this.spacing * 8;
    const t = Array.from(Object.keys(Q)).reduce(
      (e, i) => (O.value[this.themeID][i] = this[i], typeof this[i] == "object" ? `${e}--io_${i}: ${this[i].toCss()};
    ` : `${e}--io_${i}: ${this[i]}px;
    `),
      ""
    );
    be.innerHTML = /* css */
    `body {
  ${t}
}
${Rt}`, this.debounce(this.onSaveTheme, void 0, 60);
  }
  onSaveTheme() {
    O.value = JSON.parse(JSON.stringify(O.value));
  }
};
te([
  P({ type: Object, init: null })
], W.prototype, "themeDefaults", 2);
te([
  P({ type: String, binding: $t })
], W.prototype, "themeID", 2);
te([
  P("debounced")
], W.prototype, "reactivity", 2);
W = te([
  F
], W);
const Ze = new W(), Nt = (
  /* glsl */
  `
  #ifndef saturate
    #define saturate(v) clamp(v, 0., 1.)
  #endif
`
), Ct = (
  /* glsl */
  `
  vec2 translate(vec2 samplePosition, vec2 xy){
    return samplePosition - vec2(xy.x, xy.y);
  }
  vec2 translate(vec2 samplePosition, float x, float y){
    return samplePosition - vec2(x, y);
  }
`
), kt = (
  /* glsl */
  `
  float circle(vec2 samplePosition, float radius){
    return saturate((length(samplePosition) - radius) * uPxRatio);
  }
`
), Dt = (
  /* glsl */
  `
  float rectangle(vec2 samplePosition, vec2 halfSize){
    vec2 edgeDistance = abs(samplePosition) - halfSize;
    float outside = length(max(edgeDistance, 0.));
    float inside = min(max(edgeDistance.x, edgeDistance.y), 0.);
    return 1.0 - saturate((outside + inside) * 1000000.0);
  }
`
), Wt = (
  /* glsl*/
  `
  float paintDerivativeGrid2D(vec2 samplePosition, vec2 gridWidth, float lineWidth) {
    vec2 sp = samplePosition / gridWidth;
    float fractx = abs(fract(sp.x - 0.5) - 0.5) * 2.0;
    float fracty = abs(fract(sp.y - 0.5) - 0.5) * 2.0;

    float sx = ((sp.x - 0.5) - 0.5) * 2.0;
    float sy = ((sp.y - 0.5) - 0.5) * 2.0;
    
    float absx = abs(max(dFdx(sx), dFdy(sx)));
    float absy = abs(max(dFdy(sy), dFdx(sy)));

    float fadeX = 1.0 - dFdx(sx);
    float fadeY = 1.0 - dFdy(sx);
    if (fadeX <= 0.0 || fadeY <= 0.0) return 1.0;

    float linex = fractx / absx - (0.5 * max(uPxRatio, 2.0) * lineWidth - 1.0) - 0.5;
    float liney = fracty / absy - (0.5 * max(uPxRatio, 2.0) * lineWidth - 1.0) - 0.5;

    return (1.0 - saturate(min(linex, liney)));
  }
`
), Ft = (
  /* glsl*/
  `
  float lineVertical(vec2 samplePosition, float lineWidth) {
    return (abs(samplePosition.x) * 2.0 > lineWidth) ? 0.0 : 1.0;
  }
`
), Bt = (
  /* glsl*/
  `
  float lineHorizontal(vec2 samplePosition, float lineWidth) {
    return (abs(samplePosition.y) * 2.0 > lineWidth) ? 0.0 : 1.0;
  }
`
), Vt = (
  /* glsl*/
  `
  float lineCross2d(vec2 samplePosition, float lineWidth) {
    return (min(abs(samplePosition.x), abs(samplePosition.y)) * 2.0 > lineWidth) ? 0.0 : 1.0;
  }
`
), Ut = (
  /* glsl*/
  `
  float checker(vec2 samplePosition, float size) {
    vec2 checkerPos = floor(samplePosition / size);
    float checkerMask = mod(checkerPos.x + mod(checkerPos.y, 2.0), 2.0);
    return checkerMask;
  }
`
), Ht = (
  /* glsl*/
  `
  float checkerX(vec2 samplePosition, float size) {
    vec2 checkerPos = floor(samplePosition / size);
    float checkerMask = mod(checkerPos.x, 2.0);
    return checkerMask;
  }
`
), zt = (
  /* glsl*/
  `
  float checkerY(vec2 samplePosition, float size) {
    vec2 checkerPos = floor(samplePosition / size);
    float checkerMask = mod(checkerPos.y, 2.0);
    return checkerMask;
  }
`
), Qt = (
  /* glsl*/
  `
  vec3 compose(vec3 dst, vec4 src) {
    return mix(dst, src.rgb, src.a);
  }
`
), Gt = (
  /* glsl*/
  `
  vec3 hue2rgb(float hue) {
    hue = fract(hue);
    float R = abs(hue * 6. - 3.) - 1.;
    float G = 2. - abs(hue * 6. - 2.);
    float B = 2. - abs(hue * 6. - 4.);
    return saturate(vec3(R,G,B));
  }
`
), qt = (
  /* glsl*/
  `
  vec3 hsv2rgb(vec3 hsv) {
    vec3 rgb = hue2rgb(hsv.r);
    return ((rgb - 1.) * hsv.g + 1.) * hsv.b;
  }
`
), Jt = (
  /* glsl*/
  `
  vec3 hsl2rgb(vec3 hsl) {
    vec3 rgb = hue2rgb(hsl.x);
    float C = (1. - abs(2. * hsl.z - 1.)) * hsl.y;
    return (rgb - 0.5) * C + hsl.z;
  }
`
), m = {
  saturate: Nt,
  translate: Ct,
  circle: kt,
  rectangle: Dt,
  paintDerivativeGrid2D: Wt,
  lineVertical: Ft,
  lineHorizontal: Bt,
  lineCross2d: Vt,
  checker: Ut,
  checkerX: Ht,
  checkerY: zt,
  compose: Qt,
  hue2rgb: Gt,
  hsv2rgb: qt,
  hsl2rgb: Jt
};
var Yt = Object.defineProperty, Xt = Object.getOwnPropertyDescriptor, Ke = (t) => {
  throw TypeError(t);
}, ie = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Xt(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (s ? n(e, i, r) : n(r)) || r);
  return s && r && Yt(e, i, r), r;
}, et = (t, e, i) => e.has(t) || Ke("Cannot " + i), g = (t, e, i) => (et(t, e, "read from private field"), i ? i.call(t) : e.get(t)), V = (t, e, i) => e.has(t) ? Ke("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), j = (t, e, i, s) => (et(t, e, "write to private field"), e.set(t, i), i), H, x, R, I, w;
const J = document.createElement("canvas"), l = J.getContext("webgl", { antialias: !1, premultipliedAlpha: !1 });
l.getExtension("OES_standard_derivatives");
l.enable(l.BLEND);
l.blendFunc(l.SRC_ALPHA, l.ONE_MINUS_SRC_ALPHA);
l.disable(l.DEPTH_TEST);
const tt = l.createBuffer();
l.bindBuffer(l.ARRAY_BUFFER, tt);
l.bufferData(l.ARRAY_BUFFER, new Float32Array([-1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0]), l.STATIC_DRAW);
l.bindBuffer(l.ARRAY_BUFFER, null);
const it = l.createBuffer();
l.bindBuffer(l.ARRAY_BUFFER, it);
l.bufferData(l.ARRAY_BUFFER, new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]), l.STATIC_DRAW);
l.bindBuffer(l.ARRAY_BUFFER, null);
const st = l.createBuffer();
l.bindBuffer(l.ELEMENT_ARRAY_BUFFER, st);
l.bufferData(l.ELEMENT_ARRAY_BUFFER, new Uint16Array([3, 2, 1, 3, 1, 0]), l.STATIC_DRAW);
l.bindBuffer(l.ELEMENT_ARRAY_BUFFER, null);
l.bindBuffer(l.ELEMENT_ARRAY_BUFFER, st);
const le = /* @__PURE__ */ new WeakMap();
let Ae, z = class extends M {
  constructor(t = {}) {
    super(t), V(this, H, !1), V(this, x), V(this, R), V(this, I), V(this, w), j(this, x, document.createElement("canvas")), this.appendChild(g(this, x)), j(this, R, g(this, x).getContext("2d", { alpha: !0 })), j(this, I, {}), this.theme._reactiveProperties.forEach((s, r) => {
      s.type === c && (g(this, I)["io_" + r] = 4);
    }), this._reactiveProperties.forEach((s, r) => {
      const o = "u" + r.charAt(0).toUpperCase() + r.slice(1);
      s.type === Array && (g(this, I)[o] = s.value.length);
    }), le.has(this.constructor) ? j(this, w, le.get(this.constructor)) : (j(this, w, this.initShader()), le.set(this.constructor, g(this, w))), l.linkProgram(g(this, w));
    const e = l.getAttribLocation(g(this, w), "position");
    l.bindBuffer(l.ARRAY_BUFFER, tt), l.vertexAttribPointer(e, 3, l.FLOAT, !1, 0, 0), l.enableVertexAttribArray(e);
    const i = l.getAttribLocation(g(this, w), "uv");
    l.bindBuffer(l.ARRAY_BUFFER, it), l.vertexAttribPointer(i, 2, l.FLOAT, !1, 0, 0), l.enableVertexAttribArray(i), this.updateThemeUniforms();
  }
  static get Style() {
    return (
      /* css */
      `
      :host {
        position: relative;
        overflow: hidden !important;
        @apply --unselectable;
      }
      :host > canvas {
        position: absolute;
        pointer-events: none;
        image-rendering: pixelated;
      }
      :host > span {
        position: absolute;
        text-shadow: 0 0 3px var(--io_bgColorStrong), 0 0 3px var(--io_bgColorStrong), 0 0 3px var(--io_bgColorStrong);
        left: 3px;
        pointer-events: none;
        color: var(--io_colorStrong);
      }
    `
    );
  }
  static get Vert() {
    return (
      /* glsl */
      `
      attribute vec3 position;
      attribute vec2 uv;
      varying vec2 vUv;

      void main(void) {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }

`
    );
  }
  static get GlUtils() {
    return (
      /* glsl */
      `
      ${m.saturate}
      ${m.translate}
      ${m.circle}
      ${m.rectangle}
      ${m.paintDerivativeGrid2D}
      ${m.lineVertical}
      ${m.lineHorizontal}
      ${m.lineCross2d}
      ${m.checker}
      ${m.checkerX}
      ${m.checkerY}
      ${m.compose}
    `
    );
  }
  static get Frag() {
    return (
      /* glsl */
      `
      void main(void) {
        gl_FragColor = io_color;
      }

`
    );
  }
  initPropertyUniform(t, e) {
    switch (e.value.constructor) {
      case Boolean:
        return "uniform int " + t + `;
`;
      case Number:
        return "uniform float " + t + `;
`;
      case Array:
        return g(this, I)[t] = e.value.length, "uniform vec" + e.value.length + " " + t + `;
`;
      case c:
        return g(this, I)[t] = 4, "uniform vec4 " + t + `;
`;
    }
    return "";
  }
  initShader() {
    let t = (
      /* glsl */
      `
    #extension GL_OES_standard_derivatives : enable
    precision highp float;
`
    );
    this.theme._reactiveProperties.forEach((r, o) => {
      t += this.initPropertyUniform("io_" + o, r);
    }), t += `
`, this._reactiveProperties.forEach((r, o) => {
      const n = "u" + o.charAt(0).toUpperCase() + o.slice(1);
      t += this.initPropertyUniform(n, r);
    }), t += this.constructor.prototype._glUtils;
    const e = l.createShader(l.VERTEX_SHADER);
    if (l.shaderSource(e, this.constructor.Vert), l.compileShader(e), !l.getShaderParameter(e, l.COMPILE_STATUS)) {
      const r = l.getShaderInfoLog(e);
      console.error("IoGl [Vertex Shader] " + this.localName + " error:"), console.warn(r);
    }
    const i = l.createShader(l.FRAGMENT_SHADER);
    if (l.shaderSource(i, t + this.constructor.Frag), l.compileShader(i), !l.getShaderParameter(i, l.COMPILE_STATUS)) {
      const r = l.getShaderInfoLog(i);
      console.error("IoGl [Frament Shader] " + this.localName + " error:"), console.warn(r);
    }
    const s = l.createProgram();
    return l.attachShader(s, e), l.attachShader(s, i), s;
  }
  onResized() {
    const t = window.devicePixelRatio, e = this.getBoundingClientRect(), i = window.getComputedStyle(this), s = parseInt(i.borderRightWidth) + parseInt(i.borderLeftWidth), r = parseInt(i.borderTopWidth) + parseInt(i.borderBottomWidth), o = Math.max(0, Math.floor(e.width - s)), n = Math.max(0, Math.floor(e.height - r));
    (o !== this.size[0] || n !== this.size[1] || t !== this.pxRatio) && (g(this, x).style.width = Math.floor(o) + "px", g(this, x).style.height = Math.floor(n) + "px", j(this, H, !0), this.setProperties({
      size: [o, n],
      pxRatio: t
    }));
  }
  get ctx() {
    return g(this, R);
  }
  themeMutated() {
    this.updateThemeUniforms(), this.throttle(this.onRender);
  }
  changed() {
    this.throttle(this.onRender);
  }
  onRender() {
    const t = Math.floor(this.size[0] * this.pxRatio), e = Math.floor(this.size[1] * this.pxRatio);
    !t || !e || (this.setShaderProgram(), this._reactiveProperties.forEach((i, s) => {
      const r = "u" + s.charAt(0).toUpperCase() + s.slice(1);
      this.updatePropertyUniform(r, i);
    }), g(this, H) && (g(this, x).width = t, g(this, x).height = e, j(this, H, !1)), J.width = t, J.height = e, l.viewport(0, 0, t, e), l.clearColor(0, 0, 0, 0), l.clear(l.COLOR_BUFFER_BIT), g(this, R).clearRect(0, 0, t, e), l.drawElements(l.TRIANGLES, 6, l.UNSIGNED_SHORT, 0), g(this, R).drawImage(J, 0, 0));
  }
  setShaderProgram() {
    Ae !== g(this, w) && (Ae = g(this, w), l.useProgram(g(this, w)));
  }
  updatePropertyUniform(t, e) {
    this.setShaderProgram(), this.setUniform(t, e.value);
  }
  updateThemeUniforms() {
    this.theme._reactiveProperties.forEach((t, e) => {
      this.updatePropertyUniform("io_" + e, t);
    });
  }
  setUniform(t, e) {
    const i = l.getUniformLocation(g(this, w), t);
    if (i === null) return;
    let s = typeof e;
    e instanceof Array && (s = "array");
    let r;
    switch (s) {
      case "boolean":
        l.uniform1i(i, e ? 1 : 0);
        break;
      case "number":
        l.uniform1f(i, e ?? 1);
        break;
      case "object":
      case "array":
        switch (r = [0, 1, 2, 3], typeof e == "object" && (e.x !== void 0 ? r = ["x", "y", "z", "w"] : e.r !== void 0 ? r = ["r", "g", "b", "a"] : e.h !== void 0 ? r = ["h", "s", "v", "a"] : e.c !== void 0 && (r = ["c", "m", "y", "k"])), g(this, I)[t]) {
          case 2:
            if (e === void 0) {
              l.uniform2f(i, 0, 0);
              break;
            }
            l.uniform2f(
              i,
              e[r[0]] ?? 1,
              e[r[1]] ?? 1
            );
            break;
          case 3:
            if (e === void 0) {
              l.uniform3f(i, 0, 0, 0);
              break;
            }
            l.uniform3f(
              i,
              e[r[0]] ?? 1,
              e[r[1]] ?? 1,
              e[r[2]] ?? 1
            );
            break;
          case 4:
            if (e === void 0) {
              l.uniform4f(i, 0, 0, 0, 0);
              break;
            }
            l.uniform4f(
              i,
              e[r[0]] ?? 1,
              e[r[1]] ?? 1,
              e[r[2]] ?? 1,
              e[r[3]] ?? 1
            );
            break;
        }
        break;
    }
  }
  Register(t) {
    super.Register(t);
    let e = "";
    const i = t.prototype._protochain.constructors;
    for (let s = i.length; s--; ) {
      const r = i[s], o = Object.getOwnPropertyDescriptor(r, "GlUtils");
      o && o.get && (e += r.GlUtils);
    }
    Object.defineProperty(t.prototype, "_glUtils", { enumerable: !1, value: e });
  }
};
H = /* @__PURE__ */ new WeakMap();
x = /* @__PURE__ */ new WeakMap();
R = /* @__PURE__ */ new WeakMap();
I = /* @__PURE__ */ new WeakMap();
w = /* @__PURE__ */ new WeakMap();
ie([
  P({ type: k, value: Ze })
], z.prototype, "theme", 2);
ie([
  P({ type: Array, init: [0, 0] })
], z.prototype, "size", 2);
ie([
  P({ type: Number, value: 1 })
], z.prototype, "pxRatio", 2);
z = ie([
  F
], z);
const Zt = [
  "a",
  "abbr",
  "acronym",
  "address",
  "applet",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "basefont",
  "bdi",
  "bdo",
  "big",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "frame",
  "frameset",
  "head",
  "header",
  "hgroup",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noframes",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
], rt = {};
Zt.forEach((t) => {
  const e = function(i, s) {
    const r = { tag: t };
    return i !== void 0 && (typeof i == "string" || i instanceof Array ? r.children = i : typeof i == "object" && (r.props = i), s !== void 0 && (typeof s == "string" || s instanceof Array) && (r.children = s)), r;
  };
  rt[t] = e;
});
const {
  a: li,
  abbr: ci,
  acronym: hi,
  address: di,
  applet: fi,
  area: pi,
  article: ui,
  aside: gi,
  audio: vi,
  b: bi,
  base: yi,
  basefont: mi,
  bdi: wi,
  bdo: _i,
  big: Pi,
  blockquote: Ei,
  body: Oi,
  br: xi,
  button: Si,
  canvas: Li,
  caption: Ai,
  center: Ii,
  cite: Mi,
  code: ji,
  col: Ti,
  colgroup: $i,
  data: Ri,
  datalist: Ni,
  dd: Ci,
  del: ki,
  details: Di,
  dfn: Wi,
  dialog: Fi,
  dir: Bi,
  div: Vi,
  dl: Ui,
  dt: Hi,
  em: zi,
  embed: Qi,
  fieldset: Gi,
  figcaption: qi,
  figure: Ji,
  font: Yi,
  footer: Xi,
  form: Zi,
  frame: Ki,
  frameset: es,
  head: ts,
  header: is,
  hgroup: ss,
  h1: rs,
  h2: os,
  h3: ns,
  h4: as,
  h5: ls,
  h6: cs,
  hr: hs,
  html: ds,
  i: fs,
  iframe: ps,
  img: us,
  input: gs,
  ins: vs,
  kbd: bs,
  keygen: ys,
  label: ms,
  legend: ws,
  li: _s,
  link: Ps,
  main: Es,
  map: Os,
  mark: xs,
  menu: Ss,
  menuitem: Ls,
  meta: As,
  meter: Is,
  nav: Ms,
  noframes: js,
  noscript: Ts,
  object: $s,
  ol: Rs,
  optgroup: Ns,
  option: Cs,
  output: ks,
  p: Ds,
  param: Ws,
  picture: Fs,
  pre: Bs,
  progress: Vs,
  q: Us,
  rp: Hs,
  rt: zs,
  ruby: Qs,
  s: Gs,
  samp: qs,
  script: Js,
  section: Ys,
  select: Xs,
  small: Zs,
  source: Ks,
  span: er,
  strike: tr,
  strong: ir,
  style: sr,
  sub: rr,
  summary: or,
  sup: nr,
  svg: ar,
  table: lr,
  tbody: cr,
  td: hr,
  template: dr,
  textarea: fr,
  tfoot: pr,
  th: ur,
  thead: gr,
  time: vr,
  title: br,
  tr: yr,
  track: mr,
  tt: wr,
  u: _r,
  ul: Pr,
  video: Er,
  wbr: Or
} = rt;
var Kt = Object.defineProperty, ei = Object.getOwnPropertyDescriptor, ot = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? ei(e, i) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (s ? n(e, i, r) : n(r)) || r);
  return s && r && Kt(e, i, r), r;
};
let X = null, Z = class extends M {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 100000;
        overflow: hidden;
        pointer-events: none;
        touch-action: none;
        background: transparent;
        @apply --unselectable;
      }
      :host[expanded] {
        background: rgba(0, 0, 0, 0.25);
        pointer-events: all;
      }
      :host > * {
        position: absolute !important;
        box-shadow: var(--io_shadow);
      }
    `
    );
  }
  static get Listeners() {
    return {
      pointerdown: ["stopPropagation", { passive: !1 }],
      pointermove: ["stopPropagation", { passive: !1 }],
      pointerup: "onPointerup",
      contextmenu: "onContextmenu",
      mousedown: ["stopPropagation", { passive: !1 }],
      mousemove: ["stopPropagation", { passive: !1 }],
      mouseup: ["stopPropagation", { passive: !1 }],
      touchstart: ["stopPropagation", { passive: !1 }],
      touchmove: ["stopPropagation", { passive: !1 }],
      touchend: ["stopPropagation", { passive: !1 }],
      keydown: ["stopPropagation", { passive: !1 }],
      keyup: ["stopPropagation", { passive: !1 }],
      focusin: ["stopPropagation", { passive: !1 }],
      blur: ["stopPropagation", { passive: !1 }],
      scroll: "onScroll",
      wheel: ["onScroll", { passive: !1 }]
    };
  }
  constructor(t = {}) {
    super(t);
  }
  init() {
    this.expandAsChildren = this.expandAsChildren.bind(this);
  }
  stopPropagation(t) {
    t.stopPropagation();
  }
  onPointerup(t) {
    t.composedPath()[0] === this && this.collapse(), t.stopPropagation();
  }
  onContextmenu(t) {
    t.preventDefault(), t.stopPropagation();
  }
  onScroll(t) {
    t.composedPath()[0] === this && this.collapse();
  }
  onResized() {
    this.collapse();
  }
  appendChild(t) {
    return super.appendChild(t), t.addEventListener("expanded-changed", this.onChildExpandedChanged), this.debounce(this.expandAsChildren), t;
  }
  removeChild(t) {
    return super.removeChild(t), t.removeEventListener("expanded-changed", this.onChildExpandedChanged), this.debounce(this.expandAsChildren), t;
  }
  onChildExpandedChanged() {
    this.debounce(this.expandAsChildren);
  }
  collapse() {
    for (let t = this.children.length; t--; )
      this.expanded = !1;
    this.expanded = !1;
  }
  expandAsChildren() {
    for (let t = this.children.length; t--; )
      if (this.children[t].expanded) {
        this.expanded = !0;
        return;
      }
    this.expanded = !1;
  }
  expandedChanged() {
    if (!this.expanded) {
      for (let t = this.children.length; t--; )
        this.children[t].expanded = !1;
      X && X.focus();
    }
  }
};
ot([
  P({ value: !1, type: Boolean, reflect: !0 })
], Z.prototype, "expanded", 2);
Z = ot([
  F
], Z);
const K = new Z();
setTimeout(() => {
  document.body.appendChild(K);
}, 100);
window.addEventListener("focusin", () => {
  X = document.activeElement;
}, { capture: !1 });
window.addEventListener("blur", () => {
  setTimeout(() => {
    !K.expanded && document.activeElement === document.body && (X = null);
  });
}, { capture: !0 });
let nt = /* @__PURE__ */ new WeakMap();
const ti = {
  ArrowLeft: "ArrowRight",
  ArrowRight: "ArrowLeft",
  ArrowDown: "ArrowUp",
  ArrowUp: "ArrowDown"
};
function Ie(t, e, i) {
  nt.set(t, {
    dir: ti[e],
    source: i
  });
}
function ii(t, e, i = 1) {
  if (t.right > e.left && e.right > t.left && t.bottom > e.top && e.bottom > t.top)
    return 0;
  let s = 0, r = 0;
  const o = Ze.fieldHeight / 2;
  return t.right < e.left ? s = Math.max(o, e.left - t.right) : e.right < t.left && (s = Math.max(o, t.left - e.right)), t.bottom < e.top ? r = Math.max(o, e.top - t.bottom) : e.bottom < t.top && (r = Math.max(o, t.top - e.bottom)), s = s * i, r = r / i, (s ** 2 + r ** 2) ** 0.5;
}
function si(t, e, i = 1) {
  let s = { x: t.x + t.width / 2, y: t.y + t.height / 2 }, r = { x: e.x + e.width / 2, y: e.y + e.height / 2 }, o = s.x - r.x, n = s.y - r.y;
  return o = o * i, n = n / i, (o ** 2 + n ** 2) ** 0.5;
}
function ri(t) {
  const e = t.detail.source, i = e.getBoundingClientRect(), s = t.detail.command, r = K.contains(e);
  let o = e, n = 1 / 0, a = 1 / 0;
  const h = nt.get(e);
  if (h && h.dir === s) {
    const u = h.source;
    let v = !0;
    if (!u.offsetParent || u === e)
      v = !1;
    else {
      const B = window.getComputedStyle(u);
      (B.visibility !== "visible" || B.display === "none") && (v = !1);
    }
    if (v) {
      u.focus(), Ie(u, s, e);
      return;
    }
  }
  let p = Array.from((r ? K : document).querySelectorAll(`[tabIndex="${e.tabIndex || 0}"]:not([disabled]):not([inert]):not([hidden])`)), y = Array.from(e.parentElement.querySelectorAll(`[tabIndex="${e.tabIndex || 0}"]:not([disabled]):not([inert]):not([hidden])`));
  if (p = p.filter((u) => u.offsetParent !== null), p = p.filter((u) => {
    const v = window.getComputedStyle(u);
    return v.display !== "none" && v.visibility !== "hidden" && v.opacity !== "0";
  }), s === "Tab") {
    const u = p.indexOf(e);
    u !== -1 && p[(u + 1) % p.length].focus();
    return;
  } else if (s === "Home") {
    p[0].focus();
    return;
  } else if (s === "End") {
    p[p.length - 1].focus();
    return;
  } else if (s === "PageUp") {
    y[0].focus();
    return;
  } else if (s === "PageDown") {
    y[y.length - 1].focus();
    return;
  } else if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"].includes(s)) {
    for (let u = p.length; u--; ) {
      const v = p[u];
      if (!v.offsetParent || v === e)
        continue;
      const B = window.getComputedStyle(v);
      if (B.visibility !== "visible" || B.display === "none")
        continue;
      const $ = v.getBoundingClientRect();
      if (s === "ArrowRight" && $.left < i.right || s === "ArrowLeft" && $.right > i.left || s === "ArrowDown" && $.top < i.bottom || s === "ArrowUp" && $.bottom > i.top) continue;
      const ye = 4, me = s === "ArrowLeft" || s === "ArrowRight" ? 1 / ye : ye, se = ii(i, $, me), re = si(i, $, me);
      se < n ? (n = se, a = re, o = v) : se === n && re < a && (a = re, o = v);
    }
    o !== e && (o.focus(), Ie(o, s, e));
  }
}
document.addEventListener("io-focus-to", ri);
const f = {
  get width() {
    return window.visualViewport ? window.visualViewport.width * window.visualViewport.scale : document.documentElement.clientWidth;
  },
  get height() {
    return window.visualViewport ? window.visualViewport.height * window.visualViewport.scale : document.documentElement.clientHeight;
  },
  get offsetLeft() {
    return window.visualViewport ? window.visualViewport.offsetLeft : 0;
  },
  get offsetTop() {
    return window.visualViewport ? window.visualViewport.offsetTop : 0;
  }
};
function G(t, e, i, s, r, o) {
  e = Math.max(0, Math.min(e, f.width - s.width));
  let n = -1, a = -1;
  const h = i - s.height >= 0, d = e + s.width <= f.width;
  return h || r ? (h ? i = i - s.height : o ? (a = i, i = 0) : i = s.height - i, d || (o ? n = f.width : e = f.width - s.width), t.style.top = i + "px", t.style.left = e + "px", t.style.width = n !== -1 ? n + "px" : "", t.style.height = a !== -1 ? a + "px" : "", !0) : !1;
}
function q(t, e, i, s, r, o) {
  i = i + f.offsetTop, e = e + f.offsetLeft, e = Math.max(0, Math.min(e, f.width - s.width));
  let n = -1, a = -1;
  const h = i + s.height <= f.height, d = e + s.width <= f.width;
  return h || r ? (h || (o ? a = f.height - i : i = f.height - s.height), d || (o ? n = f.width : e = f.width - s.width), t.style.top = i + "px", t.style.left = e + "px", t.style.width = n !== -1 ? n + "px" : "", t.style.height = a !== -1 ? a + "px" : "", !0) : !1;
}
function L(t, e, i, s, r, o) {
  i = Math.max(0, Math.min(i, f.height - s.height));
  let n = -1, a = -1;
  const h = e - s.width >= 0, d = i + s.height <= f.height;
  return h || r ? (h ? e = e - s.width : (o && (n = e), e = 0), d || (o ? a = f.height : i = f.height - s.height), t.style.top = i + "px", t.style.left = e + "px", t.style.width = n !== -1 ? n + "px" : "", t.style.height = a !== -1 ? a + "px" : "", !0) : !1;
}
function A(t, e, i, s, r, o) {
  i = Math.max(0, Math.min(i, f.height - s.height));
  let n = -1, a = -1;
  const h = e + s.width <= f.width, d = i + s.height <= f.height;
  return h || r ? (h || (o ? n = f.width - e : e = f.width - s.width), d || (o ? a = f.height : i = f.height - s.height), t.style.top = i + "px", t.style.left = e + "px", t.style.width = n !== -1 ? n + "px" : "", t.style.height = a !== -1 ? a + "px" : "", !0) : !1;
}
function xr(t, e, i, s) {
  const r = t.getBoundingClientRect(), o = e.getBoundingClientRect(), n = o.left, a = o.top, h = o.right, d = o.bottom, p = f.height - d, y = f.width - h, u = r.left, v = r.top;
  switch (i) {
    case "none":
      A(t, u, v, r, !1, s) || L(t, u, v, r, !1, s) || A(t, u, v, r, y > n, s) || L(t, n, a, r, y <= n, s);
      break;
    case "up":
      G(t, n, a, r, !1, s) || q(t, n, d, r, !1, s) || G(t, n, a, r, a > p, s) || q(t, n, d, r, a <= p, s);
      break;
    case "left":
      L(t, n, a, r, !1, s) || A(t, h, a, r, !1, s) || L(t, n, a, r, n > y, s) || A(t, h, a, r, n <= y, s);
      break;
    case "down":
      q(t, n, d, r, !1, s) || G(t, n, a, r, !1, s) || q(t, n, d, r, p > a, s) || G(t, n, a, r, p <= a, s);
      break;
    case "right":
      A(t, h, a, r, !1, s) || L(t, n, a, r, !1, s) || A(t, h, a, r, y > n, s) || L(t, n, a, r, y <= n, s);
      break;
    default:
      A(t, n, a, r, !1, s) || L(t, h, a, r, !1, s) || A(t, n, a, r, y > n, s) || L(t, h, a, r, y <= n, s);
      break;
  }
}
const Sr = "MIT";
export {
  S as Binding,
  Me as ChangeQueue,
  c as Color,
  Tt as DARK_THEME,
  ue as EventDispatcher,
  Zt as HTML_ELEMENTS,
  M as IoElement,
  z as IoGl,
  K as IoOverlaySingleton,
  Sr as LICENSE,
  Q as LIGHT_THEME,
  ae as NODES,
  k as Node,
  U as NodeArray,
  ct as Property,
  $e as ProtoChain,
  P as ReactiveProperty,
  lt as ReactivePropertyInstance,
  Pe as ReactiveProtoProperty,
  F as Register,
  Ye as Storage,
  D as StorageNode,
  oi as Style,
  W as Theme,
  Ze as ThemeSingleton,
  li as a,
  ci as abbr,
  hi as acronym,
  di as address,
  fi as applet,
  ke as applyNativeElementProps,
  pi as area,
  ui as article,
  gi as aside,
  vi as audio,
  bi as b,
  yi as base,
  mi as basefont,
  wi as bdi,
  _i as bdo,
  Pi as big,
  Ge as bind,
  Ei as blockquote,
  Oi as body,
  xi as br,
  Si as button,
  Li as canvas,
  Ai as caption,
  Ii as center,
  Mi as cite,
  ji as code,
  Ti as col,
  $i as colgroup,
  Oe as constructElement,
  Ri as data,
  Ni as datalist,
  Ci as dd,
  Ne as debounce,
  ki as del,
  Di as details,
  Wi as dfn,
  Fi as dialog,
  Bi as dir,
  He as dispatchQueue,
  Je as dispose,
  xe as disposeChildren,
  Vi as div,
  Ui as dl,
  Hi as dt,
  zi as em,
  Qi as embed,
  Gi as fieldset,
  qi as figcaption,
  Ji as figure,
  Yi as font,
  Xi as footer,
  Zi as form,
  Ki as frame,
  es as frameset,
  m as glsl,
  rs as h1,
  os as h2,
  ns as h3,
  as as h4,
  ls as h5,
  cs as h6,
  je as hardenListenerDefinition,
  ts as head,
  is as header,
  ss as hgroup,
  hs as hr,
  ds as html,
  fs as i,
  ps as iframe,
  us as img,
  Be as initProperties,
  Fe as initReactiveProperties,
  gs as input,
  vs as ins,
  ai as ioElement,
  bs as kbd,
  ys as keygen,
  ms as label,
  ws as legend,
  _s as li,
  Ps as link,
  _e as listenerFromDefinition,
  Es as main,
  Os as map,
  xs as mark,
  Ss as menu,
  Ls as menuitem,
  As as meta,
  Is as meter,
  Ms as nav,
  ni as nextQueue,
  js as noframes,
  Ts as noscript,
  xr as nudge,
  $s as object,
  xt as observeNodeProperty,
  Qe as observeObjectProperty,
  Rs as ol,
  ze as onPropertyMutated,
  Ns as optgroup,
  Cs as option,
  ks as output,
  Ds as p,
  Ws as param,
  Fs as picture,
  Bs as pre,
  Vs as progress,
  he as propertyDecorators,
  Us as q,
  de as reactivePropertyDecorators,
  Hs as rp,
  zs as rt,
  Qs as ruby,
  Gs as s,
  qs as samp,
  Js as script,
  Ys as section,
  Xs as select,
  Ve as setProperties,
  Ue as setProperty,
  Zs as small,
  Ks as source,
  er as span,
  tr as strike,
  ir as strong,
  sr as style,
  Te as styleDecorators,
  rr as sub,
  or as summary,
  nr as sup,
  ar as svg,
  lr as table,
  cr as tbody,
  hr as td,
  dr as template,
  fr as textarea,
  pr as tfoot,
  ur as th,
  gr as thead,
  Re as throttle,
  vr as time,
  br as title,
  De as toVDOM,
  yr as tr,
  mr as track,
  wr as tt,
  _r as u,
  Pr as ul,
  qe as unbind,
  Er as video,
  Or as wbr
};
//# sourceMappingURL=index.js.map
