import { Binding } from './binding';
import { Constructor, IoNode } from '../node';

/**
 * Configuration for a property of an IoNode class.
 * @typedef {Object} PropertyDefinition
 * @property {*} [value] The property's value. Can be any type unless `type` is specified.
 * @property {Constructor} [type] Constructor function defining the property's type.
 * @property {Binding} [binding] Binding object for two-way data synchronization.
 * @property {boolean} [reflect] Whether to reflect the property to an HTML attribute.
 * @property {*} [init] Initialization arguments for constructing initial value.
 */
export type PropertyDefinition = {
  value?: any;
  type?: Constructor;
  binding?: Binding;
  reflect?: boolean;
  init?: any;
};

/**
 * Allows loose definition of properties by specifying only partial definitions, such as default value, type or a binding object.
 * @typedef {(string|number|boolean|Array<*>|null|undefined|Constructor|Binding|PropertyDefinition)} PropertyDefinitionLoose
 */
export type PropertyDefinitionLoose = string | number | boolean | Array<any> | null | undefined | Constructor | Binding | PropertyDefinition;

/**
 * Instantiates a property definition object from a loosely or strongly typed property definition.
 * It facilitates merging of inherited property definitions from the prototype chain.
 * @class
 * @property {*} [value] The property's value. Can be any type.
 * @property {Constructor} [type] Constructor function defining the property's type.
 * @property {Binding} [binding] Binding object for two-way data synchronization.
 * @property {boolean} [reflect] Whether to reflect the property to an HTML attribute.
 * @property {*} [init] Initialization arguments for constructing initial values.
 */
export class ProtoProperty {
  value?: any;
  type?: Constructor;
  binding?: Binding;
  reflect?: boolean;
  init?: any;
  /**
   * Creates a property definition from various input types.
   * @param {PropertyDefinitionLoose} def Input definition which can be:
   * - `undefined` or `null`: Sets as value
   * - `Constructor`: Sets as type
   * - `Binding`: Sets value from binding and stores binding reference
   * - `PropertyDefinition`: Copies all defined fields
   * - Other values: Sets as value
   * @example
   * new ProtoProperty(String) // {type: String}
   * new ProtoProperty('hello') // {value: 'hello'}
   * new ProtoProperty({value: 42, type: Number}) // {value: 42, type: Number}
   * new ProtoProperty(new Binding(node, 'value')) // {value: node.value, binding: ...}
   */
  constructor(def: PropertyDefinitionLoose) {
    if (def === undefined || def === null) {
      this.value = def;
    } else if (typeof def === 'function') {
      this.type = def;
    } else if (def instanceof Binding) {
      this.value = def.value;
      this.binding = def;
    } else if (def && def.constructor === Object) {
      const d = def as PropertyDefinition;
      this.value = d.value !== undefined ? d.value : undefined;
      this.type = d.type !== undefined ? d.type : undefined;
      if (d.binding instanceof Binding) {
        this.binding = d.binding;
        this.value = this.binding.value;
      }
      if (d.reflect !== undefined) this.reflect = d.reflect;
      if (d.init !== undefined) this.init = d.init;
    } else if (!(def && def.constructor === Object)) {
      this.value = def;
    }
  }
  /**
   * Assigns values of another ProtoProperty to itself, unless they are default values.
   * @param {ProtoProperty} protoProp Source ProtoProperty
   */
  assign(protoProp: ProtoProperty) {
    if (protoProp.value !== undefined) this.value = protoProp.value;
    if (protoProp.type !== undefined) this.type = protoProp.type;
    if (protoProp.reflect !== undefined) this.reflect = protoProp.reflect;
    if (protoProp.init !== undefined) this.init = protoProp.init;
    if (protoProp.binding !== undefined) this.binding = protoProp.binding;
  }
  /**
   * Creates a serializable representation of the property definition.
   * Handles special cases for better JSON serialization:
   * - Converts object values to their constructor names
   * - Converts function types to their names
   * - Only includes defined fields
   * @returns {object} A plain object suitable for JSON serialization
   */
  toJSON() {
    const json: any = {
      value: this.value,
      type: this.type,
      reflect: this.reflect,
      init: this.init,
      binding: this.binding,
    };
    if (json.value && typeof json.value === 'object') {
      json.value = json.value.constructor.name;
    }
    if (json.type && typeof json.type === 'function') {
      json.type = json.type.name;
    }
    return json;
  }
}

function decodeInitArgument(item: any, node: IoNode) {
  if (item === 'this') {
    return node;
  } else if (typeof item === 'string' && item.startsWith('this.')) {
    const keys = item.split('.');
    let target: any = node;
    for (let i = 1; i < keys.length; i++) {
      target = target[keys[i]];
    }
    if (target) return target;
    debug: console.warn(`PropertyInstance: Invalid path ${item}`);
  } else return item;
}

/**
 * PropertyInstance object constructed from `ProtoProperty`.
 */
export class PropertyInstance {
  // Property value.
  value?: any = undefined;
  // Constructor of the property value.
  type?: Constructor;
  // Binding object.
  binding?: Binding;
  // Reflects to HTML attribute.
  reflect = false;
  // Initialize property with provided constructor arguments. `null` prevents initialization.
  init?: any = undefined;
  /**
   * Creates the property configuration object and copies values from `ProtoProperty`.
   * @param node owner IoNode instance
   * @param propDef ProtoProperty object
   */
  constructor(node: IoNode, propDef: ProtoProperty) {
    debug: {
      Object.keys(propDef).forEach(key => {
        if (['value', 'type', 'reflect', 'init', 'binding'].indexOf(key) === -1) {
          console.warn(`ProtoProperty: Invalid field ${key}`);
        }
      });
      if (propDef.type !== undefined) {
        if (typeof propDef.type !== 'function') console.warn('Incorrect type for "type" field');
      }
      if (propDef.binding !== undefined && propDef.binding.constructor !== Binding) console.warn('Incorrect type for "binding" field');
      if (propDef.reflect !== undefined && typeof propDef.reflect !== 'boolean') console.error(`Invalid reflect field ${propDef.reflect}!`);
    }

    this.value = propDef.value;
    this.type = propDef.type;
    this.binding = propDef.binding;
    if (propDef.reflect !== undefined) this.reflect = propDef.reflect;
    if (propDef.init !== undefined) this.init = propDef.init;

    if (this.binding instanceof Binding) {
      this.value = this.binding.value;
    } else if ((this.value === undefined || this.value === null) && this.init !== null) {
      if (this.type === Boolean) this.value = false;
      else if (this.type === String) this.value = '';
      else if (this.type === Number) this.value = 0;
      else if (typeof this.type === 'function') {
        if (this.init !== undefined) {
          if (this.init instanceof Array) {
            const args = this.init.map(item => decodeInitArgument(item, node));
            this.value = new this.type(...args);
          } else if (this.init instanceof Object) {
            const args: any = {};
            Object.keys(this.init).forEach(key => {
              args[key] = decodeInitArgument(this.init[key], node);
            });
            this.value = new this.type(args);
          } else {
            const argument = decodeInitArgument(this.init, node);
            this.value = new this.type(argument);
          }
        } else {
          this.value = new this.type();
        }
      }
    }

    debug: {
      if (this.value !== undefined && this.value !== null) {
        if ([String, Number, Boolean].indexOf(this.type as any) !== -1) {
          if (this.type === Boolean && typeof this.value !== 'boolean' ||
              this.type === Number && typeof this.value !== 'number' ||
              this.type === String && typeof this.value !== 'string') {
            console.warn(`Property: Incorrect value ${this.value} type for property ${name}!`);
          }
        } else {
          if (typeof this.type === 'function' && !(this.value instanceof this.type)) {
            console.warn(`Property: Incorrect value ${this.value} type for property ${name}!`);
          }
        }
      }
    }
  }
}