import {IoNode, IoNodeConstructor} from '../node.js';
import {ProtoProperty, PropertyDecorators} from './property.js';
import {ListenerDeclaration, hardenListenerDeclaration, assignListenerDeclaration} from './eventDispatcher.js';

/**
 * Internal utility class that contains usefull information about class inheritance.
 * Inherited information is aggregated during prototype chain traversal in `RegisterIoNode()`.
 */
export class ProtoChain {
  /**
   * Array of inherited class constructors ending with `HTMLElement`, `Object` or `Array`.
   */
  readonly constructors: Array<IoNodeConstructor<any>> = [];
  /**
   * Array of function names that start with "on" or "_" for auto-binding.
   */
  readonly functions: Array<string> = [];
  /**
   * Aggregated property declarations declared in `static get Properties()` return ojects.
   */
  readonly properties: { [property: string]: ProtoProperty } = {};
  /**
   * Aggregated listener declarations declared in `static get Listeners()` return ojects.
   */
  readonly listeners: { [property: string]: ListenerDeclaration[] } = {};
  /**
   * Aggregated CSS style declarations declared in `static get Style()` return strings.
   */
  readonly style: string = '';
  /**
   * Array of property names of observed object properties.
   */
  readonly observedObjectProperties: string[] = [];
  /**
   * Creates an instance of `ProtoChain` for specified class constructor.
   * @param {IoNodeConstructor<any>} ioNodeConstructor - Owner `IoNode`-derived constructor.
   */
  constructor(ioNodeConstructor: IoNodeConstructor<any>) {
    let proto = ioNodeConstructor.prototype;
    // Iterate through the prototype chain to aggregate inheritance information.
    // Terminates at `HTMLElement`, `Object` or `Array`.
    while (
      proto
      && (ioNodeConstructor) !== HTMLElement
      && (ioNodeConstructor) !== Object
      && (ioNodeConstructor) !== Array) {
        // Add class constructor to array
        this.constructors.push(ioNodeConstructor);
        // Add function names that start with "on" or "_" for auto-binding
        const names = Object.getOwnPropertyNames(proto);
        for (let j = 0; j < names.length; j++) {
          const fn = names[j];
          if (fn.startsWith('_') || fn.startsWith('on')) {
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
        if (ioNodeConstructor.Style && this.style.indexOf(ioNodeConstructor.Style) === -1) {
          this.style = ioNodeConstructor.Style + '\n' + this.style;
        }
        // Continue prototype traversal
        proto = Object.getPrototypeOf(proto);
        ioNodeConstructor = proto.constructor;
    }

    // Iterate through the prototype chain once again in reverse to
    // aggregate inherited properties and listeners.
    let prevPropSigniture = '';
    for (let i = this.constructors.length; i--;) {
      let props;
      // Add properties from decorators
      props = PropertyDecorators.get(this.constructors[i] as any);
      if (props) for (const name in props) {
        const hardPropDef = new ProtoProperty(props[name]);
        if (!this.properties[name]) this.properties[name] = hardPropDef;
        this.properties[name].assign(hardPropDef);
      }
      // Add properties from `static get Properties()` return oject
      props = this.constructors[i].Properties;
      // Skip properties inherited from superclass to avoid overriding properties from subclass decorators.
      const propSigniture = JSON.stringify(props);
      if (propSigniture !== prevPropSigniture) for (const name in props) {
        const hardPropDef = new ProtoProperty(props[name]);
        if (!this.properties[name]) this.properties[name] = hardPropDef;
        this.properties[name].assign(hardPropDef);
        prevPropSigniture = propSigniture;
      }
      // Add listeners
      const listeners = this.constructors[i].Listeners;
      for (const lsnName in listeners) {
        if (listeners[lsnName]) {
          this.listeners[lsnName] = this.listeners[lsnName] || [];
          assignListenerDeclaration(this.listeners[lsnName], hardenListenerDeclaration(listeners[lsnName]));
        }
      }
    }
    // Create a list of observed object property names
    for (const name in this.properties) {
      if (this.properties[name].observe) {
        debug: {
          if (
            [String, Number, Boolean].indexOf(this.properties[name].type as any) !== -1
          ) {
            console.warn(`Property "${name}" in ProtoChain: "observe" is only intended for property definitions with Object data type!`);
          }
        }
        this.observedObjectProperties.push(name);
      }
      debug: {
        const prop = this.properties[name];
        if ([String, Number, Boolean].indexOf(this.properties[name].type as any) !== -1) {
          if (prop.type === Boolean && typeof prop.value !== 'boolean' ||
              prop.type === Number && typeof prop.value !== 'number' ||
              prop.type === String && typeof prop.value !== 'string') {
            console.warn(`Property "${name}" in ProtoChain: Incorrect value type for Boolean property!`);
          }
        } else {
          const isNull = this.properties[name].value === null;
          const isUndefined = this.properties[name].value === undefined;
          if (typeof prop.type === 'function' && !(prop.value instanceof prop.type) && !isNull && !isUndefined) {
              console.warn(`Property "${name}" in ProtoChain: Incorrect value type for Boolean property!`);
          }
        }
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
