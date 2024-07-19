[**io-gui**](../README.md) • **Docs**

***

[io-gui](../README.md) / PropertyInstance

# Class: PropertyInstance

PropertyInstance object constructed from `ProtoProperty`.

## Constructors

### new PropertyInstance()

> **new PropertyInstance**(`node`, `propDef`): [`PropertyInstance`](PropertyInstance.md)

Creates the property configuration object and copies values from `ProtoProperty`.

#### Parameters

• **node**: [`IoNode`](IoNode.md)

owner IoNode instance

• **propDef**: [`ProtoProperty`](ProtoProperty.md)

ProtoProperty object

#### Returns

[`PropertyInstance`](PropertyInstance.md)

#### Defined in

[src/core/internals/property.ts:118](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L118)

## Properties

### binding?

> `optional` **binding**: [`Binding`](Binding.md)

#### Defined in

[src/core/internals/property.ts:104](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L104)

***

### init?

> `optional` **init**: `any` = `undefined`

#### Defined in

[src/core/internals/property.ts:112](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L112)

***

### observe

> **observe**: `boolean` = `false`

#### Defined in

[src/core/internals/property.ts:110](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L110)

***

### reactive

> **reactive**: `boolean` = `true`

#### Defined in

[src/core/internals/property.ts:108](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L108)

***

### reflect

> **reflect**: `boolean` = `false`

#### Defined in

[src/core/internals/property.ts:106](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L106)

***

### type?

> `optional` **type**: [`Constructor`](../type-aliases/Constructor.md)

#### Defined in

[src/core/internals/property.ts:102](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L102)

***

### value?

> `optional` **value**: `any` = `undefined`

#### Defined in

[src/core/internals/property.ts:100](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L100)
