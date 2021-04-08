import { Node } from '../node.js';
import { Properties } from './properties.js';
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
     */
    constructor(node: Node, property: string);
    set value(value: any);
    get value(): any;
    /**
     * Adds a target `node` and `targetProp` and corresponding `[property]-changed` listener, unless already added.
     * @param {Node} node - Target node.
     * @param {string} property - Target property.
     */
    addTarget(node: Node, property: string, __nodeProperties?: Properties): void;
    /**
     * Removes target `node` and `property` and corresponding `[property]-changed` listener.
     * If `property` is not specified, it removes all target properties.
     * @param {Node} node - Target node.
     * @param {string} property - Target property.
     */
    removeTarget(node: Node, property?: string): void;
    /**
     * Retrieves a list of target properties for specified target node.
     * @param {Node} node - Target node.
     */
    private _getTargetProperties;
    /**
     * Event handler that updates source property when one of the targets emits `[property]-changed` event.
     * @param {event} ChangeEvent - Property change event.
     */
    private _onTargetChanged;
    /**
     * Event handler that updates bound properties on target nodes when source node emits `[property]-changed` event.
     * @param {event} ChangeEvent - Property change event.
     */
    private _onSourceChanged;
    /**
     * Dispose of the binding by removing all targets and listeners.
     * Use this when node is no longer needed.
     */
    dispose(): void;
}
/**
 * Manager for property bindings. It holds all bindings for a particular Node.
 */
export declare class BindingManager {
    __node: Node;
    __bindings: Record<string, Binding>;
    /**
     * Creates binding manager for the specified node.
     * @param {Node} node - Owner node.
     */
    constructor(node: Node);
    /**
     * Returns a binding to the specified property name or creates one if it does not exist.
     * @param {string} property - Property to bind.
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
//# sourceMappingURL=bindingManager.d.ts.map