[io-gui](../README.md) / IoNavigatorCombined

# Class: IoNavigatorCombined

Core `IoElement` class.

## Hierarchy

- [`IoNavigatorSelector`](IoNavigatorSelector.md)

  ↳ **`IoNavigatorCombined`**

## Table of contents

### Constructors

- [constructor](IoNavigatorCombined.md#constructor)

### Properties

- [$](IoNavigatorCombined.md#$)
- [\_bindings](IoNavigatorCombined.md#_bindings)
- [\_changeQueue](IoNavigatorCombined.md#_changequeue)
- [\_eventDispatcher](IoNavigatorCombined.md#_eventdispatcher)
- [\_properties](IoNavigatorCombined.md#_properties)
- [\_protochain](IoNavigatorCombined.md#_protochain)
- [cache](IoNavigatorCombined.md#cache)
- [class](IoNavigatorCombined.md#class)
- [collapseWidth](IoNavigatorCombined.md#collapsewidth)
- [collapsed](IoNavigatorCombined.md#collapsed)
- [contenteditable](IoNavigatorCombined.md#contenteditable)
- [depth](IoNavigatorCombined.md#depth)
- [disabled](IoNavigatorCombined.md#disabled)
- [elements](IoNavigatorCombined.md#elements)
- [hidden](IoNavigatorCombined.md#hidden)
- [id](IoNavigatorCombined.md#id)
- [label](IoNavigatorCombined.md#label)
- [menu](IoNavigatorCombined.md#menu)
- [name](IoNavigatorCombined.md#name)
- [options](IoNavigatorCombined.md#options)
- [precache](IoNavigatorCombined.md#precache)
- [role](IoNavigatorCombined.md#role)
- [select](IoNavigatorCombined.md#select)
- [slotted](IoNavigatorCombined.md#slotted)
- [tabindex](IoNavigatorCombined.md#tabindex)
- [title](IoNavigatorCombined.md#title)

### Accessors

- [textNode](IoNavigatorCombined.md#textnode)
- [Properties](IoNavigatorCombined.md#properties)
- [Style](IoNavigatorCombined.md#style)

### Methods

- [Register](IoNavigatorCombined.md#register)
- [\_computeCollapsed](IoNavigatorCombined.md#_computecollapsed)
- [\_flattenTextNode](IoNavigatorCombined.md#_flattentextnode)
- [addEventListener](IoNavigatorCombined.md#addeventlistener)
- [applyProperties](IoNavigatorCombined.md#applyproperties)
- [bind](IoNavigatorCombined.md#bind)
- [changed](IoNavigatorCombined.md#changed)
- [connectedCallback](IoNavigatorCombined.md#connectedcallback)
- [disabledChanged](IoNavigatorCombined.md#disabledchanged)
- [disconnectedCallback](IoNavigatorCombined.md#disconnectedcallback)
- [dispatchEvent](IoNavigatorCombined.md#dispatchevent)
- [dispatchMutationEvent](IoNavigatorCombined.md#dispatchmutationevent)
- [dispatchQueue](IoNavigatorCombined.md#dispatchqueue)
- [dispatchQueueSync](IoNavigatorCombined.md#dispatchqueuesync)
- [dispose](IoNavigatorCombined.md#dispose)
- [getSlotted](IoNavigatorCombined.md#getslotted)
- [init](IoNavigatorCombined.md#init)
- [inputValue](IoNavigatorCombined.md#inputvalue)
- [labelChanged](IoNavigatorCombined.md#labelchanged)
- [objectMutated](IoNavigatorCombined.md#objectmutated)
- [onObjectMutated](IoNavigatorCombined.md#onobjectmutated)
- [onResized](IoNavigatorCombined.md#onresized)
- [queue](IoNavigatorCombined.md#queue)
- [removeEventListener](IoNavigatorCombined.md#removeeventlistener)
- [setAttribute](IoNavigatorCombined.md#setattribute)
- [setProperties](IoNavigatorCombined.md#setproperties)
- [setProperty](IoNavigatorCombined.md#setproperty)
- [template](IoNavigatorCombined.md#template)
- [throttle](IoNavigatorCombined.md#throttle)
- [traverse](IoNavigatorCombined.md#traverse)
- [unbind](IoNavigatorCombined.md#unbind)

## Constructors

### constructor

• **new IoNavigatorCombined**(`...args`): [`IoNavigatorCombined`](IoNavigatorCombined.md)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

[`IoNavigatorCombined`](IoNavigatorCombined.md)

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[constructor](IoNavigatorSelector.md#constructor)

#### Defined in

[src/core/node.ts:63](https://github.com/io-gui/io/blob/main/src/core/node.ts#L63)

## Properties

### $

• **$**: `Record`\<`string`, `any`\>

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[$](IoNavigatorSelector.md#$)

#### Defined in

[src/core/element.ts:178](https://github.com/io-gui/io/blob/main/src/core/element.ts#L178)

___

### \_bindings

• `Readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[_bindings](IoNavigatorSelector.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[_changeQueue](IoNavigatorSelector.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[_eventDispatcher](IoNavigatorSelector.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

___

### \_properties

• `Readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[_properties](IoNavigatorSelector.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[_protochain](IoNavigatorSelector.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

___

### cache

• **cache**: `boolean`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[cache](IoNavigatorSelector.md#cache)

#### Defined in

[src/elements/content/io-navigator-selector.ts:13](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-selector.ts#L13)

___

### class

• **class**: `string`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[class](IoNavigatorSelector.md#class)

#### Defined in

[src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

___

### collapseWidth

• **collapseWidth**: `number`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[collapseWidth](IoNavigatorSelector.md#collapsewidth)

#### Defined in

[src/elements/content/io-navigator-base.ts:99](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L99)

___

### collapsed

• **collapsed**: `boolean`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[collapsed](IoNavigatorSelector.md#collapsed)

#### Defined in

[src/elements/content/io-navigator-base.ts:96](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L96)

___

### contenteditable

• **contenteditable**: `boolean`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[contenteditable](IoNavigatorSelector.md#contenteditable)

#### Defined in

[src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

___

### depth

• **depth**: `number`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[depth](IoNavigatorSelector.md#depth)

#### Defined in

[src/elements/content/io-navigator-base.ts:93](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L93)

___

### disabled

• **disabled**: `boolean`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[disabled](IoNavigatorSelector.md#disabled)

#### Defined in

[src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

___

### elements

• **elements**: [`VDOMArray`](../README.md#vdomarray)[]

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[elements](IoNavigatorSelector.md#elements)

#### Defined in

[src/elements/content/io-navigator-base.ts:84](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L84)

___

### hidden

• **hidden**: `boolean`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[hidden](IoNavigatorSelector.md#hidden)

#### Defined in

[src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

___

### id

• **id**: `string`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[id](IoNavigatorSelector.md#id)

#### Defined in

[src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

___

### label

• **label**: `string`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[label](IoNavigatorSelector.md#label)

#### Defined in

[src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

___

### menu

• **menu**: ``"left"`` \| ``"top"`` \| ``"bottom"`` \| ``"right"``

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[menu](IoNavigatorSelector.md#menu)

#### Defined in

[src/elements/content/io-navigator-base.ts:90](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L90)

___

### name

• **name**: `string`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[name](IoNavigatorSelector.md#name)

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

___

### options

• **options**: [`MenuOptions`](MenuOptions.md)

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[options](IoNavigatorSelector.md#options)

#### Defined in

[src/elements/content/io-navigator-base.ts:87](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L87)

___

### precache

• **precache**: `boolean`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[precache](IoNavigatorSelector.md#precache)

#### Defined in

[src/elements/content/io-navigator-selector.ts:16](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-selector.ts#L16)

___

### role

• **role**: `string`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[role](IoNavigatorSelector.md#role)

#### Defined in

[src/core/element.ts:190](https://github.com/io-gui/io/blob/main/src/core/element.ts#L190)

___

### select

• **select**: ``"first"`` \| ``"last"``

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[select](IoNavigatorSelector.md#select)

#### Defined in

[src/elements/content/io-navigator-selector.ts:10](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-selector.ts#L10)

___

### slotted

• **slotted**: [`VDOMArray`](../README.md#vdomarray)[]

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[slotted](IoNavigatorSelector.md#slotted)

#### Defined in

[src/elements/content/io-navigator-base.ts:81](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L81)

___

### tabindex

• **tabindex**: `string`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[tabindex](IoNavigatorSelector.md#tabindex)

#### Defined in

[src/core/element.ts:181](https://github.com/io-gui/io/blob/main/src/core/element.ts#L181)

___

### title

• **title**: `string`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[title](IoNavigatorSelector.md#title)

#### Defined in

[src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

## Accessors

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoNavigatorSelector.textNode

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

IoNavigatorSelector.textNode

#### Defined in

[src/core/element.ts:396](https://github.com/io-gui/io/blob/main/src/core/element.ts#L396)

___

### Properties

• `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoNavigatorSelector.Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

___

### Style

• `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoNavigatorSelector.Style

#### Defined in

[src/elements/content/io-navigator-combined.ts:8](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-combined.ts#L8)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[Register](IoNavigatorSelector.md#register)

#### Defined in

[src/core/element.ts:304](https://github.com/io-gui/io/blob/main/src/core/element.ts#L304)

___

### \_computeCollapsed

▸ **_computeCollapsed**(): `void`

#### Returns

`void`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[_computeCollapsed](IoNavigatorSelector.md#_computecollapsed)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[_flattenTextNode](IoNavigatorSelector.md#_flattentextnode)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[addEventListener](IoNavigatorSelector.md#addeventlistener)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[applyProperties](IoNavigatorSelector.md#applyproperties)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[bind](IoNavigatorSelector.md#bind)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[changed](IoNavigatorSelector.md#changed)

#### Defined in

[src/elements/content/io-navigator-base.ts:118](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L118)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[connectedCallback](IoNavigatorSelector.md#connectedcallback)

#### Defined in

[src/core/element.ts:213](https://github.com/io-gui/io/blob/main/src/core/element.ts#L213)

___

### disabledChanged

▸ **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[disabledChanged](IoNavigatorSelector.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[disconnectedCallback](IoNavigatorSelector.md#disconnectedcallback)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[dispatchEvent](IoNavigatorSelector.md#dispatchevent)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[dispatchMutationEvent](IoNavigatorSelector.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:384](https://github.com/io-gui/io/blob/main/src/core/node.ts#L384)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[dispatchQueue](IoNavigatorSelector.md#dispatchqueue)

#### Defined in

[src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[dispatchQueueSync](IoNavigatorSelector.md#dispatchqueuesync)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[dispose](IoNavigatorSelector.md#dispose)

#### Defined in

[src/core/node.ts:391](https://github.com/io-gui/io/blob/main/src/core/node.ts#L391)

___

### getSlotted

▸ **getSlotted**(): [`VDOMArray`](../README.md#vdomarray)

#### Returns

[`VDOMArray`](../README.md#vdomarray)

#### Overrides

[IoNavigatorSelector](IoNavigatorSelector.md).[getSlotted](IoNavigatorSelector.md#getslotted)

#### Defined in

[src/elements/content/io-navigator-combined.ts:15](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-combined.ts#L15)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[init](IoNavigatorSelector.md#init)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[inputValue](IoNavigatorSelector.md#inputvalue)

#### Defined in

[src/core/node.ts:234](https://github.com/io-gui/io/blob/main/src/core/node.ts#L234)

___

### labelChanged

▸ **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[labelChanged](IoNavigatorSelector.md#labelchanged)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[objectMutated](IoNavigatorSelector.md#objectmutated)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[onObjectMutated](IoNavigatorSelector.md#onobjectmutated)

#### Defined in

[src/core/node.ts:287](https://github.com/io-gui/io/blob/main/src/core/node.ts#L287)

___

### onResized

▸ **onResized**(): `void`

#### Returns

`void`

#### Inherited from

[IoNavigatorSelector](IoNavigatorSelector.md).[onResized](IoNavigatorSelector.md#onresized)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[queue](IoNavigatorSelector.md#queue)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[removeEventListener](IoNavigatorSelector.md#removeeventlistener)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[setAttribute](IoNavigatorSelector.md#setattribute)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[setProperties](IoNavigatorSelector.md#setproperties)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[setProperty](IoNavigatorSelector.md#setproperty)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[template](IoNavigatorSelector.md#template)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[throttle](IoNavigatorSelector.md#throttle)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[traverse](IoNavigatorSelector.md#traverse)

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

[IoNavigatorSelector](IoNavigatorSelector.md).[unbind](IoNavigatorSelector.md#unbind)

#### Defined in

[src/core/node.ts:336](https://github.com/io-gui/io/blob/main/src/core/node.ts#L336)
