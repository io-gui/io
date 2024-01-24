[io-gui](../README.md) / IoColorSliderSL

# Class: IoColorSliderSL

A 2D slider gor "saturation" and "level" color channels.

## Hierarchy

- [`IoColorSlider2dBase`](IoColorSlider2dBase.md)

  ↳ **`IoColorSliderSL`**

## Table of contents

### Constructors

- [constructor](IoColorSliderSL.md#constructor)

### Properties

- [$](IoColorSliderSL.md#$)
- [\_active](IoColorSliderSL.md#_active)
- [\_bindings](IoColorSliderSL.md#_bindings)
- [\_changeQueue](IoColorSliderSL.md#_changequeue)
- [\_eventDispatcher](IoColorSliderSL.md#_eventdispatcher)
- [\_properties](IoColorSliderSL.md#_properties)
- [\_protochain](IoColorSliderSL.md#_protochain)
- [\_rect](IoColorSliderSL.md#_rect)
- [\_startX](IoColorSliderSL.md#_startx)
- [\_startY](IoColorSliderSL.md#_starty)
- [class](IoColorSliderSL.md#class)
- [color](IoColorSliderSL.md#color)
- [contenteditable](IoColorSliderSL.md#contenteditable)
- [disabled](IoColorSliderSL.md#disabled)
- [exponent](IoColorSliderSL.md#exponent)
- [hidden](IoColorSliderSL.md#hidden)
- [id](IoColorSliderSL.md#id)
- [label](IoColorSliderSL.md#label)
- [lazy](IoColorSliderSL.md#lazy)
- [max](IoColorSliderSL.md#max)
- [min](IoColorSliderSL.md#min)
- [name](IoColorSliderSL.md#name)
- [noscroll](IoColorSliderSL.md#noscroll)
- [pxRatio](IoColorSliderSL.md#pxratio)
- [role](IoColorSliderSL.md#role)
- [size](IoColorSliderSL.md#size)
- [step](IoColorSliderSL.md#step)
- [tabindex](IoColorSliderSL.md#tabindex)
- [theme](IoColorSliderSL.md#theme)
- [title](IoColorSliderSL.md#title)
- [value](IoColorSliderSL.md#value)
- [vertical](IoColorSliderSL.md#vertical)

### Accessors

- [\_max](IoColorSliderSL.md#_max)
- [\_min](IoColorSliderSL.md#_min)
- [\_step](IoColorSliderSL.md#_step)
- [\_value](IoColorSliderSL.md#_value)
- [textNode](IoColorSliderSL.md#textnode)
- [Frag](IoColorSliderSL.md#frag)
- [GlUtils](IoColorSliderSL.md#glutils)
- [Listeners](IoColorSliderSL.md#listeners)
- [Properties](IoColorSliderSL.md#properties)
- [Style](IoColorSliderSL.md#style)
- [Vert](IoColorSliderSL.md#vert)

### Methods

- [Register](IoColorSliderSL.md#register)
- [\_flattenTextNode](IoColorSliderSL.md#_flattentextnode)
- [\_getPointerCoord](IoColorSliderSL.md#_getpointercoord)
- [\_getValueFromCoord](IoColorSliderSL.md#_getvaluefromcoord)
- [\_inputValue](IoColorSliderSL.md#_inputvalue)
- [\_onBlur](IoColorSliderSL.md#_onblur)
- [\_onContextmenu](IoColorSliderSL.md#_oncontextmenu)
- [\_onFocus](IoColorSliderSL.md#_onfocus)
- [\_onKeydown](IoColorSliderSL.md#_onkeydown)
- [\_onPointerdown](IoColorSliderSL.md#_onpointerdown)
- [\_onPointermove](IoColorSliderSL.md#_onpointermove)
- [\_onPointermoveThrottled](IoColorSliderSL.md#_onpointermovethrottled)
- [\_onPointerup](IoColorSliderSL.md#_onpointerup)
- [\_onRender](IoColorSliderSL.md#_onrender)
- [\_onTouchend](IoColorSliderSL.md#_ontouchend)
- [\_onTouchmove](IoColorSliderSL.md#_ontouchmove)
- [\_onTouchstart](IoColorSliderSL.md#_ontouchstart)
- [\_setDecrease](IoColorSliderSL.md#_setdecrease)
- [\_setDown](IoColorSliderSL.md#_setdown)
- [\_setIncrease](IoColorSliderSL.md#_setincrease)
- [\_setLeft](IoColorSliderSL.md#_setleft)
- [\_setMax](IoColorSliderSL.md#_setmax)
- [\_setMin](IoColorSliderSL.md#_setmin)
- [\_setRight](IoColorSliderSL.md#_setright)
- [\_setUp](IoColorSliderSL.md#_setup)
- [addEventListener](IoColorSliderSL.md#addeventlistener)
- [applyProperties](IoColorSliderSL.md#applyproperties)
- [bind](IoColorSliderSL.md#bind)
- [changed](IoColorSliderSL.md#changed)
- [connectedCallback](IoColorSliderSL.md#connectedcallback)
- [disabledChanged](IoColorSliderSL.md#disabledchanged)
- [disconnectedCallback](IoColorSliderSL.md#disconnectedcallback)
- [dispatchEvent](IoColorSliderSL.md#dispatchevent)
- [dispatchMutationEvent](IoColorSliderSL.md#dispatchmutationevent)
- [dispatchQueue](IoColorSliderSL.md#dispatchqueue)
- [dispatchQueueSync](IoColorSliderSL.md#dispatchqueuesync)
- [dispose](IoColorSliderSL.md#dispose)
- [init](IoColorSliderSL.md#init)
- [initPropertyUniform](IoColorSliderSL.md#initpropertyuniform)
- [initShader](IoColorSliderSL.md#initshader)
- [inputValue](IoColorSliderSL.md#inputvalue)
- [labelChanged](IoColorSliderSL.md#labelchanged)
- [objectMutated](IoColorSliderSL.md#objectmutated)
- [onObjectMutated](IoColorSliderSL.md#onobjectmutated)
- [onResized](IoColorSliderSL.md#onresized)
- [queue](IoColorSliderSL.md#queue)
- [removeEventListener](IoColorSliderSL.md#removeeventlistener)
- [setAttribute](IoColorSliderSL.md#setattribute)
- [setProperties](IoColorSliderSL.md#setproperties)
- [setProperty](IoColorSliderSL.md#setproperty)
- [setShaderProgram](IoColorSliderSL.md#setshaderprogram)
- [setUniform](IoColorSliderSL.md#setuniform)
- [template](IoColorSliderSL.md#template)
- [themeMutated](IoColorSliderSL.md#thememutated)
- [throttle](IoColorSliderSL.md#throttle)
- [traverse](IoColorSliderSL.md#traverse)
- [unbind](IoColorSliderSL.md#unbind)
- [updatePropertyUniform](IoColorSliderSL.md#updatepropertyuniform)
- [updateThemeUniforms](IoColorSliderSL.md#updatethemeuniforms)

## Constructors

### constructor

• **new IoColorSliderSL**(`properties?`): [`IoColorSliderSL`](IoColorSliderSL.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | `Record`\<`string`, `any`\> |

#### Returns

[`IoColorSliderSL`](IoColorSliderSL.md)

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[constructor](IoColorSlider2dBase.md#constructor)

#### Defined in

[src/core/gl.ts:259](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L259)

## Properties

### $

• **$**: `Record`\<`string`, `any`\>

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[$](IoColorSlider2dBase.md#$)

#### Defined in

[src/core/element.ts:178](https://github.com/io-gui/io/blob/main/src/core/element.ts#L178)

___

### \_active

• **\_active**: `number` = `-1`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_active](IoColorSlider2dBase.md#_active)

#### Defined in

[src/elements/sliders/io-slider-base.ts:65](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L65)

___

### \_bindings

• `Readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_bindings](IoColorSlider2dBase.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_changeQueue](IoColorSlider2dBase.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_eventDispatcher](IoColorSlider2dBase.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

___

### \_properties

• `Readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_properties](IoColorSlider2dBase.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_protochain](IoColorSlider2dBase.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

___

### \_rect

• **\_rect**: ``null`` \| `DOMRect` = `null`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_rect](IoColorSlider2dBase.md#_rect)

#### Defined in

[src/elements/sliders/io-slider-base.ts:66](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L66)

___

### \_startX

• **\_startX**: `number` = `0`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_startX](IoColorSlider2dBase.md#_startx)

#### Defined in

[src/elements/sliders/io-slider-base.ts:63](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L63)

___

### \_startY

• **\_startY**: `number` = `0`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_startY](IoColorSlider2dBase.md#_starty)

#### Defined in

[src/elements/sliders/io-slider-base.ts:64](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L64)

___

### class

• **class**: `string`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[class](IoColorSlider2dBase.md#class)

#### Defined in

[src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

___

### color

• **color**: [`number`, `number`, `number`, `number`]

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[color](IoColorSlider2dBase.md#color)

#### Defined in

[src/core/gl.ts:69](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L69)

___

### contenteditable

• **contenteditable**: `boolean`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[contenteditable](IoColorSlider2dBase.md#contenteditable)

#### Defined in

[src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

___

### disabled

• **disabled**: `boolean`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[disabled](IoColorSlider2dBase.md#disabled)

#### Defined in

[src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

___

### exponent

• **exponent**: `number`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[exponent](IoColorSlider2dBase.md#exponent)

#### Defined in

[src/elements/sliders/io-slider-base.ts:46](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L46)

___

### hidden

• **hidden**: `boolean`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[hidden](IoColorSlider2dBase.md#hidden)

#### Defined in

[src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

___

### id

• **id**: `string`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[id](IoColorSlider2dBase.md#id)

#### Defined in

[src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

___

### label

• **label**: `string`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[label](IoColorSlider2dBase.md#label)

#### Defined in

[src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

___

### lazy

• **lazy**: `boolean`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[lazy](IoColorSlider2dBase.md#lazy)

#### Defined in

[src/elements/sliders/io-slider-base.ts:61](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L61)

___

### max

• **max**: [`number`, `number`]

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[max](IoColorSlider2dBase.md#max)

#### Defined in

[src/elements/sliders/io-slider-2d.ts:37](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L37)

___

### min

• **min**: [`number`, `number`]

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[min](IoColorSlider2dBase.md#min)

#### Defined in

[src/elements/sliders/io-slider-2d.ts:34](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L34)

___

### name

• **name**: `string`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[name](IoColorSlider2dBase.md#name)

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

___

### noscroll

• **noscroll**: `boolean`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[noscroll](IoColorSlider2dBase.md#noscroll)

#### Defined in

[src/elements/sliders/io-slider-2d.ts:40](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L40)

___

### pxRatio

• **pxRatio**: `number`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[pxRatio](IoColorSlider2dBase.md#pxratio)

#### Defined in

[src/core/gl.ts:72](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L72)

___

### role

• **role**: `string`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[role](IoColorSlider2dBase.md#role)

#### Defined in

[src/elements/sliders/io-slider-base.ts:55](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L55)

___

### size

• **size**: [`number`, `number`]

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[size](IoColorSlider2dBase.md#size)

#### Defined in

[src/core/gl.ts:66](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L66)

___

### step

• **step**: [`number`, `number`]

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[step](IoColorSlider2dBase.md#step)

#### Defined in

[src/elements/sliders/io-slider-2d.ts:31](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L31)

___

### tabindex

• **tabindex**: `string`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[tabindex](IoColorSlider2dBase.md#tabindex)

#### Defined in

[src/elements/sliders/io-slider-base.ts:58](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L58)

___

### theme

• **theme**: `IoTheme`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[theme](IoColorSlider2dBase.md#theme)

#### Defined in

[src/core/gl.ts:75](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L75)

___

### title

• **title**: `string`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[title](IoColorSlider2dBase.md#title)

#### Defined in

[src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

___

### value

• **value**: [`number`, `number`]

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[value](IoColorSlider2dBase.md#value)

#### Defined in

[src/elements/sliders/io-slider-2d.ts:28](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L28)

___

### vertical

• **vertical**: `boolean`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[vertical](IoColorSlider2dBase.md#vertical)

#### Defined in

[src/elements/sliders/io-slider-base.ts:49](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L49)

## Accessors

### \_max

• `get` **_max**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoColorSlider2dBase.\_max

#### Defined in

[src/elements/sliders/io-slider-base.ts:79](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L79)

___

### \_min

• `get` **_min**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoColorSlider2dBase.\_min

#### Defined in

[src/elements/sliders/io-slider-base.ts:68](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L68)

___

### \_step

• `get` **_step**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoColorSlider2dBase.\_step

#### Defined in

[src/elements/sliders/io-slider-base.ts:90](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L90)

___

### \_value

• `get` **_value**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoColorSlider2dBase.\_value

#### Defined in

[src/elements/sliders/io-slider-base.ts:101](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L101)

___

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoColorSlider2dBase.textNode

#### Defined in

[src/core/element.ts:392](https://github.com/io-gui/io/blob/main/src/core/element.ts#L392)

• `set` **textNode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

IoColorSlider2dBase.textNode

#### Defined in

[src/core/element.ts:396](https://github.com/io-gui/io/blob/main/src/core/element.ts#L396)

___

### Frag

• `get` **Frag**(): `string`

#### Returns

`string`

#### Inherited from

IoColorSlider2dBase.Frag

#### Defined in

[src/elements/color/io-color-sliders.ts:264](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L264)

___

### GlUtils

• `get` **GlUtils**(): `string`

#### Returns

`string`

#### Overrides

IoColorSlider2dBase.GlUtils

#### Defined in

[src/elements/color/io-color-sliders.ts:517](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L517)

___

### Listeners

• `get` **Listeners**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `contextmenu` | `string` |
| `focus` | `string` |
| `pointerdown` | `string` |
| `touchstart` | (`string` \| \{ `passive`: `boolean` = false })[] |

#### Inherited from

IoColorSlider2dBase.Listeners

#### Defined in

[src/elements/sliders/io-slider-base.ts:112](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L112)

___

### Properties

• `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoColorSlider2dBase.Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

___

### Style

• `get` **Style**(): `string`

#### Returns

`string`

#### Inherited from

IoColorSlider2dBase.Style

#### Defined in

[src/elements/sliders/io-slider-2d.ts:7](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L7)

___

### Vert

• `get` **Vert**(): `string`

#### Returns

`string`

#### Inherited from

IoColorSlider2dBase.Vert

#### Defined in

[src/core/gl.ts:81](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L81)

## Methods

### Register

▸ **Register**(`ioNodeConstructor`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ioNodeConstructor` | typeof [`IoNode`](IoNode.md) |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[Register](IoColorSlider2dBase.md#register)

#### Defined in

[src/core/element.ts:304](https://github.com/io-gui/io/blob/main/src/core/element.ts#L304)

___

### \_flattenTextNode

▸ **_flattenTextNode**(`element`): `void`

Helper function to flatten textContent into a single TextNode.
Update textContent via TextNode is better for layout performance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `element` | `HTMLElement` \| [`IoElement`](IoElement.md) | Element to flatten. |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_flattenTextNode](IoColorSlider2dBase.md#_flattentextnode)

#### Defined in

[src/core/element.ts:375](https://github.com/io-gui/io/blob/main/src/core/element.ts#L375)

___

### \_getPointerCoord

▸ **_getPointerCoord**(`event`): [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

[`number`, `number`]

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_getPointerCoord](IoColorSlider2dBase.md#_getpointercoord)

#### Defined in

[src/elements/sliders/io-slider-base.ts:179](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L179)

___

### \_getValueFromCoord

▸ **_getValueFromCoord**(`coord`): [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `coord` | [`number`, `number`] |

#### Returns

[`number`, `number`]

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_getValueFromCoord](IoColorSlider2dBase.md#_getvaluefromcoord)

#### Defined in

[src/elements/sliders/io-slider-base.ts:187](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L187)

___

### \_inputValue

▸ **_inputValue**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`number`, `number`] |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_inputValue](IoColorSlider2dBase.md#_inputvalue)

#### Defined in

[src/elements/sliders/io-slider-base.ts:203](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L203)

___

### \_onBlur

▸ **_onBlur**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_onBlur](IoColorSlider2dBase.md#_onblur)

#### Defined in

[src/elements/sliders/io-slider-base.ts:124](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L124)

___

### \_onContextmenu

▸ **_onContextmenu**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Event` |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_onContextmenu](IoColorSlider2dBase.md#_oncontextmenu)

#### Defined in

[src/elements/sliders/io-slider-base.ts:128](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L128)

___

### \_onFocus

▸ **_onFocus**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_onFocus](IoColorSlider2dBase.md#_onfocus)

#### Defined in

[src/elements/sliders/io-slider-base.ts:120](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L120)

___

### \_onKeydown

▸ **_onKeydown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `KeyboardEvent` |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_onKeydown](IoColorSlider2dBase.md#_onkeydown)

#### Defined in

[src/elements/sliders/io-slider-base.ts:230](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L230)

___

### \_onPointerdown

▸ **_onPointerdown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_onPointerdown](IoColorSlider2dBase.md#_onpointerdown)

#### Defined in

[src/elements/sliders/io-slider-base.ts:161](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L161)

___

### \_onPointermove

▸ **_onPointermove**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_onPointermove](IoColorSlider2dBase.md#_onpointermove)

#### Defined in

[src/elements/sliders/io-slider-base.ts:168](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L168)

___

### \_onPointermoveThrottled

▸ **_onPointermoveThrottled**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_onPointermoveThrottled](IoColorSlider2dBase.md#_onpointermovethrottled)

#### Defined in

[src/elements/sliders/io-slider-base.ts:195](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L195)

___

### \_onPointerup

▸ **_onPointerup**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_onPointerup](IoColorSlider2dBase.md#_onpointerup)

#### Defined in

[src/elements/sliders/io-slider-base.ts:172](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L172)

___

### \_onRender

▸ **_onRender**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_onRender](IoColorSlider2dBase.md#_onrender)

#### Defined in

[src/core/gl.ts:344](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L344)

___

### \_onTouchend

▸ **_onTouchend**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_onTouchend](IoColorSlider2dBase.md#_ontouchend)

#### Defined in

[src/elements/sliders/io-slider-base.ts:157](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L157)

___

### \_onTouchmove

▸ **_onTouchmove**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `TouchEvent` |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_onTouchmove](IoColorSlider2dBase.md#_ontouchmove)

#### Defined in

[src/elements/sliders/io-slider-base.ts:139](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L139)

___

### \_onTouchstart

▸ **_onTouchstart**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `TouchEvent` |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_onTouchstart](IoColorSlider2dBase.md#_ontouchstart)

#### Defined in

[src/elements/sliders/io-slider-base.ts:131](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L131)

___

### \_setDecrease

▸ **_setDecrease**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_setDecrease](IoColorSlider2dBase.md#_setdecrease)

#### Defined in

[src/elements/sliders/io-slider-base.ts:276](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L276)

___

### \_setDown

▸ **_setDown**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_setDown](IoColorSlider2dBase.md#_setdown)

#### Defined in

[src/elements/sliders/io-slider-base.ts:297](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L297)

___

### \_setIncrease

▸ **_setIncrease**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_setIncrease](IoColorSlider2dBase.md#_setincrease)

#### Defined in

[src/elements/sliders/io-slider-base.ts:269](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L269)

___

### \_setLeft

▸ **_setLeft**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_setLeft](IoColorSlider2dBase.md#_setleft)

#### Defined in

[src/elements/sliders/io-slider-base.ts:303](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L303)

___

### \_setMax

▸ **_setMax**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_setMax](IoColorSlider2dBase.md#_setmax)

#### Defined in

[src/elements/sliders/io-slider-base.ts:287](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L287)

___

### \_setMin

▸ **_setMin**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_setMin](IoColorSlider2dBase.md#_setmin)

#### Defined in

[src/elements/sliders/io-slider-base.ts:283](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L283)

___

### \_setRight

▸ **_setRight**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_setRight](IoColorSlider2dBase.md#_setright)

#### Defined in

[src/elements/sliders/io-slider-base.ts:309](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L309)

___

### \_setUp

▸ **_setUp**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[_setUp](IoColorSlider2dBase.md#_setup)

#### Defined in

[src/elements/sliders/io-slider-base.ts:291](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L291)

___

### addEventListener

▸ **addEventListener**(`type`, `listener`, `options?`): `void`

Wrapper for addEventListener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | listener name. |
| `listener` | [`AnyEventListener`](../README.md#anyeventlistener) | listener handler. |
| `options?` | `AddEventListenerOptions` | event listener options. |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[addEventListener](IoColorSlider2dBase.md#addeventlistener)

#### Defined in

[src/core/node.ts:352](https://github.com/io-gui/io/blob/main/src/core/node.ts#L352)

___

### applyProperties

▸ **applyProperties**(`props`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `any` |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[applyProperties](IoColorSlider2dBase.md#applyproperties)

#### Defined in

[src/core/element.ts:400](https://github.com/io-gui/io/blob/main/src/core/element.ts#L400)

___

### bind

▸ **bind**(`prop`): [`Binding`](Binding.md)

Returns a binding to a specified property`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prop` | `string` | Property to bind to. |

#### Returns

[`Binding`](Binding.md)

Binding object.

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[bind](IoColorSlider2dBase.md#bind)

#### Defined in

[src/core/node.ts:319](https://github.com/io-gui/io/blob/main/src/core/node.ts#L319)

___

### changed

▸ **changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[changed](IoColorSlider2dBase.md#changed)

#### Defined in

[src/elements/sliders/io-slider-base.ts:318](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L318)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[connectedCallback](IoColorSlider2dBase.md#connectedcallback)

#### Defined in

[src/core/element.ts:213](https://github.com/io-gui/io/blob/main/src/core/element.ts#L213)

___

### disabledChanged

▸ **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[disabledChanged](IoColorSlider2dBase.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[disconnectedCallback](IoColorSlider2dBase.md#disconnectedcallback)

#### Defined in

[src/core/element.ts:221](https://github.com/io-gui/io/blob/main/src/core/element.ts#L221)

___

### dispatchEvent

▸ **dispatchEvent**(`type`, `detail?`, `bubbles?`, `src?`): `void`

Wrapper for dispatchEvent.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `type` | `string` | `undefined` | event name to dispatch. |
| `detail` | `Object` | `{}` | event detail. |
| `bubbles` | `boolean` | `false` | event bubbles. |
| `src?` | `Node` \| `Document` \| `HTMLElement` \| `Window` | `undefined` | source node/element to dispatch event from. |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[dispatchEvent](IoColorSlider2dBase.md#dispatchevent)

#### Defined in

[src/core/node.ts:377](https://github.com/io-gui/io/blob/main/src/core/node.ts#L377)

___

### dispatchMutationEvent

▸ **dispatchMutationEvent**(`object`): `void`

Shorthand for dispatching `'object-mutated'` event on window.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `object` | `any` | object which mutated. |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[dispatchMutationEvent](IoColorSlider2dBase.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:384](https://github.com/io-gui/io/blob/main/src/core/node.ts#L384)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[dispatchQueue](IoColorSlider2dBase.md#dispatchqueue)

#### Defined in

[src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[dispatchQueueSync](IoColorSlider2dBase.md#dispatchqueuesync)

#### Defined in

[src/core/node.ts:269](https://github.com/io-gui/io/blob/main/src/core/node.ts#L269)

___

### dispose

▸ **dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[dispose](IoColorSlider2dBase.md#dispose)

#### Defined in

[src/core/node.ts:391](https://github.com/io-gui/io/blob/main/src/core/node.ts#L391)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[init](IoColorSlider2dBase.md#init)

#### Defined in

[src/elements/sliders/io-slider-base.ts:315](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L315)

___

### initPropertyUniform

▸ **initPropertyUniform**(`name`, `property`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `property` | [`PropertyDeclaration`](../README.md#propertydeclaration) |

#### Returns

`string`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[initPropertyUniform](IoColorSlider2dBase.md#initpropertyuniform)

#### Defined in

[src/core/gl.ts:191](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L191)

___

### initShader

▸ **initShader**(): `WebGLProgram`

#### Returns

`WebGLProgram`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[initShader](IoColorSlider2dBase.md#initshader)

#### Defined in

[src/core/gl.ts:209](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L209)

___

### inputValue

▸ **inputValue**(`value`): `void`

Sets value property and emits `value-input` event.
Use this when value property is set by user action (e.g. mouse click).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | Property value. |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[inputValue](IoColorSlider2dBase.md#inputvalue)

#### Defined in

[src/core/node.ts:234](https://github.com/io-gui/io/blob/main/src/core/node.ts#L234)

___

### labelChanged

▸ **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[labelChanged](IoColorSlider2dBase.md#labelchanged)

#### Defined in

[src/core/element.ts:422](https://github.com/io-gui/io/blob/main/src/core/element.ts#L422)

___

### objectMutated

▸ **objectMutated**(`prop`): `void`

This function is called after `onObjectMutated()` determines that one of
the object properties has mutated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prop` | `string` | Mutated object property name. |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[objectMutated](IoColorSlider2dBase.md#objectmutated)

#### Defined in

[src/core/node.ts:308](https://github.com/io-gui/io/blob/main/src/core/node.ts#L308)

___

### onObjectMutated

▸ **onObjectMutated**(`event`): `void`

Event handler for 'object-mutated' event emitted from the `window`.
Node should be listening for this event if it has an observed object property

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `CustomEvent`\<`any`\> | Event payload. |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[onObjectMutated](IoColorSlider2dBase.md#onobjectmutated)

#### Defined in

[src/core/node.ts:287](https://github.com/io-gui/io/blob/main/src/core/node.ts#L287)

___

### onResized

▸ **onResized**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[onResized](IoColorSlider2dBase.md#onresized)

#### Defined in

[src/core/gl.ts:303](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L303)

___

### queue

▸ **queue**(`prop`, `value`, `oldValue`): `void`

Adds property change to the queue.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prop` | `string` | Property name. |
| `value` | `any` | Property value. |
| `oldValue` | `any` | Old property value. |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[queue](IoColorSlider2dBase.md#queue)

#### Defined in

[src/core/node.ts:253](https://github.com/io-gui/io/blob/main/src/core/node.ts#L253)

___

### removeEventListener

▸ **removeEventListener**(`type`, `listener?`, `options?`): `void`

Wrapper for removeEventListener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | event name to listen to. |
| `listener?` | [`AnyEventListener`](../README.md#anyeventlistener) | listener handler. |
| `options?` | `AddEventListenerOptions` | event listener options. |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[removeEventListener](IoColorSlider2dBase.md#removeeventlistener)

#### Defined in

[src/core/node.ts:367](https://github.com/io-gui/io/blob/main/src/core/node.ts#L367)

___

### setAttribute

▸ **setAttribute**(`attr`, `value`): `void`

Alias for HTMLElement setAttribute where falsey values remove the attribute.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `attr` | `string` | Attribute name. |
| `value` | `string` \| `number` \| `boolean` | Attribute value. |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[setAttribute](IoColorSlider2dBase.md#setattribute)

#### Defined in

[src/core/element.ts:413](https://github.com/io-gui/io/blob/main/src/core/element.ts#L413)

___

### setProperties

▸ **setProperties**(`props`): `void`

Sets multiple properties in batch.
[property]-changed` events will be broadcast in the end.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `any` | Map of property names and values. |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[setProperties](IoColorSlider2dBase.md#setproperties)

#### Defined in

[src/core/node.ts:216](https://github.com/io-gui/io/blob/main/src/core/node.ts#L216)

___

### setProperty

▸ **setProperty**(`name`, `value`, `skipDispatch?`): `void`

Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Property name to set value of. |
| `value` | `any` | Peroperty value. |
| `skipDispatch?` | `boolean` | flag to skip event dispatch. |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[setProperty](IoColorSlider2dBase.md#setproperty)

#### Defined in

[src/core/node.ts:121](https://github.com/io-gui/io/blob/main/src/core/node.ts#L121)

___

### setShaderProgram

▸ **setShaderProgram**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[setShaderProgram](IoColorSlider2dBase.md#setshaderprogram)

#### Defined in

[src/core/gl.ts:379](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L379)

___

### setUniform

▸ **setUniform**(`name`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[setUniform](IoColorSlider2dBase.md#setuniform)

#### Defined in

[src/core/gl.ts:396](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L396)

___

### template

▸ **template**(`vDOM`, `host?`, `cache?`): `void`

Renders DOM from virtual DOM arrays.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vDOM` | `any`[] | Array of vDOM children. |
| `host?` | `HTMLElement` | Optional template target. |
| `cache?` | `boolean` | Optional don't reuse existing elements and skip dispose |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[template](IoColorSlider2dBase.md#template)

#### Defined in

[src/core/element.ts:233](https://github.com/io-gui/io/blob/main/src/core/element.ts#L233)

___

### themeMutated

▸ **themeMutated**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[themeMutated](IoColorSlider2dBase.md#thememutated)

#### Defined in

[src/core/gl.ts:329](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L329)

___

### throttle

▸ **throttle**(`func`, `arg?`, `timeout?`): `void`

Throttles function execution to next frame (rAF) if the function has been executed in the current frame.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `func` | [`CallbackFunction`](../README.md#callbackfunction) | `undefined` | Function to throttle. |
| `arg` | `any` | `undefined` | argument for throttled function. |
| `timeout` | `number` | `1` | minimum delay in ms before executing the function. |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[throttle](IoColorSlider2dBase.md#throttle)

#### Defined in

[src/core/node.ts:278](https://github.com/io-gui/io/blob/main/src/core/node.ts#L278)

___

### traverse

▸ **traverse**(`vChildren`, `host?`, `cache?`): `void`

Recurively traverses vDOM.
TODO: test element.traverse() function!

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vChildren` | `any`[] | Array of vDOM children converted by `buildTree()` for easier parsing. |
| `host?` | `HTMLElement` | Optional template target. |
| `cache?` | `boolean` | Optional don't reuse existing elements and skip dispose |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[traverse](IoColorSlider2dBase.md#traverse)

#### Defined in

[src/core/element.ts:246](https://github.com/io-gui/io/blob/main/src/core/element.ts#L246)

___

### unbind

▸ **unbind**(`prop`): `void`

Unbinds a binding to a specified property`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prop` | `string` | Property to unbind. |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[unbind](IoColorSlider2dBase.md#unbind)

#### Defined in

[src/core/node.ts:336](https://github.com/io-gui/io/blob/main/src/core/node.ts#L336)

___

### updatePropertyUniform

▸ **updatePropertyUniform**(`name`, `property`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `property` | [`PropertyInstance`](PropertyInstance.md) |

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[updatePropertyUniform](IoColorSlider2dBase.md#updatepropertyuniform)

#### Defined in

[src/core/gl.ts:385](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L385)

___

### updateThemeUniforms

▸ **updateThemeUniforms**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSlider2dBase](IoColorSlider2dBase.md).[updateThemeUniforms](IoColorSlider2dBase.md#updatethemeuniforms)

#### Defined in

[src/core/gl.ts:391](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L391)
