# Class: ProtoChain

Internal utility class that contains usefull information about class inheritance such as:
- Array of inherited class constructors ending with `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`
- Array of function names that start with "on" or "_" for auto-binding
- Property definitions declared in `static get Properties()` return oject
- Listener definitions declared in `static get Listeners()` return oject
- CSS style definitions declared in `static get Style()` return string
- Array of property names of observed object properties

Inherited definitions are aggregated additively during prototype chain traversal in `IoNode`.

## Constructors

### constructor

• **new ProtoChain**(`ioNodeClass`)

Creates an instance of `ProtoChain`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ioNodeClass` | [`IoNodeConstructor`](../interfaces/IoNodeConstructor.md)<`any`\> | Owner `IoNode`-derived class. |

#### Defined in

[src/core/internals/protoChain.ts:45](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L45)

## Properties

### constructors

• `Readonly` **constructors**: [`IoNodeConstructor`](../interfaces/IoNodeConstructor.md)<`any`\>[] = `[]`

#### Defined in

[src/core/internals/protoChain.ts:20](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L20)

___

### functions

• `Readonly` **functions**: `string`[] = `[]`

#### Defined in

[src/core/internals/protoChain.ts:24](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L24)

___

### listeners

• `Readonly` **listeners**: `Object` = `{}`

#### Index signature

▪ [property: `string`]: [`ListenerDefinition`](../README.md#listenerdefinition)[]

#### Defined in

[src/core/internals/protoChain.ts:32](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L32)

___

### observedObjects

• `Readonly` **observedObjects**: `string`[] = `[]`

#### Defined in

[src/core/internals/protoChain.ts:40](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L40)

___

### properties

• `Readonly` **properties**: `Object` = `{}`

#### Index signature

▪ [property: `string`]: [`ProtoProperty`](ProtoProperty.md)

#### Defined in

[src/core/internals/protoChain.ts:28](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L28)

___

### style

• `Readonly` **style**: `string` = `''`

#### Defined in

[src/core/internals/protoChain.ts:36](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L36)

## Methods

### bindFunctions

▸ **bindFunctions**(`node`): `void`

Binds all auto-binding functions from the `.functions` array to specified `IoNode`-derived instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | `IoNode` instance to bind functions to. |

#### Returns

`void`

#### Defined in

[src/core/internals/protoChain.ts:121](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L121)
