import {Prototypes} from "./core/prototypes.js";
import {ProtoProperties} from "./core/protoProperties.js";
import {ProtoFunctions} from "./core/protoFunctions.js";

export class IoNode {
  constructor() {
    this.__proto__.constructor.Register();
    Object.defineProperty(this, '__props', { value: this.__proto__._properties.cloneProperties() } );
    for (let prop in this.__props) {
      this.defineProperty(prop);
      this[prop] = this[prop];
    }
    this.__proto__._functions.bind(this);
  }
  defineProperty(prop) {
    if (this.__proto__.hasOwnProperty(prop)) return;
    Object.defineProperty(this.__proto__, prop, {
      get: function() {
        return this.__props[prop].value;
      },
      set: function(value) {
        if (this.__props[prop].value === value) return;
        let oldValue = this.__props[prop].value;
        this.__props[prop].value = value;
        if (this.__props[prop].observer) {
          this[this.__props[prop].observer](value, oldValue, prop);
        }
      },
      enumerable: true,
      configurable: true
    });
  }
  dispose() {
    // TODO
  }
  update(dtime, time, progress) {}
}

IoNode.Register = function() {
  if (!this.registered) {
    const prototypes = new Prototypes(this);
    Object.defineProperty(this.prototype, '_properties', {value: new ProtoProperties(prototypes)});
    Object.defineProperty(this.prototype, '_functions', {value: new ProtoFunctions(prototypes)});
  }
  this.registered = true;
}
