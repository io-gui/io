[**io-gui**](../README.md) • **Docs**

***

[io-gui](../README.md) / EventDispatcher

# Class: EventDispatcher

Internal utility class responsible for handling listeners and dispatching events.
It makes events of all `IoNode` class instances compatible with DOM events.
It maintains three independent lists of listeners:
 - `protoListeners` specified as `get Listeners()` class declarations.
 - `propListeners` specified as inline properties prefixed with "".
 - `addedListeners` explicitly added/removed using `addEventListener()` and `removeEventListener()`.

## Constructors

### new EventDispatcher()

> **new EventDispatcher**(`node`): [`EventDispatcher`](EventDispatcher.md)

Creates an instance of `EventDispatcher` for specified `IoNode` instance.
It initializes `protoListeners` from `ProtoChain`.

#### Parameters

• **node**: `HTMLElement` \| [`IoNode`](IoNode.md)

owner IoNode

#### Returns

[`EventDispatcher`](EventDispatcher.md)

#### Defined in

[src/core/internals/eventDispatcher.ts:84](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L84)

## Properties

### addedListeners

> `readonly` **addedListeners**: [`Listeners`](../type-aliases/Listeners.md) = `{}`

#### Defined in

[src/core/internals/eventDispatcher.ts:78](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L78)

***

### isEventTarget

> `readonly` **isEventTarget**: `boolean`

#### Defined in

[src/core/internals/eventDispatcher.ts:75](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L75)

***

### node

> `readonly` **node**: `HTMLElement` \| [`IoNode`](IoNode.md)

#### Defined in

[src/core/internals/eventDispatcher.ts:74](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L74)

***

### propListeners

> `readonly` **propListeners**: [`Listeners`](../type-aliases/Listeners.md) = `{}`

#### Defined in

[src/core/internals/eventDispatcher.ts:77](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L77)

***

### protoListeners

> `readonly` **protoListeners**: [`Listeners`](../type-aliases/Listeners.md) = `{}`

#### Defined in

[src/core/internals/eventDispatcher.ts:76](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L76)

## Methods

### addEventListener()

> **addEventListener**(`name`, `listener`, `options`?): `void`

Proxy for `addEventListener` method.
Adds an event listener to `addedListeners`.

#### Parameters

• **name**: `string`

Name of the event

• **listener**: [`CustomEventListener`](../type-aliases/CustomEventListener.md)

Event listener handler

• **options?**: `AddEventListenerOptions`

Event listener options

#### Returns

`void`

#### Defined in

[src/core/internals/eventDispatcher.ts:157](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L157)

***

### applyPropListeners()

> **applyPropListeners**(`properties`): `void`

Sets `propListeners` specified as inline properties prefixed with "".
It removes existing `propListeners` that are no longer specified and it replaces the ones that changed.

#### Parameters

• **properties**: `Record`\<`string`, `any`\>

Inline properties

#### Returns

`void`

#### Defined in

[src/core/internals/eventDispatcher.ts:111](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L111)

***

### dispatchEvent()

> **dispatchEvent**(`name`, `detail`?, `bubbles`?, `node`?): `void`

Shorthand for custom event dispatch.

#### Parameters

• **name**: `string`

Name of the event

• **detail?**: `any`

Event detail data

• **bubbles?**: `boolean` = `true`

Makes event bubble

• **node?**: `EventTarget` \| [`IoNode`](IoNode.md) = `...`

Event target override to dispatch the event from

#### Returns

`void`

#### Defined in

[src/core/internals/eventDispatcher.ts:229](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L229)

***

### dispose()

> **dispose**(): `void`

Disconnects all event listeners and removes all references for garbage collection.
Use this when node is discarded.

#### Returns

`void`

#### Defined in

[src/core/internals/eventDispatcher.ts:256](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L256)

***

### removeEventListener()

> **removeEventListener**(`name`, `listener`?, `options`?): `void`

Proxy for `removeEventListener` method.
Removes an event listener from `addedListeners`.
If `listener` is not specified it removes all listeners for specified `type`.

#### Parameters

• **name**: `string`

Name of the event

• **listener?**: [`CustomEventListener`](../type-aliases/CustomEventListener.md)

Event listener handler

• **options?**: `AddEventListenerOptions`

Event listener options

#### Returns

`void`

#### Defined in

[src/core/internals/eventDispatcher.ts:184](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L184)

***

### setProtoListeners()

> **setProtoListeners**(`node`): `void`

Sets `protoListeners` specified as `get Listeners()` class declarations.

#### Parameters

• **node**: [`IoNode`](IoNode.md)

owner IoNode

#### Returns

`void`

#### Defined in

[src/core/internals/eventDispatcher.ts:93](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L93)
