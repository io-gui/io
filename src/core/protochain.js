export class Protochain extends Array {
  constructor(instance) {
    super();
    let proto = instance.__proto__.constructor;
    while (proto) {
      this.push(proto);
      proto = proto.__proto__;
    }
  }
}
