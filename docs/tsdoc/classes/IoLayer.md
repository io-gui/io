# Class: IoLayer

Core `IoElement` class.

## Hierarchy

- [`IoElement`](IoElement.md)

  ↳ **`IoLayer`**

## Constructors

### constructor

**new IoLayer**(`properties?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | `Record`<`string`, `any`\> |

#### Overrides

[IoElement](IoElement.md).[constructor](IoElement.md#constructor)

#### Defined in

[src/core/layer.ts:76](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L76)

## Properties

### $

 **$**: `Record`<`string`, `any`\>

#### Inherited from

[IoElement](IoElement.md).[$](IoElement.md#$)

#### Defined in

[src/core/element.ts:211](https://github.com/io-gui/io/blob/main/src/core/element.ts#L211)

___

### \_bindings

 `Readonly` **\_bindings**: `Map`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoElement](IoElement.md).[_bindings](IoElement.md#_bindings)

#### Defined in

[src/core/node.ts:48](https://github.com/io-gui/io/blob/main/src/core/node.ts#L48)

___

### \_changeQueue

 `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoElement](IoElement.md).[_changeQueue](IoElement.md#_changequeue)

#### Defined in

[src/core/node.ts:49](https://github.com/io-gui/io/blob/main/src/core/node.ts#L49)

___

### \_eventDispatcher

 `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoElement](IoElement.md).[_eventDispatcher](IoElement.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:50](https://github.com/io-gui/io/blob/main/src/core/node.ts#L50)

___

### \_properties

 `Readonly` **\_properties**: `Map`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoElement](IoElement.md).[_properties](IoElement.md#_properties)

#### Defined in

[src/core/node.ts:47](https://github.com/io-gui/io/blob/main/src/core/node.ts#L47)

___

### \_protochain

 `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoElement](IoElement.md).[_protochain](IoElement.md#_protochain)

#### Defined in

[src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

___

### class

 **class**: `string`

#### Inherited from

[IoElement](IoElement.md).[class](IoElement.md#class)

#### Defined in

[src/core/element.ts:220](https://github.com/io-gui/io/blob/main/src/core/element.ts#L220)

___

### contenteditable

 **contenteditable**: `boolean`

#### Inherited from

[IoElement](IoElement.md).[contenteditable](IoElement.md#contenteditable)

#### Defined in

[src/core/element.ts:217](https://github.com/io-gui/io/blob/main/src/core/element.ts#L217)

___

### disabled

 **disabled**: `boolean`

#### Inherited from

[IoElement](IoElement.md).[disabled](IoElement.md#disabled)

#### Defined in

[src/core/element.ts:241](https://github.com/io-gui/io/blob/main/src/core/element.ts#L241)

___

### expanded

 **expanded**: `boolean`

#### Defined in

[src/core/layer.ts:54](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L54)

___

### hidden

 **hidden**: `boolean`

#### Inherited from

[IoElement](IoElement.md).[hidden](IoElement.md#hidden)

#### Defined in

[src/core/element.ts:238](https://github.com/io-gui/io/blob/main/src/core/element.ts#L238)

___

### id

 **id**: `string`

#### Inherited from

[IoElement](IoElement.md).[id](IoElement.md#id)

#### Defined in

[src/core/element.ts:235](https://github.com/io-gui/io/blob/main/src/core/element.ts#L235)

___

### label

 **label**: `string`

#### Inherited from

[IoElement](IoElement.md).[label](IoElement.md#label)

#### Defined in

[src/core/element.ts:226](https://github.com/io-gui/io/blob/main/src/core/element.ts#L226)

___

### name

 **name**: `string`

#### Inherited from

[IoElement](IoElement.md).[name](IoElement.md#name)

#### Defined in

[src/core/element.ts:229](https://github.com/io-gui/io/blob/main/src/core/element.ts#L229)

___

### role

 **role**: `string`

#### Inherited from

[IoElement](IoElement.md).[role](IoElement.md#role)

#### Defined in

[src/core/element.ts:223](https://github.com/io-gui/io/blob/main/src/core/element.ts#L223)

___

### skipCollapse

 **skipCollapse**: `boolean`

#### Defined in

[src/core/layer.ts:57](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L57)

___

### tabindex

 **tabindex**: `string`

#### Inherited from

[IoElement](IoElement.md).[tabindex](IoElement.md#tabindex)

#### Defined in

[src/core/element.ts:214](https://github.com/io-gui/io/blob/main/src/core/element.ts#L214)

___

### title

 **title**: `string`

#### Inherited from

[IoElement](IoElement.md).[title](IoElement.md#title)

#### Defined in

[src/core/element.ts:232](https://github.com/io-gui/io/blob/main/src/core/element.ts#L232)

## Accessors

### textNode

`get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoElement.textNode

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

IoElement.textNode

#### Defined in

[src/core/element.ts:396](https://github.com/io-gui/io/blob/main/src/core/element.ts#L396)

___

### Listeners

`Static` `get` **Listeners**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `contextmenu` | `string` |
| `focusin` | `string` |
| `keydown` | `string` |
| `keyup` | `string` |
| `mousedown` | `string` |
| `mousemove` | `string` |
| `mouseup` | `string` |
| `pointerup` | `string` |
| `scroll` | `string` |
| `touchend` | `string` |
| `touchmove` | `string` |
| `touchstart` | `string` |
| `wheel` | `string` |

#### Defined in

[src/core/layer.ts:59](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L59)

___

### Properties

`Static` `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoElement.Properties

#### Defined in

[src/core/node.ts:37](https://github.com/io-gui/io/blob/main/src/core/node.ts#L37)

___

### Style

`Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoElement.Style

#### Defined in

[src/core/layer.ts:22](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L22)

___

### observedAttributes

`Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoElement.observedAttributes

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

[IoElement](IoElement.md).[_flattenTextNode](IoElement.md#_flattentextnode)

#### Defined in

[src/core/element.ts:375](https://github.com/io-gui/io/blob/main/src/core/element.ts#L375)

___

### \_onCollapse

**_onCollapse**(): `void`

#### Returns

`void`

#### Defined in

[src/core/layer.ts:92](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L92)

___

### \_onContextmenu

**_onContextmenu**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Event` |

#### Returns

`void`

#### Defined in

[src/core/layer.ts:95](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L95)

___

### \_onFocusIn

**_onFocusIn**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `FocusEvent` |

#### Returns

`void`

#### Defined in

[src/core/layer.ts:98](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L98)

___

### \_onPointerup

**_onPointerup**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Defined in

[src/core/layer.ts:84](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L84)

___

### \_onScroll

**_onScroll**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Event` |

#### Returns

`void`

#### Defined in

[src/core/layer.ts:101](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L101)

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

[IoElement](IoElement.md).[addEventListener](IoElement.md#addeventlistener)

#### Defined in

[src/core/node.ts:319](https://github.com/io-gui/io/blob/main/src/core/node.ts#L319)

___

### appendChild

**appendChild**(`child`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `child` | `HTMLElement` |

#### Returns

`void`

#### Defined in

[src/core/layer.ts:184](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L184)

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

[IoElement](IoElement.md).[applyProperties](IoElement.md#applyproperties)

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

[IoElement](IoElement.md).[attributeChangedCallback](IoElement.md#attributechangedcallback)

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

[IoElement](IoElement.md).[bind](IoElement.md#bind)

#### Defined in

[src/core/node.ts:288](https://github.com/io-gui/io/blob/main/src/core/node.ts#L288)

___

### changed

**changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[changed](IoElement.md#changed)

#### Defined in

[src/core/node.ts:216](https://github.com/io-gui/io/blob/main/src/core/node.ts#L216)

___

### connectedCallback

**connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[connectedCallback](IoElement.md#connectedcallback)

#### Defined in

[src/core/element.ts:271](https://github.com/io-gui/io/blob/main/src/core/element.ts#L271)

___

### disabledChanged

**disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[disabledChanged](IoElement.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

___

### disconnectedCallback

**disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[disconnectedCallback](IoElement.md#disconnectedcallback)

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

[IoElement](IoElement.md).[dispatchEvent](IoElement.md#dispatchevent)

#### Defined in

[src/core/node.ts:344](https://github.com/io-gui/io/blob/main/src/core/node.ts#L344)

___

### dispatchQueue

**dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[dispatchQueue](IoElement.md#dispatchqueue)

#### Defined in

[src/core/node.ts:230](https://github.com/io-gui/io/blob/main/src/core/node.ts#L230)

___

### dispatchQueueSync

**dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[dispatchQueueSync](IoElement.md#dispatchqueuesync)

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

[IoElement](IoElement.md).[dispose](IoElement.md#dispose)

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

[IoElement](IoElement.md).[disposeDeep](IoElement.md#disposedeep)

#### Defined in

[src/core/element.ts:295](https://github.com/io-gui/io/blob/main/src/core/element.ts#L295)

___

### expandedChanged

**expandedChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/core/layer.ts:206](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L206)

___

### init

**init**(): `void`

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[init](IoElement.md#init)

#### Defined in

[src/core/node.ts:217](https://github.com/io-gui/io/blob/main/src/core/node.ts#L217)

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

[IoElement](IoElement.md).[inputValue](IoElement.md#inputvalue)

#### Defined in

[src/core/node.ts:205](https://github.com/io-gui/io/blob/main/src/core/node.ts#L205)

___

### labelChanged

**labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[labelChanged](IoElement.md#labelchanged)

#### Defined in

[src/core/element.ts:422](https://github.com/io-gui/io/blob/main/src/core/element.ts#L422)

___

### nudgeDown

**nudgeDown**(`element`, `x`, `y`, `elemRect`, `force?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `HTMLElement` |
| `x` | `number` |
| `y` | `number` |
| `elemRect` | `DOMRect` |
| `force?` | `boolean` |

#### Returns

`boolean`

#### Defined in

[src/core/layer.ts:106](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L106)

___

### nudgeLeft

**nudgeLeft**(`element`, `x`, `y`, `elemRect`, `force?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `HTMLElement` |
| `x` | `number` |
| `y` | `number` |
| `elemRect` | `DOMRect` |
| `force?` | `boolean` |

#### Returns

`boolean`

#### Defined in

[src/core/layer.ts:132](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L132)

___

### nudgePointer

**nudgePointer**(`element`, `x`, `y`, `elemRect`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `HTMLElement` |
| `x` | `number` |
| `y` | `number` |
| `elemRect` | `DOMRect` |

#### Returns

`boolean`

#### Defined in

[src/core/layer.ts:140](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L140)

___

### nudgeRight

**nudgeRight**(`element`, `x`, `y`, `elemRect`, `force?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `HTMLElement` |
| `x` | `number` |
| `y` | `number` |
| `elemRect` | `DOMRect` |
| `force?` | `boolean` |

#### Returns

`boolean`

#### Defined in

[src/core/layer.ts:124](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L124)

___

### nudgeUp

**nudgeUp**(`element`, `x`, `y`, `elemRect`, `force?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `HTMLElement` |
| `x` | `number` |
| `y` | `number` |
| `elemRect` | `DOMRect` |
| `force?` | `boolean` |

#### Returns

`boolean`

#### Defined in

[src/core/layer.ts:115](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L115)

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

[IoElement](IoElement.md).[objectMutated](IoElement.md#objectmutated)

#### Defined in

[src/core/node.ts:279](https://github.com/io-gui/io/blob/main/src/core/node.ts#L279)

___

### onChildExpanded

**onChildExpanded**(): `void`

#### Returns

`void`

#### Defined in

[src/core/layer.ts:194](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L194)

___

### onChildExpandedDelayed

**onChildExpandedDelayed**(): `void`

#### Returns

`void`

#### Defined in

[src/core/layer.ts:197](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L197)

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

[IoElement](IoElement.md).[onObjectMutated](IoElement.md#onobjectmutated)

#### Defined in

[src/core/node.ts:258](https://github.com/io-gui/io/blob/main/src/core/node.ts#L258)

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

[IoElement](IoElement.md).[queue](IoElement.md#queue)

#### Defined in

[src/core/node.ts:224](https://github.com/io-gui/io/blob/main/src/core/node.ts#L224)

___

### removeChild

**removeChild**(`child`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `child` | `HTMLElement` |

#### Returns

`void`

#### Defined in

[src/core/layer.ts:189](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L189)

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

[IoElement](IoElement.md).[removeEventListener](IoElement.md#removeeventlistener)

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

[IoElement](IoElement.md).[setAttribute](IoElement.md#setattribute)

#### Defined in

[src/core/element.ts:413](https://github.com/io-gui/io/blob/main/src/core/element.ts#L413)

___

### setElementPosition

**setElementPosition**(`element`, `direction`, `srcRect`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `HTMLElement` |
| `direction` | `NudgeDirection` |
| `srcRect` | `DOMRect` |

#### Returns

`void`

#### Defined in

[src/core/layer.ts:145](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L145)

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

[IoElement](IoElement.md).[setProperties](IoElement.md#setproperties)

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

[IoElement](IoElement.md).[setProperty](IoElement.md#setproperty)

#### Defined in

[src/core/node.ts:109](https://github.com/io-gui/io/blob/main/src/core/node.ts#L109)

___

### stopPropagation

**stopPropagation**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Event` |

#### Returns

`void`

#### Defined in

[src/core/layer.ts:81](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L81)

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

[IoElement](IoElement.md).[template](IoElement.md#template)

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

[IoElement](IoElement.md).[throttle](IoElement.md#throttle)

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

[IoElement](IoElement.md).[traverse](IoElement.md#traverse)

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

[IoElement](IoElement.md).[unbind](IoElement.md#unbind)

#### Defined in

[src/core/node.ts:303](https://github.com/io-gui/io/blob/main/src/core/node.ts#L303)