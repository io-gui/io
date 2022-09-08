import { IoNode } from '../io-node.js';
/**
 * Property binding class.
 * It facilitates data binding between source node/property and target nodes/properties
 * using `[property]-changed` events.
 */
export declare class Binding {
    readonly node: IoNode;
    readonly property: string;
    readonly targets: Array<EventTarget>;
    readonly targetProperties: WeakMap<EventTarget, string[]>;
    /**
     * Creates a binding object for specified `node` and `property`.
     * @param {IoNode} node - Property owner node
     * @param {string} property - Name of the property
     */
    constructor(node: IoNode, property: string);
    set value(value: any);
    get value(): any;
    /**
     * Adds a target `node` and `targetProp` and corresponding `[property]-changed` listener, unless already added.
     * @param {IoNode} node - Target node
     * @param {string} property - Target property
     */
    addTarget(node: IoNode, property: string): void;
    /**
     * Removes target `node` and `property` and corresponding `[property]-changed` listener.
     * If `property` is not specified, it removes all target properties.
     * @param {IoNode} node - Target node
     * @param {string} property - Target property
     */
    removeTarget(node: IoNode, property?: string): void;
    /**
     * Retrieves a list of target properties for specified target node.
     * @param {IoNode} node - Target node.
     * @return {Array.<string>} list of target property names.
     */
    private getTargetProperties;
    /**
     * Event handler that updates source property when one of the targets emits `[property]-changed` event.
     * @param {ChangeEvent} event - Property change event.
     */
    private onTargetChanged;
    /**
     * Event handler that updates bound properties on target nodes when source node emits `[property]-changed` event.
     * @param {ChangeEvent} event - Property change event.
     */
    private onSourceChanged;
    /**
     * Dispose of the binding by removing all targets and listeners.
     * Use this when node is no longer needed.
     */
    dispose(): void;
}
//# sourceMappingURL=binding.d.ts.map