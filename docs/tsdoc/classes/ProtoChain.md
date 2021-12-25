# Class: ProtoChain

Internal utility class that contains usefull information about inherited constructors, function names, properties, listeners,
as well as some utility functions. Inherited information is gathered automatically by prototype chain traversal
that terminates at `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.

## Constructors

### constructor

• **new ProtoChain**(`nodeConstructor`)

Creates an instance of `ProtoChain` and initializes the arrays of inherited contructors, function names, properties and listeners.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodeConstructor` | [`IoNodeConstructor`](../interfaces/IoNodeConstructor.md)<`any`\> | Prototype object. |

#### Defined in

[core/internals/protoChain.ts:35](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L35)

## Properties

### constructors

• `Readonly` **constructors**: [`IoNodeConstructor`](../interfaces/IoNodeConstructor.md)<`any`\>[] = `[]`

#### Defined in

[core/internals/protoChain.ts:14](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L14)

___

### functions

• `Readonly` **functions**: `string`[] = `[]`

#### Defined in

[core/internals/protoChain.ts:18](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L18)

___

### listeners

• `Readonly` **listeners**: `Object` = `{}`

#### Index signature

▪ [property: `string`]: [`ListenerDefinition`](../README.md#listenerdefinition)[]

#### Defined in

[core/internals/protoChain.ts:28](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L28)

___

### properties

• `Readonly` **properties**: `Object` = `{}`

#### Index signature

▪ [property: `string`]: [`PropertyDefinition`](../README.md#propertydefinition)

#### Defined in

[core/internals/protoChain.ts:22](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L22)

## Methods

### bindFunctions

▸ **bindFunctions**(`node`): `void`

Binds all functions from the `.functions` list to specified instance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | `IoNode` instance to bind functions to. |

#### Returns

`void`

#### Defined in

[core/internals/protoChain.ts:89](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L89)

___

### dispose

▸ **dispose**(): `void`

#### Returns

`void`

#### Defined in

[core/internals/protoChain.ts:94](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L94)
