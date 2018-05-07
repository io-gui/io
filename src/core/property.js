export class Property {
  constructor(propDef) {
    this.value = propDef.value;
    this.type = propDef.type;
    this.observer = propDef.observer;
    this.notify = propDef.notify || false;
    this.bubbles = propDef.bubbles  || false;
    this.reflect = propDef.reflect;
    this.binding = propDef.binding;
    if (this.value === undefined) {
      if (this.type === Boolean) this.value = false;
      if (this.type === Number) this.value = 0;
      if (this.type === String) this.value = '';
    }

  }
  clone() {
    return new Property(this);
  }
}
