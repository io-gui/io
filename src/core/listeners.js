// TODO: Improve tests.

/** Creates a map of all listeners defined in the prototype chain. */
export class ProtoListeners {
  /**
   * @param {Array} protochain - Array of protochain constructors.
   */
  constructor(protochain) {
    for (let i = protochain.length; i--;) {
      const prop = protochain[i].constructor.Listeners;
      for (let j in prop) this[j] = prop[j];
    }
  }
}

/** Manager for `IoNode` listeners. */
export class Listeners {
  /**
   * Creates listener manager for `IoNode`.
   * @param {IoNode} node - Reference to the node/element itself.
   * @param {ProtoListeners} protoListeners - List of listeners defined in the protochain.
   */
  constructor(node, protoListeners) {
    // Copy listeners from protolisteners.
    Object.defineProperty(this, 'node', {value: node});
    Object.defineProperty(this, 'propListeners', {value: {}});
    Object.defineProperty(this, 'activeListeners', {value: {}});
    Object.defineProperty(this, '__connected', {enumerable: false, writable: true});
    for (let prop in protoListeners) this[prop] = protoListeners[prop];
  }
  /**
   * Sets listeners from properties (filtered form properties map by 'on-' prefix).
   * @param {Object} props - Map of all properties.
   */
  setPropListeners(props) {
    for (let l in this.propListeners) delete this.propListeners[l];
    for (let l in props) {
      if (l.startsWith('on-')) {
        this.propListeners[l.slice(3, l.length)] = props[l];
      }
    }
    if (this.__connected) {
      const props = this.propListeners;
      const node = this.node;
      for (let l in props) {
        if (props[l] instanceof Array) {
          node.addEventListener(l, typeof props[l][0] === 'function' ? props[l][0] : node[props[l][0]], props[l][1]);
        } else {
          node.addEventListener(l, typeof props[l] === 'function' ? props[l] : node[props[l]]);
        }
      }
    }
  }
  /**
   * Adds event listeners.
   */
  connect() {
    this.__connected = true;
    const node = this.node;
    for (let l in this) {
      if (this[l] instanceof Array) {
        this.addEventListener(l, node[this[l][0]], this[l][1]);
      } else {
        this.addEventListener(l, node[this[l]]);
      }
    }
    const props = this.propListeners;
    for (let l in props) {
      if (props[l] instanceof Array) {
        const listener = typeof props[l][0] === 'function' ? props[l][0] : node[props[l][0]];
        this.addEventListener(l, listener, props[l][1]);
      } else {
        const listener = typeof props[l] === 'function' ? props[l] : node[props[l]];
        this.addEventListener(l, listener);
      }
    }
  }
  /**
   * Removes event listeners.
   */
  disconnect() {
    this.__connected = false;
    const node = this.node;
    for (let l in this) {
      if (this[l] instanceof Array) {
        this.removeEventListener(l, node[this[l][0]], this[l][1]);
      } else {
        this.removeEventListener(l, node[this[l]]);
      }
    }
    const props = this.props;
    for (let l in props) {
      if (props[l] instanceof Array) {
        const listener = typeof props[l][0] === 'function' ? props[l][0] : node[props[l][0]];
        this.removeEventListener(l, listener, props[l][1]);
      } else {
        const listener = typeof props[l] === 'function' ? props[l] : node[props[l]];
        this.removeEventListener(l, listener);
      }
    }
  }
  /**
   * Removes all event listeners.
   * Use this when node is no longer needed.
   */
   // TODO: test
  dispose() {
    this.disconnect();
    const active = this.activeListeners;
    for (let i in active) {
      for (let j = active[i].length; j--;) {
        if (this.node.isElement) HTMLElement.prototype.removeEventListener.call(this.node, i, active[i][j]);
        active[i].splice(j, 1);
      }
    }
  }
  /**
   * Adds an event listener.
   * @param {string} type - event name to listen to.
   * @param {function} listener - event handler function.
   * @param {Object} options - event listener options.
   */
  addEventListener(type, listener, options) {
    const active = this.activeListeners;
    active[type] = active[type] || [];
    const i = active[type].indexOf(listener);
    if (i === -1) {
      if (this.node.isElement) HTMLElement.prototype.addEventListener.call(this.node, type, listener, options);
      active[type].push(listener);
    }
  }
  /**
   * Removes an event listener.
   * @param {string} type - event name to listen to.
   * @param {function} listener - event handler function.
   * @param {Object} options - event listener options.
   */
  removeEventListener(type, listener, options) {
    const active = this.activeListeners;
    if (active[type] !== undefined) {
      const i = active[type].indexOf(listener);
      if (i !== - 1) {
        if (this.node.isElement) HTMLElement.prototype.removeEventListener.call(this.node, type, listener, options);
        active[type].splice(i, 1);
      }
    }
  }
  /**
   * Shorthand for event dispatch.
   * @param {string} type - event name to dispatch.
   * @param {Object} detail - event detail.
   * @param {boolean} bubbles - event bubbles.
   * @param {HTMLElement|IoNode} src source node/element to dispatch event from.
   */
  dispatchEvent(type, detail = {}, bubbles = true, src = this.node) {
    if (src instanceof HTMLElement || src === window) {
      HTMLElement.prototype.dispatchEvent.call(src, new CustomEvent(type, {type: type, detail: detail, bubbles: bubbles, composed: true, cancelable: true}));
    } else {
      const active = this.activeListeners;
      if (active[type] !== undefined) {
        const array = active[type].slice(0);
        for (let i = 0; i < array.length; i ++) {
          array[i].call(src, {detail: detail, target: src, path: [src]});
          // TODO: consider bubbling.
        }
      }
    }
  }
}
