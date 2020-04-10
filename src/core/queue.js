/**
 * Property change queue manager responsible for dispatching change events and triggering change handler functions.
 */
class Queue {
  /**
   * Creates queue manager for the specified `IoNode` instance.
   * @param {IoNode} node - Reference to the owner node/element.
   */
  constructor(node) {
    Object.defineProperty(this, '__array', {value: new Array(), configurable: true});
    Object.defineProperty(this, '__node', {value: node, configurable: true});
  }
  /**
   * Adds property change to the queue by specifying property name, previous and the new value.
   * If the change is already in the queue, the new value is updated.
   * @param {string} prop - Property name.
   * @param {*} value Property value.
   * @param {*} oldValue Old property value.
   */
  queue(prop, value, oldValue) {
    const i = this.__array.indexOf(prop);
    if (i === -1) {
      this.__array.push(prop, {property: prop, value: value, oldValue: oldValue});
    } else {
      this.__array[i + 1].value = value;
    }
  }
  /**
   * Dispatches and clears the queue.
   * For each property change in the queue, it fires the `'[propName]-changed'` event with `oldValue` and new `value` in `event.detail` payload.
   * It also executes node's `[propName]Changed(payload)` change handler function if it is defined.
   */
  dispatch() {
    if (this._dispatchInProgress === true) return;
    this._dispatchInProgress = true;

    const node = this.__node;
    let changed = false;

    while (this.__array.length) {
      const j = this.__array.length - 2;
      const prop = this.__array[j];
      const detail = this.__array[j + 1];
      const payload = {detail: detail};

      if (detail.value !== detail.oldValue) {
        changed = true;
        if (node[prop + 'Changed']) node[prop + 'Changed'](payload);
        node.dispatchEvent(prop + '-changed', payload.detail);
      }
      this.__array.splice(j, 2);
    }

    if (changed) node.dispatchChange();

    this.__array.length = 0;
    this._dispatchInProgress = false;
  }
  /**
   * Clears the queue and removes the node reference.
   * Use this when node queue is no longer needed.
   */
  dispose() {
    this.__array.length = 0;
    delete this.__node;
    delete this.__array;
  }
}

export { Queue };