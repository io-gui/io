import {Prototypes} from "./core/prototypes.js";
import {ProtoProperties} from "./core/protoProperties.js";
import {ProtoFunctions} from "./core/protoFunctions.js";

export class IoNode {
  constructor() {
    this.__proto__.constructor.Register();

    Object.defineProperty(this, '__props', {value: this.__props.clone()});
    Object.defineProperty(this, '__listeners', {value: {}});

    this.__proto__.__functions.bind(this);
  }
  dispose() {
    // TODO test
    delete this.parent;
    this.children.lenght = 0;
    for (var l in this.__listeners) this.__listeners[l].lenght = 0;
    for (var p in this.__props) delete this.__props[p];
  }
  update() {
  }
  addEventListener(type, listener) {
    this.__listeners[type] = this.__listeners[type] || [];
    if (this.__listeners[type].indexOf(listener) === - 1) {
      this.__listeners[type].push(listener);
    }
  }
  hasEventListener(type, listener) {
    return this.__listeners[type] !== undefined && this.__listeners[type].indexOf(listener) !== - 1;
  }
  removeEventListener(type, listener) {
    if (this.__listeners[type] !== undefined) {
      let i = this.__listeners[type].indexOf(listener);
      if (i !== - 1) this.__listeners[type].splice(i, 1);
    }
  }
  dispatchEvent(type, detail, bubbles, path) {
    if (this.__listeners[type] !== undefined) {
      let array = this.__listeners[type].slice(0);
      for (let i = 0, l = array.length; i < l; i ++) {
        path = path || [this];
        array[i].call(this, {detail: detail, target: this, bubbles: bubbles, path: path});
        // TODO: test bubbling
        if (bubbles) {
          let parent = this.parent;
          while (parent) {
            path.push(parent);
            parent.dispatchEvent(type, detail, true, path);
            parent = parent.parent;
          }
        }
      }
    }
  }
}

IoNode.Register = function() {
  if (!this.registered) {
    const prototypes = new Prototypes(this);

    Object.defineProperty(this.prototype, '__props', {value: new ProtoProperties(prototypes) });

    for (let prop in this.prototype.__props) {
      Object.defineProperty(this.prototype, prop, {
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

    Object.defineProperty(this.prototype, '__functions', {value: new ProtoFunctions(prototypes)});

    // TODO: implement children io-nodes via properties
    // Object.defineProperty(this, 'parent', {value: null});
    // Object.defineProperty(this, 'children', {value: null});

  }
  this.registered = true;
};
