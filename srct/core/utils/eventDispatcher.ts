import {ProtoChain} from './protoChain.js';
import {Node} from '../node.js';

type ProtoListenerType = keyof Node | EventListenerOrEventListenerObject | ProtoListenerArrayType;
type ProtoListenerArrayType = [keyof Node | EventListenerOrEventListenerObject, AddEventListenerOptions | undefined];

type PropListener = [EventListenerOrEventListenerObject, AddEventListenerOptions | undefined];
type PropListeners = Record<string, PropListener>;

export class ProtoListeners {
  [listener: string]: ProtoListenerArrayType;
  constructor(protochain: ProtoChain) {
    for (let i = protochain.length; i--;) {
      const listeners = (protochain[i] as any).Listeners as Record<string, ProtoListenerType>;
      for (let l in listeners) {
        const listener = (listeners[l] instanceof Array) ? listeners[l] :[listeners[l]];
        this[l] = listener as ProtoListenerArrayType;
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
  private __propListeners: PropListeners = {};
  private __activeListeners: PropListeners = {};
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
  setPropListeners(props: Record<string, ProtoListenerType>) {
    // TODO: Unset propListeners, test.
    const listeners = this.__propListeners;

    const newListeners: PropListeners = {};
    for (let l in props) {
      if (l.startsWith('on-')) {
        const eventName = l.slice(3, l.length);
        const listener = (props[l] instanceof Array) ? [(props[l] as ProtoListenerArrayType)[0], (props[l] as ProtoListenerArrayType)[1]] : [props[l]];
        if (typeof listener[0] !== 'function') listener[0] = this.__node[listener[0] as keyof Node];
        newListeners[eventName] = listener as PropListener;
      }
    }
    for (let l in newListeners) {
      if (listeners[l]) {
        this.__node.removeEventListener(l, listeners[l][0], listeners[l][1]);
      }
      listeners[l] = newListeners[l];
      if (this.__connected) {
        this.__node.addEventListener(l, listeners[l][0], newListeners[l][1]);
      }
    }
  }
  /**
   * Connects all event listeners.
   */
  connect() {
    debug: { if (this.__connected) console.error('EventDispatcher: already connected!') }
    this.__connected = true;

    for (let l in this.__protoListeners) {
      const isFunction = typeof this.__protoListeners[l][0] === 'function';
      const listener = isFunction ? this.__protoListeners[l][0] : this.__node[this.__protoListeners[l][0] as keyof Node];
      this.addEventListener(l, listener, this.__protoListeners[l][1]);
    }

    for (let l in this.__propListeners) {
      this.addEventListener(l, this.__propListeners[l][0], this.__propListeners[l][1]);
    }
  }
  /**
   * Disconnects all event listeners.
   */
  disconnect() {
    debug: { if (!this.__connected) console.error('EventDispatcher: already disconnected!') }
    this.__connected = false;

    const protoListeners = this.__protoListeners as any;
    for (let l in protoListeners) {
      this.removeEventListener(l, this.__node[protoListeners[l][0]], protoListeners[l][1]);
    }

    for (let l in this.__propListeners) {
      this.removeEventListener(l, this.__propListeners[l][0], this.__propListeners[l][1]);
    }

    // TODO: sort out!
    // for (let i in this.__activeListeners) {
    //   for (let j = this.__activeListeners[i].length; j--;) {
    //     if (this.__node.__isIoElement) HTMLElement.prototype.removeEventListener.call(this.__node, i, this.__activeListeners[i][j]);
    //     this.__activeListeners[i].splice(j, 1);
    //   }
    // }
  }
  /**
   * Proxy for `addEventListener` method.
   * Adds an event listener.
   */
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions) {
    this.__activeListeners[type] = this.__activeListeners[type] || [];
    const i = this.__activeListeners[type].indexOf(listener);
    if (i === -1) {
      if (this.__node.__isIoElement) HTMLElement.prototype.addEventListener.call(this.__node, type, listener, options);
      this.__activeListeners[type].push(listener, options);
    }
  }
  /**
   * Proxy for `removeEventListener` method.
   * Removes an event listener.
   */
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions) {
    if (this.__activeListeners[type] !== undefined) {
      const i = this.__activeListeners[type].indexOf(listener);
      if (i !== - 1 || listener === undefined) {
        if (this.__node.__isIoElement) HTMLElement.prototype.removeEventListener.call(this.__node, type, listener, options);
        this.__activeListeners[type].splice(i, 1);
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
          (array[i] as Function).call(src, {detail: detail, target: src, path: [src]});
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
