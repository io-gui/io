# Class: Property

Property configuration object.
It is initialized from corresponding `ProtoProperty` in `ProtoChain`.

## Constructors

### constructor

• **new Property**(`propDef`)

Creates the property configuration object and copies values from `ProtoProperty`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `propDef` | [`ProtoProperty`](ProtoProperty.md) | ProtoProperty object |

#### Defined in

[src/core/internals/property.ts:103](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L103)

## Properties

### binding

• `Optional` **binding**: [`Binding`](Binding.md) = `undefined`

#### Defined in

[src/core/internals/property.ts:92](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L92)

___

### notify

• **notify**: `boolean` = `true`

#### Defined in

[src/core/internals/property.ts:96](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L96)

___

### observe

• **observe**: `boolean` = `false`

#### Defined in

[src/core/internals/property.ts:98](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L98)

___

### reflect

• **reflect**: `ReflectType` = `0`

#### Defined in

[src/core/internals/property.ts:94](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L94)

___

### type

• `Optional` **type**: `Constructor` = `undefined`

#### Defined in

[src/core/internals/property.ts:90](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L90)

___

### value

• `Optional` **value**: `any` = `undefined`

#### Defined in

[src/core/internals/property.ts:88](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L88)
