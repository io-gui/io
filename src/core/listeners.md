## ProtoListeners

Core `IoElement` class.

## Listeners

Manager for `IoNode` listeners.

### Listeners

Creates listener manager for `IoNode`.

### .setPropListeners(props: Object)

Sets listeners from properties (filtered form properties map by 'on-' prefix).

### .connect()

Adds event listeners.

### .disconnect()

Removes event listeners.

### .dispose()

Removes all event listeners.
Use this when node is no longer needed.

### .addEventListener(type: string, listener: function, options: Object)

Adds an event listener.

### .removeEventListener(type: string, listener: function, options: Object)

Removes an event listener.

### .dispatchEvent(type: string, detail: Object, bubbles: boolean, src: HTMLElement)

Shorthand for event dispatch.

