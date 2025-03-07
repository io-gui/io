[**io-gui**](../README.md)

***

[io-gui](../README.md) / IoMatrix

# Class: IoMatrix

Defined in: [src/elements/vectors/io-matrix.ts:14](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L14)

Input element for vector arrays dispalayed as 2D matrices. Array `value` can have 4, 9, and 16 elements for 2x2, 3x3 and 4x4 matrices.

<io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 1]}'></io-element-demo>

<io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 0, 1, 0, 0, 0, 1]}'></io-element-demo>

<io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]}'></io-element-demo>

## Extends

- [`IoVector`](IoVector.md)

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### new IoMatrix()

> **new IoMatrix**(...`args`): [`IoMatrix`](IoMatrix.md)

Defined in: [src/core/node.ts:52](https://github.com/io-gui/io/blob/main/src/core/node.ts#L52)

Creates a class instance and initializes the internals.

#### Parameters

##### args

...`any`[]

#### Returns

[`IoMatrix`](IoMatrix.md)

#### Inherited from

[`IoVector`](IoVector.md).[`constructor`](IoVector.md#constructors)

## Properties

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

Defined in: [src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

#### Inherited from

[`IoVector`](IoVector.md).[`_bindings`](IoVector.md#_bindings)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

Defined in: [src/core/node.ts:45](https://github.com/io-gui/io/blob/main/src/core/node.ts#L45)

#### Inherited from

[`IoVector`](IoVector.md).[`_changeQueue`](IoVector.md#_changequeue)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

Defined in: [src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

#### Inherited from

[`IoVector`](IoVector.md).[`_eventDispatcher`](IoVector.md#_eventdispatcher)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

Defined in: [src/core/node.ts:43](https://github.com/io-gui/io/blob/main/src/core/node.ts#L43)

#### Inherited from

[`IoVector`](IoVector.md).[`_properties`](IoVector.md#_properties)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

Defined in: [src/core/node.ts:42](https://github.com/io-gui/io/blob/main/src/core/node.ts#L42)

#### Inherited from

[`IoVector`](IoVector.md).[`_protochain`](IoVector.md#_protochain)

***

### $

> **$**: `Record`\<`string`, `any`\>

Defined in: [src/core/element.ts:179](https://github.com/io-gui/io/blob/main/src/core/element.ts#L179)

#### Inherited from

[`IoVector`](IoVector.md).[`$`](IoVector.md#$)

***

### class

> **class**: `string`

Defined in: [src/core/element.ts:188](https://github.com/io-gui/io/blob/main/src/core/element.ts#L188)

#### Inherited from

[`IoVector`](IoVector.md).[`class`](IoVector.md#class)

***

### columns

> **columns**: `number`

Defined in: [src/elements/vectors/io-matrix.ts:42](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L42)

***

### contenteditable

> **contenteditable**: `boolean`

Defined in: [src/core/element.ts:185](https://github.com/io-gui/io/blob/main/src/core/element.ts#L185)

#### Inherited from

[`IoVector`](IoVector.md).[`contenteditable`](IoVector.md#contenteditable)

***

### conversion

> **conversion**: `number`

Defined in: [src/elements/vectors/io-vector.ts:40](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L40)

#### Inherited from

[`IoVector`](IoVector.md).[`conversion`](IoVector.md#conversion)

***

### disabled

> **disabled**: `boolean`

Defined in: [src/core/element.ts:209](https://github.com/io-gui/io/blob/main/src/core/element.ts#L209)

#### Inherited from

[`IoVector`](IoVector.md).[`disabled`](IoVector.md#disabled)

***

### hidden

> **hidden**: `boolean`

Defined in: [src/core/element.ts:206](https://github.com/io-gui/io/blob/main/src/core/element.ts#L206)

#### Inherited from

[`IoVector`](IoVector.md).[`hidden`](IoVector.md#hidden)

***

### id

> **id**: `string`

Defined in: [src/core/element.ts:203](https://github.com/io-gui/io/blob/main/src/core/element.ts#L203)

#### Inherited from

[`IoVector`](IoVector.md).[`id`](IoVector.md#id)

***

### keys

> **keys**: `string`[]

Defined in: [src/elements/vectors/io-vector.ts:61](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L61)

#### Inherited from

[`IoVector`](IoVector.md).[`keys`](IoVector.md#keys)

***

### label

> **label**: `string`

Defined in: [src/core/element.ts:194](https://github.com/io-gui/io/blob/main/src/core/element.ts#L194)

#### Inherited from

[`IoVector`](IoVector.md).[`label`](IoVector.md#label)

***

### ladder

> **ladder**: `boolean`

Defined in: [src/elements/vectors/io-vector.ts:58](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L58)

#### Inherited from

[`IoVector`](IoVector.md).[`ladder`](IoVector.md#ladder)

***

### linkable

> **linkable**: `boolean`

Defined in: [src/elements/vectors/io-vector.ts:52](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L52)

#### Inherited from

[`IoVector`](IoVector.md).[`linkable`](IoVector.md#linkable)

***

### linked

> **linked**: `boolean`

Defined in: [src/elements/vectors/io-vector.ts:55](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L55)

#### Inherited from

[`IoVector`](IoVector.md).[`linked`](IoVector.md#linked)

***

### max

> **max**: `number`

Defined in: [src/elements/vectors/io-vector.ts:49](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L49)

#### Inherited from

[`IoVector`](IoVector.md).[`max`](IoVector.md#max)

***

### min

> **min**: `number`

Defined in: [src/elements/vectors/io-vector.ts:46](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L46)

#### Inherited from

[`IoVector`](IoVector.md).[`min`](IoVector.md#min)

***

### name

> **name**: `string`

Defined in: [src/core/element.ts:197](https://github.com/io-gui/io/blob/main/src/core/element.ts#L197)

#### Inherited from

[`IoVector`](IoVector.md).[`name`](IoVector.md#name)

***

### role

> **role**: `string`

Defined in: [src/core/element.ts:191](https://github.com/io-gui/io/blob/main/src/core/element.ts#L191)

#### Inherited from

[`IoVector`](IoVector.md).[`role`](IoVector.md#role)

***

### step

> **step**: `number`

Defined in: [src/elements/vectors/io-vector.ts:43](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L43)

#### Inherited from

[`IoVector`](IoVector.md).[`step`](IoVector.md#step)

***

### tabindex

> **tabindex**: `string`

Defined in: [src/core/element.ts:182](https://github.com/io-gui/io/blob/main/src/core/element.ts#L182)

#### Inherited from

[`IoVector`](IoVector.md).[`tabindex`](IoVector.md#tabindex)

***

### title

> **title**: `string`

Defined in: [src/core/element.ts:200](https://github.com/io-gui/io/blob/main/src/core/element.ts#L200)

#### Inherited from

[`IoVector`](IoVector.md).[`title`](IoVector.md#title)

***

### value

> **value**: `number`[]

Defined in: [src/elements/vectors/io-matrix.ts:39](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L39)

#### Overrides

[`IoVector`](IoVector.md).[`value`](IoVector.md#value)

## Accessors

### textNode

#### Get Signature

> **get** **textNode**(): `any`

Defined in: [src/core/element.ts:393](https://github.com/io-gui/io/blob/main/src/core/element.ts#L393)

##### Returns

`any`

#### Set Signature

> **set** **textNode**(`value`): `void`

Defined in: [src/core/element.ts:397](https://github.com/io-gui/io/blob/main/src/core/element.ts#L397)

##### Parameters

###### value

`any`

##### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`textNode`](IoVector.md#textnode)

***

### Properties

#### Get Signature

> **get** `static` **Properties**(): [`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

Defined in: [src/core/node.ts:33](https://github.com/io-gui/io/blob/main/src/core/node.ts#L33)

##### Returns

[`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

#### Inherited from

[`IoVector`](IoVector.md).[`Properties`](IoVector.md#properties)

***

### Style

#### Get Signature

> **get** `static` **Style**(): `string`

Defined in: [src/elements/vectors/io-matrix.ts:15](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L15)

##### Returns

`string`

#### Overrides

[`IoVector`](IoVector.md).[`Style`](IoVector.md#style)

## Methods

### \_flattenTextNode()

> **\_flattenTextNode**(`element`): `void`

Defined in: [src/core/element.ts:376](https://github.com/io-gui/io/blob/main/src/core/element.ts#L376)

Helper function to flatten textContent into a single TextNode.
Update textContent via TextNode is better for layout performance.

#### Parameters

##### element

Element to flatten.

`HTMLElement` | [`IoElement`](IoElement.md)

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`_flattenTextNode`](IoVector.md#_flattentextnode)

***

### \_onNumberPointerDown()

> **\_onNumberPointerDown**(`event`): `void`

Defined in: [src/elements/vectors/io-vector.ts:65](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L65)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`_onNumberPointerDown`](IoVector.md#_onnumberpointerdown)

***

### \_onNumberValueInput()

> **\_onNumberValueInput**(`event`): `void`

Defined in: [src/elements/vectors/io-matrix.ts:44](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L44)

#### Parameters

##### event

`CustomEvent`

#### Returns

`void`

#### Overrides

[`IoVector`](IoVector.md).[`_onNumberValueInput`](IoVector.md#_onnumbervalueinput)

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

[`IoVector`](IoVector.md).[`addEventListener`](IoVector.md#addeventlistener)

***

### applyProperties()

> **applyProperties**(`props`): `void`

Defined in: [src/core/element.ts:401](https://github.com/io-gui/io/blob/main/src/core/element.ts#L401)

Sets multiple properties in batch.
[property]-changed` events will be broadcast in the end.

#### Parameters

##### props

`any`

Map of property names and values.

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`applyProperties`](IoVector.md#applyproperties)

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

[`IoVector`](IoVector.md).[`bind`](IoVector.md#bind)

***

### changed()

> **changed**(): `void`

Defined in: [src/elements/vectors/io-vector.ts:99](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L99)

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`changed`](IoVector.md#changed)

***

### connectedCallback()

> **connectedCallback**(): `void`

Defined in: [src/core/element.ts:214](https://github.com/io-gui/io/blob/main/src/core/element.ts#L214)

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`connectedCallback`](IoVector.md#connectedcallback)

***

### disabledChanged()

> **disabledChanged**(): `void`

Defined in: [src/core/element.ts:430](https://github.com/io-gui/io/blob/main/src/core/element.ts#L430)

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`disabledChanged`](IoVector.md#disabledchanged)

***

### disconnectedCallback()

> **disconnectedCallback**(): `void`

Defined in: [src/core/element.ts:222](https://github.com/io-gui/io/blob/main/src/core/element.ts#L222)

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`disconnectedCallback`](IoVector.md#disconnectedcallback)

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

[`IoVector`](IoVector.md).[`dispatchEvent`](IoVector.md#dispatchevent)

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

[`IoVector`](IoVector.md).[`dispatchMutationEvent`](IoVector.md#dispatchmutationevent)

***

### dispatchQueue()

> **dispatchQueue**(): `void`

Defined in: [src/core/node.ts:249](https://github.com/io-gui/io/blob/main/src/core/node.ts#L249)

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`dispatchQueue`](IoVector.md#dispatchqueue)

***

### dispatchQueueSync()

> **dispatchQueueSync**(): `void`

Defined in: [src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`dispatchQueueSync`](IoVector.md#dispatchqueuesync)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/core/node.ts:381](https://github.com/io-gui/io/blob/main/src/core/node.ts#L381)

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`dispose`](IoVector.md#dispose)

***

### getSlotted()

> **getSlotted**(): `null` \| `any`[]

Defined in: [src/elements/vectors/io-vector.ts:119](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L119)

#### Returns

`null` \| `any`[]

#### Inherited from

[`IoVector`](IoVector.md).[`getSlotted`](IoVector.md#getslotted)

***

### init()

> **init**(): `void`

Defined in: [src/core/node.ts:236](https://github.com/io-gui/io/blob/main/src/core/node.ts#L236)

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`init`](IoVector.md#init)

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

[`IoVector`](IoVector.md).[`inputValue`](IoVector.md#inputvalue)

***

### labelChanged()

> **labelChanged**(): `void`

Defined in: [src/core/element.ts:423](https://github.com/io-gui/io/blob/main/src/core/element.ts#L423)

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`labelChanged`](IoVector.md#labelchanged)

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

[`IoVector`](IoVector.md).[`objectMutated`](IoVector.md#objectmutated)

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

[`IoVector`](IoVector.md).[`onObjectMutated`](IoVector.md#onobjectmutated)

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

[`IoVector`](IoVector.md).[`queue`](IoVector.md#queue)

***

### Register()

> **Register**(`ioNodeConstructor`): `void`

Defined in: [src/core/element.ts:305](https://github.com/io-gui/io/blob/main/src/core/element.ts#L305)

#### Parameters

##### ioNodeConstructor

*typeof* [`IoNode`](IoNode.md)

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`Register`](IoVector.md#register)

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

[`IoVector`](IoVector.md).[`removeEventListener`](IoVector.md#removeeventlistener)

***

### setAttribute()

> **setAttribute**(`attr`, `value`): `void`

Defined in: [src/core/element.ts:414](https://github.com/io-gui/io/blob/main/src/core/element.ts#L414)

Alias for HTMLElement setAttribute where falsey values remove the attribute.

#### Parameters

##### attr

`string`

Attribute name.

##### value

Attribute value.

`string` | `number` | `boolean`

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`setAttribute`](IoVector.md#setattribute)

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

[`IoVector`](IoVector.md).[`setProperties`](IoVector.md#setproperties)

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

[`IoVector`](IoVector.md).[`setProperty`](IoVector.md#setproperty)

***

### template()

> **template**(`vDOM`, `host`?, `cache`?): `void`

Defined in: [src/core/element.ts:234](https://github.com/io-gui/io/blob/main/src/core/element.ts#L234)

Renders DOM from virtual DOM arrays.

#### Parameters

##### vDOM

`any`[]

Array of vDOM children.

##### host?

`HTMLElement`

Optional template target.

##### cache?

`boolean`

Optional don't reuse existing elements and skip dispose

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`template`](IoVector.md#template)

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

[`IoVector`](IoVector.md).[`throttle`](IoVector.md#throttle)

***

### traverse()

> **traverse**(`vChildren`, `host`?, `cache`?): `void`

Defined in: [src/core/element.ts:247](https://github.com/io-gui/io/blob/main/src/core/element.ts#L247)

Recurively traverses vDOM.
TODO: test element.traverse() function!

#### Parameters

##### vChildren

`any`[]

Array of vDOM children converted by `buildTree()` for easier parsing.

##### host?

`HTMLElement`

Optional template target.

##### cache?

`boolean`

Optional don't reuse existing elements and skip dispose

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`traverse`](IoVector.md#traverse)

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

[`IoVector`](IoVector.md).[`unbind`](IoVector.md#unbind)

***

### valueChanged()

> **valueChanged**(): `void`

Defined in: [src/elements/vectors/io-matrix.ts:54](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L54)

#### Returns

`void`

#### Overrides

[`IoVector`](IoVector.md).[`valueChanged`](IoVector.md#valuechanged)
