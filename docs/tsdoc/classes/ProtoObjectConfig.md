[io-gui](../README.md) / ProtoObjectConfig

# Class: ProtoObjectConfig

## Hierarchy

- `Map`\<[`Constructor`](../README.md#constructor), `Map`\<`PropertyTypeKey`, [`VDOMArray`](../README.md#vdomarray)\>\>

  ↳ **`ProtoObjectConfig`**

## Table of contents

### Constructors

- [constructor](ProtoObjectConfig.md#constructor)

### Methods

- [getObjectConfig](ProtoObjectConfig.md#getobjectconfig)

## Constructors

### constructor

• **new ProtoObjectConfig**(`constructors`): [`ProtoObjectConfig`](ProtoObjectConfig.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `constructors` | [`IoPropertiesConstructor`](../interfaces/IoPropertiesConstructor.md)\<`any`\>[] |

#### Returns

[`ProtoObjectConfig`](ProtoObjectConfig.md)

#### Overrides

Map\&lt;Constructor, Map\&lt;PropertyTypeKey, VDOMArray\&gt;\&gt;.constructor

#### Defined in

[src/elements/object/io-properties.ts:17](https://github.com/io-gui/io/blob/main/src/elements/object/io-properties.ts#L17)

## Methods

### getObjectConfig

▸ **getObjectConfig**(`object`): `undefined` \| `Record`\<`string`, [`VDOMArray`](../README.md#vdomarray)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `object` | `object` |

#### Returns

`undefined` \| `Record`\<`string`, [`VDOMArray`](../README.md#vdomarray)\>

#### Defined in

[src/elements/object/io-properties.ts:43](https://github.com/io-gui/io/blob/main/src/elements/object/io-properties.ts#L43)
