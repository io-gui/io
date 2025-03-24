[**io-gui**](../README.md)

***

# Class: EventDispatcher

Defined in: [src/core/internals/eventDispatcher.ts:96](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L96)

Internal utility class responsible for handling listeners and dispatching events.
It makes events of all `IoNode` class instances compatible with DOM events.
It maintains three independent lists of listeners:
 - `protoListeners` specified as `get Listeners()` return value of class.
 - `propListeners` specified as inline properties prefixed with "@".
 - `addedListeners` explicitly added/removed using `addEventListener()` and `removeEventListener()`.

## Constructors

### new EventDispatcher()

> **new EventDispatcher**(`node`): [`EventDispatcher`](EventDispatcher.md)

Defined in: [src/core/internals/eventDispatcher.ts:107](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L107)

Creates an instance of `EventDispatcher` for specified `IoNode` instance.
It initializes `protoListeners` from `ProtoChain`.

#### Parameters

##### node

owner IoNode

`EventTarget` | [`IoNode`](IoNode.md)

#### Returns

[`EventDispatcher`](EventDispatcher.md)

## Properties

### addedListeners

> `readonly` **addedListeners**: [`Listeners`](../type-aliases/Listeners.md) = `{}`

Defined in: [src/core/internals/eventDispatcher.ts:101](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L101)

***

### isEventTarget

> `readonly` **isEventTarget**: `boolean`

Defined in: [src/core/internals/eventDispatcher.ts:98](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L98)

***

### node

> `readonly` **node**: `EventTarget` \| [`IoNode`](IoNode.md)

Defined in: [src/core/internals/eventDispatcher.ts:97](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L97)

***

### propListeners

> `readonly` **propListeners**: [`Listeners`](../type-aliases/Listeners.md) = `{}`

Defined in: [src/core/internals/eventDispatcher.ts:100](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L100)

***

### protoListeners

> `readonly` **protoListeners**: [`Listeners`](../type-aliases/Listeners.md) = `{}`

Defined in: [src/core/internals/eventDispatcher.ts:99](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L99)

## Methods

### addEventListener()

> **addEventListener**(`name`, `listener`, `options`?): `void`

Defined in: [src/core/internals/eventDispatcher.ts:182](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L182)

Proxy for `addEventListener` method.
Adds an event listener to the node's `addedListeners` collection.
If the node is an EventTarget, also registers the listener with the DOM.

#### Parameters

##### name

`string`

Name of the event

##### listener

[`AnyEventListener`](../type-aliases/AnyEventListener.md)

Event listener handler

##### options?

`AddEventListenerOptions`

Event listener options

#### Returns

`void`

***

### applyPropListeners()

> **applyPropListeners**(`properties`): `void`

Defined in: [src/core/internals/eventDispatcher.ts:135](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L135)

Sets `propListeners` specified as inline properties prefixed with "@".
It removes existing `propListeners` that are no longer specified and it replaces the ones that changed.

#### Parameters

##### properties

`Record`\<`string`, `any`\>

Inline properties

#### Returns

`void`

***

### dispatchEvent()

> **dispatchEvent**(`name`, `detail`?, `bubbles`?, `node`?): `void`

Defined in: [src/core/internals/eventDispatcher.ts:284](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L284)

Shorthand for custom event dispatch.

#### Parameters

##### name

`string`

Name of the event

##### detail?

`any`

Event detail data

##### bubbles?

`boolean` = `true`

Makes event bubble

##### node?

Event target override to dispatch the event from

`EventTarget` | [`IoNode`](IoNode.md)

#### Returns

`void`

***

### dispose()

> **dispose**(): `void`

Defined in: [src/core/internals/eventDispatcher.ts:314](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L314)

Disconnects all event listeners and removes all references for garbage collection.
Use this when node is discarded.

#### Returns

`void`

***

### removeEventListener()

> **removeEventListener**(`name`, `listener`?, `options`?): `void`

Defined in: [src/core/internals/eventDispatcher.ts:229](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L229)

Proxy for `removeEventListener` method.
Removes an event listener from the node's `addedListeners` collection.
If `listener` is not specified it removes all listeners for specified `type`.

#### Parameters

##### name

`string`

Name of the event

##### listener?

[`AnyEventListener`](../type-aliases/AnyEventListener.md)

Event listener handler

##### options?

`AddEventListenerOptions`

Event listener options

#### Returns

`void`

***

### setProtoListeners()

> **setProtoListeners**(`node`): `void`

Defined in: [src/core/internals/eventDispatcher.ts:118](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L118)

Sets `protoListeners` specified as `get Listeners()` class definitions.
Definitions from subclass replace the ones from parent class.

#### Parameters

##### node

[`IoNode`](IoNode.md)

owner IoNode

#### Returns

`void`
