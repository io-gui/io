import { ChangeEvent } from './ChangeQueue.js';
import { Node } from '../nodes/Node.js';
import { IoElement } from '../elements/IoElement.js';
type Properties = string[];
type TargetProperties = WeakMap<Node | IoElement, Properties>;
/**
 * This class is used internally by the framework to enable two-way data synchronization between reactive properties.
 * It manages bindings between a source node's reactive property and one or more target nodes and reactive properties.
 * It uses hub-and-spoke pub/sub event system and maintains data consistency by automatically propagating changes to all bound nodes and properties.
 *
 * Key features:
 * - Listens for `[propName]-changed` events to detect changes
 * - Supports one-to-many property bindings
 * - Prevents circular update loops
 * - Automatically cleans up listeners when disposed
 *
 * @example
 * const binding = new Binding<number>(nodeA, 'value');
 * binding.addTarget(nodeB, 'value');
 */
export declare class Binding<T extends unknown> {
    readonly node: Node | IoElement;
    readonly property: string;
    readonly targets: Array<Node | IoElement>;
    readonly targetProperties: TargetProperties;
    /**
     * Creates a binding object for specified source `node` and `property`.
     * It attaches a `[propName]-changed` listener to the source node.
     * @param {Node | IoElement} node - Source node
     * @param {string} property - Name of the sourceproperty
     */
    constructor(node: Node | IoElement, property: string);
    set value(value: T);
    get value(): T;
    /**
     * Adds a target node and property.
     * Sets itself as the binding reference on the target `ReactivePropertyInstance`.
     * Adds a `[propName]-changed` listener to the target node.
     * @param {Node | IoElement} target - Target node
     * @param {string} property - Target property
     */
    addTarget(target: Node | IoElement, property: string): void;
    /**
     * Removes target node and property.
     * If `property` is not specified, it removes all target properties.
     * Removes binding reference from the target `ReactivePropertyInstance`.
     * Removes `[propName]-changed` listener from the target node.
     * @param {Node | IoElement} target - Target node
     * @param {string} property - Target property
     */
    removeTarget(target: Node | IoElement, property?: string): void;
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
     * @param {Node | IoElement} target - Target node.
     * @return {Properties} list of target property names.
     */
    getTargetProperties(target: Node | IoElement): Properties;
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
//# sourceMappingURL=Binding.d.ts.map