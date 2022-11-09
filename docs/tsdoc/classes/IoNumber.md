# Class: IoNumber

Core `IoElement` class.

## Hierarchy

- [`IoField`](IoField.md)

  ↳ **`IoNumber`**

## Constructors

### constructor

• **new IoNumber**(`properties?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | `Record`<`string`, `any`\> |

#### Overrides

[IoField](IoField.md).[constructor](IoField.md#constructor)

#### Defined in

[src/elements/basic/number.ts:74](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L74)

## Properties

### $

• **$**: `Record`<`string`, `any`\>

#### Inherited from

[IoField](IoField.md).[$](IoField.md#$)

#### Defined in

[src/core/element.ts:211](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L211)

___

### \_bindings

• `Readonly` **\_bindings**: `Map`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoField](IoField.md).[_bindings](IoField.md#_bindings)

#### Defined in

[src/core/node.ts:48](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L48)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoField](IoField.md).[_changeQueue](IoField.md#_changequeue)

#### Defined in

[src/core/node.ts:49](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L49)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoField](IoField.md).[_eventDispatcher](IoField.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:50](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L50)

___

### \_properties

• `Readonly` **\_properties**: `Map`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoField](IoField.md).[_properties](IoField.md#_properties)

#### Defined in

[src/core/node.ts:47](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L47)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoField](IoField.md).[_protochain](IoField.md#_protochain)

#### Defined in

[src/core/node.ts:46](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L46)

___

### class

• **class**: `string`

#### Inherited from

[IoField](IoField.md).[class](IoField.md#class)

#### Defined in

[src/core/element.ts:220](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L220)

___

### contenteditable

• **contenteditable**: `boolean`

#### Overrides

[IoField](IoField.md).[contenteditable](IoField.md#contenteditable)

#### Defined in

[src/elements/basic/number.ts:60](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L60)

___

### conversion

• **conversion**: `number`

#### Defined in

[src/elements/basic/number.ts:45](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L45)

___

### disabled

• **disabled**: `boolean`

#### Inherited from

[IoField](IoField.md).[disabled](IoField.md#disabled)

#### Defined in

[src/core/element.ts:241](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L241)

___

### hidden

• **hidden**: `boolean`

#### Inherited from

[IoField](IoField.md).[hidden](IoField.md#hidden)

#### Defined in

[src/core/element.ts:238](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L238)

___

### icon

• **icon**: `string`

#### Inherited from

[IoField](IoField.md).[icon](IoField.md#icon)

#### Defined in

[src/elements/basic/field.ts:71](https://github.com/io-gui/io/blob/tsc/src/elements/basic/field.ts#L71)

___

### id

• **id**: `string`

#### Inherited from

[IoField](IoField.md).[id](IoField.md#id)

#### Defined in

[src/core/element.ts:235](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L235)

___

### inputmode

• **inputmode**: `string`

#### Defined in

[src/elements/basic/number.ts:69](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L69)

___

### label

• **label**: `string`

#### Inherited from

[IoField](IoField.md).[label](IoField.md#label)

#### Defined in

[src/core/element.ts:226](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L226)

___

### ladder

• **ladder**: `boolean`

#### Defined in

[src/elements/basic/number.ts:57](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L57)

___

### max

• **max**: `number`

#### Defined in

[src/elements/basic/number.ts:54](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L54)

___

### min

• **min**: `number`

#### Defined in

[src/elements/basic/number.ts:51](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L51)

___

### name

• **name**: `string`

#### Inherited from

[IoField](IoField.md).[name](IoField.md#name)

#### Defined in

[src/core/element.ts:229](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L229)

___

### pattern

• **pattern**: `string`

#### Defined in

[src/elements/basic/number.ts:66](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L66)

___

### reverse

• **reverse**: `boolean`

#### Inherited from

[IoField](IoField.md).[reverse](IoField.md#reverse)

#### Defined in

[src/elements/basic/field.ts:77](https://github.com/io-gui/io/blob/tsc/src/elements/basic/field.ts#L77)

___

### role

• **role**: `string`

#### Overrides

[IoField](IoField.md).[role](IoField.md#role)

#### Defined in

[src/elements/basic/number.ts:39](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L39)

___

### selected

• **selected**: `boolean`

#### Inherited from

[IoField](IoField.md).[selected](IoField.md#selected)

#### Defined in

[src/elements/basic/field.ts:80](https://github.com/io-gui/io/blob/tsc/src/elements/basic/field.ts#L80)

___

### spellcheck

• **spellcheck**: `string`

#### Defined in

[src/elements/basic/number.ts:72](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L72)

___

### step

• **step**: `number`

#### Defined in

[src/elements/basic/number.ts:48](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L48)

___

### stroke

• **stroke**: `boolean`

#### Inherited from

[IoField](IoField.md).[stroke](IoField.md#stroke)

#### Defined in

[src/elements/basic/field.ts:74](https://github.com/io-gui/io/blob/tsc/src/elements/basic/field.ts#L74)

___

### tabindex

• **tabindex**: `string`

#### Inherited from

[IoField](IoField.md).[tabindex](IoField.md#tabindex)

#### Defined in

[src/elements/basic/field.ts:65](https://github.com/io-gui/io/blob/tsc/src/elements/basic/field.ts#L65)

___

### title

• **title**: `string`

#### Inherited from

[IoField](IoField.md).[title](IoField.md#title)

#### Defined in

[src/core/element.ts:232](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L232)

___

### type

• **type**: `string`

#### Defined in

[src/elements/basic/number.ts:63](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L63)

___

### value

• **value**: `number`

#### Overrides

[IoField](IoField.md).[value](IoField.md#value)

#### Defined in

[src/elements/basic/number.ts:42](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L42)

## Accessors

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoField.textNode

#### Defined in

[src/core/element.ts:392](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L392)

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

[src/core/element.ts:396](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L396)

___

### Listeners

• `Static` `get` **Listeners**(): `Object`

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

[src/elements/basic/field.ts:82](https://github.com/io-gui/io/blob/tsc/src/elements/basic/field.ts#L82)

___

### Properties

• `Static` `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoField.Properties

#### Defined in

[src/core/node.ts:37](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L37)

___

### Style

• `Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoField.Style

#### Defined in

[src/elements/basic/number.ts:9](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L9)

___

### observedAttributes

• `Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoField.observedAttributes

#### Defined in

[src/core/element.ts:243](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L243)

## Methods

### \_expandLadder

▸ **_expandLadder**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/basic/number.ts:124](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L124)

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

[src/core/element.ts:375](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L375)

___

### \_onBlur

▸ **_onBlur**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `FocusEvent` |

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[_onBlur](IoField.md#_onblur)

#### Defined in

[src/elements/basic/number.ts:112](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L112)

___

### \_onClick

▸ **_onClick**(): `void`

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[_onClick](IoField.md#_onclick)

#### Defined in

[src/elements/basic/field.ts:118](https://github.com/io-gui/io/blob/tsc/src/elements/basic/field.ts#L118)

___

### \_onFocus

▸ **_onFocus**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `FocusEvent` |

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[_onFocus](IoField.md#_onfocus)

#### Defined in

[src/elements/basic/number.ts:106](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L106)

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

[IoField](IoField.md).[_onFocusTo](IoField.md#_onfocusto)

#### Defined in

[src/elements/basic/field.ts:141](https://github.com/io-gui/io/blob/tsc/src/elements/basic/field.ts#L141)

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

[src/elements/basic/number.ts:128](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L128)

___

### \_onKeyup

▸ **_onKeyup**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `KeyboardEvent` |

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[_onKeyup](IoField.md#_onkeyup)

#### Defined in

[src/elements/basic/number.ts:188](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L188)

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

[src/elements/basic/number.ts:78](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L78)

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

[src/elements/basic/field.ts:107](https://github.com/io-gui/io/blob/tsc/src/elements/basic/field.ts#L107)

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

[IoField](IoField.md).[_onPointermove](IoField.md#_onpointermove)

#### Defined in

[src/elements/basic/field.ts:106](https://github.com/io-gui/io/blob/tsc/src/elements/basic/field.ts#L106)

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

[src/elements/basic/number.ts:85](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L85)

___

### \_setFromTextNode

▸ **_setFromTextNode**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/basic/number.ts:195](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L195)

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

[src/core/node.ts:319](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L319)

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

[src/core/element.ts:400](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L400)

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

[IoField](IoField.md).[attributeChangedCallback](IoField.md#attributechangedcallback)

#### Defined in

[src/core/element.ts:253](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L253)

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

[src/core/node.ts:288](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L288)

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

[src/elements/basic/number.ts:208](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L208)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[connectedCallback](IoField.md#connectedcallback)

#### Defined in

[src/core/element.ts:271](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L271)

___

### disabledChanged

▸ **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[disabledChanged](IoField.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L429)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[disconnectedCallback](IoField.md#disconnectedcallback)

#### Defined in

[src/core/element.ts:279](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L279)

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

[src/core/node.ts:344](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L344)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[dispatchQueue](IoField.md#dispatchqueue)

#### Defined in

[src/core/node.ts:230](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L230)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[dispatchQueueSync](IoField.md#dispatchqueuesync)

#### Defined in

[src/core/node.ts:240](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L240)

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

[src/core/node.ts:351](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L351)

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

[IoField](IoField.md).[disposeDeep](IoField.md#disposedeep)

#### Defined in

[src/core/element.ts:295](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L295)

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

[src/elements/basic/field.ts:248](https://github.com/io-gui/io/blob/tsc/src/elements/basic/field.ts#L248)

___

### getCaretPosition

▸ **getCaretPosition**(): `number`

#### Returns

`number`

#### Inherited from

[IoField](IoField.md).[getCaretPosition](IoField.md#getcaretposition)

#### Defined in

[src/elements/basic/field.ts:252](https://github.com/io-gui/io/blob/tsc/src/elements/basic/field.ts#L252)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[init](IoField.md#init)

#### Defined in

[src/elements/basic/number.ts:205](https://github.com/io-gui/io/blob/tsc/src/elements/basic/number.ts#L205)

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

[src/core/node.ts:205](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L205)

___

### labelChanged

▸ **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[labelChanged](IoField.md#labelchanged)

#### Defined in

[src/core/element.ts:422](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L422)

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

[src/core/node.ts:279](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L279)

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

[IoField](IoField.md).[onObjectMutated](IoField.md#onobjectmutated)

#### Defined in

[src/core/node.ts:258](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L258)

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

[src/core/node.ts:224](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L224)

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

[src/core/node.ts:334](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L334)

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

[src/core/element.ts:413](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L413)

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

[src/elements/basic/field.ts:265](https://github.com/io-gui/io/blob/tsc/src/elements/basic/field.ts#L265)

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

[src/core/node.ts:188](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L188)

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

[src/core/node.ts:109](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L109)

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

[IoField](IoField.md).[template](IoField.md#template)

#### Defined in

[src/core/element.ts:289](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L289)

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

[IoField](IoField.md).[throttle](IoField.md#throttle)

#### Defined in

[src/core/node.ts:249](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L249)

___

### traverse

▸ **traverse**(`vChildren`, `host?`): `void`

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

[IoField](IoField.md).[traverse](IoField.md#traverse)

#### Defined in

[src/core/element.ts:319](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L319)

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

[src/core/node.ts:303](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L303)
