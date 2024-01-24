[io-gui](../README.md) / IoSliderBase

# Class: IoSliderBase

Core `IoElement` class.

## Hierarchy

- [`IoGl`](IoGl.md)

  ↳ **`IoSliderBase`**

  ↳↳ [`IoSlider2d`](IoSlider2d.md)

  ↳↳ [`IoSliderRange`](IoSliderRange.md)

  ↳↳ [`IoSlider`](IoSlider.md)

## Table of contents

### Constructors

- [constructor](IoSliderBase.md#constructor)

### Properties

- [$](IoSliderBase.md#$)
- [\_active](IoSliderBase.md#_active)
- [\_bindings](IoSliderBase.md#_bindings)
- [\_changeQueue](IoSliderBase.md#_changequeue)
- [\_eventDispatcher](IoSliderBase.md#_eventdispatcher)
- [\_properties](IoSliderBase.md#_properties)
- [\_protochain](IoSliderBase.md#_protochain)
- [\_rect](IoSliderBase.md#_rect)
- [\_startX](IoSliderBase.md#_startx)
- [\_startY](IoSliderBase.md#_starty)
- [class](IoSliderBase.md#class)
- [color](IoSliderBase.md#color)
- [contenteditable](IoSliderBase.md#contenteditable)
- [disabled](IoSliderBase.md#disabled)
- [exponent](IoSliderBase.md#exponent)
- [hidden](IoSliderBase.md#hidden)
- [id](IoSliderBase.md#id)
- [label](IoSliderBase.md#label)
- [lazy](IoSliderBase.md#lazy)
- [max](IoSliderBase.md#max)
- [min](IoSliderBase.md#min)
- [name](IoSliderBase.md#name)
- [noscroll](IoSliderBase.md#noscroll)
- [pxRatio](IoSliderBase.md#pxratio)
- [role](IoSliderBase.md#role)
- [size](IoSliderBase.md#size)
- [step](IoSliderBase.md#step)
- [tabindex](IoSliderBase.md#tabindex)
- [theme](IoSliderBase.md#theme)
- [title](IoSliderBase.md#title)
- [value](IoSliderBase.md#value)
- [vertical](IoSliderBase.md#vertical)

### Accessors

- [\_max](IoSliderBase.md#_max)
- [\_min](IoSliderBase.md#_min)
- [\_step](IoSliderBase.md#_step)
- [\_value](IoSliderBase.md#_value)
- [textNode](IoSliderBase.md#textnode)
- [Frag](IoSliderBase.md#frag)
- [GlUtils](IoSliderBase.md#glutils)
- [Listeners](IoSliderBase.md#listeners)
- [Properties](IoSliderBase.md#properties)
- [Style](IoSliderBase.md#style)
- [Vert](IoSliderBase.md#vert)

### Methods

- [Register](IoSliderBase.md#register)
- [\_flattenTextNode](IoSliderBase.md#_flattentextnode)
- [\_getPointerCoord](IoSliderBase.md#_getpointercoord)
- [\_getValueFromCoord](IoSliderBase.md#_getvaluefromcoord)
- [\_inputValue](IoSliderBase.md#_inputvalue)
- [\_onBlur](IoSliderBase.md#_onblur)
- [\_onContextmenu](IoSliderBase.md#_oncontextmenu)
- [\_onFocus](IoSliderBase.md#_onfocus)
- [\_onKeydown](IoSliderBase.md#_onkeydown)
- [\_onPointerdown](IoSliderBase.md#_onpointerdown)
- [\_onPointermove](IoSliderBase.md#_onpointermove)
- [\_onPointermoveThrottled](IoSliderBase.md#_onpointermovethrottled)
- [\_onPointerup](IoSliderBase.md#_onpointerup)
- [\_onRender](IoSliderBase.md#_onrender)
- [\_onTouchend](IoSliderBase.md#_ontouchend)
- [\_onTouchmove](IoSliderBase.md#_ontouchmove)
- [\_onTouchstart](IoSliderBase.md#_ontouchstart)
- [\_setDecrease](IoSliderBase.md#_setdecrease)
- [\_setDown](IoSliderBase.md#_setdown)
- [\_setIncrease](IoSliderBase.md#_setincrease)
- [\_setLeft](IoSliderBase.md#_setleft)
- [\_setMax](IoSliderBase.md#_setmax)
- [\_setMin](IoSliderBase.md#_setmin)
- [\_setRight](IoSliderBase.md#_setright)
- [\_setUp](IoSliderBase.md#_setup)
- [addEventListener](IoSliderBase.md#addeventlistener)
- [applyProperties](IoSliderBase.md#applyproperties)
- [bind](IoSliderBase.md#bind)
- [changed](IoSliderBase.md#changed)
- [connectedCallback](IoSliderBase.md#connectedcallback)
- [disabledChanged](IoSliderBase.md#disabledchanged)
- [disconnectedCallback](IoSliderBase.md#disconnectedcallback)
- [dispatchEvent](IoSliderBase.md#dispatchevent)
- [dispatchMutationEvent](IoSliderBase.md#dispatchmutationevent)
- [dispatchQueue](IoSliderBase.md#dispatchqueue)
- [dispatchQueueSync](IoSliderBase.md#dispatchqueuesync)
- [dispose](IoSliderBase.md#dispose)
- [init](IoSliderBase.md#init)
- [initPropertyUniform](IoSliderBase.md#initpropertyuniform)
- [initShader](IoSliderBase.md#initshader)
- [inputValue](IoSliderBase.md#inputvalue)
- [labelChanged](IoSliderBase.md#labelchanged)
- [objectMutated](IoSliderBase.md#objectmutated)
- [onObjectMutated](IoSliderBase.md#onobjectmutated)
- [onResized](IoSliderBase.md#onresized)
- [queue](IoSliderBase.md#queue)
- [removeEventListener](IoSliderBase.md#removeeventlistener)
- [setAttribute](IoSliderBase.md#setattribute)
- [setProperties](IoSliderBase.md#setproperties)
- [setProperty](IoSliderBase.md#setproperty)
- [setShaderProgram](IoSliderBase.md#setshaderprogram)
- [setUniform](IoSliderBase.md#setuniform)
- [template](IoSliderBase.md#template)
- [themeMutated](IoSliderBase.md#thememutated)
- [throttle](IoSliderBase.md#throttle)
- [traverse](IoSliderBase.md#traverse)
- [unbind](IoSliderBase.md#unbind)
- [updatePropertyUniform](IoSliderBase.md#updatepropertyuniform)
- [updateThemeUniforms](IoSliderBase.md#updatethemeuniforms)

## Constructors

### constructor

• **new IoSliderBase**(`properties?`): [`IoSliderBase`](IoSliderBase.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | `Record`\<`string`, `any`\> |

#### Returns

[`IoSliderBase`](IoSliderBase.md)

#### Inherited from

[IoGl](IoGl.md).[constructor](IoGl.md#constructor)

#### Defined in

[src/core/gl.ts:259](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L259)

## Properties

### $

• **$**: `Record`\<`string`, `any`\>

#### Inherited from

[IoGl](IoGl.md).[$](IoGl.md#$)

#### Defined in

[src/core/element.ts:178](https://github.com/io-gui/io/blob/main/src/core/element.ts#L178)

___

### \_active

• **\_active**: `number` = `-1`

#### Defined in

[src/elements/sliders/io-slider-base.ts:65](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L65)

___

### \_bindings

• `Readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoGl](IoGl.md).[_bindings](IoGl.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoGl](IoGl.md).[_changeQueue](IoGl.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoGl](IoGl.md).[_eventDispatcher](IoGl.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

___

### \_properties

• `Readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoGl](IoGl.md).[_properties](IoGl.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoGl](IoGl.md).[_protochain](IoGl.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

___

### \_rect

• **\_rect**: ``null`` \| `DOMRect` = `null`

#### Defined in

[src/elements/sliders/io-slider-base.ts:66](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L66)

___

### \_startX

• **\_startX**: `number` = `0`

#### Defined in

[src/elements/sliders/io-slider-base.ts:63](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L63)

___

### \_startY

• **\_startY**: `number` = `0`

#### Defined in

[src/elements/sliders/io-slider-base.ts:64](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L64)

___

### class

• **class**: `string`

#### Inherited from

[IoGl](IoGl.md).[class](IoGl.md#class)

#### Defined in

[src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

___

### color

• **color**: [`number`, `number`, `number`, `number`]

#### Inherited from

[IoGl](IoGl.md).[color](IoGl.md#color)

#### Defined in

[src/core/gl.ts:69](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L69)

___

### contenteditable

• **contenteditable**: `boolean`

#### Inherited from

[IoGl](IoGl.md).[contenteditable](IoGl.md#contenteditable)

#### Defined in

[src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

___

### disabled

• **disabled**: `boolean`

#### Inherited from

[IoGl](IoGl.md).[disabled](IoGl.md#disabled)

#### Defined in

[src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

___

### exponent

• **exponent**: `number`

#### Defined in

[src/elements/sliders/io-slider-base.ts:46](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L46)

___

### hidden

• **hidden**: `boolean`

#### Inherited from

[IoGl](IoGl.md).[hidden](IoGl.md#hidden)

#### Defined in

[src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

___

### id

• **id**: `string`

#### Inherited from

[IoGl](IoGl.md).[id](IoGl.md#id)

#### Defined in

[src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

___

### label

• **label**: `string`

#### Inherited from

[IoGl](IoGl.md).[label](IoGl.md#label)

#### Defined in

[src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

___

### lazy

• **lazy**: `boolean`

#### Defined in

[src/elements/sliders/io-slider-base.ts:61](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L61)

___

### max

• **max**: `number` \| [`number`, `number`] \| \{ `x`: `number` ; `y`: `number`  }

#### Defined in

[src/elements/sliders/io-slider-base.ts:43](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L43)

___

### min

• **min**: `number` \| [`number`, `number`] \| \{ `x`: `number` ; `y`: `number`  }

#### Defined in

[src/elements/sliders/io-slider-base.ts:40](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L40)

___

### name

• **name**: `string`

#### Inherited from

[IoGl](IoGl.md).[name](IoGl.md#name)

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

___

### noscroll

• **noscroll**: `boolean`

#### Defined in

[src/elements/sliders/io-slider-base.ts:52](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L52)

___

### pxRatio

• **pxRatio**: `number`

#### Inherited from

[IoGl](IoGl.md).[pxRatio](IoGl.md#pxratio)

#### Defined in

[src/core/gl.ts:72](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L72)

___

### role

• **role**: `string`

#### Overrides

[IoGl](IoGl.md).[role](IoGl.md#role)

#### Defined in

[src/elements/sliders/io-slider-base.ts:55](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L55)

___

### size

• **size**: [`number`, `number`]

#### Inherited from

[IoGl](IoGl.md).[size](IoGl.md#size)

#### Defined in

[src/core/gl.ts:66](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L66)

___

### step

• **step**: `number` \| [`number`, `number`] \| \{ `x`: `number` ; `y`: `number`  }

#### Defined in

[src/elements/sliders/io-slider-base.ts:37](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L37)

___

### tabindex

• **tabindex**: `string`

#### Overrides

[IoGl](IoGl.md).[tabindex](IoGl.md#tabindex)

#### Defined in

[src/elements/sliders/io-slider-base.ts:58](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L58)

___

### theme

• **theme**: `IoTheme`

#### Inherited from

[IoGl](IoGl.md).[theme](IoGl.md#theme)

#### Defined in

[src/core/gl.ts:75](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L75)

___

### title

• **title**: `string`

#### Inherited from

[IoGl](IoGl.md).[title](IoGl.md#title)

#### Defined in

[src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

___

### value

• **value**: `number` \| [`number`, `number`] \| \{ `x`: `number` ; `y`: `number`  }

#### Defined in

[src/elements/sliders/io-slider-base.ts:34](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L34)

___

### vertical

• **vertical**: `boolean`

#### Defined in

[src/elements/sliders/io-slider-base.ts:49](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L49)

## Accessors

### \_max

• `get` **_max**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Defined in

[src/elements/sliders/io-slider-base.ts:79](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L79)

___

### \_min

• `get` **_min**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Defined in

[src/elements/sliders/io-slider-base.ts:68](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L68)

___

### \_step

• `get` **_step**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Defined in

[src/elements/sliders/io-slider-base.ts:90](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L90)

___

### \_value

• `get` **_value**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Defined in

[src/elements/sliders/io-slider-base.ts:101](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L101)

___

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoGl.textNode

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

IoGl.textNode

#### Defined in

[src/core/element.ts:396](https://github.com/io-gui/io/blob/main/src/core/element.ts#L396)

___

### Frag

• `get` **Frag**(): `string`

#### Returns

`string`

#### Inherited from

IoGl.Frag

#### Defined in

[src/core/gl.ts:179](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L179)

___

### GlUtils

• `get` **GlUtils**(): `string`

#### Returns

`string`

#### Inherited from

IoGl.GlUtils

#### Defined in

[src/core/gl.ts:92](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L92)

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

#### Defined in

[src/elements/sliders/io-slider-base.ts:112](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L112)

___

### Properties

• `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoGl.Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

___

### Style

• `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoGl.Style

#### Defined in

[src/elements/sliders/io-slider-base.ts:9](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L9)

___

### Vert

• `get` **Vert**(): `string`

#### Returns

`string`

#### Inherited from

IoGl.Vert

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

[IoGl](IoGl.md).[Register](IoGl.md#register)

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

[IoGl](IoGl.md).[_flattenTextNode](IoGl.md#_flattentextnode)

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

#### Defined in

[src/elements/sliders/io-slider-base.ts:203](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L203)

___

### \_onBlur

▸ **_onBlur**(): `void`

#### Returns

`void`

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

#### Defined in

[src/elements/sliders/io-slider-base.ts:128](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L128)

___

### \_onFocus

▸ **_onFocus**(): `void`

#### Returns

`void`

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

#### Defined in

[src/elements/sliders/io-slider-base.ts:172](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L172)

___

### \_onRender

▸ **_onRender**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[_onRender](IoGl.md#_onrender)

#### Defined in

[src/core/gl.ts:344](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L344)

___

### \_onTouchend

▸ **_onTouchend**(): `void`

#### Returns

`void`

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

#### Defined in

[src/elements/sliders/io-slider-base.ts:131](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L131)

___

### \_setDecrease

▸ **_setDecrease**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:276](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L276)

___

### \_setDown

▸ **_setDown**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:297](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L297)

___

### \_setIncrease

▸ **_setIncrease**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:269](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L269)

___

### \_setLeft

▸ **_setLeft**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:303](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L303)

___

### \_setMax

▸ **_setMax**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:287](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L287)

___

### \_setMin

▸ **_setMin**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:283](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L283)

___

### \_setRight

▸ **_setRight**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/sliders/io-slider-base.ts:309](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L309)

___

### \_setUp

▸ **_setUp**(): `void`

#### Returns

`void`

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

[IoGl](IoGl.md).[addEventListener](IoGl.md#addeventlistener)

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

[IoGl](IoGl.md).[applyProperties](IoGl.md#applyproperties)

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

[IoGl](IoGl.md).[bind](IoGl.md#bind)

#### Defined in

[src/core/node.ts:319](https://github.com/io-gui/io/blob/main/src/core/node.ts#L319)

___

### changed

▸ **changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

[IoGl](IoGl.md).[changed](IoGl.md#changed)

#### Defined in

[src/elements/sliders/io-slider-base.ts:318](https://github.com/io-gui/io/blob/main/src/elements/sliders/io-slider-base.ts#L318)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[connectedCallback](IoGl.md#connectedcallback)

#### Defined in

[src/core/element.ts:213](https://github.com/io-gui/io/blob/main/src/core/element.ts#L213)

___

### disabledChanged

▸ **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[disabledChanged](IoGl.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[disconnectedCallback](IoGl.md#disconnectedcallback)

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

[IoGl](IoGl.md).[dispatchEvent](IoGl.md#dispatchevent)

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

[IoGl](IoGl.md).[dispatchMutationEvent](IoGl.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:384](https://github.com/io-gui/io/blob/main/src/core/node.ts#L384)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[dispatchQueue](IoGl.md#dispatchqueue)

#### Defined in

[src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[dispatchQueueSync](IoGl.md#dispatchqueuesync)

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

[IoGl](IoGl.md).[dispose](IoGl.md#dispose)

#### Defined in

[src/core/node.ts:391](https://github.com/io-gui/io/blob/main/src/core/node.ts#L391)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Overrides

[IoGl](IoGl.md).[init](IoGl.md#init)

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

[IoGl](IoGl.md).[initPropertyUniform](IoGl.md#initpropertyuniform)

#### Defined in

[src/core/gl.ts:191](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L191)

___

### initShader

▸ **initShader**(): `WebGLProgram`

#### Returns

`WebGLProgram`

#### Inherited from

[IoGl](IoGl.md).[initShader](IoGl.md#initshader)

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

[IoGl](IoGl.md).[inputValue](IoGl.md#inputvalue)

#### Defined in

[src/core/node.ts:234](https://github.com/io-gui/io/blob/main/src/core/node.ts#L234)

___

### labelChanged

▸ **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[labelChanged](IoGl.md#labelchanged)

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

[IoGl](IoGl.md).[objectMutated](IoGl.md#objectmutated)

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

[IoGl](IoGl.md).[onObjectMutated](IoGl.md#onobjectmutated)

#### Defined in

[src/core/node.ts:287](https://github.com/io-gui/io/blob/main/src/core/node.ts#L287)

___

### onResized

▸ **onResized**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[onResized](IoGl.md#onresized)

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

[IoGl](IoGl.md).[queue](IoGl.md#queue)

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

[IoGl](IoGl.md).[removeEventListener](IoGl.md#removeeventlistener)

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

[IoGl](IoGl.md).[setAttribute](IoGl.md#setattribute)

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

[IoGl](IoGl.md).[setProperties](IoGl.md#setproperties)

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

[IoGl](IoGl.md).[setProperty](IoGl.md#setproperty)

#### Defined in

[src/core/node.ts:121](https://github.com/io-gui/io/blob/main/src/core/node.ts#L121)

___

### setShaderProgram

▸ **setShaderProgram**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[setShaderProgram](IoGl.md#setshaderprogram)

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

[IoGl](IoGl.md).[setUniform](IoGl.md#setuniform)

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

[IoGl](IoGl.md).[template](IoGl.md#template)

#### Defined in

[src/core/element.ts:233](https://github.com/io-gui/io/blob/main/src/core/element.ts#L233)

___

### themeMutated

▸ **themeMutated**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[themeMutated](IoGl.md#thememutated)

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

[IoGl](IoGl.md).[throttle](IoGl.md#throttle)

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

[IoGl](IoGl.md).[traverse](IoGl.md#traverse)

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

[IoGl](IoGl.md).[unbind](IoGl.md#unbind)

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

[IoGl](IoGl.md).[updatePropertyUniform](IoGl.md#updatepropertyuniform)

#### Defined in

[src/core/gl.ts:385](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L385)

___

### updateThemeUniforms

▸ **updateThemeUniforms**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[updateThemeUniforms](IoGl.md#updatethemeuniforms)

#### Defined in

[src/core/gl.ts:391](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L391)
