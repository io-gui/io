// Creates a list of listeners defined in prototype chain.
export class ProtoListeners {
  constructor(prototypes) {
    for (let i = prototypes.length; i--;) {
      let prop = prototypes[i].constructor.listeners;
      for (let j in prop) this[j] = prop[j];
    }
  }
  connect(element) {
    for (let i in this) {
      HTMLElement.prototype.addEventListener.call(element, i, element[this[i]]);
    }
  }
  disconnect(element) {
    for (let i in this) {
      HTMLElement.prototype.removeEventListener.call(element, i, element[this[i]]);
    }
  }
}
