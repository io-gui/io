[**io-gui**](../README.md) • **Docs**

***

[io-gui](../README.md) / ProtoProperty

# Class: ProtoProperty

Finalized property definition created from property declaration.

## Constructors

### new ProtoProperty()

> **new ProtoProperty**(`def`): [`ProtoProperty`](ProtoProperty.md)

Takes a loosely typed property declaration and returns full property definition with unscpecified fileds inferred.

#### Parameters

• **def**: [`PropertyDeclarationLoose`](../type-aliases/PropertyDeclarationLoose.md)

Loosely typed property definition

#### Returns

[`ProtoProperty`](ProtoProperty.md)

#### Defined in

[src/core/internals/property.ts:38](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L38)

## Properties

### binding?

> `optional` **binding**: [`Binding`](Binding.md)

#### Defined in

[src/core/internals/property.ts:29](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L29)

***

### init?

> `optional` **init**: `any`

#### Defined in

[src/core/internals/property.ts:33](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L33)

***

### observe?

> `optional` **observe**: `boolean`

#### Defined in

[src/core/internals/property.ts:32](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L32)

***

### reactive?

> `optional` **reactive**: `boolean`

#### Defined in

[src/core/internals/property.ts:31](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L31)

***

### reflect?

> `optional` **reflect**: `boolean`

#### Defined in

[src/core/internals/property.ts:30](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L30)

***

### type?

> `optional` **type**: [`Constructor`](../type-aliases/Constructor.md)

#### Defined in

[src/core/internals/property.ts:28](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L28)

***

### value?

> `optional` **value**: `any`

#### Defined in

[src/core/internals/property.ts:27](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L27)

## Methods

### assign()

> **assign**(`protoProp`): `void`

Assigns values of another ProtoProperty to itself, unless they are default values.

#### Parameters

• **protoProp**: [`ProtoProperty`](ProtoProperty.md)

Source ProtoProperty

#### Returns

`void`

#### Defined in

[src/core/internals/property.ts:68](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L68)
