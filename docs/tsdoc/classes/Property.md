# Class: Property

Property configuration object.
It is initialized from corresponding `PropertyDefinition` in `ProtoChain`.

## Constructors

### constructor

• **new Property**(`propDef`)

Creates the property configuration object and copies values from `PropertyDefinition`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `propDef` | [`PropertyDefinition`](PropertyDefinition.md) | PropertyDefinition object |

#### Defined in

[core/internals/property.ts:101](https://github.com/io-gui/io/blob/tsc/src/core/internals/property.ts#L101)

## Properties

### binding

• `Optional` **binding**: [`Binding`](Binding.md) = `undefined`

#### Defined in

[core/internals/property.ts:90](https://github.com/io-gui/io/blob/tsc/src/core/internals/property.ts#L90)

___

### notify

• **notify**: `boolean` = `true`

#### Defined in

[core/internals/property.ts:94](https://github.com/io-gui/io/blob/tsc/src/core/internals/property.ts#L94)

___

### observe

• **observe**: `boolean` = `false`

#### Defined in

[core/internals/property.ts:96](https://github.com/io-gui/io/blob/tsc/src/core/internals/property.ts#L96)

___

### reflect

• **reflect**: `ReflectType` = `0`

#### Defined in

[core/internals/property.ts:92](https://github.com/io-gui/io/blob/tsc/src/core/internals/property.ts#L92)

___

### type

• `Optional` **type**: `AnyConstructor` = `undefined`

#### Defined in

[core/internals/property.ts:88](https://github.com/io-gui/io/blob/tsc/src/core/internals/property.ts#L88)

___

### value

• `Optional` **value**: `any` = `undefined`

#### Defined in

[core/internals/property.ts:86](https://github.com/io-gui/io/blob/tsc/src/core/internals/property.ts#L86)
