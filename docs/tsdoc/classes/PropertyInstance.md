[**io-gui**](../README.md)

***

# Class: PropertyInstance

Defined in: [src/core/internals/property.ts:133](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L133)

PropertyInstance object constructed from `ProtoProperty`.

## Constructors

### new PropertyInstance()

> **new PropertyInstance**(`node`, `propDef`): [`PropertyInstance`](PropertyInstance.md)

Defined in: [src/core/internals/property.ts:149](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L149)

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

Defined in: [src/core/internals/property.ts:139](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L139)

***

### init?

> `optional` **init**: `any` = `undefined`

Defined in: [src/core/internals/property.ts:143](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L143)

***

### reflect

> **reflect**: `boolean` = `false`

Defined in: [src/core/internals/property.ts:141](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L141)

***

### type?

> `optional` **type**: [`Constructor`](../type-aliases/Constructor.md)

Defined in: [src/core/internals/property.ts:137](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L137)

***

### value?

> `optional` **value**: `any` = `undefined`

Defined in: [src/core/internals/property.ts:135](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L135)
