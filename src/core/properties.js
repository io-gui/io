const propertyDefs = {};

export class Property {
  constructor(key, propDef) {
    this.key = key;
    this.value = propDef.value;
    this.type = propDef.type;
    this.observer = propDef.observer;
    this.notify = propDef.notify;
    this.bubbles = propDef.bubbles;
    this.reflect = propDef.reflect;
    this.binding = propDef.binding;
  }
}

export class Properties {
  constructor(protochain) {
    let s = Symbol.for(protochain[0].constructor);
    if (!propertyDefs[s]) {
      propertyDefs[s] = {};
      for (let i = protochain.length; i--;) {
        let prop = protochain[i].constructor.properties;
        for (let key in prop) {
          if (key !== 'listeners' && key !== 'attributes') {
            let propDef = prop[key];
            if (propDef === null) propDef = {};
            if (propDef === undefined) propDef = {};
            if (propDef.constructor !== Object) propDef = { value: propDef };
            if (propDef.value === undefined) {
              if (propDef.type === Boolean) propDef.value = false;
              if (propDef.type === Number) propDef.value = 0;
              if (propDef.type === String) propDef.value = '';
            }
            propDef.notify = propDef.notify || false;
            propDef.bubbles = propDef.bubbles || false;
            propertyDefs[s][key] = Object.assign(propDef, propertyDefs[s][key] || {});
          }
        }
      }
    }
    for (let key in propertyDefs[s]) {
      this[key] = new Property(key, propertyDefs[s][key]);
    }
  }
}
