import {Binding} from "./classes/binding.js";
import {Functions} from "./classes/functions.js";
import {Listeners} from "./classes/listeners.js";
import {Properties} from "./classes/properties.js";
import {Protochain} from "./classes/protochain.js";

export const IoCoreMixin = (superclass) => class extends superclass {
  constructor(initProps = {}) {
    super();
    Object.defineProperty(this, '__bindings', {value: {}});
    Object.defineProperty(this, '__activeListeners', {value: {}});
    Object.defineProperty(this, '__observeQueue', {value: []});
    Object.defineProperty(this, '__notifyQueue', {value: []});

    Object.defineProperty(this, '__properties', {value: this.__properties.clone()});

    this.__functions.bind(this);

    Object.defineProperty(this, '__propListeners', {value: new Listeners()});
    this.__propListeners.setListeners(initProps);

    this.setProperties(initProps);

    if (this.__observeQueue.indexOf('changed') === -1) this.__observeQueue.push('changed', {detail: {}});
  }
  changed() {}
  dispose() {
    // TODO: test dispose!
    // TODO: dispose bindings correctly
    this.__protoListeners.disconnect(this);
    this.__propListeners.disconnect(this);
    this.removeListeners();
    for (let p in this.__properties) {
      if (this.__properties[p].binding) {
        this.__properties[p].binding.removeTarget(this, p);
        // TODO: this breaks binding for transplanted elements.
        // TODO: possible memory leak!
        delete this.__properties[p].binding;
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
    if (oldValue !== value) {
      this.dispatchEvent(prop + '-set', {property: prop, value: value, oldValue: oldValue}, false);
    }
  }
  setProperties(props) {

    for (let p in props) {

      if (this.__properties[p] === undefined) continue;

      let oldBinding = this.__properties[p].binding;
      let oldValue = this.__properties[p].value;

      let binding;
      let value;

      if (props[p] instanceof Binding) {
        binding = props[p];
        value = props[p].source[props[p].sourceProp];
      } else {
        value = props[p];
      }

      this.__properties[p].binding = binding;
      this.__properties[p].value = value;

      if (value !== oldValue) {
        if (this.__properties[p].reflect) this.setAttribute(p, value);
        this.queue(this.__properties[p].observer, p, value, oldValue);
        if (this.__properties[p].observer) this.queue(this.__properties[p].observer, p, value, oldValue);
        // TODO: decouple observer and notify queue // if (this[p + 'Changed'])
        this.queue(p + 'Changed', p, value, oldValue);
      }

      if (binding !== oldBinding) {
        if (binding) binding.setTarget(this, p);
        if (oldBinding) {
          oldBinding.removeTarget(this, p);
          // TODO: test extensively
          // console.warn('Disconnect!', oldBinding);
        }
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

    // if (this.__observeQueue.length) {
      if (this.__observeQueue.indexOf('changed') === -1) {
        this.__observeQueue.push('changed', {});
      }
    // }
    this.queueDispatch();
  }
  objectMutated(event) {
    for (let i = this.__objectProps.length; i--;) {
      if (this.__properties[this.__objectProps[i]].value === event.detail.object) {
        // Triggers change on all elements with mutated object as property
        this.changed();
      }
    }
  }
  connectedCallback() {
    this.__protoListeners.connect(this);
    this.__propListeners.connect(this);
    this.__connected = true;
    this.queueDispatch();
    for (let p in this.__properties) {
      if (this.__properties[p].binding) {
        this.__properties[p].binding.setTarget(this, p); //TODO: test
      }
    }
    if (this.__objectProps.length) {
      window.addEventListener('object-mutated', this.objectMutated);
    }
  }
  disconnectedCallback() {
    this.__protoListeners.disconnect(this);
    this.__propListeners.disconnect(this);
    this.__connected = false;
    for (let p in this.__properties) {
      if (this.__properties[p].binding) {
        this.__properties[p].binding.removeTarget(this, p);
        // TODO: this breaks binding for transplanted elements.
        // delete this.__properties[p].binding;
        // TODO: possible memory leak!
      }
    }
    if (this.__objectProps.length) {
      window.removeEventListener('object-mutated', this.objectMutated);
    }
  }
  addEventListener(type, listener) {
    this.__activeListeners[type] = this.__activeListeners[type] || [];
    let i = this.__activeListeners[type].indexOf(listener);
    if (i === - 1) {
      if (superclass === HTMLElement) HTMLElement.prototype.addEventListener.call(this, type, listener);
      this.__activeListeners[type].push(listener);
    }
  }
  hasEventListener(type, listener) {
    return this.__activeListeners[type] !== undefined && this.__activeListeners[type].indexOf(listener) !== - 1;
  }
  removeEventListener(type, listener) {
    if (this.__activeListeners[type] !== undefined) {
      let i = this.__activeListeners[type].indexOf(listener);
      if (i !== - 1) {
        if (superclass === HTMLElement) HTMLElement.prototype.removeEventListener.call(this, type, listener);
        this.__activeListeners[type].splice(i, 1);
      }
    }
  }
  removeListeners() {
    // TODO: test
    for (let i in this.__activeListeners) {
      for (let j = this.__activeListeners[i].length; j--;) {
        if (superclass === HTMLElement) HTMLElement.prototype.removeEventListener.call(this, i, this.__activeListeners[i][j]);
        this.__activeListeners[i].splice(j, 1);
      }
    }
  }
  dispatchEvent(type, detail = {}, bubbles = true, src = this) {
    if (src instanceof HTMLElement || src === window) {
      HTMLElement.prototype.dispatchEvent.call(src, new CustomEvent(type, {
        type: type,
        detail: detail,
        bubbles: bubbles,
        composed: true
      }));
    } else {
      // TODO: fix path/src argument
      let path = [src];
      if (this.__activeListeners[type] !== undefined) {
        let array = this.__activeListeners[type].slice(0);
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
    if (observer && this[observer]) {
      if (this.__observeQueue.indexOf(observer) === -1) {
        this.__observeQueue.push(observer, {detail: {property: prop, value: value, oldValue: oldValue}});
      }
    }
    if (this.__notifyQueue.indexOf(prop + '-changed') === -1) {
      this.__notifyQueue.push(prop + '-changed', {property: prop, value: value, oldValue: oldValue});
    }
  }
  queueDispatch() {
    // TODO: consider unifying observe and notify queue
    for (let j = 0; j < this.__observeQueue.length; j+=2) {
      this[this.__observeQueue[j]](this.__observeQueue[j+1]);
    }
    for (let j = 0; j < this.__notifyQueue.length; j+=2) {
      this.dispatchEvent(this.__notifyQueue[j], this.__notifyQueue[j+1]);
    }
    this.__observeQueue.length = 0;
    this.__notifyQueue.length = 0;
  }
};

export function defineProperties(prototype) {
  for (let prop in prototype.__properties) {
    const observer = prop + 'Changed';
    const changeEvent = prop + '-changed';
    const isPublic = prop.charAt(0) !== '_';
    const isEnumerable = !(prototype.__properties[prop].enumerable === false);
    Object.defineProperty(prototype, prop, {
      get: function() {
        return this.__properties[prop].value;
      },
      set: function(value) {
        if (this.__properties[prop].value === value) return;
        const oldValue = this.__properties[prop].value;
        if (value instanceof Binding) {
          const binding = value;
          value = value.source[value.sourceProp];
          binding.setTarget(this, prop);
          this.__properties[prop].binding = binding;
        }
        this.__properties[prop].value = value;
        if (this.__properties[prop].reflect) this.setAttribute(prop, this.__properties[prop].value);
        if (isPublic && this.__connected) {
          const payload = {detail: {property: prop, value: value, oldValue: oldValue}};
          if (this[observer]) this[observer](payload);
          if (this.__properties[prop].observer) this[this.__properties[prop].observer](payload);
          this.changed();
          this.dispatchEvent(changeEvent, payload.detail);
        }
      },
      enumerable: isEnumerable && isPublic,
      configurable: true,
    });
  }
}

IoCoreMixin.Register = function () {
  Object.defineProperty(this.prototype, '__protochain', {value: new Protochain(this.prototype)});
  Object.defineProperty(this.prototype, '__properties', {value: new Properties(this.prototype.__protochain)});
  Object.defineProperty(this.prototype, '__functions', {value: new Functions(this.prototype.__protochain)});
  Object.defineProperty(this.prototype, '__protoListeners', {value: new Listeners(this.prototype.__protochain)});

  // TODO: rewise
  Object.defineProperty(this.prototype, '__objectProps', {value: []});
  const ignore = [Boolean, String, Number, HTMLElement, Function];
  for (let prop in this.prototype.__properties) {
    let type = this.prototype.__properties[prop].type;
    if (ignore.indexOf(type) == -1) {
      this.prototype.__objectProps.push(prop);
    }
  }

  defineProperties(this.prototype);
};

export class IoCore extends IoCoreMixin(Object) {
  constructor(props) {
    super(props);
    this.connect();
  }
  connect() {
    this.connectedCallback();
  }
  disconnect() {
    this.disconnectedCallback();
  }
  dispose() {
    super.dispose();
    // TODO implement properly and test
    for (let l in this.__listeners) this.__listeners[l].lenght = 0;
    for (let p in this.__properties) delete this.__properties[p];
  }
}

IoCore.Register = function() {
  IoCoreMixin.Register.call(this);
};

IoCore.Register();
