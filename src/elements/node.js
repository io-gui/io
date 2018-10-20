import {IoCoreMixin} from "../core/coreMixin.js";

export class IoNode extends IoCoreMixin(Object) {
  connect() {
    this.connectedCallback();
  }
  disconnect() {
    this.disconnectedCallback();
  }
  dispose() {
    // TODO test
    delete this.parent;
    this.children.lenght = 0;
    for (let l in this.__listeners) this.__listeners[l].lenght = 0;
    for (let p in this.__props) delete this.__props[p];
  }
}

IoNode.Register = IoCoreMixin.Register;

IoNode.Register();
