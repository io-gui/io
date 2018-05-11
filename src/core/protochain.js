const _stagingElement = document.createElement('div');

import {Property} from "./property.js";

export class Protochain {
  constructor(_constructor) {

    const prototypes = [];

    this.properties = {};
    this.listeners = {};
    this.attributes = {};
    this.handlers = [];
    this.style = [];

    let proto = _constructor.prototype;
    while (proto && proto.constructor !== Element) {
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
          // let propDef = prop[key];
          // if (propDef === null || propDef === undefined) propDef = {};
          // if (propDef.constructor !== Object) propDef = { value: propDef };
          // propertyDefs[key] = Object.assign(propDef, propertyDefs[key] || {});
        }
      }
    }
    for (let key in propertyDefs) {
      this.properties[key] = new Property(propertyDefs[key]);
    }

    for (let i = prototypes.length; i--;) {
      let names = Object.getOwnPropertyNames(prototypes[i]);
      for (let j = 0; j < names.length; j++) {
        if (names[j].substring(names[j].length-7, names[j].length) === 'Handler') {
          this.handlers.push(names[j]);
        }
      }
    }

    let localName = prototypes[0].constructor.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    for (let i = prototypes.length; i--;) {
      let style = prototypes[i].constructor.style;
      if (style) {
        if (i < prototypes.length - 1 && style == prototypes[i + 1].constructor.style) continue;
        style = style.replace(new RegExp(':host', 'g'), localName);
        this.style.push(style);
        _stagingElement.innerHTML = style;
        let element = _stagingElement.querySelector('style');
        element.setAttribute('id', 'io-style-' + localName + '-' + i);
        document.head.appendChild(element);
      }
    }
  }
  bindHandlers(element) {
    for (let i = 0; i < this.handlers.length; i++) {
      element[this.handlers[i]] = element[this.handlers[i]].bind(element);
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
