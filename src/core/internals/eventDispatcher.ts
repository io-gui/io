import {IoNode} from '../io-node.js';

export type ListenerDefinitionWeak = keyof IoNode | EventListener | [keyof IoNode | EventListener, AddEventListenerOptions?];

export type ListenerDefinition = [keyof IoNode | EventListener, AddEventListenerOptions?];

/**
 * Takes weakly typed listener definition and returns stronly typed listener definition.
 * @param {ListenerDefinitionWeak} def Weakly typed listener definition
 * @return {ListenerDefinition} Stronly typed listener definition
 */
export const hardenListenerDefinition = (def: ListenerDefinitionWeak): ListenerDefinition => {
  return def instanceof Array ? def : [def];
};

/**
 * Assigns listener definition to an existing array of listener definitions.
 * @param {ListenerDefinition[]} defs Array of listener definitions
 * @param {ListenerDefinition} def listener definition
 */
export const assignListenerDefinition = (defs: ListenerDefinition[], def: ListenerDefinition) => {
  const i = defs.findIndex(_def => _def[0] === def[0]);
  if (i !== -1) {
    if (defs[i][1]) defs[i][1] = Object.assign(defs[i][1], def[1]);
    else if (def[1]) defs[i][1] = def[1];
  } else {
    defs.push(def);
  }
};

/**
 * Takes a node and a listener definition and returns a listener.
 * @param {IoNode} node asd
 * @param {ListenerDefinition} def listener definition
 * @return {Listener} listener
 */
export const listenerFromDefinition = (node: IoNode, def: ListenerDefinition): Listener => {
  debug: {
    if (typeof def[0] !== 'string' && typeof def[0] !== 'function') console.warn('Invalid listener type');
    if (def[1]) {
      if (typeof def[1] !== 'object') console.warn('Invalid listener options type');
      else if (Object.keys(def[1]).some(k => !(['passive', 'capture'].includes(k)))) {
        console.warn('Invalid listener options type');
      }
    }
  }
  const listener: Listener = [typeof def[0] === 'string' ? node[def[0]] : def[0]];
  if (def[1]) listener.push(def[1]);
  return listener;
};

export type Listener = [EventListener, AddEventListenerOptions?];
export type Listeners = Record<string, Listener[]>;

/**
 * Internal utility class responsible for handling listeners and dispatching events.
 * It maintains three independent lists of listeners:
 *   1. `protoListeners` specified as `get Listeners()` class declarations.
 *   2. `propListeners` specified as inline properties prefixed with "on-"
 *   3. `addedListeners` explicitly added using `addEventListener()`.
 */
export class EventDispatcher {
  private readonly node: IoNode;
  private readonly isEventTarget: boolean;
  private readonly protoListeners: Listeners = {};
  private readonly propListeners: Listeners = {};
  private readonly addedListeners: Listeners = {};
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

    for (const name in node.__protochain?.listeners) {
      this.protoListeners[name] = [];
      for (let i = 0; i < node.__protochain.listeners[name].length; i++) {
        const listener = listenerFromDefinition(node, node.__protochain.listeners[name][i]);
        this.protoListeners[name].push(listener);
        if (this.isEventTarget) {
          EventTarget.prototype.addEventListener.call(this.node, name, listener[0], listener[1]);
        }
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
        const name = prop.slice(3, prop.length);
        const definition = hardenListenerDefinition(properties[prop]);
        const listener = listenerFromDefinition(this.node, definition);
        newPropListeners[name] = [listener];
      }
    }
    const propListeners = this.propListeners;
    for (const name in propListeners) {
      if (!newPropListeners[name]) {
        if (this.isEventTarget) {
          const definition = hardenListenerDefinition(propListeners[name][0]);
          const listener = listenerFromDefinition(this.node, definition);
          EventTarget.prototype.removeEventListener.call(this.node, name, listener[0], listener[1]);
        }
        delete propListeners[name];
      }
    }
    for (const name in newPropListeners) {
      if (this.isEventTarget) {
        const newDefinition = hardenListenerDefinition(newPropListeners[name][0]);
        const newListener = listenerFromDefinition(this.node, newDefinition);
        if (!propListeners[name]) {
          EventTarget.prototype.addEventListener.call(this.node, name, newListener[0], newListener[1]);
        } else {
          const definition = hardenListenerDefinition(propListeners[name][0]);
          const listener = listenerFromDefinition(this.node, definition);
          if ((listener !== newListener || newListener[1] && (JSON.stringify(listener[1]) !== JSON.stringify(newListener[1])))) {
            EventTarget.prototype.removeEventListener.call(this.node, name, listener[0], listener[1]);
            EventTarget.prototype.addEventListener.call(this.node, name, newListener[0], newListener[1]);
          }
        }
      }
      propListeners[name] = newPropListeners[name];
    }
  }
  /**
   * Proxy for `addEventListener` method.
   * Adds an event listener to `addedListeners`.
   * @param {string} name Name of the event
   * @param {EventListener} listener Event listener handler
   * @param {AddEventListenerOptions} [options] Event listener options
   */
  addEventListener(name: string, listener: EventListener, options?: AddEventListenerOptions) {
    this.addedListeners[name] = this.addedListeners[name] || [];
    debug: {
      const l = this.addedListeners[name].findIndex(l => l[0] === listener);
      if (l !== -1) console.warn(`Listener ${name} already added!`);
      if (typeof listener !== 'function') console.warn('Invalid listener type!');
      if (options) {
        if (typeof options !== 'object') console.warn('Invalid listener options type');
        else if (Object.keys(options).some(k => !(['passive', 'capture'].includes(k)))) console.warn('Invalid listener options type');
      }
    }
    this.addedListeners[name].push(options ? [listener, options] : [listener]);
    if (this.isEventTarget) {
      EventTarget.prototype.addEventListener.call(this.node, name, listener, options);
    }
  }
  /**
   * Proxy for `removeEventListener` method.
   * Removes an event listener from `addedListeners`.
   * If `listener` is not specified it removes all listeners for specified `type`.
   * @param {string} name Name of the event
   * @param {EventListener} listener Event listener handler
   * @param {AddEventListenerOptions} [options] Event listener options
  */
  removeEventListener(name: string, listener?: EventListener, options?: AddEventListenerOptions) {
    debug: {
      if (!this.addedListeners[name]) console.warn(`Listener ${name} not found!`);
      if (listener && typeof listener !== 'function') console.warn('Invalid listener type!');
      if (options) {
        if (typeof options !== 'object') console.warn('Invalid listener options type');
        else if (Object.keys(options).some(k => !(['passive', 'capture'].includes(k)))) {
          console.warn('Invalid listener options type');
        }
      }
    }
    if (!listener) {
      for (let i = 0; i < this.addedListeners[name].length; i ++) {
        if (this.isEventTarget) {
          const listener = this.addedListeners[name][i];
          EventTarget.prototype.removeEventListener.call(this.node, name, listener[0], listener[1]);
        }
      }
      this.addedListeners[name].length = 0;
    } else {
      const l = this.addedListeners[name].findIndex(item => item[0] = listener);
      debug: {
        if (l === -1) console.warn(`Listener ${name} not found!`);
      }
      this.addedListeners[name].splice(l, 1);
      if (this.isEventTarget) {
        EventTarget.prototype.removeEventListener.call(this.node, name, listener, options);
      }
    }
    if (this.addedListeners[name].length === 0) {
      delete this.addedListeners[name];
    }
  }
  /**
   * Shorthand for custom event dispatch.
   * @param {string} name Name of the event
   * @param {Record<string, any>} detail Event detail data
   * @param {boolean} [bubbles] Makes event bubble
   * @param {EventTarget} [node] Event target override to dispatch the event from
   */
  dispatchEvent(name: string, detail: Record<string, any> = {}, bubbles = true, node: EventTarget | IoNode = this.node) {
    if ((node instanceof EventTarget)) {
      EventTarget.prototype.dispatchEvent.call(node, new CustomEvent(name, {detail: detail, bubbles: bubbles, composed: true, cancelable: true}));
    } else {
      if (this.protoListeners[name]) {
        for (let i = 0; i < this.protoListeners[name].length; i ++) {
          this.protoListeners[name][i][0].call(node, {detail: detail, target: node, path: [node]} as any);
        }
      }
      if (this.propListeners[name]) {
        debug: {
          if (this.propListeners[name].length > 1) console.warn(`PropListeners[${name}] array too long!`);
        }
        this.propListeners[name][0][0].call(node, {detail: detail, target: node, path: [node]} as any);
      }
      if (this.addedListeners[name]) {
        for (let i = 0; i < this.addedListeners[name].length; i ++) {
          this.addedListeners[name][i][0].call(node, {detail: detail, target: node, path: [node]} as any);
        }
      }
    }
  }
  /**
   * Disconnects all event listeners and removes all references for garbage collection.
   * Use this when node is discarded.
   */
  dispose() {
    for (const name in this.protoListeners) {
      if (this.isEventTarget) {
        for (let i = 0; i < this.protoListeners[name].length; i++) {
          const listener = this.protoListeners[name][i];
          EventTarget.prototype.removeEventListener.call(this.node, name, listener[0], listener[1]);
        }
      }
      this.protoListeners[name].length = 0;
      delete this.protoListeners[name];
    }
    for (const name in this.propListeners) {
      if (this.isEventTarget) {
        const listener = this.propListeners[name][0];
        EventTarget.prototype.removeEventListener.call(this.node, name, listener[0], listener[1]);
      }
      this.propListeners[name].length = 0;
      delete this.propListeners[name];
    }
    for (const name in this.addedListeners) {
      if (this.isEventTarget) {
        for (let i = this.addedListeners[name].length; i--;) {
          const listener = this.addedListeners[name][i];
          EventTarget.prototype.removeEventListener.call(this.node, name, listener[0], listener[1]);
        }
      }
      this.addedListeners[name].length = 0;
      delete this.addedListeners[name];
    }
    delete (this as any).node;
    delete (this as any).protoListeners;
    delete (this as any).propListeners;
    delete (this as any).addedListeners;
  }
}