[io-gui](../README.md) / IoColorSliderBase

# Class: IoColorSliderBase

A base class for 1D color slider.
It as an incomplete implementation of a color slider desiged to be fully implemented in channel-specific subclasses.

## Hierarchy

- [`IoSlider`](IoSlider.md)

  ↳ **`IoColorSliderBase`**

  ↳↳ [`IoColorSliderR`](IoColorSliderR.md)

  ↳↳ [`IoColorSliderG`](IoColorSliderG.md)

  ↳↳ [`IoColorSliderB`](IoColorSliderB.md)

  ↳↳ [`IoColorSliderA`](IoColorSliderA.md)

  ↳↳ [`IoColorSliderH`](IoColorSliderH.md)

  ↳↳ [`IoColorSliderS`](IoColorSliderS.md)

  ↳↳ [`IoColorSliderV`](IoColorSliderV.md)

  ↳↳ [`IoColorSliderL`](IoColorSliderL.md)

  ↳↳ [`IoColorSliderC`](IoColorSliderC.md)

  ↳↳ [`IoColorSliderM`](IoColorSliderM.md)

  ↳↳ [`IoColorSliderY`](IoColorSliderY.md)

  ↳↳ [`IoColorSliderK`](IoColorSliderK.md)

## Table of contents

### Constructors

- [constructor](IoColorSliderBase.md#constructor)

### Properties

- [$](IoColorSliderBase.md#$)
- [\_active](IoColorSliderBase.md#_active)
- [\_bindings](IoColorSliderBase.md#_bindings)
- [\_changeQueue](IoColorSliderBase.md#_changequeue)
- [\_eventDispatcher](IoColorSliderBase.md#_eventdispatcher)
- [\_properties](IoColorSliderBase.md#_properties)
- [\_protochain](IoColorSliderBase.md#_protochain)
- [\_rect](IoColorSliderBase.md#_rect)
- [\_startX](IoColorSliderBase.md#_startx)
- [\_startY](IoColorSliderBase.md#_starty)
- [class](IoColorSliderBase.md#class)
- [color](IoColorSliderBase.md#color)
- [contenteditable](IoColorSliderBase.md#contenteditable)
- [disabled](IoColorSliderBase.md#disabled)
- [exponent](IoColorSliderBase.md#exponent)
- [hidden](IoColorSliderBase.md#hidden)
- [id](IoColorSliderBase.md#id)
- [label](IoColorSliderBase.md#label)
- [lazy](IoColorSliderBase.md#lazy)
- [max](IoColorSliderBase.md#max)
- [min](IoColorSliderBase.md#min)
- [name](IoColorSliderBase.md#name)
- [noscroll](IoColorSliderBase.md#noscroll)
- [pxRatio](IoColorSliderBase.md#pxratio)
- [role](IoColorSliderBase.md#role)
- [size](IoColorSliderBase.md#size)
- [step](IoColorSliderBase.md#step)
- [tabindex](IoColorSliderBase.md#tabindex)
- [theme](IoColorSliderBase.md#theme)
- [title](IoColorSliderBase.md#title)
- [value](IoColorSliderBase.md#value)
- [vertical](IoColorSliderBase.md#vertical)

### Accessors

- [\_max](IoColorSliderBase.md#_max)
- [\_min](IoColorSliderBase.md#_min)
- [\_step](IoColorSliderBase.md#_step)
- [\_value](IoColorSliderBase.md#_value)
- [textNode](IoColorSliderBase.md#textnode)
- [Frag](IoColorSliderBase.md#frag)
- [GlUtils](IoColorSliderBase.md#glutils)
- [Listeners](IoColorSliderBase.md#listeners)
- [Properties](IoColorSliderBase.md#properties)
- [Style](IoColorSliderBase.md#style)
- [Vert](IoColorSliderBase.md#vert)

### Methods

- [Register](IoColorSliderBase.md#register)
- [\_flattenTextNode](IoColorSliderBase.md#_flattentextnode)
- [\_getPointerCoord](IoColorSliderBase.md#_getpointercoord)
- [\_getValueFromCoord](IoColorSliderBase.md#_getvaluefromcoord)
- [\_inputValue](IoColorSliderBase.md#_inputvalue)
- [\_onBlur](IoColorSliderBase.md#_onblur)
- [\_onContextmenu](IoColorSliderBase.md#_oncontextmenu)
- [\_onFocus](IoColorSliderBase.md#_onfocus)
- [\_onKeydown](IoColorSliderBase.md#_onkeydown)
- [\_onPointerdown](IoColorSliderBase.md#_onpointerdown)
- [\_onPointermove](IoColorSliderBase.md#_onpointermove)
- [\_onPointermoveThrottled](IoColorSliderBase.md#_onpointermovethrottled)
- [\_onPointerup](IoColorSliderBase.md#_onpointerup)
- [\_onRender](IoColorSliderBase.md#_onrender)
- [\_onTouchend](IoColorSliderBase.md#_ontouchend)
- [\_onTouchmove](IoColorSliderBase.md#_ontouchmove)
- [\_onTouchstart](IoColorSliderBase.md#_ontouchstart)
- [\_setDecrease](IoColorSliderBase.md#_setdecrease)
- [\_setDown](IoColorSliderBase.md#_setdown)
- [\_setIncrease](IoColorSliderBase.md#_setincrease)
- [\_setLeft](IoColorSliderBase.md#_setleft)
- [\_setMax](IoColorSliderBase.md#_setmax)
- [\_setMin](IoColorSliderBase.md#_setmin)
- [\_setRight](IoColorSliderBase.md#_setright)
- [\_setUp](IoColorSliderBase.md#_setup)
- [addEventListener](IoColorSliderBase.md#addeventlistener)
- [applyProperties](IoColorSliderBase.md#applyproperties)
- [bind](IoColorSliderBase.md#bind)
- [changed](IoColorSliderBase.md#changed)
- [connectedCallback](IoColorSliderBase.md#connectedcallback)
- [disabledChanged](IoColorSliderBase.md#disabledchanged)
- [disconnectedCallback](IoColorSliderBase.md#disconnectedcallback)
- [dispatchEvent](IoColorSliderBase.md#dispatchevent)
- [dispatchMutationEvent](IoColorSliderBase.md#dispatchmutationevent)
- [dispatchQueue](IoColorSliderBase.md#dispatchqueue)
- [dispatchQueueSync](IoColorSliderBase.md#dispatchqueuesync)
- [dispose](IoColorSliderBase.md#dispose)
- [init](IoColorSliderBase.md#init)
- [initPropertyUniform](IoColorSliderBase.md#initpropertyuniform)
- [initShader](IoColorSliderBase.md#initshader)
- [inputValue](IoColorSliderBase.md#inputvalue)
- [labelChanged](IoColorSliderBase.md#labelchanged)
- [objectMutated](IoColorSliderBase.md#objectmutated)
- [onObjectMutated](IoColorSliderBase.md#onobjectmutated)
- [onResized](IoColorSliderBase.md#onresized)
- [queue](IoColorSliderBase.md#queue)
- [removeEventListener](IoColorSliderBase.md#removeeventlistener)
- [setAttribute](IoColorSliderBase.md#setattribute)
- [setProperties](IoColorSliderBase.md#setproperties)
- [setProperty](IoColorSliderBase.md#setproperty)
- [setShaderProgram](IoColorSliderBase.md#setshaderprogram)
- [setUniform](IoColorSliderBase.md#setuniform)
- [template](IoColorSliderBase.md#template)
- [themeMutated](IoColorSliderBase.md#thememutated)
- [throttle](IoColorSliderBase.md#throttle)
- [traverse](IoColorSliderBase.md#traverse)
- [unbind](IoColorSliderBase.md#unbind)
- [updatePropertyUniform](IoColorSliderBase.md#updatepropertyuniform)
- [updateThemeUniforms](IoColorSliderBase.md#updatethemeuniforms)

## Constructors

### constructor

• **new IoColorSliderBase**(`properties?`): [`IoColorSliderBase`](IoColorSliderBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | `Record`\<`string`, `any`\> |

#### Returns

[`IoColorSliderBase`](IoColorSliderBase.md)

#### Inherited from

[IoSlider](IoSlider.md).[constructor](IoSlider.md#constructor)

#### Defined in

[src/core/gl.ts:259](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L259)

## Properties

### $

• **$**: `Record`\<`string`, `any`\>

#### Inherited from

[IoSlider](IoSlider.md).[$](IoSlider.md#$)

#### Defined in

[src/core/element.ts:178](https://github.com/io-gui/io/blob/main/src/core/element.ts#L178)

___

### \_active

• **\_active**: `number` = `-1`

#### Inherited from

[IoSlider](IoSlider.md).[_active](IoSlider.md#_active)

#### Defined in

[src/elements/sliders/io-slider-base.ts:65](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L65)

___

### \_bindings

• `Readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoSlider](IoSlider.md).[_bindings](IoSlider.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoSlider](IoSlider.md).[_changeQueue](IoSlider.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoSlider](IoSlider.md).[_eventDispatcher](IoSlider.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

___

### \_properties

• `Readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoSlider](IoSlider.md).[_properties](IoSlider.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoSlider](IoSlider.md).[_protochain](IoSlider.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

___

### \_rect

• **\_rect**: ``null`` \| `DOMRect` = `null`

#### Inherited from

[IoSlider](IoSlider.md).[_rect](IoSlider.md#_rect)

#### Defined in

[src/elements/sliders/io-slider-base.ts:66](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L66)

___

### \_startX

• **\_startX**: `number` = `0`

#### Inherited from

[IoSlider](IoSlider.md).[_startX](IoSlider.md#_startx)

#### Defined in

[src/elements/sliders/io-slider-base.ts:63](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L63)

___

### \_startY

• **\_startY**: `number` = `0`

#### Inherited from

[IoSlider](IoSlider.md).[_startY](IoSlider.md#_starty)

#### Defined in

[src/elements/sliders/io-slider-base.ts:64](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L64)

___

### class

• **class**: `string`

#### Inherited from

[IoSlider](IoSlider.md).[class](IoSlider.md#class)

#### Defined in

[src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

___

### color

• **color**: [`number`, `number`, `number`, `number`]

#### Inherited from

[IoSlider](IoSlider.md).[color](IoSlider.md#color)

#### Defined in

[src/core/gl.ts:69](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L69)

___

### contenteditable

• **contenteditable**: `boolean`

#### Inherited from

[IoSlider](IoSlider.md).[contenteditable](IoSlider.md#contenteditable)

#### Defined in

[src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

___

### disabled

• **disabled**: `boolean`

#### Inherited from

[IoSlider](IoSlider.md).[disabled](IoSlider.md#disabled)

#### Defined in

[src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

___

### exponent

• **exponent**: `number`

#### Inherited from

[IoSlider](IoSlider.md).[exponent](IoSlider.md#exponent)

#### Defined in

[src/elements/sliders/io-slider-base.ts:46](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L46)

___

### hidden

• **hidden**: `boolean`

#### Inherited from

[IoSlider](IoSlider.md).[hidden](IoSlider.md#hidden)

#### Defined in

[src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

___

### id

• **id**: `string`

#### Inherited from

[IoSlider](IoSlider.md).[id](IoSlider.md#id)

#### Defined in

[src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

___

### label

• **label**: `string`

#### Inherited from

[IoSlider](IoSlider.md).[label](IoSlider.md#label)

#### Defined in

[src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

___

### lazy

• **lazy**: `boolean`

#### Inherited from

[IoSlider](IoSlider.md).[lazy](IoSlider.md#lazy)

#### Defined in

[src/elements/sliders/io-slider-base.ts:61](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L61)

___

### max

• **max**: `number`

#### Inherited from

[IoSlider](IoSlider.md).[max](IoSlider.md#max)

#### Defined in

[src/elements/sliders/io-slider.ts:26](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider.ts#L26)

___

### min

• **min**: `number`

#### Inherited from

[IoSlider](IoSlider.md).[min](IoSlider.md#min)

#### Defined in

[src/elements/sliders/io-slider.ts:23](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider.ts#L23)

___

### name

• **name**: `string`

#### Inherited from

[IoSlider](IoSlider.md).[name](IoSlider.md#name)

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

___

### noscroll

• **noscroll**: `boolean`

#### Inherited from

[IoSlider](IoSlider.md).[noscroll](IoSlider.md#noscroll)

#### Defined in

[src/elements/sliders/io-slider-base.ts:52](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L52)

___

### pxRatio

• **pxRatio**: `number`

#### Inherited from

[IoSlider](IoSlider.md).[pxRatio](IoSlider.md#pxratio)

#### Defined in

[src/core/gl.ts:72](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L72)

___

### role

• **role**: `string`

#### Inherited from

[IoSlider](IoSlider.md).[role](IoSlider.md#role)

#### Defined in

[src/elements/sliders/io-slider-base.ts:55](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L55)

___

### size

• **size**: [`number`, `number`]

#### Inherited from

[IoSlider](IoSlider.md).[size](IoSlider.md#size)

#### Defined in

[src/core/gl.ts:66](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L66)

___

### step

• **step**: `number`

#### Inherited from

[IoSlider](IoSlider.md).[step](IoSlider.md#step)

#### Defined in

[src/elements/sliders/io-slider.ts:20](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider.ts#L20)

___

### tabindex

• **tabindex**: `string`

#### Inherited from

[IoSlider](IoSlider.md).[tabindex](IoSlider.md#tabindex)

#### Defined in

[src/elements/sliders/io-slider-base.ts:58](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L58)

___

### theme

• **theme**: `IoTheme`

#### Inherited from

[IoSlider](IoSlider.md).[theme](IoSlider.md#theme)

#### Defined in

[src/core/gl.ts:75](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L75)

___

### title

• **title**: `string`

#### Inherited from

[IoSlider](IoSlider.md).[title](IoSlider.md#title)

#### Defined in

[src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

___

### value

• **value**: `number`

#### Inherited from

[IoSlider](IoSlider.md).[value](IoSlider.md#value)

#### Defined in

[src/elements/sliders/io-slider.ts:17](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider.ts#L17)

___

### vertical

• **vertical**: `boolean`

#### Inherited from

[IoSlider](IoSlider.md).[vertical](IoSlider.md#vertical)

#### Defined in

[src/elements/sliders/io-slider-base.ts:49](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L49)

## Accessors

### \_max

• `get` **_max**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSlider.\_max

#### Defined in

[src/elements/sliders/io-slider-base.ts:79](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L79)

___

### \_min

• `get` **_min**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSlider.\_min

#### Defined in

[src/elements/sliders/io-slider-base.ts:68](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L68)

___

### \_step

• `get` **_step**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSlider.\_step

#### Defined in

[src/elements/sliders/io-slider-base.ts:90](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L90)

___

### \_value

• `get` **_value**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSlider.\_value

#### Defined in

[src/elements/sliders/io-slider-base.ts:101](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L101)

___

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoSlider.textNode

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

IoSlider.textNode

#### Defined in

[src/core/element.ts:396](https://github.com/io-gui/io/blob/main/src/core/element.ts#L396)

___

### Frag

• `get` **Frag**(): `string`

#### Returns

`string`

#### Overrides

IoSlider.Frag

#### Defined in

[src/elements/color/io-color-sliders.ts:222](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L222)

___

### GlUtils

• `get` **GlUtils**(): `string`

#### Returns

`string`

#### Overrides

IoSlider.GlUtils

#### Defined in

[src/elements/color/io-color-sliders.ts:214](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L214)

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

IoSlider.Listeners

#### Defined in

[src/elements/sliders/io-slider-base.ts:112](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L112)

___

### Properties

• `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoSlider.Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

___

### Style

• `get` **Style**(): `string`

#### Returns

`string`

#### Inherited from

IoSlider.Style

#### Defined in

[src/elements/sliders/io-slider-base.ts:9](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L9)

___

### Vert

• `get` **Vert**(): `string`

#### Returns

`string`

#### Inherited from

IoSlider.Vert

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

[IoSlider](IoSlider.md).[Register](IoSlider.md#register)

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

[IoSlider](IoSlider.md).[_flattenTextNode](IoSlider.md#_flattentextnode)

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

[IoSlider](IoSlider.md).[_getPointerCoord](IoSlider.md#_getpointercoord)

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

[IoSlider](IoSlider.md).[_getValueFromCoord](IoSlider.md#_getvaluefromcoord)

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

[IoSlider](IoSlider.md).[_inputValue](IoSlider.md#_inputvalue)

#### Defined in

[src/elements/sliders/io-slider-base.ts:203](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L203)

___

### \_onBlur

▸ **_onBlur**(): `void`

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[_onBlur](IoSlider.md#_onblur)

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

[IoSlider](IoSlider.md).[_onContextmenu](IoSlider.md#_oncontextmenu)

#### Defined in

[src/elements/sliders/io-slider-base.ts:128](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L128)

___

### \_onFocus

▸ **_onFocus**(): `void`

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[_onFocus](IoSlider.md#_onfocus)

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

[IoSlider](IoSlider.md).[_onKeydown](IoSlider.md#_onkeydown)

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

[IoSlider](IoSlider.md).[_onPointerdown](IoSlider.md#_onpointerdown)

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

[IoSlider](IoSlider.md).[_onPointermove](IoSlider.md#_onpointermove)

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

[IoSlider](IoSlider.md).[_onPointermoveThrottled](IoSlider.md#_onpointermovethrottled)

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

[IoSlider](IoSlider.md).[_onPointerup](IoSlider.md#_onpointerup)

#### Defined in

[src/elements/sliders/io-slider-base.ts:172](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L172)

___

### \_onRender

▸ **_onRender**(): `void`

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[_onRender](IoSlider.md#_onrender)

#### Defined in

[src/core/gl.ts:344](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L344)

___

### \_onTouchend

▸ **_onTouchend**(): `void`

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[_onTouchend](IoSlider.md#_ontouchend)

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

[IoSlider](IoSlider.md).[_onTouchmove](IoSlider.md#_ontouchmove)

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

[IoSlider](IoSlider.md).[_onTouchstart](IoSlider.md#_ontouchstart)

#### Defined in

[src/elements/sliders/io-slider-base.ts:131](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L131)

___

### \_setDecrease

▸ **_setDecrease**(): `void`

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[_setDecrease](IoSlider.md#_setdecrease)

#### Defined in

[src/elements/sliders/io-slider-base.ts:276](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L276)

___

### \_setDown

▸ **_setDown**(): `void`

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[_setDown](IoSlider.md#_setdown)

#### Defined in

[src/elements/sliders/io-slider-base.ts:297](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L297)

___

### \_setIncrease

▸ **_setIncrease**(): `void`

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[_setIncrease](IoSlider.md#_setincrease)

#### Defined in

[src/elements/sliders/io-slider-base.ts:269](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L269)

___

### \_setLeft

▸ **_setLeft**(): `void`

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[_setLeft](IoSlider.md#_setleft)

#### Defined in

[src/elements/sliders/io-slider-base.ts:303](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L303)

___

### \_setMax

▸ **_setMax**(): `void`

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[_setMax](IoSlider.md#_setmax)

#### Defined in

[src/elements/sliders/io-slider-base.ts:287](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L287)

___

### \_setMin

▸ **_setMin**(): `void`

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[_setMin](IoSlider.md#_setmin)

#### Defined in

[src/elements/sliders/io-slider-base.ts:283](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L283)

___

### \_setRight

▸ **_setRight**(): `void`

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[_setRight](IoSlider.md#_setright)

#### Defined in

[src/elements/sliders/io-slider-base.ts:309](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L309)

___

### \_setUp

▸ **_setUp**(): `void`

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[_setUp](IoSlider.md#_setup)

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

[IoSlider](IoSlider.md).[addEventListener](IoSlider.md#addeventlistener)

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

[IoSlider](IoSlider.md).[applyProperties](IoSlider.md#applyproperties)

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

[IoSlider](IoSlider.md).[bind](IoSlider.md#bind)

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

[IoSlider](IoSlider.md).[changed](IoSlider.md#changed)

#### Defined in

[src/elements/sliders/io-slider-base.ts:318](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L318)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[connectedCallback](IoSlider.md#connectedcallback)

#### Defined in

[src/core/element.ts:213](https://github.com/io-gui/io/blob/main/src/core/element.ts#L213)

___

### disabledChanged

▸ **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[disabledChanged](IoSlider.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[disconnectedCallback](IoSlider.md#disconnectedcallback)

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

[IoSlider](IoSlider.md).[dispatchEvent](IoSlider.md#dispatchevent)

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

[IoSlider](IoSlider.md).[dispatchMutationEvent](IoSlider.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:384](https://github.com/io-gui/io/blob/main/src/core/node.ts#L384)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[dispatchQueue](IoSlider.md#dispatchqueue)

#### Defined in

[src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[dispatchQueueSync](IoSlider.md#dispatchqueuesync)

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

[IoSlider](IoSlider.md).[dispose](IoSlider.md#dispose)

#### Defined in

[src/core/node.ts:391](https://github.com/io-gui/io/blob/main/src/core/node.ts#L391)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[init](IoSlider.md#init)

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

[IoSlider](IoSlider.md).[initPropertyUniform](IoSlider.md#initpropertyuniform)

#### Defined in

[src/core/gl.ts:191](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L191)

___

### initShader

▸ **initShader**(): `WebGLProgram`

#### Returns

`WebGLProgram`

#### Inherited from

[IoSlider](IoSlider.md).[initShader](IoSlider.md#initshader)

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

[IoSlider](IoSlider.md).[inputValue](IoSlider.md#inputvalue)

#### Defined in

[src/core/node.ts:234](https://github.com/io-gui/io/blob/main/src/core/node.ts#L234)

___

### labelChanged

▸ **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[labelChanged](IoSlider.md#labelchanged)

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

[IoSlider](IoSlider.md).[objectMutated](IoSlider.md#objectmutated)

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

[IoSlider](IoSlider.md).[onObjectMutated](IoSlider.md#onobjectmutated)

#### Defined in

[src/core/node.ts:287](https://github.com/io-gui/io/blob/main/src/core/node.ts#L287)

___

### onResized

▸ **onResized**(): `void`

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[onResized](IoSlider.md#onresized)

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

[IoSlider](IoSlider.md).[queue](IoSlider.md#queue)

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

[IoSlider](IoSlider.md).[removeEventListener](IoSlider.md#removeeventlistener)

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

[IoSlider](IoSlider.md).[setAttribute](IoSlider.md#setattribute)

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

[IoSlider](IoSlider.md).[setProperties](IoSlider.md#setproperties)

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

[IoSlider](IoSlider.md).[setProperty](IoSlider.md#setproperty)

#### Defined in

[src/core/node.ts:121](https://github.com/io-gui/io/blob/main/src/core/node.ts#L121)

___

### setShaderProgram

▸ **setShaderProgram**(): `void`

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[setShaderProgram](IoSlider.md#setshaderprogram)

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

[IoSlider](IoSlider.md).[setUniform](IoSlider.md#setuniform)

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

[IoSlider](IoSlider.md).[template](IoSlider.md#template)

#### Defined in

[src/core/element.ts:233](https://github.com/io-gui/io/blob/main/src/core/element.ts#L233)

___

### themeMutated

▸ **themeMutated**(): `void`

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[themeMutated](IoSlider.md#thememutated)

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

[IoSlider](IoSlider.md).[throttle](IoSlider.md#throttle)

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

[IoSlider](IoSlider.md).[traverse](IoSlider.md#traverse)

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

[IoSlider](IoSlider.md).[unbind](IoSlider.md#unbind)

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

[IoSlider](IoSlider.md).[updatePropertyUniform](IoSlider.md#updatepropertyuniform)

#### Defined in

[src/core/gl.ts:385](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L385)

___

### updateThemeUniforms

▸ **updateThemeUniforms**(): `void`

#### Returns

`void`

#### Inherited from

[IoSlider](IoSlider.md).[updateThemeUniforms](IoSlider.md#updatethemeuniforms)

#### Defined in

[src/core/gl.ts:391](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L391)
