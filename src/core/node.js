import {Binding} from "./binding.js";

export class Node {
  constructor(props = {}, element) {
    Object.defineProperty(this, 'element', { value: element });

    this.properties = {};
    this.bindings = {};
    this.listeners = {};

    Object.defineProperty(this, '_connected', { value: false, writable: true });
    Object.defineProperty(this, '_connectedListeners', { value: {} });
    Object.defineProperty(this, '_boundProperties', { value: {} });
    Object.defineProperty(this, '_srcBindings', { value: {} });

    this.update(props);
  }
  update(props) {

    this.properties = {};
    this.bindings = {};
    this.listeners = {};

    for (let p in props) {
      if (this.element.__props[p] === undefined) continue;
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
    // TODO: untangle this mess
    if (this._connected)  {
      this.connectListeners();
      this.connectBindings();
      this.element.triggerObservers();
      this.element.triggerNotifiers();
    }
    // if (this.element.__notifiers.length) {
    //   console.log(this.element, this.element.__notifiers);
    // }
  }
  connect() {
    if (!this._connected) {
      this.connectListeners();
      this.connectBindings();
      this.element.triggerObservers();
      this.element.triggerNotifiers();
    }
    this._connected = true;
  }
  disconnect() {
    if (this._connected) {
      this.disconnectListeners();
      this.disconnectBindings();
    }
    this._connected = false;
  }
  connectListeners() {
    // TODO: test
    for (let l in this.listeners) {
      if (!this._connectedListeners[l]) {
        this.element.addEventListener(l, this.listeners[l]);
      } else if (this._connectedListeners[l] !== this.listeners[l]) {
        this.element.removeEventListener(l, this._connectedListeners[l]);
        this.element.addEventListener(l, this.listeners[l]);
      }
      this._connectedListeners[l] = this.listeners[l];
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
  setProperties() {
    this.element.__observers.length = 0;
    this.element.__observers.push('update');

    this.element.__notifiers.length = 0;

    for (let p in this.properties) {

      let value = this.properties[p];
      let oldValue = this.element.__props[p].value;

      this.element.__props[p].value = value;

      if (value !== oldValue) {
        if (this.element.__props[p].reflect) {
          this.element.reflectAttribute(p);
        }
        if (this.element.__props[p].observer) {
          if (this.element.__observers.indexOf(this.element.__props[p].observer) === -1) {
            this.element.__observers.push(this.element.__props[p].observer);
          }
        }
        this.element.__notifiers.push(p + '-changed', {value: value, oldValue: oldValue});
      }
    }
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
