import {ProtoChain} from './protoChain.js';

type Listeners = Record<string, string>;

/**
 * Collection of all listeners defined in the prototype chain.
 */
export class ProtoListeners {
  [listener: string]: string;
  /**
   * Creates a collection of all listeners from protochain.
   */
  constructor(protochain: ProtoChain) {
    for (let i = protochain.length; i--;) {
      const listeners = (protochain[i].constructor as any).Listeners as Listeners;
      for (let l in listeners) this[l] = listeners[l];
    }
  }
}