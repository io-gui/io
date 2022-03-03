import {Binding} from './binding.js';

type AnyConstructor = new (...args: any[]) => unknown;
type ReflectType = -1 | 0 | 1 | 2;

export type PropertyDefinitionWeak = string | number | boolean | Array<any> | null | undefined | AnyConstructor | Binding | {
  value?: any;
  type?: AnyConstructor;
  binding?: Binding;
  reflect?: ReflectType;
  notify?: boolean;
  observe?: boolean;
};

/**
 * Property definition class
 */
export class PropertyDefinition {
  value?: any;
  type?: AnyConstructor;
  binding?: Binding;
  reflect: ReflectType = 0;
  notify = true;
  observe = false;
  /**
   * Takes a weakly typed property definition and returns a strongly typed property definition.
   * @param {PropertyDefinitionWeak} def Weakly typed property definition
   */
  constructor(def: PropertyDefinitionWeak) {
    if (def === undefined || def === null) {
      this.value = def;
    } else if (typeof def === 'function') {
      this.type = def;
    } else if (def instanceof Binding) {
      this.value = def.value;
      this.type = (def.value !== undefined && def.value !== null) ? def.value.constructor : undefined;
      this.binding = def;
    } else if (def && def.constructor === Object) {
      const _def = def as PropertyDefinition;
      this.value = _def.value !== undefined ? _def.value : undefined;
      this.type = _def.type !== undefined ? _def.type : (_def.value !== undefined && _def.value !== null) ? _def.value.constructor : undefined;
      this.binding = _def.binding instanceof Binding ? _def.binding : undefined;
      this.reflect = _def.reflect !== undefined ? _def.reflect : 0;
      this.notify = _def.notify !== undefined ? _def.notify : true;
      this.observe = _def.observe !== undefined ? _def.observe : false;
      if (this.binding !== undefined) {
        this.value = this.binding.value;
      }
    } else if (!(def && def.constructor === Object)) {
      this.value = def;
      this.type = def.constructor as AnyConstructor;
    }
    if (this.value === undefined) {
      if (typeof this.type === 'function') {
        if (this.type === Boolean) this.value = false;
        else if (this.type === String) this.value = '';
        else if (this.type === Number) this.value = 0;
        else if (this.type === Array) this.value = [];
        else if (this.type === Object) this.value = {};
        else this.value = new this.type();
      }
    }
  }
}

/**
 * Assigns property definition values to another property definition, unless they are default values.
 * @param {PropertyDefinition} def Property definition
 * @param {PropertyDefinition} newDef Existing property definition
 */
export const assignPropertyDefinition = (def: PropertyDefinition, newDef: PropertyDefinition) => {
  if (newDef.value !== undefined) def.value = newDef.value;
  if (newDef.type !== undefined) def.type = newDef.type;
  if (newDef.reflect !== 0) def.reflect = newDef.reflect;
  if (newDef.notify !== true) def.notify = newDef.notify;
  if (newDef.observe !== false) def.observe = newDef.observe;
  if (newDef.binding !== undefined) def.binding = newDef.binding;
};

/**
 * Property configuration object.
 * It is initialized from corresponding `PropertyDefinition` in `ProtoChain`.
 */
export class Property {
  // Property value.
  public value?: any = undefined;
  // Constructor of the property value.
  public type?: AnyConstructor = undefined;
  // Binding object.
  public binding?: Binding = undefined;
  // Reflects to HTML attribute [-1, 0, 1 or 2]
  public reflect: ReflectType = 0;
  // Enables change handlers and events.
  public notify = true;
  // Observe object mutations for this property.
  public observe = false;
  /**
   * Creates the property configuration object and copies values from `PropertyDefinition`.
   * @param {PropertyDefinition} propDef PropertyDefinition object
   */
  constructor(propDef: PropertyDefinition) {
    debug: {
      Object.keys(propDef).forEach(key => {
        if (['value', 'type', 'reflect', 'notify', 'observe', 'binding'].indexOf(key) === -1) {
          console.warn(`PropertyDefinition: Invalid field ${key}`);
        }
      });
      if (propDef.type !== undefined && typeof propDef.type !== 'function') console.warn('Incorrect type for "type" field');
      if (propDef.binding !== undefined && propDef.binding.constructor !== Binding) console.warn('Incorrect type for "binding" field');
      if (propDef.reflect !== undefined && ([-1, 0, 1, 2]).indexOf(propDef.reflect) === -1) {
        console.error(`Invalid reflect field ${propDef.reflect}!`);
      }
      if (propDef.notify !== undefined && typeof propDef.notify !== 'boolean') console.warn('Incorrect type for "notify" field');
      if (propDef.observe !== undefined && typeof propDef.observe !== 'boolean') console.warn('Incorrect type for "observe" field');
    }

    this.value = propDef.value;
    this.type = propDef.type;
    this.binding = propDef.binding;
    this.reflect = propDef.reflect;
    this.notify = propDef.notify;
    this.observe = propDef.observe;

    if (this.binding instanceof Binding) {
      this.value = this.binding.value;
    } else {
      if (this.type === Array && this.value instanceof Array) {
        this.value = [...this.value];
      } else if (typeof this.type === 'function' && this.value instanceof Object) {
        this.value = Object.assign(new this.type(), this.value);
      }
    }
    debug: {
      if (this.value === undefined && typeof this.type === 'function') {
        console.warn('Property value should always be initialized when type is defined!');
      }
    }
  }
}