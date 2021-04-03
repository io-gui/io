declare type Node = any;
/**
 * Property change queue manager responsible for dispatching change events and triggering change handler functions.
 */
declare class Queue {
    private __node;
    private __changes;
    private __dispatchInProgress;
    /**
     * Creates queue manager for the specified `Node` instance.
     * @param {Node} node - Reference to the owner node/element.
     */
    constructor(node: Node);
    /**
     * Adds property change to the queue by specifying property name, previous and the new value.
     * If the change is already in the queue, the new value is updated.
     * @param {string} property - Property name.
     * @param {any} value Property value.
     * @param {any} oldValue Old property value.
     */
    queue(property: string, value: any, oldValue: any): void;
    /**
     * Dispatches and clears the queue.
     * For each property change in the queue, it fires the `'[propName]-changed'` event with `oldValue` and new `value` in `event.detail` payload.
     * It also executes node's `[propName]Changed(payload)` change handler function if it is defined.
     */
    dispatch(): void;
    /**
     * Clears the queue and removes the node reference.
     * Use this when node queue is no longer needed.
     */
    dispose(): void;
}
export { Queue };
//# sourceMappingURL=queue.d.ts.map