import {ProtoChain} from './protoChain.js';
import {IoNode} from '../components/io-node.js';

type ProtoListenerType = keyof IoNode | EventListenerOrEventListenerObject | ProtoListenerArrayType;
type ProtoListenerArrayType = [keyof IoNode | EventListenerOrEventListenerObject, AddEventListenerOptions | undefined];

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
  private readonly __node: IoNode;
  private readonly __protoListeners: ProtoListeners;
  private readonly __propListeners: PropListeners = {};
  private readonly __connectedListeners: Record<string, EventListenerOrEventListenerObject[]> = {};
  private readonly __disconnectedListeners: Record<string, EventListenerOrEventListenerObject[]> = {};
  private readonly __listenerOptions: WeakMap<EventListenerOrEventListenerObject, AddEventListenerOptions | undefined> = new WeakMap();
  private __connected: boolean = false;
  /**
   * Creates Event Dispatcher.
   */
  constructor(node: IoNode, protoListeners: ProtoListeners) {
    this.__node = node;
    this.__protoListeners = protoListeners;
    Object.defineProperty(this, '__node',                  {enumerable: false, writable: false});
    Object.defineProperty(this, '__protoListeners',        {enumerable: false, writable: false});
    Object.defineProperty(this, '__propListeners',         {enumerable: false, writable: false});
    Object.defineProperty(this, '__connectedListeners',    {enumerable: false, writable: false});
    Object.defineProperty(this, '__disconnectedListeners', {enumerable: false, writable: false});
    Object.defineProperty(this, '__listenerOptions',       {enumerable: false, writable: false});
    Object.defineProperty(this, '__connected',             {enumerable: false});
  }
  /**
   * Sets listeners from inline properties (filtered form properties map by 'on-' prefix).
   * @param {Object} properties - Properties.
   */
  setPropListeners(properties: Record<string, ProtoListenerType>) {
    const newPropListeners: PropListeners = {};
    for (let prop in properties) {
      if (prop.startsWith('on-')) {
        const type = prop.slice(3, prop.length);
        const listener = (properties[prop] instanceof Array)
          ? [...(properties[prop] as ProtoListenerArrayType)]
          : [properties[prop]];
        if (typeof listener[0] !== 'function') listener[0] = this.__node[listener[0] as keyof IoNode];
        newPropListeners[type] = listener as PropListener;
      }
    }

    const propListeners = this.__propListeners;
    for (let type in propListeners) {
      if (!newPropListeners[type]) {
        if (this.__connected) this.removeEventListener(type, propListeners[type][0], propListeners[type][1]);
        delete propListeners[type];
      }
    }
    for (let type in newPropListeners) {
      if (this.__connected) {
        if (!propListeners[type]) {
          this.addEventListener(type, newPropListeners[type][0], newPropListeners[type][1]);
        } else if ((propListeners[type][0] !== newPropListeners[type][0] || propListeners[type][1] !== newPropListeners[type][1])) {
          this.removeEventListener(type, propListeners[type][0], propListeners[type][1]);
          this.addEventListener(type, newPropListeners[type][0], newPropListeners[type][1]);
        }
      }
      propListeners[type] = newPropListeners[type];
    }
  }
  /**
   * Connects all event listeners.
   */
  connect(): this {
    debug: {
      if (this.__connected) console.error('EventDispatcher: already connected!');
    }

    this.__connected = true;

    for (let type in this.__protoListeners) {
      const isFunction = typeof this.__protoListeners[type][0] === 'function';
      const listener = isFunction ? this.__protoListeners[type][0] : this.__node[this.__protoListeners[type][0] as keyof IoNode];
      this.addEventListener(type, listener, this.__protoListeners[type][1]);
    }

    for (let type in this.__propListeners) {
      this.addEventListener(type, this.__propListeners[type][0], this.__propListeners[type][1]);
    }

    for (let type in this.__disconnectedListeners) {
      for (let i = this.__disconnectedListeners[type].length; i--;) {
        const listener = this.__disconnectedListeners[type][i];
        const options = this.__listenerOptions.get(listener);
        debug: {
          if (this.__connectedListeners[type].indexOf(listener) !== -1) {
            console.error(`EventDispatcher: event ${type} already connected!`)
          }
        }
        this.addEventListener(type, listener, options);
        this.__disconnectedListeners[type].splice(i, 1);
      }
    }
    return this;
  }
  /**
   * Disconnects all event listeners.
   */
  disconnect(): this {
    debug: {
      if (!this.__connected) console.error('EventDispatcher: already disconnected!');
    }

    for (let type in this.__protoListeners) {
      const isFunction = typeof this.__protoListeners[type][0] === 'function';
      const listener = isFunction ? this.__protoListeners[type][0] : this.__node[this.__protoListeners[type][0] as keyof IoNode];
      this.removeEventListener(type, listener, this.__protoListeners[type][1]);
    }

    for (let type in this.__propListeners) {
      this.removeEventListener(type, this.__propListeners[type][0], this.__propListeners[type][1]);
    }

    for (let type in this.__connectedListeners) {
      this.__disconnectedListeners[type] = this.__disconnectedListeners[type] || [];
      for (let i = this.__connectedListeners[type].length; i--;) {
        const listener = this.__connectedListeners[type][i];
        const options = this.__listenerOptions.get(listener);
        debug: {
          if (this.__disconnectedListeners[type].indexOf(listener) !== -1) {
            console.error(`EventDispatcher: event ${type} already disconnected!`)
          }
        }
        this.removeEventListener(type, listener, options);
        this.__disconnectedListeners[type].push(listener);
      }
    }

    this.__connected = false;
    return this;
  }
  /**
   * Proxy for `addEventListener` method.
   * Adds an event listener.
   */
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions) {
    this.__connectedListeners[type] = this.__connectedListeners[type] || [];
    const i = this.__connectedListeners[type].indexOf(listener);
    if (i === -1) {
      // TODO: Test with IoElement and HTMLElement
      if (this.__node.__isIoElement) {
        HTMLElement.prototype.addEventListener.call(this.__node, type, listener, options);
      }
      this.__connectedListeners[type].push(listener);
      this.__listenerOptions.set(listener, options);
    }
  }
  /**
   * Proxy for `removeEventListener` method.
   * Removes an event listener.
   */
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions) {
    if (!this.__connected) {
      this.__disconnectedListeners[type] = this.__disconnectedListeners[type] || [];
      if (listener === undefined) {
        this.__disconnectedListeners[type].length = 0;
      } else {
        const i = this.__disconnectedListeners[type].indexOf(listener);
        if (i !== -1) this.__disconnectedListeners[type].splice(i, 1);
        if (!this.__disconnectedListeners[type].length) delete this.__disconnectedListeners[type];
        debug: {
          if (i === -1) {
            console.error(`EventDispatcher: event ${type} not found!`)
          }
        }
      }
    } else {
      this.__connectedListeners[type] = this.__connectedListeners[type] || [];
      if (listener === undefined) {
        for (let i = this.__connectedListeners[type].length; i--;) {
          const listener = this.__connectedListeners[type][i];
          const options = this.__listenerOptions.get(listener);
          debug: {
            if (this.__connectedListeners[type].indexOf(listener) === -1) {
              console.error(`EventDispatcher: event ${type} already disconnected!`)
            }
          }
          // TODO: Test with IoElement and HTMLElement
          if (this.__node.__isIoElement) {
            HTMLElement.prototype.removeEventListener.call(this.__node, type, listener, options);
          }
        }
        this.__connectedListeners[type].length = 0;
      } else {
        const i = this.__connectedListeners[type].indexOf(listener);
        // TODO: Test with IoElement and HTMLElement
        if (this.__node.__isIoElement) {
          options = options || this.__listenerOptions.get(listener);
          HTMLElement.prototype.removeEventListener.call(this.__node, type, listener, options);
        }
        if (i !== -1) this.__connectedListeners[type].splice(i, 1);
        if (!this.__connectedListeners[type].length) delete this.__connectedListeners[type];
        debug: {
          // TODO: investigate why this happens a lot for floating menu-options.
          if (i === -1) console.warn(`EventDispatcher: event ${type} not found!`);
        }
      }
    }
  }
  /**
   * Shorthand for custom event dispatch.
   */
  dispatchEvent(type: string, detail: Record<string, any> = {}, bubbles: boolean = true, src: Window | Document | HTMLElement | IoNode = this.__node) {
    // TODO: Test with IoNode, IoElement and native element
    if ((src instanceof HTMLElement || src === window)) {
      HTMLElement.prototype.dispatchEvent.call(src, new CustomEvent(type, {detail: detail, bubbles: bubbles, composed: true, cancelable: true}));
    } else {
      if (this.__connectedListeners[type] !== undefined) {
        // TODO: Test multiple listeners
        for (let i = 0; i < this.__connectedListeners[type].length; i ++) {
          (this.__connectedListeners[type][i] as Function).call(src, {detail: detail, target: src, path: [src]});
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
    if (this.__connected) this.disconnect();
    delete (this as any).__node;
    delete (this as any).__protoListeners;
    delete (this as any).__propListeners;
    delete (this as any).__connectedListeners;
    delete (this as any).__disconnectedListeners;
    delete (this as any).__listenerOptions;
    delete (this as any).__connected;
  }
}

export {EventDispatcher};
