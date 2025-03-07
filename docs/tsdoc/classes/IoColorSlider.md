[**io-gui**](../README.md)

***

# Class: IoColorSlider

Defined in: [src/elements/color/io-color-sliders.ts:19](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L19)

A generic color slider element.
It is a wrapper for channel-specific sliders which are added as a child of this element depending on the `channel` property.
For example, setting `channel: 'h'` will instantiate a slider for "hue" color channel and hook up necessary conversions, bindings and event callbacks.

<io-element-demo element="io-color-slider-hs"
width="64px" height="64px"
properties='{"value": [1, 0.5, 0, 1], "horizontal": true}'
config='{"value": ["io-properties"]}
'></io-element-demo>

## Extends

- [`IoColorBase`](IoColorBase.md)

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### new IoColorSlider()

> **new IoColorSlider**(...`args`): [`IoColorSlider`](IoColorSlider.md)

Defined in: [src/core/node.ts:52](https://github.com/io-gui/io/blob/main/src/core/node.ts#L52)

Creates a class instance and initializes the internals.

#### Parameters

##### args

...`any`[]

#### Returns

[`IoColorSlider`](IoColorSlider.md)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`constructor`](IoColorBase.md#constructors)

## Properties

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

Defined in: [src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`_bindings`](IoColorBase.md#_bindings)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

Defined in: [src/core/node.ts:45](https://github.com/io-gui/io/blob/main/src/core/node.ts#L45)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`_changeQueue`](IoColorBase.md#_changequeue)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

Defined in: [src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`_eventDispatcher`](IoColorBase.md#_eventdispatcher)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

Defined in: [src/core/node.ts:43](https://github.com/io-gui/io/blob/main/src/core/node.ts#L43)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`_properties`](IoColorBase.md#_properties)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

Defined in: [src/core/node.ts:42](https://github.com/io-gui/io/blob/main/src/core/node.ts#L42)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`_protochain`](IoColorBase.md#_protochain)

***

### $

> **$**: `Record`\<`string`, `any`\>

Defined in: [src/core/element.ts:179](https://github.com/io-gui/io/blob/main/src/core/element.ts#L179)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`$`](IoColorBase.md#$)

***

### channel

> **channel**: `string`

Defined in: [src/elements/color/io-color-sliders.ts:35](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L35)

***

### class

> **class**: `string`

Defined in: [src/core/element.ts:188](https://github.com/io-gui/io/blob/main/src/core/element.ts#L188)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`class`](IoColorBase.md#class)

***

### cmyk

> **cmyk**: \[`number`, `number`, `number`, `number`\]

Defined in: [src/elements/color/io-color-base.ts:20](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L20)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`cmyk`](IoColorBase.md#cmyk)

***

### color

> **color**: \[`number`, `number`, `number`, `number`\]

Defined in: [src/elements/color/io-color-sliders.ts:29](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L29)

***

### contenteditable

> **contenteditable**: `boolean`

Defined in: [src/core/element.ts:185](https://github.com/io-gui/io/blob/main/src/core/element.ts#L185)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`contenteditable`](IoColorBase.md#contenteditable)

***

### disabled

> **disabled**: `boolean`

Defined in: [src/core/element.ts:209](https://github.com/io-gui/io/blob/main/src/core/element.ts#L209)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`disabled`](IoColorBase.md#disabled)

***

### hidden

> **hidden**: `boolean`

Defined in: [src/core/element.ts:206](https://github.com/io-gui/io/blob/main/src/core/element.ts#L206)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`hidden`](IoColorBase.md#hidden)

***

### hsl

> **hsl**: \[`number`, `number`, `number`\]

Defined in: [src/elements/color/io-color-base.ts:17](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L17)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`hsl`](IoColorBase.md#hsl)

***

### hsv

> **hsv**: \[`number`, `number`, `number`\]

Defined in: [src/elements/color/io-color-base.ts:14](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L14)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`hsv`](IoColorBase.md#hsv)

***

### id

> **id**: `string`

Defined in: [src/core/element.ts:203](https://github.com/io-gui/io/blob/main/src/core/element.ts#L203)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`id`](IoColorBase.md#id)

***

### label

> **label**: `string`

Defined in: [src/core/element.ts:194](https://github.com/io-gui/io/blob/main/src/core/element.ts#L194)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`label`](IoColorBase.md#label)

***

### name

> **name**: `string`

Defined in: [src/core/element.ts:197](https://github.com/io-gui/io/blob/main/src/core/element.ts#L197)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`name`](IoColorBase.md#name)

***

### rgba

> **rgba**: \[`number`, `number`, `number`, `number`\]

Defined in: [src/elements/color/io-color-base.ts:11](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L11)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`rgba`](IoColorBase.md#rgba)

***

### role

> **role**: `string`

Defined in: [src/core/element.ts:191](https://github.com/io-gui/io/blob/main/src/core/element.ts#L191)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`role`](IoColorBase.md#role)

***

### step

> **step**: `number`

Defined in: [src/elements/color/io-color-sliders.ts:32](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L32)

***

### tabindex

> **tabindex**: `string`

Defined in: [src/core/element.ts:182](https://github.com/io-gui/io/blob/main/src/core/element.ts#L182)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`tabindex`](IoColorBase.md#tabindex)

***

### title

> **title**: `string`

Defined in: [src/core/element.ts:200](https://github.com/io-gui/io/blob/main/src/core/element.ts#L200)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`title`](IoColorBase.md#title)

***

### value

> **value**: `object`

Defined in: [src/elements/color/io-color-base.ts:8](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L8)

#### a?

> `optional` **a**: `number`

#### b

> **b**: `number`

#### g

> **g**: `number`

#### r

> **r**: `number`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`value`](IoColorBase.md#value)

***

### vertical

> **vertical**: `boolean`

Defined in: [src/elements/color/io-color-sliders.ts:38](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L38)

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

[`IoColorBase`](IoColorBase.md).[`textNode`](IoColorBase.md#textnode)

***

### Properties

#### Get Signature

> **get** `static` **Properties**(): [`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

Defined in: [src/core/node.ts:33](https://github.com/io-gui/io/blob/main/src/core/node.ts#L33)

##### Returns

[`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`Properties`](IoColorBase.md#properties)

***

### Style

#### Get Signature

> **get** `static` **Style**(): `string`

Defined in: [src/elements/color/io-color-sliders.ts:20](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L20)

##### Returns

`string`

#### Overrides

[`IoColorBase`](IoColorBase.md).[`Style`](IoColorBase.md#style)

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

[`IoColorBase`](IoColorBase.md).[`_flattenTextNode`](IoColorBase.md#_flattentextnode)

***

### \_onValueInput()

> **\_onValueInput**(`event`): `void`

Defined in: [src/elements/color/io-color-sliders.ts:40](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L40)

#### Parameters

##### event

`CustomEvent`

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

[`IoColorBase`](IoColorBase.md).[`addEventListener`](IoColorBase.md#addeventlistener)

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

[`IoColorBase`](IoColorBase.md).[`applyProperties`](IoColorBase.md#applyproperties)

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

[`IoColorBase`](IoColorBase.md).[`bind`](IoColorBase.md#bind)

***

### changed()

> **changed**(): `void`

Defined in: [src/elements/color/io-color-sliders.ts:118](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L118)

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

[`IoColorBase`](IoColorBase.md).[`changed`](IoColorBase.md#changed)

***

### connectedCallback()

> **connectedCallback**(): `void`

Defined in: [src/core/element.ts:214](https://github.com/io-gui/io/blob/main/src/core/element.ts#L214)

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`connectedCallback`](IoColorBase.md#connectedcallback)

***

### disabledChanged()

> **disabledChanged**(): `void`

Defined in: [src/core/element.ts:430](https://github.com/io-gui/io/blob/main/src/core/element.ts#L430)

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`disabledChanged`](IoColorBase.md#disabledchanged)

***

### disconnectedCallback()

> **disconnectedCallback**(): `void`

Defined in: [src/core/element.ts:222](https://github.com/io-gui/io/blob/main/src/core/element.ts#L222)

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`disconnectedCallback`](IoColorBase.md#disconnectedcallback)

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

[`IoColorBase`](IoColorBase.md).[`dispatchEvent`](IoColorBase.md#dispatchevent)

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

[`IoColorBase`](IoColorBase.md).[`dispatchMutationEvent`](IoColorBase.md#dispatchmutationevent)

***

### dispatchQueue()

> **dispatchQueue**(): `void`

Defined in: [src/core/node.ts:249](https://github.com/io-gui/io/blob/main/src/core/node.ts#L249)

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`dispatchQueue`](IoColorBase.md#dispatchqueue)

***

### dispatchQueueSync()

> **dispatchQueueSync**(): `void`

Defined in: [src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`dispatchQueueSync`](IoColorBase.md#dispatchqueuesync)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/core/node.ts:381](https://github.com/io-gui/io/blob/main/src/core/node.ts#L381)

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`dispose`](IoColorBase.md#dispose)

***

### init()

> **init**(): `void`

Defined in: [src/elements/color/io-color-base.ts:22](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L22)

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`init`](IoColorBase.md#init)

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

[`IoColorBase`](IoColorBase.md).[`inputValue`](IoColorBase.md#inputvalue)

***

### labelChanged()

> **labelChanged**(): `void`

Defined in: [src/core/element.ts:423](https://github.com/io-gui/io/blob/main/src/core/element.ts#L423)

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`labelChanged`](IoColorBase.md#labelchanged)

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

[`IoColorBase`](IoColorBase.md).[`objectMutated`](IoColorBase.md#objectmutated)

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

[`IoColorBase`](IoColorBase.md).[`onObjectMutated`](IoColorBase.md#onobjectmutated)

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

[`IoColorBase`](IoColorBase.md).[`queue`](IoColorBase.md#queue)

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

[`IoColorBase`](IoColorBase.md).[`Register`](IoColorBase.md#register)

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

[`IoColorBase`](IoColorBase.md).[`removeEventListener`](IoColorBase.md#removeeventlistener)

***

### rgbFromCmyk()

> **rgbFromCmyk**(): `void`

Defined in: [src/elements/color/io-color-base.ts:50](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L50)

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`rgbFromCmyk`](IoColorBase.md#rgbfromcmyk)

***

### rgbFromHsl()

> **rgbFromHsl**(): `void`

Defined in: [src/elements/color/io-color-base.ts:40](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L40)

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`rgbFromHsl`](IoColorBase.md#rgbfromhsl)

***

### rgbFromHsv()

> **rgbFromHsv**(): `void`

Defined in: [src/elements/color/io-color-base.ts:30](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L30)

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`rgbFromHsv`](IoColorBase.md#rgbfromhsv)

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

[`IoColorBase`](IoColorBase.md).[`setAttribute`](IoColorBase.md#setattribute)

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

[`IoColorBase`](IoColorBase.md).[`setProperties`](IoColorBase.md#setproperties)

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

[`IoColorBase`](IoColorBase.md).[`setProperty`](IoColorBase.md#setproperty)

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

[`IoColorBase`](IoColorBase.md).[`template`](IoColorBase.md#template)

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

[`IoColorBase`](IoColorBase.md).[`throttle`](IoColorBase.md#throttle)

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

[`IoColorBase`](IoColorBase.md).[`traverse`](IoColorBase.md#traverse)

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

[`IoColorBase`](IoColorBase.md).[`unbind`](IoColorBase.md#unbind)

***

### valueChanged()

> **valueChanged**(): `void`

Defined in: [src/elements/color/io-color-base.ts:67](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L67)

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`valueChanged`](IoColorBase.md#valuechanged)

***

### valueFromRgb()

> **valueFromRgb**(): `void`

Defined in: [src/elements/color/io-color-base.ts:61](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L61)

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`valueFromRgb`](IoColorBase.md#valuefromrgb)

***

### valueMutated()

> **valueMutated**(): `void`

Defined in: [src/elements/color/io-color-base.ts:26](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L26)

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`valueMutated`](IoColorBase.md#valuemutated)
