import {NodeBindings} from "./bindings.js";
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
     * @return {Binding} [properties.*.binding] - Binding object.
     * @return {boolean} [properties.*.enumerable] - Makes property enumerable.
     */
    static get properties() {
      return {};
    }
    // TODO: refactor?
    get bindings() {
      return;
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

      for (let i = 0; i < this.__functions.length; i++) {
        this[this.__functions[i]] = this[this.__functions[i]].bind(this);
      }

      this.__listeners.setPropListeners(initProps, this);

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
          this[prop].__listeners.setPropListeners(compose[prop], this);
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
        const oldValue = this.__properties[p].value;
        this.__properties.set(p, props[p], true);
        const value = this.__properties[p].value;
        if (value !== oldValue) this.queue(p, value, oldValue);
      }

      // TODO: remove?
      if (props['style']) {
        for (let s in props['style']) {
          this.style[s] = props['style'][s];
          this.style.setProperty(s, props['style'][s]);
        }
      }
      if (this.__connected) this.queueDispatch();
    }
    /**
      * This function is called when `object-mutated` event is observed
      * and changed object is a property of the node.
      * @param {Object} event - Property change event.
      */
    _onObjectMutation(event) {
      for (let i = this.__objectProps.length; i--;) {
        const prop = this.__objectProps[i];
        const value = this.__properties[prop].value;
        if (value === event.detail.object) {
          // TODO: consider optimizing
          // setTimeout(()=> {
            if (this[prop + 'Mutated']) this[prop + 'Mutated'](event);
            this.changed();
            this.applyCompose();
          // });
          return;
        }
      }
    }
    /**
      * Callback when `IoNode` is connected.
      */
    connectedCallback() {
      this.__listeners.connect();
      this.__properties.connect();
      this.__connected = true;
      if (this.__objectProps.length) {
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
      if (this.__objectProps.length) {
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
      */
    addEventListener(type, listener) {
      this.__listeners.addEventListener(type, listener);
    }
    /**
      * Wrapper for removeEventListener.
      * @param {string} type - event name to listen to.
      * @param {function} listener - listener handler.
      */
    removeEventListener(type, listener) {
      this.__listeners.removeEventListener(type, listener);
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
      this.__nodeQueue.dispatch();
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
  Object.defineProperty(this.prototype, 'isNode', {value: proto.constructor !== HTMLElement});
  Object.defineProperty(this.prototype, 'isElement', {value: proto.constructor === HTMLElement});
  proto = this.prototype;

  Object.defineProperty(proto, '__protochain', {value: protochain});
  Object.defineProperty(proto, '__protoProperties', {value: new ProtoProperties(protochain)});
  Object.defineProperty(proto, '__protoListeners', {value: new ProtoListeners(protochain)});

  const functions = new Set();
  for (let i = protochain.length; i--;) {
    const names = Object.getOwnPropertyNames(protochain[i]);
    for (let j = 0; j < names.length; j++) {
      if (names[j].startsWith('_on') || names[j].startsWith('on')) functions.add(names[j]);
    }
  }
  Object.defineProperty(proto, '__functions', {value: [...functions]});

  Object.defineProperty(proto, '__objectProps', {value: []});
  const ignore = [Boolean, String, Number, HTMLElement, Function, undefined];
  for (let p in proto.__protoProperties) {
    const cfg = proto.__protoProperties[p];
    if (cfg.notify && ignore.indexOf(cfg.type) == -1) {
      proto.__objectProps.push(p);
    }
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

/**
  * IoNodeMixin applied to `Object` class.
  */
export class IoNode extends IoNodeMixin(Object) {}
