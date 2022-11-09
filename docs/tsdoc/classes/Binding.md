# Class: Binding

Property binding class.
It facilitates data binding between source node/property and target nodes/properties
using `[property]-changed` events.

## Constructors

### constructor

**new Binding**(`node`, `property`)

Creates a binding object for specified `node` and `property`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | Property owner node |
| `property` | `string` | Name of the property |

#### Defined in

[src/core/internals/binding.ts:19](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L19)

## Properties

### node

 `Readonly` **node**: [`IoNode`](IoNode.md)

#### Defined in

[src/core/internals/binding.ts:10](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L10)

___

### property

 `Readonly` **property**: `string` = `''`

#### Defined in

[src/core/internals/binding.ts:11](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L11)

___

### targetProperties

 `Readonly` **targetProperties**: `WeakMap`<`EventTarget`, `string`[]\>

#### Defined in

[src/core/internals/binding.ts:13](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L13)

___

### targets

 `Readonly` **targets**: `EventTarget`[] = `[]`

#### Defined in

[src/core/internals/binding.ts:12](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L12)

## Accessors

### value

`get` **value**(): `any`

#### Returns

`any`

#### Defined in

[src/core/internals/binding.ts:27](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L27)

`set` **value**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Defined in

[src/core/internals/binding.ts:24](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L24)

## Methods

### addTarget

**addTarget**(`node`, `property`): `void`

Adds a target `node` and `targetProp` and corresponding `[property]-changed` listener, unless already added.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | Target node |
| `property` | `string` | Target property |

#### Returns

`void`

#### Defined in

[src/core/internals/binding.ts:35](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L35)

___

### dispose

**dispose**(): `void`

Dispose of the binding by removing all targets and listeners.
Use this when node is no longer needed.

#### Returns

`void`

#### Defined in

[src/core/internals/binding.ts:140](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L140)

___

### getTargetProperties

**getTargetProperties**(`node`): `string`[]

Retrieves a list of target properties for specified target node.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `EventTarget` \| [`IoNode`](IoNode.md) | Target node. |

#### Returns

`string`[]

list of target property names.

#### Defined in

[src/core/internals/binding.ts:81](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L81)

___

### onSourceChanged

**onSourceChanged**(`event`): `void`

Event handler that updates bound properties on target nodes when source node emits `[property]-changed` event.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | [`ChangeEvent`](../interfaces/ChangeEvent.md) | Property change event. |

#### Returns

`void`

#### Defined in

[src/core/internals/binding.ts:114](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L114)

___

### onTargetChanged

**onTargetChanged**(`event`): `void`

Event handler that updates source property when one of the targets emits `[property]-changed` event.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | [`ChangeEvent`](../interfaces/ChangeEvent.md) | Property change event. |

#### Returns

`void`

#### Defined in

[src/core/internals/binding.ts:95](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L95)

___

### removeTarget

**removeTarget**(`node`, `property?`): `void`

Removes target `node` and `property` and corresponding `[property]-changed` listener.
If `property` is not specified, it removes all target properties.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | Target node |
| `property?` | `string` | Target property |

#### Returns

`void`

#### Defined in

[src/core/internals/binding.ts:60](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L60)
