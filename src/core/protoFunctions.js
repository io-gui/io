export class ProtoFunctions extends Array {
  constructor(prototypes) {
    super();
    for (let i = prototypes.length; i--;) {
      let names = Object.getOwnPropertyNames(prototypes[i]);
      for (let j = 0; j < names.length; j++) {
        if (names[j] === 'constructor') continue;
        if (typeof prototypes[i][names[j]] !== 'function') continue;
        if (prototypes[i][names[j]].name === 'anonymous') {
          continue;
        }
        this.push(names[j]);
        if (names[j] === 'value') console.log(prototypes[i][names[j]]);
      }
    }
  }
  bind(element) {
    for (let i = 0; i < this.length; i++) {
      if (typeof element[this[i]].bind !== 'function') {
        console.log(this[i], typeof this[i], element[this[i]]);
      }
      element[this[i]] = element[this[i]].bind(element);
    }
  }
}
