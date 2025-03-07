[**io-gui**](../README.md)

***

# Class: ChangeQueue

Defined in: [src/core/internals/changeQueue.ts:7](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L7)

Responsive property change FIFO queue.
Responsible for dispatching change events and invoking change handler functions with property change payloads.

## Constructors

### new ChangeQueue()

> **new ChangeQueue**(`node`): [`ChangeQueue`](ChangeQueue.md)

Defined in: [src/core/internals/changeQueue.ts:16](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L16)

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

Defined in: [src/core/internals/changeQueue.ts:9](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L9)

***

### dispatching

> **dispatching**: `boolean` = `false`

Defined in: [src/core/internals/changeQueue.ts:11](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L11)

***

### hasChanged

> **hasChanged**: `boolean` = `false`

Defined in: [src/core/internals/changeQueue.ts:10](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L10)

***

### node

> `readonly` **node**: [`IoNode`](IoNode.md)

Defined in: [src/core/internals/changeQueue.ts:8](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L8)

## Methods

### dispatch()

> **dispatch**(): `void`

Defined in: [src/core/internals/changeQueue.ts:45](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L45)

Dispatches and clears the queue.
For each property change in the queue:
 - It fires the `'[propName]-changed'` `ChangeEvent` from the owner node with `Change` data as `event.detail`.
 - It executes node's `[propName(change)` change handler function if it is defined.
After all changes are dispatched it invokes `.changed()` functions od the owner node instance.

#### Returns

`void`

***

### dispose()

> **dispose**(): `void`

Defined in: [src/core/internals/changeQueue.ts:70](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L70)

Clears the queue and removes the node reference.
Use this when node queue is no longer needed.

#### Returns

`void`

***

### queue()

> **queue**(`property`, `value`, `oldValue`): `void`

Defined in: [src/core/internals/changeQueue.ts:27](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L27)

Adds property change payload to the queue by specifying property name, previous and the new value.
If the change is already in the queue, the new value is updated in-queue.

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
