# Class: IoBoolean

Core `IoElement` class.

## Hierarchy

- [`IoField`](IoField.md)

  ↳ **`IoBoolean`**

  ↳↳ [`IoSwitch`](IoSwitch.md)

## Constructors

### constructor

• **new IoBoolean**(`properties?`, ...`args`)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `properties` | `Record`<`string`, `any`\> | Initial property values. |
| `...args` | `any`[] | - |

#### Inherited from

[IoField](IoField.md).[constructor](IoField.md#constructor)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L55)

## Properties

### $

• **$**: `Record`<`string`, `any`\>

#### Inherited from

[IoField](IoField.md).[$](IoField.md#$)

#### Defined in

[src/core/element.ts:219](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L219)

___

### \_bindings

• `Readonly` **\_bindings**: `Record`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoField](IoField.md).[_bindings](IoField.md#_bindings)

#### Defined in

[src/core/node.ts:48](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L48)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoField](IoField.md).[_changeQueue](IoField.md#_changequeue)

#### Defined in

[src/core/node.ts:49](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L49)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoField](IoField.md).[_eventDispatcher](IoField.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:50](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L50)

___

### \_properties

• `Readonly` **\_properties**: `Record`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoField](IoField.md).[_properties](IoField.md#_properties)

#### Defined in

[src/core/node.ts:47](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L47)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoField](IoField.md).[_protochain](IoField.md#_protochain)

#### Defined in

[src/core/node.ts:46](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L46)

___

### class

• **class**: `string`

#### Inherited from

[IoField](IoField.md).[class](IoField.md#class)

#### Defined in

[src/core/element.ts:228](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L228)

___

### contenteditable

• **contenteditable**: `boolean`

#### Inherited from

[IoField](IoField.md).[contenteditable](IoField.md#contenteditable)

#### Defined in

[src/core/element.ts:225](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L225)

___

### disabled

• **disabled**: `boolean`

#### Inherited from

[IoField](IoField.md).[disabled](IoField.md#disabled)

#### Defined in

[src/core/element.ts:249](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L249)

___

### false

• **false**: `string`

#### Defined in

[src/elements/core/boolean.ts:26](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L26)

___

### hidden

• **hidden**: `boolean`

#### Inherited from

[IoField](IoField.md).[hidden](IoField.md#hidden)

#### Defined in

[src/core/element.ts:246](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L246)

___

### icon

• **icon**: `string`

#### Inherited from

[IoField](IoField.md).[icon](IoField.md#icon)

#### Defined in

[src/elements/core/field.ts:39](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/field.ts#L39)

___

### id

• **id**: `string`

#### Inherited from

[IoField](IoField.md).[id](IoField.md#id)

#### Defined in

[src/core/element.ts:243](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L243)

___

### label

• **label**: `string`

#### Overrides

[IoField](IoField.md).[label](IoField.md#label)

#### Defined in

[src/elements/core/boolean.ts:17](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L17)

___

### name

• **name**: `string`

#### Inherited from

[IoField](IoField.md).[name](IoField.md#name)

#### Defined in

[src/core/element.ts:237](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L237)

___

### reverse

• **reverse**: `boolean`

#### Inherited from

[IoField](IoField.md).[reverse](IoField.md#reverse)

#### Defined in

[src/elements/core/field.ts:42](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/field.ts#L42)

___

### role

• **role**: `string`

#### Overrides

[IoField](IoField.md).[role](IoField.md#role)

#### Defined in

[src/elements/core/boolean.ts:32](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L32)

___

### selected

• **selected**: `boolean`

#### Inherited from

[IoField](IoField.md).[selected](IoField.md#selected)

#### Defined in

[src/elements/core/field.ts:45](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/field.ts#L45)

___

### stroke

• **stroke**: `boolean`

#### Defined in

[src/elements/core/boolean.ts:29](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L29)

___

### tabindex

• **tabindex**: `string`

#### Inherited from

[IoField](IoField.md).[tabindex](IoField.md#tabindex)

#### Defined in

[src/elements/core/field.ts:48](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/field.ts#L48)

___

### title

• **title**: `string`

#### Inherited from

[IoField](IoField.md).[title](IoField.md#title)

#### Defined in

[src/core/element.ts:240](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L240)

___

### true

• **true**: `string`

#### Defined in

[src/elements/core/boolean.ts:23](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L23)

___

### value

• **value**: `boolean`

#### Overrides

[IoField](IoField.md).[value](IoField.md#value)

#### Defined in

[src/elements/core/boolean.ts:20](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L20)

## Accessors

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoField.textNode

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

IoField.textNode

#### Defined in

[src/core/element.ts:413](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L413)

___

### Listeners

• `Static` `get` **Listeners**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `click` | `string` |
| `focus` | `string` |
| `pointerdown` | `string` |

#### Inherited from

IoField.Listeners

#### Defined in

[src/elements/core/field.ts:50](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/field.ts#L50)

___

### Properties

• `Static` `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoField.Properties

#### Defined in

[src/core/node.ts:37](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L37)

___

### Style

• `Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoField.Style

#### Defined in

[src/elements/core/boolean.ts:7](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L7)

___

### observedAttributes

• `Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoField.observedAttributes

#### Defined in

[src/core/element.ts:256](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L256)

## Methods

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

[src/elements/core/field.ts:62](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/field.ts#L62)

___

### \_onClick

▸ **_onClick**(): `void`

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[_onClick](IoField.md#_onclick)

#### Defined in

[src/elements/core/boolean.ts:34](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L34)

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

[src/elements/core/field.ts:57](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/field.ts#L57)

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

#### Inherited from

[IoField](IoField.md).[_onKeydown](IoField.md#_onkeydown)

#### Defined in

[src/elements/core/field.ts:88](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/field.ts#L88)

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

[src/elements/core/field.ts:107](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/field.ts#L107)

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

[IoField](IoField.md).[_onPointerdown](IoField.md#_onpointerdown)

#### Defined in

[src/elements/core/field.ts:67](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/field.ts#L67)

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

[src/elements/core/field.ts:74](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/field.ts#L74)

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

[src/elements/core/field.ts:73](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/field.ts#L73)

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

[IoField](IoField.md).[_onPointerup](IoField.md#_onpointerup)

#### Defined in

[src/elements/core/field.ts:79](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/field.ts#L79)

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

[src/core/node.ts:317](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L317)

___

### applyAria

▸ **applyAria**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/core/boolean.ts:61](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L61)

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

[IoField](IoField.md).[attributeChangedCallback](IoField.md#attributechangedcallback)

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

[IoField](IoField.md).[bind](IoField.md#bind)

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

[IoField](IoField.md).[changed](IoField.md#changed)

#### Defined in

[src/elements/core/boolean.ts:46](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L46)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[connectedCallback](IoField.md#connectedcallback)

#### Defined in

[src/core/element.ts:284](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L284)

___

### disabledChanged

▸ **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[disabledChanged](IoField.md#disabledchanged)

#### Defined in

[src/core/element.ts:446](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L446)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[disconnectedCallback](IoField.md#disconnectedcallback)

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

[IoField](IoField.md).[dispatchEvent](IoField.md#dispatchevent)

#### Defined in

[src/core/node.ts:342](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L342)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[dispatchQueue](IoField.md#dispatchqueue)

#### Defined in

[src/core/node.ts:232](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L232)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[dispatchQueueSync](IoField.md#dispatchqueuesync)

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

[IoField](IoField.md).[dispose](IoField.md#dispose)

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

[IoField](IoField.md).[disposeDeep](IoField.md#disposedeep)

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

[IoField](IoField.md).[flattenTextNode](IoField.md#flattentextnode)

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

[IoField](IoField.md).[focusTo](IoField.md#focusto)

#### Defined in

[src/core/element.ts:560](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L560)

___

### getCaretPosition

▸ **getCaretPosition**(): `number`

#### Returns

`number`

#### Inherited from

[IoField](IoField.md).[getCaretPosition](IoField.md#getcaretposition)

#### Defined in

[src/elements/core/field.ts:108](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/field.ts#L108)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[init](IoField.md#init)

#### Defined in

[src/elements/core/boolean.ts:43](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L43)

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

[src/core/node.ts:207](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L207)

___

### labelChanged

▸ **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[labelChanged](IoField.md#labelchanged)

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

[IoField](IoField.md).[objectMutated](IoField.md#objectmutated)

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

[IoField](IoField.md).[onObjectMutated](IoField.md#onobjectmutated)

#### Defined in

[src/core/node.ts:260](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L260)

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

[IoField](IoField.md).[removeEventListener](IoField.md#removeeventlistener)

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

[IoField](IoField.md).[setAttribute](IoField.md#setattribute)

#### Defined in

[src/core/element.ts:430](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L430)

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

[src/elements/core/field.ts:121](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/field.ts#L121)

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

[IoField](IoField.md).[setProperty](IoField.md#setproperty)

#### Defined in

[src/core/node.ts:109](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L109)

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

[IoField](IoField.md).[throttle](IoField.md#throttle)

#### Defined in

[src/core/node.ts:251](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L251)

___

### toggle

▸ **toggle**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/core/boolean.ts:37](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L37)

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

[IoField](IoField.md).[traverse](IoField.md#traverse)

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

[IoField](IoField.md).[unbind](IoField.md#unbind)

#### Defined in

[src/core/node.ts:303](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L303)

___

### valueChanged

▸ **valueChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/core/boolean.ts:40](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L40)
