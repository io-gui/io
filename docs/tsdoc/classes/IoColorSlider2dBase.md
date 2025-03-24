[**io-gui**](../README.md)

***

# Class: IoColorSlider2dBase

Defined in: [src/elements/color/io-color-sliders.ts:232](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L232)

A base class for 2D color slider.
It as an incomplete implementation of a color slider desiged to be fully implemented in channel-specific subclasses.

## Extends

- [`IoSlider2d`](IoSlider2d.md)

## Extended by

- [`IoColorSliderHs`](IoColorSliderHs.md)
- [`IoColorSliderSv`](IoColorSliderSv.md)
- [`IoColorSliderSL`](IoColorSliderSL.md)

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### new IoColorSlider2dBase()

> **new IoColorSlider2dBase**(`properties`): [`IoColorSlider2dBase`](IoColorSlider2dBase.md)

Defined in: [src/core/gl.ts:171](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L171)

#### Parameters

##### properties

`Record`\<`string`, `any`\> = `{}`

#### Returns

[`IoColorSlider2dBase`](IoColorSlider2dBase.md)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`constructor`](IoSlider2d.md#constructors)

## Properties

### \_active

> **\_active**: `number` = `-1`

Defined in: [src/elements/sliders/io-slider-base.ts:62](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L62)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_active`](IoSlider2d.md#_active)

***

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

Defined in: [src/core/node.ts:45](https://github.com/io-gui/io/blob/main/src/core/node.ts#L45)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_bindings`](IoSlider2d.md#_bindings)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

Defined in: [src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_changeQueue`](IoSlider2d.md#_changequeue)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

Defined in: [src/core/node.ts:47](https://github.com/io-gui/io/blob/main/src/core/node.ts#L47)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_eventDispatcher`](IoSlider2d.md#_eventdispatcher)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

Defined in: [src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_properties`](IoSlider2d.md#_properties)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

Defined in: [src/core/node.ts:43](https://github.com/io-gui/io/blob/main/src/core/node.ts#L43)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_protochain`](IoSlider2d.md#_protochain)

***

### \_rect

> **\_rect**: `null` \| `DOMRect` = `null`

Defined in: [src/elements/sliders/io-slider-base.ts:63](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L63)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_rect`](IoSlider2d.md#_rect)

***

### \_startX

> **\_startX**: `number` = `0`

Defined in: [src/elements/sliders/io-slider-base.ts:60](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L60)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_startX`](IoSlider2d.md#_startx)

***

### \_startY

> **\_startY**: `number` = `0`

Defined in: [src/elements/sliders/io-slider-base.ts:61](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L61)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_startY`](IoSlider2d.md#_starty)

***

### $

> **$**: `Record`\<`string`, `any`\>

Defined in: [src/core/element.ts:181](https://github.com/io-gui/io/blob/main/src/core/element.ts#L181)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`$`](IoSlider2d.md#$)

***

### canvas

> **canvas**: `HTMLCanvasElement`

Defined in: [src/core/gl.ts:73](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L73)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`canvas`](IoSlider2d.md#canvas)

***

### class

> **class**: `string`

Defined in: [src/core/element.ts:190](https://github.com/io-gui/io/blob/main/src/core/element.ts#L190)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`class`](IoSlider2d.md#class)

***

### color

> **color**: \[`number`, `number`, `number`, `number`\]

Defined in: [src/core/gl.ts:61](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L61)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`color`](IoSlider2d.md#color)

***

### contenteditable

> **contenteditable**: `boolean`

Defined in: [src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`contenteditable`](IoSlider2d.md#contenteditable)

***

### ctx

> **ctx**: `CanvasRenderingContext2D`

Defined in: [src/core/gl.ts:74](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L74)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`ctx`](IoSlider2d.md#ctx)

***

### disabled

> **disabled**: `boolean`

Defined in: [src/core/element.ts:211](https://github.com/io-gui/io/blob/main/src/core/element.ts#L211)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`disabled`](IoSlider2d.md#disabled)

***

### exponent

> **exponent**: `number`

Defined in: [src/elements/sliders/io-slider-base.ts:46](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L46)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`exponent`](IoSlider2d.md#exponent)

***

### hidden

> **hidden**: `boolean`

Defined in: [src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`hidden`](IoSlider2d.md#hidden)

***

### id

> **id**: `string`

Defined in: [src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`id`](IoSlider2d.md#id)

***

### label

> **label**: `string`

Defined in: [src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`label`](IoSlider2d.md#label)

***

### max

> **max**: \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-2d.ts:37](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L37)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`max`](IoSlider2d.md#max)

***

### min

> **min**: \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-2d.ts:34](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L34)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`min`](IoSlider2d.md#min)

***

### name

> **name**: `string`

Defined in: [src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`name`](IoSlider2d.md#name)

***

### needsResize

> **needsResize**: `boolean` = `false`

Defined in: [src/core/gl.ts:72](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L72)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`needsResize`](IoSlider2d.md#needsresize)

***

### noscroll

> **noscroll**: `boolean`

Defined in: [src/elements/sliders/io-slider-2d.ts:40](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L40)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`noscroll`](IoSlider2d.md#noscroll)

***

### pxRatio

> **pxRatio**: `number`

Defined in: [src/core/gl.ts:64](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L64)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`pxRatio`](IoSlider2d.md#pxratio)

***

### reactivity

> **reactivity**: `string`

Defined in: [src/core/gl.ts:70](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L70)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`reactivity`](IoSlider2d.md#reactivity)

***

### role

> **role**: `string`

Defined in: [src/elements/sliders/io-slider-base.ts:55](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L55)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`role`](IoSlider2d.md#role)

***

### size

> **size**: \[`number`, `number`\]

Defined in: [src/core/gl.ts:58](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L58)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`size`](IoSlider2d.md#size)

***

### step

> **step**: \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-2d.ts:31](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L31)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`step`](IoSlider2d.md#step)

***

### tabindex

> **tabindex**: `string`

Defined in: [src/elements/sliders/io-slider-base.ts:58](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L58)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`tabindex`](IoSlider2d.md#tabindex)

***

### theme

> **theme**: `IoTheme`

Defined in: [src/core/gl.ts:67](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L67)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`theme`](IoSlider2d.md#theme)

***

### title

> **title**: `string`

Defined in: [src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`title`](IoSlider2d.md#title)

***

### transparent

> **transparent**: `boolean`

Defined in: [src/core/gl.ts:55](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L55)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`transparent`](IoSlider2d.md#transparent)

***

### value

> **value**: \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-2d.ts:28](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L28)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`value`](IoSlider2d.md#value)

***

### vertical

> **vertical**: `boolean`

Defined in: [src/elements/sliders/io-slider-base.ts:49](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L49)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`vertical`](IoSlider2d.md#vertical)

## Accessors

### \_max

#### Get Signature

> **get** **\_max**(): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:76](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L76)

##### Returns

\[`number`, `number`\]

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_max`](IoSlider2d.md#_max)

***

### \_min

#### Get Signature

> **get** **\_min**(): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:65](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L65)

##### Returns

\[`number`, `number`\]

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_min`](IoSlider2d.md#_min)

***

### \_step

#### Get Signature

> **get** **\_step**(): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:87](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L87)

##### Returns

\[`number`, `number`\]

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_step`](IoSlider2d.md#_step)

***

### \_value

#### Get Signature

> **get** **\_value**(): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:98](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L98)

##### Returns

\[`number`, `number`\]

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_value`](IoSlider2d.md#_value)

***

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

[`IoSlider2d`](IoSlider2d.md).[`textNode`](IoSlider2d.md#textnode)

***

### Frag

#### Get Signature

> **get** `static` **Frag**(): `string`

Defined in: [src/elements/color/io-color-sliders.ts:243](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L243)

##### Returns

`string`

#### Overrides

[`IoSlider2d`](IoSlider2d.md).[`Frag`](IoSlider2d.md#frag)

***

### GlUtils

#### Get Signature

> **get** `static` **GlUtils**(): `string`

Defined in: [src/elements/color/io-color-sliders.ts:233](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L233)

##### Returns

`string`

#### Overrides

[`IoSlider2d`](IoSlider2d.md).[`GlUtils`](IoSlider2d.md#glutils)

***

### Listeners

#### Get Signature

> **get** `static` **Listeners**(): `object`

Defined in: [src/elements/sliders/io-slider-base.ts:109](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L109)

##### Returns

`object`

###### contextmenu

> **contextmenu**: `string` = `'_onContextmenu'`

###### focus

> **focus**: `string` = `'_onFocus'`

###### pointerdown

> **pointerdown**: `string` = `'_onPointerdown'`

###### touchstart

> **touchstart**: (`string` \| \{ `passive`: `boolean`; \})[]

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`Listeners`](IoSlider2d.md#listeners)

***

### Properties

#### Get Signature

> **get** `static` **Properties**(): [`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

Defined in: [src/core/node.ts:35](https://github.com/io-gui/io/blob/main/src/core/node.ts#L35)

##### Returns

[`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`Properties`](IoSlider2d.md#properties-1)

***

### Style

#### Get Signature

> **get** `static` **Style**(): `string`

Defined in: [src/elements/sliders/io-slider-2d.ts:7](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L7)

##### Returns

`string`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`Style`](IoSlider2d.md#style)

***

### Vert

#### Get Signature

> **get** `static` **Vert**(): `string`

Defined in: [src/core/gl.ts:76](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L76)

##### Returns

`string`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`Vert`](IoSlider2d.md#vert)

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

[`IoSlider2d`](IoSlider2d.md).[`_flattenTextNode`](IoSlider2d.md#_flattentextnode)

***

### \_getPointerCoord()

> **\_getPointerCoord**(`event`): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:176](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L176)

#### Parameters

##### event

`PointerEvent`

#### Returns

\[`number`, `number`\]

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_getPointerCoord`](IoSlider2d.md#_getpointercoord)

***

### \_getValueFromCoord()

> **\_getValueFromCoord**(`coord`): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:184](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L184)

#### Parameters

##### coord

\[`number`, `number`\]

#### Returns

\[`number`, `number`\]

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_getValueFromCoord`](IoSlider2d.md#_getvaluefromcoord)

***

### \_inputValue()

> **\_inputValue**(`value`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:200](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L200)

#### Parameters

##### value

\[`number`, `number`\]

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_inputValue`](IoSlider2d.md#_inputvalue)

***

### \_onBlur()

> **\_onBlur**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:121](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L121)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_onBlur`](IoSlider2d.md#_onblur)

***

### \_onContextmenu()

> **\_onContextmenu**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:125](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L125)

#### Parameters

##### event

`Event`

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_onContextmenu`](IoSlider2d.md#_oncontextmenu)

***

### \_onFocus()

> **\_onFocus**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:117](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L117)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_onFocus`](IoSlider2d.md#_onfocus)

***

### \_onKeydown()

> **\_onKeydown**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:227](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L227)

#### Parameters

##### event

`KeyboardEvent`

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_onKeydown`](IoSlider2d.md#_onkeydown)

***

### \_onPointerdown()

> **\_onPointerdown**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:158](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L158)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_onPointerdown`](IoSlider2d.md#_onpointerdown)

***

### \_onPointermove()

> **\_onPointermove**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:165](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L165)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_onPointermove`](IoSlider2d.md#_onpointermove)

***

### \_onPointermoveThrottled()

> **\_onPointermoveThrottled**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:192](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L192)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_onPointermoveThrottled`](IoSlider2d.md#_onpointermovethrottled)

***

### \_onPointerup()

> **\_onPointerup**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:169](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L169)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_onPointerup`](IoSlider2d.md#_onpointerup)

***

### \_onRender()

> **\_onRender**(): `void`

Defined in: [src/core/gl.ts:248](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L248)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_onRender`](IoSlider2d.md#_onrender)

***

### \_onTouchend()

> **\_onTouchend**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:154](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L154)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_onTouchend`](IoSlider2d.md#_ontouchend)

***

### \_onTouchmove()

> **\_onTouchmove**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:136](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L136)

#### Parameters

##### event

`TouchEvent`

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_onTouchmove`](IoSlider2d.md#_ontouchmove)

***

### \_onTouchstart()

> **\_onTouchstart**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:128](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L128)

#### Parameters

##### event

`TouchEvent`

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_onTouchstart`](IoSlider2d.md#_ontouchstart)

***

### \_setDecrease()

> **\_setDecrease**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:273](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L273)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_setDecrease`](IoSlider2d.md#_setdecrease)

***

### \_setDown()

> **\_setDown**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:294](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L294)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_setDown`](IoSlider2d.md#_setdown)

***

### \_setIncrease()

> **\_setIncrease**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:266](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L266)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_setIncrease`](IoSlider2d.md#_setincrease)

***

### \_setLeft()

> **\_setLeft**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:300](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L300)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_setLeft`](IoSlider2d.md#_setleft)

***

### \_setMax()

> **\_setMax**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:284](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L284)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_setMax`](IoSlider2d.md#_setmax)

***

### \_setMin()

> **\_setMin**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:280](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L280)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_setMin`](IoSlider2d.md#_setmin)

***

### \_setRight()

> **\_setRight**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:306](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L306)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_setRight`](IoSlider2d.md#_setright)

***

### \_setUp()

> **\_setUp**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:288](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L288)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`_setUp`](IoSlider2d.md#_setup)

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

[`IoSlider2d`](IoSlider2d.md).[`addEventListener`](IoSlider2d.md#addeventlistener)

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

[`IoSlider2d`](IoSlider2d.md).[`applyProperties`](IoSlider2d.md#applyproperties)

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

[`IoSlider2d`](IoSlider2d.md).[`bind`](IoSlider2d.md#bind)

***

### changed()

> **changed**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:315](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L315)

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`changed`](IoSlider2d.md#changed)

***

### connectedCallback()

> **connectedCallback**(): `void`

Defined in: [src/core/element.ts:229](https://github.com/io-gui/io/blob/main/src/core/element.ts#L229)

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`connectedCallback`](IoSlider2d.md#connectedcallback)

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

[`IoSlider2d`](IoSlider2d.md).[`debounce`](IoSlider2d.md#debounce)

***

### disabledChanged()

> **disabledChanged**(): `void`

Defined in: [src/core/element.ts:451](https://github.com/io-gui/io/blob/main/src/core/element.ts#L451)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`disabledChanged`](IoSlider2d.md#disabledchanged)

***

### disconnectedCallback()

> **disconnectedCallback**(): `void`

Defined in: [src/core/element.ts:237](https://github.com/io-gui/io/blob/main/src/core/element.ts#L237)

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`disconnectedCallback`](IoSlider2d.md#disconnectedcallback)

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

[`IoSlider2d`](IoSlider2d.md).[`dispatchEvent`](IoSlider2d.md#dispatchevent)

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

[`IoSlider2d`](IoSlider2d.md).[`dispatchQueue`](IoSlider2d.md#dispatchqueue)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/core/node.ts:369](https://github.com/io-gui/io/blob/main/src/core/node.ts#L369)

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`dispose`](IoSlider2d.md#dispose)

***

### init()

> **init**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:312](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L312)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`init`](IoSlider2d.md#init)

***

### initPropertyUniform()

> **initPropertyUniform**(`name`, `property`): `string`

Defined in: [src/core/gl.ts:110](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L110)

#### Parameters

##### name

`string`

##### property

[`PropertyDefinition`](../type-aliases/PropertyDefinition.md)

#### Returns

`string`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`initPropertyUniform`](IoSlider2d.md#initpropertyuniform)

***

### initShader()

> **initShader**(): `WebGLProgram`

Defined in: [src/core/gl.ts:127](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L127)

#### Returns

`WebGLProgram`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`initShader`](IoSlider2d.md#initshader)

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

[`IoSlider2d`](IoSlider2d.md).[`inputValue`](IoSlider2d.md#inputvalue)

***

### labelChanged()

> **labelChanged**(): `void`

Defined in: [src/core/element.ts:444](https://github.com/io-gui/io/blob/main/src/core/element.ts#L444)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`labelChanged`](IoSlider2d.md#labelchanged)

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

[`IoSlider2d`](IoSlider2d.md).[`onPropertyMutated`](IoSlider2d.md#onpropertymutated)

***

### onResized()

> **onResized**(): `void`

Defined in: [src/core/gl.ts:215](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L215)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`onResized`](IoSlider2d.md#onresized)

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

[`IoSlider2d`](IoSlider2d.md).[`queue`](IoSlider2d.md#queue)

***

### Register()

> **Register**(`ioNodeConstructor`): `void`

Defined in: [src/core/gl.ts:356](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L356)

#### Parameters

##### ioNodeConstructor

*typeof* [`IoElement`](IoElement.md)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`Register`](IoSlider2d.md#register)

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

[`IoSlider2d`](IoSlider2d.md).[`removeEventListener`](IoSlider2d.md#removeeventlistener)

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

[`IoSlider2d`](IoSlider2d.md).[`setAttribute`](IoSlider2d.md#setattribute)

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

[`IoSlider2d`](IoSlider2d.md).[`setProperties`](IoSlider2d.md#setproperties)

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

[`IoSlider2d`](IoSlider2d.md).[`setProperty`](IoSlider2d.md#setproperty)

***

### setShaderProgram()

> **setShaderProgram**(): `void`

Defined in: [src/core/gl.ts:282](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L282)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`setShaderProgram`](IoSlider2d.md#setshaderprogram)

***

### setUniform()

> **setUniform**(`name`, `value`): `void`

Defined in: [src/core/gl.ts:297](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L297)

#### Parameters

##### name

`string`

##### value

`any`

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`setUniform`](IoSlider2d.md#setuniform)

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

[`IoSlider2d`](IoSlider2d.md).[`template`](IoSlider2d.md#template)

***

### themeMutated()

> **themeMutated**(): `void`

Defined in: [src/core/gl.ts:241](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L241)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`themeMutated`](IoSlider2d.md#thememutated)

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

[`IoSlider2d`](IoSlider2d.md).[`throttle`](IoSlider2d.md#throttle)

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

[`IoSlider2d`](IoSlider2d.md).[`traverse`](IoSlider2d.md#traverse)

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

[`IoSlider2d`](IoSlider2d.md).[`unbind`](IoSlider2d.md#unbind)

***

### updatePropertyUniform()

> **updatePropertyUniform**(`name`, `property`): `void`

Defined in: [src/core/gl.ts:288](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L288)

#### Parameters

##### name

`string`

##### property

[`PropertyInstance`](PropertyInstance.md)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`updatePropertyUniform`](IoSlider2d.md#updatepropertyuniform)

***

### updateThemeUniforms()

> **updateThemeUniforms**(): `void`

Defined in: [src/core/gl.ts:292](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L292)

#### Returns

`void`

#### Inherited from

[`IoSlider2d`](IoSlider2d.md).[`updateThemeUniforms`](IoSlider2d.md#updatethemeuniforms)
