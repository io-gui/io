export const IoElementListenersMixin = (superclass) => class extends superclass {
  constructor() {
    super();
    Object.defineProperty(this, '__listeners', {value: {}});
  }
  addEventListener(type, listener) {
    this.__listeners[type] = this.__listeners[type] || [];
    let i = this.__listeners[type].indexOf(listener);
    if (i === -1) {
      this.__listeners[type].push(listener);
      HTMLElement.prototype.addEventListener.call(this, type, listener);
    }
  }
  hasEventListener(type, listener) {
    return this.__listeners[type] !== undefined && this.__listeners[type].indexOf(listener) !== -1;
  }
  removeEventListener(type, listener) {
    if (this.__listeners[type] !== undefined) {
      let i = this.__listeners[type].indexOf(listener);
      if (i !== -1) {
        this.__listeners[type].splice(i, 1);
        HTMLElement.prototype.removeEventListener.call(this, type, listener);
      }
    }
  }
  dispatchEvent(type, detail, bubbles = true, src = this) {
    HTMLElement.prototype.dispatchEvent.call(src, new CustomEvent(type, {
      detail: detail,
      bubbles: bubbles,
      composed: true
    }));
  }
};

export const IoNodeListenersMixin = (superclass) => class extends superclass {
  constructor() {
    super();
    Object.defineProperty(this, '__listeners', {value: {}});
  }
  addEventListener(type, listener) {
    this.__listeners[type] = this.__listeners[type] || [];
    let i = this.__listeners[type].indexOf(listener);
    if (i === - 1) {
      this.__listeners[type].push(listener);
    }
  }
  hasEventListener(type, listener) {
    return this.__listeners[type] !== undefined && this.__listeners[type].indexOf(listener) !== - 1;
  }
  removeEventListener(type, listener) {
    if (this.__listeners[type] !== undefined) {
      let i = this.__listeners[type].indexOf(listener);
      if (i !== - 1) {
        this.__listeners[type].splice(i, 1);
      }
    }
  }
  dispatchEvent(type, detail, bubbles, path) {
    if (this.__listeners[type] !== undefined) {
      let array = this.__listeners[type].slice(0);
      for (let i = 0, l = array.length; i < l; i ++) {
        path = path || [this];
        array[i].call(this, {detail: detail, target: this, bubbles: bubbles, path: path});
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
};
