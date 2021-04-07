import {ProtoListeners} from '../proto/protoListeners.js';
import {Node} from '../node.js';

/**
 * Event Dispatcher.
 */
class EventDispatcher {
  private readonly __node: Node;
  private readonly __propListeners: Record<string, any> = {};
  private readonly __activeListeners: Record<string, any> = {};
  private __connected: boolean = false;
  /**
   * Creates Event Dispatcher.
   */
  constructor(node: Node, protoListeners?: ProtoListeners) {
    this.__node = node;
    Object.defineProperty(this, '__node',            {enumerable: false, writable: false});
    Object.defineProperty(this, '__propListeners',   {enumerable: false, writable: false});
    Object.defineProperty(this, '__activeListeners', {enumerable: false, writable: false});
    Object.defineProperty(this, '__connected',       {enumerable: false});

    for (let prop in protoListeners) (this as any)[prop] = (protoListeners as any)[prop];
  }
  /**
   * Sets listeners from inline properties (filtered form properties map by 'on-' prefix).
   * @param {Object} props - Properties.
   */
  setPropListeners(props: Record<string, any>) {
    // TODO: Unset propListeners, test.
    const listeners = this.__propListeners;
    const node = this.__node;
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
    const node = this.__node;
    const listeners = this.__propListeners;
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
    const node = this.__node;
    const listeners = this.__propListeners;
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
   * Proxy for `addEventListener` method.
   * Adds an event listener.
   */
  addEventListener(type: string, listener: any, options?: Record<string, any>) {
    const active = this.__activeListeners;
    active[type] = active[type] || [];
    const i = active[type].indexOf(listener);
    if (i === -1) {
      if (this.__node.__isIoElement) HTMLElement.prototype.addEventListener.call(this.__node, type, listener, options);
      active[type].push(listener);
    }
  }
  /**
   * Proxy for `removeEventListener` method.
   * Removes an event listener.
   */
  removeEventListener(type: string, listener?: any, options?: Record<string, any>) {
    const active = this.__activeListeners;
    if (active[type] !== undefined) {
      const i = active[type].indexOf(listener);
      if (i !== - 1 || listener === undefined) {
        if (this.__node.__isIoElement) HTMLElement.prototype.removeEventListener.call(this.__node, type, listener, options);
        active[type].splice(i, 1);
      }
    }
  }
  /**
   * Shorthand for custom event dispatch.
   */
  dispatchEvent(type: string, detail: Record<string, any> = {}, bubbles: boolean = true, src: HTMLElement | any = this.__node) {
    if (src instanceof HTMLElement || src === window) {
      HTMLElement.prototype.dispatchEvent.call(src, new CustomEvent(type, {detail: detail, bubbles: bubbles, composed: true, cancelable: true}));
      // HTMLElement.prototype.dispatchEvent.call(src, new CustomEvent(type, {type: type, detail: detail, bubbles: bubbles, composed: true, cancelable: true}));
    } else {
      const active = this.__activeListeners;
      if (active[type] !== undefined) {
        const array = active[type].slice(0);
        for (let i = 0; i < array.length; i ++) {
          array[i].call(src, {detail: detail, target: src, path: [src]});
          // TODO: consider bubbling.
        }
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
    const active = this.__activeListeners;
    for (let i in active) {
      for (let j = active[i].length; j--;) {
        if (this.__node.__isIoElement) HTMLElement.prototype.removeEventListener.call(this.__node, i, active[i][j]);
        active[i].splice(j, 1);
      }
    }
  }
}

export {ProtoListeners, EventDispatcher};
