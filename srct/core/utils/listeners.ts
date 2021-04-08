import {ProtoChain} from './protoChain.js';

/**
 * Collection of all listeners defined in the prototype chain.
 */
export class ProtoListeners {
  [listener: string]: string | Function;
  /**
   * Creates a collection of all listeners from protochain.
   */
  constructor(protochain: ProtoChain) {
    for (let i = protochain.length; i--;) {
      const listeners = (protochain[i].constructor as any).Listeners as Record<string, string | Function>;
      for (let l in listeners) this[l] = listeners[l];
    }
  }
}

// /**
//  * Collection of all listeners defined in protochain and constructor properties.
//  */
//  export class Listeners {
//   propertyListeners: Record<string, string | Function> = {};
//   protoListeners: Record<string, string | Function> = {};
//   /**
//    * Creates a collection of all listeners from protochain.
//    */
//   constructor(protochain: ProtoChain) {
//     for (let i = protochain.length; i--;) {
//       const listeners = (protochain[i].constructor as any).Listeners as Record<string, string | Function>;
//       for (let l in listeners) this.protoListeners[l] = listeners[l];
//     }
//   }
//   set(listeners: Record<string, any>) {
//     this.propertyListeners = {};
//     for (let l in listeners) {
//       if (l.startsWith('on-')) {
//         const event = l.slice(3, l.length);
//         debug: {
//           const type = typeof listeners[l];
//           if (['function', 'string'].indexOf(type) === -1) {
//             console.error(`Invalid listener "${event}" type:${type}!`)
//           }
//         }
//         this.propertyListeners[event] = listeners[l];
//       }
//     }
//   }
// }