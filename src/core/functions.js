class ProtoFunctions extends Array{
  constructor(protochain) {
    super();
    for (let i = protochain.length; i--;) {
      const names = Object.getOwnPropertyNames(protochain[i]);
      for (let j = 0; j < names.length; j++) {
        if (names[j] === 'constructor') continue;
        const p = Object.getOwnPropertyDescriptor(protochain[i], names[j]);
        if (p.get || p.set) continue;
        if (typeof protochain[i][names[j]] === 'function') {
          if (names[j].startsWith('_') || names[j].startsWith('on')) {
            this.push(names[j]);
          }
        }
      }
    }
  }
  bind(instance) {
    for (let i = this.length; i--;) {
      instance[this[i]] = instance[this[i]].bind(instance);
    }
  }
}

export { ProtoFunctions };