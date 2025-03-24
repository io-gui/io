[**io-gui**](../README.md)

***

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

Defined in: [src/core/element.ts:213](https://github.com/io-gui/io/blob/main/src/core/element.ts#L213)

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

Defined in: [src/core/node.ts:45](https://github.com/io-gui/io/blob/main/src/core/node.ts#L45)

#### Inherited from

[`IoVector`](IoVector.md).[`_bindings`](IoVector.md#_bindings)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

Defined in: [src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

#### Inherited from

[`IoVector`](IoVector.md).[`_changeQueue`](IoVector.md#_changequeue)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

Defined in: [src/core/node.ts:47](https://github.com/io-gui/io/blob/main/src/core/node.ts#L47)

#### Inherited from

[`IoVector`](IoVector.md).[`_eventDispatcher`](IoVector.md#_eventdispatcher)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

Defined in: [src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

#### Inherited from

[`IoVector`](IoVector.md).[`_properties`](IoVector.md#_properties)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

Defined in: [src/core/node.ts:43](https://github.com/io-gui/io/blob/main/src/core/node.ts#L43)

#### Inherited from

[`IoVector`](IoVector.md).[`_protochain`](IoVector.md#_protochain)

***

### $

> **$**: `Record`\<`string`, `any`\>

Defined in: [src/core/element.ts:181](https://github.com/io-gui/io/blob/main/src/core/element.ts#L181)

#### Inherited from

[`IoVector`](IoVector.md).[`$`](IoVector.md#$)

***

### class

> **class**: `string`

Defined in: [src/core/element.ts:190](https://github.com/io-gui/io/blob/main/src/core/element.ts#L190)

#### Inherited from

[`IoVector`](IoVector.md).[`class`](IoVector.md#class)

***

### columns

> **columns**: `number`

Defined in: [src/elements/vectors/io-matrix.ts:42](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L42)

***

### contenteditable

> **contenteditable**: `boolean`

Defined in: [src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

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

Defined in: [src/core/element.ts:211](https://github.com/io-gui/io/blob/main/src/core/element.ts#L211)

#### Inherited from

[`IoVector`](IoVector.md).[`disabled`](IoVector.md#disabled)

***

### hidden

> **hidden**: `boolean`

Defined in: [src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

#### Inherited from

[`IoVector`](IoVector.md).[`hidden`](IoVector.md#hidden)

***

### id

> **id**: `string`

Defined in: [src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

#### Inherited from

[`IoVector`](IoVector.md).[`id`](IoVector.md#id)

***

### keys

> **keys**: `string`[]

Defined in: [src/elements/vectors/io-vector.ts:62](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L62)

#### Inherited from

[`IoVector`](IoVector.md).[`keys`](IoVector.md#keys)

***

### label

> **label**: `string`

Defined in: [src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

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

Defined in: [src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

#### Inherited from

[`IoVector`](IoVector.md).[`name`](IoVector.md#name)

***

### role

> **role**: `string`

Defined in: [src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

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

Defined in: [src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

#### Inherited from

[`IoVector`](IoVector.md).[`tabindex`](IoVector.md#tabindex)

***

### title

> **title**: `string`

Defined in: [src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

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

Defined in: [src/core/element.ts:414](https://github.com/io-gui/io/blob/main/src/core/element.ts#L414)

##### Returns

`any`

#### Set Signature

> **set** **textNode**(`value`): `void`

Defined in: [src/core/element.ts:418](https://github.com/io-gui/io/blob/main/src/core/element.ts#L418)

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

Defined in: [src/core/node.ts:35](https://github.com/io-gui/io/blob/main/src/core/node.ts#L35)

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

Defined in: [src/core/element.ts:397](https://github.com/io-gui/io/blob/main/src/core/element.ts#L397)

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

Defined in: [src/elements/vectors/io-vector.ts:66](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L66)

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

[`IoVector`](IoVector.md).[`addEventListener`](IoVector.md#addeventlistener)

***

### applyProperties()

> **applyProperties**(`props`): `void`

Defined in: [src/core/element.ts:422](https://github.com/io-gui/io/blob/main/src/core/element.ts#L422)

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

[`IoVector`](IoVector.md).[`bind`](IoVector.md#bind)

***

### changed()

> **changed**(): `void`

Defined in: [src/elements/vectors/io-vector.ts:98](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L98)

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`changed`](IoVector.md#changed)

***

### connectedCallback()

> **connectedCallback**(): `void`

Defined in: [src/core/element.ts:229](https://github.com/io-gui/io/blob/main/src/core/element.ts#L229)

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`connectedCallback`](IoVector.md#connectedcallback)

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

[`IoVector`](IoVector.md).[`debounce`](IoVector.md#debounce)

***

### disabledChanged()

> **disabledChanged**(): `void`

Defined in: [src/core/element.ts:451](https://github.com/io-gui/io/blob/main/src/core/element.ts#L451)

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`disabledChanged`](IoVector.md#disabledchanged)

***

### disconnectedCallback()

> **disconnectedCallback**(): `void`

Defined in: [src/core/element.ts:237](https://github.com/io-gui/io/blob/main/src/core/element.ts#L237)

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`disconnectedCallback`](IoVector.md#disconnectedcallback)

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

[`IoVector`](IoVector.md).[`dispatchEvent`](IoVector.md#dispatchevent)

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

[`IoVector`](IoVector.md).[`dispatchQueue`](IoVector.md#dispatchqueue)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/core/node.ts:369](https://github.com/io-gui/io/blob/main/src/core/node.ts#L369)

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`dispose`](IoVector.md#dispose)

***

### getSlotted()

> **getSlotted**(): `null` \| `any`[]

Defined in: [src/elements/vectors/io-vector.ts:118](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L118)

#### Returns

`null` \| `any`[]

#### Inherited from

[`IoVector`](IoVector.md).[`getSlotted`](IoVector.md#getslotted)

***

### init()

> **init**(): `void`

Defined in: [src/core/node.ts:241](https://github.com/io-gui/io/blob/main/src/core/node.ts#L241)

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`init`](IoVector.md#init)

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

[`IoVector`](IoVector.md).[`inputValue`](IoVector.md#inputvalue)

***

### labelChanged()

> **labelChanged**(): `void`

Defined in: [src/core/element.ts:444](https://github.com/io-gui/io/blob/main/src/core/element.ts#L444)

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`labelChanged`](IoVector.md#labelchanged)

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

[`IoVector`](IoVector.md).[`onPropertyMutated`](IoVector.md#onpropertymutated)

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

[`IoVector`](IoVector.md).[`queue`](IoVector.md#queue)

***

### Register()

> **Register**(`ioNodeConstructor`): `void`

Defined in: [src/core/element.ts:326](https://github.com/io-gui/io/blob/main/src/core/element.ts#L326)

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

[`IoVector`](IoVector.md).[`removeEventListener`](IoVector.md#removeeventlistener)

***

### setAttribute()

> **setAttribute**(`attr`, `value`): `void`

Defined in: [src/core/element.ts:435](https://github.com/io-gui/io/blob/main/src/core/element.ts#L435)

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

[`IoVector`](IoVector.md).[`setProperties`](IoVector.md#setproperties)

***

### setProperty()

> **setProperty**(`name`, `value`, `debounce`): `void`

Defined in: [src/core/element.ts:243](https://github.com/io-gui/io/blob/main/src/core/element.ts#L243)

Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.

#### Parameters

##### name

`string`

Property name to set value of.

##### value

`any`

Peroperty value.

##### debounce

`boolean` = `false`

flag to skip event dispatch.

#### Returns

`void`

#### Inherited from

[`IoVector`](IoVector.md).[`setProperty`](IoVector.md#setproperty)

***

### template()

> **template**(`vDOM`, `host`?, `cache`?): `void`

Defined in: [src/core/element.ts:255](https://github.com/io-gui/io/blob/main/src/core/element.ts#L255)

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

[`IoVector`](IoVector.md).[`throttle`](IoVector.md#throttle)

***

### traverse()

> **traverse**(`vChildren`, `host`?, `cache`?): `void`

Defined in: [src/core/element.ts:268](https://github.com/io-gui/io/blob/main/src/core/element.ts#L268)

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

[`IoVector`](IoVector.md).[`unbind`](IoVector.md#unbind)

***

### valueChanged()

> **valueChanged**(): `void`

Defined in: [src/elements/vectors/io-matrix.ts:54](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L54)

#### Returns

`void`

#### Overrides

[`IoVector`](IoVector.md).[`valueChanged`](IoVector.md#valuechanged)
