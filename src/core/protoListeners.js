export class ProtoListeners {
  constructor(prototypes) {
    const propertyDefs = {};
    for (let i = prototypes.length; i--;) {
      let prop = prototypes[i].constructor.listeners;
      for (let key in prop) this[key] = prop[key];
    }
  }
  connect(element) {
    for (let i in this) {
      element.addEventListener(i, element[this[i]]);
    }
  }
  disconnect(element) {
    for (let i in this) {
      element.removeEventListener(i, element[this[i]]);
    }
  }
}
