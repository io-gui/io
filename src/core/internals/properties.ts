import {Binding} from './propertyBinder.js';

type AnyConstructor = new (...args: any[]) => unknown;
type ReflectType = -1 | 0 | 1 | 2;

type PropertyDefinitionDetail = {
  value?: any;
  type?: AnyConstructor;
  reflect?: ReflectType;
  notify?: boolean;
  observe?: boolean;
  readonly?: boolean;
  strict?: boolean;
  enumerable?: boolean;
  binding?: Binding;
}

export type PropertyDefinition = string | number | boolean | AnyConstructor | null | Binding | PropertyDefinitionDetail;

const toPropertyDefinitionDetail = (propertyDefinition: PropertyDefinition): PropertyDefinitionDetail => {
  if (propertyDefinition === undefined || propertyDefinition === null) return {
      value: propertyDefinition
  };
  if (typeof propertyDefinition === 'function') return {
      type: propertyDefinition
  };
  if (propertyDefinition instanceof Binding) return {
    binding: propertyDefinition
  };
  if (propertyDefinition && propertyDefinition.constructor === Object) {
    const detail = propertyDefinition as PropertyDefinitionDetail;
    debug: {
      Object.keys(detail).forEach(key => {
        if (['value', 'type', 'reflect', 'notify', 'observe', 'readonly', 'strict', 'enumerable', 'binding'].indexOf(key) === -1) {
          console.warn(`PropertyDefinition: Invalid field ${key}`);
        }
      });
      if (detail.type !== undefined && typeof detail.type !== 'function') console.warn('PropertyDefinition: Incorrect type for "type" field');
      if (detail.reflect !== undefined && typeof detail.reflect !== 'number') console.warn('PropertyDefinition: Incorrect type for "reflect" field');
      if (detail.notify !== undefined && typeof detail.notify !== 'boolean') console.warn('PropertyDefinition: Incorrect type for "notify" field');
      if (detail.observe !== undefined && typeof detail.observe !== 'boolean') console.warn('PropertyDefinition: Incorrect type for "observe" field');
      if (detail.readonly !== undefined && typeof detail.readonly !== 'boolean') console.warn('PropertyDefinition: Incorrect type for "readonly" field');
      if (detail.strict !== undefined && typeof detail.strict !== 'boolean') console.warn('PropertyDefinition: Incorrect type for "strict" field');
      if (detail.enumerable !== undefined && typeof detail.enumerable !== 'boolean') console.warn('PropertyDefinition: Incorrect type for "enumerable" field');
      if (detail.binding !== undefined && detail.binding.constructor !== Binding) console.warn('PropertyDefinition: Incorrect type for "binding" field');
    }
    return {
      value: detail.value !== undefined ? detail.value : undefined,
      type: detail.type !== undefined ? detail.type : (detail.value !== undefined && detail.value !== null) ? detail.value.constructor : undefined,
      reflect: detail.reflect !== undefined ? detail.reflect : undefined,
      notify: detail.notify !== undefined ? detail.notify : undefined,
      observe: detail.observe !== undefined ? detail.observe : undefined,
      readonly: detail.readonly !== undefined ? detail.readonly : undefined,
      strict: detail.strict !== undefined ? detail.strict : undefined,
      enumerable: detail.enumerable !== undefined ? detail.enumerable : undefined,
      binding: detail.binding instanceof Binding ? detail.binding : undefined,
    };
  }
  if (!(propertyDefinition && propertyDefinition.constructor === Object)) return {
    value: propertyDefinition,
    type: propertyDefinition.constructor as AnyConstructor,
  };

  return {};
};

// TODO: deprecate. Use Properties.
export class ProtoProperty {
  value: any;
  type?: AnyConstructor;
  reflect: ReflectType = 0;
  notify = true;
  observe = false;
  readonly = false;
  strict = false;
  enumerable = true;
  binding?: Binding = undefined;
  constructor(propertyDefinition: PropertyDefinition = {}) {
    return this.assign(propertyDefinition);
  }
  assign(propertyDefinition: PropertyDefinition) {
    const propertyDefinitionDetail = toPropertyDefinitionDetail(propertyDefinition);
    if (propertyDefinitionDetail.value !== undefined) this.value = propertyDefinitionDetail.value;
    if (propertyDefinitionDetail.type !== undefined) this.type = propertyDefinitionDetail.type;
    if (propertyDefinitionDetail.reflect !== undefined) this.reflect = propertyDefinitionDetail.reflect;
    if (propertyDefinitionDetail.notify !== undefined) this.notify = propertyDefinitionDetail.notify;
    if (propertyDefinitionDetail.observe !== undefined) this.observe = propertyDefinitionDetail.observe;
    if (propertyDefinitionDetail.readonly !== undefined) this.readonly = propertyDefinitionDetail.readonly;
    if (propertyDefinitionDetail.strict !== undefined) this.strict = propertyDefinitionDetail.strict;
    if (propertyDefinitionDetail.enumerable !== undefined) this.enumerable = propertyDefinitionDetail.enumerable;
    if (propertyDefinitionDetail.binding !== undefined) this.binding = propertyDefinitionDetail.binding;

    debug: {
      if (this.type !== undefined && typeof this.type !== 'function') console.warn('ProtoProperty: Incorrect type for "type" field');
      if (typeof this.reflect !== 'number') console.warn('ProtoProperty: Incorrect type for "reflect" field');
      if (typeof this.notify !== 'boolean') console.warn('ProtoProperty: Incorrect type for "notify" field');
      if (typeof this.observe !== 'boolean') console.warn('ProtoProperty: Incorrect type for "observe" field');
      if (typeof this.readonly !== 'boolean') console.warn('ProtoProperty: Incorrect type for "readonly" field');
      if (typeof this.strict !== 'boolean') console.warn('ProtoProperty: Incorrect type for "strict" field');
      if (typeof this.enumerable !== 'boolean') console.warn('ProtoProperty: Incorrect type for "enumerable" field');
      if (this.binding !== undefined && this.binding.constructor !== Binding) console.warn('ProtoProperty: Incorrect type for "binding" field');
    }
    return this;
  }
}

/**
 * Property configuration object for a class **instance**.
 * It is copied from the corresponding `ProtoProperty`.
 */
export class Property {
  //Property value.
  value?: any;
  //Constructor of the property value.
  type?: AnyConstructor;
  //Reflects to HTML attribute [-1, 0, 1 or 2]
  reflect?: number;
  //Enables change handlers and events.
  notify?: boolean;
  //Observe object mutations for this property.
  observe?: boolean;
  //Makes the property readonly. // TODO: document and test
  readonly?: boolean;
  //Enforce stric typing. // TODO?: document and test
  strict?: boolean;
  //Makes property enumerable.
  enumerable?: boolean;
  //Binding object.
  binding?: Binding;
  /**
   * Creates the property configuration object and copies values from `ProtoProperty`.
   * @param {ProtoProperty} protoProp ProtoProperty object
   */
  constructor(protoProp: ProtoProperty) {
    this.value = protoProp.value;
    this.type = protoProp.type;
    this.reflect = protoProp.reflect;
    this.notify = protoProp.notify;
    this.observe = protoProp.observe;
    this.readonly = protoProp.readonly;
    this.strict = protoProp.strict;
    this.enumerable = protoProp.enumerable;
    this.binding = protoProp.binding;

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

    debug:
    if (([-1, 0, 1, 2] as any).indexOf(this.reflect) === -1) {
      console.error(`Invalid reflect value ${this.reflect}!`);
    }
  }
}

/**
 * Collection of all property configurations and values for a class **instance** compied from corresponding `ProtoProperties`.
 * It also takes care of attribute reflections, binding connections and queue dispatch scheduling.
 */
export class Properties {
  private readonly __node: any;
  private readonly __keys: Array<string> = [];
  private __connected = false;
  /**
   * Creates the properties for specified `IoNode`.
   * @param {any} node Owner IoNode instance.
   */
  constructor(node: any) {
    Object.defineProperty(this, '__node', {enumerable: false, configurable: true, value: node});
    Object.defineProperty(this, '__connected', {enumerable: false});
    for (const prop in node.__protochain.properties) {
      const protoProp = node.__protochain.properties as Record<string, ProtoProperty>;
      Object.defineProperty(this, prop, {
        value: new Property(protoProp[prop]),
        enumerable: protoProp[prop].enumerable,
        configurable: true
      });
      const property = (this as any)[prop] as Property;
      const value = property.value;
      if (value !== undefined && value !== null) {
        // TODO: document special handling of object and node values
        if (typeof value === 'object') {
          node.queue(prop, value, undefined);
          if (value.__isIoNode && node.__connected) value.connect(node);
        } else if (property.reflect !== undefined && property.reflect >= 1 && node.__isIoElement) {
          // TODO: figure out how to resolve bi-directionsl reflection when attributes are set in html (role, etc...)
          node.setAttribute(prop, value);
        }
      }
      const binding = property.binding;
      // TODO: unhack passing __properties from constructor;
      if (binding) binding.addTarget(node, prop, this);
    }
    Object.defineProperty(this, '__keys', {enumerable: false, configurable: true, value: Object.keys(this)});
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

      const node = this.__node;
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
            console.warn(`Wrong type of property "${key}". Value: "${value}". Expected type: ${prop.type.name}`, this.__node);
          }
        } else if (prop.type === Number) {
          if (typeof value !== 'number') {
            console.warn(`Wrong type of property "${key}". Value: "${value}". Expected type: ${prop.type.name}`, this.__node);
          }
        } else if (prop.type === Boolean) {
          if (typeof value !== 'boolean') {
            console.warn(`Wrong type of property "${key}". Value: "${value}". Expected type: ${prop.type.name}`, this.__node);
          }
        } else if (prop.type) {
          if (!(value instanceof prop.type)) {
            console.warn(`Wrong type of property "${key}". Value: "${value}". Expected type: ${prop.type.name}`, this.__node);
          }
        }
      }


      if (value && value.__isIoNode && !value.__isIoElement) value.connect(node);
      if (oldValue && oldValue.__isIoNode && oldValue.__connected && !oldValue.__isIoElement) oldValue.disconnect(node);

      if (prop.notify && oldValue !== value) {
        node.queue(key, value, oldValue);
        if (node.__connected && !skipDispatch) {
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
      if (this.__connected) console.error('Properties: already connected!');
    }
    for (let i = this.__keys.length; i--;) {
      const p = this.__keys[i];
      const property = (this as any)[p] as Property;
      if (property.binding) {
        property.binding.addTarget(this.__node, p);
      }
      // TODO: investigate and test element property connections - possible clash with element's native `disconenctedCallback()`
      if (property.value && property.value.__isIoNode && !property.value.__connected && !property.value.__isIoElement) {
        property.value.connect(this.__node);
      }
    }
    this.__connected = true;
  }
  /**
   * Disconnects all property bindings and `IoNode` properties.
   */
  disconnect() {
    debug: {
      // TODO: debug
      // if (!this.__connected) console.error('Properties: already disconnected!');
    }
    for (let i = this.__keys.length; i--;) {
      const p = this.__keys[i];
      const property = (this as any)[p] as Property;
      if (property.binding) {
        property.binding.removeTarget(this.__node, p);
      }
      // TODO: investigate and test element property connections
      // possible clash with element's native `disconenctedCallback()`
      // TODO: fix BUG - diconnecting already disconencted.
      if (property.value && property.value.__isIoNode && !property.value.__isIoElement) {
        // TODO: remove this workaround once the bug is fixed properly.
        if (property.value.__connections.indexOf(this.__node) !== -1) {
          property.value.disconnect(this.__node);
        }
      }
    }
    this.__connected = false;
  }
  /**
   * Disconnects all property bindings and `IoNode` properties.
   * Use this when properties are no loner needed.
   */
  dispose() {
    this.disconnect();
    delete (this as any).__node;
    delete (this as any).__keys;
  }
}