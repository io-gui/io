const protochainDefs = {};

export class Protochain extends Array {
  constructor(_constructor) {
    super();
    let s = Symbol.for(_constructor);
    if (!protochainDefs[s]) {
      protochainDefs[s] = [];
      let proto = _constructor.prototype;
      while (proto && proto.constructor !== Element) {
        protochainDefs[s].push(proto);
        proto = proto.__proto__;
      }
    }
    for (let key in protochainDefs[s]) {
      this[key] = protochainDefs[s][key];
    }
  }
}
