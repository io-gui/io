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
     * @return {boolean} [properties.*.reflect] - Reflects to HTML attribute
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

      if (!this.constructor.prototype.__registered) this.constructor.Register();

      Object.defineProperty(this, '__nodeBindings', {value: new NodeBindings(this)});
      Object.defineProperty(this, '__nodeQueue', {value: new NodeQueue(this)});

      Object.defineProperty(this, '__properties', {value: new Properties(this, this.__protoProperties)});
      Object.defineProperty(this, '__listeners', {value: new Listeners(this, this.__protoListeners)});

      for (let i = 0; i < this.__functions.length; i++) {
        this[this.__functions[i]] = this[this.__functions[i]].bind(this);
      }

      this.__listeners.setPropListeners(initProps, this);

      // TODO: Test and documentation.
      if (this.compose) this.applyCompose(this.compose);

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
      */
    set(prop, value) {
      if (this[prop] !== value) {
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
        this.__properties.set(p, props[p]);
        const value = this.__properties[p].value;
        if (value !== oldValue) this.queue(p, value, oldValue);
      }

      // if (props['className']) {
      //   this.className = props['className'];
      // } else if (this.removeAttribute) {
      //   this.removeAttribute('className');
      // }

      if (props['style']) {
        for (let s in props['style']) {
          this.style[s] = props['style'][s];
          this.style.setProperty(s, props['style'][s]);
        }
      }
      if (this.__connected) this.queueDispatch();
    }
    // TODO: Document.
    // TODO: Refactor.
    // TODO: Test extensively.
    applyCompose(nodes) {
      for (let n in nodes) {
        const properties = nodes[n];
        this[n].setProperties(properties);
        this.addEventListener(n + '-changed', (event) => {
          // TODO: Test.
          if (event.detail.oldValue) event.detail.oldValue.dispose();
          event.detail.value.setProperties(properties);
        });
      }
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
  Object.defineProperty(this.prototype, '__registered', {value: true});

  const protochain = [];
  let proto = this.prototype;
  while (proto && proto.constructor !== HTMLElement && proto.constructor !== Object) {
    protochain.push(proto); proto = proto.__proto__;
  }
  Object.defineProperty(this.prototype, 'isNode', {value: proto.constructor !== HTMLElement});
  Object.defineProperty(this.prototype, 'isElement', {value: proto.constructor === HTMLElement});

  Object.defineProperty(this.prototype, '__protochain', {value: protochain});
  Object.defineProperty(this.prototype, '__protoProperties', {value: new ProtoProperties(this.prototype.__protochain)});
  Object.defineProperty(this.prototype, '__protoListeners', {value: new ProtoListeners(this.prototype.__protochain)});

  // TODO: Unhack (hack for three.js-controls)
  Object.defineProperty(this.prototype, '__properties', {value: this.prototype.__protoProperties});

  const functions = [];
  for (let i = this.prototype.__protochain.length; i--;) {
    const proto = this.prototype.__protochain[i];
    const names = Object.getOwnPropertyNames(proto);
    for (let j = 0; j < names.length; j++) {
      if (names[j] === 'constructor') continue;
      if (Object.getOwnPropertyDescriptor(proto, names[j]).get) continue;
      if (typeof proto[names[j]] !== 'function') continue;
      if (proto[names[j]].name === 'anonymous') continue;
      if (functions.indexOf(names[j]) === -1) functions.push(names[j]);
    }
  }
  Object.defineProperty(this.prototype, '__functions', {value: functions});

  Object.defineProperty(this.prototype, '__objectProps', {value: []});
  const ignore = [Boolean, String, Number, HTMLElement, Function, undefined];
  for (let prop in this.prototype.__protoProperties) {
    let type = this.prototype.__protoProperties[prop].type;
    if (prop !== '$') { // TODO: unhack
      if (ignore.indexOf(type) == -1) this.prototype.__objectProps.push(prop);
    }
  }

  for (let prop in this.prototype.__protoProperties) {
    const isPublic = prop.charAt(0) !== '_';
    const isEnumerable = !(this.prototype.__protoProperties[prop].enumerable === false);
    Object.defineProperty(this.prototype, prop, {
      get: function() {
        return this.__properties[prop].value;
      },
      set: function(value) {
        if (this.__properties[prop].value === value) return;
        const oldValue = this.__properties.get(prop);
        this.__properties.set(prop, value);
        value = this.__properties.get(prop);
        if (isPublic) {
          this.queue(prop, value, oldValue);
          if (this.__connected) {
            this.queueDispatch();
          }
        }
      },
      enumerable: isEnumerable && isPublic,
      configurable: true,
    });
  }
};

IoNodeMixin.Register = Register;

/**
  * IoNodeMixin applied to `Object` class.
  */
export class IoNode extends IoNodeMixin(Object) {}
