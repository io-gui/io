## ChangeQueue

Property change LIFO queue responsible for dispatching change events and triggering change handler functions.

### ChangeQueue(node: `Node`)

Creates change queue for the specified `Node`.

### .queue(property: `string`, value: `*`, oldValue: `*`)

Adds property change to the queue by specifying property name, previous and the new value. If the change is already in the queue, the new value is updated in-queue.

### .dispatch()

Dispatches and clears the queue.
For each property change in the queue:
 - It fires the `'[propName]-changed'` `ChangeEvent` from thner node with `Change` data as `event.detail`.
 - It executes node's `[propName]Changed(change)` changndler function if it is defined.
If owner node is not connected dispatch is aborted.
Changes with same `value` and `oldValue` are ignored.

### .dispose()

Clears the queue and removes the node reference.
Use this when node queue is no longer needed.

