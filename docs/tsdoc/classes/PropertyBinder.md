# Class: PropertyBinder

Manager for property bindings. It holds all bindings for a particular IoNode.

## Constructors

### constructor

• **new PropertyBinder**(`node`)

Creates binding manager for the specified node.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | Owner node. |

#### Defined in

[core/internals/propertyBinder.ts:167](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/propertyBinder.ts#L167)

## Methods

### bind

▸ **bind**(`property`): [`Binding`](Binding.md)

Returns a binding to the specified property name or creates one if it does not exist.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `property` | `string` | Property to bind. |

#### Returns

[`Binding`](Binding.md)

Property binding object.

#### Defined in

[core/internals/propertyBinder.ts:177](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/propertyBinder.ts#L177)

___

### dispose

▸ **dispose**(): `void`

Disposes all bindings. Use this when node is no longer needed.

#### Returns

`void`

#### Defined in

[core/internals/propertyBinder.ts:192](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/propertyBinder.ts#L192)

___

### unbind

▸ **unbind**(`property`): `void`

Removes a binding for the specified property name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `property` | `string` | Property to unbind. |

#### Returns

`void`

#### Defined in

[core/internals/propertyBinder.ts:185](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/propertyBinder.ts#L185)
