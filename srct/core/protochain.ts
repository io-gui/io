type Constructor = new (...args: any[]) => Object;

/**
 * An array of all prototypes in the inheritance chain.
 */
class ProtoChain extends Array<Constructor> {
  /**
   * Creates an array of protptypes by traversing down the prototype inheritance chain of the specified prototype and adds each prototype to itself.
   * It terminates with `HTMLElement`, `Object` or `Array`.
   */
  constructor(proto: Constructor) {
    super();
    while (proto && proto.constructor !== HTMLElement && proto.constructor !== Object && proto.constructor !== Array) {
      this.push(proto); proto = (proto as any).__proto__;
    }
  }
}

export {ProtoChain};