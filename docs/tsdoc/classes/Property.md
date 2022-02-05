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

[core/internals/property.ts:116](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L116)

## Properties

### binding

• `Optional` **binding**: [`Binding`](Binding.md) = `undefined`

#### Defined in

[core/internals/property.ts:99](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L99)

___

### enumerable

• **enumerable**: `boolean` = `true`

#### Defined in

[core/internals/property.ts:111](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L111)

___

### notify

• **notify**: `boolean` = `true`

#### Defined in

[core/internals/property.ts:103](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L103)

___

### observe

• **observe**: `boolean` = `false`

#### Defined in

[core/internals/property.ts:105](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L105)

___

### readonly

• **readonly**: `boolean` = `false`

#### Defined in

[core/internals/property.ts:107](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L107)

___

### reflect

• **reflect**: `ReflectType` = `0`

#### Defined in

[core/internals/property.ts:101](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L101)

___

### strict

• **strict**: `boolean` = `false`

#### Defined in

[core/internals/property.ts:109](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L109)

___

### type

• `Optional` **type**: `AnyConstructor` = `undefined`

#### Defined in

[core/internals/property.ts:97](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L97)

___

### value

• `Optional` **value**: `any` = `undefined`

#### Defined in

[core/internals/property.ts:95](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L95)
