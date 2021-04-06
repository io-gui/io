import { Node } from '../node.js';
import { ChangeEvent } from './changeQueue.js';
import { Properties } from '../properties.js';
/**
 * Binding object. It manages data binding between source and targets using `[prop]-changed` events.
 */
export declare class Binding {
    private __node;
    private __property;
    private __targets;
    private __targetProperties;
    /**
     * Creates a binding object for specified `node` and `property`.
     */
    constructor(node: Node, property: string);
    set value(value: any);
    get value(): any;
    /**
     * Adds a target `node` and `targetProp` and corresponding `[prop]-changed` listener, unless already added.
     * @param {Node} node - Target node.
     * @param {string} property - Target property.
     */
    addTarget(node: Node, property: string, __nodeProperties?: Properties): void;
    /**
     * Removes target `targetNode` and `targetProp` and corresponding `[prop]-changed` listener.
     * If `targetProp` is not specified, it removes all target properties.
     * @param {Node} node - Target node.
     * @param {string} property - Target property.
     */
    removeTarget(node: Node, property?: string): void;
    /**
     * Event handler that updates source property when one of the targets emits `[prop]-changed` event.
     * @param {event} ChangeEvent - Property change event.
     */
    _onTargetChanged(event: ChangeEvent): void;
    /**
     * Event handler that updates bound properties on target nodes when source node emits `[prop]-changed` event.
     * @param {event} ChangeEvent - Property change event.
     */
    _onSourceChanged(event: ChangeEvent): void;
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
     * Creates binding manager with a node reference.
     * @param {Node} node - Owner node.
     */
    constructor(node: Node);
    /**
     * Returns a binding to the specified property name or creates one if it does not exist.
     * @param {string} property - Property to bind.
     */
    bind(property: string): Binding;
    /**
     * Disposes a binding for the specified property name.
     * @param {string} property - Property to unbind.
     */
    unbind(property: string): void;
    /**
     * Disposes all bindings. Use this when node is no longer needed.
     */
    dispose(): void;
}
//# sourceMappingURL=bindingManager.d.ts.map