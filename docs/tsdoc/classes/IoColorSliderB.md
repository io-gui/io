[**io-gui**](../README.md)

***

[io-gui](../README.md) / IoColorSliderB

# Class: IoColorSliderB

Defined in: [src/elements/color/io-color-sliders.ts:342](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L342)

A 1D slider for "blue" color channel.

## Extends

- [`IoColorSliderBase`](IoColorSliderBase.md)

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### new IoColorSliderB()

> **new IoColorSliderB**(`properties`): [`IoColorSliderB`](IoColorSliderB.md)

Defined in: [src/core/gl.ts:272](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L272)

#### Parameters

##### properties

`Record`\<`string`, `any`\> = `{}`

#### Returns

[`IoColorSliderB`](IoColorSliderB.md)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`constructor`](IoColorSliderBase.md#constructors)

## Properties

### \_active

> **\_active**: `number` = `-1`

Defined in: [src/elements/sliders/io-slider-base.ts:65](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L65)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_active`](IoColorSliderBase.md#_active)

***

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

Defined in: [src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_bindings`](IoColorSliderBase.md#_bindings)

***

### \_canvas

> **\_canvas**: `HTMLCanvasElement`

Defined in: [src/core/gl.ts:78](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L78)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_canvas`](IoColorSliderBase.md#_canvas)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

Defined in: [src/core/node.ts:45](https://github.com/io-gui/io/blob/main/src/core/node.ts#L45)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_changeQueue`](IoColorSliderBase.md#_changequeue)

***

### \_ctx

> **\_ctx**: `CanvasRenderingContext2D`

Defined in: [src/core/gl.ts:79](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L79)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_ctx`](IoColorSliderBase.md#_ctx)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

Defined in: [src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_eventDispatcher`](IoColorSliderBase.md#_eventdispatcher)

***

### \_needsResize

> **\_needsResize**: `boolean` = `false`

Defined in: [src/core/gl.ts:77](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L77)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_needsResize`](IoColorSliderBase.md#_needsresize)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

Defined in: [src/core/node.ts:43](https://github.com/io-gui/io/blob/main/src/core/node.ts#L43)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_properties`](IoColorSliderBase.md#_properties)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

Defined in: [src/core/node.ts:42](https://github.com/io-gui/io/blob/main/src/core/node.ts#L42)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_protochain`](IoColorSliderBase.md#_protochain)

***

### \_rect

> **\_rect**: `null` \| `DOMRect` = `null`

Defined in: [src/elements/sliders/io-slider-base.ts:66](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L66)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_rect`](IoColorSliderBase.md#_rect)

***

### \_startX

> **\_startX**: `number` = `0`

Defined in: [src/elements/sliders/io-slider-base.ts:63](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L63)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_startX`](IoColorSliderBase.md#_startx)

***

### \_startY

> **\_startY**: `number` = `0`

Defined in: [src/elements/sliders/io-slider-base.ts:64](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L64)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_startY`](IoColorSliderBase.md#_starty)

***

### $

> **$**: `Record`\<`string`, `any`\>

Defined in: [src/core/element.ts:179](https://github.com/io-gui/io/blob/main/src/core/element.ts#L179)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`$`](IoColorSliderBase.md#$)

***

### class

> **class**: `string`

Defined in: [src/core/element.ts:188](https://github.com/io-gui/io/blob/main/src/core/element.ts#L188)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`class`](IoColorSliderBase.md#class)

***

### color

> **color**: \[`number`, `number`, `number`, `number`\]

Defined in: [src/core/gl.ts:69](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L69)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`color`](IoColorSliderBase.md#color)

***

### contenteditable

> **contenteditable**: `boolean`

Defined in: [src/core/element.ts:185](https://github.com/io-gui/io/blob/main/src/core/element.ts#L185)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`contenteditable`](IoColorSliderBase.md#contenteditable)

***

### disabled

> **disabled**: `boolean`

Defined in: [src/core/element.ts:209](https://github.com/io-gui/io/blob/main/src/core/element.ts#L209)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`disabled`](IoColorSliderBase.md#disabled)

***

### exponent

> **exponent**: `number`

Defined in: [src/elements/sliders/io-slider-base.ts:46](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L46)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`exponent`](IoColorSliderBase.md#exponent)

***

### hidden

> **hidden**: `boolean`

Defined in: [src/core/element.ts:206](https://github.com/io-gui/io/blob/main/src/core/element.ts#L206)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`hidden`](IoColorSliderBase.md#hidden)

***

### id

> **id**: `string`

Defined in: [src/core/element.ts:203](https://github.com/io-gui/io/blob/main/src/core/element.ts#L203)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`id`](IoColorSliderBase.md#id)

***

### label

> **label**: `string`

Defined in: [src/core/element.ts:194](https://github.com/io-gui/io/blob/main/src/core/element.ts#L194)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`label`](IoColorSliderBase.md#label)

***

### lazy

> **lazy**: `boolean`

Defined in: [src/elements/sliders/io-slider-base.ts:61](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L61)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`lazy`](IoColorSliderBase.md#lazy)

***

### max

> **max**: `number`

Defined in: [src/elements/sliders/io-slider.ts:26](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider.ts#L26)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`max`](IoColorSliderBase.md#max)

***

### min

> **min**: `number`

Defined in: [src/elements/sliders/io-slider.ts:23](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider.ts#L23)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`min`](IoColorSliderBase.md#min)

***

### name

> **name**: `string`

Defined in: [src/core/element.ts:197](https://github.com/io-gui/io/blob/main/src/core/element.ts#L197)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`name`](IoColorSliderBase.md#name)

***

### noscroll

> **noscroll**: `boolean`

Defined in: [src/elements/sliders/io-slider-base.ts:52](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L52)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`noscroll`](IoColorSliderBase.md#noscroll)

***

### pxRatio

> **pxRatio**: `number`

Defined in: [src/core/gl.ts:72](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L72)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`pxRatio`](IoColorSliderBase.md#pxratio)

***

### role

> **role**: `string`

Defined in: [src/elements/sliders/io-slider-base.ts:55](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L55)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`role`](IoColorSliderBase.md#role)

***

### size

> **size**: \[`number`, `number`\]

Defined in: [src/core/gl.ts:66](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L66)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`size`](IoColorSliderBase.md#size)

***

### step

> **step**: `number`

Defined in: [src/elements/sliders/io-slider.ts:20](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider.ts#L20)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`step`](IoColorSliderBase.md#step)

***

### tabindex

> **tabindex**: `string`

Defined in: [src/elements/sliders/io-slider-base.ts:58](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L58)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`tabindex`](IoColorSliderBase.md#tabindex)

***

### theme

> **theme**: `IoTheme`

Defined in: [src/core/gl.ts:75](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L75)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`theme`](IoColorSliderBase.md#theme)

***

### title

> **title**: `string`

Defined in: [src/core/element.ts:200](https://github.com/io-gui/io/blob/main/src/core/element.ts#L200)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`title`](IoColorSliderBase.md#title)

***

### value

> **value**: `number`

Defined in: [src/elements/sliders/io-slider.ts:17](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider.ts#L17)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`value`](IoColorSliderBase.md#value)

***

### vertical

> **vertical**: `boolean`

Defined in: [src/elements/sliders/io-slider-base.ts:49](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L49)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`vertical`](IoColorSliderBase.md#vertical)

## Accessors

### \_max

#### Get Signature

> **get** **\_max**(): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:79](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L79)

##### Returns

\[`number`, `number`\]

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_max`](IoColorSliderBase.md#_max)

***

### \_min

#### Get Signature

> **get** **\_min**(): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:68](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L68)

##### Returns

\[`number`, `number`\]

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_min`](IoColorSliderBase.md#_min)

***

### \_step

#### Get Signature

> **get** **\_step**(): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:90](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L90)

##### Returns

\[`number`, `number`\]

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_step`](IoColorSliderBase.md#_step)

***

### \_value

#### Get Signature

> **get** **\_value**(): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:101](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L101)

##### Returns

\[`number`, `number`\]

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_value`](IoColorSliderBase.md#_value)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`textNode`](IoColorSliderBase.md#textnode)

***

### Frag

#### Get Signature

> **get** `static` **Frag**(): `string`

Defined in: [src/elements/color/io-color-sliders.ts:225](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L225)

##### Returns

`string`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`Frag`](IoColorSliderBase.md#frag)

***

### GlUtils

#### Get Signature

> **get** `static` **GlUtils**(): `string`

Defined in: [src/elements/color/io-color-sliders.ts:343](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L343)

##### Returns

`string`

#### Overrides

[`IoColorSliderBase`](IoColorSliderBase.md).[`GlUtils`](IoColorSliderBase.md#glutils)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`Listeners`](IoColorSliderBase.md#listeners)

***

### Properties

#### Get Signature

> **get** `static` **Properties**(): [`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

Defined in: [src/core/node.ts:33](https://github.com/io-gui/io/blob/main/src/core/node.ts#L33)

##### Returns

[`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`Properties`](IoColorSliderBase.md#properties-1)

***

### Style

#### Get Signature

> **get** `static` **Style**(): `string`

Defined in: [src/elements/sliders/io-slider-base.ts:9](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L9)

##### Returns

`string`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`Style`](IoColorSliderBase.md#style)

***

### Vert

#### Get Signature

> **get** `static` **Vert**(): `string`

Defined in: [src/core/gl.ts:81](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L81)

##### Returns

`string`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`Vert`](IoColorSliderBase.md#vert)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`_flattenTextNode`](IoColorSliderBase.md#_flattentextnode)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`_getPointerCoord`](IoColorSliderBase.md#_getpointercoord)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`_getValueFromCoord`](IoColorSliderBase.md#_getvaluefromcoord)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`_inputValue`](IoColorSliderBase.md#_inputvalue)

***

### \_onBlur()

> **\_onBlur**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:124](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L124)

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_onBlur`](IoColorSliderBase.md#_onblur)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`_onContextmenu`](IoColorSliderBase.md#_oncontextmenu)

***

### \_onFocus()

> **\_onFocus**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:120](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L120)

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_onFocus`](IoColorSliderBase.md#_onfocus)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`_onKeydown`](IoColorSliderBase.md#_onkeydown)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`_onPointerdown`](IoColorSliderBase.md#_onpointerdown)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`_onPointermove`](IoColorSliderBase.md#_onpointermove)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`_onPointermoveThrottled`](IoColorSliderBase.md#_onpointermovethrottled)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`_onPointerup`](IoColorSliderBase.md#_onpointerup)

***

### \_onRender()

> **\_onRender**(): `void`

Defined in: [src/core/gl.ts:357](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L357)

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_onRender`](IoColorSliderBase.md#_onrender)

***

### \_onTouchend()

> **\_onTouchend**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:157](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L157)

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_onTouchend`](IoColorSliderBase.md#_ontouchend)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`_onTouchmove`](IoColorSliderBase.md#_ontouchmove)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`_onTouchstart`](IoColorSliderBase.md#_ontouchstart)

***

### \_setDecrease()

> **\_setDecrease**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:276](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L276)

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_setDecrease`](IoColorSliderBase.md#_setdecrease)

***

### \_setDown()

> **\_setDown**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:297](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L297)

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_setDown`](IoColorSliderBase.md#_setdown)

***

### \_setIncrease()

> **\_setIncrease**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:269](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L269)

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_setIncrease`](IoColorSliderBase.md#_setincrease)

***

### \_setLeft()

> **\_setLeft**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:303](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L303)

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_setLeft`](IoColorSliderBase.md#_setleft)

***

### \_setMax()

> **\_setMax**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:287](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L287)

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_setMax`](IoColorSliderBase.md#_setmax)

***

### \_setMin()

> **\_setMin**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:283](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L283)

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_setMin`](IoColorSliderBase.md#_setmin)

***

### \_setRight()

> **\_setRight**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:309](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L309)

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_setRight`](IoColorSliderBase.md#_setright)

***

### \_setUp()

> **\_setUp**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:291](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L291)

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`_setUp`](IoColorSliderBase.md#_setup)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`addEventListener`](IoColorSliderBase.md#addeventlistener)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`applyProperties`](IoColorSliderBase.md#applyproperties)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`bind`](IoColorSliderBase.md#bind)

***

### changed()

> **changed**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:318](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L318)

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`changed`](IoColorSliderBase.md#changed)

***

### connectedCallback()

> **connectedCallback**(): `void`

Defined in: [src/core/element.ts:214](https://github.com/io-gui/io/blob/main/src/core/element.ts#L214)

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`connectedCallback`](IoColorSliderBase.md#connectedcallback)

***

### disabledChanged()

> **disabledChanged**(): `void`

Defined in: [src/core/element.ts:430](https://github.com/io-gui/io/blob/main/src/core/element.ts#L430)

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`disabledChanged`](IoColorSliderBase.md#disabledchanged)

***

### disconnectedCallback()

> **disconnectedCallback**(): `void`

Defined in: [src/core/element.ts:222](https://github.com/io-gui/io/blob/main/src/core/element.ts#L222)

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`disconnectedCallback`](IoColorSliderBase.md#disconnectedcallback)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`dispatchEvent`](IoColorSliderBase.md#dispatchevent)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`dispatchMutationEvent`](IoColorSliderBase.md#dispatchmutationevent)

***

### dispatchQueue()

> **dispatchQueue**(): `void`

Defined in: [src/core/node.ts:249](https://github.com/io-gui/io/blob/main/src/core/node.ts#L249)

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`dispatchQueue`](IoColorSliderBase.md#dispatchqueue)

***

### dispatchQueueSync()

> **dispatchQueueSync**(): `void`

Defined in: [src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`dispatchQueueSync`](IoColorSliderBase.md#dispatchqueuesync)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/core/node.ts:381](https://github.com/io-gui/io/blob/main/src/core/node.ts#L381)

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`dispose`](IoColorSliderBase.md#dispose)

***

### init()

> **init**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:315](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L315)

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`init`](IoColorSliderBase.md#init)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`initPropertyUniform`](IoColorSliderBase.md#initpropertyuniform)

***

### initShader()

> **initShader**(): `WebGLProgram`

Defined in: [src/core/gl.ts:222](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L222)

#### Returns

`WebGLProgram`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`initShader`](IoColorSliderBase.md#initshader)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`inputValue`](IoColorSliderBase.md#inputvalue)

***

### labelChanged()

> **labelChanged**(): `void`

Defined in: [src/core/element.ts:423](https://github.com/io-gui/io/blob/main/src/core/element.ts#L423)

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`labelChanged`](IoColorSliderBase.md#labelchanged)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`objectMutated`](IoColorSliderBase.md#objectmutated)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`onObjectMutated`](IoColorSliderBase.md#onobjectmutated)

***

### onResized()

> **onResized**(): `void`

Defined in: [src/core/gl.ts:316](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L316)

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`onResized`](IoColorSliderBase.md#onresized)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`queue`](IoColorSliderBase.md#queue)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`Register`](IoColorSliderBase.md#register)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`removeEventListener`](IoColorSliderBase.md#removeeventlistener)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`setAttribute`](IoColorSliderBase.md#setattribute)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`setProperties`](IoColorSliderBase.md#setproperties)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`setProperty`](IoColorSliderBase.md#setproperty)

***

### setShaderProgram()

> **setShaderProgram**(): `void`

Defined in: [src/core/gl.ts:392](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L392)

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`setShaderProgram`](IoColorSliderBase.md#setshaderprogram)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`setUniform`](IoColorSliderBase.md#setuniform)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`template`](IoColorSliderBase.md#template)

***

### themeMutated()

> **themeMutated**(): `void`

Defined in: [src/core/gl.ts:342](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L342)

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`themeMutated`](IoColorSliderBase.md#thememutated)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`throttle`](IoColorSliderBase.md#throttle)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`traverse`](IoColorSliderBase.md#traverse)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`unbind`](IoColorSliderBase.md#unbind)

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

[`IoColorSliderBase`](IoColorSliderBase.md).[`updatePropertyUniform`](IoColorSliderBase.md#updatepropertyuniform)

***

### updateThemeUniforms()

> **updateThemeUniforms**(): `void`

Defined in: [src/core/gl.ts:404](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L404)

#### Returns

`void`

#### Inherited from

[`IoColorSliderBase`](IoColorSliderBase.md).[`updateThemeUniforms`](IoColorSliderBase.md#updatethemeuniforms)
