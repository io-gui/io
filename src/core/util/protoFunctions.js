// Creates a list of functions defined in prototype chain (for the purpose of binding to instance).
// TODO: consider improving
export class ProtoFunctions extends Array {
  constructor(prototypes) {
    super();
    for (let i = prototypes.length; i--;) {
      const names = Object.getOwnPropertyNames(prototypes[i]);
      for (let j = 0; j < names.length; j++) {
        if (names[j] === 'constructor') continue;
        const p = Object.getOwnPropertyDescriptor(prototypes[i], names[j]);
        if (p.get || p.set) continue;
        if (typeof prototypes[i][names[j]] !== 'function') continue;
        if (prototypes[i][names[j]].name === 'anonymous') continue;
        if (this.indexOf(names[j]) === -1) this.push(names[j]);
        if (names[j] === 'value') console.log(prototypes[i][names[j]]);
      }
    }
  }
  // Binds all functions to instance.
  bind(element) {
    for (let i = 0; i < this.length; i++) {
      element[this[i]] = element[this[i]].bind(element);
    }
  }
}
