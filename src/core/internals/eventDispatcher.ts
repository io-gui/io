import {ProtoChain} from './protoChain.js';
import {IoNode} from '../io-node.js';

export type ProtoListenerType = keyof IoNode | EventListener | ProtoListenerArrayType;
export type ProtoListenerArrayType = [keyof IoNode | EventListener, AddEventListenerOptions?];
export type ProtoListenerRecord = Record<string, ProtoListenerType>;
export type Listener = [EventListener, AddEventListenerOptions?];
export type Listeners = Record<string, Listener>;
export type ListenersArray = Record<string, Listener[]>;

type CallbackFunction = (arg?: any) => void;

/**
 * Array of all listeners defined as `static get Listeners()` return objects in prototype chain.
 */
export class ProtoListeners {
  [listener: string]: ProtoListenerArrayType;
  constructor(protochain: ProtoChain) {
    for (let i = protochain.length; i--;) {
      const listeners = (protochain[i] as any).Listeners as ProtoListenerRecord;
      for (const l in listeners) {
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
  private readonly __node: IoNode | HTMLElement;
  private readonly __nodeIsEventTarget: boolean;
  private readonly __protoListeners: Listeners = {};
  private readonly __propListeners: Listeners = {};
  private readonly __addedListeners: ListenersArray = {};
  private __connected = false;
  /**
   * Creates Event Dispatcher.
   * @param {IoNode | HTMLElement} node Node or element to add EventDispatcher to.
   * @param {ProtoListeners} [protoListeners] Protolisteners
   */
  constructor(node: IoNode | HTMLElement, protoListeners: ProtoListeners = {}) {
    this.__node = node;
    this.__nodeIsEventTarget = node instanceof EventTarget;
    Object.defineProperty(this, '__node',              {enumerable: false, writable: false});
    Object.defineProperty(this, '__nodeIsEventTarget', {enumerable: false, writable: false});
    Object.defineProperty(this, '__protoListeners',    {enumerable: false, writable: false});
    Object.defineProperty(this, '__propListeners',     {enumerable: false, writable: false});
    Object.defineProperty(this, '__connected',         {enumerable: false});

    for (const type in protoListeners) {
      const protoListener = protoListeners[type];
      const listenerObject = typeof protoListener[0] === 'function' ? protoListener[0] : this.__node[protoListener[0] as keyof (IoNode | HTMLElement)];
      const listenerOptions = protoListener[1];
      this.__protoListeners[type] = [listenerObject as EventListener];
      if (listenerOptions) this.__protoListeners[type].push(listenerOptions);
    }
  }
  /**
   * Sets listeners from inline properties (filtered form properties map by 'on-' prefix).
   * @param {Object} properties - Properties.
   */
  setPropListeners(properties: Record<string, ProtoListenerType>) {
    const newPropListeners: Listeners = {};
    for (const prop in properties) {
      if (prop.startsWith('on-')) {
        const type = prop.slice(3, prop.length);
        const listener = (properties[prop] instanceof Array) ? [...(properties[prop] as ProtoListenerArrayType)] : [properties[prop]];
        if (typeof listener[0] !== 'function') listener[0] = this.__node[listener[0] as keyof (IoNode | HTMLElement)];
        newPropListeners[type] = listener as Listener;
      }
    }
    const propListeners = this.__propListeners;
    for (const type in propListeners) {
      if (!newPropListeners[type]) {
        if (this.__connected && this.__nodeIsEventTarget) {
          EventTarget.prototype.removeEventListener.call(this.__node, type, propListeners[type][0], propListeners[type][1]);
        }
        delete propListeners[type];
      }
    }
    for (const type in newPropListeners) {
      if (this.__connected && this.__nodeIsEventTarget) {
        if (!propListeners[type]) {
          EventTarget.prototype.addEventListener.call(this.__node, type, newPropListeners[type][0], newPropListeners[type][1]);
        } else if ((propListeners[type][0] !== newPropListeners[type][0] || propListeners[type][1] !== newPropListeners[type][1])) {
          EventTarget.prototype.removeEventListener.call(this.__node, type, propListeners[type][0], propListeners[type][1]);
          EventTarget.prototype.addEventListener.call(this.__node, type, newPropListeners[type][0], newPropListeners[type][1]);
        }
      }
      propListeners[type] = newPropListeners[type];
    }
  }
  /**
   * Connects all event listeners.
   * @return {this} this
   */
  connect(): this {
    debug: {
      if (this.__connected) console.error('EventDispatcher: already connected!');
    }
    if (this.__nodeIsEventTarget) {
      for (const type in this.__protoListeners) {
        EventTarget.prototype.addEventListener.call(this.__node, type, this.__protoListeners[type][0], this.__protoListeners[type][1]);
      }
      for (const type in this.__propListeners) {
        EventTarget.prototype.addEventListener.call(this.__node, type, this.__propListeners[type][0], this.__propListeners[type][1]);
      }
      for (const type in this.__addedListeners) {
        for (let i = this.__addedListeners[type].length; i--;) {
          EventTarget.prototype.addEventListener.call(this.__node, type, this.__addedListeners[type][i][0], this.__addedListeners[type][i][1]);
        }
      }
    }
    this.__connected = true;
    return this;
  }
  /**
   * Disconnects all event listeners.
   * @return {this} this
   */
  disconnect(): this {
    debug: {
      if (!this.__connected) console.error('EventDispatcher: already disconnected!');
    }
    if (this.__nodeIsEventTarget) {
      for (const type in this.__protoListeners) {
        EventTarget.prototype.removeEventListener.call(this.__node, type, this.__protoListeners[type][0], this.__protoListeners[type][1]);
      }
      for (const type in this.__propListeners) {
        EventTarget.prototype.removeEventListener.call(this.__node, type, this.__propListeners[type][0], this.__propListeners[type][1]);
      }
      for (const type in this.__addedListeners) {
        for (let i = this.__addedListeners[type].length; i--;) {
          EventTarget.prototype.removeEventListener.call(this.__node, type, this.__addedListeners[type][i][0], this.__addedListeners[type][i][1]);
        }
      }
    }
    this.__connected = false;
    return this;
  }
  /**
   * Proxy for `addEventListener` method.
   * Adds an event listener.
   * @param {string} type Name of the event
   * @param {EventListener} listener Event listener handler
   * @param {AddEventListenerOptions} [options] Event listener options
   */
  addEventListener(type: string, listener: EventListener, options?: AddEventListenerOptions) {
    this.__addedListeners[type] = this.__addedListeners[type] || [];
    debug: {
      const l = this.__addedListeners[type].findIndex(l => l[0] === listener);
      if (l !== -1) console.warn(`EventDispatcher: listener ${type} already added!`);
    }
    this.__addedListeners[type].push((options ? [listener, options] : [listener]) as Listener);
    if (this.__connected && this.__nodeIsEventTarget) {
      EventTarget.prototype.addEventListener.call(this.__node, type, listener, options);
    }
  }
  /**
   * Proxy for `removeEventListener` method.
   * Removes an event listener.
   * @param {string} type Name of the event
   * @param {EventListener} listener Event listener handler
   * @param {AddEventListenerOptions} [options] Event listener options
  */
  removeEventListener(type: string, listener: EventListener, options?: AddEventListenerOptions) {
    debug: {
      if (!this.__addedListeners[type]) console.warn(`EventDispatcher: listener ${type} not found!`);
    }
    if (!listener) {
      for (let i = 0; i < this.__addedListeners[type].length; i ++) {
        if (this.__connected && this.__nodeIsEventTarget) {
          EventTarget.prototype.removeEventListener.call(this.__node, type, this.__addedListeners[type][i][0], this.__addedListeners[type][i][1]);
        }
      }
      this.__addedListeners[type].length = 0;
      delete this.__addedListeners[type];
    } else {
      const l = this.__addedListeners[type].findIndex(item => item[0] = listener);
      debug: {
        if (l === -1) console.warn(`EventDispatcher: listener ${type} not found!`);
      }
      this.__addedListeners[type].splice(l, 1);
      if (this.__connected && this.__nodeIsEventTarget) {
        EventTarget.prototype.removeEventListener.call(this.__node, type, listener, options);
      }
    }
  }
  /**
   * Shorthand for custom event dispatch.
   * @param {string} type Name of the event
   * @param {Object} detail Event detail data
   * @param {boolean} [bubbles] Makes event bubble
   * @param {EventTarget} [node] Event target to dispatch from
   */
  dispatchEvent(type: string, detail: Record<string, any> = {}, bubbles = true, node: EventTarget | IoNode = this.__node) {
    if (!this.__connected) return;
    if ((node instanceof EventTarget)) {
      EventTarget.prototype.dispatchEvent.call(node, new CustomEvent(type, {detail: detail, bubbles: bubbles, composed: true, cancelable: true}));
    } else {
      if (this.__protoListeners[type] !== undefined) {
        (this.__protoListeners[type][0] as CallbackFunction).call(node, {detail: detail, target: node, path: [node]});
      }
      if (this.__propListeners[type] !== undefined) {
        (this.__propListeners[type][0] as CallbackFunction).call(node, {detail: detail, target: node, path: [node]});
      }
      if (this.__addedListeners[type] !== undefined) {
        for (let i = 0; i < this.__addedListeners[type].length; i ++) {
          (this.__addedListeners[type][i][0] as CallbackFunction).call(node, {detail: detail, target: node, path: [node]});
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
    delete (this as any).__addedListeners;
  }
}

export {EventDispatcher};
