[**io-gui**](../README.md)

***

# Class: MenuItem

Defined in: [src/elements/menus/models/menu-item.ts:25](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L25)

IoNodeMixin applied to `Object` class.

## Extends

- [`IoNode`](IoNode.md)

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### new MenuItem()

> **new MenuItem**(`args`?): [`MenuItem`](MenuItem.md)

Defined in: [src/elements/menus/models/menu-item.ts:65](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L65)

#### Parameters

##### args?

[`MenuItemArgsLoose`](../type-aliases/MenuItemArgsLoose.md)

#### Returns

[`MenuItem`](MenuItem.md)

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

### action()?

> `optional` **action**: (`value`?) => `void`

Defined in: [src/elements/menus/models/menu-item.ts:46](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L46)

#### Parameters

##### value?

`any`

#### Returns

`void`

***

### disabled

> **disabled**: `boolean`

Defined in: [src/elements/menus/models/menu-item.ts:43](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L43)

***

### hidden

> **hidden**: `boolean`

Defined in: [src/elements/menus/models/menu-item.ts:40](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L40)

***

### hint

> **hint**: `string`

Defined in: [src/elements/menus/models/menu-item.ts:37](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L37)

***

### icon

> **icon**: `string`

Defined in: [src/elements/menus/models/menu-item.ts:34](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L34)

***

### label

> **label**: `string`

Defined in: [src/elements/menus/models/menu-item.ts:31](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L31)

***

### mode

> **mode**: [`MenuItemSelectType`](../type-aliases/MenuItemSelectType.md)

Defined in: [src/elements/menus/models/menu-item.ts:49](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L49)

***

### options?

> `optional` **options**: [`MenuOptions`](MenuOptions.md)

Defined in: [src/elements/menus/models/menu-item.ts:55](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L55)

***

### selected

> **selected**: `boolean`

Defined in: [src/elements/menus/models/menu-item.ts:52](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L52)

***

### value

> **value**: `any`

Defined in: [src/elements/menus/models/menu-item.ts:28](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L28)

## Accessors

### hasmore

#### Get Signature

> **get** **hasmore**(): `boolean`

Defined in: [src/elements/menus/models/menu-item.ts:57](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L57)

##### Returns

`boolean`

***

### Properties

#### Get Signature

> **get** `static` **Properties**(): [`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

Defined in: [src/core/node.ts:33](https://github.com/io-gui/io/blob/main/src/core/node.ts#L33)

##### Returns

[`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

#### Inherited from

[`IoNode`](IoNode.md).[`Properties`](IoNode.md#properties)

## Methods

### \_onOptionsPathChanged()

> **\_onOptionsPathChanged**(`event`): `void`

Defined in: [src/elements/menus/models/menu-item.ts:148](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L148)

#### Parameters

##### event

`CustomEvent`

#### Returns

`void`

***

### \_onSubItemSelected()

> **\_onSubItemSelected**(): `void`

Defined in: [src/elements/menus/models/menu-item.ts:144](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L144)

#### Returns

`void`

***

### addEventListener()

> **addEventListener**(`type`, `listener`, `options`?): `void`

Defined in: [src/core/node.ts:342](https://github.com/io-gui/io/blob/main/src/core/node.ts#L342)

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

Defined in: [src/core/node.ts:184](https://github.com/io-gui/io/blob/main/src/core/node.ts#L184)

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

Defined in: [src/core/node.ts:309](https://github.com/io-gui/io/blob/main/src/core/node.ts#L309)

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

Defined in: [src/elements/menus/models/menu-item.ts:170](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L170)

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

[`IoNode`](IoNode.md).[`changed`](IoNode.md#changed)

***

### dispatchEvent()

> **dispatchEvent**(`type`, `detail`, `bubbles`, `src`?): `void`

Defined in: [src/core/node.ts:367](https://github.com/io-gui/io/blob/main/src/core/node.ts#L367)

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

Defined in: [src/core/node.ts:374](https://github.com/io-gui/io/blob/main/src/core/node.ts#L374)

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

> **dispatchQueue**(): `void`

Defined in: [src/core/node.ts:249](https://github.com/io-gui/io/blob/main/src/core/node.ts#L249)

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`dispatchQueue`](IoNode.md#dispatchqueue)

***

### dispatchQueueSync()

> **dispatchQueueSync**(): `void`

Defined in: [src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`dispatchQueueSync`](IoNode.md#dispatchqueuesync)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/elements/menus/models/menu-item.ts:174](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L174)

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Overrides

[`IoNode`](IoNode.md).[`dispose`](IoNode.md#dispose)

***

### getSubitem()

> **getSubitem**(`value`): `any`

Defined in: [src/elements/menus/models/menu-item.ts:61](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L61)

#### Parameters

##### value

`any`

#### Returns

`any`

***

### init()

> **init**(): `void`

Defined in: [src/core/node.ts:236](https://github.com/io-gui/io/blob/main/src/core/node.ts#L236)

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`init`](IoNode.md#init)

***

### inputValue()

> **inputValue**(`value`): `void`

Defined in: [src/core/node.ts:224](https://github.com/io-gui/io/blob/main/src/core/node.ts#L224)

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

Defined in: [src/core/node.ts:298](https://github.com/io-gui/io/blob/main/src/core/node.ts#L298)

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

Defined in: [src/core/node.ts:277](https://github.com/io-gui/io/blob/main/src/core/node.ts#L277)

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

### optionsChanged()

> **optionsChanged**(): `void`

Defined in: [src/elements/menus/models/menu-item.ts:152](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L152)

#### Returns

`void`

***

### queue()

> **queue**(`prop`, `value`, `oldValue`): `void`

Defined in: [src/core/node.ts:243](https://github.com/io-gui/io/blob/main/src/core/node.ts#L243)

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

Defined in: [src/core/node.ts:416](https://github.com/io-gui/io/blob/main/src/core/node.ts#L416)

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

Defined in: [src/core/node.ts:357](https://github.com/io-gui/io/blob/main/src/core/node.ts#L357)

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

### selectedChanged()

> **selectedChanged**(): `void`

Defined in: [src/elements/menus/models/menu-item.ts:159](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L159)

#### Returns

`void`

***

### setProperties()

> **setProperties**(`props`): `void`

Defined in: [src/core/node.ts:206](https://github.com/io-gui/io/blob/main/src/core/node.ts#L206)

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

> **setProperty**(`name`, `value`, `skipDispatch`?): `void`

Defined in: [src/core/node.ts:111](https://github.com/io-gui/io/blob/main/src/core/node.ts#L111)

Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.

#### Parameters

##### name

`string`

Property name to set value of.

##### value

`any`

Peroperty value.

##### skipDispatch?

`boolean`

flag to skip event dispatch.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`setProperty`](IoNode.md#setproperty)

***

### throttle()

> **throttle**(`func`, `arg`, `timeout`): `void`

Defined in: [src/core/node.ts:268](https://github.com/io-gui/io/blob/main/src/core/node.ts#L268)

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

### toJSON()

> **toJSON**(): `Record`\<`string`, `any`\>

Defined in: [src/elements/menus/models/menu-item.ts:131](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L131)

#### Returns

`Record`\<`string`, `any`\>

***

### unbind()

> **unbind**(`prop`): `void`

Defined in: [src/core/node.ts:326](https://github.com/io-gui/io/blob/main/src/core/node.ts#L326)

Unbinds a binding to a specified property`.

#### Parameters

##### prop

`string`

Property to unbind.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`unbind`](IoNode.md#unbind)
