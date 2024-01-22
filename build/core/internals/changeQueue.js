/**
 * Responsive property change FIFO queue.
 * Responsible for dispatching change events and invoking change handler functions with property change payloads.
 */
export class ChangeQueue {
    hasChanged = false;
    dispatching = false;
    /**
     * Creates change queue for the specified owner instance of `IoNode`.
     * @param {IoNode} node - Owner node.
     */
    constructor(node) {
        this.changes = [];
        this.node = node;
    }
    /**
     * Adds property change payload to the queue by specifying property name, previous and the new value.
     * If the change is already in the queue, the new value is updated in-queue.
     * @param {string} property - Property name.
     * @param {any} value Property value.
     * @param {any} oldValue Old property value.
     */
    queue(property, value, oldValue) {
        debug: {
            if (value === oldValue)
                console.warn('ChangeQueue: queuing change with same value and oldValue!');
        }
        const i = this.changes.findIndex(change => change.property === property);
        if (i === -1) {
            this.changes.push({ property, value, oldValue });
        }
        else {
            this.changes[i].value = value;
        }
    }
    /**
     * Dispatches and clears the queue.
     * For each property change in the queue:
     *  - It fires the `'[propName]-changed'` `ChangeEvent` from the owner node with `Change` data as `event.detail`.
     *  - It executes node's `[propName(change)` change handler function if it is defined.
     * After all changes are dispatched it invokes `.changed()` functions od the owner node instance.
     */
    dispatch() {
        if (this.dispatching === true)
            return;
        this.dispatching = true;
        this.hasChanged = false;
        while (this.changes.length) {
            const change = this.changes[0];
            this.changes.splice(0, 1);
            const property = change.property;
            if (change.value !== change.oldValue) {
                this.hasChanged = true;
                if (this.node[property + 'Changed'])
                    this.node[property + 'Changed'](change);
                this.node.dispatchEvent(property + '-changed', change);
            }
        }
        if (this.hasChanged) {
            this.node.changed();
            this.node.dispatchEvent('changed');
            this.node.dispatchMutationEvent(this.node);
        }
        this.dispatching = false;
    }
    /**
     * Clears the queue and removes the node reference.
     * Use this when node queue is no longer needed.
     */
    dispose() {
        this.changes.length = 0;
        delete this.node;
        delete this.changes;
    }
}
//# sourceMappingURL=changeQueue.js.map