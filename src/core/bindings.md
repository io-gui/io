## `BindingManager` 

Manager for `IoNode` property bindings. It holds all bindings for a particular IoNode.

### `new BindingManager(node)`

Creates binding manager with a node reference.

### `.get(prop)`

Returns a binding to the specified property name or creates one if it dpes not exist.

### `.dispose()`

Disposes all bindings. Use this when node is no longer needed.

## `Binding`

Binding object - syncs data between a source and targets using `[prop]-changed` event.

### `new Binding(sourceNode, sourceProp)`

Creates a binding object with specified `sourceNode` and `sourceProp`.

### `.value`

Getter/setter for the value of the `sourceProp` on the `sourceNode`.

### `.addTarget(targetNode, targetProp)`

Adds a target `targetNode` and `targetProp` and corresponding `[prop]-changed` listener, unless already added.

### `.removeTarget(targetNode, targetProp)`

Removes target `targetNode` and `targetProp` and corresponding `[prop]-changed` listener.

If `targetProp` is not specified, it removes all target properties.

### `.dispose()`

Dispose of the binding by removing all targets and listeners.
Use this when node is no longer needed.