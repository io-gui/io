import { Properties } from './properties.js';
import { IoNode } from '../io-node.js';
/**
 * Binding object. It manages data binding between source and targets using `[property]-changed` events.
 */
export declare class Binding {
    private readonly __node;
    private readonly __property;
    private readonly __targets;
    private readonly __targetProperties;
    /**
     * Creates a binding object for specified `node` and `property`.
     * @param {IoNode} node - Property owner node.
     * @param {string} property - Name of the property.
     */
    constructor(node: IoNode, property: string);
    set value(value: any);
    get value(): any;
    /**
     * Adds a target `node` and `targetProp` and corresponding `[property]-changed` listener, unless already added.
     * @param {IoNode} node - Target node.
     * @param {string} property - Target property.
     * @param {Array.<string>} __nodeProperties - List of target property names.
     */
    addTarget(node: IoNode, property: string, __nodeProperties?: Properties): void;
    /**
     * Removes target `node` and `property` and corresponding `[property]-changed` listener.
     * If `property` is not specified, it removes all target properties.
     * @param {IoNode} node - Target node.
     * @param {string} property - Target property.
     */
    removeTarget(node: IoNode, property?: string): void;
    /**
     * Retrieves a list of target properties for specified target node.
     * @param {IoNode} node - Target node.
     * @return {Array.<string>} list of target property names.
     */
    private _getTargetProperties;
    /**
     * Event handler that updates source property when one of the targets emits `[property]-changed` event.
     * @param {ChangeEvent} event - Property change event.
     */
    private _onTargetChanged;
    /**
     * Event handler that updates bound properties on target nodes when source node emits `[property]-changed` event.
     * @param {ChangeEvent} event - Property change event.
     */
    private _onSourceChanged;
    /**
     * Dispose of the binding by removing all targets and listeners.
     * Use this when node is no longer needed.
     */
    dispose(): void;
}
/**
 * Manager for property bindings. It holds all bindings for a particular IoNode.
 */
export declare class PropertyBinder {
    private readonly __node;
    private readonly __bindings;
    /**
     * Creates binding manager for the specified node.
     * @param {IoNode} node - Owner node.
     */
    constructor(node: IoNode);
    /**
     * Returns a binding to the specified property name or creates one if it does not exist.
     * @param {string} property - Property to bind.
     * @return {Binding} Property binding object.
     */
    bind(property: string): Binding;
    /**
     * Removes a binding for the specified property name.
     * @param {string} property - Property to unbind.
     */
    unbind(property: string): void;
    /**
     * Disposes all bindings. Use this when node is no longer needed.
     */
    dispose(): void;
}
//# sourceMappingURL=propertyBinder.d.ts.map