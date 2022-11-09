# Class: ProtoChain

Internal utility class that contains usefull information about class inheritance.
Inherited information is aggregated during prototype chain traversal in `RegisterIoNode()`.

## Constructors

### constructor

**new ProtoChain**(`ioNodeConstructor`)

Creates an instance of `ProtoChain` for specified class constructor.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ioNodeConstructor` | [`IoNodeConstructor`](../interfaces/IoNodeConstructor.md)<`any`\> | Owner `IoNode`-derived constructor. |

#### Defined in

[src/core/internals/protoChain.ts:38](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L38)

## Properties

### constructors

 `Readonly` **constructors**: [`IoNodeConstructor`](../interfaces/IoNodeConstructor.md)<`any`\>[] = `[]`

#### Defined in

[src/core/internals/protoChain.ts:13](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L13)

___

### functions

 `Readonly` **functions**: `string`[] = `[]`

#### Defined in

[src/core/internals/protoChain.ts:17](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L17)

___

### listeners

 `Readonly` **listeners**: `Object` = `{}`

#### Index signature

▪ [property: `string`]: [`ListenerDeclaration`](../README.md#listenerdeclaration)[]

#### Defined in

[src/core/internals/protoChain.ts:25](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L25)

___

### observedObjectProperties

 `Readonly` **observedObjectProperties**: `string`[] = `[]`

#### Defined in

[src/core/internals/protoChain.ts:33](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L33)

___

### properties

 `Readonly` **properties**: `Object` = `{}`

#### Index signature

▪ [property: `string`]: [`ProtoProperty`](ProtoProperty.md)

#### Defined in

[src/core/internals/protoChain.ts:21](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L21)

___

### style

 `Readonly` **style**: `string` = `''`

#### Defined in

[src/core/internals/protoChain.ts:29](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L29)

## Methods

### autobindFunctions

**autobindFunctions**(`node`): `void`

Binds all auto-binding functions from the `.functions` array to specified `IoNode`-derived instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | `IoNode` instance to bind functions to. |

#### Returns

`void`

#### Defined in

[src/core/internals/protoChain.ts:120](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L120)
