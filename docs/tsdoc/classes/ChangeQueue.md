# Class: ChangeQueue

Responsive property change FIFO queue.
Responsible for dispatching change events and invoking change handler functions with property change payloads.

## Constructors

### constructor

**new ChangeQueue**(`node`)

Creates change queue for the specified owner instance of `IoNode`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | Owner node. |

#### Defined in

[src/core/internals/changeQueue.ts:16](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L16)

## Properties

### changes

 `Readonly` **changes**: [`Change`](../interfaces/Change.md)[]

#### Defined in

[src/core/internals/changeQueue.ts:9](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L9)

___

### dispatching

 **dispatching**: `boolean` = `false`

#### Defined in

[src/core/internals/changeQueue.ts:11](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L11)

___

### hasChanged

 **hasChanged**: `boolean` = `false`

#### Defined in

[src/core/internals/changeQueue.ts:10](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L10)

## Methods

### dispatch

**dispatch**(): `void`

Dispatches and clears the queue.
For each property change in the queue:
 - It fires the `'[propName]-changed'` `ChangeEvent` from the owner node with `Change` data as `event.detail`.
 - It executes node's `[propName(change)` change handler function if it is defined.
If owner node is not connected dispatch is aborted.
After all changes are dispatched it invokes `.changed()` functions od the owner node instance.

#### Returns

`void`

#### Defined in

[src/core/internals/changeQueue.ts:46](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L46)

___

### dispose

**dispose**(): `void`

Clears the queue and removes the node reference.
Use this when node queue is no longer needed.

#### Returns

`void`

#### Defined in

[src/core/internals/changeQueue.ts:67](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L67)

___

### queue

**queue**(`property`, `value`, `oldValue`): `void`

Adds property change payload to the queue by specifying property name, previous and the new value.
If the change is already in the queue, the new value is updated in-queue.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `property` | `string` | Property name. |
| `value` | `any` | Property value. |
| `oldValue` | `any` | Old property value. |

#### Returns

`void`

#### Defined in

[src/core/internals/changeQueue.ts:27](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L27)
