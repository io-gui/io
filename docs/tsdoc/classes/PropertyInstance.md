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

[src/core/internals/property.ts:97](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L97)

## Properties

### binding

 `Optional` **binding**: [`Binding`](Binding.md)

#### Defined in

[src/core/internals/property.ts:86](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L86)

___

### notify

 **notify**: `boolean` = `true`

#### Defined in

[src/core/internals/property.ts:90](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L90)

___

### observe

 **observe**: `boolean` = `false`

#### Defined in

[src/core/internals/property.ts:92](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L92)

___

### reflect

 **reflect**: `Reflect` = `'none'`

#### Defined in

[src/core/internals/property.ts:88](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L88)

___

### type

 `Optional` **type**: [`Constructor`](../none#constructor)

#### Defined in

[src/core/internals/property.ts:84](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L84)

___

### value

 `Optional` **value**: `any` = `undefined`

#### Defined in

[src/core/internals/property.ts:82](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L82)
