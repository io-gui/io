/**
 * Property change queue manager responsible for dispatching change events and triggering change handler functions.
 */
class Queue {
    /**
     * Creates queue manager for the specified `Node` instance.
     * @param {Node} node - Reference to the owner node/element.
     */
    constructor(node) {
        this.__dispatchInProgress = false;
        this.__node = node;
        this.__changes = [];
        Object.defineProperty(this, '__node', { enumerable: false, configurable: true });
        Object.defineProperty(this, '__changes', { enumerable: false, configurable: true });
        Object.defineProperty(this, '__dispatchInProgress', { enumerable: false, configurable: true });
    }
    /**
     * Adds property change to the queue by specifying property name, previous and the new value.
     * If the change is already in the queue, the new value is updated.
     * @param {string} property - Property name.
     * @param {any} value Property value.
     * @param {any} oldValue Old property value.
     */
    queue(property, value, oldValue) {
        const i = this.__changes.findIndex(change => change.property === property);
        if (i === -1) {
            this.__changes.push({ property: property, value: value, oldValue: oldValue });
        }
        else {
            this.__changes[i].value = value;
        }
    }
    /**
     * Dispatches and clears the queue.
     * For each property change in the queue, it fires the `'[propName]-changed'` event with `oldValue` and new `value` in `event.detail` payload.
     * It also executes node's `[propName]Changed(payload)` change handler function if it is defined.
     */
    dispatch() {
        if (this.__dispatchInProgress === true)
            return;
        const node = this.__node;
        if (!node.__connected)
            return;
        this.__dispatchInProgress = true;
        let changed = false;
        while (this.__changes.length) {
            const i = this.__changes.length - 1;
            const change = this.__changes[i];
            const property = change.property;
            if (change.value !== change.oldValue) {
                changed = true;
                if (node[property + 'Changed'])
                    node[property + 'Changed']({ detail: change });
                node.dispatchEvent(property + '-changed', change);
            }
            this.__changes.splice(i, 1);
        }
        if (changed) {
            node.applyCompose();
            node.changed();
        }
        this.__dispatchInProgress = false;
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
//# sourceMappingURL=queue.js.map