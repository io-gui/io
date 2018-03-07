export class Listeners {
  constructor(protochain) {
    for (let i = 0; i < protochain.length; i++) {
      let prop = protochain[i].constructor.properties;
      if (prop && prop['listeners']) {
        for (let listener in prop['listeners']) {
          this[listener] = this[listener] || [];
          this[listener].push(prop['listeners'][listener]);
        }
      }
    }
  }
}
