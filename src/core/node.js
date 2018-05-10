import {Binding} from "./binding.js";

export class Node {
  constructor(props = {}, element) {
    Object.defineProperty(this, 'element', { value: element });

    this.properties = {};
    this.bindings = {};
    this.listeners = {};
    this.attributes = {};

    Object.defineProperty(this, '_connected', { value: false, writable: true });
    Object.defineProperty(this, '_connectedListeners', { value: {} });
    Object.defineProperty(this, '_setAttributes', { value: {} });
    Object.defineProperty(this, '_boundProperties', { value: {} });
    Object.defineProperty(this, '_srcBindings', { value: {} });
    Object.defineProperty(this, '_triggeredObservers', { value: [] });

    this.update(props);
  }
  update(props) {

    this.properties = {};
    this.bindings = {};
    this.listeners = {};
    this.attributes = {};

    for (let p in props) {
      if (this.element.__state[p] === undefined) continue;
      if (props[p] instanceof Binding) {
        this.bindings[p] = props[p];
        this.properties[p] = props[p].source[props[p].sourceProp];
      } else {
        this.properties[p] = props[p];
      }
    }
    for (let l in props['listeners']) {
      this.listeners[l] = props['listeners'][l];
    }
    for (let a in props['attributes']) {
      this.attributes[a] = props['attributes'][a];
    }

    if (props['className']) {
      this.element.className = props['className'];
    }

    // TODO: use attributeStyleMap when implemented in browser
    // https://developers.google.com/web/updates/2018/03/cssom
    if (props['style']) {
      for (let s in props['style']) {
        this.element.style[s] = props['style'][s];
      }
    }

    this.setProperties();

    if (this._connected)  {
      this.connectListeners();
      this.triggerObservers();
      this.connectBindings();
      this.setAttributes();
    }
  }
  connect() {
    this.connectListeners();
    this.connectBindings();
    this.triggerObservers();
    this._connected = true;
  }
  disconnect() {
    this.disconnectListeners();
    this.disconnectBindings();
    this._connected = false;
  }
  connectListeners() {
    // TODO: test
    for (let l in this.listeners) {
      let handler = this.listeners[l];
      if (!this._connectedListeners[l]) {
        this.element.addEventListener(l, handler);
      } else if (this._connectedListeners[l] !== handler) {
        this.element.removeEventListener(l, this._connectedListeners[l]);
        this.element.addEventListener(l, handler);
      }
      this._connectedListeners[l] = handler;
    }
    for (let l in this._connectedListeners) {
      if (this.listeners[l] === undefined) {
        this.element.removeEventListener(l, this._connectedListeners[l]);
        delete this._connectedListeners[l];
      }
    }
  }
  disconnectListeners() {
    for (let l in this.listeners) {
      this.element.removeEventListener(l, this.element[this.listeners[l]]);
      delete this._connectedListeners[l];
    }
  }
  setAttributes() {
    // TODO: test
    for (let a in this.attributes) {
      let attrib = this.attributes[a];
      if (this._setAttributes[a] !== attrib) {
        this.element.initAttribute(a, attrib);
        this._setAttributes[a] = attrib;
      }
    }
    for (let a in this._setAttributes) {
      if (this.attributes[a] === undefined) {
        this.element.initAttribute(a, this.element.__protochain.attributes);
        delete this._setAttributes[a];
      }
    }
  }
  setProperties() {
    this._triggeredObservers.length = 0;
    this._triggeredObservers.push('update');

    for (let p in this.properties) {

      let value = this.properties[p];
      let oldValue = this.element.__state[p].value;

      this.element.__state[p].value = value;

      if (value !== oldValue) {
        if (this.element.__state[p].reflect) {
          this.element.reflectAttribute(p);
        }
        if (this.element.__state[p].observer) {
          if (this._triggeredObservers.indexOf(this.element.__state[p].observer) === -1) {
            this._triggeredObservers.push(this.element.__state[p].observer);
          }
        }
      }
    }
  }
  triggerObservers() {
    // TODO: test
    for (let j = 0; j < this._triggeredObservers.length; j++) {
      this.element[this._triggeredObservers[j]]();
    }
    this._triggeredObservers.length = 0;
  }
  connectBindings() {
    for (let b in this.bindings) {
      let binding = this.bindings[b];
      if (this._boundProperties[b] !== binding) {
        this.bindings[b].setTarget(this.element, b);
        this._boundProperties[b] = binding;
      }
    }
    for (let b in this._boundProperties) {
      if (this.bindings[b] === undefined) {
        this._boundProperties[b].removeTarget(this.element, b);
        delete this._boundProperties[b];
      }
    }
  }
  disconnectBindings() {
    for (let b in this._boundProperties) {
      this._boundProperties[b].removeTarget(this.element, b);
      delete this._boundProperties[b];
    }
  }
  bind(prop) {
    this._srcBindings[prop] = this._srcBindings[prop] || new Binding(this.element, prop);
    return this._srcBindings[prop];
  }
}
