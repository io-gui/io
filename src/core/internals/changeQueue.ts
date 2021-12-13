import {IoNode} from '../io-node.js';

/**
 * Property change FIFO queue.
 * Responsible for dispatching change events and invoking change handler functions with property change payloads.
 */
export class ChangeQueue {
  private readonly __node: IoNode;
  private readonly __changes: Array<Change> = [];
  private __dispatching = false;
  /**
   * Creates change queue for the specified owner instance of `IoNode`.
   * @param {IoNode} node - Owner node.
   */
  constructor(node: IoNode) {
    this.__node = node;
    Object.defineProperty(this, '__node',        {enumerable: false, writable: false});
    Object.defineProperty(this, '__changes',     {enumerable: false, writable: false});
    Object.defineProperty(this, '__dispatching', {enumerable: false});
  }
  /**
   * Adds property change payload to the queue by specifying property name, previous and the new value.
   * If the change is already in the queue, the new value is updated in-queue.
   * @param {string} property - Property name.
   * @param {any} value Property value.
   * @param {any} oldValue Old property value.
   */
  queue(property: string, value: any, oldValue: any) {
    debug: {
      if (value === oldValue) console.warn('ChangeQueue: queuing change with same value and oldValue!');
    }
    const i = this.__changes.findIndex(change => change.property === property);
    if (i === -1) {
      this.__changes.push(new Change(property, value, oldValue));
    } else {
      this.__changes[i].value = value;
    }
  }
  /**
   * Dispatches and clears the queue.
   * For each property change in the queue:
   *  - It fires the `'[propName]-changed'` `ChangeEvent` from the owner node with `Change` data as `event.detail`.
   *  - It executes node's `[propName]Changed(change)` change handler function if it is defined.
   * If owner node is not connected dispatch is aborted.
   * After all changes are dispatched it invokes `.applyCompose()` and `.changed()` functions od the owner node instance.
   */
  dispatch() {
    if (this.__dispatching === true || !this.__node.__connected) return;

    this.__dispatching = true;
    let changed = false;

    while (this.__changes.length) {
      // TODO: convert to FIFO
      const i = this.__changes.length - 1;
      // const i = 0;
      const change = this.__changes[i];
      this.__changes.splice(i, 1);
      const property = change.property;
      if (change.value !== change.oldValue) {
        changed = true;
        if (this.__node[property + 'Changed']) this.__node[property + 'Changed'](change);
        this.__node.dispatchEvent(property + '-changed', change);
      }
    }

    if (changed) {
      this.__node.applyCompose();
      this.__node.changed();
    }

    this.__dispatching = false;
  }
  /**
   * Clears the queue and removes the node reference.
   * Use this when node queue is no longer needed.
   */
  dispose() {
    this.__changes.length = 0;
    delete (this as any).__node;
    delete (this as any).__changes;
  }
}

/**
 * Property change payload
 */
 export class Change {
  property: string;
  value: any;
  oldValue: any;
  /**
   * Creates property change payload.
   * @param {string} property - Property name.
   * @param {*} value - New property value.
   * @param {*} oldValue - Old property value.
   */
  constructor(property: string, value: any, oldValue: any) {
    this.property = property;
    this.value = value;
    this.oldValue = oldValue;
  }
}

export interface ChangeEvent extends CustomEvent {
  readonly target: EventTarget,
  readonly detail: Change;
  readonly path: EventTarget[];
}