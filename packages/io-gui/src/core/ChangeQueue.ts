import { IoNode } from '../nodes/Node';

export interface Change {
  property: string;
  value: any;
  oldValue: any;
}

export interface Changes {
  [property: string]: Change;
}

export interface ChangeEvent extends Omit<CustomEvent<Change>, 'target'> {
  readonly target: IoNode;
  readonly detail: Change;
  readonly path: IoNode[];
}

/**
 * A queue system for managing and batching property changes in `IoNode` and `IoElement` nodes.
 *
 * This class implements a First-In-First-Out (FIFO) queue that:
 * - Collects property changes and their associated values
 * - Coalesces multiple changes to the same property
 * - Dispatches changes in order through events (e.g., '[propName]-changed')
 * - Invokes corresponding change handlers (e.g., [propName]Changed())
 * - Triggers a final 'changed()' handler after processing all changes
 * - Dispatches a final 'changed' event after processing all changes
 *
 * The queue helps optimize performance by batching multiple property changes
 * and preventing redundant updates when the same property changes multiple
 * times within a single execution cycle.
 */
export class ChangeQueue {
  declare readonly node: IoNode;
  declare readonly changes: Change[];
  dispatchedChange = false;
  dispatching = false;
  /**
   * Creates change queue for the specified owner instance of `IoNode`.
   * @param {IoNode} node - Owner node.
   */
  constructor(node: IoNode) {
    this.changes = [];
    this.node = node;
    Object.defineProperty(this, 'dispatch', {
      value: this.dispatch.bind(this),
      enumerable: false,
      writable: false,
      configurable: false,
    });
  }
  /**
   * Adds property change payload to the queue by specifying property name, previous and the new value.
   * If the change is already in the queue, the new value is updated in-queue.
   * If the new value is the same as the original value, the change is removed from the queue.
   * @param {string} property - Property name.
   * @param {any} value Property value.
   * @param {any} oldValue Old property value.
   */
  queue(property: string, value: any, oldValue: any) {
    debug: if (value === oldValue) {
      console.warn('ChangeQueue: queuing change with same value and oldValue!');
    }
    const i = this.changes.findIndex(change => change.property === property);
    if (i === -1) {
      this.changes.push({property, value, oldValue});
    } else if (value === this.changes[i].oldValue) {
      this.changes.splice(i, 1);
    } else {
      this.changes[i].value = value;
    }
  }
  /**
   * Dispatches and clears the queue.
   * For each property change in the queue:
   *  - It executes node's `[propName]Changed(change)` change handler function if it is defined.
   *  - It fires the `'[propName]-changed'` `ChangeEvent` from the owner node with `Change` data as `event.detail`.
   * After all changes are dispatched it invokes `.changed()` function of the owner node instance and fires `'changed'` event.
   */
  dispatch() {
    if (this.dispatching === true) {
      debug: console.error('ChangeQueue: dispatching already in progress!');
      return;
    }
    this.dispatching = true;
    while (this.changes.length) {
      const change = this.changes[0];
      this.changes.splice(0, 1);
      const property = change.property;
      if (change.value !== change.oldValue) {
        this.dispatchedChange = true;
        if (this.node[property + 'Changed']) this.node[property + 'Changed'](change);
        this.node.dispatchEvent(property + '-changed', change);
      }
    }
    if (this.dispatchedChange) {
      this.node.changed();
      this.node.dispatchEvent('object-mutated', {object: this.node});
    }
    this.dispatchedChange = false;
    this.dispatching = false;
  }
  /**
   * Clears the queue and removes the node reference for garbage collection.
   * Use this when node queue is no longer needed.
   */
  dispose() {
    this.changes.length = 0;
    delete (this as any).node;
    delete (this as any).changes;
  }
}