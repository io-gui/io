[**io-gui**](../README.md)

***

# Class: ProtoProperty

Defined in: [src/core/internals/property.ts:24](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L24)

Finalized property definition created from property definition.

## Constructors

### new ProtoProperty()

> **new ProtoProperty**(`def`): [`ProtoProperty`](ProtoProperty.md)

Defined in: [src/core/internals/property.ts:35](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L35)

Takes a loosely typed property definition and returns full property definition with unscpecified fileds inferred.

#### Parameters

##### def

[`PropertyDefinitionLoose`](../type-aliases/PropertyDefinitionLoose.md)

Loosely typed property definition

#### Returns

[`ProtoProperty`](ProtoProperty.md)

## Properties

### binding?

> `optional` **binding**: [`Binding`](Binding.md)

Defined in: [src/core/internals/property.ts:27](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L27)

***

### init?

> `optional` **init**: `any`

Defined in: [src/core/internals/property.ts:30](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L30)

***

### reactive?

> `optional` **reactive**: `boolean`

Defined in: [src/core/internals/property.ts:29](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L29)

***

### reflect?

> `optional` **reflect**: `boolean`

Defined in: [src/core/internals/property.ts:28](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L28)

***

### type?

> `optional` **type**: [`Constructor`](../type-aliases/Constructor.md)

Defined in: [src/core/internals/property.ts:26](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L26)

***

### value?

> `optional` **value**: `any`

Defined in: [src/core/internals/property.ts:25](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L25)

## Methods

### assign()

> **assign**(`protoProp`): `void`

Defined in: [src/core/internals/property.ts:64](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L64)

Assigns values of another ProtoProperty to itself, unless they are default values.

#### Parameters

##### protoProp

[`ProtoProperty`](ProtoProperty.md)

Source ProtoProperty

#### Returns

`void`

***

### toJSON()

> **toJSON**(): `any`

Defined in: [src/core/internals/property.ts:72](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L72)

#### Returns

`any`
