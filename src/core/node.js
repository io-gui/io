import {IoCoreMixin} from "./coreMixin.js";

export class IoNode extends IoCoreMixin(Object) {
  connectedCallback() {
    // TODO: implement connected
    this.__proto__.__protoListeners.connect(this);
  }
  disconnectedCallback() {
    // TODO: implement disconnected
    this.__proto__.__protoListeners.disconnect(this);
  }
  dispose() {
    // TODO test
    delete this.parent;
    this.children.lenght = 0;
    for (let l in this.__listeners) this.__listeners[l].lenght = 0;
    for (let p in this.__props) delete this.__props[p];
  }
  setAttribute() {
    console.warn('io-node: setAttribute not suppoerted!');
  }
}

IoNode.Register = IoCoreMixin.Register;
