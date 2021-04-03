/**
 * Property change queue manager responsible for dispatching change events and triggering change handler functions.
 */
class Queue {
  /**
   * Creates queue manager for the specified `Node` instance.
   * @param {Node} node - Reference to the owner node/element.
   */
   __changes: Array<any> = [];
   __node: any;
   _dispatchInProgress: boolean = false;

   constructor(node: any) {
    Object.defineProperty(this, '__changes', {enumerable: false, configurable: true, value: []});
    Object.defineProperty(this, '__node', {enumerable: false, configurable: true, value: node});
  }
  /**
   * Adds property change to the queue by specifying property name, previous and the new value.
   * If the change is already in the queue, the new value is updated.
   * @param {string} prop - Property name.
   * @param {*} value Property value.
   * @param {*} oldValue Old property value.
   */
  queue(prop: string, value: any, oldValue: any) {
    const i = this.__changes.indexOf(prop);
    if (i === -1) {
      this.__changes.push(prop, {property: prop, value: value, oldValue: oldValue});
    } else {
      this.__changes[i + 1].value = value;
    }
  }
  /**
   * Dispatches and clears the queue.
   * For each property change in the queue, it fires the `'[propName]-changed'` event with `oldValue` and new `value` in `event.detail` payload.
   * It also executes node's `[propName]Changed(payload)` change handler function if it is defined.
   */
  dispatch() {
    if (this._dispatchInProgress === true) return;
    if (!this.__node.__connected) return;
    this._dispatchInProgress = true;

    const node = this.__node;
    let changed = false;

    while (this.__changes.length) {
      const j = this.__changes.length - 2;
      const prop = this.__changes[j];
      const detail = this.__changes[j + 1];
      const payload = {detail: detail};

      if (detail.value !== detail.oldValue) {
        changed = true;
        if (node[prop + 'Changed']) node[prop + 'Changed'](payload);
        node.dispatchEvent(prop + '-changed', payload.detail);
      }
      this.__changes.splice(j, 2);
    }

    if (changed) node.dispatchChange();

    this._dispatchInProgress = false;

    // TODO: It is possible that an effect of change adds additional items to the queue
    // TODO: Test and document!
    // this.__changes.length = 0;
    if (this.__changes.length) {
      this.dispatch();
      return;
    }
  }
  /**
   * Clears the queue and removes the node reference.
   * Use this when node queue is no longer needed.
   */
  dispose() {
    this.__changes.length = 0;
    delete this.__node;
    delete this.__changes;
  }
}

export { Queue };