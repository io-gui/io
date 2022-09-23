import { Constructor, IoNode } from '../io-node.js';
import { Binding } from './binding.js';

export const REFLECT_ATTR = -1;
export const REFLECT_NONE = 0;
export const REFLECT_PROP = 1;
export const REFLECT_BOTH = 2;

type ReflectType = typeof REFLECT_ATTR | typeof REFLECT_NONE | typeof REFLECT_PROP | typeof REFLECT_BOTH;

export type PropertyDeclaration = {
  value?: any;
  type?: Constructor;
  binding?: Binding;
  reflect?: ReflectType;
  notify?: boolean;
  observe?: boolean;
};

export type PropertyDeclarationWeak = string | number | boolean | Array<any> | null | undefined | Constructor | Binding | PropertyDeclaration;

/**
 * ProtoProperty definition
 */
export class ProtoProperty {
  value?: any;
  type?: Constructor;
  binding?: Binding;
  reflect: ReflectType = REFLECT_NONE;
  notify = true;
  observe = false;
  /**
   * Takes a weakly typed property definition and returns a strongly typed property definition.
   * @param {PropertyDeclarationWeak} def Weakly typed property definition
   */
  constructor(def: PropertyDeclarationWeak) {
    if (def === undefined || def === null) {
      this.value = def;
    } else if (typeof def === 'function') {
      this.type = def;
    } else if (def instanceof Binding) {
      this.value = def.value;
      this.type = (def.value !== undefined && def.value !== null) ? def.value.constructor : undefined;
      this.binding = def;
    } else if (def && def.constructor === Object) {
      const _def = def as PropertyDeclaration;
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
      this.type = def.constructor as Constructor;
    }
  }
  /**
   * Assigns values of another ProtoProperty to itself, unless they are default values.
   * @param {ProtoProperty} protoProp Source ProtoProperty
   */
  assign(protoProp: ProtoProperty) {
    if (protoProp.value !== undefined) this.value = protoProp.value;
    if (protoProp.type !== undefined) this.type = protoProp.type;
    if (protoProp.reflect !== 0) this.reflect = protoProp.reflect;
    if (protoProp.notify !== true) this.notify = protoProp.notify;
    if (protoProp.observe !== false) this.observe = protoProp.observe;
    if (protoProp.binding !== undefined) this.binding = protoProp.binding;
  }
}

/**
 * PropertyInstance object.
 * It is initialized from corresponding `ProtoProperty`.
 */
export class PropertyInstance {
  // Property value.
  value?: any = undefined;
  // Constructor of the property value.
  type?: Constructor;
  // Binding object.
  binding?: Binding;
  // Reflects to HTML attribute [-1, 0, 1 or 2]
  reflect: ReflectType = REFLECT_NONE;
  // Enables change handlers and events.
  notify = true;
  // Observe object mutations for this property.
  observe = false;
  /**
   * Creates the property configuration object and copies values from `ProtoProperty`.
   * @param {ProtoProperty} propDef ProtoProperty object
   */
  constructor(propDef: ProtoProperty) {
    debug: {
      Object.keys(propDef).forEach(key => {
        if (['value', 'type', 'reflect', 'notify', 'observe', 'binding'].indexOf(key) === -1) {
          console.warn(`ProtoProperty: Invalid field ${key}`);
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
    } else if (this.value === undefined) {
      if (this.type === Boolean) this.value = false;
      else if (this.type === String) this.value = '';
      else if (this.type === Number) this.value = 0;
      else if (typeof this.type === 'function') this.value = new this.type();
    }
    debug: {
      if (this.value === undefined && typeof this.type === 'function') {
        console.warn('Property value should always be initialized when type is defined!');
      }
    }
  }
}

export type PropertyDeclarations = Record<string, PropertyDeclarationWeak>;

export const PropertyDecorators: WeakMap<Constructor, PropertyDeclarations> = new WeakMap();

// TODO: Test decorator
export const IoProperty = function(propertyDefinition: PropertyDeclarationWeak) {
  return (target: IoNode, propertyName: string) => {
    const constructor = target.constructor as Constructor;
    const _Properties = PropertyDecorators.get(constructor) || {};
    PropertyDecorators.set(constructor, _Properties);
    _Properties[propertyName] = propertyDefinition;
  };
};