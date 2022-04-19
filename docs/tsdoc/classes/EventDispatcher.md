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

[core/internals/eventDispatcher.ts:79](https://github.com/io-gui/io/blob/tsc/src/core/internals/eventDispatcher.ts#L79)

## Properties

### addedListeners

• `Readonly` **addedListeners**: [`Listeners`](../README.md#listeners) = `{}`

#### Defined in

[core/internals/eventDispatcher.ts:73](https://github.com/io-gui/io/blob/tsc/src/core/internals/eventDispatcher.ts#L73)

___

### isEventTarget

• `Readonly` **isEventTarget**: `boolean`

#### Defined in

[core/internals/eventDispatcher.ts:70](https://github.com/io-gui/io/blob/tsc/src/core/internals/eventDispatcher.ts#L70)

___

### node

• `Readonly` **node**: `HTMLElement` \| [`IoNode`](IoNode.md)

#### Defined in

[core/internals/eventDispatcher.ts:69](https://github.com/io-gui/io/blob/tsc/src/core/internals/eventDispatcher.ts#L69)

___

### propListeners

• `Readonly` **propListeners**: [`Listeners`](../README.md#listeners) = `{}`

#### Defined in

[core/internals/eventDispatcher.ts:72](https://github.com/io-gui/io/blob/tsc/src/core/internals/eventDispatcher.ts#L72)

___

### protoListeners

• `Readonly` **protoListeners**: [`Listeners`](../README.md#listeners) = `{}`

#### Defined in

[core/internals/eventDispatcher.ts:71](https://github.com/io-gui/io/blob/tsc/src/core/internals/eventDispatcher.ts#L71)

## Methods

### addEventListener

▸ **addEventListener**(`name`, `listener`, `options?`): `void`

Proxy for `addEventListener` method.
Adds an event listener to `addedListeners`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Name of the event |
| `listener` | `AnyEventListener` | Event listener handler |
| `options?` | `AddEventListenerOptions` | - |

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:151](https://github.com/io-gui/io/blob/tsc/src/core/internals/eventDispatcher.ts#L151)

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

[core/internals/eventDispatcher.ts:105](https://github.com/io-gui/io/blob/tsc/src/core/internals/eventDispatcher.ts#L105)

___

### dispatchEvent

▸ **dispatchEvent**(`name`, `detail?`, `bubbles?`, `node?`): `void`

Shorthand for custom event dispatch.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `name` | `string` | `undefined` | Name of the event |
| `detail?` | `any` | `undefined` | Event detail data |
| `bubbles` | `boolean` | `true` | - |
| `node` | `EventTarget` \| [`IoNode`](IoNode.md) | `undefined` | - |

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:215](https://github.com/io-gui/io/blob/tsc/src/core/internals/eventDispatcher.ts#L215)

___

### dispose

▸ **dispose**(): `void`

Disconnects all event listeners and removes all references for garbage collection.
Use this when node is discarded.

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:242](https://github.com/io-gui/io/blob/tsc/src/core/internals/eventDispatcher.ts#L242)

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
| `listener?` | `AnyEventListener` | Event listener handler |
| `options?` | `AddEventListenerOptions` | - |

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:175](https://github.com/io-gui/io/blob/tsc/src/core/internals/eventDispatcher.ts#L175)

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

[core/internals/eventDispatcher.ts:88](https://github.com/io-gui/io/blob/tsc/src/core/internals/eventDispatcher.ts#L88)
