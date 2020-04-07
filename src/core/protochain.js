class Protochain extends Array {
  constructor(proto) {
    super();
    while (proto && proto.constructor !== HTMLElement && proto.constructor !== Object) {
      this.push(proto); proto = proto.__proto__;
    }
  }
}

export { Protochain };