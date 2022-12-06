# Class: IoSliderRange

Input element for `Array(2)` data type displayed as slider.
It can be configured to clamp the `value` compoents to `min` / `max` and round it to the nearest `step` increment. `exponent` property can be changed for non-linear scale.

Keys left/right/up/down+shift and pageup/pagedown change the value in step incements. Home/end keys set the value to min/max.

<io-element-demo element="io-slider-range" properties='{"value": [0, 1], "step": 0.1, "min": -1, "max": 2, "exponent": 1}'></io-element-demo>

## Hierarchy

- `IoSliderBase`

  ↳ **`IoSliderRange`**

## Constructors

### constructor

**new IoSliderRange**(`properties?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | `Record`<`string`, `any`\> |

#### Inherited from

IoSliderBase.constructor

#### Defined in

[src/core/gl.ts:259](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L259)

## Properties

### $

 **$**: `Record`<`string`, `any`\>

#### Inherited from

IoSliderBase.$

#### Defined in

[src/core/element.ts:232](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L232)

___

### \_active

 **\_active**: `boolean` = `false`

#### Inherited from

IoSliderBase.\_active

#### Defined in

[src/elements/sliders/io-slider-base.ts:63](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L63)

___

### \_bindings

 `Readonly` **\_bindings**: `Map`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

IoSliderBase.\_bindings

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

 `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

IoSliderBase.\_changeQueue

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

 `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

IoSliderBase.\_eventDispatcher

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L57)

___

### \_index

 **\_index**: `number` = `0`

#### Defined in

[src/elements/sliders/io-slider-range.ts:28](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-range.ts#L28)

___

### \_properties

 `Readonly` **\_properties**: `Map`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

IoSliderBase.\_properties

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L54)

___

### \_protochain

 `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

IoSliderBase.\_protochain

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L53)

___

### \_rect

 **\_rect**: ``null`` \| `DOMRect` = `null`

#### Inherited from

IoSliderBase.\_rect

#### Defined in

[src/elements/sliders/io-slider-base.ts:64](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L64)

___

### \_startX

 **\_startX**: `number` = `0`

#### Inherited from

IoSliderBase.\_startX

#### Defined in

[src/elements/sliders/io-slider-base.ts:61](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L61)

___

### \_startY

 **\_startY**: `number` = `0`

#### Inherited from

IoSliderBase.\_startY

#### Defined in

[src/elements/sliders/io-slider-base.ts:62](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L62)

___

### class

 **class**: `string`

#### Inherited from

IoSliderBase.class

#### Defined in

[src/core/element.ts:241](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L241)

___

### color

 **color**: [`number`, `number`, `number`, `number`]

#### Inherited from

IoSliderBase.color

#### Defined in

[src/elements/sliders/io-slider-base.ts:47](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L47)

___

### contenteditable

 **contenteditable**: `boolean`

#### Inherited from

IoSliderBase.contenteditable

#### Defined in

[src/core/element.ts:238](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L238)

___

### d

 **d**: `boolean` = `true`

#### Inherited from

IoSliderBase.d

#### Defined in

[src/core/node.ts:59](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L59)

___

### disabled

 **disabled**: `boolean`

#### Inherited from

IoSliderBase.disabled

#### Defined in

[src/core/element.ts:262](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L262)

___

### exponent

 **exponent**: `number`

#### Inherited from

IoSliderBase.exponent

#### Defined in

[src/elements/sliders/io-slider-base.ts:41](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L41)

___

### hidden

 **hidden**: `boolean`

#### Inherited from

IoSliderBase.hidden

#### Defined in

[src/core/element.ts:259](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L259)

___

### id

 **id**: `string`

#### Inherited from

IoSliderBase.id

#### Defined in

[src/core/element.ts:256](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L256)

___

### label

 **label**: `string`

#### Inherited from

IoSliderBase.label

#### Defined in

[src/core/element.ts:247](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L247)

___

### lazy

 **lazy**: `boolean`

#### Inherited from

IoSliderBase.lazy

#### Defined in

[src/elements/sliders/io-slider-base.ts:59](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L59)

___

### max

 **max**: `number`

#### Overrides

IoSliderBase.max

#### Defined in

[src/elements/sliders/io-slider-range.ts:26](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-range.ts#L26)

___

### min

 **min**: `number`

#### Overrides

IoSliderBase.min

#### Defined in

[src/elements/sliders/io-slider-range.ts:23](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-range.ts#L23)

___

### name

 **name**: `string`

#### Inherited from

IoSliderBase.name

#### Defined in

[src/core/element.ts:250](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L250)

___

### noscroll

 **noscroll**: `boolean`

#### Inherited from

IoSliderBase.noscroll

#### Defined in

[src/elements/sliders/io-slider-base.ts:50](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L50)

___

### pxRatio

 **pxRatio**: `number`

#### Inherited from

IoSliderBase.pxRatio

#### Defined in

[src/core/gl.ts:72](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L72)

___

### role

 **role**: `string`

#### Inherited from

IoSliderBase.role

#### Defined in

[src/elements/sliders/io-slider-base.ts:53](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L53)

___

### size

 **size**: [`number`, `number`]

#### Inherited from

IoSliderBase.size

#### Defined in

[src/core/gl.ts:66](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L66)

___

### step

 **step**: `number`

#### Overrides

IoSliderBase.step

#### Defined in

[src/elements/sliders/io-slider-range.ts:20](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-range.ts#L20)

___

### tabindex

 **tabindex**: `string`

#### Inherited from

IoSliderBase.tabindex

#### Defined in

[src/elements/sliders/io-slider-base.ts:56](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L56)

___

### theme

 **theme**: [`IoTheme`](IoTheme.md)

#### Inherited from

IoSliderBase.theme

#### Defined in

[src/core/gl.ts:75](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L75)

___

### title

 **title**: `string`

#### Inherited from

IoSliderBase.title

#### Defined in

[src/core/element.ts:253](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L253)

___

### value

 **value**: [`number`, `number`]

#### Overrides

IoSliderBase.value

#### Defined in

[src/elements/sliders/io-slider-range.ts:17](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-range.ts#L17)

___

### vertical

 **vertical**: `boolean`

#### Inherited from

IoSliderBase.vertical

#### Defined in

[src/elements/sliders/io-slider-base.ts:44](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L44)

## Accessors

### \_max

`get` **_max**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSliderBase.\_max

#### Defined in

[src/elements/sliders/io-slider-base.ts:77](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L77)

___

### \_min

`get` **_min**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSliderBase.\_min

#### Defined in

[src/elements/sliders/io-slider-base.ts:66](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L66)

___

### \_step

`get` **_step**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSliderBase.\_step

#### Defined in

[src/elements/sliders/io-slider-base.ts:88](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L88)

___

### \_value

`get` **_value**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSliderBase.\_value

#### Defined in

[src/elements/sliders/io-slider-base.ts:99](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L99)

___

### textNode

`get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoSliderBase.textNode

#### Defined in

[src/core/element.ts:388](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L388)

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

[src/core/element.ts:392](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L392)

___

### Frag

`Static` `get` **Frag**(): `string`

#### Returns

`string`

#### Overrides

IoSliderBase.Frag

#### Defined in

[src/elements/sliders/io-slider-range.ts:109](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-range.ts#L109)

___

### GlUtils

`Static` `get` **GlUtils**(): `string`

#### Returns

`string`

#### Overrides

IoSliderBase.GlUtils

#### Defined in

[src/elements/sliders/io-slider-range.ts:58](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-range.ts#L58)

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
| `touchstart` | `string` |

#### Inherited from

IoSliderBase.Listeners

#### Defined in

[src/elements/sliders/io-slider-base.ts:110](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L110)

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

IoSliderBase.\_flattenTextNode

#### Defined in

[src/core/element.ts:371](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L371)

___

### \_getCoordFromValue

**_getCoordFromValue**(`value`): `number`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`number`, `number`] |

#### Returns

`number`[]

#### Defined in

[src/elements/sliders/io-slider-range.ts:30](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-range.ts#L30)

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

IoSliderBase.\_getPointerCoord

#### Defined in

[src/elements/sliders/io-slider-base.ts:176](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L176)

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

IoSliderBase.\_getValueFromCoord

#### Defined in

[src/elements/sliders/io-slider-base.ts:184](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L184)

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

IoSliderBase.\_inputValue

#### Defined in

[src/elements/sliders/io-slider-base.ts:200](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L200)

___

### \_onBlur

**_onBlur**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_onBlur

#### Defined in

[src/elements/sliders/io-slider-base.ts:122](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L122)

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

IoSliderBase.\_onContextmenu

#### Defined in

[src/elements/sliders/io-slider-base.ts:126](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L126)

___

### \_onFocus

**_onFocus**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_onFocus

#### Defined in

[src/elements/sliders/io-slider-base.ts:118](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L118)

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

IoSliderBase.\_onKeydown

#### Defined in

[src/elements/sliders/io-slider-base.ts:227](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L227)

___

### \_onPointerdown

**_onPointerdown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Overrides

IoSliderBase.\_onPointerdown

#### Defined in

[src/elements/sliders/io-slider-range.ts:38](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-range.ts#L38)

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

IoSliderBase.\_onPointermove

#### Defined in

[src/elements/sliders/io-slider-base.ts:165](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L165)

___

### \_onPointermoveThrottled

**_onPointermoveThrottled**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Overrides

IoSliderBase.\_onPointermoveThrottled

#### Defined in

[src/elements/sliders/io-slider-range.ts:45](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-range.ts#L45)

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

IoSliderBase.\_onPointerup

#### Defined in

[src/elements/sliders/io-slider-base.ts:169](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L169)

___

### \_onRender

**_onRender**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_onRender

#### Defined in

[src/core/gl.ts:346](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L346)

___

### \_onTouchend

**_onTouchend**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_onTouchend

#### Defined in

[src/elements/sliders/io-slider-base.ts:154](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L154)

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

IoSliderBase.\_onTouchmove

#### Defined in

[src/elements/sliders/io-slider-base.ts:137](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L137)

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

IoSliderBase.\_onTouchstart

#### Defined in

[src/elements/sliders/io-slider-base.ts:129](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L129)

___

### \_setDecrease

**_setDecrease**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_setDecrease

#### Defined in

[src/elements/sliders/io-slider-base.ts:273](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L273)

___

### \_setDown

**_setDown**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_setDown

#### Defined in

[src/elements/sliders/io-slider-base.ts:294](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L294)

___

### \_setIncrease

**_setIncrease**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_setIncrease

#### Defined in

[src/elements/sliders/io-slider-base.ts:266](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L266)

___

### \_setLeft

**_setLeft**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_setLeft

#### Defined in

[src/elements/sliders/io-slider-base.ts:300](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L300)

___

### \_setMax

**_setMax**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_setMax

#### Defined in

[src/elements/sliders/io-slider-base.ts:284](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L284)

___

### \_setMin

**_setMin**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_setMin

#### Defined in

[src/elements/sliders/io-slider-base.ts:280](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L280)

___

### \_setRight

**_setRight**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_setRight

#### Defined in

[src/elements/sliders/io-slider-base.ts:306](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L306)

___

### \_setUp

**_setUp**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_setUp

#### Defined in

[src/elements/sliders/io-slider-base.ts:288](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L288)

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

IoSliderBase.addEventListener

#### Defined in

[src/core/node.ts:362](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L362)

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

IoSliderBase.applyProperties

#### Defined in

[src/core/element.ts:396](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L396)

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

IoSliderBase.bind

#### Defined in

[src/core/node.ts:331](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L331)

___

### changed

**changed**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.changed

#### Defined in

[src/elements/sliders/io-slider-base.ts:315](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L315)

___

### connectedCallback

**connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

IoSliderBase.connectedCallback

#### Defined in

[src/core/element.ts:267](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L267)

___

### disabledChanged

**disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.disabledChanged

#### Defined in

[src/core/element.ts:425](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L425)

___

### disconnectedCallback

**disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

IoSliderBase.disconnectedCallback

#### Defined in

[src/core/element.ts:275](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L275)

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

IoSliderBase.dispatchEvent

#### Defined in

[src/core/node.ts:387](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L387)

___

### dispatchQueue

**dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

IoSliderBase.dispatchQueue

#### Defined in

[src/core/node.ts:273](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L273)

___

### dispatchQueueSync

**dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

IoSliderBase.dispatchQueueSync

#### Defined in

[src/core/node.ts:283](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L283)

___

### dispose

**dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

IoSliderBase.dispose

#### Defined in

[src/core/node.ts:394](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L394)

___

### disposeDeep

**disposeDeep**(`host`, `child`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `host` | `HTMLElement` |
| `child` | `any` |

#### Returns

`void`

#### Inherited from

IoSliderBase.disposeDeep

#### Defined in

[src/core/element.ts:291](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L291)

___

### init

**init**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.init

#### Defined in

[src/elements/sliders/io-slider-base.ts:312](https://github.com/io-gui/iogui/blob/main/src/elements/sliders/io-slider-base.ts#L312)

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

IoSliderBase.initPropertyUniform

#### Defined in

[src/core/gl.ts:191](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L191)

___

### initShader

**initShader**(): `WebGLProgram`

#### Returns

`WebGLProgram`

#### Inherited from

IoSliderBase.initShader

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

IoSliderBase.inputValue

#### Defined in

[src/core/node.ts:248](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L248)

___

### labelChanged

**labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.labelChanged

#### Defined in

[src/core/element.ts:418](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L418)

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

IoSliderBase.objectMutated

#### Defined in

[src/core/node.ts:322](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L322)

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

IoSliderBase.onObjectMutated

#### Defined in

[src/core/node.ts:301](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L301)

___

### onResized

**onResized**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.onResized

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

IoSliderBase.queue

#### Defined in

[src/core/node.ts:267](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L267)

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

IoSliderBase.removeEventListener

#### Defined in

[src/core/node.ts:377](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L377)

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

IoSliderBase.setAttribute

#### Defined in

[src/core/element.ts:409](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L409)

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

IoSliderBase.setProperties

#### Defined in

[src/core/node.ts:230](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L230)

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

IoSliderBase.setProperty

#### Defined in

[src/core/node.ts:131](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L131)

___

### setShaderProgram

**setShaderProgram**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.setShaderProgram

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

IoSliderBase.setUniform

#### Defined in

[src/core/gl.ts:398](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L398)

___

### template

**template**(`vDOM`, `host?`): `void`

Renders DOM from virtual DOM arrays.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vDOM` | `any`[] | Array of vDOM children. |
| `host?` | `HTMLElement` | Optional template target. |

#### Returns

`void`

#### Inherited from

IoSliderBase.template

#### Defined in

[src/core/element.ts:285](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L285)

___

### themeMutated

**themeMutated**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.themeMutated

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

IoSliderBase.throttle

#### Defined in

[src/core/node.ts:292](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L292)

___

### traverse

**traverse**(`vChildren`, `host?`): `void`

Recurively traverses vDOM.
TODO: test element.traverse() function!

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vChildren` | `any`[] | Array of vDOM children converted by `buildTree()` for easier parsing. |
| `host?` | `HTMLElement` | Optional template target. |

#### Returns

`void`

#### Inherited from

IoSliderBase.traverse

#### Defined in

[src/core/element.ts:315](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L315)

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

IoSliderBase.unbind

#### Defined in

[src/core/node.ts:346](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L346)

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

IoSliderBase.updatePropertyUniform

#### Defined in

[src/core/gl.ts:387](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L387)

___

### updateThemeUniforms

**updateThemeUniforms**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.updateThemeUniforms

#### Defined in

[src/core/gl.ts:393](https://github.com/io-gui/iogui/blob/main/src/core/gl.ts#L393)
