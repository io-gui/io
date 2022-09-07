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

[src/core/internals/property.ts:93](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L93)

## Properties

### binding

• `Optional` **binding**: [`Binding`](Binding.md) = `undefined`

#### Defined in

[src/core/internals/property.ts:82](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L82)

___

### notify

• **notify**: `boolean` = `true`

#### Defined in

[src/core/internals/property.ts:86](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L86)

___

### observe

• **observe**: `boolean` = `false`

#### Defined in

[src/core/internals/property.ts:88](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L88)

___

### reflect

• **reflect**: `ReflectType` = `0`

#### Defined in

[src/core/internals/property.ts:84](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L84)

___

### type

• `Optional` **type**: `Constructor` = `undefined`

#### Defined in

[src/core/internals/property.ts:80](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L80)

___

### value

• `Optional` **value**: `any` = `undefined`

#### Defined in

[src/core/internals/property.ts:78](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L78)
