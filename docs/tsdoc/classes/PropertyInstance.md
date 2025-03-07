[**io-gui**](../README.md)

***

[io-gui](../README.md) / PropertyInstance

# Class: PropertyInstance

Defined in: [src/core/internals/property.ts:97](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L97)

PropertyInstance object constructed from `ProtoProperty`.

## Constructors

### new PropertyInstance()

> **new PropertyInstance**(`node`, `propDef`): [`PropertyInstance`](PropertyInstance.md)

Defined in: [src/core/internals/property.ts:117](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L117)

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

Defined in: [src/core/internals/property.ts:103](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L103)

***

### init?

> `optional` **init**: `any` = `undefined`

Defined in: [src/core/internals/property.ts:111](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L111)

***

### observe

> **observe**: `boolean` = `false`

Defined in: [src/core/internals/property.ts:109](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L109)

***

### reactive

> **reactive**: `boolean` = `true`

Defined in: [src/core/internals/property.ts:107](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L107)

***

### reflect

> **reflect**: `boolean` = `false`

Defined in: [src/core/internals/property.ts:105](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L105)

***

### type?

> `optional` **type**: [`Constructor`](../type-aliases/Constructor.md)

Defined in: [src/core/internals/property.ts:101](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L101)

***

### value?

> `optional` **value**: `any` = `undefined`

Defined in: [src/core/internals/property.ts:99](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L99)
