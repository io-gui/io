import { ChangeEvent } from './changeQueue';
import { IoNode } from '../node';

/**
 * Event listener types.
 */
export interface KeyboardEventListener { (event: KeyboardEvent): void }
export interface PointerEventListener { (event: PointerEvent): void }
export interface CustomEventListener { (event: CustomEvent): void }
export interface FocusEventListener { (event: FocusEvent): void }
export interface TouchEventListener { (event: TouchEvent): void }
export interface ChangeEventListener { (event: ChangeEvent): void }
export interface IoEventListener { (event: {detail: any, target: IoNode, path: IoNode[]}): void }
export type AnyEventListener = EventListener |
                               KeyboardEventListener |
                               PointerEventListener |
                               CustomEventListener |
                               FocusEventListener |
                               TouchEventListener |
                               ChangeEventListener |
                               IoEventListener;

/**
 * Listener definition type.
 * The first item is a string (function name) or an event listener function.
 * The second item is an optional object of event listener options.
 */
export type ListenerDefinition = [string | AnyEventListener, AddEventListenerOptions?];

/**
 * Loose listener definition type.
 * It can be a string (function name), an event AnyEventListener function or a ListenerDefinition array.
 */
export type ListenerDefinitionLoose = string | AnyEventListener | ListenerDefinition;

/**
 * Converts a loose listener definition into a strongly typed ListenerDefinition array format.
 * This ensures consistent handling of listeners regardless of how they were initially defined.
 *
 * @param {ListenerDefinitionLoose} listenerDefinition - Loosely typed listener definition
 * @return {ListenerDefinition} Normalized listener definition in [string | listener, options?] format
 */
export const hardenListenerDefinition = (listenerDefinition: ListenerDefinitionLoose): ListenerDefinition => {
  return Array.isArray(listenerDefinition) ? listenerDefinition : [listenerDefinition];
};

const LISTENER_OPTIONS = ['capture', 'passive'];

/**
 * Converts a listener definition into a normalized Listener tuple.
 * If the first item is a string, it looks up the method on the node.
 *
 * @param {IoNode | EventTarget} node - The node instance containing potential method references
 * @param {ListenerDefinition} def - The listener definition to normalize
 * @return {Listener} Normalized [listener, options?] tuple
 */
export const listenerFromDefinition = (node: IoNode | EventTarget, def: ListenerDefinition): Listener => {
  const handlerDef = def[0];
  const options = def[1];

  debug: {
    if (typeof handlerDef !== 'string' && typeof handlerDef !== 'function') {
      console.error('listenerFromDefinition: Listener must be a function or method name');
    }
    if (options) {
      if (typeof options !== 'object') {
        console.error('listenerFromDefinition: Listener options must be an object');
      } else {
        const invalidOptions = Object.keys(options).filter(k => !LISTENER_OPTIONS.includes(k));
        if (invalidOptions.length > 0) {
          console.error(`listenerFromDefinition: Invalid listener options: ${invalidOptions.join(', ')}`);
        }
      }
    }
    if (typeof handlerDef === 'string' && !(handlerDef in node)) {
      console.error(`listenerFromDefinition: Method "${handlerDef}" not found on node`);
    }
  }

  const handler = typeof handlerDef === 'string' ? (node as Record<string, AnyEventListener>)[handlerDef] : handlerDef;

  return options ? [handler, options] : [handler];
};

export type Listener = [AnyEventListener, AddEventListenerOptions?];
export type Listeners = Record<string, Listener[]>;

/**
 * Internal utility class responsible for handling listeners and dispatching events.
 * It makes events of all `IoNode` class instances compatible with DOM events.
 * It maintains three independent lists of listeners:
 *  - `protoListeners` specified as `get Listeners()` return value of class.
 *  - `propListeners` specified as inline properties prefixed with "@".
 *  - `addedListeners` explicitly added/removed using `addEventListener()` and `removeEventListener()`.
 */
export class EventDispatcher {
  readonly node: IoNode | EventTarget;
  readonly isEventTarget: boolean;
  readonly protoListeners: Listeners = {};
  readonly propListeners: Listeners = {};
  readonly addedListeners: Listeners = {};
  /**
   * Creates an instance of `EventDispatcher` for specified `IoNode` instance.
   * It initializes `protoListeners` from `ProtoChain`.
   * @param {IoNode} node owner IoNode
   */
  constructor(node: IoNode | EventTarget) {
    this.node = node;
    this.isEventTarget = node instanceof EventTarget;
    this.setProtoListeners(node as IoNode);
  }

  /**
   * Sets `protoListeners` specified as `get Listeners()` class definitions.
   * Definitions from subclass replace the ones from parent class.
   * @param {IoNode} node owner IoNode
   */
  setProtoListeners(node: IoNode) {
    for (const name in node._protochain?.listeners) {
      for (let i = 0; i < node._protochain.listeners[name].length; i++) {
        const listener = listenerFromDefinition(node, node._protochain.listeners[name][i]);
        this.protoListeners[name] = [listener];
      }
      if (this.isEventTarget && this.protoListeners[name]) {
        const listener = this.protoListeners[name][0];
        EventTarget.prototype.addEventListener.call(this.node, name, listener[0] as EventListener, listener[1]);
      }
    }
  }
  /**
   * Sets `propListeners` specified as inline properties prefixed with "@".
   * It removes existing `propListeners` that are no longer specified and it replaces the ones that changed.
   * @param {Record<string, any>} properties - Inline properties
   */
  applyPropListeners(properties: Record<string, any>) {
    // Create and object with new listeners
    const newPropListeners: Listeners = {};
    for (const prop in properties) {
      if (!prop.startsWith('@')) continue;

      const name = prop.slice(1);
      const definition = hardenListenerDefinition(properties[prop]);
      const listener = listenerFromDefinition(this.node, definition);
      newPropListeners[name] = [listener];
    }

    // Remove listeners that are no longer specified
    const propListeners = this.propListeners;
    for (const name in propListeners) {
      if (!newPropListeners[name]) {
        if (this.isEventTarget) {
          const listener = propListeners[name][0];
          EventTarget.prototype.removeEventListener.call(this.node, name, listener[0] as EventListener, listener[1]);
        }
        delete propListeners[name];
      }
    }

    // Add new listeners and remove old ones if they are different
    for (const name in newPropListeners) {
      if (this.isEventTarget) {
        const newListener = newPropListeners[name][0];
        if (propListeners[name]) {
          const oldListener = propListeners[name][0];
          if ((oldListener !== newListener || newListener[1] && (JSON.stringify(oldListener[1]) !== JSON.stringify(newListener[1])))) {
            EventTarget.prototype.removeEventListener.call(this.node, name, oldListener[0] as EventListener, oldListener[1]);
          }
        }
        EventTarget.prototype.addEventListener.call(this.node, name, newListener[0] as EventListener, newListener[1]);
      }
      propListeners[name] = newPropListeners[name];
    }
  }
  /**
   * Proxy for `addEventListener` method.
   * Adds an event listener to the node's `addedListeners` collection.
   * If the node is an EventTarget, also registers the listener with the DOM.
   * @param {string} name - Name of the event
   * @param {AnyEventListener} listener - Event listener handler
   * @param {AddEventListenerOptions} [options] - Event listener options
   */
  addEventListener(name: string, listener: AnyEventListener, options?: AddEventListenerOptions) {
    // Validate listener
    debug: {
      if (typeof listener !== 'function') {
        console.error('EventDispatcher.addEventListener: Invalid listener type - must be a function');
      }
      if (options) {
        if (typeof options !== 'object') {
          console.error('EventDispatcher.addEventListener: Invalid listener options type - must be an object');
        } else {
          const invalidOptions = Object.keys(options).filter(k => !LISTENER_OPTIONS.includes(k));
          if (invalidOptions.length > 0) {
            console.warn(`EventDispatcher.addEventListener: Invalid listener options: ${invalidOptions.join(', ')}`);
          }
        }
      }
    }

    // Initialize listener array if needed
    if (!this.addedListeners[name]) {
      this.addedListeners[name] = [];
    }

    // Check for duplicate listener
    const existingIndex = this.addedListeners[name].findIndex(l => l[0] === listener);
    if (existingIndex !== -1) {
      debug: console.warn(`EventDispatcher.addEventListener: Listener for '${name}' event already added`);
      return;
    }

    // Create and store listener tuple
    const listenerTuple: Listener = options ? [listener, options] : [listener];
    this.addedListeners[name].push(listenerTuple);

    if (this.isEventTarget) {
      EventTarget.prototype.addEventListener.call(this.node, name, listener as EventListener, options);
    }
  }

  /**
   * Proxy for `removeEventListener` method.
   * Removes an event listener from the node's `addedListeners` collection.
   * If `listener` is not specified it removes all listeners for specified `type`.
   * @param {string} name - Name of the event
   * @param {AnyEventListener} listener - Event listener handler
   * @param {AddEventListenerOptions} [options] - Event listener options
  */
  removeEventListener(name: string, listener?: AnyEventListener, options?: AddEventListenerOptions) {
    debug: {
      if (listener && typeof listener !== 'function') {
        console.error('EventDispatcher.removeEventListener: Invalid listener type!');
      }
      if (options) {
        if (typeof options !== 'object') {
          console.error('EventDispatcher.removeEventListener: Invalid listener options type - must be an object');
        } else {
          const invalidOptions = Object.keys(options).filter(k => !LISTENER_OPTIONS.includes(k));
          if (invalidOptions.length > 0) {
            console.warn(`EventDispatcher.removeEventListener: Invalid listener options: ${invalidOptions.join(', ')}`);
          }
        }

      }
      if (!this.addedListeners[name]) {
        console.error(`EventDispatcher.removeEventListener: Listener ${name} not found!`);
      }
    }

    if (!this.addedListeners[name]) return;

    if (!listener) {
      for (let i = 0; i < this.addedListeners[name].length; i ++) {
        if (this.isEventTarget) {
          const listener = this.addedListeners[name][i];
          EventTarget.prototype.removeEventListener.call(this.node, name, listener[0] as EventListener, listener[1]);
        }
      }
      this.addedListeners[name].length = 0;
    } else {
      const index = this.addedListeners[name].findIndex(item => item[0] === listener);
      debug: if (index === -1) {
        console.error(`EventDispatcher.removeEventListener: Listener ${name} not found!`);
      }
      if (index !== -1) {
        this.addedListeners[name].splice(index, 1);
        if (this.isEventTarget) {
          EventTarget.prototype.removeEventListener.call(this.node, name, listener as EventListener, options);
        }
      }
    }

    if (this.addedListeners[name].length === 0) {
      delete this.addedListeners[name];
    }
  }
  /**
   * Shorthand for custom event dispatch.
   * @param {string} name - Name of the event
   * @param {any} detail - Event detail data
   * @param {boolean} [bubbles] - Makes event bubble
   * @param {EventTarget} [node] - Event target override to dispatch the event from
   */
  dispatchEvent(name: string, detail?: any, bubbles = true, node: EventTarget | IoNode = this.node) {
    if ((node instanceof EventTarget)) {
      EventTarget.prototype.dispatchEvent.call(node, new CustomEvent(name, {detail: detail, bubbles: bubbles, composed: true, cancelable: true}));
    } else {
      const payload = {detail: detail, target: node, path: [node]};
      if (this.protoListeners[name]) {
        for (let i = 0; i < this.protoListeners[name].length; i ++) {
          const handler = this.protoListeners[name][i][0] as IoEventListener;
          handler.call(node, payload);
        }
      }
      if (this.propListeners[name]) {
        debug: if (this.propListeners[name].length > 1) {
          console.error(`EventDispatcher.dispathEvent: PropListeners[${name}] array too long!`);
        }
        const handler = this.propListeners[name][0][0] as IoEventListener;
        handler.call(node, payload);
      }
      if (this.addedListeners[name]) {
        for (let i = 0; i < this.addedListeners[name].length; i ++) {
          const handler = this.addedListeners[name][i][0] as IoEventListener;
          handler.call(node, payload);
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