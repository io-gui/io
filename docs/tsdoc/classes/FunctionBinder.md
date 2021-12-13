# Class: FunctionBinder

An array of all inherited function names from a prototype chain that start with "on" or "_".
It provides a utility function `.bind(node)` that binds the functions to the specified instance of `IoNode`.

## Hierarchy

- `Array`<`string`\>

  ↳ **`FunctionBinder`**

## Constructors

### constructor

• **new FunctionBinder**(`protochain`)

Initializes the array of all inherited function names from a prototype chain that start with "on" or "_".

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `protochain` | [`ProtoChain`](ProtoChain.md) | Array of protochain constructors. |

#### Overrides

Array&lt;string\&gt;.constructor

#### Defined in

[core/internals/functionBinder.ts:13](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/functionBinder.ts#L13)

## Methods

### bind

▸ **bind**(`node`): `void`

Binds all functions to specified instance of `IoNode`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | `IoNode` instance to bind functions to. |

#### Returns

`void`

#### Defined in

[core/internals/functionBinder.ts:35](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/functionBinder.ts#L35)
