import {Prototypes} from "./core/prototypes.js";
import {ProtoProperties, defineProperties} from "./core/protoProperties.js";
import {ProtoListeners} from "./core/protoListeners.js";
import {ProtoFunctions} from "./core/protoFunctions.js";
import {IoBindingMixin} from "./core/mixinBinding.js";
import {IoNodeListenersMixin} from "./core/mixinListeners.js";

export class IoNode extends IoBindingMixin(IoNodeListenersMixin(Object)) {
  constructor() {
    super();
    this.__proto__.constructor.Register();
    this.__proto__.__protoFunctions.bind(this);
    Object.defineProperty(this, '__props', {value: this.__props.clone()});
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
    for (let l in this.__listeners) this.__listeners[l].lenght = 0;
    for (let p in this.__props) delete this.__props[p];
  }
  setAttribute() {
    console.warn('io-node: setAttribute not suppoerted!');
  }
  update() {}
}

IoNode.Register = function() {
  if (!this.registered) {
    const prototypes = new Prototypes(this);

    Object.defineProperty(this.prototype, '__props', {value: new ProtoProperties(prototypes) });
    Object.defineProperty(this.prototype, '__protoFunctions', {value: new ProtoFunctions(prototypes)});
    Object.defineProperty(this.prototype, '__protoListeners', { value: new ProtoListeners(prototypes) });

    defineProperties(this.prototype);

    // TODO: implement children io-nodes via properties
    // Object.defineProperty(this, 'parent', {value: null});
    // Object.defineProperty(this, 'children', {value: null});

  }
  this.registered = true;
};
