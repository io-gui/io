[**io-gui**](../README.md)

***

# Class: IoNode

Defined in: [src/core/node.ts:436](https://github.com/io-gui/io/blob/main/src/core/node.ts#L436)

IoNodeMixin applied to `Object` class.

## Extends

- `IoNodeMixinConstructor`\<`ObjectConstructor`, `this`\>

## Extended by

- [`IoStorageNode`](IoStorageNode.md)
- [`MenuItem`](MenuItem.md)
- [`IoIconset`](IoIconset.md)

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### new IoNode()

> **new IoNode**(...`args`): [`IoNode`](IoNode.md)

Defined in: [src/core/node.ts:60](https://github.com/io-gui/io/blob/main/src/core/node.ts#L60)

Creates a class instance and initializes the internals.

#### Parameters

##### args

...`any`[]

Additional arguments

Creates a class instance and initializes the internals with properties.

#### Returns

[`IoNode`](IoNode.md)

#### Inherited from

`IoNodeMixin(Object).constructor`

## Properties

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

Defined in: [src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

#### Inherited from

`IoNodeMixin(Object)._bindings`

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

Defined in: [src/core/node.ts:45](https://github.com/io-gui/io/blob/main/src/core/node.ts#L45)

#### Inherited from

`IoNodeMixin(Object)._changeQueue`

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

Defined in: [src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

#### Inherited from

`IoNodeMixin(Object)._eventDispatcher`

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

Defined in: [src/core/node.ts:43](https://github.com/io-gui/io/blob/main/src/core/node.ts#L43)

#### Inherited from

`IoNodeMixin(Object)._properties`

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

Defined in: [src/core/node.ts:42](https://github.com/io-gui/io/blob/main/src/core/node.ts#L42)

#### Inherited from

`IoNodeMixin(Object)._protochain`

## Accessors

### Properties

#### Get Signature

> **get** `static` **Properties**(): [`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

Defined in: [src/core/node.ts:33](https://github.com/io-gui/io/blob/main/src/core/node.ts#L33)

##### Returns

[`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

#### Inherited from

`IoNodeMixin(Object).Properties`

## Methods

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

`IoNodeMixin(Object).addEventListener`

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

`IoNodeMixin(Object).applyProperties`

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

`IoNodeMixin(Object).bind`

***

### changed()

> **changed**(): `void`

Defined in: [src/core/node.ts:240](https://github.com/io-gui/io/blob/main/src/core/node.ts#L240)

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Object).changed`

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

`IoNodeMixin(Object).dispatchEvent`

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

`IoNodeMixin(Object).dispatchMutationEvent`

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

`IoNodeMixin(Object).dispatchQueue`

***

### dispose()

> **dispose**(): `void`

Defined in: [src/core/node.ts:382](https://github.com/io-gui/io/blob/main/src/core/node.ts#L382)

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Object).dispose`

***

### init()

> **init**(): `void`

Defined in: [src/core/node.ts:241](https://github.com/io-gui/io/blob/main/src/core/node.ts#L241)

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Object).init`

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

`IoNodeMixin(Object).inputValue`

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

`IoNodeMixin(Object).objectMutated`

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

`IoNodeMixin(Object).onObjectMutated`

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

`IoNodeMixin(Object).queue`

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

`IoNodeMixin(Object).Register`

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

`IoNodeMixin(Object).removeEventListener`

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

`IoNodeMixin(Object).setProperties`

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

`IoNodeMixin(Object).setProperty`

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

`IoNodeMixin(Object).throttle`

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

`IoNodeMixin(Object).unbind`
