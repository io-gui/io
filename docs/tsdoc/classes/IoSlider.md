# Class: IoSlider

Core `IoElement` class.

## Hierarchy

- [`IoGl`](IoGl.md)

  ↳ **`IoSlider`**

  ↳↳ [`IoSliderRange`](IoSliderRange.md)

## Constructors

### constructor

• **new IoSlider**(`properties?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | `Record`<`string`, `any`\> |

#### Inherited from

[IoGl](IoGl.md).[constructor](IoGl.md#constructor)

#### Defined in

[src/elements/core/gl.ts:215](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L215)

## Properties

### $

• **$**: `Record`<`string`, `any`\>

#### Inherited from

[IoGl](IoGl.md).[$](IoGl.md#$)

#### Defined in

[src/core/element.ts:219](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L219)

___

### \_bindings

• `Readonly` **\_bindings**: `Record`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoGl](IoGl.md).[_bindings](IoGl.md#_bindings)

#### Defined in

[src/core/node.ts:48](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L48)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoGl](IoGl.md).[_changeQueue](IoGl.md#_changequeue)

#### Defined in

[src/core/node.ts:49](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L49)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoGl](IoGl.md).[_eventDispatcher](IoGl.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:50](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L50)

___

### \_properties

• `Readonly` **\_properties**: `Record`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoGl](IoGl.md).[_properties](IoGl.md#_properties)

#### Defined in

[src/core/node.ts:47](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L47)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoGl](IoGl.md).[_protochain](IoGl.md#_protochain)

#### Defined in

[src/core/node.ts:46](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L46)

___

### class

• **class**: `string`

#### Inherited from

[IoGl](IoGl.md).[class](IoGl.md#class)

#### Defined in

[src/core/element.ts:228](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L228)

___

### contenteditable

• **contenteditable**: `boolean`

#### Inherited from

[IoGl](IoGl.md).[contenteditable](IoGl.md#contenteditable)

#### Defined in

[src/core/element.ts:225](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L225)

___

### css

• **css**: `IoTheme`

#### Inherited from

[IoGl](IoGl.md).[css](IoGl.md#css)

#### Defined in

[src/elements/core/gl.ts:214](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L214)

___

### disabled

• **disabled**: `boolean`

#### Inherited from

[IoGl](IoGl.md).[disabled](IoGl.md#disabled)

#### Defined in

[src/core/element.ts:249](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L249)

___

### hidden

• **hidden**: `boolean`

#### Inherited from

[IoGl](IoGl.md).[hidden](IoGl.md#hidden)

#### Defined in

[src/core/element.ts:246](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L246)

___

### id

• **id**: `string`

#### Inherited from

[IoGl](IoGl.md).[id](IoGl.md#id)

#### Defined in

[src/core/element.ts:243](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L243)

___

### label

• **label**: `string`

#### Inherited from

[IoGl](IoGl.md).[label](IoGl.md#label)

#### Defined in

[src/core/element.ts:234](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L234)

___

### name

• **name**: `string`

#### Inherited from

[IoGl](IoGl.md).[name](IoGl.md#name)

#### Defined in

[src/core/element.ts:237](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L237)

___

### role

• **role**: `string`

#### Inherited from

[IoGl](IoGl.md).[role](IoGl.md#role)

#### Defined in

[src/core/element.ts:231](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L231)

___

### tabindex

• **tabindex**: `string`

#### Inherited from

[IoGl](IoGl.md).[tabindex](IoGl.md#tabindex)

#### Defined in

[src/core/element.ts:222](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L222)

___

### title

• **title**: `string`

#### Inherited from

[IoGl](IoGl.md).[title](IoGl.md#title)

#### Defined in

[src/core/element.ts:240](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L240)

## Accessors

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoGl.textNode

#### Defined in

[src/core/element.ts:409](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L409)

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

[src/core/element.ts:413](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L413)

___

### Frag

• `Static` `get` **Frag**(): `string`

#### Returns

`string`

#### Overrides

IoGl.Frag

#### Defined in

[src/elements/core/slider.ts:261](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L261)

___

### GlUtils

• `Static` `get` **GlUtils**(): `string`

#### Returns

`string`

#### Overrides

IoGl.GlUtils

#### Defined in

[src/elements/core/slider.ts:224](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L224)

___

### Listeners

• `Static` `get` **Listeners**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `contextmenu` | `string` |
| `focus` | `string` |
| `pointerdown` | `string` |
| `touchstart` | `string` |

#### Overrides

IoGl.Listeners

#### Defined in

[src/elements/core/slider.ts:63](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L63)

___

### Properties

• `Static` `get` **Properties**(): `any`

#### Returns

`any`

#### Overrides

IoGl.Properties

#### Defined in

[src/elements/core/slider.ts:46](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L46)

___

### Style

• `Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoGl.Style

#### Defined in

[src/elements/core/slider.ts:16](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L16)

___

### Vert

• `Static` `get` **Vert**(): `string`

#### Returns

`string`

#### Inherited from

IoGl.Vert

#### Defined in

[src/elements/core/gl.ts:90](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L90)

___

### observedAttributes

• `Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoGl.observedAttributes

#### Defined in

[src/core/element.ts:256](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L256)

## Methods

### \_getCoordFromValue

▸ **_getCoordFromValue**(`value`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`number`

#### Defined in

[src/elements/core/slider.ts:135](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L135)

___

### \_getPointerCoord

▸ **_getPointerCoord**(`event`): `number`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`number`[]

#### Defined in

[src/elements/core/slider.ts:124](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L124)

___

### \_getValueFromCoord

▸ **_getValueFromCoord**(`coord`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `coord` | `number` |

#### Returns

`number`

#### Defined in

[src/elements/core/slider.ts:130](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L130)

___

### \_inputValue

▸ **_inputValue**(`x`, `y?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y?` | `number` |

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:149](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L149)

___

### \_onBlur

▸ **_onBlur**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:75](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L75)

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

[src/elements/core/slider.ts:79](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L79)

___

### \_onFocus

▸ **_onFocus**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:71](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L71)

___

### \_onFocusTo

▸ **_onFocusTo**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`<`any`\> |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[_onFocusTo](IoGl.md#_onfocusto)

#### Defined in

[src/core/element.ts:453](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L453)

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

[src/elements/core/slider.ts:152](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L152)

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

[src/elements/core/slider.ts:110](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L110)

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

[src/elements/core/slider.ts:115](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L115)

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

[src/elements/core/slider.ts:139](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L139)

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

[src/elements/core/slider.ts:119](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L119)

___

### \_onRender

▸ **_onRender**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[_onRender](IoGl.md#_onrender)

#### Defined in

[src/elements/core/gl.ts:304](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L304)

___

### \_onTouchend

▸ **_onTouchend**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:106](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L106)

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

[src/elements/core/slider.ts:89](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L89)

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

[src/elements/core/slider.ts:82](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L82)

___

### \_setDecrease

▸ **_setDecrease**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:198](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L198)

___

### \_setIncrease

▸ **_setIncrease**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:193](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L193)

___

### \_setMax

▸ **_setMax**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:208](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L208)

___

### \_setMin

▸ **_setMin**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:203](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L203)

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

[src/core/node.ts:317](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L317)

___

### applyAria

▸ **applyAria**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:217](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L217)

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

[src/core/element.ts:417](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L417)

___

### attributeChangedCallback

▸ **attributeChangedCallback**(`prop`, `oldValue`, `newValue`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `prop` | `string` |
| `oldValue` | `any` |
| `newValue` | `any` |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[attributeChangedCallback](IoGl.md#attributechangedcallback)

#### Defined in

[src/core/element.ts:266](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L266)

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

[src/core/node.ts:290](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L290)

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

[src/elements/core/slider.ts:214](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L214)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[connectedCallback](IoGl.md#connectedcallback)

#### Defined in

[src/core/element.ts:284](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L284)

___

### cssMutated

▸ **cssMutated**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[cssMutated](IoGl.md#cssmutated)

#### Defined in

[src/elements/core/gl.ts:289](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L289)

___

### disabledChanged

▸ **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[disabledChanged](IoGl.md#disabledchanged)

#### Defined in

[src/core/element.ts:446](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L446)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[disconnectedCallback](IoGl.md#disconnectedcallback)

#### Defined in

[src/core/element.ts:292](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L292)

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

[src/core/node.ts:342](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L342)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[dispatchQueue](IoGl.md#dispatchqueue)

#### Defined in

[src/core/node.ts:232](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L232)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[dispatchQueueSync](IoGl.md#dispatchqueuesync)

#### Defined in

[src/core/node.ts:242](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L242)

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

[src/core/node.ts:349](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L349)

___

### disposeDeep

▸ **disposeDeep**(`host`, `child`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `host` | `HTMLElement` |
| `child` | `any` |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[disposeDeep](IoGl.md#disposedeep)

#### Defined in

[src/core/element.ts:308](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L308)

___

### flattenTextNode

▸ **flattenTextNode**(`element`): `void`

Helper function to flatten textContent into a single TextNode.
Update textContent via TextNode is better for layout performance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `element` | `HTMLElement` \| [`IoElement`](IoElement.md) | Element to flatten. |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[flattenTextNode](IoGl.md#flattentextnode)

#### Defined in

[src/core/element.ts:392](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L392)

___

### focusTo

▸ **focusTo**(`dir`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dir` | `string` |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[focusTo](IoGl.md#focusto)

#### Defined in

[src/core/element.ts:560](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L560)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[init](IoGl.md#init)

#### Defined in

[src/core/node.ts:219](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L219)

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

[src/elements/core/gl.ts:146](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L146)

___

### initShader

▸ **initShader**(): `WebGLProgram`

#### Returns

`WebGLProgram`

#### Inherited from

[IoGl](IoGl.md).[initShader](IoGl.md#initshader)

#### Defined in

[src/elements/core/gl.ts:162](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L162)

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

[src/core/node.ts:207](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L207)

___

### labelChanged

▸ **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[labelChanged](IoGl.md#labelchanged)

#### Defined in

[src/core/element.ts:439](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L439)

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

[src/core/node.ts:281](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L281)

___

### onObjectMutated

▸ **onObjectMutated**(`event`): `void`

Event handler for 'object-mutated' event emitted from the `window`.
Node should be listening for this event if it has an observed object property

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `CustomEvent`<`any`\> | Event payload. |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[onObjectMutated](IoGl.md#onobjectmutated)

#### Defined in

[src/core/node.ts:260](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L260)

___

### onResized

▸ **onResized**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[onResized](IoGl.md#onresized)

#### Defined in

[src/elements/core/gl.ts:262](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L262)

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

[src/core/node.ts:226](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L226)

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

[src/core/node.ts:332](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L332)

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

[src/core/element.ts:430](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L430)

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

[src/core/node.ts:190](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L190)

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

[src/core/node.ts:109](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L109)

___

### setShaderProgram

▸ **setShaderProgram**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[setShaderProgram](IoGl.md#setshaderprogram)

#### Defined in

[src/elements/core/gl.ts:332](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L332)

___

### setUniform

▸ **setUniform**(`name`, `type`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `type` | `UniformTypes` |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[setUniform](IoGl.md#setuniform)

#### Defined in

[src/elements/core/gl.ts:349](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L349)

___

### template

▸ **template**(`vDOM`, `host?`): `void`

Renders DOM from virtual DOM arrays.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vDOM` | `any`[] | Array of vDOM children. |
| `host?` | `HTMLElement` | Optional template target. |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[template](IoGl.md#template)

#### Defined in

[src/core/element.ts:302](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L302)

___

### throttle

▸ **throttle**(`func`, `arg?`, `sync?`): `void`

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

[IoGl](IoGl.md).[throttle](IoGl.md#throttle)

#### Defined in

[src/core/node.ts:251](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L251)

___

### traverse

▸ **traverse**(`vChildren`, `host?`): `void`

Recurively traverses vDOM.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vChildren` | `any`[] | Array of vDOM children converted by `buildTree()` for easier parsing. |
| `host?` | `HTMLElement` | Optional template target. |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[traverse](IoGl.md#traverse)

#### Defined in

[src/core/element.ts:332](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L332)

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

[src/core/node.ts:303](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L303)

___

### updateCssUniforms

▸ **updateCssUniforms**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[updateCssUniforms](IoGl.md#updatecssuniforms)

#### Defined in

[src/elements/core/gl.ts:344](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L344)

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

[src/elements/core/gl.ts:338](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L338)
