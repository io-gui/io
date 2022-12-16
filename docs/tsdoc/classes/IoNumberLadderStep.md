# Class: IoNumberLadderStep

Core `IoElement` class.

## Hierarchy

- [`IoField`](IoField.md)

  ↳ **`IoNumberLadderStep`**

## Constructors

### constructor

**new IoNumberLadderStep**(...`args`)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Inherited from

[IoField](IoField.md).[constructor](IoField.md#constructor)

#### Defined in

[src/core/node.ts:63](https://github.com/io-gui/io/blob/main/src/core/node.ts#L63)

## Properties

### $

 **$**: `Record`<`string`, `any`\>

#### Inherited from

[IoField](IoField.md).[$](IoField.md#$)

#### Defined in

[src/core/element.ts:245](https://github.com/io-gui/io/blob/main/src/core/element.ts#L245)

___

### \_bindings

 `Readonly` **\_bindings**: `Map`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoField](IoField.md).[_bindings](IoField.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

 `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoField](IoField.md).[_changeQueue](IoField.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

 `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoField](IoField.md).[_eventDispatcher](IoField.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

___

### \_properties

 `Readonly` **\_properties**: `Map`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoField](IoField.md).[_properties](IoField.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

___

### \_protochain

 `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoField](IoField.md).[_protochain](IoField.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

___

### appearance

 **appearance**: ``"inset"`` \| ``"flush"`` \| ``"outset"`` \| ``"neutral"``

#### Inherited from

[IoField](IoField.md).[appearance](IoField.md#appearance)

#### Defined in

[src/elements/basic/io-field.ts:86](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L86)

___

### class

 **class**: `string`

#### Inherited from

[IoField](IoField.md).[class](IoField.md#class)

#### Defined in

[src/core/element.ts:254](https://github.com/io-gui/io/blob/main/src/core/element.ts#L254)

___

### contenteditable

 **contenteditable**: `boolean`

#### Inherited from

[IoField](IoField.md).[contenteditable](IoField.md#contenteditable)

#### Defined in

[src/core/element.ts:251](https://github.com/io-gui/io/blob/main/src/core/element.ts#L251)

___

### disabled

 **disabled**: `boolean`

#### Inherited from

[IoField](IoField.md).[disabled](IoField.md#disabled)

#### Defined in

[src/core/element.ts:275](https://github.com/io-gui/io/blob/main/src/core/element.ts#L275)

___

### hidden

 **hidden**: `boolean`

#### Inherited from

[IoField](IoField.md).[hidden](IoField.md#hidden)

#### Defined in

[src/core/element.ts:272](https://github.com/io-gui/io/blob/main/src/core/element.ts#L272)

___

### icon

 **icon**: `string`

#### Inherited from

[IoField](IoField.md).[icon](IoField.md#icon)

#### Defined in

[src/elements/basic/io-field.ts:83](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L83)

___

### id

 **id**: `string`

#### Inherited from

[IoField](IoField.md).[id](IoField.md#id)

#### Defined in

[src/core/element.ts:269](https://github.com/io-gui/io/blob/main/src/core/element.ts#L269)

___

### invalid

 **invalid**: `boolean`

#### Inherited from

[IoField](IoField.md).[invalid](IoField.md#invalid)

#### Defined in

[src/elements/basic/io-field.ts:95](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L95)

___

### label

 **label**: `string`

#### Inherited from

[IoField](IoField.md).[label](IoField.md#label)

#### Defined in

[src/core/element.ts:260](https://github.com/io-gui/io/blob/main/src/core/element.ts#L260)

___

### name

 **name**: `string`

#### Inherited from

[IoField](IoField.md).[name](IoField.md#name)

#### Defined in

[src/core/element.ts:263](https://github.com/io-gui/io/blob/main/src/core/element.ts#L263)

___

### placeholder

 **placeholder**: `string`

#### Inherited from

[IoField](IoField.md).[placeholder](IoField.md#placeholder)

#### Defined in

[src/elements/basic/io-field.ts:98](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L98)

___

### role

 **role**: `string`

#### Overrides

[IoField](IoField.md).[role](IoField.md#role)

#### Defined in

[src/elements/basic/io-number.ts:274](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L274)

___

### selected

 **selected**: `boolean`

#### Inherited from

[IoField](IoField.md).[selected](IoField.md#selected)

#### Defined in

[src/elements/basic/io-field.ts:92](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L92)

___

### stroke

 **stroke**: `boolean`

#### Inherited from

[IoField](IoField.md).[stroke](IoField.md#stroke)

#### Defined in

[src/elements/basic/io-field.ts:89](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L89)

___

### tabindex

 **tabindex**: `string`

#### Inherited from

[IoField](IoField.md).[tabindex](IoField.md#tabindex)

#### Defined in

[src/elements/basic/io-field.ts:77](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L77)

___

### title

 **title**: `string`

#### Inherited from

[IoField](IoField.md).[title](IoField.md#title)

#### Defined in

[src/core/element.ts:266](https://github.com/io-gui/io/blob/main/src/core/element.ts#L266)

___

### type

 **type**: `string`

#### Defined in

[src/elements/basic/io-number.ts:271](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L271)

___

### value

 **value**: `number`

#### Overrides

[IoField](IoField.md).[value](IoField.md#value)

#### Defined in

[src/elements/basic/io-number.ts:268](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L268)

## Accessors

### textNode

`get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoField.textNode

#### Defined in

[src/core/element.ts:393](https://github.com/io-gui/io/blob/main/src/core/element.ts#L393)

`set` **textNode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

IoField.textNode

#### Defined in

[src/core/element.ts:397](https://github.com/io-gui/io/blob/main/src/core/element.ts#L397)

___

### Listeners

`Static` `get` **Listeners**(): `Object`

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

`Static` `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoField.Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

___

### Style

`Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoField.Style

#### Defined in

[src/elements/basic/io-number.ts:241](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L241)

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

[IoField](IoField.md).[_flattenTextNode](IoField.md#_flattentextnode)

#### Defined in

[src/core/element.ts:376](https://github.com/io-gui/io/blob/main/src/core/element.ts#L376)

___

### \_onBlur

**_onBlur**(`event`): `void`

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

**_onClick**(): `void`

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[_onClick](IoField.md#_onclick)

#### Defined in

[src/elements/basic/io-field.ts:136](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L136)

___

### \_onFocus

**_onFocus**(`event`): `void`

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

**_onFocusTo**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`<`any`\> |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[_onFocusTo](IoField.md#_onfocusto)

#### Defined in

[src/elements/basic/io-field.ts:159](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L159)

___

### \_onKeydown

**_onKeydown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `KeyboardEvent` |

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[_onKeydown](IoField.md#_onkeydown)

#### Defined in

[src/elements/basic/io-number.ts:276](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L276)

___

### \_onKeyup

**_onKeyup**(`event`): `void`

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

**_onPointerdown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[_onPointerdown](IoField.md#_onpointerdown)

#### Defined in

[src/elements/basic/io-number.ts:297](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L297)

___

### \_onPointerleave

**_onPointerleave**(`event`): `void`

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

**_onPointermove**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[_onPointermove](IoField.md#_onpointermove)

#### Defined in

[src/elements/basic/io-number.ts:303](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L303)

___

### \_onPointerup

**_onPointerup**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[_onPointerup](IoField.md#_onpointerup)

#### Defined in

[src/elements/basic/io-number.ts:313](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L313)

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

[IoField](IoField.md).[addEventListener](IoField.md#addeventlistener)

#### Defined in

[src/core/node.ts:361](https://github.com/io-gui/io/blob/main/src/core/node.ts#L361)

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

[IoField](IoField.md).[applyProperties](IoField.md#applyproperties)

#### Defined in

[src/core/element.ts:401](https://github.com/io-gui/io/blob/main/src/core/element.ts#L401)

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

[IoField](IoField.md).[bind](IoField.md#bind)

#### Defined in

[src/core/node.ts:330](https://github.com/io-gui/io/blob/main/src/core/node.ts#L330)

___

### changed

**changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[changed](IoField.md#changed)

#### Defined in

[src/elements/basic/io-number.ts:322](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L322)

___

### connectedCallback

**connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[connectedCallback](IoField.md#connectedcallback)

#### Defined in

[src/core/element.ts:280](https://github.com/io-gui/io/blob/main/src/core/element.ts#L280)

___

### disabledChanged

**disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[disabledChanged](IoField.md#disabledchanged)

#### Defined in

[src/core/element.ts:430](https://github.com/io-gui/io/blob/main/src/core/element.ts#L430)

___

### disconnectedCallback

**disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[disconnectedCallback](IoField.md#disconnectedcallback)

#### Defined in

[src/core/element.ts:288](https://github.com/io-gui/io/blob/main/src/core/element.ts#L288)

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

[IoField](IoField.md).[dispatchEvent](IoField.md#dispatchevent)

#### Defined in

[src/core/node.ts:386](https://github.com/io-gui/io/blob/main/src/core/node.ts#L386)

___

### dispatchQueue

**dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[dispatchQueue](IoField.md#dispatchqueue)

#### Defined in

[src/core/node.ts:272](https://github.com/io-gui/io/blob/main/src/core/node.ts#L272)

___

### dispatchQueueSync

**dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[dispatchQueueSync](IoField.md#dispatchqueuesync)

#### Defined in

[src/core/node.ts:282](https://github.com/io-gui/io/blob/main/src/core/node.ts#L282)

___

### dispose

**dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[dispose](IoField.md#dispose)

#### Defined in

[src/core/node.ts:393](https://github.com/io-gui/io/blob/main/src/core/node.ts#L393)

___

### focusTo

**focusTo**(`dir`): `void`

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

**getCaretPosition**(): `number`

#### Returns

`number`

#### Inherited from

[IoField](IoField.md).[getCaretPosition](IoField.md#getcaretposition)

#### Defined in

[src/elements/basic/io-field.ts:270](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L270)

___

### init

**init**(): `void`

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[init](IoField.md#init)

#### Defined in

[src/elements/basic/io-number.ts:319](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L319)

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

[IoField](IoField.md).[inputValue](IoField.md#inputvalue)

#### Defined in

[src/core/node.ts:247](https://github.com/io-gui/io/blob/main/src/core/node.ts#L247)

___

### labelChanged

**labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[labelChanged](IoField.md#labelchanged)

#### Defined in

[src/core/element.ts:423](https://github.com/io-gui/io/blob/main/src/core/element.ts#L423)

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

[IoField](IoField.md).[objectMutated](IoField.md#objectmutated)

#### Defined in

[src/core/node.ts:321](https://github.com/io-gui/io/blob/main/src/core/node.ts#L321)

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

[IoField](IoField.md).[onObjectMutated](IoField.md#onobjectmutated)

#### Defined in

[src/core/node.ts:300](https://github.com/io-gui/io/blob/main/src/core/node.ts#L300)

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

[IoField](IoField.md).[queue](IoField.md#queue)

#### Defined in

[src/core/node.ts:266](https://github.com/io-gui/io/blob/main/src/core/node.ts#L266)

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

[IoField](IoField.md).[removeEventListener](IoField.md#removeeventlistener)

#### Defined in

[src/core/node.ts:376](https://github.com/io-gui/io/blob/main/src/core/node.ts#L376)

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

[IoField](IoField.md).[setAttribute](IoField.md#setattribute)

#### Defined in

[src/core/element.ts:414](https://github.com/io-gui/io/blob/main/src/core/element.ts#L414)

___

### setCaretPosition

**setCaretPosition**(`position`): `void`

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

[IoField](IoField.md).[setProperties](IoField.md#setproperties)

#### Defined in

[src/core/node.ts:229](https://github.com/io-gui/io/blob/main/src/core/node.ts#L229)

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

[IoField](IoField.md).[setProperty](IoField.md#setproperty)

#### Defined in

[src/core/node.ts:129](https://github.com/io-gui/io/blob/main/src/core/node.ts#L129)

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

[IoField](IoField.md).[template](IoField.md#template)

#### Defined in

[src/core/element.ts:300](https://github.com/io-gui/io/blob/main/src/core/element.ts#L300)

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

[IoField](IoField.md).[throttle](IoField.md#throttle)

#### Defined in

[src/core/node.ts:291](https://github.com/io-gui/io/blob/main/src/core/node.ts#L291)

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

[IoField](IoField.md).[traverse](IoField.md#traverse)

#### Defined in

[src/core/element.ts:313](https://github.com/io-gui/io/blob/main/src/core/element.ts#L313)

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

[IoField](IoField.md).[unbind](IoField.md#unbind)

#### Defined in

[src/core/node.ts:345](https://github.com/io-gui/io/blob/main/src/core/node.ts#L345)
