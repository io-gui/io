interface ChangeEvent {
    target: any;
    detail: Record<string, any>;
}
/**
 * Binding object. It manages data binding between source and targets using `[prop]-changed` events.
 */
declare class Binding {
    sourceProp: string;
    source: any;
    targets: Array<any>;
    targetProps: WeakMap<any, any>;
    /**
     * Creates a binding object with specified `sourceNode` and `sourceProp`.
     */
    constructor(sourceNode: any, sourceProp: string);
    set value(value: any);
    get value(): any;
    /**
     * Adds a target `targetNode` and `targetProp` and corresponding `[prop]-changed` listener, unless already added.
     * @param {Node} targetNode - Target node.
     * @param {string} targetProp - Target property.
     */
    addTarget(targetNode: any, targetProp: string): void;
    /**
     * Removes target `targetNode` and `targetProp` and corresponding `[prop]-changed` listener.
     * If `targetProp` is not specified, it removes all target properties.
     */
    removeTarget(targetNode: any, targetProp?: string): void;
    /**
     * Event handler that updates source property when one of the targets emits `[prop]-changed` event.
     */
    _onTargetChanged(event: ChangeEvent): void;
    /**
     * Event handler that updates bound properties on target nodes when source node emits `[prop]-changed` event.
     */
    _onSourceChanged(event: ChangeEvent): void;
    /**
     * Dispose of the binding by removing all targets and listeners.
     * Use this when node is no longer needed.
     */
    dispose(): void;
}
/**
 * Manager for `Node` property bindings. It holds all bindings for a particular Node.
 */
declare class Bindings {
    __node: any;
    __record: Record<string, Binding>;
    /**
     * Creates binding manager with a node reference.
     */
    constructor(node: any);
    /**
     * Returns a binding to the specified property name or creates one if it does not exist.
     */
    bind(prop: string): Binding;
    /**
     * Disposes a binding for the specified property name.
     * @param {string} prop - property name.
     */
    unbind(prop: string): void;
    /**
     * Disposes all bindings. Use this when node is no longer needed.
     */
    dispose(): void;
}
export { Bindings, Binding };
//# sourceMappingURL=binding.d.ts.map