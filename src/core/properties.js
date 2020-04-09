import {Binding} from './binding.js';

/**
 * Property configuration object for class **prototypes**.
 * It is generated from property definitions in `static get Properties()` return object.
 * @property {*} value - Default value.
 * @property {function} type - Constructor of value.
 * @property {number} reflect - Reflects to HTML attribute
 * @property {boolean} notify - Trigger change handlers and change events.
 * @property {boolean} observe - Observe object mutations for this property.
 * @property {boolean} enumerable - Makes property enumerable.
 * @property {Binding} binding - Binding object.
 */
class ProtoProperty {
  /**
   * Creates the property configuration object and sets default values.
   * @param {ProtoProperty} prop - Configuration object.
   * @param {boolean} noDefaults - Assign default values.
   */
  constructor(prop, noDefaults) {

    if (!noDefaults) {
      this.value = undefined;
      this.type = undefined;
      this.notify = true;
      this.reflect = 0;
      this.observe = false;
      this.enumerable = true;
      this.binding = undefined;
    }

    if (prop === null) {

      this.value = null;

    } else if (typeof prop === 'function') {

      this.type = prop;

      if (!noDefaults) {
        if (this.type === Boolean) this.value = false;
        else if (this.type === String) this.value = '';
        else if (this.type === Number) this.value = 0;
        else if (this.type === Object) this.value = {};
        else if (this.type === Array) this.value = [];
      }

    } else if (typeof prop === 'number' || typeof prop === 'string' || typeof prop === 'boolean') {

      this.value = prop;
      this.type = prop.constructor;

    } else if (typeof prop === 'object') {

      if (prop instanceof Array) {

        this.value = [...prop];
        this.type = Array;
        
      } else if (prop instanceof Binding) {
        
        this.value = prop.value;
        this.binding = prop;

      } else {

        if (typeof prop.type !== 'function' && prop.value && prop.value.constructor) {
          prop.type = prop.value.constructor;
        }

        if (prop && prop.value !== undefined) {
          if (prop.value instanceof Array) {
            this.value = [...prop.value];
          } else if (prop.value && typeof prop.value === 'object') {
            this.value = new prop.value.constructor();
          } else {
            this.value = prop.value;
          }
        }

        if (typeof prop.type === 'function') {
          this.type = prop.type;
          if (this.value === undefined) {
            if (prop.type === Boolean) this.value = false;
            else if (prop.type === String) this.value = '';
            else if (prop.type === Number) this.value = 0;
            else if (prop.type === Object) this.value = {};
            else if (prop.type === Array) this.value = [];
            else if (prop.type !== HTMLElement && prop.type !== Function) {
              this.value = new prop.type();
            }
          }
        }

      }
      
    }

    prop = prop || {};

    if (typeof prop.notify == 'boolean') this.notify = prop.notify;
    if (typeof prop.reflect == 'number') this.reflect = prop.reflect;
    if (typeof prop.observe == 'boolean') this.observe = prop.observe;
    if (typeof prop.enumerable == 'boolean') this.enumerable = prop.enumerable;
    if (prop.binding instanceof Binding) {
      this.binding = prop.binding;
      this.value = prop.binding.value;
    }

    return this;
  }
}

/**
 * Collection of all property configurations for class **prototypes**.
 * Property configurations are inferred from all property definitions in the prototype chain.
 */
class ProtoProperties {
  /**
   * Creates all property configurations for specified prototype chain.
   * @param {ProtoChain} protochain - Configuration object.
   */
  constructor(protochain) {
    for (let i = protochain.length; i--;) {
      const props = protochain[i].constructor.Properties;
      for (let p in props) {
        if (!this[p]) this[p] = new ProtoProperty(props[p]);
        else Object.assign(this[p], new ProtoProperty(props[p], true));
        if (p.charAt(0) === '_') {
          this[p].notify = false;
          this[p].enumerable = false;
        }
      }
    }
  }
}

/**
 * Property configuration object for class **instances**.
 * It is copied from the corresponding `ProtoProperty`.
 * @property {*} value - Default value.
 * @property {function} type - Constructor of value.
 * @property {number} reflect - Reflects to HTML attribute
 * @property {boolean} notify - Trigger change handlers and change events.
 * @property {boolean} observe - Observe object mutations for this property.
 * @property {boolean} enumerable - Makes property enumerable.
 * @property {Binding} binding - Binding object.
 */
class Property {
  /**
   * Created the property configuration object and copies values from `ProtoProperty`.
   * @param {ProtoProperty} protoProp - Configuration object.
   */
  constructor(protoProp) {
    this.value = protoProp.value;
    this.notify = protoProp.notify;
    this.reflect = protoProp.reflect;
    this.observe = protoProp.observe;
    this.enumerable = protoProp.enumerable;
    this.type = protoProp.type;
    this.binding = protoProp.binding;
    if (this.type === Array && this.value instanceof Array) {
      this.value = [...this.value];
    }
    if (this.type === Object && this.value) {
      this.value = {};
    }
    if (this.value === undefined && this.type) {
      if (this.type === Boolean) this.value = false;
      else if (this.type === String) this.value = '';
      else if (this.type === Number) this.value = 0;
      else if (this.type === Array) this.value = [];
      else if (this.type === Object) this.value = {};
    }
    if (this.value === undefined && this.type) {
      if (this.type !== HTMLElement && this.type !== Function) {
        this.value = new this.type();
      }
    }
  }
}

/**
 * Collection of all property configurations for class **instances** compied from corresponding `ProtoProperties`.
 * 
 * It also stores current property values and creates the interface between `IoNode` and itself.
 */
class Properties {
  /**
   * @param {IoNode} node - Owner instance of `IoNode`.
   * @param {ProtoProperties} protoProps - Configuration object.
   */
  constructor(node, protoProps) {
    Object.defineProperty(this, '__node', {value: node, configurable: true});
    for (let prop in protoProps) {
      Object.defineProperty(this, prop, {
        value: new Property(protoProps[prop]),
        enumerable: protoProps[prop].enumerable,
        configurable: true
      });
      const value = this[prop].value;
      if (value !== undefined && value !== null) {
        // TODO: document special handling of object and node values
        if (typeof value === 'object') {
          node.queue(prop, value, undefined);
          if (value.__isIoNode && node.__isConnected) value.connect(node);
        } else if (this[prop].reflect >= 1 && node.__isIoElement) {
          node.setAttribute(prop, value);
        }
      }
      const binding = this[prop].binding;
      if (binding) binding.addTarget(node, prop);
    }
    Object.defineProperty(this, '__keys', {value: Object.getOwnPropertyNames(this), configurable: true});
  }
  get(key) {
    return this[key].value;
  }
  set(key, value, suspendDispatch) {

    const prop = this[key];
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
        prop.binding = binding;
        prop.value = value.source[value.sourceProp];
        value = value.source[value.sourceProp];

      } else {

        prop.value = value;

      }

      if (value && value.__isIoNode) value.connect(node);
      if (oldValue && oldValue.__isIoNode) oldValue.disconnect(node);

      if (prop.notify && oldValue !== value) {
        node.queue(key, value, oldValue);
        if (node.__isConnected && !suspendDispatch) {
          node.queueDispatch();
        }
      }

      if (prop.reflect >= 1 && node.__isIoElement) node.setAttribute(key, value);
    }

  }
  connect() {
    for (let i = this.__keys.length; i--;) {
      const p = this.__keys[i];
      if (this[p].binding) {
        this[p].binding.addTarget(this.__node, p);
      }
      if (this[p].value && this[p].value.__isIoNode) {
        this[p].value.connect(this.__node);
      }
    }
  }
  disconnect() {
    for (let i = this.__keys.length; i--;) {
      const p = this.__keys[i];
      if (this[p].binding) {
        this[p].binding.removeTarget(this.__node, p);
      }
      if (this[p].value && this[p].value.__isIoNode) {
        this[p].value.disconnect(this.__node);
      }
    }
  }
  dispose() {
    for (let i = this.__keys.length; i--;) {
      const p = this.__keys[i];
      if (this[p].binding) {
        this[p].binding.removeTarget(this.__node, p);
        delete this[p].binding;
      }
      delete this[p];
    }
    delete this['__node'];
    delete this['__keys'];
  }
}

export {ProtoProperty, ProtoProperties, Property, Properties};