const listenerDefs = {};

export class Listeners {
  constructor(protochain) {
    let s = Symbol.for(protochain[0].constructor);
    if (!listenerDefs[s]) {
      listenerDefs[s] = {};
      for (let i = 0; i < protochain.length; i++) {
        let prop = protochain[i].constructor.properties;
        if (prop && prop['listeners']) {
          for (let key in prop['listeners']) {
            listenerDefs[s][key] = prop['listeners'][key];
          }
        }
      }
    }
    for (let key in listenerDefs[s]) {
      this[key] = listenerDefs[s][key];
    }
  }
  connect(element) {
    for (let e in this) {
      if (typeof this[e] === 'string');
      this[e] = element[this[e]];
      element.addEventListener(e, this[e]);
    }
  }
  disconnect(element) {
    for (let e in this) {
      element.removeEventListener(e, this[e]);
    }
  }
}
