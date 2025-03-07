[**io-gui**](../README.md)

***

[io-gui](../README.md) / ProtoChain

# Class: ProtoChain

Defined in: [src/core/internals/protoChain.ts:15](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L15)

Internal utility class that contains usefull information about class inheritance.
Inherited information is aggregated during prototype chain traversal in `Register()`.

## Constructors

### new ProtoChain()

> **new ProtoChain**(`ioNodeConstructor`): [`ProtoChain`](ProtoChain.md)

Defined in: [src/core/internals/protoChain.ts:44](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L44)

Creates an instance of `ProtoChain` for specified class constructor.

#### Parameters

##### ioNodeConstructor

[`IoNodeConstructor`](../interfaces/IoNodeConstructor.md)\<`any`\>

Owner `IoNode`-derived constructor.

#### Returns

[`ProtoChain`](ProtoChain.md)

## Properties

### constructors

> `readonly` **constructors**: `ProtoConstructors` = `[]`

Defined in: [src/core/internals/protoChain.ts:19](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L19)

Array of inherited class constructors ending with `HTMLElement`, `Object` or `Array`.

***

### functions

> `readonly` **functions**: `ProtoFunctions` = `[]`

Defined in: [src/core/internals/protoChain.ts:23](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L23)

Array of function names that start with "on" or "_" for auto-binding.

***

### listeners

> `readonly` **listeners**: `ProtoListeners` = `{}`

Defined in: [src/core/internals/protoChain.ts:31](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L31)

Aggregated listener definition declared in `static get Listeners()` return ojects.

***

### observedObjectProperties

> `readonly` **observedObjectProperties**: `string`[] = `[]`

Defined in: [src/core/internals/protoChain.ts:39](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L39)

Array of property names of observed object properties.

***

### properties

> `readonly` **properties**: `ProtoProperties` = `{}`

Defined in: [src/core/internals/protoChain.ts:27](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L27)

Aggregated property definition declared in `static get Properties()` return ojects.

***

### styles

> `readonly` **styles**: `string` = `''`

Defined in: [src/core/internals/protoChain.ts:35](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L35)

Aggregated CSS style definition declared in `static get Style()` return strings.

## Methods

### assignListenerDefinition()

> **assignListenerDefinition**(`lsnName`, `newListenerDefinition`): `void`

Defined in: [src/core/internals/protoChain.ts:147](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L147)

Assigns source listener definition to an existing array of listener definitions.

#### Parameters

##### lsnName

name of the listener

`string` | `number`

##### newListenerDefinition

[`ListenerDefinition`](../type-aliases/ListenerDefinition.md)

Source listener definition

#### Returns

`void`

***

### autobindFunctions()

> **autobindFunctions**(`node`): `void`

Defined in: [src/core/internals/protoChain.ts:162](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L162)

Binds all auto-binding functions from the `.functions` array to specified `IoNode`-derived instance.

#### Parameters

##### node

[`IoNode`](IoNode.md)

`IoNode` instance to bind functions to.

#### Returns

`void`
