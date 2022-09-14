# Class: EventDispatcher

Internal utility class responsible for handling listeners and dispatching events.
It makes events of all `IoNode` classes compatible with DOM events.
It maintains three independent lists of listeners:
 - `protoListeners` specified as `get Listeners()` class declarations
 - `propListeners` specified as inline properties prefixed with "on-"
 - `addedListeners` explicitly added using `addEventListener()`

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

[src/core/internals/eventDispatcher.ts:76](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L76)

## Properties

### addedListeners

• `Readonly` **addedListeners**: [`Listeners`](../README.md#listeners) = `{}`

#### Defined in

[src/core/internals/eventDispatcher.ts:70](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L70)

___

### isEventTarget

• `Readonly` **isEventTarget**: `boolean`

#### Defined in

[src/core/internals/eventDispatcher.ts:67](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L67)

___

### node

• `Readonly` **node**: `HTMLElement` \| [`IoNode`](IoNode.md)

#### Defined in

[src/core/internals/eventDispatcher.ts:66](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L66)

___

### propListeners

• `Readonly` **propListeners**: [`Listeners`](../README.md#listeners) = `{}`

#### Defined in

[src/core/internals/eventDispatcher.ts:69](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L69)

___

### protoListeners

• `Readonly` **protoListeners**: [`Listeners`](../README.md#listeners) = `{}`

#### Defined in

[src/core/internals/eventDispatcher.ts:68](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L68)

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

[src/core/internals/eventDispatcher.ts:149](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L149)

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

[src/core/internals/eventDispatcher.ts:103](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L103)

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

[src/core/internals/eventDispatcher.ts:213](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L213)

___

### dispose

▸ **dispose**(): `void`

Disconnects all event listeners and removes all references for garbage collection.
Use this when node is discarded.

#### Returns

`void`

#### Defined in

[src/core/internals/eventDispatcher.ts:240](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L240)

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

[src/core/internals/eventDispatcher.ts:173](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L173)

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

[src/core/internals/eventDispatcher.ts:85](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L85)
