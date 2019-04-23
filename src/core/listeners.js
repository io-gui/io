// TODO: Documentation and tests

export class Listeners {
  constructor(protochain = {}, node) {
    for (let i = protochain.length; i--;) {
      const prop = protochain[i].constructor.listeners;
      for (let j in prop) this[j] = prop[j];
    }
    Object.defineProperty(this, 'node', {value: node});
    Object.defineProperty(this, 'propListeners', {value: {}});
    Object.defineProperty(this, 'activeListeners', {value: {}});
  }
  clone(node) {
    const listeners = new Listeners({}, node);
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
    const node = this.node;
    const propListeners = this.propListeners;
    for (let i in this) {
      const listener = typeof this[i] === 'function' ? this[i] : node[this[i]];
      node.addEventListener(i, listener);
    }
    for (let i in propListeners) {
      const listener = typeof propListeners[i] === 'function' ? propListeners[i] : node[propListeners[i]];
      node.addEventListener(i, listener);
    }
  }
  disconnect() {
    const node = this.node;
    const propListeners = this.propListeners;
    for (let i in this) {
      const listener = typeof this[i] === 'function' ? this[i] : node[this[i]];
      node.removeEventListener(i, listener);
    }
    for (let i in propListeners) {
      const listener = typeof propListeners[i] === 'function' ? propListeners[i] : node[propListeners[i]];
      node.removeEventListener(i, listener);
    }
  }
  dispose() {
    this.disconnect();
    const node = this.node;
    const active = this.activeListeners;
    for (let i in active) {
      for (let j = active[i].length; j--;) {
        if (node.isElement) HTMLElement.prototype.removeEventListener.call(node, i, active[i][j]);
        active[i].splice(j, 1);
      }
    }
  }
  addEventListener(type, listener) {
    const node = this.node;
    const active = this.activeListeners;
    active[type] = active[type] || [];
    const i = active[type].indexOf(listener);
    if (i === - 1) {
      if (node.isElement) HTMLElement.prototype.addEventListener.call(node, type, listener);
      active[type].push(listener);
    }
  }
  removeEventListener(type, listener) {
    const node = this.node;
    const active = this.activeListeners;
    if (active[type] !== undefined) {
      const i = active[type].indexOf(listener);
      if (i !== - 1) {
        if (node.isElement) HTMLElement.prototype.removeEventListener.call(node, type, listener);
        active[type].splice(i, 1);
      }
    }
  }
  dispatchEvent(type, detail = {}, bubbles = true, src = this.node) {
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
