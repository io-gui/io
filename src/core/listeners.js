const listenerDefs = {};

export class Listeners {
  constructor(protochain, element) {
    Object.defineProperty(this, 'element', { value: element });
    let s = Symbol.for(protochain[0].constructor);
    if (!listenerDefs[s]) {
      listenerDefs[s] = {};
      for (let i = protochain.length; i--;) {
        let prop = protochain[i].constructor.properties;
        if (prop && prop['listeners']) {
          for (let key in prop['listeners']) {
            listenerDefs[s][key] = prop['listeners'][key];
          }
        }
      }
    }
    for (let key in listenerDefs[s]) {
      this[key] = element[listenerDefs[s][key]];
    }
  }
  connect() {
    for (let e in this) {
      this.element.addEventListener(e, this[e]);
    }
  }
  disconnect() {
    for (let e in this) {
      this.element.removeEventListener(e, this[e]);
    }
  }
}
