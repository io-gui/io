import {IoCore} from "../core/core.js";

export class IoNode extends IoCore(Object) {
  connect() {
    this.connectedCallback();
  }
  disconnect() {
    this.disconnectedCallback();
  }
  dispose() {
    // TODO implement properly and test
    delete this.parent;
    this.children.lenght = 0;
    for (let l in this.__listeners) this.__listeners[l].lenght = 0;
    for (let p in this.__props) delete this.__props[p];
  }
}

IoNode.Register = function() {
  IoCore.Register.call(this);
};

IoNode.Register();
