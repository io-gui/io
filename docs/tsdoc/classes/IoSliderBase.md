[**io-gui**](../README.md) • **Docs**

***

[io-gui](../README.md) / IoSliderBase

# Class: IoSliderBase

Core `IoElement` class.

## Extends

- [`IoGl`](IoGl.md)

## Extended by

- [`IoSlider2d`](IoSlider2d.md)
- [`IoSliderRange`](IoSliderRange.md)
- [`IoSlider`](IoSlider.md)

## Constructors

### new IoSliderBase()

> **new IoSliderBase**(`properties`): [`IoSliderBase`](IoSliderBase.md)

#### Parameters

• **properties**: `Record`\<`string`, `any`\> = `{}`

#### Returns

[`IoSliderBase`](IoSliderBase.md)

#### Inherited from

[`IoGl`](IoGl.md).[`constructor`](IoGl.md#constructors)

#### Defined in

[src/core/gl.ts:259](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L259)

## Properties

### $

> **$**: `Record`\<`string`, `any`\>

#### Inherited from

[`IoGl`](IoGl.md).[`$`](IoGl.md#$)

#### Defined in

[src/core/element.ts:178](https://github.com/io-gui/io/blob/main/src/core/element.ts#L178)

***

### \_active

> **\_active**: `number` = `-1`

#### Defined in

[src/elements/sliders/io-slider-base.ts:65](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L65)

***

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[`IoGl`](IoGl.md).[`_bindings`](IoGl.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[`IoGl`](IoGl.md).[`_changeQueue`](IoGl.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[`IoGl`](IoGl.md).[`_eventDispatcher`](IoGl.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[`IoGl`](IoGl.md).[`_properties`](IoGl.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[`IoGl`](IoGl.md).[`_protochain`](IoGl.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

***

### \_rect

> **\_rect**: `null` \| `DOMRect` = `null`

#### Defined in

[src/elements/sliders/io-slider-base.ts:66](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L66)

***

### \_startX

> **\_startX**: `number` = `0`

#### Defined in

[src/elements/sliders/io-slider-base.ts:63](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L63)

***

### \_startY

> **\_startY**: `number` = `0`

#### Defined in

[src/elements/sliders/io-slider-base.ts:64](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L64)

***

### class

> **class**: `string`

#### Inherited from

[`IoGl`](IoGl.md).[`class`](IoGl.md#class)

#### Defined in

[src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

***

### color

> **color**: [`number`, `number`, `number`, `number`]

#### Inherited from

[`IoGl`](IoGl.md).[`color`](IoGl.md#color)

#### Defined in

[src/core/gl.ts:69](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L69)

***

### contenteditable

> **contenteditable**: `boolean`

#### Inherited from

[`IoGl`](IoGl.md).[`contenteditable`](IoGl.md#contenteditable)

#### Defined in

[src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

***

### disabled

> **disabled**: `boolean`

#### Inherited from

[`IoGl`](IoGl.md).[`disabled`](IoGl.md#disabled)

#### Defined in

[src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

***

### exponent

> **exponent**: `number`

#### Defined in

[src/elements/sliders/io-slider-base.ts:46](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L46)

***

### hidden

> **hidden**: `boolean`

#### Inherited from

[`IoGl`](IoGl.md).[`hidden`](IoGl.md#hidden)

#### Defined in

[src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

***

### id

> **id**: `string`

#### Inherited from

[`IoGl`](IoGl.md).[`id`](IoGl.md#id)

#### Defined in

[src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

***

### label

> **label**: `string`

#### Inherited from

[`IoGl`](IoGl.md).[`label`](IoGl.md#label)

#### Defined in

[src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

***

### lazy

> **lazy**: `boolean`

#### Defined in

[src/elements/sliders/io-slider-base.ts:61](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L61)

***

### max

> **max**: `number` \| [`number`, `number`] \| `object`

#### Defined in

[src/elements/sliders/io-slider-base.ts:43](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L43)

***

### min

> **min**: `number` \| [`number`, `number`] \| `object`

#### Defined in

[src/elements/sliders/io-slider-base.ts:40](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L40)

***

### name

> **name**: `string`

#### Inherited from

[`IoGl`](IoGl.md).[`name`](IoGl.md#name)

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

***

### noscroll

> **noscroll**: `boolean`

#### Defined in

[src/elements/sliders/io-slider-base.ts:52](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L52)

***

### pxRatio

> **pxRatio**: `number`

#### Inherited from

[`IoGl`](IoGl.md).[`pxRatio`](IoGl.md#pxratio)

#### Defined in

[src/core/gl.ts:72](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L72)

***

### role

> **role**: `string`

#### Overrides

[`IoGl`](IoGl.md).[`role`](IoGl.md#role)

#### Defined in

[src/elements/sliders/io-slider-base.ts:55](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L55)

***

### size

> **size**: [`number`, `number`]

#### Inherited from

[`IoGl`](IoGl.md).[`size`](IoGl.md#size)

#### Defined in

[src/core/gl.ts:66](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L66)

***

### step

> **step**: `number` \| [`number`, `number`] \| `object`

#### Defined in

[src/elements/sliders/io-slider-base.ts:37](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L37)

***

### tabindex

> **tabindex**: `string`

#### Overrides

[`IoGl`](IoGl.md).[`tabindex`](IoGl.md#tabindex)

#### Defined in

[src/elements/sliders/io-slider-base.ts:58](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L58)

***

### theme

> **theme**: `IoTheme`

#### Inherited from

[`IoGl`](IoGl.md).[`theme`](IoGl.md#theme)

#### Defined in

[src/core/gl.ts:75](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L75)

***

### title

> **title**: `string`

#### Inherited from

[`IoGl`](IoGl.md).[`title`](IoGl.md#title)

#### Defined in

[src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

***

### value

> **value**: `number` \| [`number`, `number`] \| `object`

#### Defined in

[src/elements/sliders/io-slider-base.ts:34](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L34)

***

### vertical

> **vertical**: `boolean`

#### Defined in

[src/elements/sliders/io-slider-base.ts:49](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L49)

## Accessors

### \_max

> `get` **\_max**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Defined in

[src/elements/sliders/io-slider-base.ts:79](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L79)

***

### \_min

> `get` **\_min**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Defined in

[src/elements/sliders/io-slider-base.ts:68](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L68)

***

### \_step

> `get` **\_step**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Defined in

[src/elements/sliders/io-slider-base.ts:90](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L90)

***

### \_value

> `get` **\_value**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Defined in

[src/elements/sliders/io-slider-base.ts:101](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L101)

***

### textNode

> `get` **textNode**(): `any`

> `set` **textNode**(`value`): `void`

#### Parameters

• **value**: `any`

#### Returns

`any`

#### Inherited from

[`IoGl`](IoGl.md).[`textNode`](IoGl.md#textnode)

#### Defined in

[src/core/element.ts:392](https://github.com/io-gui/io/blob/main/src/core/element.ts#L392)

***

### Frag

> `get` `static` **Frag**(): `string`

#### Returns

`string`

#### Inherited from

[`IoGl`](IoGl.md).[`Frag`](IoGl.md#frag)

#### Defined in

[src/core/gl.ts:179](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L179)

***

### GlUtils

> `get` `static` **GlUtils**(): `string`

#### Returns

`string`

#### Inherited from

[`IoGl`](IoGl.md).[`GlUtils`](IoGl.md#glutils)

#### Defined in

[src/core/gl.ts:92](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L92)

***

### Listeners

> `get` `static` **Listeners**(): `object`

#### Returns

`object`

##### contextmenu

> **contextmenu**: `string` = `'_onContextmenu'`

##### focus

> **focus**: `string` = `'_onFocus'`

##### pointerdown

> **pointerdown**: `string` = `'_onPointerdown'`

##### touchstart

> **touchstart**: (`string` \| `object`)[]

#### Defined in

[src/elements/sliders/io-slider-base.ts:112](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L112)

***

### Properties

> `get` `static` **Properties**(): [`PropertyDeclarations`](../type-aliases/PropertyDeclarations.md)

#### Returns

[`PropertyDeclarations`](../type-aliases/PropertyDeclarations.md)

#### Inherited from

[`IoGl`](IoGl.md).[`Properties`](IoGl.md#properties)

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

***

### Style

> `get` `static` **Style**(): `string`

#### Returns

`string`

#### Overrides

[`IoGl`](IoGl.md).[`Style`](IoGl.md#style)

#### Defined in

[src/elements/sliders/io-slider-base.ts:9](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L9)

***

### Vert

> `get` `static` **Vert**(): `string`

#### Returns

`string`

#### Inherited from

[`IoGl`](IoGl.md).[`Vert`](IoGl.md#vert)

#### Defined in

[src/core/gl.ts:81](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L81)

## Methods

### Register()

> **Register**(`ioNodeConstructor`): `void`

#### Parameters

• **ioNodeConstructor**: *typeof* [`IoNode`](IoNode.md)

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`Register`](IoGl.md#register)

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

[`IoGl`](IoGl.md).[`_flattenTextNode`](IoGl.md#_flattentextnode)

#### Defined in

[src/core/element.ts:375](https://github.com/io-gui/io/blob/main/src/core/element.ts#L375)

***

### \_getPointerCoord()

> **\_getPointerCoord**(`event`): [`number`, `number`]

#### Parameters

• **event**: `PointerEvent`

#### Returns

[`number`, `number`]

#### Defined in

[src/elements/sliders/io-slider-base.ts:179](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L179)

***

### \_getValueFromCoord()

> **\_getValueFromCoord**(`coord`): [`number`, `number`]

#### Parameters

• **coord**: [`number`, `number`]

#### Returns

[`number`, `number`]

#### Defined in

[src/elements/sliders/io-slider-base.ts:187](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L187)

***

### \_inputValue()

> **\_inputValue**(`value`): `void`

#### Parameters

• **value**: [`number`, `number`]

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:203](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L203)

***

### \_onBlur()

> **\_onBlur**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:124](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L124)

***

### \_onContextmenu()

> **\_onContextmenu**(`event`): `void`

#### Parameters

• **event**: `Event`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:128](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L128)

***

### \_onFocus()

> **\_onFocus**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:120](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L120)

***

### \_onKeydown()

> **\_onKeydown**(`event`): `void`

#### Parameters

• **event**: `KeyboardEvent`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:230](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L230)

***

### \_onPointerdown()

> **\_onPointerdown**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:161](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L161)

***

### \_onPointermove()

> **\_onPointermove**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:168](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L168)

***

### \_onPointermoveThrottled()

> **\_onPointermoveThrottled**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:195](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L195)

***

### \_onPointerup()

> **\_onPointerup**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:172](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L172)

***

### \_onRender()

> **\_onRender**(): `void`

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`_onRender`](IoGl.md#_onrender)

#### Defined in

[src/core/gl.ts:344](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L344)

***

### \_onTouchend()

> **\_onTouchend**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:157](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L157)

***

### \_onTouchmove()

> **\_onTouchmove**(`event`): `void`

#### Parameters

• **event**: `TouchEvent`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:139](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L139)

***

### \_onTouchstart()

> **\_onTouchstart**(`event`): `void`

#### Parameters

• **event**: `TouchEvent`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:131](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L131)

***

### \_setDecrease()

> **\_setDecrease**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:276](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L276)

***

### \_setDown()

> **\_setDown**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:297](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L297)

***

### \_setIncrease()

> **\_setIncrease**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:269](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L269)

***

### \_setLeft()

> **\_setLeft**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:303](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L303)

***

### \_setMax()

> **\_setMax**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:287](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L287)

***

### \_setMin()

> **\_setMin**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:283](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L283)

***

### \_setRight()

> **\_setRight**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:309](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L309)

***

### \_setUp()

> **\_setUp**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:291](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L291)

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

[`IoGl`](IoGl.md).[`addEventListener`](IoGl.md#addeventlistener)

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

[`IoGl`](IoGl.md).[`applyProperties`](IoGl.md#applyproperties)

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

[`IoGl`](IoGl.md).[`bind`](IoGl.md#bind)

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

[`IoGl`](IoGl.md).[`changed`](IoGl.md#changed)

#### Defined in

[src/elements/sliders/io-slider-base.ts:318](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L318)

***

### connectedCallback()

> **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`connectedCallback`](IoGl.md#connectedcallback)

#### Defined in

[src/core/element.ts:213](https://github.com/io-gui/io/blob/main/src/core/element.ts#L213)

***

### disabledChanged()

> **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`disabledChanged`](IoGl.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

***

### disconnectedCallback()

> **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`disconnectedCallback`](IoGl.md#disconnectedcallback)

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

[`IoGl`](IoGl.md).[`dispatchEvent`](IoGl.md#dispatchevent)

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

[`IoGl`](IoGl.md).[`dispatchMutationEvent`](IoGl.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:385](https://github.com/io-gui/io/blob/main/src/core/node.ts#L385)

***

### dispatchQueue()

> **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`dispatchQueue`](IoGl.md#dispatchqueue)

#### Defined in

[src/core/node.ts:260](https://github.com/io-gui/io/blob/main/src/core/node.ts#L260)

***

### dispatchQueueSync()

> **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`dispatchQueueSync`](IoGl.md#dispatchqueuesync)

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

[`IoGl`](IoGl.md).[`dispose`](IoGl.md#dispose)

#### Defined in

[src/core/node.ts:392](https://github.com/io-gui/io/blob/main/src/core/node.ts#L392)

***

### init()

> **init**(): `void`

#### Returns

`void`

#### Overrides

[`IoGl`](IoGl.md).[`init`](IoGl.md#init)

#### Defined in

[src/elements/sliders/io-slider-base.ts:315](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L315)

***

### initPropertyUniform()

> **initPropertyUniform**(`name`, `property`): `string`

#### Parameters

• **name**: `string`

• **property**: [`PropertyDeclaration`](../type-aliases/PropertyDeclaration.md)

#### Returns

`string`

#### Inherited from

[`IoGl`](IoGl.md).[`initPropertyUniform`](IoGl.md#initpropertyuniform)

#### Defined in

[src/core/gl.ts:191](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L191)

***

### initShader()

> **initShader**(): `WebGLProgram`

#### Returns

`WebGLProgram`

#### Inherited from

[`IoGl`](IoGl.md).[`initShader`](IoGl.md#initshader)

#### Defined in

[src/core/gl.ts:209](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L209)

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

[`IoGl`](IoGl.md).[`inputValue`](IoGl.md#inputvalue)

#### Defined in

[src/core/node.ts:235](https://github.com/io-gui/io/blob/main/src/core/node.ts#L235)

***

### labelChanged()

> **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`labelChanged`](IoGl.md#labelchanged)

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

[`IoGl`](IoGl.md).[`objectMutated`](IoGl.md#objectmutated)

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

[`IoGl`](IoGl.md).[`onObjectMutated`](IoGl.md#onobjectmutated)

#### Defined in

[src/core/node.ts:288](https://github.com/io-gui/io/blob/main/src/core/node.ts#L288)

***

### onResized()

> **onResized**(): `void`

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`onResized`](IoGl.md#onresized)

#### Defined in

[src/core/gl.ts:303](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L303)

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

[`IoGl`](IoGl.md).[`queue`](IoGl.md#queue)

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

[`IoGl`](IoGl.md).[`removeEventListener`](IoGl.md#removeeventlistener)

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

[`IoGl`](IoGl.md).[`setAttribute`](IoGl.md#setattribute)

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

[`IoGl`](IoGl.md).[`setProperties`](IoGl.md#setproperties)

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

[`IoGl`](IoGl.md).[`setProperty`](IoGl.md#setproperty)

#### Defined in

[src/core/node.ts:122](https://github.com/io-gui/io/blob/main/src/core/node.ts#L122)

***

### setShaderProgram()

> **setShaderProgram**(): `void`

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`setShaderProgram`](IoGl.md#setshaderprogram)

#### Defined in

[src/core/gl.ts:379](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L379)

***

### setUniform()

> **setUniform**(`name`, `value`): `void`

#### Parameters

• **name**: `string`

• **value**: `any`

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`setUniform`](IoGl.md#setuniform)

#### Defined in

[src/core/gl.ts:396](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L396)

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

[`IoGl`](IoGl.md).[`template`](IoGl.md#template)

#### Defined in

[src/core/element.ts:233](https://github.com/io-gui/io/blob/main/src/core/element.ts#L233)

***

### themeMutated()

> **themeMutated**(): `void`

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`themeMutated`](IoGl.md#thememutated)

#### Defined in

[src/core/gl.ts:329](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L329)

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

[`IoGl`](IoGl.md).[`throttle`](IoGl.md#throttle)

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

[`IoGl`](IoGl.md).[`traverse`](IoGl.md#traverse)

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

[`IoGl`](IoGl.md).[`unbind`](IoGl.md#unbind)

#### Defined in

[src/core/node.ts:337](https://github.com/io-gui/io/blob/main/src/core/node.ts#L337)

***

### updatePropertyUniform()

> **updatePropertyUniform**(`name`, `property`): `void`

#### Parameters

• **name**: `string`

• **property**: [`PropertyInstance`](PropertyInstance.md)

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`updatePropertyUniform`](IoGl.md#updatepropertyuniform)

#### Defined in

[src/core/gl.ts:385](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L385)

***

### updateThemeUniforms()

> **updateThemeUniforms**(): `void`

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`updateThemeUniforms`](IoGl.md#updatethemeuniforms)

#### Defined in

[src/core/gl.ts:391](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L391)
