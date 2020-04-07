## ProtoListeners

Flat map of all listeners defined in the prototype chain.

### ProtoListeners(protochain: `Protochain`)

Creates map of all listeners from protochain.

## Listeners

Manager for `IoNode` listeners.

### Listeners(node: `IoNode`, protoListeners: `ProtoListeners`)

Creates listener manager for `IoNode`.

### .setPropListeners(props: `Object`)

Sets listeners from properties (filtered form properties map by 'on-' prefix).

### .connect()

Adds event listeners.

### .disconnect()

Removes event listeners.

### .dispose()

Removes all event listeners.
Use this when node is no longer needed.

### .addEventListener(type: `string`, listener: `function`, options: `Object`)

Adds an event listener.

### .removeEventListener(type: `string`, listener: `function`, options: `Object`)

Removes an event listener.

### .dispatchEvent(type: `string`, detail: `Object`, bubbles: `boolean`, src: `HTMLElement`)

Shorthand for event dispatch.

