import {NodeBindings, Binding} from "./bindings.js";
import {NodeQueue} from "./queue.js";
import {ProtoListeners, Listeners} from "./listeners.js";
import {Properties, ProtoProperties} from "./properties.js";

// TODO: Improve tests.

/**
  * Core mixin for `IoNode` and `IoElement` classes.
  * @param {function} superclass - Class to extend.
  * @return {IoNodeMixin} - Extended class with `IoNodeMixin` applied to it.
  */
export const IoNodeMixin = (superclass) => {
  const classConstructor = class extends superclass {
    /**
     * Static properties getter. Node properties should be defined here.
     * @return {Object} properties - Properties configuration objects.
     * @return {Object|*} [properties.*] - Configuration object or one of the configuration parameters.
     * @return {*} [properties.*.value] - Default value.
     * @return {function} [properties.*.type] - Constructor of value.
     * @return {number} [properties.*.reflect] - Reflects to HTML attribute
     * @return {boolean} [properties.*.notify] - Enables change events.
     * @return {boolean} [properties.*.enumerable] - Makes property enumerable.
     * @return {Binding} [properties.*.binding] - Binding object.
     */
    static get Properties() {
      return {
        $: {
          type: Object,
          notify: false,
        },
        lazy: Boolean,
      };
    }
    /**
      * Creates `IoNode` instance and initializes internals.
      * @param {Object} initProps - Property values to inialize instance with.
      */
    constructor(initProps = {}) {
      super(initProps);

      Object.defineProperty(this, '__nodeBindings', {value: new NodeBindings(this)});
      Object.defineProperty(this, '__nodeQueue', {value: new NodeQueue(this)});

      Object.defineProperty(this, '__properties', {value: new Properties(this, this.__protoProperties)});
      Object.defineProperty(this, '__listeners', {value: new Listeners(this, this.__protoListeners)});

      Object.defineProperty(this, '__connected', {enumerable: false, writable: true});

      for (let i = 0; i < this.__functions.length; i++) {
        this[this.__functions[i]] = this[this.__functions[i]].bind(this);
      }

      this.setProperties(initProps);
    }
    /**
      * Connects IoNode to the application.
      * @param {IoNode|IoElement} owner - Node or element `IoNode` is connected to.
      */
    connect(owner) {
      this._owner = this._owner || [];
      if (this._owner.indexOf(owner) === -1) {
        this._owner.push(owner);
        if (!this.__connected) this.connectedCallback();
      }
    }
    /**
      * Disconnects IoNode from the application.
      * @param {IoNode|IoElement} owner - Node or element `IoNode` is connected to.
      */
    disconnect(owner) {
      if (this._owner.indexOf(owner) !== -1) {
        this._owner.splice(this._owner.indexOf(owner), 1);
      }
      if (this._owner.length === 0 && this.__connected) {
        this.disconnectedCallback();
      }
    }
    /**
      * Shorthand for `event.preventDefault()`.
      * @param {Object} event - Event object.
      */
    preventDefault(event) {
      event.preventDefault();
    }
    /**
      * default change handler.
      */
    changed() {}
    /**
      * Applies compose object on change.
      */
    applyCompose() {
      // TODO: Test and documentation.
      const compose = this.compose;
      if (compose) {
        for (let prop in compose) {
          this[prop].setProperties(compose[prop]);
        }
      }
    }
    /**
      * Returns a binding to a specified property`.
      * @param {string} prop - Property to bind to.
      * @return {Binding} Binding object.
      */
    bind(prop) {
      return this.__nodeBindings.get(prop);
    }
    /**
      * Sets a property and emits [property]-set` event.
      * Use this when property is set by user action (e.g. mouse click).
      * @param {string} prop - Property name.
      * @param {*} value - Property value.
      * @param {boolean} force - Force value set.
      */
    set(prop, value, force) {
      if (this[prop] !== value || force) {
        const oldValue = this[prop];
        this[prop] = value;
        this.dispatchEvent('value-set', {property: prop, value: value, oldValue: oldValue}, false);
      }
    }
    // TODO: consider renaming and simplifying `props` object structure.
    /**
      * Sets multiple properties in batch.
      * [property]-changed` events will be broadcast in the end.
      * @param {Object} props - Map of property names and values.
      */
    setProperties(props) {
      for (let p in props) {
        if (this.__properties[p] === undefined) continue;
        this.__properties.set(p, props[p], true);
      }

      // TODO: remove?
      if (props['style']) {
        for (let s in props['style']) {
          this.style[s] = props['style'][s];
          this.style.setProperty(s, props['style'][s]);
        }
      }

      this.__listeners.setPropListeners(props, this);
      if (this.__connected) this.queueDispatch();
    }
    _onObjectMutation(event) {
      for (let i = this.__observedProps.length; i--;) {
        const prop = this.__observedProps[i];
        const value = this.__properties[prop].value;
        if (value === event.detail.object) {
          this.throttle(this._onObjectMutationThrottled, prop);
          return;
        }
        // TODO: documentation!
        // TODO: consider removing!
        if (typeof this.__properties[prop].observe === 'number') {
          const depth = this.__properties[prop].observe;
          // console.warn('IoNode: Severe performance penalty! Debug feature only');
          const hasObject = !!this.filterObject(value, (o) => { return o === event.detail.object; }, depth);
          if (hasObject) {
            this.throttle(this._onObjectMutationThrottled, prop);
            return;
          }
        }
      }
    }
    /**
      * This function is called when `object-mutated` event is observed
      * and changed object is a property of the node.
      * @param {string} prop - Mutated object property name.
      */
    _onObjectMutationThrottled(prop) {
      if (this['propMutated']) this['propMutated'](prop);
      if (this[prop + 'Mutated']) this[prop + 'Mutated']();
      this.changed();
      this.applyCompose();
    }
    /**
      * Callback when `IoNode` is connected.
      */
    connectedCallback() {
      this.__listeners.connect();
      this.__properties.connect();
      this.__connected = true;
      if (this.__observedProps.length) {
        window.addEventListener('object-mutated', this._onObjectMutation);
      }
      this.queueDispatch();
    }
    /**
      * Callback when `IoNode` is disconnected.
      */
    disconnectedCallback() {
      this.__listeners.disconnect();
      this.__properties.disconnect();
      this.__connected = false;
      if (this.__observedProps.length) {
        window.removeEventListener('object-mutated', this._onObjectMutation);
      }
    }
    /**
      * Disposes all internals.
      * Use this when node is no longer needed.
      */
    dispose() {
      this.__nodeQueue.dispose();
      this.__nodeBindings.dispose();
      this.__listeners.dispose();
      this.__properties.dispose();
    }
    /**
      * Wrapper for addEventListener.
      * @param {string} type - listener name.
      * @param {function} listener - listener handler.
      * @param {Object} options - event listener options.
      */
    addEventListener(type, listener, options) {
      if (typeof listener !== 'function') {
        console.warn(`Io ${this.constructor.name} "${type}" listener handler is not a function`);
        return;
      }
      this.__listeners.addEventListener(type, listener, options);
    }
    /**
      * Wrapper for removeEventListener.
      * @param {string} type - event name to listen to.
      * @param {function} listener - listener handler.
      * @param {Object} options - event listener options.
      */
    removeEventListener(type, listener, options) {
      this.__listeners.removeEventListener(type, listener, options);
    }
    /**
      * Wrapper for dispatchEvent.
      * @param {string} type - event name to dispatch.
      * @param {Object} detail - event detail.
      * @param {boolean} bubbles - event bubbles.
      * @param {HTMLElement|IoNode} src source node/element to dispatch event from.
      */
    dispatchEvent(type, detail, bubbles = false, src) {
      this.__listeners.dispatchEvent(type, detail, bubbles, src);
    }
    /**
      * Adds property change to the queue.
      * @param {string} prop - Property name.
      * @param {*} value - Property value.
      * @param {*} oldValue - Old property value.
      */
    queue(prop, value, oldValue) {
      this.__nodeQueue.queue(prop, value, oldValue);
    }
    /**
      * Dispatches the queue.
      */
    queueDispatch() {
      if (this.lazy) {
        preThrottleQueue.push(this._queueDispatchLazy);
        this.throttle(this._queueDispatchLazy);
      } else {
        this.__nodeQueue.dispatch();
      }
    }
    _queueDispatchLazy() {
      this.__nodeQueue.dispatch();
    }
    /**
      * Throttles function execution to next frame (rAF) if the function has been executed in the current frame.
      * @param {function} func - Function to throttle.
      * @param {*} arg - argument for throttled function.
      * @param {boolean} asynchronous - execute with timeout.
      */
    throttle(func, arg, asynchronous) {
      // TODO: move to extenal throttle function, document and test.
      if (preThrottleQueue.indexOf(func) === -1) {
        preThrottleQueue.push(func);
        if (!asynchronous) {
          func(arg);
          return;
        }
      }
      if (throttleQueue.indexOf(func) === -1) {
        throttleQueue.push(func);
      }
      // TODO: improve argument handling. Consider edge-cases.
      if (argQueue.has(func) && typeof arg !== 'object') {
        const queue = argQueue.get(func);
        if (queue.indexOf(arg) === -1) queue.push(arg);
      } else {
        argQueue.set(func, [arg]);
      }
    }
    requestAnimationFrameOnce(func) {
      requestAnimationFrameOnce(func);
    }
    filterObject(object, predicate, _depth = 5, _chain = [], _i = 0) {

      if (_chain.indexOf(object) !== -1) return; _chain.push(object);
      if (_i > _depth) return; _i++;

      if (predicate(object)) return object;

      for (let key in object) {
        const value = object[key] instanceof Binding ? object[key].value : object[key];
        if (predicate(value)) return value;
        if (typeof value === 'object') {
          const subvalue = this.filterObject(value, predicate, _depth, _chain, _i);
          if (subvalue) return subvalue;
        }
      }
    }
    filterObjects(object, predicate, _depth = 5, _chain = [], _i = 0) {
      const result = [];
      if (_chain.indexOf(object) !== -1) return result; _chain.push(object);
      if (_i > _depth) return result; _i++;
      if (predicate(object) && result.indexOf(object) === -1) result.push(object);
      for (let key in object) {
        const value = object[key] instanceof Binding ? object[key].value : object[key];
        if (predicate(value) && result.indexOf(value) === -1) result.push(value);
        if (typeof value === 'object') {
          const results = this.filterObjects(value, predicate, _depth, _chain, _i);
          for (let i = 0; i < results.length; i++) {
            if (result.indexOf(results[i]) === -1) result.push(results[i]);
          }
        }
      }
      return result;
    }
    import(path) {
      const importPath = new URL(path, window.location).href;
      return new Promise(resolve => {
        if (!path || importedPaths[importPath]) {
          resolve(importPath);
        } else {
          import(importPath)
          .then(() => {
            importedPaths[importPath] = true;
            resolve(importPath);
          });
        }
      });
    }
  };
  classConstructor.Register = Register;
  return classConstructor;
};

/**
  * Register function to be called once per class.
  * `IoNode` will self-register on first instance constructor.
  * `IoElement` classes should call Register manually before first instance is created.
  */
const Register = function () {
  let proto = this.prototype;
  const protochain = [];
  while (proto && proto.constructor !== HTMLElement && proto.constructor !== Object) {
    protochain.push(proto); proto = proto.__proto__;
  }

  const isIoNode = proto.constructor !== HTMLElement;
  this.isIoNode = isIoNode;
  Object.defineProperty(this.prototype, 'isIoNode', {value: isIoNode});

  proto = this.prototype;

  Object.defineProperty(proto, '__protochain', {value: protochain});
  Object.defineProperty(proto, '__protoProperties', {value: new ProtoProperties(protochain)});
  Object.defineProperty(proto, '__protoListeners', {value: new ProtoListeners(protochain)});

  const functions = new Set();
  for (let i = protochain.length; i--;) {
    const names = Object.getOwnPropertyNames(protochain[i]);
    for (let j = 0; j < names.length; j++) {
      if (names[j] === 'constructor') continue;
      const p = Object.getOwnPropertyDescriptor(protochain[i], names[j]);
      if (p.get || p.set) continue;
      if (typeof protochain[i][names[j]] === 'function') {
        if (names[j].startsWith('_') || names[j].startsWith('on')) {
          functions.add(names[j]);
        }
      }
    }
  }
  Object.defineProperty(proto, '__functions', {value: [...functions]});

  Object.defineProperty(proto, '__observedProps', {value: []});
  // const ignore = [Boolean, String, Number, HTMLElement, Function, undefined];
  for (let p in proto.__protoProperties) {
    if (proto.__protoProperties[p].observe) proto.__observedProps.push(p);
  }

  for (let p in proto.__protoProperties) {
    Object.defineProperty(proto, p, {
      get: function() { return this.__properties.get(p); },
      set: function(value) { this.__properties.set(p, value); },
      enumerable: !!proto.__protoProperties[p].enumerable,
      configurable: true,
    });
  }
};

IoNodeMixin.Register = Register;

const importedPaths = {};

// TODO: document and test
const preThrottleQueue = new Array();
const throttleQueue = new Array();
const argQueue = new WeakMap();
//
const funcQueue = new Array();

const animate = function() {
  requestAnimationFrame(animate);
  for (let i = preThrottleQueue.length; i--;) {
    preThrottleQueue.splice(preThrottleQueue.indexOf(preThrottleQueue[i]), 1);
  }
  for (let i = throttleQueue.length; i--;) {
    const queue = argQueue.get(throttleQueue[i]);
    for (let p = queue.length; p--;) {
      throttleQueue[i](queue[p]);
      queue.splice(queue.indexOf(p), 1);
    }
    throttleQueue.splice(throttleQueue.indexOf(throttleQueue[i]), 1);
  }
  //
  for (let i = funcQueue.length; i--;) {
    const func = funcQueue[i];
    funcQueue.splice(funcQueue.indexOf(func), 1);
    func();
  }
};
requestAnimationFrame(animate);

function requestAnimationFrameOnce(func) {
  if (funcQueue.indexOf(func) === -1) funcQueue.push(func);
}

/**
  * IoNodeMixin applied to `Object` class.
  */
export class IoNode extends IoNodeMixin(Object) {}
