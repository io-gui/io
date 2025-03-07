[**io-gui**](../README.md)

***

[io-gui](../README.md) / ProtoObjectConfig

# Class: ProtoObjectConfig

Defined in: [src/elements/object/io-properties.ts:16](https://github.com/io-gui/io/blob/main/src/elements/object/io-properties.ts#L16)

## Extends

- `Map`\<[`Constructor`](../type-aliases/Constructor.md), `Map`\<`PropertyTypeKey`, [`VDOMArray`](../type-aliases/VDOMArray.md)\>\>

## Constructors

### new ProtoObjectConfig()

> **new ProtoObjectConfig**(`constructors`): [`ProtoObjectConfig`](ProtoObjectConfig.md)

Defined in: [src/elements/object/io-properties.ts:17](https://github.com/io-gui/io/blob/main/src/elements/object/io-properties.ts#L17)

#### Parameters

##### constructors

[`IoPropertiesConstructor`](../interfaces/IoPropertiesConstructor.md)\<`any`\>[]

#### Returns

[`ProtoObjectConfig`](ProtoObjectConfig.md)

#### Overrides

`Map<Constructor, Map<PropertyTypeKey, VDOMArray>>.constructor`

## Methods

### getObjectConfig()

> **getObjectConfig**(`object`): `undefined` \| `Record`\<`string`, [`VDOMArray`](../type-aliases/VDOMArray.md)\>

Defined in: [src/elements/object/io-properties.ts:43](https://github.com/io-gui/io/blob/main/src/elements/object/io-properties.ts#L43)

#### Parameters

##### object

`object`

#### Returns

`undefined` \| `Record`\<`string`, [`VDOMArray`](../type-aliases/VDOMArray.md)\>
