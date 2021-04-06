import { Node } from '../node.js';
export declare class Change {
    property: string;
    value: any;
    oldValue: any;
    /**
     * Creates property change payload.
     * @param {string} property - Property name.
     * @param {*} value - New property value.
     * @param {*} oldValue - Old property value.
     */
    constructor(property: string, value: any, oldValue: any);
}
export interface ChangeEvent extends CustomEvent {
    readonly target: EventTarget;
    readonly detail: Change;
}
/**
 * Property change LIFO queue responsible for dispatching change events and triggering change handler functions.
 */
export declare class ChangeQueue {
    private __node;
    private __changes;
    private __dispatching;
    /**
     * Creates change queue for the specified `Node`.
     * @param {Node} node - Owner node.
     */
    constructor(node: Node);
    /**
     * Adds property change to the queue by specifying property name, previous and the new value.
     * If the change is already in the queue, the new value is updated in-queue.
     * @param {string} property - Property name.
     * @param {any} value Property value.
     * @param {any} oldValue Old property value.
     */
    queue(property: string, value: any, oldValue: any): void;
    /**
     * Dispatches and clears the queue.
     * For each property change in the queue:
     *  - It fires the `'[propName]-changed'` `ChangeEvent` from the owner node with `Change` data as `event.detail`.
     *  - It executes node's `[propName]Changed(change)` change handler function if it is defined.
     * If owner node is not connected dispatch is aborted.
     * Changes with same `value` and `oldValue` are ignored.
     */
    dispatch(): void;
    /**
     * Clears the queue and removes the node reference.
     * Use this when node queue is no longer needed.
     */
    dispose(): void;
}
//# sourceMappingURL=changeQueue.d.ts.map