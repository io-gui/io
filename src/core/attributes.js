export class Attributes {
  constructor(protochain) {
    for (let i = 0; i < protochain.length; i++) {
      let prop = protochain[i].properties;
      if (prop && prop['attributes']) {
        for (let att in prop['attributes']) this[att] = prop['attributes'][att];
      }
    }
  }
}
