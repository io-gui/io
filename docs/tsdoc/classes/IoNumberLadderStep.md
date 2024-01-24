[io-gui](../README.md) / IoNumberLadderStep

# Class: IoNumberLadderStep

Core `IoElement` class.

## Hierarchy

- [`IoField`](IoField.md)

  ↳ **`IoNumberLadderStep`**

## Table of contents

### Constructors

- [constructor](IoNumberLadderStep.md#constructor)

### Properties

- [$](IoNumberLadderStep.md#$)
- [\_bindings](IoNumberLadderStep.md#_bindings)
- [\_changeQueue](IoNumberLadderStep.md#_changequeue)
- [\_eventDispatcher](IoNumberLadderStep.md#_eventdispatcher)
- [\_properties](IoNumberLadderStep.md#_properties)
- [\_protochain](IoNumberLadderStep.md#_protochain)
- [appearance](IoNumberLadderStep.md#appearance)
- [class](IoNumberLadderStep.md#class)
- [contenteditable](IoNumberLadderStep.md#contenteditable)
- [disabled](IoNumberLadderStep.md#disabled)
- [hidden](IoNumberLadderStep.md#hidden)
- [icon](IoNumberLadderStep.md#icon)
- [id](IoNumberLadderStep.md#id)
- [invalid](IoNumberLadderStep.md#invalid)
- [label](IoNumberLadderStep.md#label)
- [name](IoNumberLadderStep.md#name)
- [placeholder](IoNumberLadderStep.md#placeholder)
- [role](IoNumberLadderStep.md#role)
- [selected](IoNumberLadderStep.md#selected)
- [stroke](IoNumberLadderStep.md#stroke)
- [tabindex](IoNumberLadderStep.md#tabindex)
- [title](IoNumberLadderStep.md#title)
- [type](IoNumberLadderStep.md#type)
- [value](IoNumberLadderStep.md#value)

### Accessors

- [textNode](IoNumberLadderStep.md#textnode)
- [Listeners](IoNumberLadderStep.md#listeners)
- [Properties](IoNumberLadderStep.md#properties)
- [Style](IoNumberLadderStep.md#style)

### Methods

- [Register](IoNumberLadderStep.md#register)
- [\_flattenTextNode](IoNumberLadderStep.md#_flattentextnode)
- [\_onBlur](IoNumberLadderStep.md#_onblur)
- [\_onClick](IoNumberLadderStep.md#_onclick)
- [\_onFocus](IoNumberLadderStep.md#_onfocus)
- [\_onFocusTo](IoNumberLadderStep.md#_onfocusto)
- [\_onKeydown](IoNumberLadderStep.md#_onkeydown)
- [\_onKeyup](IoNumberLadderStep.md#_onkeyup)
- [\_onPointerdown](IoNumberLadderStep.md#_onpointerdown)
- [\_onPointerleave](IoNumberLadderStep.md#_onpointerleave)
- [\_onPointermove](IoNumberLadderStep.md#_onpointermove)
- [\_onPointerup](IoNumberLadderStep.md#_onpointerup)
- [addEventListener](IoNumberLadderStep.md#addeventlistener)
- [applyProperties](IoNumberLadderStep.md#applyproperties)
- [bind](IoNumberLadderStep.md#bind)
- [changed](IoNumberLadderStep.md#changed)
- [connectedCallback](IoNumberLadderStep.md#connectedcallback)
- [disabledChanged](IoNumberLadderStep.md#disabledchanged)
- [disconnectedCallback](IoNumberLadderStep.md#disconnectedcallback)
- [dispatchEvent](IoNumberLadderStep.md#dispatchevent)
- [dispatchMutationEvent](IoNumberLadderStep.md#dispatchmutationevent)
- [dispatchQueue](IoNumberLadderStep.md#dispatchqueue)
- [dispatchQueueSync](IoNumberLadderStep.md#dispatchqueuesync)
- [dispose](IoNumberLadderStep.md#dispose)
- [focusTo](IoNumberLadderStep.md#focusto)
- [getCaretPosition](IoNumberLadderStep.md#getcaretposition)
- [init](IoNumberLadderStep.md#init)
- [inputValue](IoNumberLadderStep.md#inputvalue)
- [labelChanged](IoNumberLadderStep.md#labelchanged)
- [objectMutated](IoNumberLadderStep.md#objectmutated)
- [onObjectMutated](IoNumberLadderStep.md#onobjectmutated)
- [queue](IoNumberLadderStep.md#queue)
- [removeEventListener](IoNumberLadderStep.md#removeeventlistener)
- [setAttribute](IoNumberLadderStep.md#setattribute)
- [setCaretPosition](IoNumberLadderStep.md#setcaretposition)
- [setProperties](IoNumberLadderStep.md#setproperties)
- [setProperty](IoNumberLadderStep.md#setproperty)
- [template](IoNumberLadderStep.md#template)
- [throttle](IoNumberLadderStep.md#throttle)
- [traverse](IoNumberLadderStep.md#traverse)
- [unbind](IoNumberLadderStep.md#unbind)

## Constructors

### constructor

• **new IoNumberLadderStep**(`...args`): [`IoNumberLadderStep`](IoNumberLadderStep.md)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

[`IoNumberLadderStep`](IoNumberLadderStep.md)

#### Inherited from

[IoField](IoField.md).[constructor](IoField.md#constructor)

#### Defined in

[src/core/node.ts:63](https://github.com/io-gui/io/blob/main/src/core/node.ts#L63)

## Properties

### $

• **$**: `Record`\<`string`, `any`\>

#### Inherited from

[IoField](IoField.md).[$](IoField.md#$)

#### Defined in

[src/core/element.ts:178](https://github.com/io-gui/io/blob/main/src/core/element.ts#L178)

___

### \_bindings

• `Readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoField](IoField.md).[_bindings](IoField.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoField](IoField.md).[_changeQueue](IoField.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoField](IoField.md).[_eventDispatcher](IoField.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

___

### \_properties

• `Readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoField](IoField.md).[_properties](IoField.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoField](IoField.md).[_protochain](IoField.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

___

### appearance

• **appearance**: ``"inset"`` \| ``"flush"`` \| ``"outset"`` \| ``"neutral"``

#### Inherited from

[IoField](IoField.md).[appearance](IoField.md#appearance)

#### Defined in

[src/elements/basic/io-field.ts:86](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L86)

___

### class

• **class**: `string`

#### Inherited from

[IoField](IoField.md).[class](IoField.md#class)

#### Defined in

[src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

___

### contenteditable

• **contenteditable**: `boolean`

#### Inherited from

[IoField](IoField.md).[contenteditable](IoField.md#contenteditable)

#### Defined in

[src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

___

### disabled

• **disabled**: `boolean`

#### Inherited from

[IoField](IoField.md).[disabled](IoField.md#disabled)

#### Defined in

[src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

___

### hidden

• **hidden**: `boolean`

#### Inherited from

[IoField](IoField.md).[hidden](IoField.md#hidden)

#### Defined in

[src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

___

### icon

• **icon**: `string`

#### Inherited from

[IoField](IoField.md).[icon](IoField.md#icon)

#### Defined in

[src/elements/basic/io-field.ts:83](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L83)

___

### id

• **id**: `string`

#### Inherited from

[IoField](IoField.md).[id](IoField.md#id)

#### Defined in

[src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

___

### invalid

• **invalid**: `boolean`

#### Inherited from

[IoField](IoField.md).[invalid](IoField.md#invalid)

#### Defined in

[src/elements/basic/io-field.ts:95](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L95)

___

### label

• **label**: `string`

#### Inherited from

[IoField](IoField.md).[label](IoField.md#label)

#### Defined in

[src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

___

### name

• **name**: `string`

#### Inherited from

[IoField](IoField.md).[name](IoField.md#name)

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

___

### placeholder

• **placeholder**: `string`

#### Inherited from

[IoField](IoField.md).[placeholder](IoField.md#placeholder)

#### Defined in

[src/elements/basic/io-field.ts:98](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L98)

___

### role

• **role**: `string`

#### Overrides

[IoField](IoField.md).[role](IoField.md#role)

#### Defined in

[src/elements/basic/io-number.ts:275](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L275)

___

### selected

• **selected**: `boolean`

#### Inherited from

[IoField](IoField.md).[selected](IoField.md#selected)

#### Defined in

[src/elements/basic/io-field.ts:92](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L92)

___

### stroke

• **stroke**: `boolean`

#### Inherited from

[IoField](IoField.md).[stroke](IoField.md#stroke)

#### Defined in

[src/elements/basic/io-field.ts:89](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L89)

___

### tabindex

• **tabindex**: `string`

#### Inherited from

[IoField](IoField.md).[tabindex](IoField.md#tabindex)

#### Defined in

[src/elements/basic/io-field.ts:77](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L77)

___

### title

• **title**: `string`

#### Inherited from

[IoField](IoField.md).[title](IoField.md#title)

#### Defined in

[src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

___

### type

• **type**: `string`

#### Defined in

[src/elements/basic/io-number.ts:272](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L272)

___

### value

• **value**: `number`

#### Overrides

[IoField](IoField.md).[value](IoField.md#value)

#### Defined in

[src/elements/basic/io-number.ts:269](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L269)

## Accessors

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoField.textNode

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

IoField.textNode

#### Defined in

[src/core/element.ts:396](https://github.com/io-gui/io/blob/main/src/core/element.ts#L396)

___

### Listeners

• `get` **Listeners**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `click` | `string` |
| `focus` | `string` |
| `focus-to` | `string` |
| `pointerdown` | `string` |

#### Inherited from

IoField.Listeners

#### Defined in

[src/elements/basic/io-field.ts:100](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L100)

___

### Properties

• `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoField.Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

___

### Style

• `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoField.Style

#### Defined in

[src/elements/basic/io-number.ts:242](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L242)

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

[IoField](IoField.md).[Register](IoField.md#register)

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

[IoField](IoField.md).[_flattenTextNode](IoField.md#_flattentextnode)

#### Defined in

[src/core/element.ts:375](https://github.com/io-gui/io/blob/main/src/core/element.ts#L375)

___

### \_onBlur

▸ **_onBlur**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `FocusEvent` |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[_onBlur](IoField.md#_onblur)

#### Defined in

[src/elements/basic/io-field.ts:113](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L113)

___

### \_onClick

▸ **_onClick**(): `void`

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[_onClick](IoField.md#_onclick)

#### Defined in

[src/elements/basic/io-field.ts:136](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L136)

___

### \_onFocus

▸ **_onFocus**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `FocusEvent` |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[_onFocus](IoField.md#_onfocus)

#### Defined in

[src/elements/basic/io-field.ts:108](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L108)

___

### \_onFocusTo

▸ **_onFocusTo**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`\<`any`\> |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[_onFocusTo](IoField.md#_onfocusto)

#### Defined in

[src/elements/basic/io-field.ts:159](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L159)

___

### \_onKeydown

▸ **_onKeydown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `KeyboardEvent` |

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[_onKeydown](IoField.md#_onkeydown)

#### Defined in

[src/elements/basic/io-number.ts:277](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L277)

___

### \_onKeyup

▸ **_onKeyup**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `KeyboardEvent` |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[_onKeyup](IoField.md#_onkeyup)

#### Defined in

[src/elements/basic/io-field.ts:158](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L158)

___

### \_onPointerdown

▸ **_onPointerdown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[_onPointerdown](IoField.md#_onpointerdown)

#### Defined in

[src/elements/basic/io-number.ts:298](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L298)

___

### \_onPointerleave

▸ **_onPointerleave**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[_onPointerleave](IoField.md#_onpointerleave)

#### Defined in

[src/elements/basic/io-field.ts:125](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L125)

___

### \_onPointermove

▸ **_onPointermove**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[_onPointermove](IoField.md#_onpointermove)

#### Defined in

[src/elements/basic/io-number.ts:304](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L304)

___

### \_onPointerup

▸ **_onPointerup**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[_onPointerup](IoField.md#_onpointerup)

#### Defined in

[src/elements/basic/io-number.ts:314](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L314)

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

[IoField](IoField.md).[addEventListener](IoField.md#addeventlistener)

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

[IoField](IoField.md).[applyProperties](IoField.md#applyproperties)

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

[IoField](IoField.md).[bind](IoField.md#bind)

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

[IoField](IoField.md).[changed](IoField.md#changed)

#### Defined in

[src/elements/basic/io-number.ts:323](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L323)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[connectedCallback](IoField.md#connectedcallback)

#### Defined in

[src/core/element.ts:213](https://github.com/io-gui/io/blob/main/src/core/element.ts#L213)

___

### disabledChanged

▸ **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[disabledChanged](IoField.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[disconnectedCallback](IoField.md#disconnectedcallback)

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

[IoField](IoField.md).[dispatchEvent](IoField.md#dispatchevent)

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

[IoField](IoField.md).[dispatchMutationEvent](IoField.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:384](https://github.com/io-gui/io/blob/main/src/core/node.ts#L384)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[dispatchQueue](IoField.md#dispatchqueue)

#### Defined in

[src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[dispatchQueueSync](IoField.md#dispatchqueuesync)

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

[IoField](IoField.md).[dispose](IoField.md#dispose)

#### Defined in

[src/core/node.ts:391](https://github.com/io-gui/io/blob/main/src/core/node.ts#L391)

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

[IoField](IoField.md).[focusTo](IoField.md#focusto)

#### Defined in

[src/elements/basic/io-field.ts:266](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L266)

___

### getCaretPosition

▸ **getCaretPosition**(): `number`

#### Returns

`number`

#### Inherited from

[IoField](IoField.md).[getCaretPosition](IoField.md#getcaretposition)

#### Defined in

[src/elements/basic/io-field.ts:270](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L270)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[init](IoField.md#init)

#### Defined in

[src/elements/basic/io-number.ts:320](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L320)

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

[IoField](IoField.md).[inputValue](IoField.md#inputvalue)

#### Defined in

[src/core/node.ts:234](https://github.com/io-gui/io/blob/main/src/core/node.ts#L234)

___

### labelChanged

▸ **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[labelChanged](IoField.md#labelchanged)

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

[IoField](IoField.md).[objectMutated](IoField.md#objectmutated)

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

[IoField](IoField.md).[onObjectMutated](IoField.md#onobjectmutated)

#### Defined in

[src/core/node.ts:287](https://github.com/io-gui/io/blob/main/src/core/node.ts#L287)

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

[IoField](IoField.md).[queue](IoField.md#queue)

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

[IoField](IoField.md).[removeEventListener](IoField.md#removeeventlistener)

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

[IoField](IoField.md).[setAttribute](IoField.md#setattribute)

#### Defined in

[src/core/element.ts:413](https://github.com/io-gui/io/blob/main/src/core/element.ts#L413)

___

### setCaretPosition

▸ **setCaretPosition**(`position`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `number` |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[setCaretPosition](IoField.md#setcaretposition)

#### Defined in

[src/elements/basic/io-field.ts:283](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L283)

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

[IoField](IoField.md).[setProperties](IoField.md#setproperties)

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

[IoField](IoField.md).[setProperty](IoField.md#setproperty)

#### Defined in

[src/core/node.ts:121](https://github.com/io-gui/io/blob/main/src/core/node.ts#L121)

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

[IoField](IoField.md).[template](IoField.md#template)

#### Defined in

[src/core/element.ts:233](https://github.com/io-gui/io/blob/main/src/core/element.ts#L233)

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

[IoField](IoField.md).[throttle](IoField.md#throttle)

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

[IoField](IoField.md).[traverse](IoField.md#traverse)

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

[IoField](IoField.md).[unbind](IoField.md#unbind)

#### Defined in

[src/core/node.ts:336](https://github.com/io-gui/io/blob/main/src/core/node.ts#L336)
