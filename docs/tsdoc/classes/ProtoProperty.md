[io-gui](../README.md) / ProtoProperty

# Class: ProtoProperty

Finalized property definition created from property declaration.

## Table of contents

### Constructors

- [constructor](ProtoProperty.md#constructor)

### Properties

- [binding](ProtoProperty.md#binding)
- [init](ProtoProperty.md#init)
- [observe](ProtoProperty.md#observe)
- [reactive](ProtoProperty.md#reactive)
- [reflect](ProtoProperty.md#reflect)
- [type](ProtoProperty.md#type)
- [value](ProtoProperty.md#value)

### Methods

- [assign](ProtoProperty.md#assign)

## Constructors

### constructor

• **new ProtoProperty**(`def`): [`ProtoProperty`](ProtoProperty.md)

Takes a loosely typed property declaration and returns full property definition with unscpecified fileds inferred.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `def` | [`PropertyDeclarationLoose`](../README.md#propertydeclarationloose) | Loosely typed property definition |

#### Returns

[`ProtoProperty`](ProtoProperty.md)

#### Defined in

[src/core/internals/property.ts:38](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L38)

## Properties

### binding

• `Optional` **binding**: [`Binding`](Binding.md)

#### Defined in

[src/core/internals/property.ts:29](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L29)

___

### init

• `Optional` **init**: `any`

#### Defined in

[src/core/internals/property.ts:33](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L33)

___

### observe

• `Optional` **observe**: `boolean`

#### Defined in

[src/core/internals/property.ts:32](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L32)

___

### reactive

• `Optional` **reactive**: `boolean`

#### Defined in

[src/core/internals/property.ts:31](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L31)

___

### reflect

• `Optional` **reflect**: `boolean`

#### Defined in

[src/core/internals/property.ts:30](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L30)

___

### type

• `Optional` **type**: [`Constructor`](../README.md#constructor)

#### Defined in

[src/core/internals/property.ts:28](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L28)

___

### value

• `Optional` **value**: `any`

#### Defined in

[src/core/internals/property.ts:27](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L27)

## Methods

### assign

▸ **assign**(`protoProp`): `void`

Assigns values of another ProtoProperty to itself, unless they are default values.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `protoProp` | [`ProtoProperty`](ProtoProperty.md) | Source ProtoProperty |

#### Returns

`void`

#### Defined in

[src/core/internals/property.ts:68](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L68)
