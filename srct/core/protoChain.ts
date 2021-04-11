import {IoNode} from '../components/io-node.js';

type Constructor<T extends any> = new (...args: any[]) => T;

/**
 * An array of all inherited prototypes in the prototype chain.
 */
export class ProtoChain extends Array<Constructor<any[]>> {
  /**
   * Creates an array of inherited prototypes by traversing down the prototype chain of the specified prototype and adds each prototype to itself.
   * It terminates with `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.
   * @param {Object} prototype - Prototype object.
   */
  constructor(classConstructor: any) {
    super();
    let prototype = classConstructor.prototype;
    while (
      prototype
      && prototype.constructor !== (IoNode as any).__proto__
      && prototype.constructor !== HTMLElement
      && prototype.constructor !== Object
      && prototype.constructor !== Array) {
        this.push(prototype.constructor);
        prototype = (prototype as any).__proto__;
    }
  }
}