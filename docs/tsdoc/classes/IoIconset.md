[**io-gui**](../README.md) • **Docs**

***

[io-gui](../README.md) / IoIconset

# Class: IoIconset

Global database for SVG assets to be used with `IoIcon`. Icons are registered using `namespace` and `id` attribute.

```javascript
import {IoIconsetSingleton} from "./path_to/iogui.js";
const svgString = `<svg><g id="myicon"><path d="..."/></g></svg>`;

// register icons under "custom" namespace
IoIconsetSingleton.registerIcons('custom', svgString);
// retrieve specific icon
const icon = IoIconsetSingleton.getIcon('custom:myicon');
```

## Extends

- [`IoNode`](IoNode.md)

## Constructors

### new IoIconset()

> **new IoIconset**(...`args`): [`IoIconset`](IoIconset.md)

Creates a class instance and initializes the internals.

#### Parameters

• ...**args**: `any`[]

#### Returns

[`IoIconset`](IoIconset.md)

#### Inherited from

[`IoNode`](IoNode.md).[`constructor`](IoNode.md#constructors)

#### Defined in

[src/core/node.ts:63](https://github.com/io-gui/io/blob/main/src/core/node.ts#L63)

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

## Accessors

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

#### Inherited from

[`IoNode`](IoNode.md).[`changed`](IoNode.md#changed)

#### Defined in

[src/core/node.ts:246](https://github.com/io-gui/io/blob/main/src/core/node.ts#L246)

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

#### Inherited from

[`IoNode`](IoNode.md).[`dispose`](IoNode.md#dispose)

#### Defined in

[src/core/node.ts:392](https://github.com/io-gui/io/blob/main/src/core/node.ts#L392)

***

### getIcon()

> **getIcon**(`icon`): `string`

#### Parameters

• **icon**: `string`

#### Returns

`string`

#### Defined in

[src/elements/basic/io-iconset.ts:28](https://github.com/io-gui/io/blob/main/src/elements/basic/io-iconset.ts#L28)

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

### registerIcons()

> **registerIcons**(`name`, `svg`): `void`

#### Parameters

• **name**: `string`

• **svg**: `string`

#### Returns

`void`

#### Defined in

[src/elements/basic/io-iconset.ts:20](https://github.com/io-gui/io/blob/main/src/elements/basic/io-iconset.ts#L20)

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
