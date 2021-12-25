# Class: EventDispatcher

`EventDispatcher` responsible for handling listeners and dispatching events.
It maintains three independent lists of listeners:
  1. `protoListeners` specified as `get Listeners()` class declarations.
  2. `propListeners` specified as inline properties prefixed with "on-"
  3. `addedListeners` explicitly added using `addEventListener()`.

## Constructors

### constructor

• **new EventDispatcher**(`node`)

Creates an instance of `EventDispatcher` for specified `IoNode` instance and initializes `protoListeners` from `ProtoChain`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | owner IoNode. |

#### Defined in

core/internals/eventDispatcher.ts:55

## Methods

### addEventListener

▸ **addEventListener**(`type`, `listener`, `options?`): `void`

Proxy for `addEventListener` method.
Adds an event listener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | Name of the event |
| `listener` | `EventListener` | Event listener handler |
| `options?` | `AddEventListenerOptions` | - |

#### Returns

`void`

#### Defined in

core/internals/eventDispatcher.ts:193

___

### clearAddedListeners

▸ **clearAddedListeners**(): `void`

#### Returns

`void`

#### Defined in

core/internals/eventDispatcher.ts:113

___

### connect

▸ **connect**(): [`EventDispatcher`](EventDispatcher.md)

Connects all event listeners.

#### Returns

[`EventDispatcher`](EventDispatcher.md)

this

#### Defined in

core/internals/eventDispatcher.ts:130

___

### disconnect

▸ **disconnect**(): [`EventDispatcher`](EventDispatcher.md)

Disconnects all event listeners.

#### Returns

[`EventDispatcher`](EventDispatcher.md)

this

#### Defined in

core/internals/eventDispatcher.ts:160

___

### dispatchEvent

▸ **dispatchEvent**(`type`, `detail?`, `bubbles?`, `node?`): `void`

Shorthand for custom event dispatch.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `type` | `string` | `undefined` | Name of the event |
| `detail` | `Record`<`string`, `any`\> | `{}` | Event detail data |
| `bubbles` | `boolean` | `true` | - |
| `node` | `EventTarget` \| [`IoNode`](IoNode.md) | `undefined` | - |

#### Returns

`void`

#### Defined in

core/internals/eventDispatcher.ts:244

___

### dispose

▸ **dispose**(): `void`

Disconnects all event listeners and removes all references.
Use this when node is no longer needed.

#### Returns

`void`

#### Defined in

core/internals/eventDispatcher.ts:274

___

### removeEventListener

▸ **removeEventListener**(`type`, `listener?`, `options?`): `void`

Proxy for `removeEventListener` method.
Removes an event listener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | Name of the event |
| `listener?` | `EventListener` | Event listener handler |
| `options?` | `AddEventListenerOptions` | - |

#### Returns

`void`

#### Defined in

core/internals/eventDispatcher.ts:211

___

### setPropListeners

▸ **setPropListeners**(`properties`): `void`

Sets `propListeners` listeners from inline properties prefixed with "on-".

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `properties` | `Record`<`string`, `any`\> | Properties. |

#### Returns

`void`

#### Defined in

core/internals/eventDispatcher.ts:76
