## QueueManager

Manager for `IoNode` event queue and change handle functions.

### QueueManager

Creates queue manager for `IoNode`.

### .queue(prop: string, value: *, oldValue: *)

Add property change to the queue.

### .dispatch()

Dispatch the queue.

### .dispose()

Remove queue items and the node reference.
Use this when node is no longer needed.

