import { ChangeEvent } from './ChangeQueue';
import { Node } from '../nodes/Node';
type Properties = string[];
type TargetProperties = WeakMap<Node, Properties>;
/**
 * Property binding class that enables two-way data synchronization between `Node` and `IoElement` nodes.
 *
 * It manages bindings between a source node's property and one or more target nodes and properties.
 * Using a hub-and-spoke pub/sub event system, it maintains data consistency by automatically propagating
 * changes to all bound nodes and properties.
 *
 * Key features:
 * - Listens for `[propName]-changed` events to detect changes
 * - Sets properties using `node.setProperty(propName, value)` method
 * - Supports one-to-many property bindings
 * - Prevents circular update loops
 * - Automatically cleans up listeners when disposed
 *
 * Note: `debug: {}` code blocks are used in dev/debug builds for sanity checks.
 * They print error messages if unexpected state is detected.
 * In theory, they should never be reached.
 *
 * @example
 * // Create a two-way binding between nodeA.value and nodeB.value
 * const binding = new Binding<number>(nodeA, 'value');
 * binding.addTarget(nodeB, 'value');
 */
export declare class Binding<T extends unknown> {
    readonly node: Node;
    readonly property: string;
    readonly targets: Node[];
    readonly targetProperties: TargetProperties;
    /**
     * Creates a binding object for specified source `node` and `property`.
     * It attaches a `[propName]-changed` listener to the source node.
     * @param {Node} node - Source node
     * @param {string} property - Name of the sourceproperty
     */
    constructor(node: Node, property: string);
    set value(value: T);
    get value(): T;
    /**
     * Returns a JSON representation of the binding.
     * This is required for `JSON.stringify(protoProperties)` in `ProtoChain` to work more accurately.
     * NOTE: this does not provide completely accurate signiture of the binding but it's good enough.
     * @return {string} JSON representation of the binding.
     */
    toJSON(): {
        node: string;
        property: string;
        targets: string[];
        targetProperties: Record<string, Properties>;
    };
    /**
     * Helper function to get target properties from WeakMap
     * Retrieves a list of target properties for specified target node.
     * @param {Node} target - Target node.
     * @return {Properties} list of target property names.
     */
    getTargetProperties(target: Node): Properties;
    /**
     * Adds a target node and property.
     * Sets itself as the binding reference on the target `ReactivePropertyInstance`.
     * Adds a `[propName]-changed` listener to the target node.
     * @param {Node} target - Target node
     * @param {string} property - Target property
     */
    addTarget(target: Node, property: string): void;
    /**
     * Removes target node and property.
     * If `property` is not specified, it removes all target properties.
     * Removes binding reference from the target `ReactivePropertyInstance`.
     * Removes `[propName]-changed` listener from the target node.
     * @param {Node} target - Target node
     * @param {string} property - Target property
     */
    removeTarget(target: Node, property?: string): void;
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
     * Dispose of the binding by removing all targets and listeners.
     * Use this when node is no longer needed.
     */
    dispose(): void;
}
export {};
//# sourceMappingURL=Binding.d.ts.map