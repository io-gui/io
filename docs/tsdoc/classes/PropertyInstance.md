[io-gui](../README.md) / PropertyInstance

# Class: PropertyInstance

PropertyInstance object constructed from `ProtoProperty`.

## Table of contents

### Constructors

- [constructor](PropertyInstance.md#constructor)

### Properties

- [binding](PropertyInstance.md#binding)
- [init](PropertyInstance.md#init)
- [observe](PropertyInstance.md#observe)
- [reactive](PropertyInstance.md#reactive)
- [reflect](PropertyInstance.md#reflect)
- [type](PropertyInstance.md#type)
- [value](PropertyInstance.md#value)

## Constructors

### constructor

• **new PropertyInstance**(`node`, `propDef`): [`PropertyInstance`](PropertyInstance.md)

Creates the property configuration object and copies values from `ProtoProperty`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | owner IoNode instance |
| `propDef` | [`ProtoProperty`](ProtoProperty.md) | ProtoProperty object |

#### Returns

[`PropertyInstance`](PropertyInstance.md)

#### Defined in

[src/core/internals/property.ts:118](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L118)

## Properties

### binding

• `Optional` **binding**: [`Binding`](Binding.md)

#### Defined in

[src/core/internals/property.ts:104](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L104)

___

### init

• `Optional` **init**: `any` = `undefined`

#### Defined in

[src/core/internals/property.ts:112](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L112)

___

### observe

• **observe**: `boolean` = `false`

#### Defined in

[src/core/internals/property.ts:110](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L110)

___

### reactive

• **reactive**: `boolean` = `true`

#### Defined in

[src/core/internals/property.ts:108](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L108)

___

### reflect

• **reflect**: `boolean` = `false`

#### Defined in

[src/core/internals/property.ts:106](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L106)

___

### type

• `Optional` **type**: [`Constructor`](../README.md#constructor)

#### Defined in

[src/core/internals/property.ts:102](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L102)

___

### value

• `Optional` **value**: `any` = `undefined`

#### Defined in

[src/core/internals/property.ts:100](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L100)
