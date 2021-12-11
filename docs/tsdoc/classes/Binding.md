# Class: Binding

Binding object. It manages data binding between source and targets using `[property]-changed` events.

## Constructors

### constructor

• **new Binding**(`node`, `property`)

Creates a binding object for specified `node` and `property`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | Property owner node. |
| `property` | `string` | Name of the property. |

#### Defined in

[core/propertyBinder.ts:18](https://github.com/io-gui/iogui/blob/tsc/src/core/propertyBinder.ts#L18)

## Accessors

### value

• `get` **value**(): `any`

#### Returns

`any`

#### Defined in

[core/propertyBinder.ts:34](https://github.com/io-gui/iogui/blob/tsc/src/core/propertyBinder.ts#L34)

• `set` **value**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Defined in

[core/propertyBinder.ts:31](https://github.com/io-gui/iogui/blob/tsc/src/core/propertyBinder.ts#L31)

## Methods

### addTarget

▸ **addTarget**(`node`, `property`, `__nodeProperties?`): `void`

Adds a target `node` and `targetProp` and corresponding `[property]-changed` listener, unless already added.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | Target node. |
| `property` | `string` | Target property. |
| `__nodeProperties?` | [`Properties`](Properties.md) | List of target property names. |

#### Returns

`void`

#### Defined in

[core/propertyBinder.ts:43](https://github.com/io-gui/iogui/blob/tsc/src/core/propertyBinder.ts#L43)

___

### dispose

▸ **dispose**(): `void`

Dispose of the binding by removing all targets and listeners.
Use this when node is no longer needed.

#### Returns

`void`

#### Defined in

[core/propertyBinder.ts:142](https://github.com/io-gui/iogui/blob/tsc/src/core/propertyBinder.ts#L142)

___

### removeTarget

▸ **removeTarget**(`node`, `property?`): `void`

Removes target `node` and `property` and corresponding `[property]-changed` listener.
If `property` is not specified, it removes all target properties.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | Target node. |
| `property?` | `string` | Target property. |

#### Returns

`void`

#### Defined in

[core/propertyBinder.ts:63](https://github.com/io-gui/iogui/blob/tsc/src/core/propertyBinder.ts#L63)
