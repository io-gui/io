import {ProtoChain} from './protoChain.js';

/**
 * Collection of all listeners defined in the prototype chain.
 */
export class ProtoListeners {
  /**
   * Creates a collection of all listeners from protochain.
   */
  constructor(protochain: ProtoChain) {
    for (let i = protochain.length; i--;) {
      const prop = (protochain[i].constructor as any).Listeners;
      for (let j in prop) (this as any)[j] = prop[j];
      for (let j in prop) console.log(j, prop[j]);
    }
  }
}