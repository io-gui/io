import {IoNode, IoNodeConstructor} from '../io-node.js';
import {hardenPropertyDefinition, assignPropertyDefinition, PropertyDefinition} from './properties.js';
import {ListenerDefinition, hardenListenerDefinition, assignListenerDefinition} from './eventDispatcher.js';

/**
 * Internal utility class that contains usefull information about inherited class constructors,
 * auto-binding function names, properties, listeners, styles, as well as some helpful functions.
 * Inherited information is aggregated automatically by prototype chain traversal that
 * terminates at `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.
 * It helps collecting all information from inhertited classes specified in static getters
 * `static get Properties()`, `static get Listeners()`, `static get Style()` and aggregates
 * it in an additive manner, respecting the order of inheritance.
 */
export class ProtoChain {
  /*
   * Array of all constructors inherited from the prototype chain.
   */
  public readonly constructors: Array<IoNodeConstructor<any>> = [];
  /*
   * Array of all auto-binding function names that start with "on" or "_" inherited from the prototype chain.
   */
  public readonly functions: Array<string> = [];
  /*
   * Array of all properties defined as `static get Properties()` return objects.
   */
  public readonly properties: { [property: string]: PropertyDefinition } = {};
  /*
   * Array of all listeners defined as `static get Listeners()` return objects.
   */
  public readonly listeners: { [property: string]: ListenerDefinition[] } = {};
  /*
   * String containing all styles defined as `static get Style()` return strings.
   */
  public readonly style: string = '';
  /**
   * Creates an instance of `ProtoChain`.
   * @param {IoNodeConstructor<any>} ioNodeClass - Owner `IoNode`-derived class.
   */
  constructor(ioNodeClass: IoNodeConstructor<any>) {
    let proto = ioNodeClass.prototype;
    // Iterate through the prototype chain to create an array of all inherited
    // class constructors, auto-binding function names and style strings.
    // It terminates at `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.
    while (
      proto
      && ioNodeClass.name !== 'classConstructor'
      && (ioNodeClass) !== HTMLElement
      && (ioNodeClass) !== Object
      && (ioNodeClass) !== Array) {
        // Add class constructor to array
        this.constructors.push(ioNodeClass);
        // Add auto-binding function names
        const fnames = Object.getOwnPropertyNames(proto);
        for (let j = 0; j < fnames.length; j++) {
          const fn = fnames[j];
          const prop = Object.getOwnPropertyDescriptor(proto, fn);
          if (prop === undefined || prop.get || prop.set) continue;
          if (typeof proto[fn] === 'function') {
            if (this.functions.indexOf(fn) === -1 && (fn.startsWith('_') || fn.startsWith('on'))) {
              this.functions.push(fn);
            }
          }
        }
        // Concatinate style strings
        if (ioNodeClass.Style && this.style.indexOf(ioNodeClass.Style) === -1) {
          this.style = ioNodeClass.Style + '\n' + this.style;
        }
        // Continue prototype traversal
        proto = proto.__proto__;
        ioNodeClass = proto.constructor;
    }

    // Iterate through the prototype chain once again in reverse to
    // aggregate inherited properties and listeners.
    for (let i = this.constructors.length; i--;) {
      // Add properties
      const props = this.constructors[i].Properties;
      for (const p in props) {
        if (!this.properties[p]) this.properties[p] = hardenPropertyDefinition(props[p]);
        else assignPropertyDefinition(this.properties[p], hardenPropertyDefinition(props[p]));
        // Properties perfixed with "_" are by default not enumerable and don't emit change events
        if (p.charAt(0) === '_') {
          this.properties[p].notify = false;
          this.properties[p].enumerable = false;
        }
      }
      // Add listeners
      const listeners = this.constructors[i].Listeners;
      for (const l in listeners) {
        if (listeners[l]) {
          this.listeners[l] = this.listeners[l] || [];
          assignListenerDefinition(this.listeners[l], hardenListenerDefinition(listeners[l]));
        }
      }
    }
  }
  /**
   * Binds all functions from the `.functions` list to specified instance.
   * @param {IoNode} node - `IoNode` instance to bind functions to.
   */
  bindFunctions(node: IoNode) {
    for (let i = this.functions.length; i--;) {
      Object.defineProperty(node, this.functions[i], {value: node[this.functions[i]].bind(node)});
    }
  }
}
