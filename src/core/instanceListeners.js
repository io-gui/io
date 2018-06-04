// Creates a list of listeners passed to element instance as arguments.
export class InstanceListeners {
  setListeners(props) {
    for (let l in props['listeners']) {
      this[l] = props['listeners'][l];
    }
  }
  connect(element) {
    for (let i in this) {
      let listener = typeof this[i] === 'function' ? this[i] : element[this[i]];
      element.addEventListener(i, listener);
    }
  }
  disconnect(element) {
    for (let i in this) {
      let listener = typeof this[i] === 'function' ? this[i] : element[this[i]];
      element.removeEventListener(i, listener);
    }
  }
}
