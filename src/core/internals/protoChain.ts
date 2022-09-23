import { IoNode, IoNodeConstructor } from '../node.js';
import { ProtoProperty, PropertyDecorators } from './property.js';
import { ListenerDefinition, hardenListenerDefinition, assignListenerDefinition } from './eventDispatcher.js';

/**
 * Internal utility class that contains usefull information about class inheritance.
 * Inherited definitions are aggregated additively during prototype chain traversal in `IoNode`.
 */
export class ProtoChain {
  /*
   * Array of inherited class constructors ending with `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.
   */
  readonly constructors: Array<IoNodeConstructor<any>> = [];
  /*
   * Array of function names that start with "on" or "_" for auto-binding.
   */
  readonly functions: Array<string> = [];
  /*
   * Aggregated property definitions declared in `static get Properties()` return ojects.
   */
  readonly properties: { [property: string]: ProtoProperty } = {};
  /*
   * Aggregated listener definitions declared in `static get Listeners()` return ojects.
   */
  readonly listeners: { [property: string]: ListenerDefinition[] } = {};
  /*
   * Aggregated CSS style definitions declared in `static get Style()` return strings.
   */
  readonly style: string = '';
  /*
   * Array of property names of observed object properties.
   */
  readonly observedObjectProperties: string[] = [];
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
        proto = Object.getPrototypeOf(proto);
        ioNodeClass = proto.constructor;
    }

    // Iterate through the prototype chain once again in reverse to
    // aggregate inherited properties and listeners.
    for (let i = this.constructors.length; i--;) {
      // Add properties from decorators
      let props = PropertyDecorators.get(this.constructors[i] as any);
      if (props) for (const name in props) {
        const hardPropDef = new ProtoProperty(props[name]);
        if (!this.properties[name]) this.properties[name] = hardPropDef;
        this.properties[name].assign(hardPropDef);
      }
      // Add properties
      props = this.constructors[i].Properties;
      for (const name in props) {
        const hardPropDef = new ProtoProperty(props[name]);
        if (!this.properties[name]) this.properties[name] = hardPropDef;
        this.properties[name].assign(hardPropDef);
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
    // Create a list of observed object property names
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
        this.observedObjectProperties.push(name);
      }
    }
  }
  /**
   * Binds all auto-binding functions from the `.functions` array to specified `IoNode`-derived instance.
   * @param {IoNode} node - `IoNode` instance to bind functions to.
   */
  autobindFunctions(node: IoNode) {
    debug: {
      if (node.constructor !== this.constructors[0]) {
        console.warn('`autobindFunctions` should be used on', this.constructors[0].name, 'instance');
      }
    }
    for (let i = this.functions.length; i--;) {
      // Using `Object.defineProperty` so we dont set the function as enumerable property.
      Object.defineProperty(node, this.functions[i], {
        value: node[this.functions[i]].bind(node),
        writable: true,
        configurable: true
      });
    }
  }
}
