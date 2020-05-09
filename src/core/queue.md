## Queue

Property change queue manager responsible for dispatching change events and triggering change handler functions.

### Queue(node: `Node`)

Creates queue manager for the specified `Node` instance.

### .queue(prop: `string`, value: `*`, oldValue: `*`)

Adds property change to the queue by specifying property name, previous and the new value.
If the change is already in the queue, the new value is updated.

### .dispatch()

Dispatches and clears the queue.
For each property change in the queue, it fires the `'[propName]-changed'` event with `oldValue` and new `value` in `event.detail` payload.
It also executes node's `[propName]Changed(payload)` change handler function if it is defined.

### .dispose()

Clears the queue and removes the node reference.
Use this when node queue is no longer needed.

