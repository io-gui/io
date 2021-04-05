import {ProtoChain} from './protochain.js';

type PropListeners = Record<string, any>

/**
 * Collection of all listeners defined in the prototype chain.
 */
class ProtoListeners {
  /**
   * Creates a collection of all listeners from protochain.
   */
  constructor(protochain: ProtoChain) {
    for (let i = protochain.length; i--;) {
      const prop = (protochain[i].constructor as any).Listeners;
      for (let j in prop) (this as any)[j] = prop[j];
    }
  }
}

/**
 * Manager of listeners for a class **instance**.
 */
class Listeners {
  node: any;
  propListeners: Record<string, any> = {};
  activeListeners: Record<string, any> = {};
  __connected: boolean = false;
  /**
   * Creates manager for listener.
   */
  constructor(node: any, protoListeners?: ProtoListeners) {
    Object.defineProperty(this, 'node', {value: node});
    Object.defineProperty(this, 'propListeners', {enumerable: false, value: {}});
    Object.defineProperty(this, 'activeListeners', {enumerable: false, value: {}});
    Object.defineProperty(this, '__connected', {enumerable: false, writable: true, value: false});
    for (let prop in protoListeners) (this as any)[prop] = (protoListeners as any)[prop];
  }
  /**
   * Sets listeners from inline properties (filtered form properties map by 'on-' prefix).
   * @param {Object} props - Properties.
   */
  setPropListeners(props: PropListeners) {
    // TODO: Unset propListeners, test.
    const listeners = this.propListeners;
    const node = this.node;
    const newListeners: Record<string, any> = {};
    for (let l in props) {
      if (l.startsWith('on-')) newListeners[l.slice(3, l.length)] = props[l];
    }
    for (let l in newListeners) {
      if (listeners[l]) {
        if (listeners[l] instanceof Array) {
          const listener = typeof listeners[l][0] === 'function' ? listeners[l][0] : node[listeners[l][0]];
          node.removeEventListener(l, listener, listeners[l][1]);
        } else {
          const listener = typeof listeners[l] === 'function' ? listeners[l] : node[listeners[l]];
          node.removeEventListener(l, listener);
        }
      }
      listeners[l] = newListeners[l];
      if (this.__connected) {
        if (newListeners[l] instanceof Array) {
          const listener = typeof newListeners[l][0] === 'function' ? newListeners[l][0] : node[newListeners[l][0]];
          node.addEventListener(l, listener, newListeners[l][1]);
        } else {
          const listener = typeof newListeners[l] === 'function' ? newListeners[l] : node[newListeners[l]];
          node.addEventListener(l, listener);
        }
      }
    }
  }
  /**
   * Connects all event listeners.
   */
  connect() {
    this.__connected = true;
    const node = this.node;
    const listeners = this.propListeners;
    const self = this as any;
    for (let l in this) {
      if (this[l] instanceof Array) {
        this.addEventListener(l, node[self[l][0]], self[l][1]);
      } else {
        this.addEventListener(l, node[self[l]]);
      }
    }
    for (let l in listeners) {
      if (listeners[l] instanceof Array) {
        const listener = typeof listeners[l][0] === 'function' ? listeners[l][0] : node[listeners[l][0]];
        this.addEventListener(l, listener, listeners[l][1]);
      } else {
        const listener = typeof listeners[l] === 'function' ? listeners[l] : node[listeners[l]];
        this.addEventListener(l, listener);
      }
    }
  }
  /**
   * Disconnects all event listeners.
   */
  disconnect() {
    this.__connected = false;
    const node = this.node;
    const listeners = this.propListeners;
    const self = this as any;
    for (let l in this) {
      if (self[l] instanceof Array) {
        this.removeEventListener(l, node[self[l][0]], self[l][1]);
      } else {
        this.removeEventListener(l, node[self[l]]);
      }
    }
    for (let l in listeners) {
      if (listeners[l] instanceof Array) {
        const listener = typeof listeners[l][0] === 'function' ? listeners[l][0] : node[listeners[l][0]];
        this.removeEventListener(l, listener, listeners[l][1]);
      } else {
        const listener = typeof listeners[l] === 'function' ? listeners[l] : node[listeners[l]];
        this.removeEventListener(l, listener);
      }
    }
  }
  /**
   * Disconnects all event listeners and removes all references.
   * Use this when node is no longer needed.
   */
  dispose() {
    // TODO: test
    this.disconnect();
    const active = this.activeListeners;
    for (let i in active) {
      for (let j = active[i].length; j--;) {
        if (this.node.__isIoElement) HTMLElement.prototype.removeEventListener.call(this.node, i, active[i][j]);
        active[i].splice(j, 1);
      }
    }
  }
  /**
   * Proxy for `addEventListener` method.
   * Adds an event listener.
   */
  addEventListener(type: string, listener: any, options?: Record<string, any>) {
    const active = this.activeListeners;
    active[type] = active[type] || [];
    const i = active[type].indexOf(listener);
    if (i === -1) {
      if (this.node.__isIoElement) HTMLElement.prototype.addEventListener.call(this.node, type, listener, options);
      active[type].push(listener);
    }
  }
  /**
   * Proxy for `removeEventListener` method.
   * Removes an event listener.
   */
  removeEventListener(type: string, listener?: any, options?: Record<string, any>) {
    const active = this.activeListeners;
    if (active[type] !== undefined) {
      const i = active[type].indexOf(listener);
      if (i !== - 1 || listener === undefined) {
        if (this.node.__isIoElement) HTMLElement.prototype.removeEventListener.call(this.node, type, listener, options);
        active[type].splice(i, 1);
      }
    }
  }
  /**
   * Shorthand for custom event dispatch.
   */
  dispatchEvent(type: string, detail: Record<string, any> = {}, bubbles: boolean = true, src: HTMLElement | any = this.node) {
    if (src instanceof HTMLElement || src === window) {
      HTMLElement.prototype.dispatchEvent.call(src, new CustomEvent(type, {detail: detail, bubbles: bubbles, composed: true, cancelable: true}));
      // HTMLElement.prototype.dispatchEvent.call(src, new CustomEvent(type, {type: type, detail: detail, bubbles: bubbles, composed: true, cancelable: true}));
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

export {ProtoListeners, Listeners};
