/**
 * Property change queue manager responsible for dispatching change events and triggering change handler functions.
 */
declare class Queue {
    /**
     * Creates queue manager for the specified `Node` instance.
     * @param {Node} node - Reference to the owner node/element.
     */
    __changes: Array<any>;
    __node: any;
    _dispatchInProgress: boolean;
    constructor(node: any);
    /**
     * Adds property change to the queue by specifying property name, previous and the new value.
     * If the change is already in the queue, the new value is updated.
     * @param {string} prop - Property name.
     * @param {*} value Property value.
     * @param {*} oldValue Old property value.
     */
    queue(prop: string, value: any, oldValue: any): void;
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