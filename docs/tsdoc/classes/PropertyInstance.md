[**io-gui**](../README.md)

***

# Class: PropertyInstance

Defined in: [src/core/internals/property.ts:110](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L110)

PropertyInstance object constructed from `ProtoProperty`.

## Constructors

### new PropertyInstance()

> **new PropertyInstance**(`node`, `propDef`): [`PropertyInstance`](PropertyInstance.md)

Defined in: [src/core/internals/property.ts:128](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L128)

Creates the property configuration object and copies values from `ProtoProperty`.

#### Parameters

##### node

[`IoNode`](IoNode.md)

owner IoNode instance

##### propDef

[`ProtoProperty`](ProtoProperty.md)

ProtoProperty object

#### Returns

[`PropertyInstance`](PropertyInstance.md)

## Properties

### binding?

> `optional` **binding**: [`Binding`](Binding.md)

Defined in: [src/core/internals/property.ts:116](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L116)

***

### init?

> `optional` **init**: `any` = `undefined`

Defined in: [src/core/internals/property.ts:122](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L122)

***

### reactive

> **reactive**: `boolean` = `true`

Defined in: [src/core/internals/property.ts:120](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L120)

***

### reflect

> **reflect**: `boolean` = `false`

Defined in: [src/core/internals/property.ts:118](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L118)

***

### type?

> `optional` **type**: [`Constructor`](../type-aliases/Constructor.md)

Defined in: [src/core/internals/property.ts:114](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L114)

***

### value?

> `optional` **value**: `any` = `undefined`

Defined in: [src/core/internals/property.ts:112](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L112)
