const protochains = {};

export const getProtochain = function(__class) {
  const name = __class.prototype.constructor.name;
  return protochains[name] ? protochains[name] : protochains[name] = new Protochain(__class);
};

class Protochain extends Array {
  constructor(__class) {
    super();
    let proto = __class.prototype;
    while (proto && proto !== Element) {
      this.push(proto);
      proto = proto.__proto__;
    }
  }
}
