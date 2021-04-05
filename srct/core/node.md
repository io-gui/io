### .NodeMixin(superclass: `function`) : function

Core mixin for `Node` classes.

### compose

`compose` object lets you reactively assign property values to other object's properties.
For example, you can assign `this.value` property to the `this.objectProp.result` property.

```
get compose () {
  return {
    objectProp: {result: this.value}
  };
 }
```

Node class does not use `compose` by itself but this feature is available to its sublasses.

### classConstructor(initProps: `Object`)

Creates a class instance and initializes the internals.

### .connect(node: `Node`)

Connects the instance to another node or element.

### .disconnect(node: `Node`)

Disconnects the instance from an another node or element.

### .connectedCallback()

Connected callback.

### .disconnectedCallback()

Disconnected callback.

### .dispose()

Disposes all internals.
Use this when instance is no longer needed.

### .changed()

default change handler.
Invoked when one of the properties change.

### .applyCompose()

Applies composed values to properties.

### .queue(prop: `string`, value: `*`, oldValue: `*`)

Adds property change to the queue.

### .queueDispatch()

Dispatches the queue.

### .queueDispatchLazy()

Dispatches the queue in the next rAF cycle.

### .objectMutated(event: `Object`, event.detail.object: `Object`)

Event handler for 'object-mutated' event emitted from the `window`.
Node should be listening for this event if it has an object property
with `observe: "sync" || "async"` configuration.

### .objectMutatedThrottled(prop: `string`)

This function is called after `objectMutated()` determines that one of
the object properties has mutated.

### .bind(prop: `string`) : Binding

Returns a binding to a specified property`.

### .unbind(prop: `string`)

Unbinds a binding to a specified property`.

### .set(prop: `string`, value: `*`, force: `boolean`)

Sets a property and emits `[property]-set` event.
Use this when property is set by user action (e.g. mouse click).

### .setProperties(props: `Object`)

Sets multiple properties in batch.
[property]-changed` events will be broadcast in the end.

### .addEventListener(type: `string`, listener: `function`, options: `Object`)

Wrapper for addEventListener.

### .removeEventListener(type: `string`, listener: `function`, options: `Object`)

Wrapper for removeEventListener.

### .dispatchEvent(type: `string`, detail: `Object`, bubbles: `boolean`, src: `HTMLElement`)

Wrapper for dispatchEvent.

### .throttle(func: `function`, arg: `*`, asynchronous: `boolean`)

Throttles function execution to next frame (rAF) if the function has been executed in the current frame.

### .preventDefault(event: `Object`)

Handler function with `event.preventDefault()`.

### .stopPropagation(event: `Object`)

Handler function with `event.stopPropagation()`.

### .RegisterIoNode()

Register function to be called once per class.

## Node

NodeMixin applied to `Object` class.

