[io-gui](../README.md) / IoColorSliderC

# Class: IoColorSliderC

A 1D slider for "cyan" color channel.

## Hierarchy

- [`IoColorSliderBase`](IoColorSliderBase.md)

  ↳ **`IoColorSliderC`**

## Table of contents

### Constructors

- [constructor](IoColorSliderC.md#constructor)

### Properties

- [$](IoColorSliderC.md#$)
- [\_active](IoColorSliderC.md#_active)
- [\_bindings](IoColorSliderC.md#_bindings)
- [\_changeQueue](IoColorSliderC.md#_changequeue)
- [\_eventDispatcher](IoColorSliderC.md#_eventdispatcher)
- [\_properties](IoColorSliderC.md#_properties)
- [\_protochain](IoColorSliderC.md#_protochain)
- [\_rect](IoColorSliderC.md#_rect)
- [\_startX](IoColorSliderC.md#_startx)
- [\_startY](IoColorSliderC.md#_starty)
- [class](IoColorSliderC.md#class)
- [color](IoColorSliderC.md#color)
- [contenteditable](IoColorSliderC.md#contenteditable)
- [disabled](IoColorSliderC.md#disabled)
- [exponent](IoColorSliderC.md#exponent)
- [hidden](IoColorSliderC.md#hidden)
- [id](IoColorSliderC.md#id)
- [label](IoColorSliderC.md#label)
- [lazy](IoColorSliderC.md#lazy)
- [max](IoColorSliderC.md#max)
- [min](IoColorSliderC.md#min)
- [name](IoColorSliderC.md#name)
- [noscroll](IoColorSliderC.md#noscroll)
- [pxRatio](IoColorSliderC.md#pxratio)
- [role](IoColorSliderC.md#role)
- [size](IoColorSliderC.md#size)
- [step](IoColorSliderC.md#step)
- [tabindex](IoColorSliderC.md#tabindex)
- [theme](IoColorSliderC.md#theme)
- [title](IoColorSliderC.md#title)
- [value](IoColorSliderC.md#value)
- [vertical](IoColorSliderC.md#vertical)

### Accessors

- [\_max](IoColorSliderC.md#_max)
- [\_min](IoColorSliderC.md#_min)
- [\_step](IoColorSliderC.md#_step)
- [\_value](IoColorSliderC.md#_value)
- [textNode](IoColorSliderC.md#textnode)
- [Frag](IoColorSliderC.md#frag)
- [GlUtils](IoColorSliderC.md#glutils)
- [Listeners](IoColorSliderC.md#listeners)
- [Properties](IoColorSliderC.md#properties)
- [Style](IoColorSliderC.md#style)
- [Vert](IoColorSliderC.md#vert)

### Methods

- [Register](IoColorSliderC.md#register)
- [\_flattenTextNode](IoColorSliderC.md#_flattentextnode)
- [\_getPointerCoord](IoColorSliderC.md#_getpointercoord)
- [\_getValueFromCoord](IoColorSliderC.md#_getvaluefromcoord)
- [\_inputValue](IoColorSliderC.md#_inputvalue)
- [\_onBlur](IoColorSliderC.md#_onblur)
- [\_onContextmenu](IoColorSliderC.md#_oncontextmenu)
- [\_onFocus](IoColorSliderC.md#_onfocus)
- [\_onKeydown](IoColorSliderC.md#_onkeydown)
- [\_onPointerdown](IoColorSliderC.md#_onpointerdown)
- [\_onPointermove](IoColorSliderC.md#_onpointermove)
- [\_onPointermoveThrottled](IoColorSliderC.md#_onpointermovethrottled)
- [\_onPointerup](IoColorSliderC.md#_onpointerup)
- [\_onRender](IoColorSliderC.md#_onrender)
- [\_onTouchend](IoColorSliderC.md#_ontouchend)
- [\_onTouchmove](IoColorSliderC.md#_ontouchmove)
- [\_onTouchstart](IoColorSliderC.md#_ontouchstart)
- [\_setDecrease](IoColorSliderC.md#_setdecrease)
- [\_setDown](IoColorSliderC.md#_setdown)
- [\_setIncrease](IoColorSliderC.md#_setincrease)
- [\_setLeft](IoColorSliderC.md#_setleft)
- [\_setMax](IoColorSliderC.md#_setmax)
- [\_setMin](IoColorSliderC.md#_setmin)
- [\_setRight](IoColorSliderC.md#_setright)
- [\_setUp](IoColorSliderC.md#_setup)
- [addEventListener](IoColorSliderC.md#addeventlistener)
- [applyProperties](IoColorSliderC.md#applyproperties)
- [bind](IoColorSliderC.md#bind)
- [changed](IoColorSliderC.md#changed)
- [connectedCallback](IoColorSliderC.md#connectedcallback)
- [disabledChanged](IoColorSliderC.md#disabledchanged)
- [disconnectedCallback](IoColorSliderC.md#disconnectedcallback)
- [dispatchEvent](IoColorSliderC.md#dispatchevent)
- [dispatchMutationEvent](IoColorSliderC.md#dispatchmutationevent)
- [dispatchQueue](IoColorSliderC.md#dispatchqueue)
- [dispatchQueueSync](IoColorSliderC.md#dispatchqueuesync)
- [dispose](IoColorSliderC.md#dispose)
- [init](IoColorSliderC.md#init)
- [initPropertyUniform](IoColorSliderC.md#initpropertyuniform)
- [initShader](IoColorSliderC.md#initshader)
- [inputValue](IoColorSliderC.md#inputvalue)
- [labelChanged](IoColorSliderC.md#labelchanged)
- [objectMutated](IoColorSliderC.md#objectmutated)
- [onObjectMutated](IoColorSliderC.md#onobjectmutated)
- [onResized](IoColorSliderC.md#onresized)
- [queue](IoColorSliderC.md#queue)
- [removeEventListener](IoColorSliderC.md#removeeventlistener)
- [setAttribute](IoColorSliderC.md#setattribute)
- [setProperties](IoColorSliderC.md#setproperties)
- [setProperty](IoColorSliderC.md#setproperty)
- [setShaderProgram](IoColorSliderC.md#setshaderprogram)
- [setUniform](IoColorSliderC.md#setuniform)
- [template](IoColorSliderC.md#template)
- [themeMutated](IoColorSliderC.md#thememutated)
- [throttle](IoColorSliderC.md#throttle)
- [traverse](IoColorSliderC.md#traverse)
- [unbind](IoColorSliderC.md#unbind)
- [updatePropertyUniform](IoColorSliderC.md#updatepropertyuniform)
- [updateThemeUniforms](IoColorSliderC.md#updatethemeuniforms)

## Constructors

### constructor

• **new IoColorSliderC**(`properties?`): [`IoColorSliderC`](IoColorSliderC.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | `Record`\<`string`, `any`\> |

#### Returns

[`IoColorSliderC`](IoColorSliderC.md)

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[constructor](IoColorSliderBase.md#constructor)

#### Defined in

[src/core/gl.ts:259](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L259)

## Properties

### $

• **$**: `Record`\<`string`, `any`\>

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[$](IoColorSliderBase.md#$)

#### Defined in

[src/core/element.ts:178](https://github.com/io-gui/io/blob/main/src/core/element.ts#L178)

___

### \_active

• **\_active**: `number` = `-1`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_active](IoColorSliderBase.md#_active)

#### Defined in

[src/elements/sliders/io-slider-base.ts:65](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L65)

___

### \_bindings

• `Readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_bindings](IoColorSliderBase.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_changeQueue](IoColorSliderBase.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_eventDispatcher](IoColorSliderBase.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

___

### \_properties

• `Readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_properties](IoColorSliderBase.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_protochain](IoColorSliderBase.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

___

### \_rect

• **\_rect**: ``null`` \| `DOMRect` = `null`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_rect](IoColorSliderBase.md#_rect)

#### Defined in

[src/elements/sliders/io-slider-base.ts:66](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L66)

___

### \_startX

• **\_startX**: `number` = `0`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_startX](IoColorSliderBase.md#_startx)

#### Defined in

[src/elements/sliders/io-slider-base.ts:63](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L63)

___

### \_startY

• **\_startY**: `number` = `0`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_startY](IoColorSliderBase.md#_starty)

#### Defined in

[src/elements/sliders/io-slider-base.ts:64](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L64)

___

### class

• **class**: `string`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[class](IoColorSliderBase.md#class)

#### Defined in

[src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

___

### color

• **color**: [`number`, `number`, `number`, `number`]

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[color](IoColorSliderBase.md#color)

#### Defined in

[src/core/gl.ts:69](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L69)

___

### contenteditable

• **contenteditable**: `boolean`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[contenteditable](IoColorSliderBase.md#contenteditable)

#### Defined in

[src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

___

### disabled

• **disabled**: `boolean`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[disabled](IoColorSliderBase.md#disabled)

#### Defined in

[src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

___

### exponent

• **exponent**: `number`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[exponent](IoColorSliderBase.md#exponent)

#### Defined in

[src/elements/sliders/io-slider-base.ts:46](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L46)

___

### hidden

• **hidden**: `boolean`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[hidden](IoColorSliderBase.md#hidden)

#### Defined in

[src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

___

### id

• **id**: `string`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[id](IoColorSliderBase.md#id)

#### Defined in

[src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

___

### label

• **label**: `string`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[label](IoColorSliderBase.md#label)

#### Defined in

[src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

___

### lazy

• **lazy**: `boolean`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[lazy](IoColorSliderBase.md#lazy)

#### Defined in

[src/elements/sliders/io-slider-base.ts:61](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L61)

___

### max

• **max**: `number`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[max](IoColorSliderBase.md#max)

#### Defined in

[src/elements/sliders/io-slider.ts:26](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider.ts#L26)

___

### min

• **min**: `number`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[min](IoColorSliderBase.md#min)

#### Defined in

[src/elements/sliders/io-slider.ts:23](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider.ts#L23)

___

### name

• **name**: `string`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[name](IoColorSliderBase.md#name)

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

___

### noscroll

• **noscroll**: `boolean`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[noscroll](IoColorSliderBase.md#noscroll)

#### Defined in

[src/elements/sliders/io-slider-base.ts:52](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L52)

___

### pxRatio

• **pxRatio**: `number`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[pxRatio](IoColorSliderBase.md#pxratio)

#### Defined in

[src/core/gl.ts:72](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L72)

___

### role

• **role**: `string`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[role](IoColorSliderBase.md#role)

#### Defined in

[src/elements/sliders/io-slider-base.ts:55](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L55)

___

### size

• **size**: [`number`, `number`]

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[size](IoColorSliderBase.md#size)

#### Defined in

[src/core/gl.ts:66](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L66)

___

### step

• **step**: `number`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[step](IoColorSliderBase.md#step)

#### Defined in

[src/elements/sliders/io-slider.ts:20](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider.ts#L20)

___

### tabindex

• **tabindex**: `string`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[tabindex](IoColorSliderBase.md#tabindex)

#### Defined in

[src/elements/sliders/io-slider-base.ts:58](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L58)

___

### theme

• **theme**: `IoTheme`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[theme](IoColorSliderBase.md#theme)

#### Defined in

[src/core/gl.ts:75](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L75)

___

### title

• **title**: `string`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[title](IoColorSliderBase.md#title)

#### Defined in

[src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

___

### value

• **value**: `number`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[value](IoColorSliderBase.md#value)

#### Defined in

[src/elements/sliders/io-slider.ts:17](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider.ts#L17)

___

### vertical

• **vertical**: `boolean`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[vertical](IoColorSliderBase.md#vertical)

#### Defined in

[src/elements/sliders/io-slider-base.ts:49](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L49)

## Accessors

### \_max

• `get` **_max**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoColorSliderBase.\_max

#### Defined in

[src/elements/sliders/io-slider-base.ts:79](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L79)

___

### \_min

• `get` **_min**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoColorSliderBase.\_min

#### Defined in

[src/elements/sliders/io-slider-base.ts:68](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L68)

___

### \_step

• `get` **_step**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoColorSliderBase.\_step

#### Defined in

[src/elements/sliders/io-slider-base.ts:90](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L90)

___

### \_value

• `get` **_value**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoColorSliderBase.\_value

#### Defined in

[src/elements/sliders/io-slider-base.ts:101](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L101)

___

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoColorSliderBase.textNode

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

IoColorSliderBase.textNode

#### Defined in

[src/core/element.ts:396](https://github.com/io-gui/io/blob/main/src/core/element.ts#L396)

___

### Frag

• `get` **Frag**(): `string`

#### Returns

`string`

#### Inherited from

IoColorSliderBase.Frag

#### Defined in

[src/elements/color/io-color-sliders.ts:222](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L222)

___

### GlUtils

• `get` **GlUtils**(): `string`

#### Returns

`string`

#### Overrides

IoColorSliderBase.GlUtils

#### Defined in

[src/elements/color/io-color-sliders.ts:427](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-sliders.ts#L427)

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

IoColorSliderBase.Listeners

#### Defined in

[src/elements/sliders/io-slider-base.ts:112](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L112)

___

### Properties

• `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoColorSliderBase.Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

___

### Style

• `get` **Style**(): `string`

#### Returns

`string`

#### Inherited from

IoColorSliderBase.Style

#### Defined in

[src/elements/sliders/io-slider-base.ts:9](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L9)

___

### Vert

• `get` **Vert**(): `string`

#### Returns

`string`

#### Inherited from

IoColorSliderBase.Vert

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

[IoColorSliderBase](IoColorSliderBase.md).[Register](IoColorSliderBase.md#register)

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

[IoColorSliderBase](IoColorSliderBase.md).[_flattenTextNode](IoColorSliderBase.md#_flattentextnode)

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

[IoColorSliderBase](IoColorSliderBase.md).[_getPointerCoord](IoColorSliderBase.md#_getpointercoord)

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

[IoColorSliderBase](IoColorSliderBase.md).[_getValueFromCoord](IoColorSliderBase.md#_getvaluefromcoord)

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

[IoColorSliderBase](IoColorSliderBase.md).[_inputValue](IoColorSliderBase.md#_inputvalue)

#### Defined in

[src/elements/sliders/io-slider-base.ts:203](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L203)

___

### \_onBlur

▸ **_onBlur**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_onBlur](IoColorSliderBase.md#_onblur)

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

[IoColorSliderBase](IoColorSliderBase.md).[_onContextmenu](IoColorSliderBase.md#_oncontextmenu)

#### Defined in

[src/elements/sliders/io-slider-base.ts:128](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L128)

___

### \_onFocus

▸ **_onFocus**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_onFocus](IoColorSliderBase.md#_onfocus)

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

[IoColorSliderBase](IoColorSliderBase.md).[_onKeydown](IoColorSliderBase.md#_onkeydown)

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

[IoColorSliderBase](IoColorSliderBase.md).[_onPointerdown](IoColorSliderBase.md#_onpointerdown)

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

[IoColorSliderBase](IoColorSliderBase.md).[_onPointermove](IoColorSliderBase.md#_onpointermove)

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

[IoColorSliderBase](IoColorSliderBase.md).[_onPointermoveThrottled](IoColorSliderBase.md#_onpointermovethrottled)

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

[IoColorSliderBase](IoColorSliderBase.md).[_onPointerup](IoColorSliderBase.md#_onpointerup)

#### Defined in

[src/elements/sliders/io-slider-base.ts:172](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L172)

___

### \_onRender

▸ **_onRender**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_onRender](IoColorSliderBase.md#_onrender)

#### Defined in

[src/core/gl.ts:344](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L344)

___

### \_onTouchend

▸ **_onTouchend**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_onTouchend](IoColorSliderBase.md#_ontouchend)

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

[IoColorSliderBase](IoColorSliderBase.md).[_onTouchmove](IoColorSliderBase.md#_ontouchmove)

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

[IoColorSliderBase](IoColorSliderBase.md).[_onTouchstart](IoColorSliderBase.md#_ontouchstart)

#### Defined in

[src/elements/sliders/io-slider-base.ts:131](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L131)

___

### \_setDecrease

▸ **_setDecrease**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_setDecrease](IoColorSliderBase.md#_setdecrease)

#### Defined in

[src/elements/sliders/io-slider-base.ts:276](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L276)

___

### \_setDown

▸ **_setDown**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_setDown](IoColorSliderBase.md#_setdown)

#### Defined in

[src/elements/sliders/io-slider-base.ts:297](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L297)

___

### \_setIncrease

▸ **_setIncrease**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_setIncrease](IoColorSliderBase.md#_setincrease)

#### Defined in

[src/elements/sliders/io-slider-base.ts:269](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L269)

___

### \_setLeft

▸ **_setLeft**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_setLeft](IoColorSliderBase.md#_setleft)

#### Defined in

[src/elements/sliders/io-slider-base.ts:303](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L303)

___

### \_setMax

▸ **_setMax**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_setMax](IoColorSliderBase.md#_setmax)

#### Defined in

[src/elements/sliders/io-slider-base.ts:287](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L287)

___

### \_setMin

▸ **_setMin**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_setMin](IoColorSliderBase.md#_setmin)

#### Defined in

[src/elements/sliders/io-slider-base.ts:283](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L283)

___

### \_setRight

▸ **_setRight**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_setRight](IoColorSliderBase.md#_setright)

#### Defined in

[src/elements/sliders/io-slider-base.ts:309](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L309)

___

### \_setUp

▸ **_setUp**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[_setUp](IoColorSliderBase.md#_setup)

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

[IoColorSliderBase](IoColorSliderBase.md).[addEventListener](IoColorSliderBase.md#addeventlistener)

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

[IoColorSliderBase](IoColorSliderBase.md).[applyProperties](IoColorSliderBase.md#applyproperties)

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

[IoColorSliderBase](IoColorSliderBase.md).[bind](IoColorSliderBase.md#bind)

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

[IoColorSliderBase](IoColorSliderBase.md).[changed](IoColorSliderBase.md#changed)

#### Defined in

[src/elements/sliders/io-slider-base.ts:318](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L318)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[connectedCallback](IoColorSliderBase.md#connectedcallback)

#### Defined in

[src/core/element.ts:213](https://github.com/io-gui/io/blob/main/src/core/element.ts#L213)

___

### disabledChanged

▸ **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[disabledChanged](IoColorSliderBase.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[disconnectedCallback](IoColorSliderBase.md#disconnectedcallback)

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

[IoColorSliderBase](IoColorSliderBase.md).[dispatchEvent](IoColorSliderBase.md#dispatchevent)

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

[IoColorSliderBase](IoColorSliderBase.md).[dispatchMutationEvent](IoColorSliderBase.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:384](https://github.com/io-gui/io/blob/main/src/core/node.ts#L384)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[dispatchQueue](IoColorSliderBase.md#dispatchqueue)

#### Defined in

[src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[dispatchQueueSync](IoColorSliderBase.md#dispatchqueuesync)

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

[IoColorSliderBase](IoColorSliderBase.md).[dispose](IoColorSliderBase.md#dispose)

#### Defined in

[src/core/node.ts:391](https://github.com/io-gui/io/blob/main/src/core/node.ts#L391)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[init](IoColorSliderBase.md#init)

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

[IoColorSliderBase](IoColorSliderBase.md).[initPropertyUniform](IoColorSliderBase.md#initpropertyuniform)

#### Defined in

[src/core/gl.ts:191](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L191)

___

### initShader

▸ **initShader**(): `WebGLProgram`

#### Returns

`WebGLProgram`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[initShader](IoColorSliderBase.md#initshader)

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

[IoColorSliderBase](IoColorSliderBase.md).[inputValue](IoColorSliderBase.md#inputvalue)

#### Defined in

[src/core/node.ts:234](https://github.com/io-gui/io/blob/main/src/core/node.ts#L234)

___

### labelChanged

▸ **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[labelChanged](IoColorSliderBase.md#labelchanged)

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

[IoColorSliderBase](IoColorSliderBase.md).[objectMutated](IoColorSliderBase.md#objectmutated)

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

[IoColorSliderBase](IoColorSliderBase.md).[onObjectMutated](IoColorSliderBase.md#onobjectmutated)

#### Defined in

[src/core/node.ts:287](https://github.com/io-gui/io/blob/main/src/core/node.ts#L287)

___

### onResized

▸ **onResized**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[onResized](IoColorSliderBase.md#onresized)

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

[IoColorSliderBase](IoColorSliderBase.md).[queue](IoColorSliderBase.md#queue)

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

[IoColorSliderBase](IoColorSliderBase.md).[removeEventListener](IoColorSliderBase.md#removeeventlistener)

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

[IoColorSliderBase](IoColorSliderBase.md).[setAttribute](IoColorSliderBase.md#setattribute)

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

[IoColorSliderBase](IoColorSliderBase.md).[setProperties](IoColorSliderBase.md#setproperties)

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

[IoColorSliderBase](IoColorSliderBase.md).[setProperty](IoColorSliderBase.md#setproperty)

#### Defined in

[src/core/node.ts:121](https://github.com/io-gui/io/blob/main/src/core/node.ts#L121)

___

### setShaderProgram

▸ **setShaderProgram**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[setShaderProgram](IoColorSliderBase.md#setshaderprogram)

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

[IoColorSliderBase](IoColorSliderBase.md).[setUniform](IoColorSliderBase.md#setuniform)

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

[IoColorSliderBase](IoColorSliderBase.md).[template](IoColorSliderBase.md#template)

#### Defined in

[src/core/element.ts:233](https://github.com/io-gui/io/blob/main/src/core/element.ts#L233)

___

### themeMutated

▸ **themeMutated**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[themeMutated](IoColorSliderBase.md#thememutated)

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

[IoColorSliderBase](IoColorSliderBase.md).[throttle](IoColorSliderBase.md#throttle)

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

[IoColorSliderBase](IoColorSliderBase.md).[traverse](IoColorSliderBase.md#traverse)

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

[IoColorSliderBase](IoColorSliderBase.md).[unbind](IoColorSliderBase.md#unbind)

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

[IoColorSliderBase](IoColorSliderBase.md).[updatePropertyUniform](IoColorSliderBase.md#updatepropertyuniform)

#### Defined in

[src/core/gl.ts:385](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L385)

___

### updateThemeUniforms

▸ **updateThemeUniforms**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorSliderBase](IoColorSliderBase.md).[updateThemeUniforms](IoColorSliderBase.md#updatethemeuniforms)

#### Defined in

[src/core/gl.ts:391](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L391)
