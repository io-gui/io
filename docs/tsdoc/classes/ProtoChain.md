# Class: ProtoChain

Automatically generated array of all contructors inherited from the prototype chain.
An array of all inherited function names from a prototype chain that start with "on" or "_".
It provides a utility function `.bind(node)` that binds the functions to the specified instance of `IoNode`.

## Constructors

### constructor

• **new ProtoChain**(`constructor`)

Creates an array of inherited contructors by traversing down the prototype chain of the specified contructor and adds each contructor to itself.
It terminates the prototype chain before it reaches `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.
Initializes the array of all inherited function names from a prototype chain that start with "on" or "_".

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `constructor` | `Constructor`<`any`\> | Prototype object. |

#### Defined in

[core/internals/protoChain.ts:19](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L19)

## Properties

### constructors

• **constructors**: `Constructor`<`any`[]\>[] = `[]`

#### Defined in

[core/internals/protoChain.ts:11](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L11)

___

### functions

• **functions**: `string`[] = `[]`

#### Defined in

[core/internals/protoChain.ts:12](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L12)

## Methods

### bindFunctions

▸ **bindFunctions**(`node`): `void`

Binds all functions to specified instance of `IoNode`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | `IoNode` instance to bind functions to. |

#### Returns

`void`

#### Defined in

[core/internals/protoChain.ts:49](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L49)
