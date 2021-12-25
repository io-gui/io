import {IoNode} from '../io-node.js';

export type ListenerDefinitionWeak = keyof IoNode | EventListener | [keyof IoNode | EventListener, AddEventListenerOptions?];

export type ListenerDefinition = [keyof IoNode | EventListener, AddEventListenerOptions?];

export const hardenListenerDefinition = (listenerDefinition: ListenerDefinitionWeak): ListenerDefinition => {
  debug: {
    if (listenerDefinition instanceof Array) {
      if (typeof listenerDefinition[0] !== 'string' && typeof listenerDefinition[0] !== 'function') console.warn('Invalid listener type');
      if (listenerDefinition[1] && typeof listenerDefinition[1] !== 'object') console.warn('Invalid listener options type');
    } else {
      if (typeof listenerDefinition !== 'string' && typeof listenerDefinition !== 'function') console.warn('Invalid listener type');
    }
  }
  return listenerDefinition instanceof Array ? listenerDefinition : [listenerDefinition];
};

export const assignListenerDefinition = (definitions: ListenerDefinition[], listenerDefinition: ListenerDefinition) => {
  const i = definitions.findIndex((listener) => listener[0] === listenerDefinition[0]);
  if (i !== -1) {
    if (definitions[i][1]) definitions[i][1] = Object.assign(definitions[i][1], listenerDefinition[1]);
    else if (listenerDefinition[1]) definitions[i][1] = listenerDefinition[1];
  } else {
    definitions.push(listenerDefinition);
  }
};

export const listenerFromDefinition = (node: IoNode, listenerDefinition: ListenerDefinition): Listener => {
  if (typeof listenerDefinition[0] === 'string') listenerDefinition[0] = node[listenerDefinition[0]];
  return listenerDefinition as Listener;
};

export type Listener = [EventListener, AddEventListenerOptions?];
export type Listeners = Record<string, Listener[]>;

/**
 * `EventDispatcher` responsible for handling listeners and dispatching events.
 * It maintains three independent lists of listeners:
 *   1. `protoListeners` specified as `get Listeners()` class declarations.
 *   2. `propListeners` specified as inline properties prefixed with "on-"
 *   3. `addedListeners` explicitly added using `addEventListener()`.
 */
class EventDispatcher {
  private readonly node: IoNode;
  private readonly isEventTarget: boolean;
  private readonly protoListeners: Listeners = {};
  private readonly propListeners: Listeners = {};
  private readonly addedListeners: Listeners = {};
  private connected = false;
  /**
   * Creates an instance of `EventDispatcher` for specified `IoNode` instance.
   * It initializes `protoListeners` from `ProtoChain`.
   * @param {IoNode} node owner IoNode.
   */
  constructor(node: IoNode) {
    this.node = node;
    this.isEventTarget = node instanceof EventTarget;
    Object.defineProperty(this, 'node',           {enumerable: false, writable: false});
    Object.defineProperty(this, 'isEventTarget',  {enumerable: false, writable: false});
    Object.defineProperty(this, 'protoListeners', {enumerable: false, writable: false});
    Object.defineProperty(this, 'propListeners',  {enumerable: false, writable: false});
    Object.defineProperty(this, 'addedListeners', {enumerable: false, writable: false});
    Object.defineProperty(this, 'connected',      {enumerable: false});

    for (const type in node.__protochain?.listeners) {
      this.protoListeners[type] = [];
      for (let i = 0; i < node.__protochain.listeners[type].length; i++) {
        this.protoListeners[type].push(listenerFromDefinition(this.node, node.__protochain.listeners[type][i]));
      }
    }
  }
  /**
   * Sets `propListeners` specified as inline properties prefixed with "on-".
   * It removes existing `propListeners` that are no longer specified and it replaces the ones that changed.
   * @param {Record<string, any>} properties - Inline properties.
   */
  setPropListeners(properties: Record<string, any>) {
    const newPropListeners: Listeners = {};
    for (const prop in properties) {
      if (prop.startsWith('on-')) {
        const type = prop.slice(3, prop.length);
        const definition = hardenListenerDefinition(properties[prop]);
        const listener = listenerFromDefinition(this.node, definition);
        newPropListeners[type] = [listener];
      }
    }
    const propListeners = this.propListeners;
    for (const type in propListeners) {
      if (!newPropListeners[type]) {
        if (this.connected && this.isEventTarget) {
          const definition = hardenListenerDefinition(propListeners[type][0]);
          const listener = listenerFromDefinition(this.node, definition);
          EventTarget.prototype.removeEventListener.call(this.node, type, listener[0], listener[1]);
        }
        delete propListeners[type];
      }
    }
    for (const type in newPropListeners) {
      if (this.connected && this.isEventTarget) {
        const newDefinition = hardenListenerDefinition(newPropListeners[type][0]);
        const newListener = listenerFromDefinition(this.node, newDefinition);
        if (!propListeners[type]) {
          EventTarget.prototype.addEventListener.call(this.node, type, newListener[0], newListener[1]);
        } else {
          const definition = hardenListenerDefinition(propListeners[type][0]);
          const listener = listenerFromDefinition(this.node, definition);
          if ((listener !== newListener || listener[1] !== newListener[1])) {
            EventTarget.prototype.removeEventListener.call(this.node, type, listener[0], listener[1]);
            EventTarget.prototype.addEventListener.call(this.node, type, newListener[0], newListener[1]);
          }
        }
      }
      propListeners[type] = newPropListeners[type];
    }
  }
  /**
   * Removes all `protoListeners`.
   */
   removeProtoListeners() {
    for (const type in this.protoListeners) {
      for (let i = this.protoListeners[type].length; i--;) {
        if (this.isEventTarget) {
          const listener = this.protoListeners[type][i];
          EventTarget.prototype.removeEventListener.call(this.node, type, listener[0], listener[1]);
        }
      }
      this.protoListeners[type].length = 0;
      delete this.protoListeners[type];
    }
  }
  /**
   * Removes all `propListeners`.
   */
   removePropListeners() {
    for (const type in this.propListeners) {
      if (this.isEventTarget) {
        const listener = this.propListeners[type][0];
        EventTarget.prototype.removeEventListener.call(this.node, type, listener[0], listener[1]);
      }
      this.propListeners[type].length = 0;
      delete this.propListeners[type];
    }
  }
  /**
   * Removes all `addedListeners`.
   */
  removeAddedListeners() {
    for (const type in this.addedListeners) {
      for (let i = this.addedListeners[type].length; i--;) {
        if (this.isEventTarget) {
          const listener = this.addedListeners[type][i];
          EventTarget.prototype.removeEventListener.call(this.node, type, listener[0], listener[1]);
        }
      }
      this.addedListeners[type].length = 0;
      delete this.addedListeners[type];
    }
  }
  /**
   * Connects all event listeners.
   * @return {this} this
   */
  connect(): this {
    debug: {
      if (this.connected) console.error('EventDispatcher already connected!');
    }
    if (this.isEventTarget) {
      for (const type in this.protoListeners) {
        for (let i = 0; i < this.protoListeners[type].length; i++) {
          const listener = this.protoListeners[type][i];
          EventTarget.prototype.addEventListener.call(this.node, type, listener[0], listener[1]);
        }
      }
      for (const type in this.propListeners) {
        const listener = this.propListeners[type][0];
        EventTarget.prototype.addEventListener.call(this.node, type, listener[0], listener[1]);
      }
      for (const type in this.addedListeners) {
        for (let i = this.addedListeners[type].length; i--;) {
          const listener = this.addedListeners[type][i];
          EventTarget.prototype.addEventListener.call(this.node, type, listener[0], listener[1]);
        }
      }
    }
    this.connected = true;
    return this;
  }
  /**
   * Disconnects all event listeners.
   * @return {this} this
   */
  disconnect(): this {
    debug: {
      if (!this.connected) console.error('EventDispatcher already disconnected!');
    }
    // this.removeProtoListeners();
    // this.removePropListeners();
    // this.removeAddedListeners();
    if (this.isEventTarget) {
      for (const type in this.protoListeners) {
        for (let i = 0; i < this.protoListeners[type].length; i++) {
          const listener = this.protoListeners[type][i];
          EventTarget.prototype.removeEventListener.call(this.node, type, listener[0], listener[1]);
        }
      }
      for (const type in this.propListeners) {
        const listener = this.propListeners[type][0];
        EventTarget.prototype.removeEventListener.call(this.node, type, listener[0], listener[1]);
      }
      for (const type in this.addedListeners) {
        for (let i = this.addedListeners[type].length; i--;) {
          const listener = this.addedListeners[type][i];
          EventTarget.prototype.removeEventListener.call(this.node, type, listener[0], listener[1]);
        }
      }
    }
    this.connected = false;
    return this;
  }
  /**
   * Proxy for `addEventListener` method.
   * Adds an event listener to `addedListeners`.
   * @param {string} type Name of the event
   * @param {EventListener} listener Event listener handler
   * @param {AddEventListenerOptions} [options] Event listener options
   */
  addEventListener(type: string, listener: EventListener, options?: AddEventListenerOptions) {
    this.addedListeners[type] = this.addedListeners[type] || [];
    debug: {
      const l = this.addedListeners[type].findIndex(l => l[0] === listener);
      if (l !== -1) console.warn(`Listener ${type} already added!`);
      if (typeof listener !== 'function') console.warn('Invalid listener type!');
      if (options && typeof options !== 'object') console.warn('Invalid options type!');
    }
    this.addedListeners[type].push(options ? [listener, options] : [listener]);
    if (this.connected && this.isEventTarget) {
      EventTarget.prototype.addEventListener.call(this.node, type, listener, options);
    }
  }
  /**
   * Proxy for `removeEventListener` method.
   * Removes an event listener from `addedListeners`.
   * If `listener` is not specified it removes all listeners for specified `type`.
   * @param {string} type Name of the event
   * @param {EventListener} listener Event listener handler
   * @param {AddEventListenerOptions} [options] Event listener options
  */
  removeEventListener(type: string, listener?: EventListener, options?: AddEventListenerOptions) {
    debug: {
      if (!this.addedListeners[type]) console.warn(`Listener ${type} not found!`);
      if (listener && typeof listener !== 'function') console.warn('Invalid listener type!');
      if (options && typeof options !== 'object') console.warn('Invalid options type!');
    }
    if (!listener) {
      for (let i = 0; i < this.addedListeners[type].length; i ++) {
        if (this.connected && this.isEventTarget) {
          const listener = this.addedListeners[type][i];
          EventTarget.prototype.removeEventListener.call(this.node, type, listener[0], listener[1]);
        }
      }
      this.addedListeners[type].length = 0;
      delete this.addedListeners[type];
    } else {
      const l = this.addedListeners[type].findIndex(item => item[0] = listener);
      debug: {
        if (l === -1) console.warn(`Listener ${type} not found!`);
      }
      this.addedListeners[type].splice(l, 1);
      if (this.connected && this.isEventTarget) {
        EventTarget.prototype.removeEventListener.call(this.node, type, listener, options);
      }
    }
  }
  /**
   * Shorthand for custom event dispatch.
   * @param {string} type Name of the event
   * @param {Record<string, any>} detail Event detail data
   * @param {boolean} [bubbles] Makes event bubble
   * @param {EventTarget} [node] Event target override to dispatch the event from
   */
  dispatchEvent(type: string, detail: Record<string, any> = {}, bubbles = true, node: EventTarget | IoNode = this.node) {
    if (!this.connected) {
      debug: {
        console.warn('Cannot dispatch event from disconnected node!');
      }
      return;
    }
    if ((node instanceof EventTarget)) {
      EventTarget.prototype.dispatchEvent.call(node, new CustomEvent(type, {detail: detail, bubbles: bubbles, composed: true, cancelable: true}));
    } else {
      if (this.protoListeners[type]) {
        for (let i = 0; i < this.protoListeners[type].length; i ++) {
          this.protoListeners[type][i][0].call(node, {detail: detail, target: node, path: [node]} as any);
        }
      }
      if (this.propListeners[type]) {
        debug: {
          if (this.propListeners[type].length > 1) console.warn(`PropListeners[${type}] array too long!`);
        }
        this.propListeners[type][0][0].call(node, {detail: detail, target: node, path: [node]} as any);
      }
      if (this.addedListeners[type]) {
        for (let i = 0; i < this.addedListeners[type].length; i ++) {
          this.addedListeners[type][i][0].call(node, {detail: detail, target: node, path: [node]} as any);
        }
      }
    }
  }
  /**
   * Disconnects all event listeners and removes all references.
   * Use this when node is no longer needed.
   */
  dispose() {
    if (this.connected) this.disconnect();
    delete (this as any).node;
    delete (this as any).protoListeners;
    delete (this as any).propListeners;
    delete (this as any).addedListeners;
  }
}

export {EventDispatcher};
