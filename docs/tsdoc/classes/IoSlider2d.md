[io-gui](../README.md) / IoSlider2d

# Class: IoSlider2d

Core `IoElement` class.

## Hierarchy

- [`IoSliderBase`](IoSliderBase.md)

  ↳ **`IoSlider2d`**

  ↳↳ [`IoColorSlider2dBase`](IoColorSlider2dBase.md)

## Table of contents

### Constructors

- [constructor](IoSlider2d.md#constructor)

### Properties

- [$](IoSlider2d.md#$)
- [\_active](IoSlider2d.md#_active)
- [\_bindings](IoSlider2d.md#_bindings)
- [\_changeQueue](IoSlider2d.md#_changequeue)
- [\_eventDispatcher](IoSlider2d.md#_eventdispatcher)
- [\_properties](IoSlider2d.md#_properties)
- [\_protochain](IoSlider2d.md#_protochain)
- [\_rect](IoSlider2d.md#_rect)
- [\_startX](IoSlider2d.md#_startx)
- [\_startY](IoSlider2d.md#_starty)
- [class](IoSlider2d.md#class)
- [color](IoSlider2d.md#color)
- [contenteditable](IoSlider2d.md#contenteditable)
- [disabled](IoSlider2d.md#disabled)
- [exponent](IoSlider2d.md#exponent)
- [hidden](IoSlider2d.md#hidden)
- [id](IoSlider2d.md#id)
- [label](IoSlider2d.md#label)
- [lazy](IoSlider2d.md#lazy)
- [max](IoSlider2d.md#max)
- [min](IoSlider2d.md#min)
- [name](IoSlider2d.md#name)
- [noscroll](IoSlider2d.md#noscroll)
- [pxRatio](IoSlider2d.md#pxratio)
- [role](IoSlider2d.md#role)
- [size](IoSlider2d.md#size)
- [step](IoSlider2d.md#step)
- [tabindex](IoSlider2d.md#tabindex)
- [theme](IoSlider2d.md#theme)
- [title](IoSlider2d.md#title)
- [value](IoSlider2d.md#value)
- [vertical](IoSlider2d.md#vertical)

### Accessors

- [\_max](IoSlider2d.md#_max)
- [\_min](IoSlider2d.md#_min)
- [\_step](IoSlider2d.md#_step)
- [\_value](IoSlider2d.md#_value)
- [textNode](IoSlider2d.md#textnode)
- [Frag](IoSlider2d.md#frag)
- [GlUtils](IoSlider2d.md#glutils)
- [Listeners](IoSlider2d.md#listeners)
- [Properties](IoSlider2d.md#properties)
- [Style](IoSlider2d.md#style)
- [Vert](IoSlider2d.md#vert)

### Methods

- [Register](IoSlider2d.md#register)
- [\_flattenTextNode](IoSlider2d.md#_flattentextnode)
- [\_getPointerCoord](IoSlider2d.md#_getpointercoord)
- [\_getValueFromCoord](IoSlider2d.md#_getvaluefromcoord)
- [\_inputValue](IoSlider2d.md#_inputvalue)
- [\_onBlur](IoSlider2d.md#_onblur)
- [\_onContextmenu](IoSlider2d.md#_oncontextmenu)
- [\_onFocus](IoSlider2d.md#_onfocus)
- [\_onKeydown](IoSlider2d.md#_onkeydown)
- [\_onPointerdown](IoSlider2d.md#_onpointerdown)
- [\_onPointermove](IoSlider2d.md#_onpointermove)
- [\_onPointermoveThrottled](IoSlider2d.md#_onpointermovethrottled)
- [\_onPointerup](IoSlider2d.md#_onpointerup)
- [\_onRender](IoSlider2d.md#_onrender)
- [\_onTouchend](IoSlider2d.md#_ontouchend)
- [\_onTouchmove](IoSlider2d.md#_ontouchmove)
- [\_onTouchstart](IoSlider2d.md#_ontouchstart)
- [\_setDecrease](IoSlider2d.md#_setdecrease)
- [\_setDown](IoSlider2d.md#_setdown)
- [\_setIncrease](IoSlider2d.md#_setincrease)
- [\_setLeft](IoSlider2d.md#_setleft)
- [\_setMax](IoSlider2d.md#_setmax)
- [\_setMin](IoSlider2d.md#_setmin)
- [\_setRight](IoSlider2d.md#_setright)
- [\_setUp](IoSlider2d.md#_setup)
- [addEventListener](IoSlider2d.md#addeventlistener)
- [applyProperties](IoSlider2d.md#applyproperties)
- [bind](IoSlider2d.md#bind)
- [changed](IoSlider2d.md#changed)
- [connectedCallback](IoSlider2d.md#connectedcallback)
- [disabledChanged](IoSlider2d.md#disabledchanged)
- [disconnectedCallback](IoSlider2d.md#disconnectedcallback)
- [dispatchEvent](IoSlider2d.md#dispatchevent)
- [dispatchMutationEvent](IoSlider2d.md#dispatchmutationevent)
- [dispatchQueue](IoSlider2d.md#dispatchqueue)
- [dispatchQueueSync](IoSlider2d.md#dispatchqueuesync)
- [dispose](IoSlider2d.md#dispose)
- [init](IoSlider2d.md#init)
- [initPropertyUniform](IoSlider2d.md#initpropertyuniform)
- [initShader](IoSlider2d.md#initshader)
- [inputValue](IoSlider2d.md#inputvalue)
- [labelChanged](IoSlider2d.md#labelchanged)
- [objectMutated](IoSlider2d.md#objectmutated)
- [onObjectMutated](IoSlider2d.md#onobjectmutated)
- [onResized](IoSlider2d.md#onresized)
- [queue](IoSlider2d.md#queue)
- [removeEventListener](IoSlider2d.md#removeeventlistener)
- [setAttribute](IoSlider2d.md#setattribute)
- [setProperties](IoSlider2d.md#setproperties)
- [setProperty](IoSlider2d.md#setproperty)
- [setShaderProgram](IoSlider2d.md#setshaderprogram)
- [setUniform](IoSlider2d.md#setuniform)
- [template](IoSlider2d.md#template)
- [themeMutated](IoSlider2d.md#thememutated)
- [throttle](IoSlider2d.md#throttle)
- [traverse](IoSlider2d.md#traverse)
- [unbind](IoSlider2d.md#unbind)
- [updatePropertyUniform](IoSlider2d.md#updatepropertyuniform)
- [updateThemeUniforms](IoSlider2d.md#updatethemeuniforms)

## Constructors

### constructor

• **new IoSlider2d**(`properties?`): [`IoSlider2d`](IoSlider2d.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | `Record`\<`string`, `any`\> |

#### Returns

[`IoSlider2d`](IoSlider2d.md)

#### Inherited from

[IoSliderBase](IoSliderBase.md).[constructor](IoSliderBase.md#constructor)

#### Defined in

[src/core/gl.ts:259](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L259)

## Properties

### $

• **$**: `Record`\<`string`, `any`\>

#### Inherited from

[IoSliderBase](IoSliderBase.md).[$](IoSliderBase.md#$)

#### Defined in

[src/core/element.ts:178](https://github.com/io-gui/io/blob/main/src/core/element.ts#L178)

___

### \_active

• **\_active**: `number` = `-1`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_active](IoSliderBase.md#_active)

#### Defined in

[src/elements/sliders/io-slider-base.ts:65](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L65)

___

### \_bindings

• `Readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_bindings](IoSliderBase.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_changeQueue](IoSliderBase.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_eventDispatcher](IoSliderBase.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

___

### \_properties

• `Readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_properties](IoSliderBase.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_protochain](IoSliderBase.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

___

### \_rect

• **\_rect**: ``null`` \| `DOMRect` = `null`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_rect](IoSliderBase.md#_rect)

#### Defined in

[src/elements/sliders/io-slider-base.ts:66](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L66)

___

### \_startX

• **\_startX**: `number` = `0`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_startX](IoSliderBase.md#_startx)

#### Defined in

[src/elements/sliders/io-slider-base.ts:63](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L63)

___

### \_startY

• **\_startY**: `number` = `0`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_startY](IoSliderBase.md#_starty)

#### Defined in

[src/elements/sliders/io-slider-base.ts:64](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L64)

___

### class

• **class**: `string`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[class](IoSliderBase.md#class)

#### Defined in

[src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

___

### color

• **color**: [`number`, `number`, `number`, `number`]

#### Inherited from

[IoSliderBase](IoSliderBase.md).[color](IoSliderBase.md#color)

#### Defined in

[src/core/gl.ts:69](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L69)

___

### contenteditable

• **contenteditable**: `boolean`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[contenteditable](IoSliderBase.md#contenteditable)

#### Defined in

[src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

___

### disabled

• **disabled**: `boolean`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[disabled](IoSliderBase.md#disabled)

#### Defined in

[src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

___

### exponent

• **exponent**: `number`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[exponent](IoSliderBase.md#exponent)

#### Defined in

[src/elements/sliders/io-slider-base.ts:46](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L46)

___

### hidden

• **hidden**: `boolean`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[hidden](IoSliderBase.md#hidden)

#### Defined in

[src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

___

### id

• **id**: `string`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[id](IoSliderBase.md#id)

#### Defined in

[src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

___

### label

• **label**: `string`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[label](IoSliderBase.md#label)

#### Defined in

[src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

___

### lazy

• **lazy**: `boolean`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[lazy](IoSliderBase.md#lazy)

#### Defined in

[src/elements/sliders/io-slider-base.ts:61](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L61)

___

### max

• **max**: [`number`, `number`]

#### Overrides

[IoSliderBase](IoSliderBase.md).[max](IoSliderBase.md#max)

#### Defined in

[src/elements/sliders/io-slider-2d.ts:37](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L37)

___

### min

• **min**: [`number`, `number`]

#### Overrides

[IoSliderBase](IoSliderBase.md).[min](IoSliderBase.md#min)

#### Defined in

[src/elements/sliders/io-slider-2d.ts:34](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L34)

___

### name

• **name**: `string`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[name](IoSliderBase.md#name)

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

___

### noscroll

• **noscroll**: `boolean`

#### Overrides

[IoSliderBase](IoSliderBase.md).[noscroll](IoSliderBase.md#noscroll)

#### Defined in

[src/elements/sliders/io-slider-2d.ts:40](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L40)

___

### pxRatio

• **pxRatio**: `number`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[pxRatio](IoSliderBase.md#pxratio)

#### Defined in

[src/core/gl.ts:72](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L72)

___

### role

• **role**: `string`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[role](IoSliderBase.md#role)

#### Defined in

[src/elements/sliders/io-slider-base.ts:55](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L55)

___

### size

• **size**: [`number`, `number`]

#### Inherited from

[IoSliderBase](IoSliderBase.md).[size](IoSliderBase.md#size)

#### Defined in

[src/core/gl.ts:66](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L66)

___

### step

• **step**: [`number`, `number`]

#### Overrides

[IoSliderBase](IoSliderBase.md).[step](IoSliderBase.md#step)

#### Defined in

[src/elements/sliders/io-slider-2d.ts:31](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L31)

___

### tabindex

• **tabindex**: `string`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[tabindex](IoSliderBase.md#tabindex)

#### Defined in

[src/elements/sliders/io-slider-base.ts:58](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L58)

___

### theme

• **theme**: `IoTheme`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[theme](IoSliderBase.md#theme)

#### Defined in

[src/core/gl.ts:75](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L75)

___

### title

• **title**: `string`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[title](IoSliderBase.md#title)

#### Defined in

[src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

___

### value

• **value**: [`number`, `number`]

#### Overrides

[IoSliderBase](IoSliderBase.md).[value](IoSliderBase.md#value)

#### Defined in

[src/elements/sliders/io-slider-2d.ts:28](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L28)

___

### vertical

• **vertical**: `boolean`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[vertical](IoSliderBase.md#vertical)

#### Defined in

[src/elements/sliders/io-slider-base.ts:49](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L49)

## Accessors

### \_max

• `get` **_max**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSliderBase.\_max

#### Defined in

[src/elements/sliders/io-slider-base.ts:79](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L79)

___

### \_min

• `get` **_min**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSliderBase.\_min

#### Defined in

[src/elements/sliders/io-slider-base.ts:68](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L68)

___

### \_step

• `get` **_step**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSliderBase.\_step

#### Defined in

[src/elements/sliders/io-slider-base.ts:90](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L90)

___

### \_value

• `get` **_value**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSliderBase.\_value

#### Defined in

[src/elements/sliders/io-slider-base.ts:101](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L101)

___

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoSliderBase.textNode

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

IoSliderBase.textNode

#### Defined in

[src/core/element.ts:396](https://github.com/io-gui/io/blob/main/src/core/element.ts#L396)

___

### Frag

• `get` **Frag**(): `string`

#### Returns

`string`

#### Overrides

IoSliderBase.Frag

#### Defined in

[src/elements/sliders/io-slider-2d.ts:58](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L58)

___

### GlUtils

• `get` **GlUtils**(): `string`

#### Returns

`string`

#### Overrides

IoSliderBase.GlUtils

#### Defined in

[src/elements/sliders/io-slider-2d.ts:42](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L42)

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

IoSliderBase.Listeners

#### Defined in

[src/elements/sliders/io-slider-base.ts:112](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L112)

___

### Properties

• `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoSliderBase.Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

___

### Style

• `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoSliderBase.Style

#### Defined in

[src/elements/sliders/io-slider-2d.ts:7](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-2d.ts#L7)

___

### Vert

• `get` **Vert**(): `string`

#### Returns

`string`

#### Inherited from

IoSliderBase.Vert

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

[IoSliderBase](IoSliderBase.md).[Register](IoSliderBase.md#register)

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

[IoSliderBase](IoSliderBase.md).[_flattenTextNode](IoSliderBase.md#_flattentextnode)

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

[IoSliderBase](IoSliderBase.md).[_getPointerCoord](IoSliderBase.md#_getpointercoord)

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

[IoSliderBase](IoSliderBase.md).[_getValueFromCoord](IoSliderBase.md#_getvaluefromcoord)

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

[IoSliderBase](IoSliderBase.md).[_inputValue](IoSliderBase.md#_inputvalue)

#### Defined in

[src/elements/sliders/io-slider-base.ts:203](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L203)

___

### \_onBlur

▸ **_onBlur**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_onBlur](IoSliderBase.md#_onblur)

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

[IoSliderBase](IoSliderBase.md).[_onContextmenu](IoSliderBase.md#_oncontextmenu)

#### Defined in

[src/elements/sliders/io-slider-base.ts:128](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L128)

___

### \_onFocus

▸ **_onFocus**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_onFocus](IoSliderBase.md#_onfocus)

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

[IoSliderBase](IoSliderBase.md).[_onKeydown](IoSliderBase.md#_onkeydown)

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

[IoSliderBase](IoSliderBase.md).[_onPointerdown](IoSliderBase.md#_onpointerdown)

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

[IoSliderBase](IoSliderBase.md).[_onPointermove](IoSliderBase.md#_onpointermove)

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

[IoSliderBase](IoSliderBase.md).[_onPointermoveThrottled](IoSliderBase.md#_onpointermovethrottled)

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

[IoSliderBase](IoSliderBase.md).[_onPointerup](IoSliderBase.md#_onpointerup)

#### Defined in

[src/elements/sliders/io-slider-base.ts:172](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L172)

___

### \_onRender

▸ **_onRender**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_onRender](IoSliderBase.md#_onrender)

#### Defined in

[src/core/gl.ts:344](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L344)

___

### \_onTouchend

▸ **_onTouchend**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_onTouchend](IoSliderBase.md#_ontouchend)

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

[IoSliderBase](IoSliderBase.md).[_onTouchmove](IoSliderBase.md#_ontouchmove)

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

[IoSliderBase](IoSliderBase.md).[_onTouchstart](IoSliderBase.md#_ontouchstart)

#### Defined in

[src/elements/sliders/io-slider-base.ts:131](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L131)

___

### \_setDecrease

▸ **_setDecrease**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_setDecrease](IoSliderBase.md#_setdecrease)

#### Defined in

[src/elements/sliders/io-slider-base.ts:276](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L276)

___

### \_setDown

▸ **_setDown**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_setDown](IoSliderBase.md#_setdown)

#### Defined in

[src/elements/sliders/io-slider-base.ts:297](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L297)

___

### \_setIncrease

▸ **_setIncrease**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_setIncrease](IoSliderBase.md#_setincrease)

#### Defined in

[src/elements/sliders/io-slider-base.ts:269](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L269)

___

### \_setLeft

▸ **_setLeft**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_setLeft](IoSliderBase.md#_setleft)

#### Defined in

[src/elements/sliders/io-slider-base.ts:303](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L303)

___

### \_setMax

▸ **_setMax**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_setMax](IoSliderBase.md#_setmax)

#### Defined in

[src/elements/sliders/io-slider-base.ts:287](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L287)

___

### \_setMin

▸ **_setMin**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_setMin](IoSliderBase.md#_setmin)

#### Defined in

[src/elements/sliders/io-slider-base.ts:283](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L283)

___

### \_setRight

▸ **_setRight**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_setRight](IoSliderBase.md#_setright)

#### Defined in

[src/elements/sliders/io-slider-base.ts:309](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L309)

___

### \_setUp

▸ **_setUp**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_setUp](IoSliderBase.md#_setup)

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

[IoSliderBase](IoSliderBase.md).[addEventListener](IoSliderBase.md#addeventlistener)

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

[IoSliderBase](IoSliderBase.md).[applyProperties](IoSliderBase.md#applyproperties)

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

[IoSliderBase](IoSliderBase.md).[bind](IoSliderBase.md#bind)

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

[IoSliderBase](IoSliderBase.md).[changed](IoSliderBase.md#changed)

#### Defined in

[src/elements/sliders/io-slider-base.ts:318](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L318)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[connectedCallback](IoSliderBase.md#connectedcallback)

#### Defined in

[src/core/element.ts:213](https://github.com/io-gui/io/blob/main/src/core/element.ts#L213)

___

### disabledChanged

▸ **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[disabledChanged](IoSliderBase.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[disconnectedCallback](IoSliderBase.md#disconnectedcallback)

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

[IoSliderBase](IoSliderBase.md).[dispatchEvent](IoSliderBase.md#dispatchevent)

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

[IoSliderBase](IoSliderBase.md).[dispatchMutationEvent](IoSliderBase.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:384](https://github.com/io-gui/io/blob/main/src/core/node.ts#L384)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[dispatchQueue](IoSliderBase.md#dispatchqueue)

#### Defined in

[src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[dispatchQueueSync](IoSliderBase.md#dispatchqueuesync)

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

[IoSliderBase](IoSliderBase.md).[dispose](IoSliderBase.md#dispose)

#### Defined in

[src/core/node.ts:391](https://github.com/io-gui/io/blob/main/src/core/node.ts#L391)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[init](IoSliderBase.md#init)

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

[IoSliderBase](IoSliderBase.md).[initPropertyUniform](IoSliderBase.md#initpropertyuniform)

#### Defined in

[src/core/gl.ts:191](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L191)

___

### initShader

▸ **initShader**(): `WebGLProgram`

#### Returns

`WebGLProgram`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[initShader](IoSliderBase.md#initshader)

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

[IoSliderBase](IoSliderBase.md).[inputValue](IoSliderBase.md#inputvalue)

#### Defined in

[src/core/node.ts:234](https://github.com/io-gui/io/blob/main/src/core/node.ts#L234)

___

### labelChanged

▸ **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[labelChanged](IoSliderBase.md#labelchanged)

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

[IoSliderBase](IoSliderBase.md).[objectMutated](IoSliderBase.md#objectmutated)

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

[IoSliderBase](IoSliderBase.md).[onObjectMutated](IoSliderBase.md#onobjectmutated)

#### Defined in

[src/core/node.ts:287](https://github.com/io-gui/io/blob/main/src/core/node.ts#L287)

___

### onResized

▸ **onResized**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[onResized](IoSliderBase.md#onresized)

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

[IoSliderBase](IoSliderBase.md).[queue](IoSliderBase.md#queue)

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

[IoSliderBase](IoSliderBase.md).[removeEventListener](IoSliderBase.md#removeeventlistener)

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

[IoSliderBase](IoSliderBase.md).[setAttribute](IoSliderBase.md#setattribute)

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

[IoSliderBase](IoSliderBase.md).[setProperties](IoSliderBase.md#setproperties)

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

[IoSliderBase](IoSliderBase.md).[setProperty](IoSliderBase.md#setproperty)

#### Defined in

[src/core/node.ts:121](https://github.com/io-gui/io/blob/main/src/core/node.ts#L121)

___

### setShaderProgram

▸ **setShaderProgram**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[setShaderProgram](IoSliderBase.md#setshaderprogram)

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

[IoSliderBase](IoSliderBase.md).[setUniform](IoSliderBase.md#setuniform)

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

[IoSliderBase](IoSliderBase.md).[template](IoSliderBase.md#template)

#### Defined in

[src/core/element.ts:233](https://github.com/io-gui/io/blob/main/src/core/element.ts#L233)

___

### themeMutated

▸ **themeMutated**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[themeMutated](IoSliderBase.md#thememutated)

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

[IoSliderBase](IoSliderBase.md).[throttle](IoSliderBase.md#throttle)

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

[IoSliderBase](IoSliderBase.md).[traverse](IoSliderBase.md#traverse)

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

[IoSliderBase](IoSliderBase.md).[unbind](IoSliderBase.md#unbind)

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

[IoSliderBase](IoSliderBase.md).[updatePropertyUniform](IoSliderBase.md#updatepropertyuniform)

#### Defined in

[src/core/gl.ts:385](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L385)

___

### updateThemeUniforms

▸ **updateThemeUniforms**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[updateThemeUniforms](IoSliderBase.md#updatethemeuniforms)

#### Defined in

[src/core/gl.ts:391](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L391)
