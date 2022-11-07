# Class: ProtoProperty

Finalized property definition created from property declaration.

## Constructors

### constructor

**new ProtoProperty**(`def`)

Takes a weakly typed property declaration and returns full property definition with unscpecified fileds inferred.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `def` | [`PropertyDeclarationWeak`](../none#propertydeclarationweak) | Weakly typed property definition |

#### Defined in

[src/core/internals/property.ts:38](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L38)

## Properties

### binding

 `Optional` **binding**: [`Binding`](Binding.md)

#### Defined in

[src/core/internals/property.ts:30](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L30)

___

### notify

 `Optional` **notify**: `boolean`

#### Defined in

[src/core/internals/property.ts:32](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L32)

___

### observe

 `Optional` **observe**: `boolean`

#### Defined in

[src/core/internals/property.ts:33](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L33)

___

### reflect

 `Optional` **reflect**: `Reflect`

#### Defined in

[src/core/internals/property.ts:31](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L31)

___

### type

 `Optional` **type**: [`Constructor`](../none#constructor)

#### Defined in

[src/core/internals/property.ts:29](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L29)

___

### value

 `Optional` **value**: `any`

#### Defined in

[src/core/internals/property.ts:28](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L28)

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

[src/core/internals/property.ts:67](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L67)
