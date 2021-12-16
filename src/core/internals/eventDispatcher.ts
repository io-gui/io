import {IoNode} from '../io-node.js';

export type ListenerDefinitionDetail = [keyof IoNode | EventListener, AddEventListenerOptions?];
export type ListenerDefinition = keyof IoNode | EventListener | ListenerDefinitionDetail;

// const toListenerDefinitionDetail = (listenerDefinition: ListenerDefinition): ListenerDefinitionDetail => {

// }

// export class ProtoListener {
// }

type Listener = [EventListener, AddEventListenerOptions?];

type Listeners = Record<string, Listener[]>;

type CallbackFunction = (arg?: any) => void;

/**
 * Event Dispatcher.
 */
class EventDispatcher {
  private readonly __node: IoNode | HTMLElement;
  private readonly __nodeIsEventTarget: boolean;
  private readonly __protoListeners: Listeners = {};
  private readonly __propListeners: Listeners = {};
  private readonly __addedListeners: Listeners = {};
  private __connected = false;
  /**
   * Creates Event Dispatcher.
   * @param {IoNode | HTMLElement} node Node or element to add EventDispatcher to.
   */
  constructor(node: IoNode | HTMLElement) {
    this.__node = node;
    this.__nodeIsEventTarget = node instanceof EventTarget;
    Object.defineProperty(this, '__node',              {enumerable: false, writable: false});
    Object.defineProperty(this, '__nodeIsEventTarget', {enumerable: false, writable: false});
    Object.defineProperty(this, '__protoListeners',    {enumerable: false, writable: false});
    Object.defineProperty(this, '__propListeners',     {enumerable: false, writable: false});
    Object.defineProperty(this, '__connected',         {enumerable: false});

    for (const type in (node as any).__protochain?.listeners) {
      const protoListener = (node as any).__protochain.listeners[type][0];
      const listenerObject = typeof protoListener[0] === 'function' ? protoListener[0] : this.__node[protoListener[0] as keyof (IoNode | HTMLElement)];
      const listenerOptions = protoListener[1];
      this.__protoListeners[type] = [[listenerObject as EventListener]];
      if (listenerOptions) this.__protoListeners[type][0].push(listenerOptions);
    }
  }
  /**
   * Sets listeners from inline properties (filtered form properties map by 'on-' prefix).
   * @param {Object} properties - Properties.
   */
  setPropListeners(properties: Record<string, ListenerDefinition>) {
    const newPropListeners: Listeners = {};
    for (const prop in properties) {
      if (prop.startsWith('on-')) {
        const type = prop.slice(3, prop.length);
        const listener = (properties[prop] instanceof Array) ? [...(properties[prop] as [ListenerDefinition])] : [properties[prop]];
        if (typeof listener[0] !== 'function') listener[0] = this.__node[listener[0] as keyof (IoNode | HTMLElement)];
        newPropListeners[type] = [listener as Listener];
      }
    }
    const propListeners = this.__propListeners;
    for (const type in propListeners) {
      if (!newPropListeners[type]) {
        if (this.__connected && this.__nodeIsEventTarget) {
          EventTarget.prototype.removeEventListener.call(this.__node, type, propListeners[type][0][0], propListeners[type][0][1]);
        }
        delete propListeners[type];
      }
    }
    for (const type in newPropListeners) {
      if (this.__connected && this.__nodeIsEventTarget) {
        if (!propListeners[type]) {
          EventTarget.prototype.addEventListener.call(this.__node, type, newPropListeners[type][0][0], newPropListeners[type][0][1]);
        } else if ((propListeners[type][0][0] !== newPropListeners[type][0][0] || propListeners[type][0][1] !== newPropListeners[type][0][1])) {
          EventTarget.prototype.removeEventListener.call(this.__node, type, propListeners[type][0][0], propListeners[type][0][1]);
          EventTarget.prototype.addEventListener.call(this.__node, type, newPropListeners[type][0][0], newPropListeners[type][0][1]);
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
        EventTarget.prototype.addEventListener.call(this.__node, type, this.__protoListeners[type][0][0], this.__protoListeners[type][0][1]);
      }
      for (const type in this.__propListeners) {
        EventTarget.prototype.addEventListener.call(this.__node, type, this.__propListeners[type][0][0], this.__propListeners[type][0][1]);
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
        EventTarget.prototype.removeEventListener.call(this.__node, type, this.__protoListeners[type][0][0], this.__protoListeners[type][0][1]);
      }
      for (const type in this.__propListeners) {
        EventTarget.prototype.removeEventListener.call(this.__node, type, this.__propListeners[type][0][0], this.__propListeners[type][0][1]);
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
        (this.__protoListeners[type][0][0] as CallbackFunction).call(node, {detail: detail, target: node, path: [node]});
      }
      if (this.__propListeners[type] !== undefined) {
        (this.__propListeners[type][0][0] as CallbackFunction).call(node, {detail: detail, target: node, path: [node]});
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
