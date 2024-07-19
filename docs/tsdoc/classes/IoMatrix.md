[**io-gui**](../README.md) • **Docs**

***

[io-gui](../README.md) / IoMatrix

# Class: IoMatrix

Input element for vector arrays dispalayed as 2D matrices. Array `value` can have 4, 9, and 16 elements for 2x2, 3x3 and 4x4 matrices.

<io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 1]}'></io-element-demo>

<io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 0, 1, 0, 0, 0, 1]}'></io-element-demo>

<io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]}'></io-element-demo>

## Extends

- [`IoVector`](IoVector.md)

## Constructors

### new IoMatrix()

> **new IoMatrix**(...`args`): [`IoMatrix`](IoMatrix.md)

Creates a class instance and initializes the internals.

#### Parameters

• ...**args**: `any`[]

#### Returns

[`IoMatrix`](IoMatrix.md)

#### Inherited from

[`IoVector`](IoVector.md).[`constructor`](IoVector.md#constructors)

#### Defined in

[src/core/node.ts:63](https://github.com/io-gui/io/blob/main/src/core/node.ts#L63)

## Properties

### $

> **$**: `Record`\<`string`, `any`\>

#### Inherited from

[`IoVector`](IoVector.md).[`$`](IoVector.md#$)

#### Defined in

[src/core/element.ts:178](https://github.com/io-gui/io/blob/main/src/core/element.ts#L178)

***

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[`IoVector`](IoVector.md).[`_bindings`](IoVector.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[`IoVector`](IoVector.md).[`_changeQueue`](IoVector.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[`IoVector`](IoVector.md).[`_eventDispatcher`](IoVector.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[`IoVector`](IoVector.md).[`_properties`](IoVector.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[`IoVector`](IoVector.md).[`_protochain`](IoVector.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

***

### class

> **class**: `string`

#### Inherited from

[`IoVector`](IoVector.md).[`class`](IoVector.md#class)

#### Defined in

[src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

***

### columns

> **columns**: `number`

#### Defined in

[src/elements/vectors/io-matrix.ts:42](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L42)

***

### contenteditable

> **contenteditable**: `boolean`

#### Inherited from

[`IoVector`](IoVector.md).[`contenteditable`](IoVector.md#contenteditable)

#### Defined in

[src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

***

### conversion

> **conversion**: `number`

#### Inherited from

[`IoVector`](IoVector.md).[`conversion`](IoVector.md#conversion)

#### Defined in

[src/elements/vectors/io-vector.ts:40](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L40)

***

### disabled

> **disabled**: `boolean`

#### Inherited from

[`IoVector`](IoVector.md).[`disabled`](IoVector.md#disabled)

#### Defined in

[src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

***

### hidden

> **hidden**: `boolean`

#### Inherited from

[`IoVector`](IoVector.md).[`hidden`](IoVector.md#hidden)

#### Defined in

[src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

***

### id

> **id**: `string`

#### Inherited from

[`IoVector`](IoVector.md).[`id`](IoVector.md#id)

#### Defined in

[src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

***

### keys

> **keys**: `string`[]

#### Inherited from

[`IoVector`](IoVector.md).[`keys`](IoVector.md#keys)

#### Defined in

[src/elements/vectors/io-vector.ts:61](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L61)

***

### label

> **label**: `string`

#### Inherited from

[`IoVector`](IoVector.md).[`label`](IoVector.md#label)

#### Defined in

[src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

***

### ladder

> **ladder**: `boolean`

#### Inherited from

[`IoVector`](IoVector.md).[`ladder`](IoVector.md#ladder)

#### Defined in

[src/elements/vectors/io-vector.ts:58](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L58)

***

### linkable

> **linkable**: `boolean`

#### Inherited from

[`IoVector`](IoVector.md).[`linkable`](IoVector.md#linkable)

#### Defined in

[src/elements/vectors/io-vector.ts:52](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L52)

***

### linked

> **linked**: `boolean`

#### Inherited from

[`IoVector`](IoVector.md).[`linked`](IoVector.md#linked)

#### Defined in

[src/elements/vectors/io-vector.ts:55](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L55)

***

### max

> **max**: `number`

#### Inherited from

[`IoVector`](IoVector.md).[`max`](IoVector.md#max)

#### Defined in

[src/elements/vectors/io-vector.ts:49](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L49)

***

### min

> **min**: `number`

#### Inherited from

[`IoVector`](IoVector.md).[`min`](IoVector.md#min)

#### Defined in

[src/elements/vectors/io-vector.ts:46](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L46)

***

### name

> **name**: `string`

#### Inherited from

[`IoVector`](IoVector.md).[`name`](IoVector.md#name)

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

***

### role

> **role**: `string`

#### Inherited from

[`IoVector`](IoVector.md).[`role`](IoVector.md#role)

#### Defined in

[src/core/element.ts:190](https://github.com/io-gui/io/blob/main/src/core/element.ts#L190)

***

### step

> **step**: `number`

#### Inherited from

[`IoVector`](IoVector.md).[`step`](IoVector.md#step)

#### Defined in

[src/elements/vectors/io-vector.ts:43](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L43)

***

### tabindex

> **tabindex**: `string`

#### Inherited from

[`IoVector`](IoVector.md).[`tabindex`](IoVector.md#tabindex)

#### Defined in

[src/core/element.ts:181](https://github.com/io-gui/io/blob/main/src/core/element.ts#L181)

***

### title

> **title**: `string`

#### Inherited from

[`IoVector`](IoVector.md).[`title`](IoVector.md#title)

#### Defined in

[src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

***

### value

> **value**: `number`[]

#### Overrides

[`IoVector`](IoVector.md).[`value`](IoVector.md#value)

#### Defined in

[src/elements/vectors/io-matrix.ts:39](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L39)

## Accessors

### textNode

> `get` **textNode**(): `any`

> `set` **textNode**(`value`): `void`

#### Parameters

• **value**: `any`

#### Returns

`any`

#### Inherited from

[`IoVector`](IoVector.md).[`textNode`](IoVector.md#textnode)

#### Defined in

[src/core/element.ts:392](https://github.com/io-gui/io/blob/main/src/core/element.ts#L392)

***

### Properties

> `get` `static` **Properties**(): [`PropertyDeclarations`](../type-aliases/PropertyDeclarations.md)

#### Returns

[`PropertyDeclarations`](../type-aliases/PropertyDeclarations.md)

#### Inherited from

[`IoVector`](IoVector.md).[`Properties`](IoVector.md#properties)

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

***

### Style

> `get` `static` **Style**(): `string`

#### Returns

`string`

#### Overrides

[`IoVector`](IoVector.md).[`Style`](IoVector.md#style)

#### Defined in

[src/elements/vectors/io-matrix.ts:15](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L15)

## Methods

### Register()

> **Register**(`ioNodeConstructor`): `void`

#### Parameters

• **ioNodeConstructor**: *typeof* [`IoNode`](IoNode.md)

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`Register`](IoVector.md#register)

#### Defined in

[src/core/element.ts:304](https://github.com/io-gui/io/blob/main/src/core/element.ts#L304)

***

### \_flattenTextNode()

> **\_flattenTextNode**(`element`): `void`

Helper function to flatten textContent into a single TextNode.
Update textContent via TextNode is better for layout performance.

#### Parameters

• **element**: `HTMLElement` \| [`IoElement`](IoElement.md)

Element to flatten.

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`_flattenTextNode`](IoVector.md#_flattentextnode)

#### Defined in

[src/core/element.ts:375](https://github.com/io-gui/io/blob/main/src/core/element.ts#L375)

***

### \_onNumberPointerDown()

> **\_onNumberPointerDown**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`_onNumberPointerDown`](IoVector.md#_onnumberpointerdown)

#### Defined in

[src/elements/vectors/io-vector.ts:65](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L65)

***

### \_onNumberValueInput()

> **\_onNumberValueInput**(`event`): `void`

#### Parameters

• **event**: `CustomEvent`\<`any`\>

#### Returns

`void`

#### Overrides

[`IoVector`](IoVector.md).[`_onNumberValueInput`](IoVector.md#_onnumbervalueinput)

#### Defined in

[src/elements/vectors/io-matrix.ts:44](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L44)

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

[`IoVector`](IoVector.md).[`addEventListener`](IoVector.md#addeventlistener)

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

[`IoVector`](IoVector.md).[`applyProperties`](IoVector.md#applyproperties)

#### Defined in

[src/core/element.ts:400](https://github.com/io-gui/io/blob/main/src/core/element.ts#L400)

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

[`IoVector`](IoVector.md).[`bind`](IoVector.md#bind)

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

[`IoVector`](IoVector.md).[`changed`](IoVector.md#changed)

#### Defined in

[src/elements/vectors/io-vector.ts:99](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L99)

***

### connectedCallback()

> **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`connectedCallback`](IoVector.md#connectedcallback)

#### Defined in

[src/core/element.ts:213](https://github.com/io-gui/io/blob/main/src/core/element.ts#L213)

***

### disabledChanged()

> **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`disabledChanged`](IoVector.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

***

### disconnectedCallback()

> **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`disconnectedCallback`](IoVector.md#disconnectedcallback)

#### Defined in

[src/core/element.ts:221](https://github.com/io-gui/io/blob/main/src/core/element.ts#L221)

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

[`IoVector`](IoVector.md).[`dispatchEvent`](IoVector.md#dispatchevent)

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

[`IoVector`](IoVector.md).[`dispatchMutationEvent`](IoVector.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:385](https://github.com/io-gui/io/blob/main/src/core/node.ts#L385)

***

### dispatchQueue()

> **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`dispatchQueue`](IoVector.md#dispatchqueue)

#### Defined in

[src/core/node.ts:260](https://github.com/io-gui/io/blob/main/src/core/node.ts#L260)

***

### dispatchQueueSync()

> **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`dispatchQueueSync`](IoVector.md#dispatchqueuesync)

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

[`IoVector`](IoVector.md).[`dispose`](IoVector.md#dispose)

#### Defined in

[src/core/node.ts:392](https://github.com/io-gui/io/blob/main/src/core/node.ts#L392)

***

### getSlotted()

> **getSlotted**(): `null` \| `any`[]

#### Returns

`null` \| `any`[]

#### Inherited from

[`IoVector`](IoVector.md).[`getSlotted`](IoVector.md#getslotted)

#### Defined in

[src/elements/vectors/io-vector.ts:119](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L119)

***

### init()

> **init**(): `void`

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`init`](IoVector.md#init)

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

[`IoVector`](IoVector.md).[`inputValue`](IoVector.md#inputvalue)

#### Defined in

[src/core/node.ts:235](https://github.com/io-gui/io/blob/main/src/core/node.ts#L235)

***

### labelChanged()

> **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`labelChanged`](IoVector.md#labelchanged)

#### Defined in

[src/core/element.ts:422](https://github.com/io-gui/io/blob/main/src/core/element.ts#L422)

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

[`IoVector`](IoVector.md).[`objectMutated`](IoVector.md#objectmutated)

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

[`IoVector`](IoVector.md).[`onObjectMutated`](IoVector.md#onobjectmutated)

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

[`IoVector`](IoVector.md).[`queue`](IoVector.md#queue)

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

[`IoVector`](IoVector.md).[`removeEventListener`](IoVector.md#removeeventlistener)

#### Defined in

[src/core/node.ts:368](https://github.com/io-gui/io/blob/main/src/core/node.ts#L368)

***

### setAttribute()

> **setAttribute**(`attr`, `value`): `void`

Alias for HTMLElement setAttribute where falsey values remove the attribute.

#### Parameters

• **attr**: `string`

Attribute name.

• **value**: `string` \| `number` \| `boolean`

Attribute value.

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`setAttribute`](IoVector.md#setattribute)

#### Defined in

[src/core/element.ts:413](https://github.com/io-gui/io/blob/main/src/core/element.ts#L413)

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

[`IoVector`](IoVector.md).[`setProperties`](IoVector.md#setproperties)

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

[`IoVector`](IoVector.md).[`setProperty`](IoVector.md#setproperty)

#### Defined in

[src/core/node.ts:122](https://github.com/io-gui/io/blob/main/src/core/node.ts#L122)

***

### template()

> **template**(`vDOM`, `host`?, `cache`?): `void`

Renders DOM from virtual DOM arrays.

#### Parameters

• **vDOM**: `any`[]

Array of vDOM children.

• **host?**: `HTMLElement`

Optional template target.

• **cache?**: `boolean`

Optional don't reuse existing elements and skip dispose

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`template`](IoVector.md#template)

#### Defined in

[src/core/element.ts:233](https://github.com/io-gui/io/blob/main/src/core/element.ts#L233)

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

[`IoVector`](IoVector.md).[`throttle`](IoVector.md#throttle)

#### Defined in

[src/core/node.ts:279](https://github.com/io-gui/io/blob/main/src/core/node.ts#L279)

***

### traverse()

> **traverse**(`vChildren`, `host`?, `cache`?): `void`

Recurively traverses vDOM.
TODO: test element.traverse() function!

#### Parameters

• **vChildren**: `any`[]

Array of vDOM children converted by `buildTree()` for easier parsing.

• **host?**: `HTMLElement`

Optional template target.

• **cache?**: `boolean`

Optional don't reuse existing elements and skip dispose

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`traverse`](IoVector.md#traverse)

#### Defined in

[src/core/element.ts:246](https://github.com/io-gui/io/blob/main/src/core/element.ts#L246)

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

[`IoVector`](IoVector.md).[`unbind`](IoVector.md#unbind)

#### Defined in

[src/core/node.ts:337](https://github.com/io-gui/io/blob/main/src/core/node.ts#L337)

***

### valueChanged()

> **valueChanged**(): `void`

#### Returns

`void`

#### Overrides

[`IoVector`](IoVector.md).[`valueChanged`](IoVector.md#valuechanged)

#### Defined in

[src/elements/vectors/io-matrix.ts:54](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L54)
