// Creates an array of constructors found in the prototype chain terminating before `Object` and `HTMLElement`.

export class Protochain extends Array {
  constructor(constructorClass) {
    super();
    let proto = constructorClass;
    while (proto && proto.constructor !== HTMLElement && proto.constructor !== Object) {
      this.push(proto);
      proto = proto.__proto__;
    }
  }
}
