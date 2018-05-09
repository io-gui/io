export class Property {
  constructor(propDef) {
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
  clone() {
    let prop = new Property(this);
    if (prop.value instanceof Array) {
      prop.value = [ ...prop.value ];
    } else if (prop.value instanceof Object) {
      prop.value = { ...prop.value };
    }
    return prop;
  }
}
