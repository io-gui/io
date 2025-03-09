[**io-gui**](../README.md)

***

# Class: ChangeQueue

Defined in: [src/core/internals/changeQueue.ts:36](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L36)

A queue system for managing and batching property changes in `IoNode` and `IoElement` nodes.

This class implements a First-In-First-Out (FIFO) queue that:
- Collects property changes and their associated values
- Coalesces multiple changes to the same property
- Dispatches changes in order through events (e.g., '[propName]-changed')
- Invokes corresponding change handlers (e.g., [propName]Changed())
- Triggers a final 'changed()' handler after processing all changes
- Dispatches a final 'changed' event after processing all changes

The queue helps optimize performance by batching multiple property changes
and preventing redundant updates when the same property changes multiple
times within a single execution cycle.

## Constructors

### new ChangeQueue()

> **new ChangeQueue**(`node`): [`ChangeQueue`](ChangeQueue.md)

Defined in: [src/core/internals/changeQueue.ts:45](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L45)

Creates change queue for the specified owner instance of `IoNode`.

#### Parameters

##### node

[`IoNode`](IoNode.md)

Owner node.

#### Returns

[`ChangeQueue`](ChangeQueue.md)

## Properties

### changes

> `readonly` **changes**: [`Change`](../interfaces/Change.md)[]

Defined in: [src/core/internals/changeQueue.ts:38](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L38)

***

### dispatching

> **dispatching**: `boolean` = `false`

Defined in: [src/core/internals/changeQueue.ts:40](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L40)

***

### hasChanged

> **hasChanged**: `boolean` = `false`

Defined in: [src/core/internals/changeQueue.ts:39](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L39)

***

### node

> `readonly` **node**: [`IoNode`](IoNode.md)

Defined in: [src/core/internals/changeQueue.ts:37](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L37)

## Methods

### dispatch()

> **dispatch**(): `void`

Defined in: [src/core/internals/changeQueue.ts:79](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L79)

Dispatches and clears the queue.
For each property change in the queue:
 - It executes node's `[propName]Changed(change)` change handler function if it is defined.
 - It fires the `'[propName]-changed'` `ChangeEvent` from the owner node with `Change` data as `event.detail`.
After all changes are dispatched it invokes `.changed()` function of the owner node instance and fires `'changed'` event.
Finally it fires global `'object-mutated'` event on the window object with the owner node as `event.detail`.

#### Returns

`void`

***

### dispose()

> **dispose**(): `void`

Defined in: [src/core/internals/changeQueue.ts:107](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L107)

Clears the queue and removes the node reference for garbage collection.
Use this when node queue is no longer needed.

#### Returns

`void`

***

### queue()

> **queue**(`property`, `value`, `oldValue`): `void`

Defined in: [src/core/internals/changeQueue.ts:58](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L58)

Adds property change payload to the queue by specifying property name, previous and the new value.
If the change is already in the queue, the new value is updated in-queue.
If the new value is the same as the original value, the change is removed from the queue.

#### Parameters

##### property

`string`

Property name.

##### value

`any`

Property value.

##### oldValue

`any`

Old property value.

#### Returns

`void`
