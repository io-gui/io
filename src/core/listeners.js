// TODO: Documentation and tests

export class Listeners {
  constructor(protochain = {}, instance) {
    for (let i = protochain.length; i--;) {
      const prop = protochain[i].constructor.listeners;
      for (let j in prop) this[j] = prop[j];
    }
    Object.defineProperty(this, 'instance', {value: instance});
    Object.defineProperty(this, 'propListeners', {value: {}});
    Object.defineProperty(this, 'activeListeners', {value: {}});
  }
  clone(instance) {
    const listeners = new Listeners({}, instance);
    for (let prop in this) listeners[prop] = this[prop];
    return listeners;
  }
  setPropListeners(props) {
    for (let l in this.propListeners) delete this.propListeners[l];
    for (let l in props) {
      if (l.startsWith('on-')) {
        this.propListeners[l.slice(3, l.length)] = props[l];
      }
    }
  }
  connect() {
    const instance = this.instance;
    const propListeners = this.propListeners;
    for (let i in this) {
      const listener = typeof this[i] === 'function' ? this[i] : instance[this[i]];
      instance.addEventListener(i, listener);
    }
    for (let i in propListeners) {
      const listener = typeof propListeners[i] === 'function' ? propListeners[i] : instance[propListeners[i]];
      instance.addEventListener(i, listener);
    }
  }
  disconnect() {
    const instance = this.instance;
    const propListeners = this.propListeners;
    for (let i in this) {
      const listener = typeof this[i] === 'function' ? this[i] : instance[this[i]];
      instance.removeEventListener(i, listener);
    }
    for (let i in propListeners) {
      const listener = typeof propListeners[i] === 'function' ? propListeners[i] : instance[propListeners[i]];
      instance.removeEventListener(i, listener);
    }
  }
  dispose() {
    this.disconnect();
    const instance = this.instance;
    const active = this.activeListeners;
    for (let i in active) {
      for (let j = active[i].length; j--;) {
        if (instance instanceof HTMLElement) HTMLElement.prototype.removeEventListener.call(instance, i, active[i][j]);
        active[i].splice(j, 1);
      }
    }
  }
  addEventListener(type, listener) {
    const instance = this.instance;
    const active = this.activeListeners;
    active[type] = active[type] || [];
    const i = active[type].indexOf(listener);
    if (i === - 1) {
      if (instance instanceof HTMLElement) HTMLElement.prototype.addEventListener.call(instance, type, listener);
      active[type].push(listener);
    }
  }
  removeEventListener(type, listener) {
    const instance = this.instance;
    const active = this.activeListeners;
    if (active[type] !== undefined) {
      const i = active[type].indexOf(listener);
      if (i !== - 1) {
        if (instance instanceof HTMLElement) HTMLElement.prototype.removeEventListener.call(instance, type, listener);
        active[type].splice(i, 1);
      }
    }
  }
  dispatchEvent(type, detail = {}, bubbles = true, src = this.instance) {
    if (src instanceof HTMLElement || src === window) {
      HTMLElement.prototype.dispatchEvent.call(src, new CustomEvent(type, {type: type, detail: detail, bubbles: bubbles, composed: true}));
    } else {
      const active = this.activeListeners;
      if (active[type] !== undefined) {
        const array = active[type].slice(0);
        for (let i = 0; i < array.length; i ++) {
          array[i].call(src, {detail: detail, target: src, path: [src]});
          // TODO: consider bubbling
        }
      }
    }
  }
}
