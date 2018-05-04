export class InstanceListeners {
  constructor(listeners, element) {
    Object.defineProperty(this, 'element', { value: element });
    this.set(listeners);
  }
  update(listeners) {
    //TODO: clean up!
    this.set(listeners);
  }
  set(listeners) {
    for (let l in listeners) {
      if (typeof listeners[l] === 'function') {
        this[l] = listeners[l];
      }
    }
    this.connect();
  }
  connect() {
    for (let l in this) {
      this.element.addEventListener(l, this[l]);
      // console.log(l, this.element);
    }
  }
  disconnect() {
    for (let l in this) {
      this.element.removeEventListener(l, this[l]);
    }
  }
}
