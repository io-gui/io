# Class: IoSlider

Input element for `Number` data type displayed as slider.
It can be configured to clamp the `value` to `min` / `max` and round it to the nearest `step` increment. `exponent` property can be changed for non-linear scale.

Keys left/right/up/down+shift and pageup/pagedown change the value in step incements. Home/end keys set the value to min/max.

<io-element-demo element="io-slider" properties='{"value": 0, "step": 0.01, "min": -0.5, "max": 0.5, "exponent": 1}'></io-element-demo>

## Hierarchy

- [`IoSliderBase`](IoSliderBase.md)

  ↳ **`IoSlider`**

  ↳↳ [`IoColorSliderBase`](IoColorSliderBase.md)

## Constructors

### constructor

**new IoSlider**(`properties?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | `Record`<`string`, `any`\> |

#### Inherited from

[IoSliderBase](IoSliderBase.md).[constructor](IoSliderBase.md#constructor)

#### Defined in

[src/core/gl.ts:259](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L259)

## Properties

### $

 **$**: `Record`<`string`, `any`\>

#### Inherited from

[IoSliderBase](IoSliderBase.md).[$](IoSliderBase.md#$)

#### Defined in

[src/core/element.ts:243](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L243)

___

### \_active

 **\_active**: `number` = `-1`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_active](IoSliderBase.md#_active)

#### Defined in

[src/elements/sliders/io-slider-base.ts:67](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L67)

___

### \_bindings

 `Readonly` **\_bindings**: `Map`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_bindings](IoSliderBase.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

 `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_changeQueue](IoSliderBase.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

 `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_eventDispatcher](IoSliderBase.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L57)

___

### \_properties

 `Readonly` **\_properties**: `Map`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_properties](IoSliderBase.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L54)

___

### \_protochain

 `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_protochain](IoSliderBase.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L53)

___

### \_rect

 **\_rect**: ``null`` \| `DOMRect` = `null`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_rect](IoSliderBase.md#_rect)

#### Defined in

[src/elements/sliders/io-slider-base.ts:68](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L68)

___

### \_startX

 **\_startX**: `number` = `0`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_startX](IoSliderBase.md#_startx)

#### Defined in

[src/elements/sliders/io-slider-base.ts:65](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L65)

___

### \_startY

 **\_startY**: `number` = `0`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_startY](IoSliderBase.md#_starty)

#### Defined in

[src/elements/sliders/io-slider-base.ts:66](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L66)

___

### class

 **class**: `string`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[class](IoSliderBase.md#class)

#### Defined in

[src/core/element.ts:252](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L252)

___

### color

 **color**: [`number`, `number`, `number`, `number`]

#### Inherited from

[IoSliderBase](IoSliderBase.md).[color](IoSliderBase.md#color)

#### Defined in

[src/elements/sliders/io-slider-base.ts:51](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L51)

___

### contenteditable

 **contenteditable**: `boolean`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[contenteditable](IoSliderBase.md#contenteditable)

#### Defined in

[src/core/element.ts:249](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L249)

___

### disabled

 **disabled**: `boolean`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[disabled](IoSliderBase.md#disabled)

#### Defined in

[src/core/element.ts:273](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L273)

___

### exponent

 **exponent**: `number`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[exponent](IoSliderBase.md#exponent)

#### Defined in

[src/elements/sliders/io-slider-base.ts:45](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L45)

___

### hidden

 **hidden**: `boolean`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[hidden](IoSliderBase.md#hidden)

#### Defined in

[src/core/element.ts:270](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L270)

___

### id

 **id**: `string`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[id](IoSliderBase.md#id)

#### Defined in

[src/core/element.ts:267](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L267)

___

### label

 **label**: `string`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[label](IoSliderBase.md#label)

#### Defined in

[src/core/element.ts:258](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L258)

___

### lazy

 **lazy**: `boolean`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[lazy](IoSliderBase.md#lazy)

#### Defined in

[src/elements/sliders/io-slider-base.ts:63](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L63)

___

### max

 **max**: `number`

#### Overrides

[IoSliderBase](IoSliderBase.md).[max](IoSliderBase.md#max)

#### Defined in

[src/elements/sliders/io-slider.ts:26](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider.ts#L26)

___

### min

 **min**: `number`

#### Overrides

[IoSliderBase](IoSliderBase.md).[min](IoSliderBase.md#min)

#### Defined in

[src/elements/sliders/io-slider.ts:23](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider.ts#L23)

___

### name

 **name**: `string`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[name](IoSliderBase.md#name)

#### Defined in

[src/core/element.ts:261](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L261)

___

### noscroll

 **noscroll**: `boolean`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[noscroll](IoSliderBase.md#noscroll)

#### Defined in

[src/elements/sliders/io-slider-base.ts:54](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L54)

___

### pxRatio

 **pxRatio**: `number`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[pxRatio](IoSliderBase.md#pxratio)

#### Defined in

[src/core/gl.ts:72](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L72)

___

### role

 **role**: `string`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[role](IoSliderBase.md#role)

#### Defined in

[src/elements/sliders/io-slider-base.ts:57](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L57)

___

### size

 **size**: [`number`, `number`]

#### Inherited from

[IoSliderBase](IoSliderBase.md).[size](IoSliderBase.md#size)

#### Defined in

[src/core/gl.ts:66](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L66)

___

### step

 **step**: `number`

#### Overrides

[IoSliderBase](IoSliderBase.md).[step](IoSliderBase.md#step)

#### Defined in

[src/elements/sliders/io-slider.ts:20](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider.ts#L20)

___

### tabindex

 **tabindex**: `string`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[tabindex](IoSliderBase.md#tabindex)

#### Defined in

[src/elements/sliders/io-slider-base.ts:60](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L60)

___

### theme

 **theme**: [`IoTheme`](IoTheme.md)

#### Inherited from

[IoSliderBase](IoSliderBase.md).[theme](IoSliderBase.md#theme)

#### Defined in

[src/core/gl.ts:75](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L75)

___

### title

 **title**: `string`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[title](IoSliderBase.md#title)

#### Defined in

[src/core/element.ts:264](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L264)

___

### value

 **value**: `number`

#### Overrides

[IoSliderBase](IoSliderBase.md).[value](IoSliderBase.md#value)

#### Defined in

[src/elements/sliders/io-slider.ts:17](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider.ts#L17)

___

### vertical

 **vertical**: `boolean`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[vertical](IoSliderBase.md#vertical)

#### Defined in

[src/elements/sliders/io-slider-base.ts:48](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L48)

## Accessors

### \_max

`get` **_max**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSliderBase.\_max

#### Defined in

[src/elements/sliders/io-slider-base.ts:81](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L81)

___

### \_min

`get` **_min**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSliderBase.\_min

#### Defined in

[src/elements/sliders/io-slider-base.ts:70](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L70)

___

### \_step

`get` **_step**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSliderBase.\_step

#### Defined in

[src/elements/sliders/io-slider-base.ts:92](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L92)

___

### \_value

`get` **_value**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSliderBase.\_value

#### Defined in

[src/elements/sliders/io-slider-base.ts:103](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L103)

___

### textNode

`get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoSliderBase.textNode

#### Defined in

[src/core/element.ts:391](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L391)

`set` **textNode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

IoSliderBase.textNode

#### Defined in

[src/core/element.ts:395](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L395)

___

### Frag

`Static` `get` **Frag**(): `string`

#### Returns

`string`

#### Overrides

IoSliderBase.Frag

#### Defined in

[src/elements/sliders/io-slider.ts:75](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider.ts#L75)

___

### GlUtils

`Static` `get` **GlUtils**(): `string`

#### Returns

`string`

#### Overrides

IoSliderBase.GlUtils

#### Defined in

[src/elements/sliders/io-slider.ts:28](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider.ts#L28)

___

### Listeners

`Static` `get` **Listeners**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `contextmenu` | `string` |
| `focus` | `string` |
| `pointerdown` | `string` |
| `touchstart` | (`string` \| { `passive`: `boolean` = false })[] |

#### Inherited from

IoSliderBase.Listeners

#### Defined in

[src/elements/sliders/io-slider-base.ts:114](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L114)

___

### Properties

`Static` `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoSliderBase.Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L44)

___

### Style

`Static` `get` **Style**(): `string`

#### Returns

`string`

#### Inherited from

IoSliderBase.Style

#### Defined in

[src/elements/sliders/io-slider-base.ts:9](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L9)

___

### Vert

`Static` `get` **Vert**(): `string`

#### Returns

`string`

#### Inherited from

IoSliderBase.Vert

#### Defined in

[src/core/gl.ts:81](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L81)

## Methods

### \_flattenTextNode

**_flattenTextNode**(`element`): `void`

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

[src/core/element.ts:374](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L374)

___

### \_getPointerCoord

**_getPointerCoord**(`event`): [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

[`number`, `number`]

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_getPointerCoord](IoSliderBase.md#_getpointercoord)

#### Defined in

[src/elements/sliders/io-slider-base.ts:181](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L181)

___

### \_getValueFromCoord

**_getValueFromCoord**(`coord`): [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `coord` | [`number`, `number`] |

#### Returns

[`number`, `number`]

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_getValueFromCoord](IoSliderBase.md#_getvaluefromcoord)

#### Defined in

[src/elements/sliders/io-slider-base.ts:189](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L189)

___

### \_inputValue

**_inputValue**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`number`, `number`] |

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_inputValue](IoSliderBase.md#_inputvalue)

#### Defined in

[src/elements/sliders/io-slider-base.ts:205](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L205)

___

### \_onBlur

**_onBlur**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_onBlur](IoSliderBase.md#_onblur)

#### Defined in

[src/elements/sliders/io-slider-base.ts:126](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L126)

___

### \_onContextmenu

**_onContextmenu**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Event` |

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_onContextmenu](IoSliderBase.md#_oncontextmenu)

#### Defined in

[src/elements/sliders/io-slider-base.ts:130](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L130)

___

### \_onFocus

**_onFocus**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_onFocus](IoSliderBase.md#_onfocus)

#### Defined in

[src/elements/sliders/io-slider-base.ts:122](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L122)

___

### \_onKeydown

**_onKeydown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `KeyboardEvent` |

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_onKeydown](IoSliderBase.md#_onkeydown)

#### Defined in

[src/elements/sliders/io-slider-base.ts:232](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L232)

___

### \_onPointerdown

**_onPointerdown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_onPointerdown](IoSliderBase.md#_onpointerdown)

#### Defined in

[src/elements/sliders/io-slider-base.ts:163](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L163)

___

### \_onPointermove

**_onPointermove**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_onPointermove](IoSliderBase.md#_onpointermove)

#### Defined in

[src/elements/sliders/io-slider-base.ts:170](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L170)

___

### \_onPointermoveThrottled

**_onPointermoveThrottled**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_onPointermoveThrottled](IoSliderBase.md#_onpointermovethrottled)

#### Defined in

[src/elements/sliders/io-slider-base.ts:197](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L197)

___

### \_onPointerup

**_onPointerup**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_onPointerup](IoSliderBase.md#_onpointerup)

#### Defined in

[src/elements/sliders/io-slider-base.ts:174](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L174)

___

### \_onRender

**_onRender**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_onRender](IoSliderBase.md#_onrender)

#### Defined in

[src/core/gl.ts:346](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L346)

___

### \_onTouchend

**_onTouchend**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_onTouchend](IoSliderBase.md#_ontouchend)

#### Defined in

[src/elements/sliders/io-slider-base.ts:159](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L159)

___

### \_onTouchmove

**_onTouchmove**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `TouchEvent` |

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_onTouchmove](IoSliderBase.md#_ontouchmove)

#### Defined in

[src/elements/sliders/io-slider-base.ts:141](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L141)

___

### \_onTouchstart

**_onTouchstart**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `TouchEvent` |

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_onTouchstart](IoSliderBase.md#_ontouchstart)

#### Defined in

[src/elements/sliders/io-slider-base.ts:133](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L133)

___

### \_setDecrease

**_setDecrease**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_setDecrease](IoSliderBase.md#_setdecrease)

#### Defined in

[src/elements/sliders/io-slider-base.ts:278](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L278)

___

### \_setDown

**_setDown**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_setDown](IoSliderBase.md#_setdown)

#### Defined in

[src/elements/sliders/io-slider-base.ts:299](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L299)

___

### \_setIncrease

**_setIncrease**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_setIncrease](IoSliderBase.md#_setincrease)

#### Defined in

[src/elements/sliders/io-slider-base.ts:271](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L271)

___

### \_setLeft

**_setLeft**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_setLeft](IoSliderBase.md#_setleft)

#### Defined in

[src/elements/sliders/io-slider-base.ts:305](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L305)

___

### \_setMax

**_setMax**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_setMax](IoSliderBase.md#_setmax)

#### Defined in

[src/elements/sliders/io-slider-base.ts:289](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L289)

___

### \_setMin

**_setMin**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_setMin](IoSliderBase.md#_setmin)

#### Defined in

[src/elements/sliders/io-slider-base.ts:285](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L285)

___

### \_setRight

**_setRight**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_setRight](IoSliderBase.md#_setright)

#### Defined in

[src/elements/sliders/io-slider-base.ts:311](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L311)

___

### \_setUp

**_setUp**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[_setUp](IoSliderBase.md#_setup)

#### Defined in

[src/elements/sliders/io-slider-base.ts:293](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L293)

___

### addEventListener

**addEventListener**(`type`, `listener`, `options?`): `void`

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

[src/core/node.ts:368](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L368)

___

### applyProperties

**applyProperties**(`props`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `any` |

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[applyProperties](IoSliderBase.md#applyproperties)

#### Defined in

[src/core/element.ts:399](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L399)

___

### bind

**bind**(`prop`): [`Binding`](Binding.md)

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

[src/core/node.ts:335](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L335)

___

### changed

**changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[changed](IoSliderBase.md#changed)

#### Defined in

[src/elements/sliders/io-slider-base.ts:320](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L320)

___

### connectedCallback

**connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[connectedCallback](IoSliderBase.md#connectedcallback)

#### Defined in

[src/core/element.ts:278](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L278)

___

### disabledChanged

**disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[disabledChanged](IoSliderBase.md#disabledchanged)

#### Defined in

[src/core/element.ts:428](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L428)

___

### disconnectedCallback

**disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[disconnectedCallback](IoSliderBase.md#disconnectedcallback)

#### Defined in

[src/core/element.ts:286](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L286)

___

### dispatchEvent

**dispatchEvent**(`type`, `detail?`, `bubbles?`, `src?`): `void`

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

[src/core/node.ts:393](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L393)

___

### dispatchQueue

**dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[dispatchQueue](IoSliderBase.md#dispatchqueue)

#### Defined in

[src/core/node.ts:277](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L277)

___

### dispatchQueueSync

**dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[dispatchQueueSync](IoSliderBase.md#dispatchqueuesync)

#### Defined in

[src/core/node.ts:287](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L287)

___

### dispose

**dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[dispose](IoSliderBase.md#dispose)

#### Defined in

[src/core/node.ts:400](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L400)

___

### init

**init**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[init](IoSliderBase.md#init)

#### Defined in

[src/elements/sliders/io-slider-base.ts:317](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L317)

___

### initPropertyUniform

**initPropertyUniform**(`name`, `property`): `string`

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

[src/core/gl.ts:191](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L191)

___

### initShader

**initShader**(): `WebGLProgram`

#### Returns

`WebGLProgram`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[initShader](IoSliderBase.md#initshader)

#### Defined in

[src/core/gl.ts:209](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L209)

___

### inputValue

**inputValue**(`value`): `void`

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

[src/core/node.ts:252](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L252)

___

### labelChanged

**labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[labelChanged](IoSliderBase.md#labelchanged)

#### Defined in

[src/core/element.ts:421](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L421)

___

### objectMutated

**objectMutated**(`prop`): `void`

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

[src/core/node.ts:326](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L326)

___

### onObjectMutated

**onObjectMutated**(`event`): `void`

Event handler for 'object-mutated' event emitted from the `window`.
Node should be listening for this event if it has an observed object property

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `CustomEvent`<`any`\> | Event payload. |

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[onObjectMutated](IoSliderBase.md#onobjectmutated)

#### Defined in

[src/core/node.ts:305](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L305)

___

### onResized

**onResized**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[onResized](IoSliderBase.md#onresized)

#### Defined in

[src/core/gl.ts:305](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L305)

___

### queue

**queue**(`prop`, `value`, `oldValue`): `void`

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

[src/core/node.ts:271](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L271)

___

### removeEventListener

**removeEventListener**(`type`, `listener?`, `options?`): `void`

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

[src/core/node.ts:383](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L383)

___

### setAttribute

**setAttribute**(`attr`, `value`): `void`

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

[src/core/element.ts:412](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L412)

___

### setProperties

**setProperties**(`props`): `void`

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

[src/core/node.ts:234](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L234)

___

### setProperty

**setProperty**(`name`, `value`, `skipDispatch?`): `void`

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

[src/core/node.ts:129](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L129)

___

### setShaderProgram

**setShaderProgram**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[setShaderProgram](IoSliderBase.md#setshaderprogram)

#### Defined in

[src/core/gl.ts:381](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L381)

___

### setUniform

**setUniform**(`name`, `value`): `void`

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

[src/core/gl.ts:398](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L398)

___

### template

**template**(`vDOM`, `host?`, `cache?`): `void`

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

[src/core/element.ts:298](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L298)

___

### themeMutated

**themeMutated**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[themeMutated](IoSliderBase.md#thememutated)

#### Defined in

[src/core/gl.ts:331](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L331)

___

### throttle

**throttle**(`func`, `arg?`, `sync?`): `void`

Throttles function execution to next frame (rAF) if the function has been executed in the current frame.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `func` | [`CallbackFunction`](../README.md#callbackfunction) | `undefined` | Function to throttle. |
| `arg` | `any` | `undefined` | argument for throttled function. |
| `sync` | `boolean` | `false` | execute immediately without rAF timeout. |

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[throttle](IoSliderBase.md#throttle)

#### Defined in

[src/core/node.ts:296](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L296)

___

### traverse

**traverse**(`vChildren`, `host?`, `cache?`): `void`

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

[src/core/element.ts:311](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L311)

___

### unbind

**unbind**(`prop`): `void`

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

[src/core/node.ts:352](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L352)

___

### updatePropertyUniform

**updatePropertyUniform**(`name`, `property`): `void`

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

[src/core/gl.ts:387](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L387)

___

### updateThemeUniforms

**updateThemeUniforms**(): `void`

#### Returns

`void`

#### Inherited from

[IoSliderBase](IoSliderBase.md).[updateThemeUniforms](IoSliderBase.md#updatethemeuniforms)

#### Defined in

[src/core/gl.ts:393](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L393)
