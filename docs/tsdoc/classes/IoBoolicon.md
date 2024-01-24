[io-gui](../README.md) / IoBoolicon

# Class: IoBoolicon

Input element for `Boolean` data type displayed as text.
It can be configured to display custom `true` or `false` string or icon depending on its `value`.

<io-element-demo element="io-boolean" properties='{"value": true, "true": "true", "false": "false"}'></io-element-demo>

## Hierarchy

- [`IoBoolean`](IoBoolean.md)

  ↳ **`IoBoolicon`**

## Table of contents

### Constructors

- [constructor](IoBoolicon.md#constructor)

### Properties

- [$](IoBoolicon.md#$)
- [\_bindings](IoBoolicon.md#_bindings)
- [\_changeQueue](IoBoolicon.md#_changequeue)
- [\_eventDispatcher](IoBoolicon.md#_eventdispatcher)
- [\_properties](IoBoolicon.md#_properties)
- [\_protochain](IoBoolicon.md#_protochain)
- [appearance](IoBoolicon.md#appearance)
- [class](IoBoolicon.md#class)
- [contenteditable](IoBoolicon.md#contenteditable)
- [disabled](IoBoolicon.md#disabled)
- [false](IoBoolicon.md#false)
- [hidden](IoBoolicon.md#hidden)
- [icon](IoBoolicon.md#icon)
- [id](IoBoolicon.md#id)
- [invalid](IoBoolicon.md#invalid)
- [label](IoBoolicon.md#label)
- [name](IoBoolicon.md#name)
- [placeholder](IoBoolicon.md#placeholder)
- [role](IoBoolicon.md#role)
- [selected](IoBoolicon.md#selected)
- [stroke](IoBoolicon.md#stroke)
- [tabindex](IoBoolicon.md#tabindex)
- [title](IoBoolicon.md#title)
- [true](IoBoolicon.md#true)
- [value](IoBoolicon.md#value)

### Accessors

- [textNode](IoBoolicon.md#textnode)
- [Listeners](IoBoolicon.md#listeners)
- [Properties](IoBoolicon.md#properties)
- [Style](IoBoolicon.md#style)

### Methods

- [Register](IoBoolicon.md#register)
- [\_flattenTextNode](IoBoolicon.md#_flattentextnode)
- [\_onBlur](IoBoolicon.md#_onblur)
- [\_onClick](IoBoolicon.md#_onclick)
- [\_onFocus](IoBoolicon.md#_onfocus)
- [\_onFocusTo](IoBoolicon.md#_onfocusto)
- [\_onKeydown](IoBoolicon.md#_onkeydown)
- [\_onKeyup](IoBoolicon.md#_onkeyup)
- [\_onPointerdown](IoBoolicon.md#_onpointerdown)
- [\_onPointerleave](IoBoolicon.md#_onpointerleave)
- [\_onPointermove](IoBoolicon.md#_onpointermove)
- [\_onPointerup](IoBoolicon.md#_onpointerup)
- [addEventListener](IoBoolicon.md#addeventlistener)
- [applyProperties](IoBoolicon.md#applyproperties)
- [bind](IoBoolicon.md#bind)
- [changed](IoBoolicon.md#changed)
- [connectedCallback](IoBoolicon.md#connectedcallback)
- [disabledChanged](IoBoolicon.md#disabledchanged)
- [disconnectedCallback](IoBoolicon.md#disconnectedcallback)
- [dispatchEvent](IoBoolicon.md#dispatchevent)
- [dispatchMutationEvent](IoBoolicon.md#dispatchmutationevent)
- [dispatchQueue](IoBoolicon.md#dispatchqueue)
- [dispatchQueueSync](IoBoolicon.md#dispatchqueuesync)
- [dispose](IoBoolicon.md#dispose)
- [focusTo](IoBoolicon.md#focusto)
- [getCaretPosition](IoBoolicon.md#getcaretposition)
- [init](IoBoolicon.md#init)
- [inputValue](IoBoolicon.md#inputvalue)
- [labelChanged](IoBoolicon.md#labelchanged)
- [objectMutated](IoBoolicon.md#objectmutated)
- [onObjectMutated](IoBoolicon.md#onobjectmutated)
- [queue](IoBoolicon.md#queue)
- [removeEventListener](IoBoolicon.md#removeeventlistener)
- [setAttribute](IoBoolicon.md#setattribute)
- [setCaretPosition](IoBoolicon.md#setcaretposition)
- [setProperties](IoBoolicon.md#setproperties)
- [setProperty](IoBoolicon.md#setproperty)
- [template](IoBoolicon.md#template)
- [throttle](IoBoolicon.md#throttle)
- [toggle](IoBoolicon.md#toggle)
- [traverse](IoBoolicon.md#traverse)
- [unbind](IoBoolicon.md#unbind)

## Constructors

### constructor

• **new IoBoolicon**(`...args`): [`IoBoolicon`](IoBoolicon.md)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

[`IoBoolicon`](IoBoolicon.md)

#### Inherited from

[IoBoolean](IoBoolean.md).[constructor](IoBoolean.md#constructor)

#### Defined in

[src/core/node.ts:63](https://github.com/io-gui/io/blob/main/src/core/node.ts#L63)

## Properties

### $

• **$**: `Record`\<`string`, `any`\>

#### Inherited from

[IoBoolean](IoBoolean.md).[$](IoBoolean.md#$)

#### Defined in

[src/core/element.ts:178](https://github.com/io-gui/io/blob/main/src/core/element.ts#L178)

___

### \_bindings

• `Readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoBoolean](IoBoolean.md).[_bindings](IoBoolean.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoBoolean](IoBoolean.md).[_changeQueue](IoBoolean.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoBoolean](IoBoolean.md).[_eventDispatcher](IoBoolean.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

___

### \_properties

• `Readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoBoolean](IoBoolean.md).[_properties](IoBoolean.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoBoolean](IoBoolean.md).[_protochain](IoBoolean.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

___

### appearance

• **appearance**: ``"inset"`` \| ``"flush"`` \| ``"outset"`` \| ``"neutral"``

#### Inherited from

[IoBoolean](IoBoolean.md).[appearance](IoBoolean.md#appearance)

#### Defined in

[src/elements/basic/io-field.ts:86](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L86)

___

### class

• **class**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[class](IoBoolean.md#class)

#### Defined in

[src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

___

### contenteditable

• **contenteditable**: `boolean`

#### Inherited from

[IoBoolean](IoBoolean.md).[contenteditable](IoBoolean.md#contenteditable)

#### Defined in

[src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

___

### disabled

• **disabled**: `boolean`

#### Inherited from

[IoBoolean](IoBoolean.md).[disabled](IoBoolean.md#disabled)

#### Defined in

[src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

___

### false

• **false**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[false](IoBoolean.md#false)

#### Defined in

[src/elements/basic/io-boolean.ts:28](https://github.com/io-gui/io/blob/main/src/elements/basic/io-boolean.ts#L28)

___

### hidden

• **hidden**: `boolean`

#### Inherited from

[IoBoolean](IoBoolean.md).[hidden](IoBoolean.md#hidden)

#### Defined in

[src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

___

### icon

• **icon**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[icon](IoBoolean.md#icon)

#### Defined in

[src/elements/basic/io-field.ts:83](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L83)

___

### id

• **id**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[id](IoBoolean.md#id)

#### Defined in

[src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

___

### invalid

• **invalid**: `boolean`

#### Inherited from

[IoBoolean](IoBoolean.md).[invalid](IoBoolean.md#invalid)

#### Defined in

[src/elements/basic/io-field.ts:95](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L95)

___

### label

• **label**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[label](IoBoolean.md#label)

#### Defined in

[src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

___

### name

• **name**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[name](IoBoolean.md#name)

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

___

### placeholder

• **placeholder**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[placeholder](IoBoolean.md#placeholder)

#### Defined in

[src/elements/basic/io-field.ts:98](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L98)

___

### role

• **role**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[role](IoBoolean.md#role)

#### Defined in

[src/elements/basic/io-boolean.ts:31](https://github.com/io-gui/io/blob/main/src/elements/basic/io-boolean.ts#L31)

___

### selected

• **selected**: `boolean`

#### Inherited from

[IoBoolean](IoBoolean.md).[selected](IoBoolean.md#selected)

#### Defined in

[src/elements/basic/io-field.ts:92](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L92)

___

### stroke

• **stroke**: `boolean`

#### Inherited from

[IoBoolean](IoBoolean.md).[stroke](IoBoolean.md#stroke)

#### Defined in

[src/elements/basic/io-field.ts:89](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L89)

___

### tabindex

• **tabindex**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[tabindex](IoBoolean.md#tabindex)

#### Defined in

[src/elements/basic/io-field.ts:77](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L77)

___

### title

• **title**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[title](IoBoolean.md#title)

#### Defined in

[src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

___

### true

• **true**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[true](IoBoolean.md#true)

#### Defined in

[src/elements/basic/io-boolean.ts:25](https://github.com/io-gui/io/blob/main/src/elements/basic/io-boolean.ts#L25)

___

### value

• **value**: `boolean`

#### Inherited from

[IoBoolean](IoBoolean.md).[value](IoBoolean.md#value)

#### Defined in

[src/elements/basic/io-boolean.ts:22](https://github.com/io-gui/io/blob/main/src/elements/basic/io-boolean.ts#L22)

## Accessors

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoBoolean.textNode

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

IoBoolean.textNode

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

IoBoolean.Listeners

#### Defined in

[src/elements/basic/io-field.ts:100](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L100)

___

### Properties

• `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoBoolean.Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

___

### Style

• `get` **Style**(): `string`

#### Returns

`string`

#### Inherited from

IoBoolean.Style

#### Defined in

[src/elements/basic/io-boolean.ts:13](https://github.com/io-gui/io/blob/main/src/elements/basic/io-boolean.ts#L13)

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

[IoBoolean](IoBoolean.md).[Register](IoBoolean.md#register)

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

[IoBoolean](IoBoolean.md).[_flattenTextNode](IoBoolean.md#_flattentextnode)

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

[IoBoolean](IoBoolean.md).[_onBlur](IoBoolean.md#_onblur)

#### Defined in

[src/elements/basic/io-field.ts:113](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L113)

___

### \_onClick

▸ **_onClick**(): `void`

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[_onClick](IoBoolean.md#_onclick)

#### Defined in

[src/elements/basic/io-boolean.ts:33](https://github.com/io-gui/io/blob/main/src/elements/basic/io-boolean.ts#L33)

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

[IoBoolean](IoBoolean.md).[_onFocus](IoBoolean.md#_onfocus)

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

[IoBoolean](IoBoolean.md).[_onFocusTo](IoBoolean.md#_onfocusto)

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

#### Inherited from

[IoBoolean](IoBoolean.md).[_onKeydown](IoBoolean.md#_onkeydown)

#### Defined in

[src/elements/basic/io-field.ts:139](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L139)

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

[IoBoolean](IoBoolean.md).[_onKeyup](IoBoolean.md#_onkeyup)

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

#### Inherited from

[IoBoolean](IoBoolean.md).[_onPointerdown](IoBoolean.md#_onpointerdown)

#### Defined in

[src/elements/basic/io-field.ts:118](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L118)

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

[IoBoolean](IoBoolean.md).[_onPointerleave](IoBoolean.md#_onpointerleave)

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

#### Inherited from

[IoBoolean](IoBoolean.md).[_onPointermove](IoBoolean.md#_onpointermove)

#### Defined in

[src/elements/basic/io-field.ts:124](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L124)

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

[IoBoolean](IoBoolean.md).[_onPointerup](IoBoolean.md#_onpointerup)

#### Defined in

[src/elements/basic/io-field.ts:130](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L130)

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

[IoBoolean](IoBoolean.md).[addEventListener](IoBoolean.md#addeventlistener)

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

[IoBoolean](IoBoolean.md).[applyProperties](IoBoolean.md#applyproperties)

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

[IoBoolean](IoBoolean.md).[bind](IoBoolean.md#bind)

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

[IoBoolean](IoBoolean.md).[changed](IoBoolean.md#changed)

#### Defined in

[src/elements/basic/io-boolicon.ts:6](https://github.com/io-gui/io/blob/main/src/elements/basic/io-boolicon.ts#L6)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[connectedCallback](IoBoolean.md#connectedcallback)

#### Defined in

[src/core/element.ts:213](https://github.com/io-gui/io/blob/main/src/core/element.ts#L213)

___

### disabledChanged

▸ **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[disabledChanged](IoBoolean.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[disconnectedCallback](IoBoolean.md#disconnectedcallback)

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

[IoBoolean](IoBoolean.md).[dispatchEvent](IoBoolean.md#dispatchevent)

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

[IoBoolean](IoBoolean.md).[dispatchMutationEvent](IoBoolean.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:384](https://github.com/io-gui/io/blob/main/src/core/node.ts#L384)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[dispatchQueue](IoBoolean.md#dispatchqueue)

#### Defined in

[src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[dispatchQueueSync](IoBoolean.md#dispatchqueuesync)

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

[IoBoolean](IoBoolean.md).[dispose](IoBoolean.md#dispose)

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

[IoBoolean](IoBoolean.md).[focusTo](IoBoolean.md#focusto)

#### Defined in

[src/elements/basic/io-field.ts:266](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L266)

___

### getCaretPosition

▸ **getCaretPosition**(): `number`

#### Returns

`number`

#### Inherited from

[IoBoolean](IoBoolean.md).[getCaretPosition](IoBoolean.md#getcaretposition)

#### Defined in

[src/elements/basic/io-field.ts:270](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L270)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[init](IoBoolean.md#init)

#### Defined in

[src/elements/basic/io-boolean.ts:40](https://github.com/io-gui/io/blob/main/src/elements/basic/io-boolean.ts#L40)

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

[IoBoolean](IoBoolean.md).[inputValue](IoBoolean.md#inputvalue)

#### Defined in

[src/core/node.ts:234](https://github.com/io-gui/io/blob/main/src/core/node.ts#L234)

___

### labelChanged

▸ **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[labelChanged](IoBoolean.md#labelchanged)

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

[IoBoolean](IoBoolean.md).[objectMutated](IoBoolean.md#objectmutated)

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

[IoBoolean](IoBoolean.md).[onObjectMutated](IoBoolean.md#onobjectmutated)

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

[IoBoolean](IoBoolean.md).[queue](IoBoolean.md#queue)

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

[IoBoolean](IoBoolean.md).[removeEventListener](IoBoolean.md#removeeventlistener)

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

[IoBoolean](IoBoolean.md).[setAttribute](IoBoolean.md#setattribute)

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

[IoBoolean](IoBoolean.md).[setCaretPosition](IoBoolean.md#setcaretposition)

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

[IoBoolean](IoBoolean.md).[setProperties](IoBoolean.md#setproperties)

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

[IoBoolean](IoBoolean.md).[setProperty](IoBoolean.md#setproperty)

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

[IoBoolean](IoBoolean.md).[template](IoBoolean.md#template)

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

[IoBoolean](IoBoolean.md).[throttle](IoBoolean.md#throttle)

#### Defined in

[src/core/node.ts:278](https://github.com/io-gui/io/blob/main/src/core/node.ts#L278)

___

### toggle

▸ **toggle**(): `void`

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[toggle](IoBoolean.md#toggle)

#### Defined in

[src/elements/basic/io-boolean.ts:37](https://github.com/io-gui/io/blob/main/src/elements/basic/io-boolean.ts#L37)

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

[IoBoolean](IoBoolean.md).[traverse](IoBoolean.md#traverse)

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

[IoBoolean](IoBoolean.md).[unbind](IoBoolean.md#unbind)

#### Defined in

[src/core/node.ts:336](https://github.com/io-gui/io/blob/main/src/core/node.ts#L336)
