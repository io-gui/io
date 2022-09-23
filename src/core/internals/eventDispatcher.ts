import {IoNode, CustomEventListener} from '../node.js';

/**
 * Declares default listeners.
 */
export type ListenerDeclaration = [string | CustomEventListener, AddEventListenerOptions?];

/**
 * Allows weak declaration of listeners by specifying only partial declarations such as function or function name.
 */
export type ListenerDeclarationWeak = string | CustomEventListener | ListenerDeclaration;

/**
 * Takes weakly typed listener declaration and returns stronly typed listener declaration.
 * @param {ListenerDeclarationWeak} def Weakly typed listener declaration
 * @return {ListenerDeclaration} Stronly typed listener declaration
 */
export const hardenListenerDeclaration = (def: ListenerDeclarationWeak): ListenerDeclaration => {
  return def instanceof Array ? def : [def];
};

/**
 * Assigns source listener declaration to an existing array of listener declarations.
 * @param {ListenerDeclaration[]} defs Array of listener declarations
 * @param {ListenerDeclaration} srcDef Source listener declaration
 */
export const assignListenerDeclaration = (defs: ListenerDeclaration[], srcDef: ListenerDeclaration) => {
  const i = defs.findIndex(def => def[0] === srcDef[0]);
  if (i !== -1) {
    if (defs[i][1]) defs[i][1] = Object.assign(defs[i][1] as ListenerDeclaration, srcDef[1]);
    else if (srcDef[1]) defs[i][1] = srcDef[1];
  } else {
    defs.push(srcDef);
  }
};

const LISTENER_OPTIONS = ['capture', 'passive'];

/**
 * Takes a node and a listener declaration and returns a listener.
 * @param {IoNode} node `IoNode` instance
 * @param {ListenerDeclaration} def Listener declaration
 * @return {Listener} Listener
 */
export const listenerFromDefinition = (node: IoNode | HTMLElement, def: ListenerDeclaration): Listener => {
  debug: {
    if (typeof def[0] !== 'string' && typeof def[0] !== 'function') console.warn('Invalid listener type');
    if (def[1]) {
      if (typeof def[1] !== 'object') console.warn('Invalid listener options type');
      else if (Object.keys(def[1]).some(k => !(LISTENER_OPTIONS.includes(k)))) {
        console.warn('Invalid listener options type');
      }
    }
  }
  const listener: Listener = [typeof def[0] === 'string' ? (node as any)[def[0]] : def[0]];
  if (def[1]) listener.push(def[1]);
  return listener;
};

export type Listener = [CustomEventListener, AddEventListenerOptions?];
export type Listeners = Record<string, Listener[]>;

export type ListenersDeclaration = Record<string, ListenerDeclarationWeak>;

/**
 * Internal utility class responsible for handling listeners and dispatching events.
 * It makes events of all `IoNode` classes compatible with DOM events.
 * It maintains three independent lists of listeners:
 *  - `protoListeners` specified as `get Listeners()` class declarations
 *  - `propListeners` specified as inline properties prefixed with "on-"
 *  - `addedListeners` explicitly added using `addEventListener()`
 */
export class EventDispatcher {
  readonly node: IoNode | HTMLElement;
  readonly isEventTarget: boolean;
  readonly protoListeners: Listeners = {};
  readonly propListeners: Listeners = {};
  readonly addedListeners: Listeners = {};
  /**
   * Creates an instance of `EventDispatcher` for specified `IoNode` instance.
   * It initializes `protoListeners` from `ProtoChain`.
   * @param {IoNode} node owner IoNode
   */
  constructor(node: IoNode | HTMLElement) {
    this.node = node;
    this.isEventTarget = node instanceof EventTarget;
    this.setProtoListeners(node as IoNode);
  }
  /**
   * Sets `protoListeners` specified as `get Listeners()` class declarations.
   * @param {IoNode} node owner IoNode
   */
  setProtoListeners(node: IoNode) {
    for (const name in node._protochain?.listeners) {
      this.protoListeners[name] = [];
      for (let i = 0; i < node._protochain.listeners[name].length; i++) {
        const listener = listenerFromDefinition(node, node._protochain.listeners[name][i]);
        this.protoListeners[name]= [listener];
      }
      if (this.isEventTarget && this.protoListeners[name].length) {
        const listener = this.protoListeners[name][0];
        EventTarget.prototype.addEventListener.call(this.node, name, listener[0] as EventListener, listener[1]);
      }
    }
  }
  /**
   * Sets `propListeners` specified as inline properties prefixed with "on-".
   * It removes existing `propListeners` that are no longer specified and it replaces the ones that changed.
   * @param {Record<string, any>} properties Inline properties
   */
  applyPropListeners(properties: Record<string, any>) {
    const newPropListeners: Listeners = {};
    for (const prop in properties) {
      if (prop.startsWith('on-')) {
        const name = prop.slice(3, prop.length);
        const definition = hardenListenerDeclaration(properties[prop]);
        const listener = listenerFromDefinition(this.node, definition);
        newPropListeners[name] = [listener];
      }
    }
    const propListeners = this.propListeners;
    for (const name in propListeners) {
      if (!newPropListeners[name]) {
        if (this.isEventTarget) {
          const definition = hardenListenerDeclaration(propListeners[name][0]);
          const listener = listenerFromDefinition(this.node, definition);
          EventTarget.prototype.removeEventListener.call(this.node, name, listener[0] as EventListener, listener[1]);
        }
        delete propListeners[name];
      }
    }
    for (const name in newPropListeners) {
      if (this.isEventTarget) {
        const newDefinition = hardenListenerDeclaration(newPropListeners[name][0]);
        const newListener = listenerFromDefinition(this.node, newDefinition);
        if (!propListeners[name]) {
          EventTarget.prototype.addEventListener.call(this.node, name, newListener[0] as EventListener, newListener[1]);
        } else {
          const definition = hardenListenerDeclaration(propListeners[name][0]);
          const listener = listenerFromDefinition(this.node, definition);
          if ((listener !== newListener || newListener[1] && (JSON.stringify(listener[1]) !== JSON.stringify(newListener[1])))) {
            EventTarget.prototype.removeEventListener.call(this.node, name, listener[0] as EventListener, listener[1]);
            EventTarget.prototype.addEventListener.call(this.node, name, newListener[0] as EventListener, newListener[1]);
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
   * @param {CustomEventListener} listener Event listener handler
   * @param {AddEventListenerOptions} [options] Event listener options
   */
  addEventListener(name: string, listener: CustomEventListener, options?: AddEventListenerOptions) {
    this.addedListeners[name] = this.addedListeners[name] || [];
    debug: {
      const l = this.addedListeners[name].findIndex(l => l[0] === listener);
      if (l !== -1) console.warn(`Listener ${name} already added!`);
      if (typeof listener !== 'function') console.warn('Invalid listener type!');
      if (options) {
        if (typeof options !== 'object') console.warn('Invalid listener options type');
        else if (Object.keys(options).some(k => !(LISTENER_OPTIONS.includes(k)))) console.warn('Invalid listener options type');
      }
    }
    this.addedListeners[name].push(options ? [listener, options] : [listener]);
    if (this.isEventTarget) {
      EventTarget.prototype.addEventListener.call(this.node, name, listener as EventListener, options);
    }
  }
  /**
   * Proxy for `removeEventListener` method.
   * Removes an event listener from `addedListeners`.
   * If `listener` is not specified it removes all listeners for specified `type`.
   * @param {string} name Name of the event
   * @param {CustomEventListener} listener Event listener handler
   * @param {AddEventListenerOptions} [options] Event listener options
  */
  removeEventListener(name: string, listener?: CustomEventListener, options?: AddEventListenerOptions) {
    debug: {
      if (!this.addedListeners[name]) console.warn(`Listener ${name} not found!`);
      if (listener && typeof listener !== 'function') console.warn('Invalid listener type!');
      if (options) {
        if (typeof options !== 'object') console.warn('Invalid listener options type');
        else if (Object.keys(options).some(k => !(LISTENER_OPTIONS.includes(k)))) {
          console.warn('Invalid listener options type');
        }
      }
    }
    if (!listener) {
      for (let i = 0; i < this.addedListeners[name].length; i ++) {
        if (this.isEventTarget) {
          const listener = this.addedListeners[name][i];
          EventTarget.prototype.removeEventListener.call(this.node, name, listener[0] as EventListener, listener[1]);
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
        EventTarget.prototype.removeEventListener.call(this.node, name, listener as EventListener, options);
      }
    }
    if (this.addedListeners[name].length === 0) {
      delete this.addedListeners[name];
    }
  }
  /**
   * Shorthand for custom event dispatch.
   * @param {string} name Name of the event
   * @param {any} detail Event detail data
   * @param {boolean} [bubbles] Makes event bubble
   * @param {EventTarget} [node] Event target override to dispatch the event from
   */
  dispatchEvent(name: string, detail?: any, bubbles = true, node: EventTarget | IoNode = this.node) {
    const payload = {detail: detail, target: node, path: [node]} as any;
    if ((node instanceof EventTarget)) {
      EventTarget.prototype.dispatchEvent.call(node, new CustomEvent(name, {detail: detail, bubbles: bubbles, composed: true, cancelable: true}));
    } else {
      if (this.protoListeners[name]) {
        for (let i = 0; i < this.protoListeners[name].length; i ++) {
          this.protoListeners[name][i][0].call(node, payload);
        }
      }
      if (this.propListeners[name]) {
        debug: {
          if (this.propListeners[name].length > 1) console.warn(`PropListeners[${name}] array too long!`);
        }
        this.propListeners[name][0][0].call(node, payload);
      }
      if (this.addedListeners[name]) {
        for (let i = 0; i < this.addedListeners[name].length; i ++) {
          this.addedListeners[name][i][0].call(node, payload);
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
          EventTarget.prototype.removeEventListener.call(this.node, name, listener[0] as EventListener, listener[1]);
        }
      }
      this.protoListeners[name].length = 0;
      delete this.protoListeners[name];
    }
    for (const name in this.propListeners) {
      if (this.isEventTarget) {
        const listener = this.propListeners[name][0];
        EventTarget.prototype.removeEventListener.call(this.node, name, listener[0] as EventListener, listener[1]);
      }
      this.propListeners[name].length = 0;
      delete this.propListeners[name];
    }
    for (const name in this.addedListeners) {
      if (this.isEventTarget) {
        for (let i = this.addedListeners[name].length; i--;) {
          const listener = this.addedListeners[name][i];
          EventTarget.prototype.removeEventListener.call(this.node, name, listener[0] as EventListener, listener[1]);
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