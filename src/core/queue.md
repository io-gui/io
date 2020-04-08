## Queue

Manager for `IoNode` property change queue.
It is responsible for triggering both change events and change handler functions.

### Queue(node: `IoNode`)

Creates queue manager for specified instance of `IoNode`.
It should be evoked by the `IoNode` constructor.

### .queue(prop: `string`, value: `*`, oldValue: `*`)

Adds property change to the queue by specifying property name, previous and the new value.
If the property change is already waiting in the queue, only the new value is updated in the queue.

### .dispatch()

Dispatches the queue and clears all the properties and values from the queue.
For each property change in the queue, `'[propName]-changed'` event will fire with queue payload.
In addition, if `[propName]Changed()` change handler is defined it will also execute.

### .dispose()

Remove queue items and the node reference.
Use this when node is no longer needed.

