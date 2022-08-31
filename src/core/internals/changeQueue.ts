import {IoNode} from '../io-node.js';

/**
 * Property change FIFO queue.
 * Responsible for dispatching change events and invoking change handler functions with property change payloads.
 */
export class ChangeQueue {
  private readonly node: IoNode;
  private readonly changes: Array<Change> = [];
  private dispatching = false;
  /**
   * Creates change queue for the specified owner instance of `IoNode`.
   * @param {IoNode} node - Owner node.
   */
  constructor(node: IoNode) {
    this.node = node;
    Object.defineProperty(this, 'node',        {enumerable: false, writable: false});
    Object.defineProperty(this, 'changes',     {enumerable: false, writable: false});
    Object.defineProperty(this, 'dispatching', {enumerable: false});
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
    const i = this.changes.findIndex(change => change.property === property);
    if (i === -1) {
      this.changes.push({property, value, oldValue});
    } else {
      this.changes[i].value = value;
    }
  }
  /**
   * Dispatches and clears the queue.
   * For each property change in the queue:
   *  - It fires the `'[propName]-changed'` `ChangeEvent` from the owner node with `Change` data as `event.detail`.
   *  - It executes node's `[propName]Changed(change)` change handler function if it is defined.
   * If owner node is not connected dispatch is aborted.
   * After all changes are dispatched it invokes `.changed()` functions od the owner node instance.
   */
  dispatch() {
    if (this.dispatching === true) return;
    this.dispatching = true;
    let changed = false;
    while (this.changes.length) {
      const change = this.changes[0];
      this.changes.splice(0, 1);
      const property = change.property;
      if (change.value !== change.oldValue) {
        changed = true;
        if (this.node[property + 'Changed']) this.node[property + 'Changed'](change);
        this.node.dispatchEvent(property + '-changed', change);
      }
    }
    if (changed) {
      this.node.changed();
    }
    this.dispatching = false;
  }
  /**
   * Clears the queue and removes the node reference.
   * Use this when node queue is no longer needed.
   */
  dispose() {
    this.changes.length = 0;
    delete (this as any).node;
    delete (this as any).changes;
  }
}

 export interface Change {
  property: string;
  value: any;
  oldValue: any;
}

export interface ChangeEvent extends CustomEvent {
  readonly target: EventTarget,
  readonly detail: Change;
  readonly path: EventTarget[];
}