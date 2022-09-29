# Class: EventDispatcher

Internal utility class responsible for handling listeners and dispatching events.
It makes events of all `IoNode` class instances compatible with DOM events.
It maintains three independent lists of listeners:
 - `protoListeners` specified as `get Listeners()` class declarations.
 - `propListeners` specified as inline properties prefixed with "on-".
 - `addedListeners` explicitly added/removed using `addEventListener()` and `removeEventListener()`.

## Constructors

### constructor

• **new EventDispatcher**(`node`)

Creates an instance of `EventDispatcher` for specified `IoNode` instance.
It initializes `protoListeners` from `ProtoChain`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `HTMLElement` \| [`IoNode`](IoNode.md) | owner IoNode |

#### Defined in

[src/core/internals/eventDispatcher.ts:84](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L84)

## Properties

### addedListeners

• `Readonly` **addedListeners**: [`Listeners`](../README.md#listeners) = `{}`

#### Defined in

[src/core/internals/eventDispatcher.ts:78](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L78)

___

### isEventTarget

• `Readonly` **isEventTarget**: `boolean`

#### Defined in

[src/core/internals/eventDispatcher.ts:75](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L75)

___

### node

• `Readonly` **node**: `HTMLElement` \| [`IoNode`](IoNode.md)

#### Defined in

[src/core/internals/eventDispatcher.ts:74](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L74)

___

### propListeners

• `Readonly` **propListeners**: [`Listeners`](../README.md#listeners) = `{}`

#### Defined in

[src/core/internals/eventDispatcher.ts:77](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L77)

___

### protoListeners

• `Readonly` **protoListeners**: [`Listeners`](../README.md#listeners) = `{}`

#### Defined in

[src/core/internals/eventDispatcher.ts:76](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L76)

## Methods

### addEventListener

▸ **addEventListener**(`name`, `listener`, `options?`): `void`

Proxy for `addEventListener` method.
Adds an event listener to `addedListeners`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Name of the event |
| `listener` | [`CustomEventListener`](../README.md#customeventlistener) | Event listener handler |
| `options?` | `AddEventListenerOptions` | Event listener options |

#### Returns

`void`

#### Defined in

[src/core/internals/eventDispatcher.ts:157](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L157)

___

### applyPropListeners

▸ **applyPropListeners**(`properties`): `void`

Sets `propListeners` specified as inline properties prefixed with "on-".
It removes existing `propListeners` that are no longer specified and it replaces the ones that changed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `properties` | `Record`<`string`, `any`\> | Inline properties |

#### Returns

`void`

#### Defined in

[src/core/internals/eventDispatcher.ts:111](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L111)

___

### dispatchEvent

▸ **dispatchEvent**(`name`, `detail?`, `bubbles?`, `node?`): `void`

Shorthand for custom event dispatch.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `undefined` | Name of the event |
| `detail?` | `any` | `undefined` | Event detail data |
| `bubbles?` | `boolean` | `true` | Makes event bubble |
| `node?` | `EventTarget` \| [`IoNode`](IoNode.md) | `undefined` | Event target override to dispatch the event from |

#### Returns

`void`

#### Defined in

[src/core/internals/eventDispatcher.ts:221](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L221)

___

### dispose

▸ **dispose**(): `void`

Disconnects all event listeners and removes all references for garbage collection.
Use this when node is discarded.

#### Returns

`void`

#### Defined in

[src/core/internals/eventDispatcher.ts:248](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L248)

___

### removeEventListener

▸ **removeEventListener**(`name`, `listener?`, `options?`): `void`

Proxy for `removeEventListener` method.
Removes an event listener from `addedListeners`.
If `listener` is not specified it removes all listeners for specified `type`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Name of the event |
| `listener?` | [`CustomEventListener`](../README.md#customeventlistener) | Event listener handler |
| `options?` | `AddEventListenerOptions` | Event listener options |

#### Returns

`void`

#### Defined in

[src/core/internals/eventDispatcher.ts:181](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L181)

___

### setProtoListeners

▸ **setProtoListeners**(`node`): `void`

Sets `protoListeners` specified as `get Listeners()` class declarations.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) | owner IoNode |

#### Returns

`void`

#### Defined in

[src/core/internals/eventDispatcher.ts:93](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L93)
