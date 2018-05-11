export class Property {
  constructor(propDef) {
    if (propDef === null || propDef === undefined) propDef = {};
    if (propDef === Boolean) propDef = {type: Boolean};
    if (propDef === Number) propDef = {type: Number};
    if (propDef === String) propDef = {type: String};
    if (propDef === Array) propDef = {type: Array};
    if (propDef === Object) propDef = {type: Object};
    if (typeof propDef !== 'object') propDef = { value: propDef };
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
