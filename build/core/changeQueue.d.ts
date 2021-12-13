import { IoNode } from '../components/io-node.js';
/**
 * Property change FIFO queue.
 * Responsible for dispatching change events and invoking change handler functions with property change payloads.
 */
export declare class ChangeQueue {
    private readonly __node;
    private readonly __changes;
    private __dispatching;
    /**
     * Creates change queue for the specified owner instance of `IoNode`.
     * @param {IoNode} node - Owner node.
     */
    constructor(node: IoNode);
    /**
     * Adds property change payload to the queue by specifying property name, previous and the new value.
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
     * After all changes are dispatched it invokes `.applyCompose()` and `.changed()` functions od the owner node instance.
     */
    dispatch(): void;
    /**
     * Clears the queue and removes the node reference.
     * Use this when node queue is no longer needed.
     */
    dispose(): void;
}
/**
 * Property change payload
 */
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
    readonly path: EventTarget[];
}
//# sourceMappingURL=changeQueue.d.ts.map