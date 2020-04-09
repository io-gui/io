/**
 * Manager for property change queue.
 * It is responsible for triggering both change events and change handler functions.
 */
class Queue {
  /**
   * Creates queue manager for specified instance of `IoNode`.
   * It should be constructed from within the `IoNode` constructor.
   * @param {IoNode} node - Reference to the owner node/element.
   */
  constructor(node) {
    Object.defineProperty(this, 'array', {value: new Array(), configurable: true});
    Object.defineProperty(this, 'node', {value: node, configurable: true});
  }
  /**
   * Adds property change to the queue by specifying property name, previous and the new value.
   * If the property change is already waiting in the queue, only the new value is updated in the queue.
   * @param {string} prop - Property name.
   * @param {*} value Property value.
   * @param {*} oldValue Old property value.
   */
  queue(prop, value, oldValue) {
    const i = this.array.indexOf(prop);
    if (i === -1) {
      this.array.push(prop, {property: prop, value: value, oldValue: oldValue});
    } else {
      this.array[i + 1].value = value;
    }
  }
  /**
   * Dispatches the queue and clears all the properties and values from the queue.
   * For each property change in the queue, `'[propName]-changed'` event will fire with queue payload.
   * In addition, if `[propName]Changed()` change handler is defined it will also execute.
   */
  dispatch() {
    if (this._dispatchInProgress === true) return;
    this._dispatchInProgress = true;

    const node = this.node;
    let changed = false;

    while (this.array.length) {
      const j = this.array.length - 2;
      const prop = this.array[j];
      const detail = this.array[j + 1];
      const payload = {detail: detail};

      if (detail.value !== detail.oldValue) {
        changed = true;
        if (node[prop + 'Changed']) node[prop + 'Changed'](payload);
        node.dispatchEvent(prop + '-changed', payload.detail);
      }
      this.array.splice(j, 2);
    }

    if (changed) node.dispatchChange();

    this.array.length = 0;
    this._dispatchInProgress = false;
  }
  /**
   * Remove queue items and the node reference.
   * Use this when node is no longer needed.
   */
  dispose() {
    this.array.length = 0;
    delete this.node;
    delete this.array;
  }
}

export { Queue };