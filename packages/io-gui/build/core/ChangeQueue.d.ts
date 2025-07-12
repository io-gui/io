import { Node } from '../nodes/Node.js';
import { IoElement } from '../elements/IoElement.js';
export interface Change {
    property: string;
    value: any;
    oldValue: any;
}
export interface Changes {
    [property: string]: Change;
}
export interface ChangeEvent extends Omit<CustomEvent<Change>, 'target'> {
    readonly target: Node | IoElement;
    readonly detail: Change;
    readonly path: Node[];
}
/**
 * This class is used internally by the framework to manage property changes in `Node` and `IoElement` nodes.
 *
 * This class implements a First-In-First-Out (FIFO) queue that:
 * - Collects property changes and their associated values
 * - Coalesces multiple changes to the same property
 * - Dispatches change events (e.g., '[propName]-changed')
 * - Invokes corresponding change handlers (e.g., [propName]Changed())
 * - Triggers a final 'changed()' handler after processing all changes
 * - Dispatches a final 'io-object-mutation' event for associated node.
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
export declare class ChangeQueue {
    readonly node: Node | IoElement;
    readonly changes: Change[];
    dispatchedChange: boolean;
    dispatching: boolean;
    /**
     * Creates change queue for the specified owner instance of `Node`.
     * @param {Node} node - Owner node.
     */
    constructor(node: Node | IoElement);
    /**
     * Adds property change payload to the queue by specifying property name, previous and the new value.
     * If the change is already in the queue, the new value is updated in-queue.
     * If the new value is the same as the original value, the change is removed from the queue.
     * @param {string} property - Property name.
     * @param {any} value Property value.
     * @param {any} oldValue Old property value.
     */
    queue(property: string, value: any, oldValue: any): void;
    /**
     * Dispatches and clears the queue.
     * For each property change in the queue:
     *  - It executes node's `[propName]Changed(change)` change handler function if it is defined.
     *  - It fires the `'[propName]-changed'` `ChangeEvent` from the owner node with `Change` data as `event.detail`.
     * After all changes are dispatched it invokes `.changed()` function of the owner node instance and fires `'changed'` event.
     */
    dispatch(): void;
    /**
     * Clears the queue and removes the node reference for garbage collection.
     * Use this when node queue is no longer needed.
     */
    dispose(): void;
}
//# sourceMappingURL=ChangeQueue.d.ts.map