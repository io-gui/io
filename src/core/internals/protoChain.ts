import {IoNode, IoNodeConstructor} from '../io-node.js';
import {PropertyDefinition, assignPropertyDefinition} from './property.js';
import {ListenerDefinition, hardenListenerDefinition, assignListenerDefinition} from './eventDispatcher.js';

/**
 * Internal utility class that contains usefull information about class inheritance such as:
 * - Array of inherited class constructors up until `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`
 * - Array of auto-binding function names that start with "on" or "_"
 * - Properties declared in `static get Properties()` return oject
 * - Listeners declared in `static get Listeners()` return oject
 * - CSS style string declared in `static get Style()` return string
 * - Array of property names with `observed: true`
 *
 * Inherited information is aggregated automatically by prototype chain traversal that
 * It collects information from inhertited classes specified in static getters in an additive manner,
 * respecting the order of inheritance.
 */
export class ProtoChain {
  /*
   * Array of inherited class constructors up until `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.
   */
  public readonly constructors: Array<IoNodeConstructor<any>> = [];
  /*
   * Array of auto-binding function names that start with "on" or "_".
   */
  public readonly functions: Array<string> = [];
  /*
   * Properties declared in `static get Properties()` return oject.
   */
  public readonly properties: { [property: string]: PropertyDefinition } = {};
  /*
   * Listeners declared in `static get Listeners()` return oject.
   */
  public readonly listeners: { [property: string]: ListenerDefinition[] } = {};
  /*
   * CSS style string declared in `static get Style()` return string.
   */
  public readonly style: string = '';
  /*
   * Array of property names with `observed: true`.
   */
  public readonly observedObjects: string[] = [];
  /**
   * Creates an instance of `ProtoChain`.
   * @param {IoNodeConstructor<any>} ioNodeClass - Owner `IoNode`-derived class.
   */
  constructor(ioNodeClass: IoNodeConstructor<any>) {
    let proto = ioNodeClass.prototype;
    // Iterate through the prototype chain to aggregate inheritance information.
    // Terminates at `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.
    while (
      proto
      && ioNodeClass.name !== 'classConstructor'
      && (ioNodeClass) !== HTMLElement
      && (ioNodeClass) !== Object
      && (ioNodeClass) !== Array) {
        // Add class constructor to array
        this.constructors.push(ioNodeClass);
        // Add auto-binding function names
        const names = Object.getOwnPropertyNames(proto);
        for (let j = 0; j < names.length; j++) {
          const fn = names[j];
          const propDesr = Object.getOwnPropertyDescriptor(proto, fn);
          if (propDesr === undefined || propDesr.get || propDesr.set) continue;
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
      for (const name in props) {
        const hardPropDef = new PropertyDefinition(props[name]);
        if (!this.properties[name]) this.properties[name] = hardPropDef;
        else assignPropertyDefinition(this.properties[name], hardPropDef);
      }
      // Add listeners
      const listeners = this.constructors[i].Listeners;
      for (const lsnrName in listeners) {
        if (listeners[lsnrName]) {
          this.listeners[lsnrName] = this.listeners[lsnrName] || [];
          assignListenerDefinition(this.listeners[lsnrName], hardenListenerDefinition(listeners[lsnrName]));
        }
      }
    }
    // Create a list of observed objects
    for (const name in this.properties) {
      if (this.properties[name].observe) {
        debug: {
          const isNull = this.properties[name].value === null;
          const isUndefined = this.properties[name].value === undefined;
          const isObject = this.properties[name].value instanceof Object;
          if (
            [String, Number, Boolean].indexOf(this.properties[name].type as any) !== -1 ||
            (!isNull && !isUndefined && !isObject)
          ) {
            console.warn('Property `observe` is only intended for object properties!');
          }
        }
        this.observedObjects.push(name);
      }
    }
    debug: {
      Object.defineProperty(this, 'constructors',    {enumerable: false, writable: false});
      Object.defineProperty(this, 'functions',       {enumerable: false, writable: false});
      Object.defineProperty(this, 'properties',      {enumerable: false, writable: false});
      Object.defineProperty(this, 'listeners',       {enumerable: false, writable: false});
      Object.defineProperty(this, 'style',           {enumerable: false, writable: false});
      Object.defineProperty(this, 'observedObjects', {enumerable: false, writable: false});
    }
  }
  /**
   * Binds all auto-binding functions from the `.functions` list to specified `IoNode` instance.
   * @param {IoNode} node - `IoNode` instance to bind functions to.
   */
  bindFunctions(node: IoNode) {
    for (let i = this.functions.length; i--;) {
      Object.defineProperty(node, this.functions[i], {value: node[this.functions[i]].bind(node)});
    }
  }
}
