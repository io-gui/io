import { ChangeEvent } from './ChangeQueue.js';
import { ReactiveNode } from '../nodes/ReactiveNode.js';
import { IoElement } from '../elements/IoElement.js';
type Properties = string[];
type TargetProperties = WeakMap<ReactiveNode | IoElement, Properties>;
/**
 * Hub-and-spoke two-way sync between reactive properties via `[propName]-changed` events.
 * @example binding.addTarget(nodeB, 'value')
 */
export declare class Binding<T = unknown> {
    readonly node: ReactiveNode | IoElement;
    readonly property: string;
    readonly targets: Set<ReactiveNode | IoElement>;
    readonly targetProperties: TargetProperties;
    constructor(node: ReactiveNode | IoElement, property: string);
    set value(value: T);
    get value(): T;
    /**
     * Adds a target node and property.
     * Sets itself as the binding reference on the target `ReactivePropertyInstance`.
     * Adds a `[propName]-changed` listener to the target node.
     * @param {ReactiveNode | IoElement} target - Target node
     * @param {string} property - Target property
     */
    addTarget(target: ReactiveNode | IoElement, property: string): void;
    /**
     * Removes target node and property.
     * If `property` is not specified, it removes all target properties.
     * Removes binding reference from the target `ReactivePropertyInstance`.
     * Removes `[propName]-changed` listener from the target node.
     * @param {ReactiveNode | IoElement} target - Target node
     * @param {string} property - Target property
     */
    removeTarget(target: ReactiveNode | IoElement, property?: string): void;
    /**
     * Event handler that updates source property when one of the targets emits `[propName]-changed` event.
     * @param {ChangeEvent} event - Property change event.
     */
    onTargetChanged(event: ChangeEvent): void;
    /**
     * Event handler that updates bound properties on target nodes when source node emits `[propName]-changed` event.
     * @param {ChangeEvent} event - Property change event.
     */
    onSourceChanged(event: ChangeEvent): void;
    /**
     * Returns a list of target properties for specified target node.
     * @param {ReactiveNode | IoElement} target - Target node.
     * @return {Properties} list of target property names.
     */
    getTargetProperties(target: ReactiveNode | IoElement): Properties;
    /**
     * Returns a JSON representation of the binding.
     * This is required for `JSON.stringify(protoProperties)` in `ProtoChain`.
     * @return {string} JSON representation of the binding.
     */
    toJSON(): {
        node: string;
        property: string;
        targets: string[];
        targetProperties: Properties[];
    };
    /**
     * Disposes the binding and removes all targets and listeners.
     */
    dispose(): void;
}
export {};
