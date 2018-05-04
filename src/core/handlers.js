const handlerDefs = {};

export class Handlers extends Array {
  constructor(protochain, instance) {
    super();
    let s = Symbol.for(protochain[0].constructor);
    if (!handlerDefs[s]) {
      handlerDefs[s] = [];
      for (let i = 0; i < protochain.length; i++) {
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
    this.bindInstance(instance);
  }
  bindInstance(instance) {
    for (let i = 0; i < this.length; i++) {
      instance[this[i]] = instance[this[i]].bind(instance);
    }
  }
}
