[io-gui](../README.md) / IoNavigatorScroller

# Class: IoNavigatorScroller

Core `IoElement` class.

## Hierarchy

- [`IoNavigatorBase`](IoNavigatorBase.md)

  ↳ **`IoNavigatorScroller`**

## Table of contents

### Constructors

- [constructor](IoNavigatorScroller.md#constructor)

### Properties

- [$](IoNavigatorScroller.md#$)
- [\_bindings](IoNavigatorScroller.md#_bindings)
- [\_changeQueue](IoNavigatorScroller.md#_changequeue)
- [\_eventDispatcher](IoNavigatorScroller.md#_eventdispatcher)
- [\_properties](IoNavigatorScroller.md#_properties)
- [\_protochain](IoNavigatorScroller.md#_protochain)
- [class](IoNavigatorScroller.md#class)
- [collapseWidth](IoNavigatorScroller.md#collapsewidth)
- [collapsed](IoNavigatorScroller.md#collapsed)
- [contenteditable](IoNavigatorScroller.md#contenteditable)
- [depth](IoNavigatorScroller.md#depth)
- [disabled](IoNavigatorScroller.md#disabled)
- [elements](IoNavigatorScroller.md#elements)
- [hidden](IoNavigatorScroller.md#hidden)
- [id](IoNavigatorScroller.md#id)
- [label](IoNavigatorScroller.md#label)
- [menu](IoNavigatorScroller.md#menu)
- [name](IoNavigatorScroller.md#name)
- [options](IoNavigatorScroller.md#options)
- [role](IoNavigatorScroller.md#role)
- [slotted](IoNavigatorScroller.md#slotted)
- [tabindex](IoNavigatorScroller.md#tabindex)
- [title](IoNavigatorScroller.md#title)

### Accessors

- [textNode](IoNavigatorScroller.md#textnode)
- [Properties](IoNavigatorScroller.md#properties)
- [Style](IoNavigatorScroller.md#style)

### Methods

- [Register](IoNavigatorScroller.md#register)
- [\_computeCollapsed](IoNavigatorScroller.md#_computecollapsed)
- [\_flattenTextNode](IoNavigatorScroller.md#_flattentextnode)
- [addEventListener](IoNavigatorScroller.md#addeventlistener)
- [applyProperties](IoNavigatorScroller.md#applyproperties)
- [bind](IoNavigatorScroller.md#bind)
- [changed](IoNavigatorScroller.md#changed)
- [connectedCallback](IoNavigatorScroller.md#connectedcallback)
- [disabledChanged](IoNavigatorScroller.md#disabledchanged)
- [disconnectedCallback](IoNavigatorScroller.md#disconnectedcallback)
- [dispatchEvent](IoNavigatorScroller.md#dispatchevent)
- [dispatchMutationEvent](IoNavigatorScroller.md#dispatchmutationevent)
- [dispatchQueue](IoNavigatorScroller.md#dispatchqueue)
- [dispatchQueueSync](IoNavigatorScroller.md#dispatchqueuesync)
- [dispose](IoNavigatorScroller.md#dispose)
- [getSlotted](IoNavigatorScroller.md#getslotted)
- [init](IoNavigatorScroller.md#init)
- [inputValue](IoNavigatorScroller.md#inputvalue)
- [labelChanged](IoNavigatorScroller.md#labelchanged)
- [objectMutated](IoNavigatorScroller.md#objectmutated)
- [onObjectMutated](IoNavigatorScroller.md#onobjectmutated)
- [onResized](IoNavigatorScroller.md#onresized)
- [queue](IoNavigatorScroller.md#queue)
- [removeEventListener](IoNavigatorScroller.md#removeeventlistener)
- [setAttribute](IoNavigatorScroller.md#setattribute)
- [setProperties](IoNavigatorScroller.md#setproperties)
- [setProperty](IoNavigatorScroller.md#setproperty)
- [template](IoNavigatorScroller.md#template)
- [throttle](IoNavigatorScroller.md#throttle)
- [traverse](IoNavigatorScroller.md#traverse)
- [unbind](IoNavigatorScroller.md#unbind)

## Constructors

### constructor

• **new IoNavigatorScroller**(`...args`): [`IoNavigatorScroller`](IoNavigatorScroller.md)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

[`IoNavigatorScroller`](IoNavigatorScroller.md)

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[constructor](IoNavigatorBase.md#constructor)

#### Defined in

[src/core/node.ts:63](https://github.com/io-gui/io/blob/main/src/core/node.ts#L63)

## Properties

### $

• **$**: `Record`\<`string`, `any`\>

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[$](IoNavigatorBase.md#$)

#### Defined in

[src/core/element.ts:178](https://github.com/io-gui/io/blob/main/src/core/element.ts#L178)

___

### \_bindings

• `Readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[_bindings](IoNavigatorBase.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[_changeQueue](IoNavigatorBase.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[_eventDispatcher](IoNavigatorBase.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

___

### \_properties

• `Readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[_properties](IoNavigatorBase.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[_protochain](IoNavigatorBase.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

___

### class

• **class**: `string`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[class](IoNavigatorBase.md#class)

#### Defined in

[src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

___

### collapseWidth

• **collapseWidth**: `number`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[collapseWidth](IoNavigatorBase.md#collapsewidth)

#### Defined in

[src/elements/content/io-navigator-base.ts:99](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L99)

___

### collapsed

• **collapsed**: `boolean`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[collapsed](IoNavigatorBase.md#collapsed)

#### Defined in

[src/elements/content/io-navigator-base.ts:96](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L96)

___

### contenteditable

• **contenteditable**: `boolean`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[contenteditable](IoNavigatorBase.md#contenteditable)

#### Defined in

[src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

___

### depth

• **depth**: `number`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[depth](IoNavigatorBase.md#depth)

#### Defined in

[src/elements/content/io-navigator-base.ts:93](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L93)

___

### disabled

• **disabled**: `boolean`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[disabled](IoNavigatorBase.md#disabled)

#### Defined in

[src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

___

### elements

• **elements**: [`VDOMArray`](../README.md#vdomarray)[]

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[elements](IoNavigatorBase.md#elements)

#### Defined in

[src/elements/content/io-navigator-base.ts:84](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L84)

___

### hidden

• **hidden**: `boolean`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[hidden](IoNavigatorBase.md#hidden)

#### Defined in

[src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

___

### id

• **id**: `string`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[id](IoNavigatorBase.md#id)

#### Defined in

[src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

___

### label

• **label**: `string`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[label](IoNavigatorBase.md#label)

#### Defined in

[src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

___

### menu

• **menu**: ``"left"`` \| ``"top"`` \| ``"bottom"`` \| ``"right"``

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[menu](IoNavigatorBase.md#menu)

#### Defined in

[src/elements/content/io-navigator-base.ts:90](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L90)

___

### name

• **name**: `string`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[name](IoNavigatorBase.md#name)

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

___

### options

• **options**: [`MenuOptions`](MenuOptions.md)

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[options](IoNavigatorBase.md#options)

#### Defined in

[src/elements/content/io-navigator-base.ts:87](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L87)

___

### role

• **role**: `string`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[role](IoNavigatorBase.md#role)

#### Defined in

[src/core/element.ts:190](https://github.com/io-gui/io/blob/main/src/core/element.ts#L190)

___

### slotted

• **slotted**: [`VDOMArray`](../README.md#vdomarray)[]

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[slotted](IoNavigatorBase.md#slotted)

#### Defined in

[src/elements/content/io-navigator-base.ts:81](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L81)

___

### tabindex

• **tabindex**: `string`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[tabindex](IoNavigatorBase.md#tabindex)

#### Defined in

[src/core/element.ts:181](https://github.com/io-gui/io/blob/main/src/core/element.ts#L181)

___

### title

• **title**: `string`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[title](IoNavigatorBase.md#title)

#### Defined in

[src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

## Accessors

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoNavigatorBase.textNode

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

IoNavigatorBase.textNode

#### Defined in

[src/core/element.ts:396](https://github.com/io-gui/io/blob/main/src/core/element.ts#L396)

___

### Properties

• `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoNavigatorBase.Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

___

### Style

• `get` **Style**(): `string`

#### Returns

`string`

#### Inherited from

IoNavigatorBase.Style

#### Defined in

[src/elements/content/io-navigator-base.ts:7](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L7)

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

[IoNavigatorBase](IoNavigatorBase.md).[Register](IoNavigatorBase.md#register)

#### Defined in

[src/core/element.ts:304](https://github.com/io-gui/io/blob/main/src/core/element.ts#L304)

___

### \_computeCollapsed

▸ **_computeCollapsed**(): `void`

#### Returns

`void`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[_computeCollapsed](IoNavigatorBase.md#_computecollapsed)

#### Defined in

[src/elements/content/io-navigator-base.ts:110](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L110)

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

[IoNavigatorBase](IoNavigatorBase.md).[_flattenTextNode](IoNavigatorBase.md#_flattentextnode)

#### Defined in

[src/core/element.ts:375](https://github.com/io-gui/io/blob/main/src/core/element.ts#L375)

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

[IoNavigatorBase](IoNavigatorBase.md).[addEventListener](IoNavigatorBase.md#addeventlistener)

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

[IoNavigatorBase](IoNavigatorBase.md).[applyProperties](IoNavigatorBase.md#applyproperties)

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

[IoNavigatorBase](IoNavigatorBase.md).[bind](IoNavigatorBase.md#bind)

#### Defined in

[src/core/node.ts:319](https://github.com/io-gui/io/blob/main/src/core/node.ts#L319)

___

### changed

▸ **changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[changed](IoNavigatorBase.md#changed)

#### Defined in

[src/elements/content/io-navigator-base.ts:118](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L118)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[connectedCallback](IoNavigatorBase.md#connectedcallback)

#### Defined in

[src/core/element.ts:213](https://github.com/io-gui/io/blob/main/src/core/element.ts#L213)

___

### disabledChanged

▸ **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[disabledChanged](IoNavigatorBase.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[disconnectedCallback](IoNavigatorBase.md#disconnectedcallback)

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

[IoNavigatorBase](IoNavigatorBase.md).[dispatchEvent](IoNavigatorBase.md#dispatchevent)

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

[IoNavigatorBase](IoNavigatorBase.md).[dispatchMutationEvent](IoNavigatorBase.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:384](https://github.com/io-gui/io/blob/main/src/core/node.ts#L384)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[dispatchQueue](IoNavigatorBase.md#dispatchqueue)

#### Defined in

[src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[dispatchQueueSync](IoNavigatorBase.md#dispatchqueuesync)

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

[IoNavigatorBase](IoNavigatorBase.md).[dispose](IoNavigatorBase.md#dispose)

#### Defined in

[src/core/node.ts:391](https://github.com/io-gui/io/blob/main/src/core/node.ts#L391)

___

### getSlotted

▸ **getSlotted**(): [`VDOMArray`](../README.md#vdomarray)

#### Returns

[`VDOMArray`](../README.md#vdomarray)

#### Overrides

[IoNavigatorBase](IoNavigatorBase.md).[getSlotted](IoNavigatorBase.md#getslotted)

#### Defined in

[src/elements/content/io-navigator-scroller.ts:8](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-scroller.ts#L8)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[init](IoNavigatorBase.md#init)

#### Defined in

[src/elements/content/io-navigator-base.ts:101](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L101)

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

[IoNavigatorBase](IoNavigatorBase.md).[inputValue](IoNavigatorBase.md#inputvalue)

#### Defined in

[src/core/node.ts:234](https://github.com/io-gui/io/blob/main/src/core/node.ts#L234)

___

### labelChanged

▸ **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[labelChanged](IoNavigatorBase.md#labelchanged)

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

[IoNavigatorBase](IoNavigatorBase.md).[objectMutated](IoNavigatorBase.md#objectmutated)

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

[IoNavigatorBase](IoNavigatorBase.md).[onObjectMutated](IoNavigatorBase.md#onobjectmutated)

#### Defined in

[src/core/node.ts:287](https://github.com/io-gui/io/blob/main/src/core/node.ts#L287)

___

### onResized

▸ **onResized**(): `void`

#### Returns

`void`

#### Inherited from

[IoNavigatorBase](IoNavigatorBase.md).[onResized](IoNavigatorBase.md#onresized)

#### Defined in

[src/elements/content/io-navigator-base.ts:106](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L106)

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

[IoNavigatorBase](IoNavigatorBase.md).[queue](IoNavigatorBase.md#queue)

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

[IoNavigatorBase](IoNavigatorBase.md).[removeEventListener](IoNavigatorBase.md#removeeventlistener)

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

[IoNavigatorBase](IoNavigatorBase.md).[setAttribute](IoNavigatorBase.md#setattribute)

#### Defined in

[src/core/element.ts:413](https://github.com/io-gui/io/blob/main/src/core/element.ts#L413)

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

[IoNavigatorBase](IoNavigatorBase.md).[setProperties](IoNavigatorBase.md#setproperties)

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

[IoNavigatorBase](IoNavigatorBase.md).[setProperty](IoNavigatorBase.md#setproperty)

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

[IoNavigatorBase](IoNavigatorBase.md).[template](IoNavigatorBase.md#template)

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

[IoNavigatorBase](IoNavigatorBase.md).[throttle](IoNavigatorBase.md#throttle)

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

[IoNavigatorBase](IoNavigatorBase.md).[traverse](IoNavigatorBase.md#traverse)

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

[IoNavigatorBase](IoNavigatorBase.md).[unbind](IoNavigatorBase.md#unbind)

#### Defined in

[src/core/node.ts:336](https://github.com/io-gui/io/blob/main/src/core/node.ts#L336)
