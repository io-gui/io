export class ProtoProperties {
  constructor(prototypes) {
    const propertyDefs = {};
    for (let i = prototypes.length; i--;) {
      let prop = prototypes[i].constructor.properties;
      for (let key in prop) {
        let propDef = new Property(prop[key], true);
        if (propertyDefs[key]) propertyDefs[key].assign(propDef);
        else propertyDefs[key] = propDef;
      }
    }
    for (let key in propertyDefs) {
      this[key] = new Property(propertyDefs[key]);
    }
  }
  cloneProperties() {
    let properties = {};
    for (let prop in this) {
      properties[prop] = this[prop].clone();
    }
    return properties;
  }
}

export class Property {
  constructor(propDef) {
    if (propDef === null || propDef === undefined) propDef = {};
    else if (propDef === Boolean) propDef = {type: Boolean};
    else if (propDef === Number) propDef = {type: Number};
    else if (propDef === String) propDef = {type: String};
    else if (propDef === Array) propDef = {type: Array};
    else if (propDef === Object) propDef = {type: Object};
    else if (propDef === HTMLElement) propDef = {type: HTMLElement};
    else if (typeof propDef !== 'object') {
      propDef = { value: propDef };
      if (typeof propDef.value === 'boolean') propDef.type = Boolean;
      else if (typeof propDef.value === 'number') propDef.type = Number;
      else if (typeof propDef.value === 'string') propDef.type = String;
      else if (propDef.value instanceof Array) propDef.type = Array;
      else if (typeof propDef.value === 'object') propDef.type = Object;
    }
    this.value = propDef.value;
    this.type = propDef.type;
    this.observer = propDef.observer;
    this.notify = propDef.notify || false;
    this.reflect = propDef.reflect;
    this.binding = propDef.binding;
    if (this.value === undefined) {
      if (this.type === Boolean) this.value = false;
      if (this.type === Number) this.value = 0;
      if (this.type === String) this.value = '';
      if (this.type === Array) this.value = [];
      if (this.type === Object) this.value = {};
    }
  }
  assign(propDef) {
    if (propDef.value !== undefined) this.value = propDef.value;
    if (propDef.type !== undefined) this.type = propDef.type;
    if (propDef.observer !== undefined) this.observer = propDef.observer;
    if (propDef.notify !== undefined) this.notify = propDef.notify;
    if (propDef.reflect !== undefined) this.reflect = propDef.reflect;
    if (propDef.binding !== undefined) this.binding = propDef.binding;
  }
  clone() {
    // TODO: rewise
    let prop = new Property(this);
    if (prop.value instanceof Array) {
      prop.value = [ ...prop.value ];
    } else if (prop.value instanceof Object) {
      prop.value = { ...prop.value };
    }
    return prop;
  }
}
