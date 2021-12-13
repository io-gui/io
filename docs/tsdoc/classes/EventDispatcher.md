# Class: EventDispatcher

Event Dispatcher.

## Constructors

### constructor

• **new EventDispatcher**(`node`, `protoListeners?`)

Creates Event Dispatcher.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `HTMLElement` \| [`IoNode`](IoNode.md) | Node or element to add EventDispatcher to. |
| `protoListeners` | [`ProtoListeners`](ProtoListeners.md) | - |

#### Defined in

[core/internals/eventDispatcher.ts:44](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L44)

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

[core/internals/eventDispatcher.ts:151](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L151)

___

### connect

▸ **connect**(): [`EventDispatcher`](EventDispatcher.md)

Connects all event listeners.

#### Returns

[`EventDispatcher`](EventDispatcher.md)

this

#### Defined in

[core/internals/eventDispatcher.ts:100](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L100)

___

### disconnect

▸ **disconnect**(): [`EventDispatcher`](EventDispatcher.md)

Disconnects all event listeners.

#### Returns

[`EventDispatcher`](EventDispatcher.md)

this

#### Defined in

[core/internals/eventDispatcher.ts:124](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L124)

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

[core/internals/eventDispatcher.ts:199](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L199)

___

### dispose

▸ **dispose**(): `void`

Disconnects all event listeners and removes all references.
Use this when node is no longer needed.

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:221](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L221)

___

### removeEventListener

▸ **removeEventListener**(`type`, `listener`, `options?`): `void`

Proxy for `removeEventListener` method.
Removes an event listener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | Name of the event |
| `listener` | `EventListener` | Event listener handler |
| `options?` | `AddEventListenerOptions` | - |

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:169](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L169)

___

### setPropListeners

▸ **setPropListeners**(`properties`): `void`

Sets listeners from inline properties (filtered form properties map by 'on-' prefix).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `properties` | `Record`<`string`, [`ProtoListenerType`](../README.md#protolistenertype)\> | Properties. |

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:65](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L65)
