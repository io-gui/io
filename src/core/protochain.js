import {Property} from "./property.js";

export class Protochain {
  constructor(_constructor) {

    const prototypes = [];

    this.properties = {};
    this.listeners = {};
    this.attributes = {};
    this.methods = [];
    this.style = [];

    let proto = _constructor.prototype;
    while (proto && proto.constructor !== HTMLElement) {
      prototypes.push(proto);
      proto = proto.__proto__;
    }

    const propertyDefs = {};
    for (let i = prototypes.length; i--;) {
      let prop = prototypes[i].constructor.properties;
      for (let key in prop) {
        if (key === 'listeners') {
          for (let l in prop[key]) {
            this.listeners[l] = prop[key][l];
          }
        } else if (key === 'attributes') {
          for (let a in prop[key]) {
            this.attributes[a] = prop[key][a];
          }
        } else {
          let propDef = new Property(prop[key], true);
          if (propertyDefs[key]) propertyDefs[key].assign(propDef);
          else propertyDefs[key] = propDef;
        }
      }
    }
    for (let key in propertyDefs) {
      this.properties[key] = new Property(propertyDefs[key]);
    }

    let localName = prototypes[0].constructor.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    for (let i = prototypes.length; i--;) {
      let names = Object.getOwnPropertyNames(prototypes[i]);
      for (let j = 0; j < names.length; j++) {
        this.methods.push(names[j]);
      }
      let style = prototypes[i].constructor.style;
      if (style) {
        if (i < prototypes.length - 1 && style == prototypes[i + 1].constructor.style) continue;
        style = style.replace(new RegExp(':host', 'g'), localName);
        this.style.push(style);
        let element = document.createElement('style');
        element.innerHTML = style;
        element.setAttribute('id', 'io-style-' + localName + '-' + i);
        document.head.appendChild(element);
      }
    }
  }
  bindMethods(element) {
    for (let i = 0; i < this.methods.length; i++) {
      element[this.methods[i]] = element[this.methods[i]].bind(element);
    }
  }
  connect(element) {
    for (let i in this.listeners) {
      element.addEventListener(i, element[this.listeners[i]]);
    }
  }
  disconnect(element) {
    for (let i in this.listeners) {
      element.removeEventListener(i, element[this.listeners[i]]);
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
