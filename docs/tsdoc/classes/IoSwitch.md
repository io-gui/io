# Class: IoSwitch

Core `IoElement` class.

## Hierarchy

- [`IoBoolean`](IoBoolean.md)

  ↳ **`IoSwitch`**

## Constructors

### constructor

**new IoSwitch**(`properties?`, ...`args`)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `properties` | `Record`<`string`, `any`\> | Initial property values. |
| `...args` | `any`[] | - |

#### Inherited from

[IoBoolean](IoBoolean.md).[constructor](IoBoolean.md#constructor)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

## Properties

### $

 **$**: `Record`<`string`, `any`\>

#### Inherited from

[IoBoolean](IoBoolean.md).[$](IoBoolean.md#$)

#### Defined in

[src/core/element.ts:211](https://github.com/io-gui/io/blob/main/src/core/element.ts#L211)

___

### \_bindings

 `Readonly` **\_bindings**: `Map`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoBoolean](IoBoolean.md).[_bindings](IoBoolean.md#_bindings)

#### Defined in

[src/core/node.ts:48](https://github.com/io-gui/io/blob/main/src/core/node.ts#L48)

___

### \_changeQueue

 `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoBoolean](IoBoolean.md).[_changeQueue](IoBoolean.md#_changequeue)

#### Defined in

[src/core/node.ts:49](https://github.com/io-gui/io/blob/main/src/core/node.ts#L49)

___

### \_eventDispatcher

 `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoBoolean](IoBoolean.md).[_eventDispatcher](IoBoolean.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:50](https://github.com/io-gui/io/blob/main/src/core/node.ts#L50)

___

### \_properties

 `Readonly` **\_properties**: `Map`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoBoolean](IoBoolean.md).[_properties](IoBoolean.md#_properties)

#### Defined in

[src/core/node.ts:47](https://github.com/io-gui/io/blob/main/src/core/node.ts#L47)

___

### \_protochain

 `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoBoolean](IoBoolean.md).[_protochain](IoBoolean.md#_protochain)

#### Defined in

[src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

___

### class

 **class**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[class](IoBoolean.md#class)

#### Defined in

[src/core/element.ts:220](https://github.com/io-gui/io/blob/main/src/core/element.ts#L220)

___

### contenteditable

 **contenteditable**: `boolean`

#### Inherited from

[IoBoolean](IoBoolean.md).[contenteditable](IoBoolean.md#contenteditable)

#### Defined in

[src/core/element.ts:217](https://github.com/io-gui/io/blob/main/src/core/element.ts#L217)

___

### disabled

 **disabled**: `boolean`

#### Inherited from

[IoBoolean](IoBoolean.md).[disabled](IoBoolean.md#disabled)

#### Defined in

[src/core/element.ts:241](https://github.com/io-gui/io/blob/main/src/core/element.ts#L241)

___

### false

 **false**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[false](IoBoolean.md#false)

#### Defined in

[src/elements/basic/io-boolean.ts:15](https://github.com/io-gui/io/blob/main/src/elements/basic/io-boolean.ts#L15)

___

### hidden

 **hidden**: `boolean`

#### Inherited from

[IoBoolean](IoBoolean.md).[hidden](IoBoolean.md#hidden)

#### Defined in

[src/core/element.ts:238](https://github.com/io-gui/io/blob/main/src/core/element.ts#L238)

___

### icon

 **icon**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[icon](IoBoolean.md#icon)

#### Defined in

[src/elements/basic/io-field.ts:70](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L70)

___

### id

 **id**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[id](IoBoolean.md#id)

#### Defined in

[src/core/element.ts:235](https://github.com/io-gui/io/blob/main/src/core/element.ts#L235)

___

### label

 **label**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[label](IoBoolean.md#label)

#### Defined in

[src/core/element.ts:226](https://github.com/io-gui/io/blob/main/src/core/element.ts#L226)

___

### name

 **name**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[name](IoBoolean.md#name)

#### Defined in

[src/core/element.ts:229](https://github.com/io-gui/io/blob/main/src/core/element.ts#L229)

___

### reverse

 **reverse**: `boolean`

#### Inherited from

[IoBoolean](IoBoolean.md).[reverse](IoBoolean.md#reverse)

#### Defined in

[src/elements/basic/io-field.ts:76](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L76)

___

### role

 **role**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[role](IoBoolean.md#role)

#### Defined in

[src/elements/basic/io-boolean.ts:18](https://github.com/io-gui/io/blob/main/src/elements/basic/io-boolean.ts#L18)

___

### selected

 **selected**: `boolean`

#### Inherited from

[IoBoolean](IoBoolean.md).[selected](IoBoolean.md#selected)

#### Defined in

[src/elements/basic/io-field.ts:79](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L79)

___

### stroke

 **stroke**: `boolean`

#### Inherited from

[IoBoolean](IoBoolean.md).[stroke](IoBoolean.md#stroke)

#### Defined in

[src/elements/basic/io-field.ts:73](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L73)

___

### tabindex

 **tabindex**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[tabindex](IoBoolean.md#tabindex)

#### Defined in

[src/elements/basic/io-field.ts:64](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L64)

___

### title

 **title**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[title](IoBoolean.md#title)

#### Defined in

[src/core/element.ts:232](https://github.com/io-gui/io/blob/main/src/core/element.ts#L232)

___

### true

 **true**: `string`

#### Inherited from

[IoBoolean](IoBoolean.md).[true](IoBoolean.md#true)

#### Defined in

[src/elements/basic/io-boolean.ts:12](https://github.com/io-gui/io/blob/main/src/elements/basic/io-boolean.ts#L12)

___

### value

 **value**: `boolean`

#### Inherited from

[IoBoolean](IoBoolean.md).[value](IoBoolean.md#value)

#### Defined in

[src/elements/basic/io-boolean.ts:9](https://github.com/io-gui/io/blob/main/src/elements/basic/io-boolean.ts#L9)

## Accessors

### textNode

`get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoBoolean.textNode

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

IoBoolean.textNode

#### Defined in

[src/core/element.ts:396](https://github.com/io-gui/io/blob/main/src/core/element.ts#L396)

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

IoBoolean.Listeners

#### Defined in

[src/elements/basic/io-field.ts:81](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L81)

___

### Properties

`Static` `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoBoolean.Properties

#### Defined in

[src/core/node.ts:37](https://github.com/io-gui/io/blob/main/src/core/node.ts#L37)

___

### Style

`Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoBoolean.Style

#### Defined in

[src/elements/basic/io-switch.ts:6](https://github.com/io-gui/io/blob/main/src/elements/basic/io-switch.ts#L6)

___

### observedAttributes

`Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoBoolean.observedAttributes

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

[IoBoolean](IoBoolean.md).[_flattenTextNode](IoBoolean.md#_flattentextnode)

#### Defined in

[src/core/element.ts:375](https://github.com/io-gui/io/blob/main/src/core/element.ts#L375)

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

[IoBoolean](IoBoolean.md).[_onBlur](IoBoolean.md#_onblur)

#### Defined in

[src/elements/basic/io-field.ts:94](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L94)

___

### \_onClick

**_onClick**(): `void`

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[_onClick](IoBoolean.md#_onclick)

#### Defined in

[src/elements/basic/io-boolean.ts:20](https://github.com/io-gui/io/blob/main/src/elements/basic/io-boolean.ts#L20)

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

[IoBoolean](IoBoolean.md).[_onFocus](IoBoolean.md#_onfocus)

#### Defined in

[src/elements/basic/io-field.ts:89](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L89)

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

[IoBoolean](IoBoolean.md).[_onFocusTo](IoBoolean.md#_onfocusto)

#### Defined in

[src/elements/basic/io-field.ts:140](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L140)

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

[IoBoolean](IoBoolean.md).[_onKeydown](IoBoolean.md#_onkeydown)

#### Defined in

[src/elements/basic/io-field.ts:120](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L120)

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

[IoBoolean](IoBoolean.md).[_onKeyup](IoBoolean.md#_onkeyup)

#### Defined in

[src/elements/basic/io-field.ts:139](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L139)

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

[IoBoolean](IoBoolean.md).[_onPointerdown](IoBoolean.md#_onpointerdown)

#### Defined in

[src/elements/basic/io-field.ts:99](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L99)

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

[IoBoolean](IoBoolean.md).[_onPointerleave](IoBoolean.md#_onpointerleave)

#### Defined in

[src/elements/basic/io-field.ts:106](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L106)

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

[IoBoolean](IoBoolean.md).[_onPointermove](IoBoolean.md#_onpointermove)

#### Defined in

[src/elements/basic/io-field.ts:105](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L105)

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

[IoBoolean](IoBoolean.md).[_onPointerup](IoBoolean.md#_onpointerup)

#### Defined in

[src/elements/basic/io-field.ts:111](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L111)

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

[IoBoolean](IoBoolean.md).[addEventListener](IoBoolean.md#addeventlistener)

#### Defined in

[src/core/node.ts:337](https://github.com/io-gui/io/blob/main/src/core/node.ts#L337)

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

[IoBoolean](IoBoolean.md).[applyProperties](IoBoolean.md#applyproperties)

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

[IoBoolean](IoBoolean.md).[attributeChangedCallback](IoBoolean.md#attributechangedcallback)

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

[IoBoolean](IoBoolean.md).[bind](IoBoolean.md#bind)

#### Defined in

[src/core/node.ts:306](https://github.com/io-gui/io/blob/main/src/core/node.ts#L306)

___

### changed

**changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

[IoBoolean](IoBoolean.md).[changed](IoBoolean.md#changed)

#### Defined in

[src/elements/basic/io-switch.ts:67](https://github.com/io-gui/io/blob/main/src/elements/basic/io-switch.ts#L67)

___

### connectedCallback

**connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[connectedCallback](IoBoolean.md#connectedcallback)

#### Defined in

[src/core/element.ts:271](https://github.com/io-gui/io/blob/main/src/core/element.ts#L271)

___

### disabledChanged

**disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[disabledChanged](IoBoolean.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

___

### disconnectedCallback

**disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[disconnectedCallback](IoBoolean.md#disconnectedcallback)

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

[IoBoolean](IoBoolean.md).[dispatchEvent](IoBoolean.md#dispatchevent)

#### Defined in

[src/core/node.ts:362](https://github.com/io-gui/io/blob/main/src/core/node.ts#L362)

___

### dispatchQueue

**dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[dispatchQueue](IoBoolean.md#dispatchqueue)

#### Defined in

[src/core/node.ts:248](https://github.com/io-gui/io/blob/main/src/core/node.ts#L248)

___

### dispatchQueueSync

**dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[dispatchQueueSync](IoBoolean.md#dispatchqueuesync)

#### Defined in

[src/core/node.ts:258](https://github.com/io-gui/io/blob/main/src/core/node.ts#L258)

___

### dispose

**dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[dispose](IoBoolean.md#dispose)

#### Defined in

[src/core/node.ts:369](https://github.com/io-gui/io/blob/main/src/core/node.ts#L369)

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

[IoBoolean](IoBoolean.md).[disposeDeep](IoBoolean.md#disposedeep)

#### Defined in

[src/core/element.ts:295](https://github.com/io-gui/io/blob/main/src/core/element.ts#L295)

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

[IoBoolean](IoBoolean.md).[focusTo](IoBoolean.md#focusto)

#### Defined in

[src/elements/basic/io-field.ts:247](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L247)

___

### getCaretPosition

**getCaretPosition**(): `number`

#### Returns

`number`

#### Inherited from

[IoBoolean](IoBoolean.md).[getCaretPosition](IoBoolean.md#getcaretposition)

#### Defined in

[src/elements/basic/io-field.ts:251](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L251)

___

### init

**init**(): `void`

#### Returns

`void`

#### Overrides

[IoBoolean](IoBoolean.md).[init](IoBoolean.md#init)

#### Defined in

[src/elements/basic/io-switch.ts:64](https://github.com/io-gui/io/blob/main/src/elements/basic/io-switch.ts#L64)

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

[IoBoolean](IoBoolean.md).[inputValue](IoBoolean.md#inputvalue)

#### Defined in

[src/core/node.ts:223](https://github.com/io-gui/io/blob/main/src/core/node.ts#L223)

___

### labelChanged

**labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[labelChanged](IoBoolean.md#labelchanged)

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

[IoBoolean](IoBoolean.md).[objectMutated](IoBoolean.md#objectmutated)

#### Defined in

[src/core/node.ts:297](https://github.com/io-gui/io/blob/main/src/core/node.ts#L297)

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

[IoBoolean](IoBoolean.md).[onObjectMutated](IoBoolean.md#onobjectmutated)

#### Defined in

[src/core/node.ts:276](https://github.com/io-gui/io/blob/main/src/core/node.ts#L276)

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

[IoBoolean](IoBoolean.md).[queue](IoBoolean.md#queue)

#### Defined in

[src/core/node.ts:242](https://github.com/io-gui/io/blob/main/src/core/node.ts#L242)

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

[IoBoolean](IoBoolean.md).[removeEventListener](IoBoolean.md#removeeventlistener)

#### Defined in

[src/core/node.ts:352](https://github.com/io-gui/io/blob/main/src/core/node.ts#L352)

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

[IoBoolean](IoBoolean.md).[setAttribute](IoBoolean.md#setattribute)

#### Defined in

[src/core/element.ts:413](https://github.com/io-gui/io/blob/main/src/core/element.ts#L413)

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

[IoBoolean](IoBoolean.md).[setCaretPosition](IoBoolean.md#setcaretposition)

#### Defined in

[src/elements/basic/io-field.ts:264](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L264)

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

[IoBoolean](IoBoolean.md).[setProperties](IoBoolean.md#setproperties)

#### Defined in

[src/core/node.ts:206](https://github.com/io-gui/io/blob/main/src/core/node.ts#L206)

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

[IoBoolean](IoBoolean.md).[setProperty](IoBoolean.md#setproperty)

#### Defined in

[src/core/node.ts:109](https://github.com/io-gui/io/blob/main/src/core/node.ts#L109)

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

[IoBoolean](IoBoolean.md).[template](IoBoolean.md#template)

#### Defined in

[src/core/element.ts:289](https://github.com/io-gui/io/blob/main/src/core/element.ts#L289)

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

[IoBoolean](IoBoolean.md).[throttle](IoBoolean.md#throttle)

#### Defined in

[src/core/node.ts:267](https://github.com/io-gui/io/blob/main/src/core/node.ts#L267)

___

### toggle

**toggle**(): `void`

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[toggle](IoBoolean.md#toggle)

#### Defined in

[src/elements/basic/io-boolean.ts:24](https://github.com/io-gui/io/blob/main/src/elements/basic/io-boolean.ts#L24)

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

[IoBoolean](IoBoolean.md).[traverse](IoBoolean.md#traverse)

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

[IoBoolean](IoBoolean.md).[unbind](IoBoolean.md#unbind)

#### Defined in

[src/core/node.ts:321](https://github.com/io-gui/io/blob/main/src/core/node.ts#L321)

___

### valueChanged

**valueChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/basic/io-switch.ts:70](https://github.com/io-gui/io/blob/main/src/elements/basic/io-switch.ts#L70)
