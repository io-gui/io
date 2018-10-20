import {Prototypes} from "./prototypes.js";
import {ProtoProperties, defineProperties} from "./protoProperties.js";
import {ProtoListeners} from "./protoListeners.js";
import {ProtoFunctions} from "./protoFunctions.js";
import {Binding} from "./binding.js";
import {PropListeners} from "./propListeners.js";

export const IoCoreMixin = (superclass) => class extends superclass {
  static get properties() {
    return {
      // TODO: is this necessary?
      id: {
        type: String,
        enumerable: false
      }
    };
  }
  constructor(initProps = {}) {
    super();
    Object.defineProperty(this, '__bindings', {value: {}});
    Object.defineProperty(this, '__listeners', {value: {}});
    Object.defineProperty(this, '__observeQueue', {value: []});
    Object.defineProperty(this, '__notifyQueue', {value: []});

    Object.defineProperty(this, '__props', {value: this.__props.clone()});

    Object.defineProperty(this, '$', {value: {}}); // TODO: consider clearing in template. possible memory leak!

    this.__protoFunctions.bind(this);

    Object.defineProperty(this, '__propListeners', {value: new PropListeners()});
    this.__propListeners.setListeners(initProps);

    // TODO: is this necessary?
    // TODO: test!
    this.setProperties(initProps);
    this.__observeQueue.push('changed');
    //TODO: changed should only run once
  }
  changed() {}
  dispose() {
    // TODO: test dispose!
    this.__protoListeners.disconnect(this);
    this.__propListeners.disconnect(this);
    this.removeListeners();
    for (let p in this.__props) {
      if (this.__props[p].binding) {
        this.__props[p].binding.removeTarget(this, p);
        // TODO: this breaks binding for transplanted elements.
        // delete this.__props[p].binding;
        // TODO: possible memory leak!
      }
    }
  }
  bind(prop) {
    this.__bindings[prop] = this.__bindings[prop] || new Binding(this, prop);
    return this.__bindings[prop];
  }
  set(prop, value) {
    let oldValue = this[prop];
    this[prop] = value;
    if (oldValue !== value ) this.dispatchEvent(prop + '-set', {value: value, oldValue: oldValue}, false);
  }
  setProperties(props) {

    for (let p in props) {

      if (this.__props[p] === undefined) continue;

      let oldBinding = this.__props[p].binding;
      let oldValue = this.__props[p].value;

      let binding;
      let value;

      if (props[p] instanceof Binding) {
        binding = props[p];
        value = props[p].source[props[p].sourceProp];
      } else {
        value = props[p];
      }

      this.__props[p].binding = binding;
      this.__props[p].value = value;

      if (value !== oldValue) {
        if (this.__props[p].reflect) this.setAttribute(p, value);
        this.queue(this.__props[p].observer, p, value, oldValue);
      }

      if (binding !== oldBinding) {
        binding.setTarget(this, p);
        // TODO: test extensively
        if (oldBinding) console.warn('Disconnect!', binding, oldBinding);
      }

    }

    if (props['className']) {
      this.className = props['className'];
    }

    if (props['style']) {
      for (let s in props['style']) {
        this.style[s] = props['style'][s];
        this.style.setProperty(s, props['style'][s]);
      }
    }
  }
  objectMutated(event) {
    for (let i = this.__objectProps.length; i--;) {
      if (this.__props[this.__objectProps[i]].value === event.detail.object) {
        this.changed();
      }
    }
  }
  connectedCallback() {
    this.__protoListeners.connect(this);
    this.__propListeners.connect(this);
    this.queueDispatch();
    for (let p in this.__props) {
      if (this.__props[p].binding) {
        this.__props[p].binding.setTarget(this, p); //TODO: test
      }
    }
    if (this.__objectProps.length) {
      window.addEventListener('io-object-mutated', this.objectMutated);
    }
  }
  disconnectedCallback() {
    this.__protoListeners.disconnect(this);
    this.__propListeners.disconnect(this);
    for (let p in this.__props) {
      if (this.__props[p].binding) {
        this.__props[p].binding.removeTarget(this, p);
        // TODO: this breaks binding for transplanted elements.
        // delete this.__props[p].binding;
        // TODO: possible memory leak!
      }
    }
    if (this.__objectProps.length) {
      window.removeEventListener('io-object-mutated', this.objectMutated);
    }
  }
  addEventListener(type, listener) {
    this.__listeners[type] = this.__listeners[type] || [];
    let i = this.__listeners[type].indexOf(listener);
    if (i === - 1) {
      if (superclass === HTMLElement) HTMLElement.prototype.addEventListener.call(this, type, listener);
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
        if (superclass === HTMLElement) HTMLElement.prototype.removeEventListener.call(this, type, listener);
        this.__listeners[type].splice(i, 1);
      }
    }
  }
  removeListeners() {
    // TODO: test
    for (let i in this.__listeners) {
      for (let j = this.__listeners[i].length; j--;) {
        if (superclass === HTMLElement) HTMLElement.prototype.removeEventListener.call(this, i, this.__listeners[i][j]);
        this.__listeners[i].splice(j, 1);
      }
    }
  }
  dispatchEvent(type, detail, bubbles = true, src = this) {
    if (src instanceof HTMLElement || src === window) {
      HTMLElement.prototype.dispatchEvent.call(src, new CustomEvent(type, {
        detail: detail,
        bubbles: bubbles,
        composed: true
      }));
    } else {
      // TODO: fix path/src argument
      let path = [src];
      if (this.__listeners[type] !== undefined) {
        let array = this.__listeners[type].slice(0);
        for (let i = 0, l = array.length; i < l; i ++) {
          path = path || [this];
          const payload = {detail: detail, target: this, bubbles: bubbles, path: path};
          array[i].call(this, payload);
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
  queue(observer, prop, value, oldValue) {
    // JavaScript is weird NaN != NaN
    if (typeof value == 'number' && typeof oldValue == 'number' && isNaN(value) && isNaN(oldValue)) {
      return;
    }
    if (this.__observeQueue.indexOf('changed') === -1) {
      this.__observeQueue.push('changed');
    }
    if (observer) {
      if (this.__observeQueue.indexOf(observer) === -1) {
        this.__observeQueue.push(observer);
      }
    }
    this.__notifyQueue.push([prop + '-changed', {value: value, oldValue: oldValue}]);
  }
  queueDispatch() {
    for (let j = 0; j < this.__observeQueue.length; j++) {
      this[this.__observeQueue[j]]();
    }
    for (let j = 0; j < this.__notifyQueue.length; j++) {
      this.dispatchEvent(this.__notifyQueue[j][0], this.__notifyQueue[j][1]);
    }
    this.__observeQueue.length = 0;
    this.__notifyQueue.length = 0;
  }
};

IoCoreMixin.Register = function () {
  Object.defineProperty(this.prototype, '__prototypes', {value: new Prototypes(this)});
  Object.defineProperty(this.prototype, '__props', {value: new ProtoProperties(this.prototype.__prototypes)});
  Object.defineProperty(this.prototype, '__protoFunctions', {value: new ProtoFunctions(this.prototype.__prototypes)});
  Object.defineProperty(this.prototype, '__protoListeners', {value: new ProtoListeners(this.prototype.__prototypes)});

  Object.defineProperty(this.prototype, '__objectProps', {value: []});
  const ignore = [Boolean, String, Number, HTMLElement, Function];
  for (let prop in this.prototype.__props) {
    let type = this.prototype.__props[prop].type;
    if (ignore.indexOf(type) == -1) {
      this.prototype.__objectProps.push(prop);
    }
  }

  defineProperties(this.prototype);
};
