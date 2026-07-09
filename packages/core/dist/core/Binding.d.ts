import { ChangeEvent } from './ChangeQueue.js';
import { ReactiveNode } from './ReactiveCore.js';
type Fields = string[];
type TargetProperties = WeakMap<ReactiveNode, Fields>;
export declare function enterBindingWave(): void;
export declare function leaveBindingWave(): void;
export declare function noteBindingDirty(node: ReactiveNode): void;
/**
 * Hub-and-spoke two-way sync between reactive properties via `[propName]-changed` events.
 * @example binding.addTarget(nodeB, 'value')
 */
export declare class Binding<T = unknown> {
    readonly node: ReactiveNode;
    readonly property: string;
    readonly targets: Set<ReactiveNode>;
    readonly targetProperties: TargetProperties;
    constructor(node: ReactiveNode, property: string);
    set value(value: T);
    get value(): T;
    /**
     * Adds a target node and property.
     * Sets itself as the binding reference on the target `PropertyInstance`.
     * Adds a `[propName]-changed` listener to the target node.
     * @param {ReactiveNode} target - Target node
     * @param {string} property - Target property
     */
    addTarget(target: ReactiveNode, property: string): void;
    /**
     * Removes target node and property.
     * If `property` is not specified, it removes all target properties.
     * Removes binding reference from the target `PropertyInstance`.
     * Removes `[propName]-changed` listener from the target node.
     * @param {ReactiveNode} target - Target node
     * @param {string} property - Target property
     */
    removeTarget(target: ReactiveNode, property?: string): void;
    /**
     * Event handler that updates source property when one of the targets emits `[propName]-changed` event.
     * @param {ChangeEvent} event - Field change event.
     */
    onTargetChanged(event: ChangeEvent): void;
    /**
     * Settles the outbound binding closure into the open binding wave.
     * Nested under ChangeQueue.dispatch so parallel networks in one batch share a wave.
     * @param {ChangeEvent} event - Field change event.
     */
    onSourceChanged(event: ChangeEvent): void;
    /**
     * Returns a list of target properties for specified target node.
     * @param {ReactiveNode} target - Target node.
     * @return {Fields} list of target property names.
     */
    getTargetProperties(target: ReactiveNode): Fields;
    /**
     * Returns a JSON representation of the binding.
     * This is required for `JSON.stringify(protoProperties)` in `ProtoChain`.
     * @return {string} JSON representation of the binding.
     */
    toJSON(): {
        node: string;
        property: string;
        targets: string[];
        targetProperties: Fields[];
    };
    /**
     * Disposes the binding and removes all targets and listeners.
     */
    dispose(): void;
}
export {};
