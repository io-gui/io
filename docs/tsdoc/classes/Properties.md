# Class: Properties

Collection of all property configurations and values for a class **instance** compied from corresponding `ProtoProperties`.
It also takes care of attribute reflections, binding connections and queue dispatch scheduling.

## Constructors

### constructor

• **new Properties**(`node`)

Creates the properties for specified `IoNode`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `any` | Owner IoNode instance. |

#### Defined in

[core/internals/properties.ts:182](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/properties.ts#L182)

## Methods

### connect

▸ **connect**(): `void`

Connects all property bindings and `IoNode` properties.

#### Returns

`void`

#### Defined in

[core/internals/properties.ts:297](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/properties.ts#L297)

___

### disconnect

▸ **disconnect**(): `void`

Disconnects all property bindings and `IoNode` properties.

#### Returns

`void`

#### Defined in

[core/internals/properties.ts:317](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/properties.ts#L317)

___

### dispose

▸ **dispose**(): `void`

Disconnects all property bindings and `IoNode` properties.
Use this when properties are no loner needed.

#### Returns

`void`

#### Defined in

[core/internals/properties.ts:344](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/properties.ts#L344)

___

### get

▸ **get**(`key`): `any`

Returns the property value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | property name to get value of. |

#### Returns

`any`

Peroperty value.

#### Defined in

[core/internals/properties.ts:216](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/properties.ts#L216)

___

### set

▸ **set**(`key`, `value`, `skipDispatch?`): `void`

Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | Property name to set value of. |
| `value` | `any` | Peroperty value. |
| `skipDispatch?` | `boolean` | - |

#### Returns

`void`

#### Defined in

[core/internals/properties.ts:225](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/properties.ts#L225)
