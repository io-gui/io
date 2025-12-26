/**
 * This class is used internally by the framework to manage property changes in `Node` and `IoElement` nodes.
 *
 * This class implements a First-In-First-Out (FIFO) queue that:
 * - Collects property changes and their associated values
 * - Coalesces multiple changes to the same property
 * - Dispatches change events (e.g., '[propName]-changed')
 * - Invokes corresponding change handlers (e.g., [propName]Changed())
 * - Triggers a final 'changed()' handler after processing all changes
 * - Triggers a final 'dispatchMutation()' handler after processing all changes
 *
 * The queue helps optimize performance by batching multiple property changes
 * and preventing redundant updates when the same property changes multiple
 * times within a single execution cycle.
 *
 * @example
 * const node = new Node();
 * const changeQueue = new ChangeQueue(node);
 * changeQueue.queue('prop1', 1, 0);
 * changeQueue.queue('prop1', 2, 1);
 * changeQueue.dispatch();
 */
export class ChangeQueue {
    dispatchedChange = false;
    dispatching = false;
    /**
     * Creates change queue for the specified owner instance of `Node`.
     * @param {Node} node - Owner node.
     */
    constructor(node) {
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
    queue(property, value, oldValue) {
        debug: if (value === oldValue) {
            console.warn('ChangeQueue: queuing change with same value and oldValue!');
        }
        const i = this.changes.findIndex(change => change.property === property);
        if (i === -1) {
            this.changes.push({ property, value, oldValue });
        }
        else if (value === this.changes[i].oldValue) {
            this.changes.splice(i, 1);
        }
        else {
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
        const properties = [];
        while (this.changes.length) {
            const change = this.changes[0];
            this.changes.splice(0, 1);
            const property = change.property;
            if (change.value !== change.oldValue) {
                this.dispatchedChange = true;
                if (this.node[property + 'Changed'])
                    this.node[property + 'Changed'](change);
                this.node.dispatch(property + '-changed', change);
                properties.push(property);
            }
        }
        if (this.dispatchedChange) {
            this.node.changed();
            if (this.node._isNode) {
                this.node.dispatchMutation(this.node, properties);
            }
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
        delete this.node;
        delete this.changes;
    }
}
//# sourceMappingURL=ChangeQueue.js.map