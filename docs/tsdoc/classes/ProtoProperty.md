# Class: ProtoProperty

Property definition class

## Constructors

### constructor

• **new ProtoProperty**(`def`)

Takes a weakly typed property definition and returns a strongly typed property definition.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `def` | [`PropertyDefinitionWeak`](../README.md#propertydefinitionweak) | Weakly typed property definition |

#### Defined in

[src/core/internals/property.ts:31](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L31)

## Properties

### binding

• `Optional` **binding**: [`Binding`](Binding.md)

#### Defined in

[src/core/internals/property.ts:23](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L23)

___

### notify

• **notify**: `boolean` = `true`

#### Defined in

[src/core/internals/property.ts:25](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L25)

___

### observe

• **observe**: `boolean` = `false`

#### Defined in

[src/core/internals/property.ts:26](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L26)

___

### reflect

• **reflect**: `ReflectType` = `0`

#### Defined in

[src/core/internals/property.ts:24](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L24)

___

### type

• `Optional` **type**: `Constructor`

#### Defined in

[src/core/internals/property.ts:22](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L22)

___

### value

• `Optional` **value**: `any`

#### Defined in

[src/core/internals/property.ts:21](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L21)
