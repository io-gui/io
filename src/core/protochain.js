import {Property} from "./property.js";

export class Protochain {
  constructor(prototypes) {
    this.properties = {};
    this.methods = [];
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
      this.properties[key] = new Property(propertyDefs[key]);
    }
    for (let i = prototypes.length; i--;) {
      let names = Object.getOwnPropertyNames(prototypes[i]);
      for (let j = 0; j < names.length; j++) {
        this.methods.push(names[j]);
      }
    }
  }
  bindMethods(element) {
    for (let i = 0; i < this.methods.length; i++) {
      element[this.methods[i]] = element[this.methods[i]].bind(element);
    }
  }
  cloneProperties() {
    let properties = {};
    for (let prop in this.properties) {
      properties[prop] = this.properties[prop].clone();
    }
    return properties;
  }
}
