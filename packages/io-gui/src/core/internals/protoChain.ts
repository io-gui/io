import { ProtoProperty } from './property';
import { ListenerDefinition, hardenListenerDefinition } from './eventDispatcher';
import { IoNode, IoNodeConstructor, Constructor, PropertyDefinitions, ListenerDefinitions } from '../node';

type ProtoConstructors = Array<IoNodeConstructor<any>>;
type ProtoHandlers = string[];
type ProtoProperties = { [property: string]: ProtoProperty };
type ProtoListeners = { [property: string]: ListenerDefinition[] };

export const propertyDecorators: WeakMap<Constructor, PropertyDefinitions> = new WeakMap();

const NON_OBSERVED = [String, Number, Boolean, Date, RegExp, Map, Set, WeakMap, WeakSet];
function isNonIoNodeConstructor(constructor: any) {
  if (typeof constructor !== 'function') return false;
  let proto = constructor.prototype;
  while (proto) {
    if (NON_OBSERVED.includes(constructor)) return false;
    if (proto.constructor.name === 'IoNodeMixinConstructor') return false;
    if (proto === Object.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
function isNonIoNodeObject(value: any) {
  return (typeof value === 'object' && value !== null && !value._isIoNode);
}
function isIoNodeObjectConstructor(constructor: any) {
  if (typeof constructor !== 'function') return false;
  let proto = constructor.prototype;
  while (proto) {
    if (proto.constructor.name === 'IoNodeMixinConstructor') return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

/**
 * ProtoChain manages class inheritance metadata and configuration.
 *
 * This utility class traverses the prototype chain during class registration to:
 * - Aggregate property configurations
 * - Aggregate event listeners
 * - Aggregate CSS styles strings
 * - Auto-bind event handlers to maintain proper 'this' context
 *
 * This class is internal and instantiated during the `Register()` process.
 */
export class ProtoChain {
  /**
   * Array of inherited class constructors
   */
  constructors: ProtoConstructors = [];
  /**
   * Aggregated property definition declared in `static get Properties()`
   */
  properties: ProtoProperties = {};
  /**
   * Aggregated listener definition declared in `static get Listeners()`
   */
  listeners: ProtoListeners = {};
  /**
   * Aggregated CSS style definition declared in `static get Style()`
   */
  styles: string = '';
  /**
   * Array of function names that start with "on[A-Z]" or "_on[A-Z]" for auto-binding.
   */
  handlers: ProtoHandlers = [];
  /**
   * Array of property names of mutation-observed object properties.
   */
  observedObjectProperties: string[] = [];
  /**
   * Array of property names of mutation-observed IoNode properties.
   */
  observedIoNodeProperties: string[] = [];
  /**
   * Creates an instance of `ProtoChain` for specified class constructor.
   * @param {IoNodeConstructor<any>} ioNodeConstructor - Owner `IoNode` constructor.
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
        this.constructors.push(ioNodeConstructor);
        this.addHandlers(proto);
        this.addStyles(ioNodeConstructor.Style);
        proto = Object.getPrototypeOf(proto);
        ioNodeConstructor = proto.constructor;
    }

    // Iterate through the prototype chain in reverse to aggregate inherited properties and listeners.
    // TODO: warn if property name is not allowed e.g. 'constructor', 'prototype', 'length', 'name',
    // 'property'. etc.
    let propHash = '';
    for (let i = this.constructors.length; i--;) {
      ioNodeConstructor = this.constructors[i];
      this.addPropertiesFromDecorators(ioNodeConstructor);
      propHash = this.addStaticProperties(ioNodeConstructor.Properties, propHash);
      this.addListeners(ioNodeConstructor.Listeners);
    }

    this.observedObjectProperties = this.getObservedObjectProperties();
    this.observedIoNodeProperties = this.getObservedIoNodeProperties();
    debug: this.validateProperties();
  }
  /**
   * Adds properties defined in decorators to the properties array.
   * @param {IoNodeConstructor<any>} ioNodeConstructor - Owner `IoNode` constructor.
   */
  addPropertiesFromDecorators(ioNodeConstructor: IoNodeConstructor<any>) {
    const props = propertyDecorators.get(ioNodeConstructor);
    if (props) for (const name in props) {
      const protoProperty = new ProtoProperty(props[name]);
      if (!this.properties[name]) this.properties[name] = protoProperty;
      this.properties[name].assign(protoProperty);
    }
  }
  /**
   * Adds static properties from `static get Properties()` to the properties array.
   * Only process properties if they differ from superclass.
   * This prevents 'static get Properties()' from overriding subclass properties defined in decorators.
   * @param {PropertyDefinitions} properties - Properties to add
   * @param {string} prevHash - Previous properties hash
   * @returns {string} - Updated properties hash
   */
  addStaticProperties(properties: PropertyDefinitions = {}, prevHash = ''): string {
    const protoProperties: Record<string, ProtoProperty> = {};
    for (const name in properties) {
      protoProperties[name] = new ProtoProperty(properties[name]);
    }
    /**
     * Note: JSON.stringify() is used to create a unique fingerprint of the properties object.
     * this does not provide completely accurate signiture of the binding but it's good enough.
     */
    const newHash = JSON.stringify(protoProperties);
    if (newHash !== prevHash) {
      for (const name in properties) {
       if (!this.properties[name]) this.properties[name] = protoProperties[name];
       else this.properties[name].assign(protoProperties[name]);
       prevHash = newHash;
     }
    }
    return prevHash;
  }
  /**
   * Merges or appends a listener definitions to the existing listeners array.
   * @param {ListenerDefinitions} listenerDefs - Listener definitions to add
   */
  addListeners(listenerDefs?: ListenerDefinitions) {
    for (const name in listenerDefs) {
      if (listenerDefs[name]) {
        const lsnDef = hardenListenerDefinition(listenerDefs[name]);
        const listeners = this.listeners[name] = this.listeners[name] || [];
        const i = listeners.findIndex(def => def[0] === lsnDef[0]);
        if (i !== -1) {
          if (listeners[i][1]) listeners[i][1] = Object.assign(listeners[i][1] as ListenerDefinition, lsnDef[1]);
          else if (lsnDef[1]) listeners[i][1] = lsnDef[1];
        } else {
          listeners.push(lsnDef);
        }
      }
    }
  }
  /**
   * Adds a style string to the styles array.
   * @param {string} style - Style string to add
   */
  addStyles(style?: string) {
    if (style && this.styles.indexOf(style) === -1) {
      this.styles = style + '\n' + this.styles;
    }
  };
  /**
   * Adds function names that start with "on[A-Z]" or "_on[A-Z]" to the handlers array.
   * @param {IoNode} proto - Prototype object to search for handlers
   */
  addHandlers(proto: IoNode) {
    const names = Object.getOwnPropertyNames(proto);
    for (let j = 0; j < names.length; j++) {
      const fn = names[j];
      if (/^on[A-Z]/.test(fn) || /^_on[A-Z]/.test(fn) || fn.endsWith('Changed') || fn.endsWith('Mutated') || fn === 'changed') {
        const propDesr = Object.getOwnPropertyDescriptor(proto, fn);
        if (propDesr === undefined || propDesr.get || propDesr.set) continue;
        if (typeof proto[fn] === 'function') {
          if (this.handlers.indexOf(fn) === -1) {
            this.handlers.push(fn);
          }
        }
      }
    }
  };
  /**
   * Creates observedObjectProperties array.
   * @returns {string[]} - Array of property names that are observed as native objects.
   */
  getObservedObjectProperties() {
    const observedObjectProperties: string[] = [];
    for (const name in this.properties) {
      const value = this.properties[name].value;
      const type = this.properties[name].type;
      if(isNonIoNodeObject(value) || isNonIoNodeConstructor(type)) {
        observedObjectProperties.push(name);
      }
    }
    return observedObjectProperties;
  }
  /**
   * Creates observedIoNodeProperties array.
   * @returns {string[]} - Array of property names that are observed as IoNode objects.
   */
  getObservedIoNodeProperties() {
    const observedIoNodeProperties: string[] = [];
    for (const name in this.properties) {
      const value = this.properties[name].value;
      const type = this.properties[name].type;
      if(value?._isIoNode || isIoNodeObjectConstructor(type)) {
        observedIoNodeProperties.push(name);
      }
    }
    return observedIoNodeProperties;
  }
  /**
   * Debug only.
   * Validates property definitions.
   * Logs warnings for incorrect property definitions.
   * @returns {void}
   */
  validateProperties() {
    for (const name in this.properties) {
      const prop = this.properties[name];
      if ([String, Number, Boolean].indexOf(prop.type as any) !== -1) {
        if (prop.type === Boolean && prop.value !== undefined && typeof prop.value !== 'boolean' ||
            prop.type === Number && prop.value !== undefined && typeof prop.value !== 'number' ||
            prop.type === String && prop.value !== undefined && typeof prop.value !== 'string') {
          console.warn(`Property "${name}" in ProtoChain: Incorrect value type for ${prop.type} property!`);
        }
      } else {
        const isNull = prop.value === null;
        const isUndefined = prop.value === undefined;
        if (typeof prop.type === 'function' && !(prop.value instanceof prop.type) && !isNull && !isUndefined) {
            console.warn(`Property "${name}" in ProtoChain: Incorrect value type for ${prop.type} property!`);
        }
      }
    }
  }
  /**
   * Auto-binds event handler methods (starting with 'on[A-Z]' or '_on[A-Z]') to preserve their 'this' context.
   * NOTE: Defining handlers as arrow functions will not work because they are not defined before constructor has finished.
   * @param {IoNode} node - Target node instance
   */
  autobindHandlers(node: IoNode) {
    debug: if (node.constructor !== this.constructors[0]) {
      console.warn('`autobindHandlers` should be used on', this.constructors[0].name, 'instance');
    }
    for (let i = this.handlers.length; i--;) {
      Object.defineProperty(node, this.handlers[i], {
        value: node[this.handlers[i]].bind(node),
        writable: true,
        configurable: true
      });
    }
  }
}
