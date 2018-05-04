const attributeDefs = {};

export class Attributes {
  constructor(protochain, element) {
    let s = Symbol.for(protochain[0].constructor);
    if (!attributeDefs[s]) {
      attributeDefs[s] = {};
      for (let i = protochain.length; i--;) {
        let prop = protochain[i].constructor.properties;
        if (prop && prop['attributes']) {
          for (let key in prop['attributes']) attributeDefs[s][key] = prop['attributes'][key];
        }
      }
    }
    for (let key in attributeDefs[s]) {
      this[key] = attributeDefs[s][key];
    }
    this.setElement(element);
  }
  setElement(element) {
    for (let att in this) {
      element.setAttribute(att, this[att]);
    }
  }
}
