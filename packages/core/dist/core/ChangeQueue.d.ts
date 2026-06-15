import type { ReactiveNode } from '../nodes/ReactiveNode.js';
import type { IoElement } from '../elements/IoElement.js';
export interface Change<T = unknown> {
    property: string;
    value: T;
    oldValue: T;
}
export interface Changes {
    [property: string]: Change;
}
export interface ChangeEvent extends Omit<CustomEvent<Change>, 'target'> {
    readonly target: ReactiveNode | IoElement;
    readonly detail: Change;
    readonly path: ReactiveNode[];
}
/**
 * FIFO property-change queue for {@link ReactiveNode} and {@link IoElement}.
 * Coalesces repeated writes to the same property, then dispatches handlers and events.
 */
export declare class ChangeQueue {
    #private;
    readonly node: ReactiveNode | IoElement;
    dispatchedChange: boolean;
    dispatching: boolean;
    /**
     * Creates change queue for the specified owner instance of `ReactiveNode`.
     * @param {ReactiveNode} node - Owner node.
     */
    constructor(node: ReactiveNode | IoElement);
    get changes(): Change[];
    /**
     * Queues a property change; coalesces by property name and cancels when value equals original oldValue.
     */
    queue(property: string, value: unknown, oldValue: unknown): void;
    /** Dispatches queued changes, invokes handlers, then `changed()` and mutation dispatch. */
    dispatch(): void;
    /**
     * Clears the queue and removes the node reference for garbage collection.
     * Use this when node queue is no longer needed.
     */
    dispose(): void;
}
