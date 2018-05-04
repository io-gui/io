const handlerDefs = {};

export class Handlers extends Array {
  constructor(protochain, element) {
    super();
    Object.defineProperty(this, 'element', { value: element });
    let s = Symbol.for(protochain[0].constructor);
    if (!handlerDefs[s]) {
      handlerDefs[s] = [];
      for (let i = protochain.length; i--;) {
        let names = Object.getOwnPropertyNames(protochain[i]);
        for (let j = 0; j < names.length; j++) {
          if (names[j].substring(names[j].length-7, names[j].length) === 'Handler') {
            handlerDefs[s].push(names[j]);
          }
        }
      }
    }
    for (let key in handlerDefs[s]) {
      this[key] = handlerDefs[s][key];
    }
    this.bind();
  }
  bind() {
    for (let i = 0; i < this.length; i++) {
      this.element[this[i]] = this.element[this[i]].bind(this.element);
    }
  }
}
