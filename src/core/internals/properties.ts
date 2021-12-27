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

export type PropertyDefinitionWeak = string | number | boolean | null | AnyConstructor | Binding | {
  value?: any;
  type?: AnyConstructor;
  reflect?: ReflectType;
  binding?: Binding;
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
    const detail = propDef as PropertyDefinition;
    debug: {
      Object.keys(detail).forEach(key => {
        if (['value', 'type', 'reflect', 'notify', 'observe', 'readonly', 'strict', 'enumerable', 'binding'].indexOf(key) === -1) {
          console.warn(`PropertyDefinition: Invalid field ${key}`);
        }
      });
      if (detail.type !== undefined && typeof detail.type !== 'function') console.warn('Incorrect type for "type" field');
      if (detail.binding !== undefined && detail.binding.constructor !== Binding) console.warn('Incorrect type for "binding" field');
      if (detail.reflect !== undefined && ([-1, 0, 1, 2]).indexOf(detail.reflect) === -1) {
        console.error(`Invalid reflect field ${detail.reflect}!`);
      }
      if (detail.notify !== undefined && typeof detail.notify !== 'boolean') console.warn('Incorrect type for "notify" field');
      if (detail.observe !== undefined && typeof detail.observe !== 'boolean') console.warn('Incorrect type for "observe" field');
      if (detail.readonly !== undefined && typeof detail.readonly !== 'boolean') console.warn('Incorrect type for "readonly" field');
      if (detail.strict !== undefined && typeof detail.strict !== 'boolean') console.warn('Incorrect type for "strict" field');
      if (detail.enumerable !== undefined && typeof detail.enumerable !== 'boolean') console.warn('Incorrect type for "enumerable" field');
    }
    detail.value = detail.value !== undefined ? detail.value : undefined;
    detail.type = detail.type !== undefined ? detail.type : (detail.value !== undefined && detail.value !== null) ? detail.value.constructor : undefined;
    detail.binding = detail.binding instanceof Binding ? detail.binding : undefined;
    detail.reflect = detail.reflect !== undefined ? detail.reflect : 0;
    detail.notify = detail.notify !== undefined ? detail.notify : true;
    detail.observe = detail.observe !== undefined ? detail.observe : false;
    detail.readonly = detail.readonly !== undefined ? detail.readonly : false;
    detail.strict = detail.strict !== undefined ? detail.strict : false;
    detail.enumerable = detail.enumerable !== undefined ? detail.enumerable : true;
    return detail;
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
  // Binding object.
  binding?: Binding = undefined;
  /**
   * Creates the property configuration object and copies values from `PropertyDefinition`.
   * @param {PropertyDefinition} propDef PropertyDefinition object
   */
  constructor(propDef: PropertyDefinition) {
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
  private readonly node: any;
  private readonly keys: Array<string> = [];
  private connected = false;
  /**
   * Creates the properties for specified `IoNode`.
   * @param {any} node Owner IoNode instance.
   */
  constructor(node: any) {
    Object.defineProperty(this, 'node', {enumerable: false, configurable: true, value: node});
    Object.defineProperty(this, 'connected', {enumerable: false});
    for (const prop in node.__protochain.properties) {
      this.keys.push(prop);
      const protoProp = node.__protochain.properties as Record<string, PropertyDefinition>;
      const property = new Property(protoProp[prop]);
      Object.defineProperty(this, prop, {
        value: property,
        enumerable: protoProp[prop].enumerable,
        configurable: true
      });
      const value = property.value;
      if (value !== undefined && value !== null) {
        // TODO: document special handling of object and node values
        if (typeof value === 'object') {
          node.queue(prop, value, undefined);
          if (value.__isIoNode && node.connected) value.connect(node);
        } else if (property.reflect !== undefined && property.reflect >= 1 && node.__isIoElement) {
          // TODO: figure out how to resolve bi-directionsl reflection when attributes are set in html (role, etc...)
          node.setAttribute(prop, value);
        }
      }
      const binding = property.binding;
      // TODO: unhack passing __properties from constructor;
      if (binding) binding.addTarget(node, prop, this);
    }
    Object.defineProperty(this, 'keys', {enumerable: false, configurable: true});
  }
  /**
   * Returns the property value.
   * @param {string} key property name to get value of.
   * @return {any} Peroperty value.
   */
  get(key: string): any {
    return ((this as any)[key] as Property).value;
  }
  /**
   * Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.
   * @param {string} key Property name to set value of.
   * @param {any} value Peroperty value.
   * @param {boolean} [skipDispatch] flag to skip event dispatch.
   */
  set(key: string, value: any, skipDispatch?: boolean) {

    const prop = (this as any)[key] as Property;
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


      if (value && value.__isIoNode && !value.__isIoElement) value.connect(node);
      if (oldValue && oldValue.__isIoNode && oldValue.connected && !oldValue.__isIoElement) oldValue.disconnect(node);

      if (prop.notify && oldValue !== value) {
        node.queue(key, value, oldValue);
        if (node.connected && !skipDispatch) {
          node.queueDispatch();
        }
      }

      if (prop.reflect !== undefined && prop.reflect >= 1 && node.__isIoElement) node.setAttribute(key, value);
    }

  }
  /**
   * Connects all property bindings and `IoNode` properties.
   */
  connect() {
    debug: {
      if (this.connected) console.error('Properties: already connected!');
    }
    for (let i = this.keys.length; i--;) {
      const p = this.keys[i];
      const property = (this as any)[p] as Property;
      if (property.binding) {
        property.binding.addTarget(this.node, p);
      }
      // TODO: investigate and test element property connections - possible clash with element's native `disconenctedCallback()`
      if (property.value && property.value.__isIoNode && !property.value.connected && !property.value.__isIoElement) {
        property.value.connect(this.node);
      }
    }
    this.connected = true;
  }
  /**
   * Disconnects all property bindings and `IoNode` properties.
   */
  disconnect() {
    debug: {
      // TODO: debug
      // if (!this.connected) console.error('Properties: already disconnected!');
    }
    for (let i = this.keys.length; i--;) {
      const p = this.keys[i];
      const property = (this as any)[p] as Property;
      if (property.binding) {
        property.binding.removeTarget(this.node, p);
      }
      // TODO: investigate and test element property connections
      // possible clash with element's native `disconenctedCallback()`
      // TODO: fix BUG - diconnecting already disconencted.
      if (property.value && property.value.__isIoNode && !property.value.__isIoElement) {
        // TODO: remove this workaround once the bug is fixed properly.
        if (property.value.__connections.indexOf(this.node) !== -1) {
          property.value.disconnect(this.node);
        }
      }
    }
    this.connected = false;
  }
  /**
   * Disconnects all property bindings and `IoNode` properties.
   * Use this when properties are no loner needed.
   */
  dispose() {
    this.disconnect();
    delete (this as any).node;
    delete (this as any).keys;
  }
}