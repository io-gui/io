# Class: EventDispatcher

`EventDispatcher` responsible for handling listeners and dispatching events.
It maintains three independent lists of listeners:
  1. `protoListeners` specified as `get Listeners()` class declarations.
  2. `propListeners` specified as inline properties prefixed with "on-"
  3. `addedListeners` explicitly added using `addEventListener()`.

## Constructors

### constructor

• **new EventDispatcher**(`node`)

Creates an instance of `EventDispatcher` for specified `IoNode` instance.
It initializes `protoListeners` from `ProtoChain`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | owner IoNode. |

#### Defined in

[core/internals/eventDispatcher.ts:63](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L63)

## Methods

### addEventListener

▸ **addEventListener**(`type`, `listener`, `options?`): `void`

Proxy for `addEventListener` method.
Adds an event listener to `addedListeners`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | Name of the event |
| `listener` | `EventListener` | Event listener handler |
| `options?` | `AddEventListenerOptions` | - |

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:235](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L235)

___

### connect

▸ **connect**(): [`EventDispatcher`](EventDispatcher.md)

Connects all event listeners.

#### Returns

[`EventDispatcher`](EventDispatcher.md)

this

#### Defined in

[core/internals/eventDispatcher.ts:171](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L171)

___

### disconnect

▸ **disconnect**(): [`EventDispatcher`](EventDispatcher.md)

Disconnects all event listeners.

#### Returns

[`EventDispatcher`](EventDispatcher.md)

this

#### Defined in

[core/internals/eventDispatcher.ts:200](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L200)

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

[core/internals/eventDispatcher.ts:289](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L289)

___

### dispose

▸ **dispose**(): `void`

Disconnects all event listeners and removes all references.
Use this when node is no longer needed.

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:321](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L321)

___

### removeAddedListeners

▸ **removeAddedListeners**(): `void`

Removes all `addedListeners`.

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:155](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L155)

___

### removeEventListener

▸ **removeEventListener**(`type`, `listener?`, `options?`): `void`

Proxy for `removeEventListener` method.
Removes an event listener from `addedListeners`.
If `listener` is not specified it removes all listeners for specified `type`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | Name of the event |
| `listener?` | `EventListener` | Event listener handler |
| `options?` | `AddEventListenerOptions` | - |

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:256](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L256)

___

### removePropListeners

▸ **removePropListeners**(): `void`

Removes all `propListeners`.

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:142](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L142)

___

### removeProtoListeners

▸ **removeProtoListeners**(): `void`

Removes all `protoListeners`.

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:127](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L127)

___

### setPropListeners

▸ **setPropListeners**(`properties`): `void`

Sets `propListeners` specified as inline properties prefixed with "on-".
It removes existing `propListeners` that are no longer specified and it replaces the ones that changed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `properties` | `Record`<`string`, `any`\> | Inline properties. |

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:85](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L85)
