[io-gui](../README.md) / ProtoChain

# Class: ProtoChain

Internal utility class that contains usefull information about class inheritance.
Inherited information is aggregated during prototype chain traversal in `Register()`.

## Table of contents

### Constructors

- [constructor](ProtoChain.md#constructor)

### Properties

- [constructors](ProtoChain.md#constructors)
- [functions](ProtoChain.md#functions)
- [listeners](ProtoChain.md#listeners)
- [observedObjectProperties](ProtoChain.md#observedobjectproperties)
- [properties](ProtoChain.md#properties)
- [style](ProtoChain.md#style)

### Methods

- [autobindFunctions](ProtoChain.md#autobindfunctions)

## Constructors

### constructor

• **new ProtoChain**(`ioNodeConstructor`): [`ProtoChain`](ProtoChain.md)

Creates an instance of `ProtoChain` for specified class constructor.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ioNodeConstructor` | [`IoNodeConstructor`](../interfaces/IoNodeConstructor.md)\<`any`\> | Owner `IoNode`-derived constructor. |

#### Returns

[`ProtoChain`](ProtoChain.md)

#### Defined in

[src/core/internals/protoChain.ts:38](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L38)

## Properties

### constructors

• `Readonly` **constructors**: [`IoNodeConstructor`](../interfaces/IoNodeConstructor.md)\<`any`\>[] = `[]`

Array of inherited class constructors ending with `HTMLElement`, `Object` or `Array`.

#### Defined in

[src/core/internals/protoChain.ts:13](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L13)

___

### functions

• `Readonly` **functions**: `string`[] = `[]`

Array of function names that start with "on" or "_" for auto-binding.

#### Defined in

[src/core/internals/protoChain.ts:17](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L17)

___

### listeners

• `Readonly` **listeners**: `Object` = `{}`

Aggregated listener declarations declared in `static get Listeners()` return ojects.

#### Index signature

▪ [property: `string`]: [`ListenerDeclaration`](../README.md#listenerdeclaration)[]

#### Defined in

[src/core/internals/protoChain.ts:25](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L25)

___

### observedObjectProperties

• `Readonly` **observedObjectProperties**: `string`[] = `[]`

Array of property names of observed object properties.

#### Defined in

[src/core/internals/protoChain.ts:33](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L33)

___

### properties

• `Readonly` **properties**: `Object` = `{}`

Aggregated property declarations declared in `static get Properties()` return ojects.

#### Index signature

▪ [property: `string`]: [`ProtoProperty`](ProtoProperty.md)

#### Defined in

[src/core/internals/protoChain.ts:21](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L21)

___

### style

• `Readonly` **style**: `string` = `''`

Aggregated CSS style declarations declared in `static get Style()` return strings.

#### Defined in

[src/core/internals/protoChain.ts:29](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L29)

## Methods

### autobindFunctions

▸ **autobindFunctions**(`node`): `void`

Binds all auto-binding functions from the `.functions` array to specified `IoNode`-derived instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | `IoNode` instance to bind functions to. |

#### Returns

`void`

#### Defined in

[src/core/internals/protoChain.ts:137](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L137)
