# Class: Binding

Property binding class.
It facilitates data binding between source node/property and target nodes/properties
using `[property]-changed` events.

## Constructors

### constructor

• **new Binding**(`node`, `property`)

Creates a binding object for specified `node` and `property`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | Property owner node |
| `property` | `string` | Name of the property |

#### Defined in

[core/internals/binding.ts:19](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/binding.ts#L19)

## Properties

### node

• `Readonly` **node**: [`IoNode`](IoNode.md)

#### Defined in

[core/internals/binding.ts:10](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/binding.ts#L10)

___

### property

• `Readonly` **property**: `string` = `''`

#### Defined in

[core/internals/binding.ts:11](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/binding.ts#L11)

___

### targetProperties

• `Readonly` **targetProperties**: `WeakMap`<`EventTarget`, `string`[]\>

#### Defined in

[core/internals/binding.ts:13](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/binding.ts#L13)

___

### targets

• `Readonly` **targets**: `EventTarget`[] = `[]`

#### Defined in

[core/internals/binding.ts:12](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/binding.ts#L12)

## Accessors

### value

• `get` **value**(): `any`

#### Returns

`any`

#### Defined in

[core/internals/binding.ts:29](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/binding.ts#L29)

• `set` **value**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Defined in

[core/internals/binding.ts:26](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/binding.ts#L26)

## Methods

### addTarget

▸ **addTarget**(`node`, `property`): `void`

Adds a target `node` and `targetProp` and corresponding `[property]-changed` listener, unless already added.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | Target node |
| `property` | `string` | Target property |

#### Returns

`void`

#### Defined in

[core/internals/binding.ts:37](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/binding.ts#L37)

___

### dispose

▸ **dispose**(): `void`

Dispose of the binding by removing all targets and listeners.
Use this when node is no longer needed.

#### Returns

`void`

#### Defined in

[core/internals/binding.ts:140](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/binding.ts#L140)

___

### removeTarget

▸ **removeTarget**(`node`, `property?`): `void`

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

[core/internals/binding.ts:61](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/binding.ts#L61)
