[**io-gui**](../README.md) • **Docs**

***

[io-gui](../README.md) / MenuItem

# Class: MenuItem

IoNodeMixin applied to `Object` class.

## Extends

- [`IoNode`](IoNode.md)

## Constructors

### new MenuItem()

> **new MenuItem**(`args`?): [`MenuItem`](MenuItem.md)

#### Parameters

• **args?**: [`MenuItemArgsLoose`](../type-aliases/MenuItemArgsLoose.md)

#### Returns

[`MenuItem`](MenuItem.md)

#### Overrides

[`IoNode`](IoNode.md).[`constructor`](IoNode.md#constructors)

#### Defined in

[src/elements/menus/models/menu-item.ts:65](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L65)

## Properties

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[`IoNode`](IoNode.md).[`_bindings`](IoNode.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[`IoNode`](IoNode.md).[`_changeQueue`](IoNode.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[`IoNode`](IoNode.md).[`_eventDispatcher`](IoNode.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[`IoNode`](IoNode.md).[`_properties`](IoNode.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[`IoNode`](IoNode.md).[`_protochain`](IoNode.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

***

### action()?

> `optional` **action**: (`value`?) => `void`

#### Parameters

• **value?**: `any`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-item.ts:46](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L46)

***

### disabled

> **disabled**: `boolean`

#### Defined in

[src/elements/menus/models/menu-item.ts:43](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L43)

***

### hidden

> **hidden**: `boolean`

#### Defined in

[src/elements/menus/models/menu-item.ts:40](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L40)

***

### hint

> **hint**: `string`

#### Defined in

[src/elements/menus/models/menu-item.ts:37](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L37)

***

### icon

> **icon**: `string`

#### Defined in

[src/elements/menus/models/menu-item.ts:34](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L34)

***

### label

> **label**: `string`

#### Defined in

[src/elements/menus/models/menu-item.ts:31](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L31)

***

### mode

> **mode**: [`MenuItemSelectType`](../type-aliases/MenuItemSelectType.md)

#### Defined in

[src/elements/menus/models/menu-item.ts:49](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L49)

***

### options?

> `optional` **options**: [`MenuOptions`](MenuOptions.md)

#### Defined in

[src/elements/menus/models/menu-item.ts:55](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L55)

***

### selected

> **selected**: `boolean`

#### Defined in

[src/elements/menus/models/menu-item.ts:52](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L52)

***

### value

> **value**: `any`

#### Defined in

[src/elements/menus/models/menu-item.ts:28](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L28)

## Accessors

### hasmore

> `get` **hasmore**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/elements/menus/models/menu-item.ts:57](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L57)

***

### Properties

> `get` `static` **Properties**(): [`PropertyDeclarations`](../type-aliases/PropertyDeclarations.md)

#### Returns

[`PropertyDeclarations`](../type-aliases/PropertyDeclarations.md)

#### Inherited from

[`IoNode`](IoNode.md).[`Properties`](IoNode.md#properties)

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

## Methods

### Register()

> **Register**(`ioNodeConstructor`): `void`

#### Parameters

• **ioNodeConstructor**: *typeof* [`IoNode`](IoNode.md)

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`Register`](IoNode.md#register)

#### Defined in

[src/core/node.ts:427](https://github.com/io-gui/io/blob/main/src/core/node.ts#L427)

***

### \_onOptionsPathChanged()

> **\_onOptionsPathChanged**(`event`): `void`

#### Parameters

• **event**: `CustomEvent`\<`any`\>

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-item.ts:148](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L148)

***

### \_onSubItemSelected()

> **\_onSubItemSelected**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-item.ts:144](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L144)

***

### addEventListener()

> **addEventListener**(`type`, `listener`, `options`?): `void`

Wrapper for addEventListener.

#### Parameters

• **type**: `string`

listener name.

• **listener**: [`AnyEventListener`](../type-aliases/AnyEventListener.md)

listener handler.

• **options?**: `AddEventListenerOptions`

event listener options.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`addEventListener`](IoNode.md#addeventlistener)

#### Defined in

[src/core/node.ts:353](https://github.com/io-gui/io/blob/main/src/core/node.ts#L353)

***

### applyProperties()

> **applyProperties**(`props`): `void`

Sets multiple properties in batch.
[property]-changed` events will be broadcast in the end.

#### Parameters

• **props**: `any`

Map of property names and values.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`applyProperties`](IoNode.md#applyproperties)

#### Defined in

[src/core/node.ts:195](https://github.com/io-gui/io/blob/main/src/core/node.ts#L195)

***

### bind()

> **bind**(`prop`): [`Binding`](Binding.md)

Returns a binding to a specified property`.

#### Parameters

• **prop**: `string`

Property to bind to.

#### Returns

[`Binding`](Binding.md)

Binding object.

#### Inherited from

[`IoNode`](IoNode.md).[`bind`](IoNode.md#bind)

#### Defined in

[src/core/node.ts:320](https://github.com/io-gui/io/blob/main/src/core/node.ts#L320)

***

### changed()

> **changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

[`IoNode`](IoNode.md).[`changed`](IoNode.md#changed)

#### Defined in

[src/elements/menus/models/menu-item.ts:170](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L170)

***

### dispatchEvent()

> **dispatchEvent**(`type`, `detail`, `bubbles`, `src`?): `void`

Wrapper for dispatchEvent.

#### Parameters

• **type**: `string`

event name to dispatch.

• **detail** = `{}`

event detail.

• **bubbles**: `boolean` = `false`

event bubbles.

• **src?**: `Node` \| `Document` \| `HTMLElement` \| `Window`

source node/element to dispatch event from.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`dispatchEvent`](IoNode.md#dispatchevent)

#### Defined in

[src/core/node.ts:378](https://github.com/io-gui/io/blob/main/src/core/node.ts#L378)

***

### dispatchMutationEvent()

> **dispatchMutationEvent**(`object`): `void`

Shorthand for dispatching `'object-mutated'` event on window.

#### Parameters

• **object**: `any`

object which mutated.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`dispatchMutationEvent`](IoNode.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:385](https://github.com/io-gui/io/blob/main/src/core/node.ts#L385)

***

### dispatchQueue()

> **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`dispatchQueue`](IoNode.md#dispatchqueue)

#### Defined in

[src/core/node.ts:260](https://github.com/io-gui/io/blob/main/src/core/node.ts#L260)

***

### dispatchQueueSync()

> **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`dispatchQueueSync`](IoNode.md#dispatchqueuesync)

#### Defined in

[src/core/node.ts:270](https://github.com/io-gui/io/blob/main/src/core/node.ts#L270)

***

### dispose()

> **dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Overrides

[`IoNode`](IoNode.md).[`dispose`](IoNode.md#dispose)

#### Defined in

[src/elements/menus/models/menu-item.ts:174](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L174)

***

### getSubitem()

> **getSubitem**(`value`): `any`

#### Parameters

• **value**: `any`

#### Returns

`any`

#### Defined in

[src/elements/menus/models/menu-item.ts:61](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L61)

***

### init()

> **init**(): `void`

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`init`](IoNode.md#init)

#### Defined in

[src/core/node.ts:247](https://github.com/io-gui/io/blob/main/src/core/node.ts#L247)

***

### inputValue()

> **inputValue**(`value`): `void`

Sets value property and emits `value-input` event.
Use this when value property is set by user action (e.g. mouse click).

#### Parameters

• **value**: `any`

Property value.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`inputValue`](IoNode.md#inputvalue)

#### Defined in

[src/core/node.ts:235](https://github.com/io-gui/io/blob/main/src/core/node.ts#L235)

***

### objectMutated()

> **objectMutated**(`prop`): `void`

This function is called after `onObjectMutated()` determines that one of
the object properties has mutated.

#### Parameters

• **prop**: `string`

Mutated object property name.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`objectMutated`](IoNode.md#objectmutated)

#### Defined in

[src/core/node.ts:309](https://github.com/io-gui/io/blob/main/src/core/node.ts#L309)

***

### onObjectMutated()

> **onObjectMutated**(`event`): `void`

Event handler for 'object-mutated' event emitted from the `window`.
Node should be listening for this event if it has an observed object property

#### Parameters

• **event**: `CustomEvent`\<`any`\>

Event payload.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`onObjectMutated`](IoNode.md#onobjectmutated)

#### Defined in

[src/core/node.ts:288](https://github.com/io-gui/io/blob/main/src/core/node.ts#L288)

***

### optionsChanged()

> **optionsChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-item.ts:152](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L152)

***

### queue()

> **queue**(`prop`, `value`, `oldValue`): `void`

Adds property change to the queue.

#### Parameters

• **prop**: `string`

Property name.

• **value**: `any`

Property value.

• **oldValue**: `any`

Old property value.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`queue`](IoNode.md#queue)

#### Defined in

[src/core/node.ts:254](https://github.com/io-gui/io/blob/main/src/core/node.ts#L254)

***

### removeEventListener()

> **removeEventListener**(`type`, `listener`?, `options`?): `void`

Wrapper for removeEventListener.

#### Parameters

• **type**: `string`

event name to listen to.

• **listener?**: [`AnyEventListener`](../type-aliases/AnyEventListener.md)

listener handler.

• **options?**: `AddEventListenerOptions`

event listener options.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`removeEventListener`](IoNode.md#removeeventlistener)

#### Defined in

[src/core/node.ts:368](https://github.com/io-gui/io/blob/main/src/core/node.ts#L368)

***

### selectedChanged()

> **selectedChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-item.ts:159](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L159)

***

### setProperties()

> **setProperties**(`props`): `void`

Sets multiple properties in batch.
[property]-changed` events will be broadcast in the end.

#### Parameters

• **props**: `any`

Map of property names and values.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`setProperties`](IoNode.md#setproperties)

#### Defined in

[src/core/node.ts:217](https://github.com/io-gui/io/blob/main/src/core/node.ts#L217)

***

### setProperty()

> **setProperty**(`name`, `value`, `skipDispatch`?): `void`

Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.

#### Parameters

• **name**: `string`

Property name to set value of.

• **value**: `any`

Peroperty value.

• **skipDispatch?**: `boolean`

flag to skip event dispatch.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`setProperty`](IoNode.md#setproperty)

#### Defined in

[src/core/node.ts:122](https://github.com/io-gui/io/blob/main/src/core/node.ts#L122)

***

### throttle()

> **throttle**(`func`, `arg`, `timeout`): `void`

Throttles function execution to next frame (rAF) if the function has been executed in the current frame.

#### Parameters

• **func**: [`CallbackFunction`](../type-aliases/CallbackFunction.md)

Function to throttle.

• **arg**: `any` = `undefined`

argument for throttled function.

• **timeout**: `number` = `1`

minimum delay in ms before executing the function.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`throttle`](IoNode.md#throttle)

#### Defined in

[src/core/node.ts:279](https://github.com/io-gui/io/blob/main/src/core/node.ts#L279)

***

### toJSON()

> **toJSON**(): `Record`\<`string`, `any`\>

#### Returns

`Record`\<`string`, `any`\>

#### Defined in

[src/elements/menus/models/menu-item.ts:131](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L131)

***

### unbind()

> **unbind**(`prop`): `void`

Unbinds a binding to a specified property`.

#### Parameters

• **prop**: `string`

Property to unbind.

#### Returns

`void`

#### Inherited from

[`IoNode`](IoNode.md).[`unbind`](IoNode.md#unbind)

#### Defined in

[src/core/node.ts:337](https://github.com/io-gui/io/blob/main/src/core/node.ts#L337)
