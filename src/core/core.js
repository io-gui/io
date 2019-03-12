import {Bindings} from "./bindings.js";
import {Listeners} from "./listeners.js";
import {Properties} from "./properties.js";
import {Queue} from "./queue.js";

// TODO: Documentation and tests

export const IoCoreMixin = (superclass) => class extends superclass {
  static get properties() {
    return {};
  }
  get bindings() {
    return;
  }
  constructor(initProps = {}) {
    super();
    if (!this.constructor.prototype.__registered) this.constructor.Register();

    Object.defineProperty(this, '__queue', {value: new Queue(this)});
    Object.defineProperty(this, '__bindings', {value: new Bindings(this)});
    Object.defineProperty(this, '__properties', {value: this.__properties.clone(this)});
    Object.defineProperty(this, '__listeners', {value: this.__listeners.clone(this)});

    for (let i = 0; i < this.__functions.length; i++) {
      this[this.__functions[i]] = this[this.__functions[i]].bind(this);
    }

    this.__listeners.setPropListeners(initProps, this);

    if (this.bindings) this.bindNodes(this.bindings);

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
  bind(prop) {
    return this.__bindings.get(prop);
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
      const oldValue = this.__properties[p].value;
      this.__properties.set(p, props[p]);
      const value = this.__properties[p].value;
      if (value !== oldValue) this.queue(p, value, oldValue);
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
  bindNodes(nodes) {
    for (let n in nodes) {
      const properties = nodes[n];
      this[n].setProperties(properties);
      this.addEventListener(n + '-changed', (event) => {
        if (event.detail.oldValue) event.detail.oldValue.dispose(); // TODO: test
        event.detail.value.setProperties(properties);
      });
    }
  }
  onObjectMutation(event) {
    for (let i = this.__objectProps.length; i--;) {
      const prop = this.__objectProps[i];
      const value = this.__properties[prop].value;
      if (value === event.detail.object) {
        if (this[prop + 'Mutated']) this[prop + 'Mutated'](event);
        this.changed();
        return;
      }
    }
  }
  connectedCallback() {
    this.__listeners.connect();
    this.__properties.connect();
    this.__connected = true;
    if (this.__objectProps.length) {
      window.addEventListener('object-mutated', this.onObjectMutation);
    }
    this.queueDispatch();
  }
  disconnectedCallback() {
    this.__listeners.disconnect();
    this.__properties.disconnect();
    this.__connected = false;
    if (this.__objectProps.length) {
      window.removeEventListener('object-mutated', this.onObjectMutation);
    }
  }
  dispose() {
    this.__queue.dispose();
    this.__bindings.dispose();
    this.__listeners.dispose();
    this.__properties.dispose();
  }
  addEventListener(type, listener) {
    this.__listeners.addEventListener(type, listener);
  }
  removeEventListener(type, listener) {
    this.__listeners.removeEventListener(type, listener);
  }
  dispatchEvent(type, detail, bubbles, src) {
    this.__listeners.dispatchEvent(type, detail, bubbles, src);
  }
  queue(prop, value, oldValue) {
    this.__queue.queue(prop, value, oldValue);
  }
  queueDispatch() {
    this.__queue.dispatch();
  }
};

IoCoreMixin.Register = function () {
  Object.defineProperty(this.prototype, '__registered', {value: true});

  const protochain = [];
  let proto = this.prototype;
  while (proto && proto.constructor !== HTMLElement && proto.constructor !== Object) {
    protochain.push(proto); proto = proto.__proto__;
  }
  Object.defineProperty(this.prototype, 'isElement', {value: proto.constructor === HTMLElement});
  Object.defineProperty(this.prototype, '__protochain', {value: protochain});


  Object.defineProperty(this.prototype, '__properties', {value: new Properties(this.prototype.__protochain)});
  Object.defineProperty(this.prototype, '__listeners', {value: new Listeners(this.prototype.__protochain)});

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
  for (let prop in this.prototype.__properties) {
    let type = this.prototype.__properties[prop].type;
    if (ignore.indexOf(type) == -1) this.prototype.__objectProps.push(prop);
  }

  for (let prop in this.prototype.__properties) {
    const isPublic = prop.charAt(0) !== '_';
    const isEnumerable = !(this.prototype.__properties[prop].enumerable === false);
    Object.defineProperty(this.prototype, prop, {
      get: function() {
        return this.__properties[prop].value;
      },
      set: function(value) {
        if (this.__properties[prop].value === value) return;
        const oldValue = this.__properties.get(prop);
        this.__properties.set(prop, value);
        value = this.__properties.get(prop);
        if (isPublic && this.__connected) {
          this.queue(prop, value, oldValue);
          this.queueDispatch();
        }
      },
      enumerable: isEnumerable && isPublic,
      configurable: true,
    });
  }
};

export class IoCore extends IoCoreMixin(Object) {}

IoCore.Register = IoCoreMixin.Register;
