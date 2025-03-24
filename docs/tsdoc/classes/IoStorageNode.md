[**io-gui**](../README.md)

***

# Class: IoStorageNode

Defined in: [src/core/storage.ts:115](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L115)

IoNodeMixin applied to `Object` class.

## Extends

- [`IoNode`](IoNode.md)

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### new IoStorageNode()

> **new IoStorageNode**(`props`): [`IoStorageNode`](IoStorageNode.md)

Defined in: [src/core/storage.ts:131](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L131)

#### Parameters

##### props

`StorageProps`

#### Returns

[`IoStorageNode`](IoStorageNode.md)

#### Overrides

[`IoNode`](IoNode.md).[`constructor`](IoNode.md#constructors)

## Properties

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

Defined in: [src/core/node.ts:45](https://github.com/io-gui/io/blob/main/src/core/node.ts#L45)

#### Inherited from

[`IoNode`](IoNode.md).[`_bindings`](IoNode.md#_bindings)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

Defined in: [src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

#### Inherited from

[`IoNode`](IoNode.md).[`_changeQueue`](IoNode.md#_changequeue)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

Defined in: [src/core/node.ts:47](https://github.com/io-gui/io/blob/main/src/core/node.ts#L47)

#### Inherited from

[`IoNode`](IoNode.md).[`_eventDispatcher`](IoNode.md#_eventdispatcher)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

Defined in: [src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

#### Inherited from

[`IoNode`](IoNode.md).[`_properties`](IoNode.md#_properties)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

Defined in: [src/core/node.ts:43](https://github.com/io-gui/io/blob/main/src/core/node.ts#L43)

#### Inherited from

[`IoNode`](IoNode.md).[`_protochain`](IoNode.md#_protochain)

***

### binding

> **binding**: [`Binding`](Binding.md)

Defined in: [src/core/storage.ts:129](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L129)

***

### default

> **default**: `any`

Defined in: [src/core/storage.ts:124](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L124)

***

### key

> **key**: `string`

Defined in: [src/core/storage.ts:118](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L118)

***

### storage

> **storage**: `"none"` \| `"hash"` \| `"local"`

Defined in: [src/core/storage.ts:127](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L127)

***

### value

> **value**: `any`

Defined in: [src/core/storage.ts:121](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L121)

## Accessors

### Properties

#### Get Signature

> **get** `static` **Properties**(): [`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

Defined in: [src/core/node.ts:35](https://github.com/io-gui/io/blob/main/src/core/node.ts#L35)

##### Returns

[`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

#### Inherited from

[`IoNode`](IoNode.md).[`Properties`](IoNode.md#properties)

## Methods

### \_clearStorage()

> **\_clearStorage**(): `void`

Defined in: [src/core/storage.ts:186](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L186)

#### Returns

`void`

***

### addEventListener()

> **addEventListener**(`type`, `listener`, `options`?): `void`

Defined in: [src/core/node.ts:339](https://github.com/io-gui/io/blob/main/src/core/node.ts#L339)

Wrapper for addEventListener.

#### Parameters

##### type

`string`

listener name.

##### listener

[`AnyEventListener`](../type-aliases/AnyEventListener.md)

listener handler.

##### options?

`AddEventListenerOptions`

event listener options.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`addEventListener`](IoNode.md#addeventlistener)

***

### applyProperties()

> **applyProperties**(`props`): `void`

Defined in: [src/core/node.ts:116](https://github.com/io-gui/io/blob/main/src/core/node.ts#L116)

Sets multiple properties in batch.
[property]-changed` events will be broadcast in the end.

#### Parameters

##### props

`any`

Map of property names and values.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`applyProperties`](IoNode.md#applyproperties)

***

### bind()

> **bind**(`name`): [`Binding`](Binding.md)

Defined in: [src/core/node.ts:310](https://github.com/io-gui/io/blob/main/src/core/node.ts#L310)

Returns a binding to a specified property`.

#### Parameters

##### name

`string`

Property name to bind to.

#### Returns

[`Binding`](Binding.md)

Binding object.

#### Inherited from

[`IoNode`](IoNode.md).[`bind`](IoNode.md#bind)

***

### changed()

> **changed**(): `void`

Defined in: [src/core/node.ts:239](https://github.com/io-gui/io/blob/main/src/core/node.ts#L239)

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`changed`](IoNode.md#changed)

***

### debounce()

> **debounce**(`func`, `arg`, `timeout`): `void`

Defined in: [src/core/node.ts:279](https://github.com/io-gui/io/blob/main/src/core/node.ts#L279)

Debounces function execution to next frame (rAF).

#### Parameters

##### func

[`CallbackFunction`](../type-aliases/CallbackFunction.md)

Function to throttle.

##### arg

`any` = `undefined`

argument for debounced function.

##### timeout

`number` = `1`

minimum delay in ms before executing the function.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`debounce`](IoNode.md#debounce)

***

### dispatchEvent()

> **dispatchEvent**(`type`, `detail`, `bubbles`, `src`?): `void`

Defined in: [src/core/node.ts:362](https://github.com/io-gui/io/blob/main/src/core/node.ts#L362)

Wrapper for dispatchEvent.

#### Parameters

##### type

`string`

event name to dispatch.

##### detail

`any` = `undefined`

event detail.

##### bubbles

`boolean` = `false`

event bubbles.

##### src?

source node/element to dispatch event from.

`Node` | `Document` | `HTMLElement` | `Window`

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`dispatchEvent`](IoNode.md#dispatchevent)

***

### dispatchQueue()

> **dispatchQueue**(`debounce`): `void`

Defined in: [src/core/node.ts:255](https://github.com/io-gui/io/blob/main/src/core/node.ts#L255)

Dispatches the queue in the next rAF cycle if `reactivity` property is set to `"debounced"`. Otherwise it dispatches the queue immediately.

#### Parameters

##### debounce

`boolean` = `false`

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`dispatchQueue`](IoNode.md#dispatchqueue)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/core/storage.ts:182](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L182)

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Overrides

[`IoNode`](IoNode.md).[`dispose`](IoNode.md#dispose)

***

### init()

> **init**(): `void`

Defined in: [src/core/node.ts:241](https://github.com/io-gui/io/blob/main/src/core/node.ts#L241)

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`init`](IoNode.md#init)

***

### inputValue()

> **inputValue**(`value`): `void`

Defined in: [src/core/node.ts:227](https://github.com/io-gui/io/blob/main/src/core/node.ts#L227)

Sets value property and emits `value-input` event.
Use this when value property is set by user action (e.g. mouse click).

#### Parameters

##### value

`any`

Property value.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`inputValue`](IoNode.md#inputvalue)

***

### onPropertyMutated()

> **onPropertyMutated**(`event`): `void`

Defined in: [src/core/node.ts:291](https://github.com/io-gui/io/blob/main/src/core/node.ts#L291)

Event handler for 'object-mutated' events emitted from the properties which are IoNode instances.
Aditionally, it handles events emitted from the `window` object (used for observing non-IoNode object properties).
NOTE: non-IoNode objects don't emit 'object-mutated' event automatically - something needs to emit this for them.
This is used to evoke '[propName]Mutated()' mutation handler

#### Parameters

##### event

`CustomEvent`

Event payload.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`onPropertyMutated`](IoNode.md#onpropertymutated)

***

### queue()

> **queue**(`name`, `value`, `oldValue`): `void`

Defined in: [src/core/node.ts:248](https://github.com/io-gui/io/blob/main/src/core/node.ts#L248)

Adds property change to the queue.

#### Parameters

##### name

`string`

Property name.

##### value

`any`

Property value.

##### oldValue

`any`

Old property value.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`queue`](IoNode.md#queue)

***

### Register()

> **Register**(`ioNodeConstructor`): `void`

Defined in: [src/core/node.ts:404](https://github.com/io-gui/io/blob/main/src/core/node.ts#L404)

#### Parameters

##### ioNodeConstructor

*typeof* [`IoNode`](IoNode.md)

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`Register`](IoNode.md#register)

***

### removeEventListener()

> **removeEventListener**(`type`, `listener`?, `options`?): `void`

Defined in: [src/core/node.ts:352](https://github.com/io-gui/io/blob/main/src/core/node.ts#L352)

Wrapper for removeEventListener.

#### Parameters

##### type

`string`

event name to listen to.

##### listener?

[`AnyEventListener`](../type-aliases/AnyEventListener.md)

listener handler.

##### options?

`AddEventListenerOptions`

event listener options.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`removeEventListener`](IoNode.md#removeeventlistener)

***

### removeValueToHash()

> **removeValueToHash**(): `void`

Defined in: [src/core/storage.ts:216](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L216)

#### Returns

`void`

***

### saveValueToHash()

> **saveValueToHash**(): `void`

Defined in: [src/core/storage.ts:231](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L231)

#### Returns

`void`

***

### setProperties()

> **setProperties**(`props`): `void`

Defined in: [src/core/node.ts:135](https://github.com/io-gui/io/blob/main/src/core/node.ts#L135)

Sets multiple properties in batch.
[property]-changed` events will be broadcast in the end.

#### Parameters

##### props

`any`

Map of property names and values.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`setProperties`](IoNode.md#setproperties)

***

### setProperty()

> **setProperty**(`name`, `value`, `debounce`?): `void`

Defined in: [src/core/node.ts:151](https://github.com/io-gui/io/blob/main/src/core/node.ts#L151)

Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.

#### Parameters

##### name

`string`

Property name to set value of.

##### value

`any`

Peroperty value.

##### debounce?

`boolean` = `false`

flag to skip event dispatch.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`setProperty`](IoNode.md#setproperty)

***

### throttle()

> **throttle**(`func`, `arg`): `void`

Defined in: [src/core/node.ts:270](https://github.com/io-gui/io/blob/main/src/core/node.ts#L270)

Throttles function execution once per frame (rAF).

#### Parameters

##### func

[`CallbackFunction`](../type-aliases/CallbackFunction.md)

Function to throttle.

##### arg

`any` = `undefined`

argument for throttled function.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`throttle`](IoNode.md#throttle)

***

### unbind()

> **unbind**(`name`): `void`

Defined in: [src/core/node.ts:323](https://github.com/io-gui/io/blob/main/src/core/node.ts#L323)

Unbinds a binding to a specified property`.

#### Parameters

##### name

`string`

Property name to unbind.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`unbind`](IoNode.md#unbind)

***

### valueChanged()

> **valueChanged**(): `void`

Defined in: [src/core/storage.ts:200](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L200)

#### Returns

`void`
