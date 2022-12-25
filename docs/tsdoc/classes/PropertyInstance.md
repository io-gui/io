# Class: PropertyInstance

PropertyInstance object constructed from `ProtoProperty`.

## Constructors

### constructor

**new PropertyInstance**(`propDef`)

Creates the property configuration object and copies values from `ProtoProperty`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `propDef` | [`ProtoProperty`](ProtoProperty.md) | ProtoProperty object |

#### Defined in

[src/core/internals/property.ts:95](https://github.com/io-gui/iogui/blob/main/src/core/internals/property.ts#L95)

## Properties

### binding

 `Optional` **binding**: [`Binding`](Binding.md)

#### Defined in

[src/core/internals/property.ts:84](https://github.com/io-gui/iogui/blob/main/src/core/internals/property.ts#L84)

___

### observe

 **observe**: `boolean` = `false`

#### Defined in

[src/core/internals/property.ts:90](https://github.com/io-gui/iogui/blob/main/src/core/internals/property.ts#L90)

___

### reactive

 **reactive**: `boolean` = `true`

#### Defined in

[src/core/internals/property.ts:88](https://github.com/io-gui/iogui/blob/main/src/core/internals/property.ts#L88)

___

### reflect

 **reflect**: `boolean` = `false`

#### Defined in

[src/core/internals/property.ts:86](https://github.com/io-gui/iogui/blob/main/src/core/internals/property.ts#L86)

___

### type

 `Optional` **type**: [`Constructor`](../README.md#constructor) \| [`Constructor`](../README.md#constructor)[]

#### Defined in

[src/core/internals/property.ts:82](https://github.com/io-gui/iogui/blob/main/src/core/internals/property.ts#L82)

___

### value

 `Optional` **value**: `any` = `undefined`

#### Defined in

[src/core/internals/property.ts:80](https://github.com/io-gui/iogui/blob/main/src/core/internals/property.ts#L80)
