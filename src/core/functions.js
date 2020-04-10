/**
 * Collection of all functions defined in the prototype chain that start with "on" or "_"
 */
class ProtoFunctions extends Array {
  /**
   * Creates a collection of all function from protochain that start with "on" or "_".
   * @param {ProtoChain} protochain - Array of protochain constructors.
   */
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
  /**
   * Binds all functions to `this`.
   * @param {IoNode} instance - Array of protochain constructors.
   */
  bind(instance) {
    for (let i = this.length; i--;) {
      instance[this[i]] = instance[this[i]].bind(instance);
    }
  }
}

export {ProtoFunctions};