# Class: ProtoProperty

Finalized property definition created from property declaration.

## Constructors

### constructor

**new ProtoProperty**(`def`)

Takes a loosely typed property declaration and returns full property definition with unscpecified fileds inferred.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `def` | [`PropertyDeclarationLoose`](../README.md#propertydeclarationloose) | Loosely typed property definition |

#### Defined in

[src/core/internals/property.ts:36](https://github.com/io-gui/iogui/blob/main/src/core/internals/property.ts#L36)

## Properties

### binding

 `Optional` **binding**: [`Binding`](Binding.md)

#### Defined in

[src/core/internals/property.ts:28](https://github.com/io-gui/iogui/blob/main/src/core/internals/property.ts#L28)

___

### observe

 `Optional` **observe**: `boolean`

#### Defined in

[src/core/internals/property.ts:31](https://github.com/io-gui/iogui/blob/main/src/core/internals/property.ts#L31)

___

### reactive

 `Optional` **reactive**: `boolean`

#### Defined in

[src/core/internals/property.ts:30](https://github.com/io-gui/iogui/blob/main/src/core/internals/property.ts#L30)

___

### reflect

 `Optional` **reflect**: `boolean`

#### Defined in

[src/core/internals/property.ts:29](https://github.com/io-gui/iogui/blob/main/src/core/internals/property.ts#L29)

___

### type

 `Optional` **type**: [`Constructor`](../README.md#constructor) \| [`Constructor`](../README.md#constructor)[]

#### Defined in

[src/core/internals/property.ts:27](https://github.com/io-gui/iogui/blob/main/src/core/internals/property.ts#L27)

___

### value

 `Optional` **value**: `any`

#### Defined in

[src/core/internals/property.ts:26](https://github.com/io-gui/iogui/blob/main/src/core/internals/property.ts#L26)

## Methods

### assign

**assign**(`protoProp`): `void`

Assigns values of another ProtoProperty to itself, unless they are default values.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `protoProp` | [`ProtoProperty`](ProtoProperty.md) | Source ProtoProperty |

#### Returns

`void`

#### Defined in

[src/core/internals/property.ts:65](https://github.com/io-gui/iogui/blob/main/src/core/internals/property.ts#L65)
