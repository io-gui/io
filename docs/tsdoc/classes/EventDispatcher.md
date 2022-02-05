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

[core/internals/eventDispatcher.ts:77](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L77)

## Methods

### addEventListener

▸ **addEventListener**(`name`, `listener`, `options?`): `void`

Proxy for `addEventListener` method.
Adds an event listener to `addedListeners`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Name of the event |
| `listener` | `EventListener` | Event listener handler |
| `options?` | `AddEventListenerOptions` | - |

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:156](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L156)

___

### dispatchEvent

▸ **dispatchEvent**(`name`, `detail?`, `bubbles?`, `node?`): `void`

Shorthand for custom event dispatch.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `undefined` | Name of the event |
| `detail` | `Record`<`string`, `any`\> | `{}` | Event detail data |
| `bubbles` | `boolean` | `true` | - |
| `node` | `EventTarget` \| [`IoNode`](IoNode.md) | `undefined` | - |

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:220](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L220)

___

### dispose

▸ **dispose**(): `void`

Disconnects all event listeners and removes all references for garbage collection.
Use this when node is discarded.

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:246](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L246)

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
| `listener?` | `EventListener` | Event listener handler |
| `options?` | `AddEventListenerOptions` | - |

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:180](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L180)

___

### setPropListeners

▸ **setPropListeners**(`properties`): `void`

Sets `propListeners` specified as inline properties prefixed with "on-".
It removes existing `propListeners` that are no longer specified and it replaces the ones that changed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `properties` | `Record`<`string`, `any`\> | Inline properties |

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:110](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L110)
