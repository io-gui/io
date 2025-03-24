[**io-gui**](../README.md)

***

# Class: IoSliderBase

Defined in: [src/elements/sliders/io-slider-base.ts:8](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L8)

Core `IoElement` class.

## Extends

- [`IoGl`](IoGl.md)

## Extended by

- [`IoSlider2d`](IoSlider2d.md)
- [`IoSliderRange`](IoSliderRange.md)
- [`IoSlider`](IoSlider.md)

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### new IoSliderBase()

> **new IoSliderBase**(`properties`): [`IoSliderBase`](IoSliderBase.md)

Defined in: [src/core/gl.ts:171](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L171)

#### Parameters

##### properties

`Record`\<`string`, `any`\> = `{}`

#### Returns

[`IoSliderBase`](IoSliderBase.md)

#### Inherited from

[`IoGl`](IoGl.md).[`constructor`](IoGl.md#constructors)

## Properties

### \_active

> **\_active**: `number` = `-1`

Defined in: [src/elements/sliders/io-slider-base.ts:62](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L62)

***

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

Defined in: [src/core/node.ts:45](https://github.com/io-gui/io/blob/main/src/core/node.ts#L45)

#### Inherited from

[`IoGl`](IoGl.md).[`_bindings`](IoGl.md#_bindings)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

Defined in: [src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

#### Inherited from

[`IoGl`](IoGl.md).[`_changeQueue`](IoGl.md#_changequeue)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

Defined in: [src/core/node.ts:47](https://github.com/io-gui/io/blob/main/src/core/node.ts#L47)

#### Inherited from

[`IoGl`](IoGl.md).[`_eventDispatcher`](IoGl.md#_eventdispatcher)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

Defined in: [src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

#### Inherited from

[`IoGl`](IoGl.md).[`_properties`](IoGl.md#_properties)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

Defined in: [src/core/node.ts:43](https://github.com/io-gui/io/blob/main/src/core/node.ts#L43)

#### Inherited from

[`IoGl`](IoGl.md).[`_protochain`](IoGl.md#_protochain)

***

### \_rect

> **\_rect**: `null` \| `DOMRect` = `null`

Defined in: [src/elements/sliders/io-slider-base.ts:63](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L63)

***

### \_startX

> **\_startX**: `number` = `0`

Defined in: [src/elements/sliders/io-slider-base.ts:60](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L60)

***

### \_startY

> **\_startY**: `number` = `0`

Defined in: [src/elements/sliders/io-slider-base.ts:61](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L61)

***

### $

> **$**: `Record`\<`string`, `any`\>

Defined in: [src/core/element.ts:181](https://github.com/io-gui/io/blob/main/src/core/element.ts#L181)

#### Inherited from

[`IoGl`](IoGl.md).[`$`](IoGl.md#$)

***

### canvas

> **canvas**: `HTMLCanvasElement`

Defined in: [src/core/gl.ts:73](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L73)

#### Inherited from

[`IoGl`](IoGl.md).[`canvas`](IoGl.md#canvas)

***

### class

> **class**: `string`

Defined in: [src/core/element.ts:190](https://github.com/io-gui/io/blob/main/src/core/element.ts#L190)

#### Inherited from

[`IoGl`](IoGl.md).[`class`](IoGl.md#class)

***

### color

> **color**: \[`number`, `number`, `number`, `number`\]

Defined in: [src/core/gl.ts:61](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L61)

#### Inherited from

[`IoGl`](IoGl.md).[`color`](IoGl.md#color)

***

### contenteditable

> **contenteditable**: `boolean`

Defined in: [src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

#### Inherited from

[`IoGl`](IoGl.md).[`contenteditable`](IoGl.md#contenteditable)

***

### ctx

> **ctx**: `CanvasRenderingContext2D`

Defined in: [src/core/gl.ts:74](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L74)

#### Inherited from

[`IoGl`](IoGl.md).[`ctx`](IoGl.md#ctx)

***

### disabled

> **disabled**: `boolean`

Defined in: [src/core/element.ts:211](https://github.com/io-gui/io/blob/main/src/core/element.ts#L211)

#### Inherited from

[`IoGl`](IoGl.md).[`disabled`](IoGl.md#disabled)

***

### exponent

> **exponent**: `number`

Defined in: [src/elements/sliders/io-slider-base.ts:46](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L46)

***

### hidden

> **hidden**: `boolean`

Defined in: [src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

#### Inherited from

[`IoGl`](IoGl.md).[`hidden`](IoGl.md#hidden)

***

### id

> **id**: `string`

Defined in: [src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

#### Inherited from

[`IoGl`](IoGl.md).[`id`](IoGl.md#id)

***

### label

> **label**: `string`

Defined in: [src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

#### Inherited from

[`IoGl`](IoGl.md).[`label`](IoGl.md#label)

***

### max

> **max**: `number` \| \[`number`, `number`\] \| \{ `x`: `number`; `y`: `number`; \}

Defined in: [src/elements/sliders/io-slider-base.ts:43](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L43)

***

### min

> **min**: `number` \| \[`number`, `number`\] \| \{ `x`: `number`; `y`: `number`; \}

Defined in: [src/elements/sliders/io-slider-base.ts:40](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L40)

***

### name

> **name**: `string`

Defined in: [src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

#### Inherited from

[`IoGl`](IoGl.md).[`name`](IoGl.md#name)

***

### needsResize

> **needsResize**: `boolean` = `false`

Defined in: [src/core/gl.ts:72](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L72)

#### Inherited from

[`IoGl`](IoGl.md).[`needsResize`](IoGl.md#needsresize)

***

### noscroll

> **noscroll**: `boolean`

Defined in: [src/elements/sliders/io-slider-base.ts:52](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L52)

***

### pxRatio

> **pxRatio**: `number`

Defined in: [src/core/gl.ts:64](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L64)

#### Inherited from

[`IoGl`](IoGl.md).[`pxRatio`](IoGl.md#pxratio)

***

### reactivity

> **reactivity**: `string`

Defined in: [src/core/gl.ts:70](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L70)

#### Inherited from

[`IoGl`](IoGl.md).[`reactivity`](IoGl.md#reactivity)

***

### role

> **role**: `string`

Defined in: [src/elements/sliders/io-slider-base.ts:55](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L55)

#### Overrides

[`IoGl`](IoGl.md).[`role`](IoGl.md#role)

***

### size

> **size**: \[`number`, `number`\]

Defined in: [src/core/gl.ts:58](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L58)

#### Inherited from

[`IoGl`](IoGl.md).[`size`](IoGl.md#size)

***

### step

> **step**: `number` \| \[`number`, `number`\] \| \{ `x`: `number`; `y`: `number`; \}

Defined in: [src/elements/sliders/io-slider-base.ts:37](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L37)

***

### tabindex

> **tabindex**: `string`

Defined in: [src/elements/sliders/io-slider-base.ts:58](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L58)

#### Overrides

[`IoGl`](IoGl.md).[`tabindex`](IoGl.md#tabindex)

***

### theme

> **theme**: `IoTheme`

Defined in: [src/core/gl.ts:67](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L67)

#### Inherited from

[`IoGl`](IoGl.md).[`theme`](IoGl.md#theme)

***

### title

> **title**: `string`

Defined in: [src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

#### Inherited from

[`IoGl`](IoGl.md).[`title`](IoGl.md#title)

***

### transparent

> **transparent**: `boolean`

Defined in: [src/core/gl.ts:55](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L55)

#### Inherited from

[`IoGl`](IoGl.md).[`transparent`](IoGl.md#transparent)

***

### value

> **value**: `number` \| \[`number`, `number`\] \| \{ `x`: `number`; `y`: `number`; \}

Defined in: [src/elements/sliders/io-slider-base.ts:34](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L34)

***

### vertical

> **vertical**: `boolean`

Defined in: [src/elements/sliders/io-slider-base.ts:49](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L49)

## Accessors

### \_max

#### Get Signature

> **get** **\_max**(): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:76](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L76)

##### Returns

\[`number`, `number`\]

***

### \_min

#### Get Signature

> **get** **\_min**(): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:65](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L65)

##### Returns

\[`number`, `number`\]

***

### \_step

#### Get Signature

> **get** **\_step**(): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:87](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L87)

##### Returns

\[`number`, `number`\]

***

### \_value

#### Get Signature

> **get** **\_value**(): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:98](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L98)

##### Returns

\[`number`, `number`\]

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

[`IoGl`](IoGl.md).[`textNode`](IoGl.md#textnode)

***

### Frag

#### Get Signature

> **get** `static` **Frag**(): `string`

Defined in: [src/core/gl.ts:104](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L104)

##### Returns

`string`

#### Inherited from

[`IoGl`](IoGl.md).[`Frag`](IoGl.md#frag)

***

### GlUtils

#### Get Signature

> **get** `static` **GlUtils**(): `string`

Defined in: [src/core/gl.ts:87](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L87)

##### Returns

`string`

#### Inherited from

[`IoGl`](IoGl.md).[`GlUtils`](IoGl.md#glutils)

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

***

### Properties

#### Get Signature

> **get** `static` **Properties**(): [`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

Defined in: [src/core/node.ts:35](https://github.com/io-gui/io/blob/main/src/core/node.ts#L35)

##### Returns

[`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

#### Inherited from

[`IoGl`](IoGl.md).[`Properties`](IoGl.md#properties-1)

***

### Style

#### Get Signature

> **get** `static` **Style**(): `string`

Defined in: [src/elements/sliders/io-slider-base.ts:9](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L9)

##### Returns

`string`

#### Overrides

[`IoGl`](IoGl.md).[`Style`](IoGl.md#style)

***

### Vert

#### Get Signature

> **get** `static` **Vert**(): `string`

Defined in: [src/core/gl.ts:76](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L76)

##### Returns

`string`

#### Inherited from

[`IoGl`](IoGl.md).[`Vert`](IoGl.md#vert)

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

[`IoGl`](IoGl.md).[`_flattenTextNode`](IoGl.md#_flattentextnode)

***

### \_getPointerCoord()

> **\_getPointerCoord**(`event`): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:176](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L176)

#### Parameters

##### event

`PointerEvent`

#### Returns

\[`number`, `number`\]

***

### \_getValueFromCoord()

> **\_getValueFromCoord**(`coord`): \[`number`, `number`\]

Defined in: [src/elements/sliders/io-slider-base.ts:184](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L184)

#### Parameters

##### coord

\[`number`, `number`\]

#### Returns

\[`number`, `number`\]

***

### \_inputValue()

> **\_inputValue**(`value`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:200](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L200)

#### Parameters

##### value

\[`number`, `number`\]

#### Returns

`void`

***

### \_onBlur()

> **\_onBlur**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:121](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L121)

#### Returns

`void`

***

### \_onContextmenu()

> **\_onContextmenu**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:125](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L125)

#### Parameters

##### event

`Event`

#### Returns

`void`

***

### \_onFocus()

> **\_onFocus**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:117](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L117)

#### Returns

`void`

***

### \_onKeydown()

> **\_onKeydown**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:227](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L227)

#### Parameters

##### event

`KeyboardEvent`

#### Returns

`void`

***

### \_onPointerdown()

> **\_onPointerdown**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:158](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L158)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

***

### \_onPointermove()

> **\_onPointermove**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:165](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L165)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

***

### \_onPointermoveThrottled()

> **\_onPointermoveThrottled**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:192](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L192)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

***

### \_onPointerup()

> **\_onPointerup**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:169](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L169)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

***

### \_onRender()

> **\_onRender**(): `void`

Defined in: [src/core/gl.ts:248](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L248)

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`_onRender`](IoGl.md#_onrender)

***

### \_onTouchend()

> **\_onTouchend**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:154](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L154)

#### Returns

`void`

***

### \_onTouchmove()

> **\_onTouchmove**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:136](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L136)

#### Parameters

##### event

`TouchEvent`

#### Returns

`void`

***

### \_onTouchstart()

> **\_onTouchstart**(`event`): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:128](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L128)

#### Parameters

##### event

`TouchEvent`

#### Returns

`void`

***

### \_setDecrease()

> **\_setDecrease**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:273](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L273)

#### Returns

`void`

***

### \_setDown()

> **\_setDown**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:294](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L294)

#### Returns

`void`

***

### \_setIncrease()

> **\_setIncrease**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:266](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L266)

#### Returns

`void`

***

### \_setLeft()

> **\_setLeft**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:300](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L300)

#### Returns

`void`

***

### \_setMax()

> **\_setMax**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:284](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L284)

#### Returns

`void`

***

### \_setMin()

> **\_setMin**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:280](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L280)

#### Returns

`void`

***

### \_setRight()

> **\_setRight**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:306](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L306)

#### Returns

`void`

***

### \_setUp()

> **\_setUp**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:288](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L288)

#### Returns

`void`

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

[`IoGl`](IoGl.md).[`addEventListener`](IoGl.md#addeventlistener)

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

[`IoGl`](IoGl.md).[`applyProperties`](IoGl.md#applyproperties)

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

[`IoGl`](IoGl.md).[`bind`](IoGl.md#bind)

***

### changed()

> **changed**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:315](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L315)

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

[`IoGl`](IoGl.md).[`changed`](IoGl.md#changed)

***

### connectedCallback()

> **connectedCallback**(): `void`

Defined in: [src/core/element.ts:229](https://github.com/io-gui/io/blob/main/src/core/element.ts#L229)

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`connectedCallback`](IoGl.md#connectedcallback)

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

[`IoGl`](IoGl.md).[`debounce`](IoGl.md#debounce)

***

### disabledChanged()

> **disabledChanged**(): `void`

Defined in: [src/core/element.ts:451](https://github.com/io-gui/io/blob/main/src/core/element.ts#L451)

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`disabledChanged`](IoGl.md#disabledchanged)

***

### disconnectedCallback()

> **disconnectedCallback**(): `void`

Defined in: [src/core/element.ts:237](https://github.com/io-gui/io/blob/main/src/core/element.ts#L237)

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`disconnectedCallback`](IoGl.md#disconnectedcallback)

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

[`IoGl`](IoGl.md).[`dispatchEvent`](IoGl.md#dispatchevent)

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

[`IoGl`](IoGl.md).[`dispatchQueue`](IoGl.md#dispatchqueue)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/core/node.ts:369](https://github.com/io-gui/io/blob/main/src/core/node.ts#L369)

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`dispose`](IoGl.md#dispose)

***

### init()

> **init**(): `void`

Defined in: [src/elements/sliders/io-slider-base.ts:312](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L312)

#### Returns

`void`

#### Overrides

[`IoGl`](IoGl.md).[`init`](IoGl.md#init)

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

[`IoGl`](IoGl.md).[`initPropertyUniform`](IoGl.md#initpropertyuniform)

***

### initShader()

> **initShader**(): `WebGLProgram`

Defined in: [src/core/gl.ts:127](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L127)

#### Returns

`WebGLProgram`

#### Inherited from

[`IoGl`](IoGl.md).[`initShader`](IoGl.md#initshader)

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

[`IoGl`](IoGl.md).[`inputValue`](IoGl.md#inputvalue)

***

### labelChanged()

> **labelChanged**(): `void`

Defined in: [src/core/element.ts:444](https://github.com/io-gui/io/blob/main/src/core/element.ts#L444)

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`labelChanged`](IoGl.md#labelchanged)

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

[`IoGl`](IoGl.md).[`onPropertyMutated`](IoGl.md#onpropertymutated)

***

### onResized()

> **onResized**(): `void`

Defined in: [src/core/gl.ts:215](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L215)

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`onResized`](IoGl.md#onresized)

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

[`IoGl`](IoGl.md).[`queue`](IoGl.md#queue)

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

[`IoGl`](IoGl.md).[`Register`](IoGl.md#register)

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

[`IoGl`](IoGl.md).[`removeEventListener`](IoGl.md#removeeventlistener)

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

[`IoGl`](IoGl.md).[`setAttribute`](IoGl.md#setattribute)

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

[`IoGl`](IoGl.md).[`setProperties`](IoGl.md#setproperties)

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

[`IoGl`](IoGl.md).[`setProperty`](IoGl.md#setproperty)

***

### setShaderProgram()

> **setShaderProgram**(): `void`

Defined in: [src/core/gl.ts:282](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L282)

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`setShaderProgram`](IoGl.md#setshaderprogram)

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

[`IoGl`](IoGl.md).[`setUniform`](IoGl.md#setuniform)

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

[`IoGl`](IoGl.md).[`template`](IoGl.md#template)

***

### themeMutated()

> **themeMutated**(): `void`

Defined in: [src/core/gl.ts:241](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L241)

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`themeMutated`](IoGl.md#thememutated)

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

[`IoGl`](IoGl.md).[`throttle`](IoGl.md#throttle)

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

[`IoGl`](IoGl.md).[`traverse`](IoGl.md#traverse)

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

[`IoGl`](IoGl.md).[`unbind`](IoGl.md#unbind)

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

[`IoGl`](IoGl.md).[`updatePropertyUniform`](IoGl.md#updatepropertyuniform)

***

### updateThemeUniforms()

> **updateThemeUniforms**(): `void`

Defined in: [src/core/gl.ts:292](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L292)

#### Returns

`void`

#### Inherited from

[`IoGl`](IoGl.md).[`updateThemeUniforms`](IoGl.md#updatethemeuniforms)
