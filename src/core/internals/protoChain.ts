import { IoNode, IoNodeConstructor } from '../io-node.js';
import { ProtoProperty, assignProtoProperty } from './property.js';
import { ListenerDefinition, hardenListenerDefinition, assignListenerDefinition } from './eventDispatcher.js';

/**
 * Internal utility class that contains usefull information about class inheritance such as:
 * - Array of inherited class constructors ending with `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`
 * - Array of function names that start with "on" or "_" for auto-binding
 * - Property definitions declared in `static get Properties()` return oject
 * - Listener definitions declared in `static get Listeners()` return oject
 * - CSS style definitions declared in `static get Style()` return string
 * - Array of property names of observed object properties
 *
 * Inherited definitions are aggregated additively during prototype chain traversal in `IoNode`.
 */
export class ProtoChain {
  /*
   * Array of inherited class constructors ending with `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.
   */
  public readonly constructors: Array<IoNodeConstructor<any>> = [];
  /*
   * Array of function names that start with "on" or "_" for auto-binding.
   */
  public readonly functions: Array<string> = [];
  /*
   * Property definitions declared in `static get Properties()` return oject.
   */
  public readonly properties: { [property: string]: ProtoProperty } = {};
  /*
   * Listener definitions declared in `static get Listeners()` return oject.
   */
  public readonly listeners: { [property: string]: ListenerDefinition[] } = {};
  /*
   * CSS style definitions declared in `static get Style()` return string.
   */
  public readonly style: string = '';
  /*
   * Array of property names of observed object properties.
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
      && ioNodeClass.name !== 'IoNodeMixinConstructor'
      && (ioNodeClass) !== HTMLElement
      && (ioNodeClass) !== Object
      && (ioNodeClass) !== Array) {
        // Add class constructor to array
        this.constructors.push(ioNodeClass);
        // Add function names that start with "on" or "_" for auto-binding
        const names = Object.getOwnPropertyNames(proto);
        for (let j = 0; j < names.length; j++) {
          const fn = names[j];
          if (fn.startsWith('_on') || fn.startsWith('on')) {
            const propDesr = Object.getOwnPropertyDescriptor(proto, fn);
            if (propDesr === undefined || propDesr.get || propDesr.set) continue;
            if (typeof proto[fn] === 'function') {
              if (this.functions.indexOf(fn) === -1) {
                this.functions.push(fn);
              }
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
        const hardPropDef = new ProtoProperty(props[name]);
        if (!this.properties[name]) this.properties[name] = hardPropDef;
        else assignProtoProperty(this.properties[name], hardPropDef);
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
  }
  /**
   * Binds all auto-binding functions from the `.functions` array to specified `IoNode`-derived instance.
   * @param {IoNode} node - `IoNode` instance to bind functions to.
   */
  bindFunctions(node: IoNode) {
    debug: {
      if (node.constructor !== this.constructors[0]) {
        console.warn('`bindFunctions` should be used on', this.constructors[0].name, 'instance');
      }
    }
    for (let i = this.functions.length; i--;) {
      Object.defineProperty(node, this.functions[i], {value: node[this.functions[i]].bind(node)});
    }
  }
}
