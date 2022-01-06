import {IoNode} from '../io-node.js';
import {Binding} from './propertyBinder.js';

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

export type PropertyDefinitionWeak = string | number | boolean | null | undefined | AnyConstructor | Binding | {
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

export const hardenPropertyDefinition = (propDef: PropertyDefinitionWeak): PropertyDefinition => {
  const def: PropertyDefinition = {
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
  if (propDef === undefined || propDef === null) {
    def.value = propDef;
    return def;
  }
  if (typeof propDef === 'function') {
    def.type = propDef;
    return def;
  }
  if (propDef instanceof Binding) {
    def.value = propDef.value;
    def.type = (propDef.value !== undefined && propDef.value !== null) ? propDef.value.constructor : undefined;
    def.binding = propDef;
    return def;
  }
  if (propDef && propDef.constructor === Object) {
    const def = propDef as PropertyDefinition;
    def.value = def.value !== undefined ? def.value : undefined;
    def.type = def.type !== undefined ? def.type : (def.value !== undefined && def.value !== null) ? def.value.constructor : undefined;
    def.binding = def.binding instanceof Binding ? def.binding : undefined;
    def.reflect = def.reflect !== undefined ? def.reflect : 0;
    def.notify = def.notify !== undefined ? def.notify : true;
    def.observe = def.observe !== undefined ? def.observe : false;
    def.readonly = def.readonly !== undefined ? def.readonly : false;
    def.strict = def.strict !== undefined ? def.strict : false;
    def.enumerable = def.enumerable !== undefined ? def.enumerable : true;
    return def;
  }
  if (!(propDef && propDef.constructor === Object)) {
    def.value = propDef;
    def.type = propDef.constructor as AnyConstructor;
    return def;
  }
  return def;
};

export const assignPropertyDefinition = (propDef: PropertyDefinition, newPropDef: PropertyDefinition) => {
  if (newPropDef.value !== undefined) propDef.value = newPropDef.value;
  if (newPropDef.type !== undefined) propDef.type = newPropDef.type;
  if (newPropDef.reflect !== 0) propDef.reflect = newPropDef.reflect;
  if (newPropDef.notify !== true) propDef.notify = newPropDef.notify;
  if (newPropDef.observe !== false) propDef.observe = newPropDef.observe;
  if (newPropDef.readonly !== false) propDef.readonly = newPropDef.readonly;
  if (newPropDef.strict !== false) propDef.strict = newPropDef.strict;
  if (newPropDef.enumerable !== true) propDef.enumerable = newPropDef.enumerable;
  if (newPropDef.binding !== undefined) propDef.binding = newPropDef.binding;
};

/**
 * Property configuration object for a class **instance**.
 * It is copied from the corresponding `PropertyDefinition`.
 */
export class Property {
  // Property value.
  value?: any = undefined;
  // Constructor of the property value.
  type?: AnyConstructor = undefined;
  // Binding object.
  binding?: Binding = undefined;
  // Reflects to HTML attribute [-1, 0, 1 or 2]
  reflect = 0;
  // Enables change handlers and events.
  notify = true;
  // Observe object mutations for this property.
  observe = false;
  // Makes the property readonly. // TODO: document and test
  readonly = false;
  // Enforce stric typing. // TODO: document and test
  strict = false;
  // Makes property enumerable.
  enumerable = true;
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

/**
 * Collection of all property configurations and values for a class **instance** compied from corresponding `ProtoProperties`.
 * It also takes care of attribute reflections, binding connections and queue dispatch scheduling.
 */
export class Properties {
  private readonly node: IoNode;
  private readonly props: Record<string, Property> = {};
  /**
   * Creates the properties for specified `IoNode`.
   * @param {IoNode} node Owner IoNode instance.
   */
  constructor(node: IoNode) {
    this.node = node;
    for (const prop in node.__protochain.properties) {
      const protoProp = node.__protochain.properties as Record<string, PropertyDefinition>;
      const property = new Property(protoProp[prop]);
      this.props[prop] = property;
      const value = property.value;
      if (value !== undefined && value !== null) {
        // TODO: document special handling of object and node values
        if (typeof value === 'object') {
          node.queue(prop, value, undefined);
        } else if (property.reflect !== undefined && property.reflect >= 1 && node.__isIoElement) {
          // TODO: figure out how to resolve bi-directionsl reflection when attributes are set in html (role, etc...)
          node.setAttribute(prop, value);
        }
      }
      const binding = property.binding;
      // TODO: unhack passing __properties from constructor;
      if (binding) binding.addTarget(node, prop, this);
    }
  }
  get keys() {
    return Object.keys(this.props);
  }
  /**
   * Returns the property object.
   * @param {string} key property name to get object of.
   * @return {Property} Peroperty object.
   */
  getProperty(key: string): Property {
    return this.props[key];
  }
  /**
   * Returns the owner node.
   * @return {Property} Owner node.
   */
  getNode(): IoNode {
    return this.node;
  }
  /**
   * Returns the property value.
   * @param {string} key property name to get value of.
   * @return {any} Peroperty value.
   */
  getValue(key: string): any {
    return this.props[key].value;
  }
  /**
   * Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.
   * @param {string} key Property name to set value of.
   * @param {any} value Peroperty value.
   * @param {boolean} [skipDispatch] flag to skip event dispatch.
   */
  setValue(key: string, value: any, skipDispatch?: boolean) {
    const prop = this.props[key];
    const oldValue = prop.value;
    if (value !== oldValue) {
      const node = this.node;
      const binding = (value instanceof Binding) ? value : undefined;
      if (binding) {
        const oldBinding = prop.binding;
        if (oldBinding && binding !== oldBinding) {
          oldBinding.removeTarget(node, key);
        }
        binding.addTarget(node, key);
        value = binding.value;
      } else {
        if (prop.strict && prop.type && !(value instanceof prop.type)) {
          debug: {
            console.warn(`IoGUI strict type mismatch for "${key}" property! Value automatically converted to "${prop.type.name}."`);
          }
          value = new prop.type(value);
        }
      }
      prop.value = value;

      debug:
      {
        if (prop.type === String) {
          if (typeof value !== 'string') {
            console.warn(`Wrong type of property "${key}". Value: "${value}". Expected type: ${prop.type.name}`, this.node);
          }
        } else if (prop.type === Number) {
          if (typeof value !== 'number') {
            console.warn(`Wrong type of property "${key}". Value: "${value}". Expected type: ${prop.type.name}`, this.node);
          }
        } else if (prop.type === Boolean) {
          if (typeof value !== 'boolean') {
            console.warn(`Wrong type of property "${key}". Value: "${value}". Expected type: ${prop.type.name}`, this.node);
          }
        } else if (prop.type) {
          if (!(value instanceof prop.type)) {
            console.warn(`Wrong type of property "${key}". Value: "${value}". Expected type: ${prop.type.name}`, this.node);
          }
        }
      }

      if (prop.notify && oldValue !== value) {
        node.queue(key, value, oldValue);
        if (!skipDispatch) {
          node.queueDispatch();
        }
      }

      if (prop.reflect !== undefined && prop.reflect >= 1 && node.__isIoElement) node.setAttribute(key, value);
    }
  }
  /**
   * Returns the property binding.
   * @param {string} key property name to get binding of.
   * @return {any} Peroperty binding.
   */
  getBinding(key: string) {
    return this.props[key].binding;
  }
  /**
   * Sets the property binding.
   * @param {string} key property name to get binding of.
   * @param {Binding} binding property binding.
   */
  setBinding(key: string, binding: Binding) {
    this.props[key].binding = binding;
  }
  /**
   * Disconnects all property bindings and `IoNode` properties.
   * Use this when properties are no loner needed.
   */
  dispose() {
    const keys = Object.keys(this.props);
    for (let i = keys.length; i--;) {
      const p = keys[i];
      const property = (this as any)[p] as Property;
      if (property.binding) {
        property.binding.removeTarget(this.node, p);
      }
    }
    delete (this as any).node;
    delete (this as any).props;
  }
}