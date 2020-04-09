/**
 * An array of all prototypes in the inheritance chain.
 */
class ProtoChain extends Array {
  /**
   * Walks down the prototype inheritance chain of the specified prototype and adds each prototype to itself.
   * It terminates with `HTMLElement`, `Object` or `Array`.
   * @param {Object} proto - Prototype object.
   */
  constructor(proto) {
    super();
    while (proto && proto.constructor !== HTMLElement && proto.constructor !== Object && proto.constructor !== Array) {
      this.push(proto); proto = proto.__proto__;
    }
  }
}

export {ProtoChain};