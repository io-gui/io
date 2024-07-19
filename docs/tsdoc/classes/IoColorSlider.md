[**io-gui**](../README.md) • **Docs**

***

[io-gui](../README.md) / IoColorSlider

# Class: IoColorSlider

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

## Constructors

### new IoColorSlider()

> **new IoColorSlider**(...`args`): [`IoColorSlider`](IoColorSlider.md)

Creates a class instance and initializes the internals.

#### Parameters

• ...**args**: `any`[]

#### Returns

[`IoColorSlider`](IoColorSlider.md)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`constructor`](IoColorBase.md#constructors)

#### Defined in

[src/core/node.ts:63](https://github.com/io-gui/io/blob/main/src/core/node.ts#L63)

## Properties

### $

> **$**: `Record`\<`string`, `any`\>

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`$`](IoColorBase.md#$)

#### Defined in

[src/core/element.ts:178](https://github.com/io-gui/io/blob/main/src/core/element.ts#L178)

***

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`_bindings`](IoColorBase.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`_changeQueue`](IoColorBase.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`_eventDispatcher`](IoColorBase.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`_properties`](IoColorBase.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`_protochain`](IoColorBase.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

***

### channel

> **channel**: `string`

#### Defined in

[src/elements/color/io-color-sliders.ts:32](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L32)

***

### class

> **class**: `string`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`class`](IoColorBase.md#class)

#### Defined in

[src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

***

### cmyk

> **cmyk**: [`number`, `number`, `number`, `number`]

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`cmyk`](IoColorBase.md#cmyk)

#### Defined in

[src/elements/color/io-color-base.ts:20](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L20)

***

### color

> **color**: [`number`, `number`, `number`, `number`]

#### Defined in

[src/elements/color/io-color-sliders.ts:29](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L29)

***

### contenteditable

> **contenteditable**: `boolean`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`contenteditable`](IoColorBase.md#contenteditable)

#### Defined in

[src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

***

### disabled

> **disabled**: `boolean`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`disabled`](IoColorBase.md#disabled)

#### Defined in

[src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

***

### hidden

> **hidden**: `boolean`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`hidden`](IoColorBase.md#hidden)

#### Defined in

[src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

***

### hsl

> **hsl**: [`number`, `number`, `number`]

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`hsl`](IoColorBase.md#hsl)

#### Defined in

[src/elements/color/io-color-base.ts:17](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L17)

***

### hsv

> **hsv**: [`number`, `number`, `number`]

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`hsv`](IoColorBase.md#hsv)

#### Defined in

[src/elements/color/io-color-base.ts:14](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L14)

***

### id

> **id**: `string`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`id`](IoColorBase.md#id)

#### Defined in

[src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

***

### label

> **label**: `string`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`label`](IoColorBase.md#label)

#### Defined in

[src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

***

### name

> **name**: `string`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`name`](IoColorBase.md#name)

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

***

### rgba

> **rgba**: [`number`, `number`, `number`, `number`]

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`rgba`](IoColorBase.md#rgba)

#### Defined in

[src/elements/color/io-color-base.ts:11](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L11)

***

### role

> **role**: `string`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`role`](IoColorBase.md#role)

#### Defined in

[src/core/element.ts:190](https://github.com/io-gui/io/blob/main/src/core/element.ts#L190)

***

### tabindex

> **tabindex**: `string`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`tabindex`](IoColorBase.md#tabindex)

#### Defined in

[src/core/element.ts:181](https://github.com/io-gui/io/blob/main/src/core/element.ts#L181)

***

### title

> **title**: `string`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`title`](IoColorBase.md#title)

#### Defined in

[src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

***

### value

> **value**: `object`

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

#### Defined in

[src/elements/color/io-color-base.ts:8](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L8)

***

### vertical

> **vertical**: `boolean`

#### Defined in

[src/elements/color/io-color-sliders.ts:35](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L35)

## Accessors

### textNode

> `get` **textNode**(): `any`

> `set` **textNode**(`value`): `void`

#### Parameters

• **value**: `any`

#### Returns

`any`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`textNode`](IoColorBase.md#textnode)

#### Defined in

[src/core/element.ts:392](https://github.com/io-gui/io/blob/main/src/core/element.ts#L392)

***

### Properties

> `get` `static` **Properties**(): [`PropertyDeclarations`](../type-aliases/PropertyDeclarations.md)

#### Returns

[`PropertyDeclarations`](../type-aliases/PropertyDeclarations.md)

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`Properties`](IoColorBase.md#properties)

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

***

### Style

> `get` `static` **Style**(): `string`

#### Returns

`string`

#### Overrides

[`IoColorBase`](IoColorBase.md).[`Style`](IoColorBase.md#style)

#### Defined in

[src/elements/color/io-color-sliders.ts:20](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L20)

## Methods

### Register()

> **Register**(`ioNodeConstructor`): `void`

#### Parameters

• **ioNodeConstructor**: *typeof* [`IoNode`](IoNode.md)

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`Register`](IoColorBase.md#register)

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

[`IoColorBase`](IoColorBase.md).[`_flattenTextNode`](IoColorBase.md#_flattentextnode)

#### Defined in

[src/core/element.ts:375](https://github.com/io-gui/io/blob/main/src/core/element.ts#L375)

***

### \_onValueInput()

> **\_onValueInput**(`event`): `void`

#### Parameters

• **event**: `CustomEvent`\<`any`\>

#### Returns

`void`

#### Defined in

[src/elements/color/io-color-sliders.ts:37](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L37)

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

[`IoColorBase`](IoColorBase.md).[`addEventListener`](IoColorBase.md#addeventlistener)

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

[`IoColorBase`](IoColorBase.md).[`applyProperties`](IoColorBase.md#applyproperties)

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

[`IoColorBase`](IoColorBase.md).[`bind`](IoColorBase.md#bind)

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

[`IoColorBase`](IoColorBase.md).[`changed`](IoColorBase.md#changed)

#### Defined in

[src/elements/color/io-color-sliders.ts:115](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L115)

***

### connectedCallback()

> **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`connectedCallback`](IoColorBase.md#connectedcallback)

#### Defined in

[src/core/element.ts:213](https://github.com/io-gui/io/blob/main/src/core/element.ts#L213)

***

### disabledChanged()

> **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`disabledChanged`](IoColorBase.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

***

### disconnectedCallback()

> **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`disconnectedCallback`](IoColorBase.md#disconnectedcallback)

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

[`IoColorBase`](IoColorBase.md).[`dispatchEvent`](IoColorBase.md#dispatchevent)

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

[`IoColorBase`](IoColorBase.md).[`dispatchMutationEvent`](IoColorBase.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:385](https://github.com/io-gui/io/blob/main/src/core/node.ts#L385)

***

### dispatchQueue()

> **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`dispatchQueue`](IoColorBase.md#dispatchqueue)

#### Defined in

[src/core/node.ts:260](https://github.com/io-gui/io/blob/main/src/core/node.ts#L260)

***

### dispatchQueueSync()

> **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`dispatchQueueSync`](IoColorBase.md#dispatchqueuesync)

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

[`IoColorBase`](IoColorBase.md).[`dispose`](IoColorBase.md#dispose)

#### Defined in

[src/core/node.ts:392](https://github.com/io-gui/io/blob/main/src/core/node.ts#L392)

***

### init()

> **init**(): `void`

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`init`](IoColorBase.md#init)

#### Defined in

[src/elements/color/io-color-base.ts:22](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L22)

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

[`IoColorBase`](IoColorBase.md).[`inputValue`](IoColorBase.md#inputvalue)

#### Defined in

[src/core/node.ts:235](https://github.com/io-gui/io/blob/main/src/core/node.ts#L235)

***

### labelChanged()

> **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`labelChanged`](IoColorBase.md#labelchanged)

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

[`IoColorBase`](IoColorBase.md).[`objectMutated`](IoColorBase.md#objectmutated)

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

[`IoColorBase`](IoColorBase.md).[`onObjectMutated`](IoColorBase.md#onobjectmutated)

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

[`IoColorBase`](IoColorBase.md).[`queue`](IoColorBase.md#queue)

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

[`IoColorBase`](IoColorBase.md).[`removeEventListener`](IoColorBase.md#removeeventlistener)

#### Defined in

[src/core/node.ts:368](https://github.com/io-gui/io/blob/main/src/core/node.ts#L368)

***

### rgbFromCmyk()

> **rgbFromCmyk**(): `void`

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`rgbFromCmyk`](IoColorBase.md#rgbfromcmyk)

#### Defined in

[src/elements/color/io-color-base.ts:50](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L50)

***

### rgbFromHsl()

> **rgbFromHsl**(): `void`

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`rgbFromHsl`](IoColorBase.md#rgbfromhsl)

#### Defined in

[src/elements/color/io-color-base.ts:40](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L40)

***

### rgbFromHsv()

> **rgbFromHsv**(): `void`

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`rgbFromHsv`](IoColorBase.md#rgbfromhsv)

#### Defined in

[src/elements/color/io-color-base.ts:30](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L30)

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

[`IoColorBase`](IoColorBase.md).[`setAttribute`](IoColorBase.md#setattribute)

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

[`IoColorBase`](IoColorBase.md).[`setProperties`](IoColorBase.md#setproperties)

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

[`IoColorBase`](IoColorBase.md).[`setProperty`](IoColorBase.md#setproperty)

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

[`IoColorBase`](IoColorBase.md).[`template`](IoColorBase.md#template)

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

[`IoColorBase`](IoColorBase.md).[`throttle`](IoColorBase.md#throttle)

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

[`IoColorBase`](IoColorBase.md).[`traverse`](IoColorBase.md#traverse)

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

[`IoColorBase`](IoColorBase.md).[`unbind`](IoColorBase.md#unbind)

#### Defined in

[src/core/node.ts:337](https://github.com/io-gui/io/blob/main/src/core/node.ts#L337)

***

### valueChanged()

> **valueChanged**(): `void`

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`valueChanged`](IoColorBase.md#valuechanged)

#### Defined in

[src/elements/color/io-color-base.ts:67](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L67)

***

### valueFromRgb()

> **valueFromRgb**(): `void`

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`valueFromRgb`](IoColorBase.md#valuefromrgb)

#### Defined in

[src/elements/color/io-color-base.ts:61](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L61)

***

### valueMutated()

> **valueMutated**(): `void`

#### Returns

`void`

#### Inherited from

[`IoColorBase`](IoColorBase.md).[`valueMutated`](IoColorBase.md#valuemutated)

#### Defined in

[src/elements/color/io-color-base.ts:26](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L26)
