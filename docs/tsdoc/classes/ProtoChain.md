# Class: ProtoChain

An array of all contructors from the prototype chain.

## Hierarchy

- `Array`<`Constructor`<`any`[]\>\>

  ↳ **`ProtoChain`**

## Constructors

### constructor

• **new ProtoChain**(`constructor`)

Creates an array of inherited contructors by traversing down the prototype chain of the specified contructor and adds each contructor to itself.
It terminates when prototype chain before it reaches `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `constructor` | `Constructor`<`any`\> | Prototype object. |

#### Overrides

Array&lt;Constructor&lt;any[]\&gt;\&gt;.constructor

#### Defined in

[core/internals/protoChain.ts:12](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/protoChain.ts#L12)
