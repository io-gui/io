import {Binding} from './binding.js';

type AnyConstructor = new (...args: any[]) => unknown;
type ReflectType = -1 | 0 | 1 | 2;

export type PropertyDefinition = {
  value?: any;
  type?: AnyConstructor;
  binding?: Binding;
  reflect: ReflectType;
  notify: boolean;
  observe: boolean;
  readonly: boolean;
  strict: boolean;
  enumerable: boolean;
};

export type PropertyDefinitionWeak = string | number | boolean | Array<any> | null | undefined | AnyConstructor | Binding | {
  value?: any;
  type?: AnyConstructor;
  binding?: Binding;
  reflect?: ReflectType;
  notify?: boolean;
  observe?: boolean;
  readonly?: boolean;
  strict?: boolean;
  enumerable?: boolean;
};

/**
 * Takes weakly typed property definition and returns stronly typed property definition.
 * @param {PropertyDefinitionWeak} def Weakly typed property definition
 * @return {PropertyDefinition} Stronly typed property definition
 */
export const hardenPropertyDefinition = (def: PropertyDefinitionWeak): PropertyDefinition => {
  const hardDef: PropertyDefinition = {
    value: undefined,
    type: undefined,
    binding: undefined,
    reflect: 0,
    notify: true,
    observe: false,
    readonly: false,
    strict: false,
    enumerable: true
  };
  if (def === undefined || def === null) {
    hardDef.value = def;
    return hardDef;
  }
  if (typeof def === 'function') {
    hardDef.type = def;
    return hardDef;
  }
  if (def instanceof Binding) {
    hardDef.value = def.value;
    hardDef.type = (def.value !== undefined && def.value !== null) ? def.value.constructor : undefined;
    hardDef.binding = def;
    return hardDef;
  }
  if (def && def.constructor === Object) {
    const hardDef = def as PropertyDefinition;
    hardDef.value = hardDef.value !== undefined ? hardDef.value : undefined;
    hardDef.type = hardDef.type !== undefined ? hardDef.type : (hardDef.value !== undefined && hardDef.value !== null) ? hardDef.value.constructor : undefined;
    hardDef.binding = hardDef.binding instanceof Binding ? hardDef.binding : undefined;
    hardDef.reflect = hardDef.reflect !== undefined ? hardDef.reflect : 0;
    hardDef.notify = hardDef.notify !== undefined ? hardDef.notify : true;
    hardDef.observe = hardDef.observe !== undefined ? hardDef.observe : false;
    hardDef.readonly = hardDef.readonly !== undefined ? hardDef.readonly : false;
    hardDef.strict = hardDef.strict !== undefined ? hardDef.strict : false;
    hardDef.enumerable = hardDef.enumerable !== undefined ? hardDef.enumerable : true;
    return hardDef;
  }
  if (!(def && def.constructor === Object)) {
    hardDef.value = def;
    hardDef.type = def.constructor as AnyConstructor;
    return hardDef;
  }
  return hardDef;
};

/**
 * Assigns property definition to an existing property definition.
 * @param {PropertyDefinition} def Property definition
 * @param {PropertyDefinition} newDef Existing property definition
 */
export const assignPropertyDefinition = (def: PropertyDefinition, newDef: PropertyDefinition) => {
  if (newDef.value !== undefined) def.value = newDef.value;
  if (newDef.type !== undefined) def.type = newDef.type;
  if (newDef.reflect !== 0) def.reflect = newDef.reflect;
  if (newDef.notify !== true) def.notify = newDef.notify;
  if (newDef.observe !== false) def.observe = newDef.observe;
  if (newDef.readonly !== false) def.readonly = newDef.readonly;
  if (newDef.strict !== false) def.strict = newDef.strict;
  if (newDef.enumerable !== true) def.enumerable = newDef.enumerable;
  if (newDef.binding !== undefined) def.binding = newDef.binding;
};

/**
 * Property configuration object for a class **instance**.
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
  // Makes the property readonly. // TODO: document and test
  public readonly = false;
  // Enforce stric typing. // TODO: document and test
  public strict = false;
  // Makes property enumerable.
  public enumerable = true;
  /**
   * Creates the property configuration object and copies values from `PropertyDefinition`.
   * @param {PropertyDefinition} propDef PropertyDefinition object
   */
  constructor(propDef: PropertyDefinition) {
    debug: {
      Object.keys(propDef).forEach(key => {
        if (['value', 'type', 'reflect', 'notify', 'observe', 'readonly', 'strict', 'enumerable', 'binding'].indexOf(key) === -1) {
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
      if (propDef.readonly !== undefined && typeof propDef.readonly !== 'boolean') console.warn('Incorrect type for "readonly" field');
      if (propDef.strict !== undefined && typeof propDef.strict !== 'boolean') console.warn('Incorrect type for "strict" field');
      if (propDef.enumerable !== undefined && typeof propDef.enumerable !== 'boolean') console.warn('Incorrect type for "enumerable" field');
    }

    this.value = propDef.value;
    this.type = propDef.type;
    this.binding = propDef.binding;
    this.reflect = propDef.reflect;
    this.notify = propDef.notify;
    this.observe = propDef.observe;
    this.readonly = propDef.readonly;
    this.strict = propDef.strict;
    this.enumerable = propDef.enumerable;

    // TODO: test
    if (this.binding instanceof Binding) this.value = this.binding.value;
    else if (this.value === undefined) {
      if (typeof this.type === 'function') {
        if (this.type === Boolean) this.value = false;
        else if (this.type === String) this.value = '';
        else if (this.type === Number) this.value = 0;
        else if (this.type === Array) this.value = [];
        else if (this.type === Object) this.value = {};
        else this.value = new this.type();
      }
    } else {
      if (this.type === Array && this.value instanceof Array) {
        this.value = [...this.value];
      } else if (this.type === Object && this.value instanceof Object) {
        this.value = Object.assign({}, this.value);
      }
    }
  }
}