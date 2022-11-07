# Class: IoSlider2d

## Hierarchy

- `IoSliderBase`

  ↳ **`IoSlider2d`**

  ↳↳ [`IoColorSlider2dBase`](IoColorSlider2dBase.md)

## Constructors

### constructor

**new IoSlider2d**(`properties?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | `Record`<`string`, `any`\> |

#### Inherited from

IoSliderBase.constructor

#### Defined in

[src/core/gl.ts:255](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L255)

## Properties

### $

 **$**: `Record`<`string`, `any`\>

#### Inherited from

IoSliderBase.$

#### Defined in

[src/core/element.ts:211](https://github.com/io-gui/io/blob/main/src/core/element.ts#L211)

___

### \_active

 **\_active**: `boolean` = `false`

#### Inherited from

IoSliderBase.\_active

#### Defined in

[src/elements/sliders/slider-base.ts:64](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L64)

___

### \_bindings

 `Readonly` **\_bindings**: `Map`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

IoSliderBase.\_bindings

#### Defined in

[src/core/node.ts:48](https://github.com/io-gui/io/blob/main/src/core/node.ts#L48)

___

### \_changeQueue

 `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

IoSliderBase.\_changeQueue

#### Defined in

[src/core/node.ts:49](https://github.com/io-gui/io/blob/main/src/core/node.ts#L49)

___

### \_eventDispatcher

 `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

IoSliderBase.\_eventDispatcher

#### Defined in

[src/core/node.ts:50](https://github.com/io-gui/io/blob/main/src/core/node.ts#L50)

___

### \_properties

 `Readonly` **\_properties**: `Map`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

IoSliderBase.\_properties

#### Defined in

[src/core/node.ts:47](https://github.com/io-gui/io/blob/main/src/core/node.ts#L47)

___

### \_protochain

 `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

IoSliderBase.\_protochain

#### Defined in

[src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

___

### \_startX

 **\_startX**: `number` = `0`

#### Inherited from

IoSliderBase.\_startX

#### Defined in

[src/elements/sliders/slider-base.ts:62](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L62)

___

### \_startY

 **\_startY**: `number` = `0`

#### Inherited from

IoSliderBase.\_startY

#### Defined in

[src/elements/sliders/slider-base.ts:63](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L63)

___

### class

 **class**: `string`

#### Inherited from

IoSliderBase.class

#### Defined in

[src/core/element.ts:220](https://github.com/io-gui/io/blob/main/src/core/element.ts#L220)

___

### color

 **color**: [`number`, `number`, `number`, `number`]

#### Inherited from

IoSliderBase.color

#### Defined in

[src/elements/sliders/slider-base.ts:48](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L48)

___

### contenteditable

 **contenteditable**: `boolean`

#### Inherited from

IoSliderBase.contenteditable

#### Defined in

[src/core/element.ts:217](https://github.com/io-gui/io/blob/main/src/core/element.ts#L217)

___

### disabled

 **disabled**: `boolean`

#### Inherited from

IoSliderBase.disabled

#### Defined in

[src/core/element.ts:241](https://github.com/io-gui/io/blob/main/src/core/element.ts#L241)

___

### exponent

 **exponent**: `number`

#### Inherited from

IoSliderBase.exponent

#### Defined in

[src/elements/sliders/slider-base.ts:42](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L42)

___

### hidden

 **hidden**: `boolean`

#### Inherited from

IoSliderBase.hidden

#### Defined in

[src/core/element.ts:238](https://github.com/io-gui/io/blob/main/src/core/element.ts#L238)

___

### id

 **id**: `string`

#### Inherited from

IoSliderBase.id

#### Defined in

[src/core/element.ts:235](https://github.com/io-gui/io/blob/main/src/core/element.ts#L235)

___

### label

 **label**: `string`

#### Inherited from

IoSliderBase.label

#### Defined in

[src/core/element.ts:226](https://github.com/io-gui/io/blob/main/src/core/element.ts#L226)

___

### lazy

 **lazy**: `boolean`

#### Inherited from

IoSliderBase.lazy

#### Defined in

[src/elements/sliders/slider-base.ts:60](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L60)

___

### max

 **max**: [`number`, `number`]

#### Overrides

IoSliderBase.max

#### Defined in

[src/elements/sliders/slider-2d.ts:35](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-2d.ts#L35)

___

### min

 **min**: [`number`, `number`]

#### Overrides

IoSliderBase.min

#### Defined in

[src/elements/sliders/slider-2d.ts:32](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-2d.ts#L32)

___

### name

 **name**: `string`

#### Inherited from

IoSliderBase.name

#### Defined in

[src/core/element.ts:229](https://github.com/io-gui/io/blob/main/src/core/element.ts#L229)

___

### noscroll

 **noscroll**: `boolean`

#### Inherited from

IoSliderBase.noscroll

#### Defined in

[src/elements/sliders/slider-base.ts:51](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L51)

___

### pxRatio

 **pxRatio**: `number`

#### Inherited from

IoSliderBase.pxRatio

#### Defined in

[src/core/gl.ts:74](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L74)

___

### role

 **role**: `string`

#### Inherited from

IoSliderBase.role

#### Defined in

[src/elements/sliders/slider-base.ts:54](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L54)

___

### size

 **size**: [`number`, `number`]

#### Inherited from

IoSliderBase.size

#### Defined in

[src/core/gl.ts:68](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L68)

___

### step

 **step**: [`number`, `number`]

#### Overrides

IoSliderBase.step

#### Defined in

[src/elements/sliders/slider-2d.ts:29](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-2d.ts#L29)

___

### tabindex

 **tabindex**: `string`

#### Inherited from

IoSliderBase.tabindex

#### Defined in

[src/elements/sliders/slider-base.ts:57](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L57)

___

### theme

 **theme**: [`IoTheme`](IoTheme.md)

#### Inherited from

IoSliderBase.theme

#### Defined in

[src/core/gl.ts:77](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L77)

___

### title

 **title**: `string`

#### Inherited from

IoSliderBase.title

#### Defined in

[src/core/element.ts:232](https://github.com/io-gui/io/blob/main/src/core/element.ts#L232)

___

### value

 **value**: [`number`, `number`]

#### Overrides

IoSliderBase.value

#### Defined in

[src/elements/sliders/slider-2d.ts:26](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-2d.ts#L26)

___

### vertical

 **vertical**: `boolean`

#### Inherited from

IoSliderBase.vertical

#### Defined in

[src/elements/sliders/slider-base.ts:45](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L45)

## Accessors

### \_max

`get` **_max**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSliderBase.\_max

#### Defined in

[src/elements/sliders/slider-base.ts:77](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L77)

___

### \_min

`get` **_min**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSliderBase.\_min

#### Defined in

[src/elements/sliders/slider-base.ts:66](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L66)

___

### \_step

`get` **_step**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSliderBase.\_step

#### Defined in

[src/elements/sliders/slider-base.ts:88](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L88)

___

### \_value

`get` **_value**(): [`number`, `number`]

#### Returns

[`number`, `number`]

#### Inherited from

IoSliderBase.\_value

#### Defined in

[src/elements/sliders/slider-base.ts:99](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L99)

___

### textNode

`get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoSliderBase.textNode

#### Defined in

[src/core/element.ts:392](https://github.com/io-gui/io/blob/main/src/core/element.ts#L392)

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

[src/core/element.ts:396](https://github.com/io-gui/io/blob/main/src/core/element.ts#L396)

___

### Frag

`Static` `get` **Frag**(): `string`

#### Returns

`string`

#### Overrides

IoSliderBase.Frag

#### Defined in

[src/elements/sliders/slider-2d.ts:53](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-2d.ts#L53)

___

### GlUtils

`Static` `get` **GlUtils**(): `string`

#### Returns

`string`

#### Overrides

IoSliderBase.GlUtils

#### Defined in

[src/elements/sliders/slider-2d.ts:37](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-2d.ts#L37)

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

[src/elements/sliders/slider-base.ts:110](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L110)

___

### Properties

`Static` `get` **Properties**(): [`PropertyDeclarations`](../none#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../none#propertydeclarations)

#### Inherited from

IoSliderBase.Properties

#### Defined in

[src/core/node.ts:37](https://github.com/io-gui/io/blob/main/src/core/node.ts#L37)

___

### Style

`Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoSliderBase.Style

#### Defined in

[src/elements/sliders/slider-2d.ts:7](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-2d.ts#L7)

___

### Vert

`Static` `get` **Vert**(): `string`

#### Returns

`string`

#### Inherited from

IoSliderBase.Vert

#### Defined in

[src/core/gl.ts:79](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L79)

___

### observedAttributes

`Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoSliderBase.observedAttributes

#### Defined in

[src/core/element.ts:243](https://github.com/io-gui/io/blob/main/src/core/element.ts#L243)

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

[src/core/element.ts:375](https://github.com/io-gui/io/blob/main/src/core/element.ts#L375)

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

[src/elements/sliders/slider-base.ts:174](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L174)

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

[src/elements/sliders/slider-base.ts:182](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L182)

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

[src/elements/sliders/slider-base.ts:198](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L198)

___

### \_onBlur

**_onBlur**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_onBlur

#### Defined in

[src/elements/sliders/slider-base.ts:122](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L122)

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

[src/elements/sliders/slider-base.ts:126](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L126)

___

### \_onFocus

**_onFocus**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_onFocus

#### Defined in

[src/elements/sliders/slider-base.ts:118](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L118)

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

[src/elements/sliders/slider-base.ts:225](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L225)

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

IoSliderBase.\_onPointerdown

#### Defined in

[src/elements/sliders/slider-base.ts:157](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L157)

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

[src/elements/sliders/slider-base.ts:163](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L163)

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

IoSliderBase.\_onPointermoveThrottled

#### Defined in

[src/elements/sliders/slider-base.ts:190](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L190)

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

[src/elements/sliders/slider-base.ts:167](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L167)

___

### \_onRender

**_onRender**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_onRender

#### Defined in

[src/core/gl.ts:342](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L342)

___

### \_onTouchend

**_onTouchend**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_onTouchend

#### Defined in

[src/elements/sliders/slider-base.ts:153](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L153)

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

[src/elements/sliders/slider-base.ts:136](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L136)

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

[src/elements/sliders/slider-base.ts:129](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L129)

___

### \_setDecrease

**_setDecrease**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_setDecrease

#### Defined in

[src/elements/sliders/slider-base.ts:271](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L271)

___

### \_setDown

**_setDown**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_setDown

#### Defined in

[src/elements/sliders/slider-base.ts:292](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L292)

___

### \_setIncrease

**_setIncrease**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_setIncrease

#### Defined in

[src/elements/sliders/slider-base.ts:264](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L264)

___

### \_setLeft

**_setLeft**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_setLeft

#### Defined in

[src/elements/sliders/slider-base.ts:298](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L298)

___

### \_setMax

**_setMax**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_setMax

#### Defined in

[src/elements/sliders/slider-base.ts:282](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L282)

___

### \_setMin

**_setMin**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_setMin

#### Defined in

[src/elements/sliders/slider-base.ts:278](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L278)

___

### \_setRight

**_setRight**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_setRight

#### Defined in

[src/elements/sliders/slider-base.ts:304](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L304)

___

### \_setUp

**_setUp**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.\_setUp

#### Defined in

[src/elements/sliders/slider-base.ts:286](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L286)

___

### addEventListener

**addEventListener**(`type`, `listener`, `options?`): `void`

Wrapper for addEventListener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | listener name. |
| `listener` | [`AnyEventListener`](../none#anyeventlistener) | listener handler. |
| `options?` | `AddEventListenerOptions` | event listener options. |

#### Returns

`void`

#### Inherited from

IoSliderBase.addEventListener

#### Defined in

[src/core/node.ts:319](https://github.com/io-gui/io/blob/main/src/core/node.ts#L319)

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

[src/core/element.ts:400](https://github.com/io-gui/io/blob/main/src/core/element.ts#L400)

___

### attributeChangedCallback

**attributeChangedCallback**(`prop`, `oldValue`, `newValue`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `prop` | `string` |
| `oldValue` | `any` |
| `newValue` | `any` |

#### Returns

`void`

#### Inherited from

IoSliderBase.attributeChangedCallback

#### Defined in

[src/core/element.ts:253](https://github.com/io-gui/io/blob/main/src/core/element.ts#L253)

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

[src/core/node.ts:288](https://github.com/io-gui/io/blob/main/src/core/node.ts#L288)

___

### changed

**changed**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.changed

#### Defined in

[src/elements/sliders/slider-base.ts:313](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L313)

___

### connectedCallback

**connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

IoSliderBase.connectedCallback

#### Defined in

[src/core/element.ts:271](https://github.com/io-gui/io/blob/main/src/core/element.ts#L271)

___

### disabledChanged

**disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.disabledChanged

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

___

### disconnectedCallback

**disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

IoSliderBase.disconnectedCallback

#### Defined in

[src/core/element.ts:279](https://github.com/io-gui/io/blob/main/src/core/element.ts#L279)

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

[src/core/node.ts:344](https://github.com/io-gui/io/blob/main/src/core/node.ts#L344)

___

### dispatchQueue

**dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

IoSliderBase.dispatchQueue

#### Defined in

[src/core/node.ts:230](https://github.com/io-gui/io/blob/main/src/core/node.ts#L230)

___

### dispatchQueueSync

**dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

IoSliderBase.dispatchQueueSync

#### Defined in

[src/core/node.ts:240](https://github.com/io-gui/io/blob/main/src/core/node.ts#L240)

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

[src/core/node.ts:351](https://github.com/io-gui/io/blob/main/src/core/node.ts#L351)

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

[src/core/element.ts:295](https://github.com/io-gui/io/blob/main/src/core/element.ts#L295)

___

### init

**init**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.init

#### Defined in

[src/elements/sliders/slider-base.ts:310](https://github.com/io-gui/io/blob/main/src/elements/sliders/slider-base.ts#L310)

___

### initPropertyUniform

**initPropertyUniform**(`name`, `property`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `property` | [`PropertyDeclaration`](../none#propertydeclaration) |

#### Returns

`string`

#### Inherited from

IoSliderBase.initPropertyUniform

#### Defined in

[src/core/gl.ts:189](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L189)

___

### initShader

**initShader**(): `WebGLProgram`

#### Returns

`WebGLProgram`

#### Inherited from

IoSliderBase.initShader

#### Defined in

[src/core/gl.ts:205](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L205)

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

[src/core/node.ts:205](https://github.com/io-gui/io/blob/main/src/core/node.ts#L205)

___

### labelChanged

**labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.labelChanged

#### Defined in

[src/core/element.ts:422](https://github.com/io-gui/io/blob/main/src/core/element.ts#L422)

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

[src/core/node.ts:279](https://github.com/io-gui/io/blob/main/src/core/node.ts#L279)

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

[src/core/node.ts:258](https://github.com/io-gui/io/blob/main/src/core/node.ts#L258)

___

### onResized

**onResized**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.onResized

#### Defined in

[src/core/gl.ts:300](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L300)

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

[src/core/node.ts:224](https://github.com/io-gui/io/blob/main/src/core/node.ts#L224)

___

### removeEventListener

**removeEventListener**(`type`, `listener?`, `options?`): `void`

Wrapper for removeEventListener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | event name to listen to. |
| `listener?` | [`AnyEventListener`](../none#anyeventlistener) | listener handler. |
| `options?` | `AddEventListenerOptions` | event listener options. |

#### Returns

`void`

#### Inherited from

IoSliderBase.removeEventListener

#### Defined in

[src/core/node.ts:334](https://github.com/io-gui/io/blob/main/src/core/node.ts#L334)

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

[src/core/element.ts:413](https://github.com/io-gui/io/blob/main/src/core/element.ts#L413)

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

[src/core/node.ts:188](https://github.com/io-gui/io/blob/main/src/core/node.ts#L188)

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

[src/core/node.ts:109](https://github.com/io-gui/io/blob/main/src/core/node.ts#L109)

___

### setShaderProgram

**setShaderProgram**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.setShaderProgram

#### Defined in

[src/core/gl.ts:371](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L371)

___

### setUniform

**setUniform**(`name`, `type`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `type` | `UniformTypes` |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

IoSliderBase.setUniform

#### Defined in

[src/core/gl.ts:388](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L388)

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

[src/core/element.ts:289](https://github.com/io-gui/io/blob/main/src/core/element.ts#L289)

___

### themeMutated

**themeMutated**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.themeMutated

#### Defined in

[src/core/gl.ts:327](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L327)

___

### throttle

**throttle**(`func`, `arg?`, `sync?`): `void`

Throttles function execution to next frame (rAF) if the function has been executed in the current frame.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `func` | [`CallbackFunction`](../none#callbackfunction) | `undefined` | Function to throttle. |
| `arg` | `any` | `undefined` | argument for throttled function. |
| `sync` | `boolean` | `false` | execute immediately without rAF timeout. |

#### Returns

`void`

#### Inherited from

IoSliderBase.throttle

#### Defined in

[src/core/node.ts:249](https://github.com/io-gui/io/blob/main/src/core/node.ts#L249)

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

[src/core/element.ts:319](https://github.com/io-gui/io/blob/main/src/core/element.ts#L319)

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

[src/core/node.ts:303](https://github.com/io-gui/io/blob/main/src/core/node.ts#L303)

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

[src/core/gl.ts:377](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L377)

___

### updateThemeUniforms

**updateThemeUniforms**(): `void`

#### Returns

`void`

#### Inherited from

IoSliderBase.updateThemeUniforms

#### Defined in

[src/core/gl.ts:383](https://github.com/io-gui/io/blob/main/src/core/gl.ts#L383)
