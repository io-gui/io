// Creates a properties object with configurations inherited from prototype chain.

const illegalPropNames = ['style', 'className', 'listeners'];

export class ProtoProperties {
  constructor(prototypes) {
    const propertyDefs = {};
    for (let i = prototypes.length; i--;) {
      let prop = prototypes[i].constructor.properties;
      for (let key in prop) {
        if (illegalPropNames.indexOf(key) !== -1) {
          console.warn('Illegal property name:', key);
        }
        let propDef = new Property(prop[key], true);
        if (propertyDefs[key]) propertyDefs[key].assign(propDef);
        else propertyDefs[key] = propDef;
      }
    }
    for (let key in propertyDefs) {
      this[key] = new Property(propertyDefs[key]);
    }
  }
  // Instances should use this function to create unique clone of properties.
  clone() {
    let properties = new ProtoProperties([]);
    for (let prop in this) {
      properties[prop] = this[prop].clone();
    }
    return properties;
  }
}

export function defineProperties(prototype) {
  for (let prop in prototype.__props) {
    Object.defineProperty(prototype, prop, {
      get: function() {
        return this.__props[prop].value;
      },
      set: function(value) {
        if (this.__props[prop].value === value) return;
        let oldValue = this.__props[prop].value;
        this.__props[prop].value = value;
        if (this.__props[prop].reflect) {
          this.setAttribute(prop, this.__props[prop].value);
        }
        if (this.__props[prop].observer) {
          this[this.__props[prop].observer](value, oldValue);
        }
        this.dispatchEvent(prop + '-changed', {value: value, oldValue: oldValue});
        this.update();
      },
      enumerable: true,
      configurable: true
    });
  }
}

/*
Creates a property object from properties defined in the prototype chain.
{
  value: <property value>
  type: <constructor of the value>
  observer: <neme of the vunction to be called when value changes>
  reflect: <reflection to HTML element attribute>
  binding: <binding object if bound>
  config: <optional configutation for GUI>
}
 */
export class Property {
  constructor(propDef) {
    if (propDef === null || propDef === undefined) {
      propDef = {};
    } else if (typeof propDef === 'function') {
      // Shorthand property definition by constructor.
      propDef = {type: propDef};
    } else if (typeof propDef !== 'object') {
      // Shorthand property definition by value
      propDef = {value: propDef, type: propDef.constructor};
    }
    // Set default value if type is defined but value is not.
    if (propDef.value === undefined && propDef.type) {
      if (propDef.type === Boolean) propDef.value = false;
      else if (propDef.type === String) propDef.value = '';
      else if (propDef.type === Number) propDef.value = 0;
      else if (propDef.type === Array) propDef.value = [];
      else if (propDef.type === Object) propDef.value = {};
      else if (propDef.type !== HTMLElement && propDef.type !== Function) propDef.value = new propDef.type();
    }
    this.value = propDef.value;
    this.type = propDef.type;
    this.observer = propDef.observer;
    this.reflect = propDef.reflect;
    this.binding = propDef.binding;
    this.config = propDef.config;
  }
  // Helper function to assign new values as we walk up the inheritance chain.
  assign(propDef) {
    if (propDef.value !== undefined) this.value = propDef.value;
    if (propDef.type !== undefined) this.type = propDef.type;
    if (propDef.observer !== undefined) this.observer = propDef.observer;
    if (propDef.reflect !== undefined) this.reflect = propDef.reflect;
    if (propDef.binding !== undefined) this.binding = propDef.binding;
    if (propDef.config !== undefined) this.config = propDef.config;
  }
  // Clones the property. If property value is objects it does one level deep object clone.
  clone() {
    let prop = new Property(this);
    if (prop.value instanceof Array) {
      prop.value = [ ...prop.value ];
    } else if (prop.value instanceof Object) {
      let value = prop.value;
      if (typeof value.clone === 'function') {
        prop.value = value.clone();
      } else {
        prop.value = prop.type ? new prop.type() : {};
        for (let p in value) prop.value[p] = value[p];
      }
    }
    return prop;
  }
}
