import {Binding} from "./classes/binding.js";
import {Functions} from "./classes/functions.js";
import {Listeners} from "./classes/listeners.js";
import {Properties} from "./classes/properties.js";

export const IoCoreMixin = (superclass) => class extends superclass {
  constructor(initProps = {}) {
    super();

    if (!this.constructor.prototype.__registered) this.constructor.Register();

    Object.defineProperty(this, '__bindings', {value: {}});
    Object.defineProperty(this, '__activeListeners', {value: {}});
    Object.defineProperty(this, '__changeQueue', {value: []});

    Object.defineProperty(this, '__properties', {value: this.__properties.clone()});

    this.__functions.bind(this);

    Object.defineProperty(this, '__propListeners', {value: new Listeners()});
    this.__propListeners.setListeners(initProps);

    // TODO: test
    // This triggers change events for object values initialized from type constructor.
    for (let p in this.__properties) {
      if (typeof this.__properties[p].value === 'object' && this.__properties[p].value) {
        this.queue(p, this.__properties[p].value, undefined);
      }
    }

    this.setProperties(initProps);

    if (superclass !== HTMLElement) this.connect(); // TODO: test
  }
  connect() {
    this.connectedCallback();
  }
  disconnect() {
    this.disconnectedCallback();
  }
  preventDefault(event) {
    event.preventDefault();
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
    // TODO implement properly and test on both elements and objects
    // for (let l in this.__listeners) this.__listeners[l].lenght = 0;
    // for (let p in this.__properties) delete this.__properties[p];
  }
  bind(prop) {
    this.__bindings[prop] = this.__bindings[prop] || new Binding(this, prop);
    return this.__bindings[prop];
  }
  set(prop, value) {
    if (this[prop] !== value) {
      const oldValue = this[prop];
      this[prop] = value;
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
        this.queue(p, value, oldValue);
      }
      if (binding !== oldBinding) {
        if (binding) binding.setTarget(this, p);
        if (oldBinding) {
          oldBinding.removeTarget(this, p); // TODO: test extensively
        }
      }
    }

    this.className = props['className'] || '';
    if (props['style']) {
      for (let s in props['style']) {
        this.style[s] = props['style'][s];
        this.style.setProperty(s, props['style'][s]);
      }
    }

    this.queueDispatch();
  }
  // TODO: test extensively
  mapProperties(nodes) {
    for (let n in nodes) {
      const properties = nodes[n];
      this.addEventListener(n + '-changed', (event) => {
        const oldValue = event.detail.oldValue;
        const value = event.detail.value;
        if (oldValue) oldValue.dispose(); // TODO: test
        value.setProperties(properties);
      });
    }
  }
  objectMutated(event) {
    let mutated = false;
    for (let i = this.__objectProps.length; i--;) {
      const prop = this.__objectProps[i];
      const value = this.__properties[prop].value;
      if (value === event.detail.object) {
        this.queue(prop, value, value);
        mutated = true;
      }
    }
    // if (mutated)
    this.queueDispatch();
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
  queue(prop, value, oldValue) {
    const i = this.__changeQueue.indexOf(prop);
    if (i === -1) {
      this.__changeQueue.push(prop, {property: prop, value: value, oldValue: oldValue});
    } else {
      this.__changeQueue[i + 1].value = value;
    }
  }
  queueDispatch() {
    if (this.__changeQueue.length) {
      for (let j = 0; j < this.__changeQueue.length; j += 2) {
        const prop = this.__changeQueue[j];
        const detail = this.__changeQueue[j + 1];
        const payload = {detail: detail};
        const customChange = this.__properties[prop].change;
        const defaultChange = prop + 'Changed';
        if (this[defaultChange]) this[defaultChange](payload);
        if (customChange && this[customChange]) this[customChange](payload);
        this.dispatchEvent(prop + '-changed', detail, false);
      }
      if (this.changed) this.changed();
      this.__changeQueue.length = 0;
    }
  }
};

export function defineProperties(prototype) {
  for (let prop in prototype.__properties) {
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
          this.queue(prop, value, oldValue);
          this.queueDispatch();
        }
      },
      enumerable: isEnumerable && isPublic,
      configurable: true,
    });
  }
}

IoCoreMixin.Register = function () {
  Object.defineProperty(this.prototype, '__protochain', {value: []});

  let proto = this.prototype;
  while (proto && proto.constructor !== HTMLElement && proto.constructor !== Object) {
    this.prototype.__protochain.push(proto);
    proto = proto.__proto__;
  }

  Object.defineProperty(this.prototype, '__properties', {value: new Properties(this.prototype.__protochain)});
  Object.defineProperty(this.prototype, '__functions', {value: new Functions(this.prototype.__protochain)});
  Object.defineProperty(this.prototype, '__protoListeners', {value: new Listeners(this.prototype.__protochain)});

  // TODO: rewise
  Object.defineProperty(this.prototype, '__objectProps', {value: []});
  const ignore = [Boolean, String, Number, HTMLElement, Function, undefined];
  for (let prop in this.prototype.__properties) {
    let type = this.prototype.__properties[prop].type;
    if (ignore.indexOf(type) == -1) {
      this.prototype.__objectProps.push(prop);
    }
  }

  Object.defineProperty(this.prototype, '__registered', {value: true});

  defineProperties(this.prototype);
};

export class IoCore extends IoCoreMixin(Object) {}

IoCore.Register = IoCoreMixin.Register;
