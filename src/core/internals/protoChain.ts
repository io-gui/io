import { IoNode, IoNodeConstructor, ListenerDefinitions } from '../node.js';
import { ProtoProperty, PropertyDecorators, PropertyDefinitions, PropertyDefinitionLoose } from './property.js';
import { ListenerDefinition, hardenListenerDefinition } from './eventDispatcher.js';

type ProtoConstructors = Array<IoNodeConstructor<any>>;
type ProtoHandlers = string[];
type ProtoProperties = { [property: string]: ProtoProperty };
type ProtoListeners = { [property: string]: ListenerDefinition[] };

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
  mutationObservedProperties: string[] = [];
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
    let propHash = '';
    for (let i = this.constructors.length; i--;) {
      ioNodeConstructor = this.constructors[i];
      this.addPropertiesFromDecorators(ioNodeConstructor);
      propHash = this.addStaticProperties(ioNodeConstructor.Properties, propHash);
      this.addListeners(ioNodeConstructor.Listeners);
    }

    this.getMutationObservedProperties();
    debug: this.validateProperties();
  }
  /**
   * Adds properties defined in decorators to the properties array.
   * @param {IoNodeConstructor<any>} ioNodeConstructor - Owner `IoNode` constructor.
   */
  addPropertiesFromDecorators(ioNodeConstructor: IoNodeConstructor<any>) {
    const props = PropertyDecorators.get(ioNodeConstructor);
    if (props) for (const name in props) {
      const hardPropDef = new ProtoProperty(props[name]);
      if (!this.properties[name]) this.properties[name] = hardPropDef;
      this.properties[name].assign(hardPropDef);
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
    const newHash = this.serializeProperties(properties);
    if (newHash !== prevHash) for (const name in properties) {
      const hardPropDef = new ProtoProperty(properties[name]);
      if (!this.properties[name]) this.properties[name] = hardPropDef;
      this.properties[name].assign(hardPropDef);
      prevHash = newHash;
    }
    return prevHash;
  }
  /**
   * Serializes the properties object to a JSON string.
   * Note: JSON.stringify() is used to create a unique fingerprint of the properties object.
   * NOTE: this does not provide completely accurate signiture of the binding but it's good enough.
   * Not a hash in the cryptographic sense but serves the purpose.
   * @returns {string} - Serialized properties
   */
  serializeProperties(properties: PropertyDefinitions) {
    // TODO: consider using custom toJSON() method to avoid stringifying heavy objects in "value" and "type" fields.
    const enhancedProperties: Record<string, ProtoProperty> = {};
    for (const name in properties) {
      enhancedProperties[name] = new ProtoProperty(properties[name]);
    }
    return JSON.stringify(enhancedProperties);
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
      if (/^on[A-Z]/.test(fn) || /^_on[A-Z]/.test(fn)) {
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
   * Adds property names to the mutationObservedProperties array if the property has the 'observe' flag.
   * @returns {void}
   */
  getMutationObservedProperties() {
    for (const name in this.properties) {
      if (this.properties[name].observe) {
        this.mutationObservedProperties.push(name);
      }
    }
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
      if (prop.observe) {
        if (
          [String, Number, Boolean].indexOf(prop.type as any) !== -1
        ) {
          console.warn(`Property "${name}" in ProtoChain: "observe" is only intended for property definitions with Object data type!`);
        }
      }
      if ([String, Number, Boolean].indexOf(prop.type as any) !== -1) {
        if (prop.type === Boolean && typeof prop.value !== 'boolean' ||
            prop.type === Number && typeof prop.value !== 'number' ||
            prop.type === String && typeof prop.value !== 'string') {
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
