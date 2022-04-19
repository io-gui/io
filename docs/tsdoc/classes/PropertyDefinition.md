# Class: PropertyDefinition

Property definition class

## Constructors

### constructor

• **new PropertyDefinition**(`def`)

Takes a weakly typed property definition and returns a strongly typed property definition.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `def` | [`PropertyDefinitionWeak`](../README.md#propertydefinitionweak) | Weakly typed property definition |

#### Defined in

[core/internals/property.ts:29](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L29)

## Properties

### binding

• `Optional` **binding**: [`Binding`](Binding.md)

#### Defined in

[core/internals/property.ts:21](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L21)

___

### notify

• **notify**: `boolean` = `true`

#### Defined in

[core/internals/property.ts:23](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L23)

___

### observe

• **observe**: `boolean` = `false`

#### Defined in

[core/internals/property.ts:24](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L24)

___

### reflect

• **reflect**: `ReflectType` = `0`

#### Defined in

[core/internals/property.ts:22](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L22)

___

### type

• `Optional` **type**: `AnyConstructor`

#### Defined in

[core/internals/property.ts:20](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L20)

___

### value

• `Optional` **value**: `any`

#### Defined in

[core/internals/property.ts:19](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L19)
