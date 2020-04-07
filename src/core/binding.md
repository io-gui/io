## BindingManager

Manager for `IoNode` property bindings. It holds all bindings for a particular IoNode.

### BindingManager(node: `IoNode`)

Creates binding manager with a node reference.

### .get(prop: `string`) : Binding

Returns a binding to the specified property name or creates one if it dpes not exist.

### .dispose()

Disposes all bindings. Use this when node is no longer needed.

## Binding

Binding object. It manages data binding between source and targets using `[prop]-changed` events.

### Binding(sourceNode: `IoNode`, sourceProp: `string`)

Creates a binding object with specified `sourceNode` and `sourceProp`.

### .addTarget(targetNode: `IoNode`, targetProp: `string`)

Adds a target `targetNode` and `targetProp` and corresponding `[prop]-changed` listener, unless already added.

### .removeTarget(targetNode: `IoNode`, targetProp: `string`)

Removes target `targetNode` and `targetProp` and corresponding `[prop]-changed` listener.
If `targetProp` is not specified, it removes all target properties.

### ._onTargetChanged(event: `Object`, event.target: `IoNode`, event.detail: `Object`, event.detail.value: `*`)

Event handler that updates source property when one of the targets emits `[prop]-changed` event.

### ._onSourceChanged(event: `Object`, event.target: `IoNode`, event.detail: `Object`, event.detail.value: `*`)

Event handler that updates bound properties on target nodes when source node emits `[prop]-changed` event.

### .dispose()

Dispose of the binding by removing all targets and listeners.
Use this when node is no longer needed.

