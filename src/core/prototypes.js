export class Prototypes extends Array {
  constructor(_constructor) {
    super();
    let proto = _constructor.prototype;
    while (proto && proto.constructor !== HTMLElement && proto.constructor !== Object) {
      this.push(proto);
      proto = proto.__proto__;
    }
  }
}
