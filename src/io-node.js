import {Prototypes} from "./core/prototypes.js";
import {ProtoProperties} from "./core/protoProperties.js";
import {ProtoListeners} from "./core/protoListeners.js";
import {ProtoFunctions} from "./core/protoFunctions.js";

export class IoNode {
  constructor() {
    this.__proto__.constructor.Register();
    this.__proto__.__protoFunctions.bind(this);

    Object.defineProperty(this, '__props', {value: this.__props.clone()});
    Object.defineProperty(this, '__listeners', {value: {}});
  }
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
    for (var l in this.__listeners) this.__listeners[l].lenght = 0;
    for (var p in this.__props) delete this.__props[p];
  }

  update() {}

  triggerObserver(prop, value, oldValue) {
    if (this.__props[prop].observer) {
      this[this.__props[prop].observer](value, oldValue);
    }
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
      if (i !== - 1) {
        this.__listeners[type].splice(i, 1);
      }
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
          this.triggerObserver(prop, value, oldValue);
        },
        enumerable: true,
        configurable: true
      });
    }

    Object.defineProperty(this.prototype, '__protoListeners', { value: new ProtoListeners(prototypes) });
    Object.defineProperty(this.prototype, '__protoFunctions', {value: new ProtoFunctions(prototypes)});

    // TODO: implement children io-nodes via properties
    // Object.defineProperty(this, 'parent', {value: null});
    // Object.defineProperty(this, 'children', {value: null});

  }
  this.registered = true;
};
