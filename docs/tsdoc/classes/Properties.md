# Class: Properties

Collection of all property configurations and values for a class **instance** compied from corresponding `ProtoProperties`.
It also takes care of attribute reflections, binding connections and queue dispatch scheduling.

## Constructors

### constructor

• **new Properties**(`node`, `protoProps`)

Creates the properties for specified `IoNode`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `any` | Owner IoNode instance. |
| `protoProps` | [`ProtoProperties`](ProtoProperties.md) | ProtoProperties object. |

#### Defined in

[core/internals/properties.ts:171](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/properties.ts#L171)

## Methods

### connect

▸ **connect**(): `void`

Connects all property bindings and `IoNode` properties.

#### Returns

`void`

#### Defined in

[core/internals/properties.ts:285](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/properties.ts#L285)

___

### disconnect

▸ **disconnect**(): `void`

Disconnects all property bindings and `IoNode` properties.

#### Returns

`void`

#### Defined in

[core/internals/properties.ts:305](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/properties.ts#L305)

___

### dispose

▸ **dispose**(): `void`

Disconnects all property bindings and `IoNode` properties.
Use this when properties are no loner needed.

#### Returns

`void`

#### Defined in

[core/internals/properties.ts:332](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/properties.ts#L332)

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

[core/internals/properties.ts:204](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/properties.ts#L204)

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

[core/internals/properties.ts:213](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/properties.ts#L213)
