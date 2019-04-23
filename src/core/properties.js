import {Binding} from "./bindings.js";

// TODO: TEST

/** Creates a map of all property configurations defined in the prototype chain. */
export class ProtoProperties {
  /**
   * @param protochain {Array} Array of protochain constructors.
   */
  constructor(protochain) {
    const propertyDefs = {};
    for (let i = protochain.length; i--;) {
      const props = protochain[i].constructor.properties;
      for (let key in props) {
        if (!propertyDefs[key]) propertyDefs[key] = new Property(props[key]);
        else propertyDefs[key].assign(new Property(props[key]));
      }
    }
    for (let key in propertyDefs) {
      this[key] = new Property(propertyDefs[key]);
    }
  }
}

/** Store for IoNode properties and their configurations. */
export class Properties {
  /**
   * Creates properties object for IoNode.
   * @param {IoNode} node - Reference to the node/element itself.
   * @param {ProtoProperties} protoProperties - List of property configurations defined in the protochain.
   */
  constructor(node, protoProperties) {
    Object.defineProperty(this, 'node', {value: node});
    for (let prop in protoProperties) {
      this[prop] = protoProperties[prop].clone();
      if (typeof this[prop].value === 'object') {
        const value = this[prop].value;
        if (value && value.isNode) value.connect(node);
        node.queue(prop, value, undefined);
      }
    }
  }
  /**
   * Gets specified property value.
   * @param {string} prop - Property name.
   */
  get(prop) {
    return this[prop].value;
  }
  // TODO: more tests and documentation.
  /**
   * Sets specified property value.
   * @param {string} prop - Property name.
   * @param {*} value Property value.
   */
  set(prop, value) {

    let oldBinding = this[prop].binding;
    let oldValue = this[prop].value;

    let binding = (value instanceof Binding) ? value : null;

    if (binding && oldBinding && binding !== oldBinding) {
      oldBinding.removeTarget(this.node, prop); // TODO: test extensively
    }
    if (binding) {
      binding.addTarget(this.node, prop);
      this[prop].binding = binding;
      this[prop].value = value.source[value.sourceProp];
      value = value.source[value.sourceProp];
    } else {
      this[prop].value = value;
    }

    if (value && value.isNode) {
      value.connect(this.node);
    }

    if (value !== oldValue && oldValue && oldValue.isNode) {
      oldValue.disconnect(this.node);
    }

    if (this[prop].reflect) this.node.setAttribute(prop, value);
  }
  // TODO: test dispose and disconnect for memory leaks!!
  // TODO: dispose bindings properly
  /**
   * Connects value bindings if defined.
   */
  connect() {
    for (let p in this) {
      if (this[p].binding) {
        this[p].binding.addTarget(this.node, p); //TODO: test
      }
    }
  }
  /**
   * Disonnects value bindings if defined.
   */
  disconnect() {
    for (let p in this) {
      if (this[p].binding) {
        this[p].binding.removeTarget(this.node, p);
      }
    }
  }
  /**
   * Disonnects bindings and removes all property configurations.
   * Use this when node is no longer needed.
   */
  dispose() {
    for (let p in this) {
      if (this[p].binding) {
        this[p].binding.removeTarget(this.node, p);
        delete this[p].binding;
      }
      delete this[p];
    }
  }
}

/**
 * Property configuration.
 */
class Property {
  /**
  * Creates a property configuration object with following properties:
  * @param {Object} config - Configuration object.
  * @param {*} config.value - Default value.
  * @param {function} config.type - Constructor of value.
  * @param {boolean} config.reflect - Reflects to HTML attribute
  * @param {Binding} config.binding - Binding object.
  * @param {boolean} config.enumerable - Makes property enumerable.
  */
  constructor(propDef) {
    if (propDef === null || propDef === undefined) {
      propDef = {value: propDef};
    } else if (typeof propDef === 'function') {
      propDef = {type: propDef};
    } else if (propDef instanceof Array) {
      propDef = {type: Array, value: [...propDef]};
    } else if (propDef instanceof Binding) {
      propDef = {binding: propDef, value: propDef.value};
    } else if (typeof propDef !== 'object') {
      propDef = {value: propDef, type: propDef.constructor};
    }
    this.assign(propDef);
  }
  /**
   * Helper function to assign new values as we walk up the inheritance chain.
   */
  assign(propDef) {
    if (propDef.value !== undefined) this.value = propDef.value;
    if (propDef.type !== undefined) this.type = propDef.type;
    if (propDef.reflect !== undefined) this.reflect = propDef.reflect;
    if (propDef.binding !== undefined) this.binding = propDef.binding;
    this.enumerable = propDef.enumerable !== undefined ? propDef.enumerable : true;
  }
  /**
   * Clones the property. If property value is objects it does one level deep object clone.
   */
  clone() {
    const prop = new Property(this);
    if (prop.type === undefined && prop.value !== undefined && prop.value !== null) {
      prop.type = prop.value.constructor;
    }
    if (prop.type === Array && prop.value) {
      prop.value = [...prop.value];
    }
    // Set default values.
    if (prop.value === undefined && prop.type) {
      if (prop.type === Boolean) prop.value = false;
      else if (prop.type === String) prop.value = '';
      else if (prop.type === Number) prop.value = 0;
      else if (prop.type === Array) prop.value = [];
      else if (prop.type === Object) prop.value = {};
      else if (prop.type !== HTMLElement && prop.type !== Function) {
        prop.value = new prop.type();
      }
    }
    return prop;
  }
}
