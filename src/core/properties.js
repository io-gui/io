import {Binding} from "./bindings.js";

// TODO: Documentation and tests

// Creates composed properties from all properties found in protochain.
export class Properties {
  constructor(protochain = [], instance) {
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
    Object.defineProperty(this, 'instance', {value: instance});
  }
  // Creates a clone of properties for an instance.
  clone(instance) {
    const properties = new Properties([], instance);
    for (let prop in this) {
      properties[prop] = this[prop].clone();
      if (typeof properties[prop].value === 'object') {
        instance.queue(prop, properties[prop].value, undefined);
      }
    }
    return properties;
  }
  get(prop) {
    return this[prop].value;
  }
  set(prop, value) {

    let oldBinding = this[prop].binding;
    let oldValue = this[prop].value;

    let binding = (value instanceof Binding) ? value : null;

    if (binding && oldBinding && binding !== oldBinding) {
      oldBinding.removeTarget(this.instance, prop); // TODO: test extensively
    }
    if (binding) {
      binding.setTarget(this.instance, prop);
      this[prop].binding = binding;
      this[prop].value = value.source[value.sourceProp];
    } else {
      this[prop].value = value;
    }

    if (value !== oldValue && this[prop].reflect) this.instance.setAttribute(prop, value);
  }
  // TODO: test dispose and disconnect for memory leaks!!
  // TODO: dispose bindings properly
  connect() {
    for (let p in this) {
      if (this[p].binding) {
        this[p].binding.setTarget(this.instance, p); //TODO: test
      }
    }
  }
  disconnect() {
    for (let p in this) {
      if (this[p].binding) {
        this[p].binding.removeTarget(this.instance, p);
      }
    }
  }
  dispose() {
    for (let p in this) {
      if (this[p].binding) {
        this[p].binding.removeTarget(this.instance, p);
        delete this[p].binding;
      }
      delete this[p];
    }
  }
}

/*
 Creates a property configuration object with following properties:
 {
   value: default value.
   type: constructor of value.
   reflect: reflects to HTML attribute
   binding: binding object.
   enumerable: makes property enumerable.
 }
 */

class Property {
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
  // Helper function to assign new values as we walk up the inheritance chain.
  assign(propDef) {
    if (propDef.value !== undefined) this.value = propDef.value;
    if (propDef.type !== undefined) this.type = propDef.type;
    if (propDef.reflect !== undefined) this.reflect = propDef.reflect;
    if (propDef.binding !== undefined) this.binding = propDef.binding;
    this.enumerable = propDef.enumerable !== undefined ? propDef.enumerable : true;
  }
  // Clones the property. If property value is objects it does one level deep object clone.
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
