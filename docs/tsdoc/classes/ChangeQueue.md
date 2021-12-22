# Class: ChangeQueue

Property change FIFO queue.
Responsible for dispatching change events and invoking change handler functions with property change payloads.

## Constructors

### constructor

• **new ChangeQueue**(`node`)

Creates change queue for the specified owner instance of `IoNode`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | Owner node. |

#### Defined in

[core/internals/changeQueue.ts:15](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/changeQueue.ts#L15)

## Methods

### dispatch

▸ **dispatch**(): `void`

Dispatches and clears the queue.
For each property change in the queue:
 - It fires the `'[propName]-changed'` `ChangeEvent` from the owner node with `Change` data as `event.detail`.
 - It executes node's `[propName]Changed(change)` change handler function if it is defined.
If owner node is not connected dispatch is aborted.
After all changes are dispatched it invokes `.applyCompose()` and `.changed()` functions od the owner node instance.

#### Returns

`void`

#### Defined in

[core/internals/changeQueue.ts:47](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/changeQueue.ts#L47)

___

### dispose

▸ **dispose**(): `void`

Clears the queue and removes the node reference.
Use this when node queue is no longer needed.

#### Returns

`void`

#### Defined in

[core/internals/changeQueue.ts:78](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/changeQueue.ts#L78)

___

### queue

▸ **queue**(`property`, `value`, `oldValue`): `void`

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

[core/internals/changeQueue.ts:28](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/changeQueue.ts#L28)