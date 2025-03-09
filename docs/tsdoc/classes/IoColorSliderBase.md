[**io-gui**](../README.md)

***

# Class: IoColorSliderBase

Defined in: [src/elements/color/io-color-sliders.ts:216](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L216)

A base class for 1D color slider.
It as an incomplete implementation of a color slider desiged to be fully implemented in channel-specific subclasses.

## Extends

- [`IoSlider`](IoSlider.md)

## Extended by

- [`IoColorSliderR`](IoColorSliderR.md)
- [`IoColorSliderG`](IoColorSliderG.md)
- [`IoColorSliderB`](IoColorSliderB.md)
- [`IoColorSliderA`](IoColorSliderA.md)
- [`IoColorSliderH`](IoColorSliderH.md)
- [`IoColorSliderS`](IoColorSliderS.md)
- [`IoColorSliderV`](IoColorSliderV.md)
- [`IoColorSliderL`](IoColorSliderL.md)
- [`IoColorSliderC`](IoColorSliderC.md)
- [`IoColorSliderM`](IoColorSliderM.md)
- [`IoColorSliderY`](IoColorSliderY.md)
- [`IoColorSliderK`](IoColorSliderK.md)

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### new IoColorSliderBase()

> **new IoColorSliderBase**(`properties`): [`IoColorSliderBase`](IoColorSliderBase.md)

Defined in: [src/core/gl.ts:272](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L272)

#### Parameters

##### properties

`Record`\<`string`, `any`\> = `{}`

#### Returns

[`IoColorSliderBase`](IoColorSliderBase.md)

#### Inherited from

[`IoSlider`](IoSlider.md).[`constructor`](IoSlider.md#constructors)

## Properties

### \_active

> **\_active**: `number` = `-1`

Defined in: [src/elements/sliders/io-slider-base.ts:65](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L65)

#### Inherited from

[`IoSlider`](IoSlider.md).[`_active`](IoSlider.md#_active)

***

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

Defined in: [src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

#### Inherited from

[`IoSlider`](IoSlider.md).[`_bindings`](IoSlider.md#_bindings)

***

### \_canvas

> **\_canvas**: `HTMLCanvasElement`

Defined in: [src/core/gl.ts:78](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L78)

#### Inherited from

[`IoSlider`](IoSlider.md).[`_canvas`](IoSlider.md#_canvas)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

Defined in: [src/core/node.ts:45](https://github.com/io-gui/io/blob/main/src/core/node.ts#L45)

#### Inherited from

[`IoSlider`](IoSlider.md).[`_changeQueue`](IoSlider.md#_changequeue)

***

### \_ctx

> **\_ctx**: `CanvasRenderingContext2D`

Defined in: [src/core/gl.ts:79](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L79)

#### Inherited from

[`IoSlider`](IoSlider.md).[`_ctx`](IoSlider.md#_ctx)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

Defined in: [src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

#### Inherited from

[`IoSlider`](IoSlider.md).[`_eventDispatcher`](IoSlider.md#_eventdispatcher)

***

### \_needsResize

> **\_needsResize**: `boolean` = `false`

Defined in: [src/core/gl.ts:77](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L77)

#### Inherited from

[`IoSlider`](IoSlider.md).[`_needsResize`](IoSlider.md#_needsresize)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

Defined in: [src/core/node.ts:43](https://github.com/io-gui/io/blob/main/src/core/node.ts#L43)

#### Inherited from

[`IoSlider`](IoSlider.md).[`_properties`](IoSlider.md#_properties)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

Defined in: [src/core/node.ts:42](https://github.com/io-gui/io/blob/main/src/core/node.ts#L42)

#### Inherited from

[`IoSlider`](IoSlider.md).[`_protochain`](IoSlider.md#_protochain)

***

### \_rect

> **\_rect**: `null` \| `DOMRect` = `null`

Defined in: [src/elements/sliders/io-slider-base.ts:66](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L66)

#### Inherited from

[`IoSlider`](IoSlider.md).[`_rect`](IoSlider.md#_rect)

***

### \_startX

> **\_startX**: `number` = `0`

Defined in: [src/elements/sliders/io-slider-base.ts:63](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L63)

#### Inherited from

[`IoSlider`](IoSlider.md).[`_startX`](IoSlider.md#_startx)

***

### \_startY

> **\_startY**: `number` = `0`

Defined in: [src/elements/sliders/io-slider-base.ts:64](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L64)

#### Inherited from

[`IoSlider`](IoSlider.md).[`_startY`](IoSlider.md#_starty)

***

### $

> **$**: `Record`\<`string`, `any`\>

Defined in: [src/core/element.ts:179](https://github.com/io-gui/io/blob/main/src/core/element.ts#L179)

#### Inherited from

[`IoSlider`](IoSlider.md).[`$`](IoSlider.md#$)

***

### class

> **class**: `string`

Defined in: [src/core/element.ts:188](https://github.com/io-gui/io/blob/main/src/core/element.ts#L188)

#### Inherited from

[`IoSlider`](IoSlider.md).[`class`](IoSlider.md#class)

***

### color

> **color**: \[`number`, `number`, `number`, `number`\]

Defined in: [src/core/gl.ts:69](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L69)

#### Inherited from

[`IoSlider`](IoSlider.md).[`color`](IoSlider.md#color)

***

### contenteditable

> **contenteditable**: `boolean`

Defined in: [src/core/element.ts:185](https://github.com/io-gui/io/blob/main/src/core/element.ts#L185)

#### Inherited from

[`IoSlider`](IoSlider.md).[`contenteditable`](IoSlider.md#contenteditable)

***

### disabled

> **disabled**: `boolean`

Defined in: [src/core/element.ts:209](https://github.com/io-gui/io/blob/main/src/core/element.ts#L209)

#### Inherited from

[`IoSlider`](IoSlider.md).[`disabled`](IoSlider.md#disabled)

***

### exponent

> **exponent**: `number`

Defined in: [src/elements/sliders/io-slider-base.ts:46](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L46)

#### Inherited from

[`IoSlider`](IoSlider.md).[`exponent`](IoSlider.md#exponent)

***

### hidden

> **hidden**: `boolean`

Defined in: [src/core/element.ts:206](https://github.com/io-gui/io/blob/main/src/core/element.ts#L206)

#### Inherited from

[`IoSlider`](IoSlider.md).[`hidden`](IoSlider.md#hidden)

***

### id

> **id**: `string`

Defined in: [src/core/element.ts:203](https://github.com/io-gui/io/blob/main/src/core/element.ts#L203)

#### Inherited from

[`IoSlider`](IoSlider.md).[`id`](IoSlider.md#id)

***

### label

> **label**: `string`

Defined in: [src/core/element.ts:194](https://github.com/io-gui/io/blob/main/src/core/element.ts#L194)

#### Inherited from

[`IoSlider`](IoSlider.md).[`label`](IoSlider.md#label)

***

### lazy

> **lazy**: `boolean`

Defined in: [src/elements/sliders/io-slider-base.ts:61](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L61)

#### Inherited from

[`IoSlider`](IoSlider.md).[`lazy`](IoSlider.md#lazy)

***

### max

> **max**: `number`

Defined in: [src/elements/sliders/io-slider.ts:26](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider.ts#L26)

#### Inherited from

[`IoSlider`](IoSlider.md).[`max`](IoSlider.md#max)

***

### min

> **min**: `number`

Defined in: [src/elements/sliders/io-slider.ts:23](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider.ts#L23)

#### Inherited from

[`IoSlider`](IoSlider.md).[`min`](IoSlider.md#min)

***

### name

> **name**: `string`

Defined in: [src/core/element.ts:197](https://github.com/io-gui/io/blob/main/src/core/element.ts#L197)

#### Inherited from

[`IoSlider`](IoSlider.md).[`name`](IoSlider.md#name)

***

### noscroll

> **noscroll**: `boolean`

Defined in: [src/elements/sliders/io-slider-base.ts:52](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L52)

#### Inherited from

[`IoSlider`](IoSlider.md).[`noscroll`](IoSlider.md#noscroll)

***

### pxRatio

> **pxRatio**: `number`

Defined in: [src/core/gl.ts:72](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L72)

#### Inherited from

[`IoSlider`](IoSlider.md).[`pxRatio`](IoSlider.md#pxratio)

***

### role

> **role**: `string`

Defined in: [src/elements/sliders/io-slider-base.ts:55](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L55)

#### Inherited from

[`IoSlider`](IoSlider.md).[`role`](IoSlider.md#role)

***

### size

> **size**: \[`number`, `number`\]

Defined in: [src/core/gl.ts:66](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L66)

#### Inherited from

[`IoSlider`](IoSlider.md).[`size`](IoSlider.md#size)

***

### step

> **step**: `number`

Defined in: [src/elements/sliders/io-slider.ts:20](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider.ts#L20)

#### Inherited from

[`IoSlider`](IoSlider.md).[`step`](IoSlider.md#step)

***

### tabindex

> **tabindex**: `string`

Defined in: [src/elements/sliders/io-slider-base.ts:58](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L58)

#### Inherited from

[`IoSlider`](IoSlider.md).[`tabindex`](IoSlider.md#tabindex)

***

### theme

> **theme**: `IoTheme`

Defined in: [src/core/gl.ts:75](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L75)

#### Inherited from

[`IoSlider`](IoSlider.md).[`theme`](IoSlider.md#theme)

***

### title

> **title**: `string`

Defined in: [src/core/element.ts:200](https://github.com/io-gui/io/blob/main/src/core/element.ts#L200)

#### Inherited from

[`IoSlider`](IoSlider.md).[`title`](IoSlider.md#title)

***

### value

> **value**: `number`

Defined in: [src/elements/sliders/io-slider.ts:17](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider.ts#L17)

#### Inherited from

[`IoSlider`](IoSlider.md).[`value`](IoSlider.md#value)

***

### vertical

> **vertical**: `boolean`

Defined in: [src/elements/sliders/io-slider-base.ts:49](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L49)

#### Inherited from

[`IoSlider`](IoSlider.md).[`vertical`](IoSlider.md#vertical)

## Accessors

### \_max

#### Get Signature

> **get** **\_max**(): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:79](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L79)

##### Returns

\[`number`, `number`\]

#### Inherited from

[`IoSlider`](IoSlider.md).[`_max`](IoSlider.md#_max)

***

### \_min

#### Get Signature

> **get** **\_min**(): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:68](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L68)

##### Returns

\[`number`, `number`\]

#### Inherited from

[`IoSlider`](IoSlider.md).[`_min`](IoSlider.md#_min)

***

### \_step

#### Get Signature

> **get** **\_step**(): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:90](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L90)

##### Returns

\[`number`, `number`\]

#### Inherited from

[`IoSlider`](IoSlider.md).[`_step`](IoSlider.md#_step)

***

### \_value

#### Get Signature

> **get** **\_value**(): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:101](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L101)

##### Returns

\[`number`, `number`\]

#### Inherited from

[`IoSlider`](IoSlider.md).[`_value`](IoSlider.md#_value)

***

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

[`IoSlider`](IoSlider.md).[`textNode`](IoSlider.md#textnode)

***

### Frag

#### Get Signature

> **get** `static` **Frag**(): `string`

Defined in: [src/elements/color/io-color-sliders.ts:225](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L225)

##### Returns

`string`

#### Overrides

[`IoSlider`](IoSlider.md).[`Frag`](IoSlider.md#frag)

***

### GlUtils

#### Get Signature

> **get** `static` **GlUtils**(): `string`

Defined in: [src/elements/color/io-color-sliders.ts:217](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L217)

##### Returns

`string`

#### Overrides

[`IoSlider`](IoSlider.md).[`GlUtils`](IoSlider.md#glutils)

***

### Listeners

#### Get Signature

> **get** `static` **Listeners**(): `object`

Defined in: [src/elements/sliders/io-slider-base.ts:112](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L112)

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

[`IoSlider`](IoSlider.md).[`Listeners`](IoSlider.md#listeners)

***

### Properties

#### Get Signature

> **get** `static` **Properties**(): [`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

Defined in: [src/core/node.ts:33](https://github.com/io-gui/io/blob/main/src/core/node.ts#L33)

##### Returns

[`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

#### Inherited from

[`IoSlider`](IoSlider.md).[`Properties`](IoSlider.md#properties-1)

***

### Style

#### Get Signature

> **get** `static` **Style**(): `string`

Defined in: [src/elements/sliders/io-slider-base.ts:9](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L9)

##### Returns

`string`

#### Inherited from

[`IoSlider`](IoSlider.md).[`Style`](IoSlider.md#style)

***

### Vert

#### Get Signature

> **get** `static` **Vert**(): `string`

Defined in: [src/core/gl.ts:81](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L81)

##### Returns

`string`

#### Inherited from

[`IoSlider`](IoSlider.md).[`Vert`](IoSlider.md#vert)

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

[`IoSlider`](IoSlider.md).[`_flattenTextNode`](IoSlider.md#_flattentextnode)

***

### \_getPointerCoord()

> **\_getPointerCoord**(`event`): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:179](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L179)

#### Parameters

##### event

`PointerEvent`

#### Returns

\[`number`, `number`\]

#### Inherited from

[`IoSlider`](IoSlider.md).[`_getPointerCoord`](IoSlider.md#_getpointercoord)

***

### \_getValueFromCoord()

> **\_getValueFromCoord**(`coord`): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:187](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L187)

#### Parameters

##### coord

\[`number`, `number`\]

#### Returns

\[`number`, `number`\]

#### Inherited from

[`IoSlider`](IoSlider.md).[`_getValueFromCoord`](IoSlider.md#_getvaluefromcoord)

***

### \_inputValue()

> **\_inputValue**(`value`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:203](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L203)

#### Parameters

##### value

\[`number`, `number`\]

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_inputValue`](IoSlider.md#_inputvalue)

***

### \_onBlur()

> **\_onBlur**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:124](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L124)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_onBlur`](IoSlider.md#_onblur)

***

### \_onContextmenu()

> **\_onContextmenu**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:128](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L128)

#### Parameters

##### event

`Event`

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_onContextmenu`](IoSlider.md#_oncontextmenu)

***

### \_onFocus()

> **\_onFocus**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:120](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L120)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_onFocus`](IoSlider.md#_onfocus)

***

### \_onKeydown()

> **\_onKeydown**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:230](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L230)

#### Parameters

##### event

`KeyboardEvent`

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_onKeydown`](IoSlider.md#_onkeydown)

***

### \_onPointerdown()

> **\_onPointerdown**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:161](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L161)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_onPointerdown`](IoSlider.md#_onpointerdown)

***

### \_onPointermove()

> **\_onPointermove**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:168](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L168)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_onPointermove`](IoSlider.md#_onpointermove)

***

### \_onPointermoveThrottled()

> **\_onPointermoveThrottled**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:195](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L195)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_onPointermoveThrottled`](IoSlider.md#_onpointermovethrottled)

***

### \_onPointerup()

> **\_onPointerup**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:172](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L172)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_onPointerup`](IoSlider.md#_onpointerup)

***

### \_onRender()

> **\_onRender**(): `void`

Defined in: [src/core/gl.ts:357](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L357)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_onRender`](IoSlider.md#_onrender)

***

### \_onTouchend()

> **\_onTouchend**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:157](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L157)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_onTouchend`](IoSlider.md#_ontouchend)

***

### \_onTouchmove()

> **\_onTouchmove**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:139](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L139)

#### Parameters

##### event

`TouchEvent`

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_onTouchmove`](IoSlider.md#_ontouchmove)

***

### \_onTouchstart()

> **\_onTouchstart**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:131](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L131)

#### Parameters

##### event

`TouchEvent`

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_onTouchstart`](IoSlider.md#_ontouchstart)

***

### \_setDecrease()

> **\_setDecrease**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:276](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L276)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_setDecrease`](IoSlider.md#_setdecrease)

***

### \_setDown()

> **\_setDown**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:297](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L297)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_setDown`](IoSlider.md#_setdown)

***

### \_setIncrease()

> **\_setIncrease**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:269](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L269)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_setIncrease`](IoSlider.md#_setincrease)

***

### \_setLeft()

> **\_setLeft**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:303](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L303)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_setLeft`](IoSlider.md#_setleft)

***

### \_setMax()

> **\_setMax**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:287](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L287)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_setMax`](IoSlider.md#_setmax)

***

### \_setMin()

> **\_setMin**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:283](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L283)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_setMin`](IoSlider.md#_setmin)

***

### \_setRight()

> **\_setRight**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:309](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L309)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_setRight`](IoSlider.md#_setright)

***

### \_setUp()

> **\_setUp**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:291](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L291)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`_setUp`](IoSlider.md#_setup)

***

### addEventListener()

> **addEventListener**(`type`, `listener`, `options`?): `void`

Defined in: [src/core/node.ts:343](https://github.com/io-gui/io/blob/main/src/core/node.ts#L343)

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

[`IoSlider`](IoSlider.md).[`addEventListener`](IoSlider.md#addeventlistener)

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

[`IoSlider`](IoSlider.md).[`applyProperties`](IoSlider.md#applyproperties)

***

### bind()

> **bind**(`prop`): [`Binding`](Binding.md)

Defined in: [src/core/node.ts:310](https://github.com/io-gui/io/blob/main/src/core/node.ts#L310)

Returns a binding to a specified property`.

#### Parameters

##### prop

`string`

Property to bind to.

#### Returns

[`Binding`](Binding.md)

Binding object.

#### Inherited from

[`IoSlider`](IoSlider.md).[`bind`](IoSlider.md#bind)

***

### changed()

> **changed**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:318](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L318)

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`changed`](IoSlider.md#changed)

***

### connectedCallback()

> **connectedCallback**(): `void`

Defined in: [src/core/element.ts:214](https://github.com/io-gui/io/blob/main/src/core/element.ts#L214)

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`connectedCallback`](IoSlider.md#connectedcallback)

***

### disabledChanged()

> **disabledChanged**(): `void`

Defined in: [src/core/element.ts:430](https://github.com/io-gui/io/blob/main/src/core/element.ts#L430)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`disabledChanged`](IoSlider.md#disabledchanged)

***

### disconnectedCallback()

> **disconnectedCallback**(): `void`

Defined in: [src/core/element.ts:222](https://github.com/io-gui/io/blob/main/src/core/element.ts#L222)

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`disconnectedCallback`](IoSlider.md#disconnectedcallback)

***

### dispatchEvent()

> **dispatchEvent**(`type`, `detail`, `bubbles`, `src`?): `void`

Defined in: [src/core/node.ts:368](https://github.com/io-gui/io/blob/main/src/core/node.ts#L368)

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

[`IoSlider`](IoSlider.md).[`dispatchEvent`](IoSlider.md#dispatchevent)

***

### dispatchMutationEvent()

> **dispatchMutationEvent**(`object`): `void`

Defined in: [src/core/node.ts:375](https://github.com/io-gui/io/blob/main/src/core/node.ts#L375)

Shorthand for dispatching `'object-mutated'` event on window.

#### Parameters

##### object

`any`

object which mutated.

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`dispatchMutationEvent`](IoSlider.md#dispatchmutationevent)

***

### dispatchQueue()

> **dispatchQueue**(`lazy`): `void`

Defined in: [src/core/node.ts:254](https://github.com/io-gui/io/blob/main/src/core/node.ts#L254)

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Parameters

##### lazy

`boolean` = `false`

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`dispatchQueue`](IoSlider.md#dispatchqueue)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/core/node.ts:382](https://github.com/io-gui/io/blob/main/src/core/node.ts#L382)

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`dispose`](IoSlider.md#dispose)

***

### init()

> **init**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:315](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L315)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`init`](IoSlider.md#init)

***

### initPropertyUniform()

> **initPropertyUniform**(`name`, `property`): `string`

Defined in: [src/core/gl.ts:204](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L204)

#### Parameters

##### name

`string`

##### property

[`PropertyDefinition`](../type-aliases/PropertyDefinition.md)

#### Returns

`string`

#### Inherited from

[`IoSlider`](IoSlider.md).[`initPropertyUniform`](IoSlider.md#initpropertyuniform)

***

### initShader()

> **initShader**(): `WebGLProgram`

Defined in: [src/core/gl.ts:222](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L222)

#### Returns

`WebGLProgram`

#### Inherited from

[`IoSlider`](IoSlider.md).[`initShader`](IoSlider.md#initshader)

***

### inputValue()

> **inputValue**(`value`): `void`

Defined in: [src/core/node.ts:229](https://github.com/io-gui/io/blob/main/src/core/node.ts#L229)

Sets value property and emits `value-input` event.
Use this when value property is set by user action (e.g. mouse click).

#### Parameters

##### value

`any`

Property value.

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`inputValue`](IoSlider.md#inputvalue)

***

### labelChanged()

> **labelChanged**(): `void`

Defined in: [src/core/element.ts:423](https://github.com/io-gui/io/blob/main/src/core/element.ts#L423)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`labelChanged`](IoSlider.md#labelchanged)

***

### objectMutated()

> **objectMutated**(`prop`): `void`

Defined in: [src/core/node.ts:299](https://github.com/io-gui/io/blob/main/src/core/node.ts#L299)

This function is called after `onObjectMutated()` determines that one of
the object properties has mutated.

#### Parameters

##### prop

`string`

Mutated object property name.

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`objectMutated`](IoSlider.md#objectmutated)

***

### onObjectMutated()

> **onObjectMutated**(`event`): `void`

Defined in: [src/core/node.ts:278](https://github.com/io-gui/io/blob/main/src/core/node.ts#L278)

Event handler for 'object-mutated' event emitted from the `window`.
Node should be listening for this event if it has an observed object property

#### Parameters

##### event

`CustomEvent`

Event payload.

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`onObjectMutated`](IoSlider.md#onobjectmutated)

***

### onResized()

> **onResized**(): `void`

Defined in: [src/core/gl.ts:316](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L316)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`onResized`](IoSlider.md#onresized)

***

### queue()

> **queue**(`prop`, `value`, `oldValue`): `void`

Defined in: [src/core/node.ts:248](https://github.com/io-gui/io/blob/main/src/core/node.ts#L248)

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

[`IoSlider`](IoSlider.md).[`queue`](IoSlider.md#queue)

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

[`IoSlider`](IoSlider.md).[`Register`](IoSlider.md#register)

***

### removeEventListener()

> **removeEventListener**(`type`, `listener`?, `options`?): `void`

Defined in: [src/core/node.ts:358](https://github.com/io-gui/io/blob/main/src/core/node.ts#L358)

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

[`IoSlider`](IoSlider.md).[`removeEventListener`](IoSlider.md#removeeventlistener)

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

[`IoSlider`](IoSlider.md).[`setAttribute`](IoSlider.md#setattribute)

***

### setProperties()

> **setProperties**(`props`): `void`

Defined in: [src/core/node.ts:211](https://github.com/io-gui/io/blob/main/src/core/node.ts#L211)

Sets multiple properties in batch.
[property]-changed` events will be broadcast in the end.

#### Parameters

##### props

`any`

Map of property names and values.

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`setProperties`](IoSlider.md#setproperties)

***

### setProperty()

> **setProperty**(`name`, `value`, `lazyDispatch`?): `void`

Defined in: [src/core/node.ts:119](https://github.com/io-gui/io/blob/main/src/core/node.ts#L119)

Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.

#### Parameters

##### name

`string`

Property name to set value of.

##### value

`any`

Peroperty value.

##### lazyDispatch?

`boolean` = `false`

flag to skip event dispatch.

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`setProperty`](IoSlider.md#setproperty)

***

### setShaderProgram()

> **setShaderProgram**(): `void`

Defined in: [src/core/gl.ts:392](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L392)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`setShaderProgram`](IoSlider.md#setshaderprogram)

***

### setUniform()

> **setUniform**(`name`, `value`): `void`

Defined in: [src/core/gl.ts:409](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L409)

#### Parameters

##### name

`string`

##### value

`any`

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`setUniform`](IoSlider.md#setuniform)

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

[`IoSlider`](IoSlider.md).[`template`](IoSlider.md#template)

***

### themeMutated()

> **themeMutated**(): `void`

Defined in: [src/core/gl.ts:342](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L342)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`themeMutated`](IoSlider.md#thememutated)

***

### throttle()

> **throttle**(`func`, `arg`, `timeout`): `void`

Defined in: [src/core/node.ts:269](https://github.com/io-gui/io/blob/main/src/core/node.ts#L269)

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

[`IoSlider`](IoSlider.md).[`throttle`](IoSlider.md#throttle)

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

[`IoSlider`](IoSlider.md).[`traverse`](IoSlider.md#traverse)

***

### unbind()

> **unbind**(`prop`): `void`

Defined in: [src/core/node.ts:327](https://github.com/io-gui/io/blob/main/src/core/node.ts#L327)

Unbinds a binding to a specified property`.

#### Parameters

##### prop

`string`

Property to unbind.

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`unbind`](IoSlider.md#unbind)

***

### updatePropertyUniform()

> **updatePropertyUniform**(`name`, `property`): `void`

Defined in: [src/core/gl.ts:398](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L398)

#### Parameters

##### name

`string`

##### property

[`PropertyInstance`](PropertyInstance.md)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`updatePropertyUniform`](IoSlider.md#updatepropertyuniform)

***

### updateThemeUniforms()

> **updateThemeUniforms**(): `void`

Defined in: [src/core/gl.ts:404](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L404)

#### Returns

`void`

#### Inherited from

[`IoSlider`](IoSlider.md).[`updateThemeUniforms`](IoSlider.md#updatethemeuniforms)
