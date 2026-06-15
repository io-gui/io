import { isReactiveOwner } from './ReactiveCore.js';
/**
 * FIFO property-change queue for {@link ReactiveNode} and {@link IoElement}.
 * Coalesces repeated writes to the same property, then dispatches handlers and events.
 */
export class ChangeQueue {
    #changes = new Map();
    dispatchedChange = false;
    dispatching = false;
    /**
     * Creates change queue for the specified owner instance of `ReactiveNode`.
     * @param {ReactiveNode} node - Owner node.
     */
    constructor(node) {
        this.node = node;
        Object.defineProperty(this, 'dispatch', {
            value: this.dispatch.bind(this),
            enumerable: false,
            writable: false,
            configurable: false,
        });
    }
    get changes() {
        return [...this.#changes.values()];
    }
    /**
     * Queues a property change; coalesces by property name and cancels when value equals original oldValue.
     */
    queue(property, value, oldValue) {
        debug: if (value === oldValue) {
            console.warn('ChangeQueue: queuing change with same value and oldValue!');
        }
        const existing = this.#changes.get(property);
        if (!existing) {
            this.#changes.set(property, { property, value, oldValue });
        }
        else if (value === existing.oldValue) {
            this.#changes.delete(property);
        }
        else {
            existing.value = value;
        }
    }
    /** Dispatches queued changes, invokes handlers, then `changed()` and mutation dispatch. */
    dispatch() {
        if (this.dispatching === true) {
            debug: console.error('ChangeQueue: dispatching already in progress!');
            return;
        }
        this.dispatching = true;
        const properties = this.#dispatchQueuedChanges();
        this.#changes.clear();
        if (this.dispatchedChange) {
            this.#invokeChanged();
            this.#invokeMutation(properties);
        }
        this.dispatchedChange = false;
        this.dispatching = false;
    }
    #dispatchQueuedChanges() {
        const properties = [];
        let i = 0;
        let order = [...this.#changes.keys()];
        while (i < order.length) {
            const change = this.#changes.get(order[i]);
            if (change) {
                this.#processChange(change, properties);
            }
            i++;
            if (this.#changes.size > order.length) {
                order = [...this.#changes.keys()];
            }
        }
        return properties;
    }
    #processChange(change, properties) {
        const property = change.property;
        if (change.value === change.oldValue)
            return;
        this.dispatchedChange = true;
        const handlerName = property + 'Changed';
        const handler = this.node[handlerName];
        if (handler) {
            try {
                handler(change);
            }
            catch (error) {
                console.error(`Error in ${this.node.constructor.name}.${handlerName}():`, error);
            }
        }
        this.node.dispatch(property + '-changed', change);
        properties.push(property);
    }
    #invokeChanged() {
        try {
            this.node.changed();
        }
        catch (error) {
            console.error(`Error in ${this.node.constructor.name}.changed():`, error);
        }
    }
    #invokeMutation(properties) {
        if (isReactiveOwner(this.node)) {
            this.node.dispatchMutation(this.node, properties);
        }
    }
    /**
     * Clears the queue and removes the node reference for garbage collection.
     * Use this when node queue is no longer needed.
     */
    dispose() {
        this.#changes.clear();
        Object.defineProperty(this, 'changes', { value: undefined, configurable: true });
        delete this.node;
    }
}
//# sourceMappingURL=ChangeQueue.js.map