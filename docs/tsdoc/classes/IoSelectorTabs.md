# Class: IoSelectorTabs

Core `IoElement` class.

## Hierarchy

- [`IoSelector`](IoSelector.md)

  ↳ **`IoSelectorTabs`**

## Constructors

### constructor

• **new IoSelectorTabs**(`props?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `props?` | `any` |

#### Inherited from

[IoSelector](IoSelector.md).[constructor](IoSelector.md#constructor)

#### Defined in

[src/elements/layout/selector.ts:106](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L106)

## Properties

### $

• **$**: `Record`<`string`, `any`\>

#### Inherited from

[IoSelector](IoSelector.md).[$](IoSelector.md#$)

#### Defined in

[src/core/element.ts:219](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L219)

___

### \_bindings

• `Readonly` **\_bindings**: `Record`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoSelector](IoSelector.md).[_bindings](IoSelector.md#_bindings)

#### Defined in

[src/core/node.ts:48](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L48)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoSelector](IoSelector.md).[_changeQueue](IoSelector.md#_changequeue)

#### Defined in

[src/core/node.ts:49](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L49)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoSelector](IoSelector.md).[_eventDispatcher](IoSelector.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:50](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L50)

___

### \_properties

• `Readonly` **\_properties**: `Record`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoSelector](IoSelector.md).[_properties](IoSelector.md#_properties)

#### Defined in

[src/core/node.ts:47](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L47)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoSelector](IoSelector.md).[_protochain](IoSelector.md#_protochain)

#### Defined in

[src/core/node.ts:46](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L46)

___

### class

• **class**: `string`

#### Inherited from

[IoSelector](IoSelector.md).[class](IoSelector.md#class)

#### Defined in

[src/core/element.ts:228](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L228)

___

### contenteditable

• **contenteditable**: `boolean`

#### Inherited from

[IoSelector](IoSelector.md).[contenteditable](IoSelector.md#contenteditable)

#### Defined in

[src/core/element.ts:225](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L225)

___

### disabled

• **disabled**: `boolean`

#### Inherited from

[IoSelector](IoSelector.md).[disabled](IoSelector.md#disabled)

#### Defined in

[src/core/element.ts:249](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L249)

___

### hidden

• **hidden**: `boolean`

#### Inherited from

[IoSelector](IoSelector.md).[hidden](IoSelector.md#hidden)

#### Defined in

[src/core/element.ts:246](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L246)

___

### id

• **id**: `string`

#### Inherited from

[IoSelector](IoSelector.md).[id](IoSelector.md#id)

#### Defined in

[src/core/element.ts:243](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L243)

___

### label

• **label**: `string`

#### Inherited from

[IoSelector](IoSelector.md).[label](IoSelector.md#label)

#### Defined in

[src/core/element.ts:234](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L234)

___

### name

• **name**: `string`

#### Inherited from

[IoSelector](IoSelector.md).[name](IoSelector.md#name)

#### Defined in

[src/core/element.ts:237](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L237)

___

### role

• **role**: `string`

#### Inherited from

[IoSelector](IoSelector.md).[role](IoSelector.md#role)

#### Defined in

[src/core/element.ts:231](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L231)

___

### tabindex

• **tabindex**: `string`

#### Inherited from

[IoSelector](IoSelector.md).[tabindex](IoSelector.md#tabindex)

#### Defined in

[src/core/element.ts:222](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L222)

___

### title

• **title**: `string`

#### Inherited from

[IoSelector](IoSelector.md).[title](IoSelector.md#title)

#### Defined in

[src/core/element.ts:240](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L240)

## Accessors

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoSelector.textNode

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

IoSelector.textNode

#### Defined in

[src/core/element.ts:413](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L413)

___

### Listeners

• `Static` `get` **Listeners**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `content-ready` | `string` |
| `scroll` | (`string` \| { `capture`: `boolean` = true; `passive`: `boolean` = true })[] |

#### Inherited from

IoSelector.Listeners

#### Defined in

[src/elements/layout/selector.ts:100](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L100)

___

### Properties

• `Static` `get` **Properties**(): `any`

#### Returns

`any`

#### Overrides

IoSelector.Properties

#### Defined in

[src/elements/layout/selector-tabs.ts:43](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector-tabs.ts#L43)

___

### Style

• `Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoSelector.Style

#### Defined in

[src/elements/layout/selector-tabs.ts:31](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector-tabs.ts#L31)

___

### observedAttributes

• `Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoSelector.observedAttributes

#### Defined in

[src/core/element.ts:256](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L256)

## Methods

### \_onFocusTo

▸ **_onFocusTo**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`<`any`\> |

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[_onFocusTo](IoSelector.md#_onfocusto)

#### Defined in

[src/core/element.ts:453](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L453)

___

### \_onIoContentReady

▸ **_onIoContentReady**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`<`any`\> |

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[_onIoContentReady](IoSelector.md#_oniocontentready)

#### Defined in

[src/elements/layout/selector.ts:117](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L117)

___

### \_onScroll

▸ **_onScroll**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[_onScroll](IoSelector.md#_onscroll)

#### Defined in

[src/elements/layout/selector.ts:132](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L132)

___

### \_selectDefault

▸ **_selectDefault**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[_selectDefault](IoSelector.md#_selectdefault)

#### Defined in

[src/elements/layout/selector.ts:110](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L110)

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

[IoSelector](IoSelector.md).[addEventListener](IoSelector.md#addeventlistener)

#### Defined in

[src/core/node.ts:317](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L317)

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

[IoSelector](IoSelector.md).[applyProperties](IoSelector.md#applyproperties)

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

[IoSelector](IoSelector.md).[attributeChangedCallback](IoSelector.md#attributechangedcallback)

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

[IoSelector](IoSelector.md).[bind](IoSelector.md#bind)

#### Defined in

[src/core/node.ts:290](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L290)

___

### changed

▸ **changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[changed](IoSelector.md#changed)

#### Defined in

[src/core/node.ts:218](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L218)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[connectedCallback](IoSelector.md#connectedcallback)

#### Defined in

[src/elements/layout/selector.ts:121](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L121)

___

### disabledChanged

▸ **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[disabledChanged](IoSelector.md#disabledchanged)

#### Defined in

[src/core/element.ts:446](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L446)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[disconnectedCallback](IoSelector.md#disconnectedcallback)

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

[IoSelector](IoSelector.md).[dispatchEvent](IoSelector.md#dispatchevent)

#### Defined in

[src/core/node.ts:342](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L342)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[dispatchQueue](IoSelector.md#dispatchqueue)

#### Defined in

[src/core/node.ts:232](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L232)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[dispatchQueueSync](IoSelector.md#dispatchqueuesync)

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

[IoSelector](IoSelector.md).[dispose](IoSelector.md#dispose)

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

[IoSelector](IoSelector.md).[disposeDeep](IoSelector.md#disposedeep)

#### Defined in

[src/core/element.ts:308](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L308)

___

### elementsChanged

▸ **elementsChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[elementsChanged](IoSelector.md#elementschanged)

#### Defined in

[src/elements/layout/selector.ts:169](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L169)

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

[IoSelector](IoSelector.md).[flattenTextNode](IoSelector.md#flattentextnode)

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

[IoSelector](IoSelector.md).[focusTo](IoSelector.md#focusto)

#### Defined in

[src/core/element.ts:560](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L560)

___

### getSlotted

▸ **getSlotted**(): `any`

#### Returns

`any`

#### Overrides

[IoSelector](IoSelector.md).[getSlotted](IoSelector.md#getslotted)

#### Defined in

[src/elements/layout/selector-tabs.ts:52](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector-tabs.ts#L52)

___

### importModule

▸ **importModule**(`path`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`Promise`<`unknown`\>

#### Inherited from

[IoSelector](IoSelector.md).[importModule](IoSelector.md#importmodule)

#### Defined in

[src/elements/layout/selector.ts:188](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L188)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[init](IoSelector.md#init)

#### Defined in

[src/core/node.ts:219](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L219)

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

[IoSelector](IoSelector.md).[inputValue](IoSelector.md#inputvalue)

#### Defined in

[src/core/node.ts:207](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L207)

___

### labelChanged

▸ **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[labelChanged](IoSelector.md#labelchanged)

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

[IoSelector](IoSelector.md).[objectMutated](IoSelector.md#objectmutated)

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

[IoSelector](IoSelector.md).[onObjectMutated](IoSelector.md#onobjectmutated)

#### Defined in

[src/core/node.ts:260](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L260)

___

### optionsChanged

▸ **optionsChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[optionsChanged](IoSelector.md#optionschanged)

#### Defined in

[src/elements/layout/selector.ts:165](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L165)

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

[IoSelector](IoSelector.md).[queue](IoSelector.md#queue)

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

[IoSelector](IoSelector.md).[removeEventListener](IoSelector.md#removeeventlistener)

#### Defined in

[src/core/node.ts:332](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L332)

___

### scrollTo

▸ **scrollTo**(`id`, `smooth?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `smooth?` | `boolean` |

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[scrollTo](IoSelector.md#scrollto)

#### Defined in

[src/elements/layout/selector.ts:125](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L125)

___

### selectedChanged

▸ **selectedChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[selectedChanged](IoSelector.md#selectedchanged)

#### Defined in

[src/elements/layout/selector.ts:161](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L161)

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

[IoSelector](IoSelector.md).[setAttribute](IoSelector.md#setattribute)

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

[IoSelector](IoSelector.md).[setProperties](IoSelector.md#setproperties)

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

[IoSelector](IoSelector.md).[setProperty](IoSelector.md#setproperty)

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

[IoSelector](IoSelector.md).[template](IoSelector.md#template)

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

[IoSelector](IoSelector.md).[throttle](IoSelector.md#throttle)

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

[IoSelector](IoSelector.md).[traverse](IoSelector.md#traverse)

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

[IoSelector](IoSelector.md).[unbind](IoSelector.md#unbind)

#### Defined in

[src/core/node.ts:303](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L303)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[update](IoSelector.md#update)

#### Defined in

[src/elements/layout/selector.ts:202](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L202)

___

### updateScroll

▸ **updateScroll**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[updateScroll](IoSelector.md#updatescroll)

#### Defined in

[src/elements/layout/selector.ts:172](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L172)
