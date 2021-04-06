## Binding

Binding object. It manages data binding between source and targets using `[property]-changed` events.

### Binding(node: `Node`, property: `string`)

Creates a binding object for specified `node` and `property`.

### .addTarget(node: `Node`, property: `string`)

Adds a target `node` and `property` and corresponding `[property]-changed` listener, unless already added.

### .removeTarget(node: `Node`, property: `string`)

Removes target `targetNode` and `targetProp` and corresponding `[property]-changed` listener.
If `targetProp` is not specified, it removes all target properties.

### ._getTargetProperties(node: `Node`)

Retrieves a list of target properties for specified target node.

### ._onTargetChanged(event: `ChangeEvent`)

Event handler that updates source property when one of the targets emits `[property]-changed` event.

### ._onSourceChanged(event: `ChangeEvent`)

Event handler that updates bound properties on target nodes when source node emits `[property]-changed` event.

### .dispose()

ispose of the binding by removing all targets and listeners.
Use this when node is no longer needed.

## BindingManager

Creates binding manager for the specified node.

### BindingManager(node: `Node`)

Creates binding manager with a node reference.

### .bind(property: `string`) : Binding

Returns a binding to the specified property name or creates one if it does not exist.

### .unbind(property: `string`)

Removes a binding for the specified property name.

### .dispose()

Disposes all bindings. Use this when node is no longer needed.

