# Class: ProtoChain

An array of all inherited contructors from the prototype chain.

## Hierarchy

- `Array`<[`ProtoChainConstructor`](../README.md#protochainconstructor)<`any`[]\>\>

  ↳ **`ProtoChain`**

## Constructors

### constructor

• **new ProtoChain**(`classConstructor`)

Creates an array of inherited contructors by traversing down the prototype chain of the specified contructor and adds each contructor to itself.
It terminates when prototype chain before it reaches `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `classConstructor` | `any` | Prototype object. |

#### Overrides

Array&lt;ProtoChainConstructor&lt;any[]\&gt;\&gt;.constructor

#### Defined in

[core/protoChain.ts:12](https://github.com/io-gui/iogui/blob/tsc/src/core/protoChain.ts#L12)
