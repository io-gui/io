## ProtoListeners

Collection of all listeners defined in the prototype chain.

### ProtoListeners(protochain: `ProtoChain`)

Creates a collection of all listeners from protochain.

## Listeners

Manager of listeners for a class **instance**.

### Listeners(node: `Node`, protoListeners: `ProtoListeners`)

Creates manager for listener.

### .setPropListeners(props: `Object`)

Sets listeners from inline properties (filtered form properties map by 'on-' prefix).

### .connect()

Connects all event listeners.

### .disconnect()

Disconnects all event listeners.

### .dispose()

Disconnects all event listeners and removes all references.
Use this when node is no longer needed.

### .addEventListener(type: `string`, listener: `function`, options: `Object`)

Proxy for `addEventListener` method.
Adds an event listener.

### .removeEventListener(type: `string`, listener: `function`, options: `Object`)

Proxy for `removeEventListener` method.
Removes an event listener.

### .dispatchEvent(type: `string`, detail: `Object`, bubbles: `boolean`, src: `HTMLElement`)

Shorthand for custom event dispatch.

