[**io-gui**](../README.md)

***

# Class: IoStorageNode

Defined in: [src/core/storage.ts:114](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L114)

IoNodeMixin applied to `Object` class.

## Extends

- [`IoNode`](IoNode.md)

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### new IoStorageNode()

> **new IoStorageNode**(`props`): [`IoStorageNode`](IoStorageNode.md)

Defined in: [src/core/storage.ts:130](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L130)

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

Defined in: [src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

#### Inherited from

[`IoNode`](IoNode.md).[`_bindings`](IoNode.md#_bindings)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

Defined in: [src/core/node.ts:45](https://github.com/io-gui/io/blob/main/src/core/node.ts#L45)

#### Inherited from

[`IoNode`](IoNode.md).[`_changeQueue`](IoNode.md#_changequeue)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

Defined in: [src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

#### Inherited from

[`IoNode`](IoNode.md).[`_eventDispatcher`](IoNode.md#_eventdispatcher)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

Defined in: [src/core/node.ts:43](https://github.com/io-gui/io/blob/main/src/core/node.ts#L43)

#### Inherited from

[`IoNode`](IoNode.md).[`_properties`](IoNode.md#_properties)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

Defined in: [src/core/node.ts:42](https://github.com/io-gui/io/blob/main/src/core/node.ts#L42)

#### Inherited from

[`IoNode`](IoNode.md).[`_protochain`](IoNode.md#_protochain)

***

### binding

> **binding**: [`Binding`](Binding.md)

Defined in: [src/core/storage.ts:128](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L128)

***

### default

> **default**: `any`

Defined in: [src/core/storage.ts:123](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L123)

***

### key

> **key**: `string`

Defined in: [src/core/storage.ts:117](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L117)

***

### storage

> **storage**: `"none"` \| `"hash"` \| `"local"`

Defined in: [src/core/storage.ts:126](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L126)

***

### value

> **value**: `any`

Defined in: [src/core/storage.ts:120](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L120)

## Accessors

### Properties

#### Get Signature

> **get** `static` **Properties**(): [`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

Defined in: [src/core/node.ts:33](https://github.com/io-gui/io/blob/main/src/core/node.ts#L33)

##### Returns

[`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

#### Inherited from

[`IoNode`](IoNode.md).[`Properties`](IoNode.md#properties)

## Methods

### \_clearStorage()

> **\_clearStorage**(): `void`

Defined in: [src/core/storage.ts:185](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L185)

#### Returns

`void`

***

### addEventListener()

> **addEventListener**(`type`, `listener`, `options`?): `void`

Defined in: [src/core/node.ts:343](https://github.com/io-gui/io/blob/main/src/core/node.ts#L343)

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

Defined in: [src/core/node.ts:189](https://github.com/io-gui/io/blob/main/src/core/node.ts#L189)

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

> **bind**(`prop`): [`Binding`](Binding.md)

Defined in: [src/core/node.ts:310](https://github.com/io-gui/io/blob/main/src/core/node.ts#L310)

Returns a binding to a specified property`.

#### Parameters

##### prop

`string`

Property to bind to.

#### Returns

[`Binding`](Binding.md)

Binding object.

#### Inherited from

[`IoNode`](IoNode.md).[`bind`](IoNode.md#bind)

***

### changed()

> **changed**(): `void`

Defined in: [src/core/node.ts:240](https://github.com/io-gui/io/blob/main/src/core/node.ts#L240)

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`changed`](IoNode.md#changed)

***

### dispatchEvent()

> **dispatchEvent**(`type`, `detail`, `bubbles`, `src`?): `void`

Defined in: [src/core/node.ts:368](https://github.com/io-gui/io/blob/main/src/core/node.ts#L368)

Wrapper for dispatchEvent.

#### Parameters

##### type

`string`

event name to dispatch.

##### detail

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

### dispatchMutationEvent()

> **dispatchMutationEvent**(`object`): `void`

Defined in: [src/core/node.ts:375](https://github.com/io-gui/io/blob/main/src/core/node.ts#L375)

Shorthand for dispatching `'object-mutated'` event on window.

#### Parameters

##### object

`any`

object which mutated.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`dispatchMutationEvent`](IoNode.md#dispatchmutationevent)

***

### dispatchQueue()

> **dispatchQueue**(`lazy`): `void`

Defined in: [src/core/node.ts:254](https://github.com/io-gui/io/blob/main/src/core/node.ts#L254)

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Parameters

##### lazy

`boolean` = `false`

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`dispatchQueue`](IoNode.md#dispatchqueue)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/core/storage.ts:181](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L181)

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

Defined in: [src/core/node.ts:229](https://github.com/io-gui/io/blob/main/src/core/node.ts#L229)

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

### objectMutated()

> **objectMutated**(`prop`): `void`

Defined in: [src/core/node.ts:299](https://github.com/io-gui/io/blob/main/src/core/node.ts#L299)

This function is called after `onObjectMutated()` determines that one of
the object properties has mutated.

#### Parameters

##### prop

`string`

Mutated object property name.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`objectMutated`](IoNode.md#objectmutated)

***

### onObjectMutated()

> **onObjectMutated**(`event`): `void`

Defined in: [src/core/node.ts:278](https://github.com/io-gui/io/blob/main/src/core/node.ts#L278)

Event handler for 'object-mutated' event emitted from the `window`.
Node should be listening for this event if it has an observed object property

#### Parameters

##### event

`CustomEvent`

Event payload.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`onObjectMutated`](IoNode.md#onobjectmutated)

***

### queue()

> **queue**(`prop`, `value`, `oldValue`): `void`

Defined in: [src/core/node.ts:248](https://github.com/io-gui/io/blob/main/src/core/node.ts#L248)

Adds property change to the queue.

#### Parameters

##### prop

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

Defined in: [src/core/node.ts:417](https://github.com/io-gui/io/blob/main/src/core/node.ts#L417)

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

Defined in: [src/core/node.ts:358](https://github.com/io-gui/io/blob/main/src/core/node.ts#L358)

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

Defined in: [src/core/storage.ts:215](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L215)

#### Returns

`void`

***

### saveValueToHash()

> **saveValueToHash**(): `void`

Defined in: [src/core/storage.ts:230](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L230)

#### Returns

`void`

***

### setProperties()

> **setProperties**(`props`): `void`

Defined in: [src/core/node.ts:211](https://github.com/io-gui/io/blob/main/src/core/node.ts#L211)

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

> **setProperty**(`name`, `value`, `lazyDispatch`?): `void`

Defined in: [src/core/node.ts:119](https://github.com/io-gui/io/blob/main/src/core/node.ts#L119)

Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.

#### Parameters

##### name

`string`

Property name to set value of.

##### value

`any`

Peroperty value.

##### lazyDispatch?

`boolean` = `false`

flag to skip event dispatch.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`setProperty`](IoNode.md#setproperty)

***

### throttle()

> **throttle**(`func`, `arg`, `timeout`): `void`

Defined in: [src/core/node.ts:269](https://github.com/io-gui/io/blob/main/src/core/node.ts#L269)

Throttles function execution to next frame (rAF) if the function has been executed in the current frame.

#### Parameters

##### func

[`CallbackFunction`](../type-aliases/CallbackFunction.md)

Function to throttle.

##### arg

`any` = `undefined`

argument for throttled function.

##### timeout

`number` = `1`

minimum delay in ms before executing the function.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`throttle`](IoNode.md#throttle)

***

### unbind()

> **unbind**(`prop`): `void`

Defined in: [src/core/node.ts:327](https://github.com/io-gui/io/blob/main/src/core/node.ts#L327)

Unbinds a binding to a specified property`.

#### Parameters

##### prop

`string`

Property to unbind.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`unbind`](IoNode.md#unbind)

***

### valueChanged()

> **valueChanged**(): `void`

Defined in: [src/core/storage.ts:199](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L199)

#### Returns

`void`
