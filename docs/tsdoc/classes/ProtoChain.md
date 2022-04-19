# Class: ProtoChain

Internal utility class that contains usefull information about class inheritance such as:
- Array of inherited class constructors ending with `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`
- Array of function names that start with "on" or "_" for auto-binding
- Property definitions declared in `static get Properties()` return oject
- Listener definitions declared in `static get Listeners()` return oject
- CSS style string declared in `static get Style()` return string
- Array of property names of observed object properties

Inherited information is aggregated automatically by prototype chain traversal that
It collects information from inhertited classes specified in static getters in an additive manner,
respecting the order of inheritance.

## Constructors

### constructor

• **new ProtoChain**(`ioNodeClass`)

Creates an instance of `ProtoChain`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ioNodeClass` | [`IoNodeConstructor`](../interfaces/IoNodeConstructor.md)<`any`\> | Owner `IoNode`-derived class. |

#### Defined in

[core/internals/protoChain.ts:47](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L47)

## Properties

### constructors

• `Readonly` **constructors**: [`IoNodeConstructor`](../interfaces/IoNodeConstructor.md)<`any`\>[] = `[]`

#### Defined in

[core/internals/protoChain.ts:22](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L22)

___

### functions

• `Readonly` **functions**: `string`[] = `[]`

#### Defined in

[core/internals/protoChain.ts:26](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L26)

___

### listeners

• `Readonly` **listeners**: `Object` = `{}`

#### Index signature

▪ [property: `string`]: [`ListenerDefinition`](../README.md#listenerdefinition)[]

#### Defined in

[core/internals/protoChain.ts:34](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L34)

___

### observedObjects

• `Readonly` **observedObjects**: `string`[] = `[]`

#### Defined in

[core/internals/protoChain.ts:42](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L42)

___

### properties

• `Readonly` **properties**: `Object` = `{}`

#### Index signature

▪ [property: `string`]: [`PropertyDefinition`](PropertyDefinition.md)

#### Defined in

[core/internals/protoChain.ts:30](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L30)

___

### style

• `Readonly` **style**: `string` = `''`

#### Defined in

[core/internals/protoChain.ts:38](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L38)

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

[core/internals/protoChain.ts:121](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L121)
