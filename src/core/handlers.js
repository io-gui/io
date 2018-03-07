const handlers = {};

export const getHandlers = function(__class) {
  const name = __class.prototype.constructor.name;
  return handlers[name] ? handlers[name] : handlers[name] = new Handlers(__class);
};

class Handlers extends Array {
  constructor(__class) {
    super();
    let protochain = __class.protochain;
    for (let i = 0; i < protochain.length; i++) {
      let names = Object.getOwnPropertyNames(protochain[i]);
      for (let i = 0; i < names.length; i++) {
        if (names[i].substring(names[i].length-7, names[i].length) === 'Handler') {
          this.push(names[i]);
        }
      }
    }
  }
}
