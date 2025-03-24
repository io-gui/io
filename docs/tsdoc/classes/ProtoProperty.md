[**io-gui**](../README.md)

***

# Class: ProtoProperty

Defined in: [src/core/internals/property.ts:37](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L37)

Instantiates a property definition object from a loosely or strongly typed property definition.
It facilitates merging of inherited property definitions from the prototype chain.

## Constructors

### new ProtoProperty()

> **new ProtoProperty**(`def`): [`ProtoProperty`](ProtoProperty.md)

Defined in: [src/core/internals/property.ts:57](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L57)

Creates a property definition from various input types.

#### Parameters

##### def

[`PropertyDefinitionLoose`](../type-aliases/PropertyDefinitionLoose.md)

Input definition which can be:
- `undefined` or `null`: Sets as value
- `Constructor`: Sets as type
- `Binding`: Sets value from binding and stores binding reference
- `PropertyDefinition`: Copies all defined fields
- Other values: Sets as value

#### Returns

[`ProtoProperty`](ProtoProperty.md)

#### Example

```ts
new ProtoProperty(String) // {type: String}
new ProtoProperty('hello') // {value: 'hello'}
new ProtoProperty({value: 42, type: Number}) // {value: 42, type: Number}
new ProtoProperty(new Binding(node, 'value')) // {value: node.value, binding: ...}
```

## Properties

### binding?

> `optional` **binding**: [`Binding`](Binding.md)

Defined in: [src/core/internals/property.ts:40](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L40)

Binding object for two-way data synchronization.

***

### init?

> `optional` **init**: `any`

Defined in: [src/core/internals/property.ts:42](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L42)

Initialization arguments for constructing initial values.

***

### reflect?

> `optional` **reflect**: `boolean`

Defined in: [src/core/internals/property.ts:41](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L41)

Whether to reflect the property to an HTML attribute.

***

### type?

> `optional` **type**: [`Constructor`](../type-aliases/Constructor.md)

Defined in: [src/core/internals/property.ts:39](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L39)

Constructor function defining the property's type.

***

### value?

> `optional` **value**: `any`

Defined in: [src/core/internals/property.ts:38](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L38)

The property's value. Can be any type.

## Methods

### assign()

> **assign**(`protoProp`): `void`

Defined in: [src/core/internals/property.ts:83](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L83)

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

Defined in: [src/core/internals/property.ts:98](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L98)

Creates a serializable representation of the property definition.
Handles special cases for better JSON serialization:
- Converts object values to their constructor names
- Converts function types to their names
- Only includes defined fields

#### Returns

`any`

A plain object suitable for JSON serialization
