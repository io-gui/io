import {ProtoChain} from './protoChain.js';
import {Node} from '../node.js';

/**
 * Collection of all functions defined in the prototype chain that start with "on" or "_"
 */
class FunctionBinder extends Array<string> {
  /**
   * Creates a collection of all functions from protochain that start with "on" or "_".
   * @param {ProtoChain} protochain - Array of protochain constructors.
   */
  constructor(protochain: ProtoChain) {
    super();
    for (let i = protochain.length; i--;) {
      const constructor = protochain[i];
      type ConstructorType = typeof constructor;
      const names = Object.getOwnPropertyNames(constructor);
      for (let j = 0; j < names.length; j++) {
        const fname = names[j] as keyof ConstructorType;
        if (fname === 'constructor') continue;
        const p = Object.getOwnPropertyDescriptor(constructor, fname);
        if (p === undefined || p.get || p.set) continue;
        if (typeof constructor[fname] === 'function') {
          if (this.indexOf(fname) === -1 && ((fname as string).startsWith('_') || (fname as string).startsWith('on'))) {
            this.push(fname);
          }
        }
      }
    }
  }
  /**
   * Binds all functions to node instance.
   * @param {Node} node - Node instance to bind functions to.
   */
  bind(node: Node) {
    for (let i = this.length; i--;) {
      Object.defineProperty(node, this[i], {value: node[this[i]].bind(node)});
    }
  }
}

export {FunctionBinder};