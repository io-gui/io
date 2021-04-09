import {ProtoChain} from './protoChain.js';
import {Node} from '../node.js';

// type ActiveListenerType = [Function, CustomEventInit | undefined];
type ListenerArrayType = [string | Function, CustomEventInit | undefined];
type ListenerType = string | Function | ListenerArrayType;

 export class ProtoListeners {
  [listener: string]: ListenerArrayType;
  constructor(protochain: ProtoChain) {
    for (let i = protochain.length; i--;) {
      const listeners = (protochain[i] as any).Listeners as Record<string, ListenerType>;
      for (let l in listeners) {
        const listener = (listeners[l] instanceof Array) ? listeners[l] :[listeners[l]];
        this[l] = listener as ListenerArrayType;
      }
    }
  }
}

/**
 * Event Dispatcher.
 */
class EventDispatcher {
  private readonly __node: Node;
  private __protoListeners: ProtoListeners;
  private __propListeners: Record<string, any> = {};
  private __activeListeners: Record<string, any> = {};
  private __connected: boolean = false;
  /**
   * Creates Event Dispatcher.
   */
  constructor(node: Node, protoListeners: ProtoListeners) {
    this.__node = node;
    this.__protoListeners = protoListeners;
    Object.defineProperty(this, '__node',            {enumerable: false, writable: false});
    Object.defineProperty(this, '__protoListeners',  {enumerable: false});
    Object.defineProperty(this, '__propListeners',   {enumerable: false});
    Object.defineProperty(this, '__activeListeners', {enumerable: false});
    Object.defineProperty(this, '__connected',       {enumerable: false});
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
    debug: { if (this.__connected) console.error('EventDispatcher: already connected!') }
    this.__connected = true;
    const node = this.__node;

    const protoListeners = this.__protoListeners as any;
    for (let l in protoListeners) {
      this.addEventListener(l, node[protoListeners[l][0]], protoListeners[l][1]);
    }

    const listeners = this.__propListeners;
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
    debug: { if (!this.__connected) console.error('EventDispatcher: already disconnected!') }
    this.__connected = false;
    const node = this.__node;
    
    const protoListeners = this.__protoListeners as any;
    for (let l in protoListeners) {
      this.removeEventListener(l, node[protoListeners[l][0]], protoListeners[l][1]);
    }

    const listeners = this.__propListeners;
    for (let l in listeners) {
      if (listeners[l] instanceof Array) {
        const listener = typeof listeners[l][0] === 'function' ? listeners[l][0] : node[listeners[l][0]];
        this.removeEventListener(l, listener, listeners[l][1]);
      } else {
        const listener = typeof listeners[l] === 'function' ? listeners[l] : node[listeners[l]];
        this.removeEventListener(l, listener);
      }
    }

    // TODO: sort out!
    // const active = this.__activeListeners;
    // for (let i in active) {
    //   for (let j = active[i].length; j--;) {
    //     if (this.__node.__isIoElement) HTMLElement.prototype.removeEventListener.call(this.__node, i, active[i][j]);
    //     active[i].splice(j, 1);
    //   }
    // }
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
    if (this.__connected) this.disconnect();
  }
}

export {EventDispatcher};
