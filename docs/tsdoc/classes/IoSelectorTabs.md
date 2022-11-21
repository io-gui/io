# Class: IoSelectorTabs

Element selector with selectable tabs interfce.

<io-element-demo element="io-selector-tabs"
    properties='{
        "elements": [
            ["div", {"name": "first"}, "First content"],
            ["div", {"name": "second"}, "Second content"],
            ["div", {"name": "third"}, "Third content"],
            ["div", {"name": "fourth"}, "Fourth content"],
            ["div", {"name": "fifth"}, "Fifth content"],
            ["div", {"name": "sixth"}, "Sixth content"]],
        "selected": "first",
        "cache": false,
        "options": [
            "first",
            "second",
            "third",
            "fourth",
            {"label" : "more", "options": ["fifth", "sixth"]}]}'
    config='{"options": ["io-properties"]}'>
</io-element-demo>

## Hierarchy

- [`IoSelector`](IoSelector.md)

  ↳ **`IoSelectorTabs`**

## Constructors

### constructor

**new IoSelectorTabs**(`props?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `props?` | `any` |

#### Inherited from

[IoSelector](IoSelector.md).[constructor](IoSelector.md#constructor)

#### Defined in

[src/elements/layout/io-selector.ts:104](https://github.com/io-gui/iogui/blob/main/src/elements/layout/io-selector.ts#L104)

## Properties

### $

 **$**: `Record`<`string`, `any`\>

#### Inherited from

[IoSelector](IoSelector.md).[$](IoSelector.md#$)

#### Defined in

[src/core/element.ts:211](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L211)

___

### \_bindings

 `Readonly` **\_bindings**: `Map`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoSelector](IoSelector.md).[_bindings](IoSelector.md#_bindings)

#### Defined in

[src/core/node.ts:48](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L48)

___

### \_changeQueue

 `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoSelector](IoSelector.md).[_changeQueue](IoSelector.md#_changequeue)

#### Defined in

[src/core/node.ts:49](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L49)

___

### \_eventDispatcher

 `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoSelector](IoSelector.md).[_eventDispatcher](IoSelector.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:50](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L50)

___

### \_properties

 `Readonly` **\_properties**: `Map`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoSelector](IoSelector.md).[_properties](IoSelector.md#_properties)

#### Defined in

[src/core/node.ts:47](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L47)

___

### \_protochain

 `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoSelector](IoSelector.md).[_protochain](IoSelector.md#_protochain)

#### Defined in

[src/core/node.ts:46](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L46)

___

### class

 **class**: `string`

#### Inherited from

[IoSelector](IoSelector.md).[class](IoSelector.md#class)

#### Defined in

[src/core/element.ts:220](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L220)

___

### contenteditable

 **contenteditable**: `boolean`

#### Inherited from

[IoSelector](IoSelector.md).[contenteditable](IoSelector.md#contenteditable)

#### Defined in

[src/core/element.ts:217](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L217)

___

### disabled

 **disabled**: `boolean`

#### Inherited from

[IoSelector](IoSelector.md).[disabled](IoSelector.md#disabled)

#### Defined in

[src/core/element.ts:241](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L241)

___

### hidden

 **hidden**: `boolean`

#### Inherited from

[IoSelector](IoSelector.md).[hidden](IoSelector.md#hidden)

#### Defined in

[src/core/element.ts:238](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L238)

___

### id

 **id**: `string`

#### Inherited from

[IoSelector](IoSelector.md).[id](IoSelector.md#id)

#### Defined in

[src/core/element.ts:235](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L235)

___

### label

 **label**: `string`

#### Inherited from

[IoSelector](IoSelector.md).[label](IoSelector.md#label)

#### Defined in

[src/core/element.ts:226](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L226)

___

### name

 **name**: `string`

#### Inherited from

[IoSelector](IoSelector.md).[name](IoSelector.md#name)

#### Defined in

[src/core/element.ts:229](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L229)

___

### role

 **role**: `string`

#### Inherited from

[IoSelector](IoSelector.md).[role](IoSelector.md#role)

#### Defined in

[src/core/element.ts:223](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L223)

___

### tabindex

 **tabindex**: `string`

#### Inherited from

[IoSelector](IoSelector.md).[tabindex](IoSelector.md#tabindex)

#### Defined in

[src/core/element.ts:214](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L214)

___

### title

 **title**: `string`

#### Inherited from

[IoSelector](IoSelector.md).[title](IoSelector.md#title)

#### Defined in

[src/core/element.ts:232](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L232)

## Accessors

### textNode

`get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoSelector.textNode

#### Defined in

[src/core/element.ts:392](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L392)

`set` **textNode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

IoSelector.textNode

#### Defined in

[src/core/element.ts:396](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L396)

___

### Listeners

`Static` `get` **Listeners**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `content-ready` | `string` |
| `scroll` | (`string` \| { `capture`: `boolean` = true; `passive`: `boolean` = true })[] |

#### Inherited from

IoSelector.Listeners

#### Defined in

[src/elements/layout/io-selector.ts:98](https://github.com/io-gui/iogui/blob/main/src/elements/layout/io-selector.ts#L98)

___

### Properties

`Static` `get` **Properties**(): `any`

#### Returns

`any`

#### Overrides

IoSelector.Properties

#### Defined in

[src/elements/layout/io-selector-tabs.ts:41](https://github.com/io-gui/iogui/blob/main/src/elements/layout/io-selector-tabs.ts#L41)

___

### Style

`Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoSelector.Style

#### Defined in

[src/elements/layout/io-selector-tabs.ts:29](https://github.com/io-gui/iogui/blob/main/src/elements/layout/io-selector-tabs.ts#L29)

___

### observedAttributes

`Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoSelector.observedAttributes

#### Defined in

[src/core/element.ts:243](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L243)

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

[IoSelector](IoSelector.md).[_flattenTextNode](IoSelector.md#_flattentextnode)

#### Defined in

[src/core/element.ts:375](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L375)

___

### \_onIoContentReady

**_onIoContentReady**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`<`any`\> |

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[_onIoContentReady](IoSelector.md#_oniocontentready)

#### Defined in

[src/elements/layout/io-selector.ts:115](https://github.com/io-gui/iogui/blob/main/src/elements/layout/io-selector.ts#L115)

___

### \_onScroll

**_onScroll**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[_onScroll](IoSelector.md#_onscroll)

#### Defined in

[src/elements/layout/io-selector.ts:130](https://github.com/io-gui/iogui/blob/main/src/elements/layout/io-selector.ts#L130)

___

### \_selectDefault

**_selectDefault**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[_selectDefault](IoSelector.md#_selectdefault)

#### Defined in

[src/elements/layout/io-selector.ts:108](https://github.com/io-gui/iogui/blob/main/src/elements/layout/io-selector.ts#L108)

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

[IoSelector](IoSelector.md).[addEventListener](IoSelector.md#addeventlistener)

#### Defined in

[src/core/node.ts:337](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L337)

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

[IoSelector](IoSelector.md).[applyProperties](IoSelector.md#applyproperties)

#### Defined in

[src/core/element.ts:400](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L400)

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

[IoSelector](IoSelector.md).[attributeChangedCallback](IoSelector.md#attributechangedcallback)

#### Defined in

[src/core/element.ts:253](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L253)

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

[IoSelector](IoSelector.md).[bind](IoSelector.md#bind)

#### Defined in

[src/core/node.ts:306](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L306)

___

### changed

**changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[changed](IoSelector.md#changed)

#### Defined in

[src/core/node.ts:234](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L234)

___

### connectedCallback

**connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[connectedCallback](IoSelector.md#connectedcallback)

#### Defined in

[src/elements/layout/io-selector.ts:119](https://github.com/io-gui/iogui/blob/main/src/elements/layout/io-selector.ts#L119)

___

### disabledChanged

**disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[disabledChanged](IoSelector.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L429)

___

### disconnectedCallback

**disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[disconnectedCallback](IoSelector.md#disconnectedcallback)

#### Defined in

[src/core/element.ts:279](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L279)

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

[IoSelector](IoSelector.md).[dispatchEvent](IoSelector.md#dispatchevent)

#### Defined in

[src/core/node.ts:362](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L362)

___

### dispatchQueue

**dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[dispatchQueue](IoSelector.md#dispatchqueue)

#### Defined in

[src/core/node.ts:248](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L248)

___

### dispatchQueueSync

**dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[dispatchQueueSync](IoSelector.md#dispatchqueuesync)

#### Defined in

[src/core/node.ts:258](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L258)

___

### dispose

**dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[dispose](IoSelector.md#dispose)

#### Defined in

[src/core/node.ts:369](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L369)

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

[IoSelector](IoSelector.md).[disposeDeep](IoSelector.md#disposedeep)

#### Defined in

[src/core/element.ts:295](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L295)

___

### elementsChanged

**elementsChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[elementsChanged](IoSelector.md#elementschanged)

#### Defined in

[src/elements/layout/io-selector.ts:167](https://github.com/io-gui/iogui/blob/main/src/elements/layout/io-selector.ts#L167)

___

### getSlotted

**getSlotted**(): `any`

#### Returns

`any`

#### Overrides

[IoSelector](IoSelector.md).[getSlotted](IoSelector.md#getslotted)

#### Defined in

[src/elements/layout/io-selector-tabs.ts:50](https://github.com/io-gui/iogui/blob/main/src/elements/layout/io-selector-tabs.ts#L50)

___

### importModule

**importModule**(`path`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`Promise`<`unknown`\>

#### Inherited from

[IoSelector](IoSelector.md).[importModule](IoSelector.md#importmodule)

#### Defined in

[src/elements/layout/io-selector.ts:186](https://github.com/io-gui/iogui/blob/main/src/elements/layout/io-selector.ts#L186)

___

### init

**init**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[init](IoSelector.md#init)

#### Defined in

[src/core/node.ts:235](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L235)

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

[IoSelector](IoSelector.md).[inputValue](IoSelector.md#inputvalue)

#### Defined in

[src/core/node.ts:223](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L223)

___

### labelChanged

**labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[labelChanged](IoSelector.md#labelchanged)

#### Defined in

[src/core/element.ts:422](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L422)

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

[IoSelector](IoSelector.md).[objectMutated](IoSelector.md#objectmutated)

#### Defined in

[src/core/node.ts:297](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L297)

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

[IoSelector](IoSelector.md).[onObjectMutated](IoSelector.md#onobjectmutated)

#### Defined in

[src/core/node.ts:276](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L276)

___

### optionsChanged

**optionsChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[optionsChanged](IoSelector.md#optionschanged)

#### Defined in

[src/elements/layout/io-selector.ts:163](https://github.com/io-gui/iogui/blob/main/src/elements/layout/io-selector.ts#L163)

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

[IoSelector](IoSelector.md).[queue](IoSelector.md#queue)

#### Defined in

[src/core/node.ts:242](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L242)

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

[IoSelector](IoSelector.md).[removeEventListener](IoSelector.md#removeeventlistener)

#### Defined in

[src/core/node.ts:352](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L352)

___

### scrollTo

**scrollTo**(`id`, `smooth?`): `void`

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

[src/elements/layout/io-selector.ts:123](https://github.com/io-gui/iogui/blob/main/src/elements/layout/io-selector.ts#L123)

___

### selectedChanged

**selectedChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[selectedChanged](IoSelector.md#selectedchanged)

#### Defined in

[src/elements/layout/io-selector.ts:159](https://github.com/io-gui/iogui/blob/main/src/elements/layout/io-selector.ts#L159)

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

[IoSelector](IoSelector.md).[setAttribute](IoSelector.md#setattribute)

#### Defined in

[src/core/element.ts:413](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L413)

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

[IoSelector](IoSelector.md).[setProperties](IoSelector.md#setproperties)

#### Defined in

[src/core/node.ts:206](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L206)

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

[IoSelector](IoSelector.md).[setProperty](IoSelector.md#setproperty)

#### Defined in

[src/core/node.ts:109](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L109)

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

[IoSelector](IoSelector.md).[template](IoSelector.md#template)

#### Defined in

[src/core/element.ts:289](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L289)

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

[IoSelector](IoSelector.md).[throttle](IoSelector.md#throttle)

#### Defined in

[src/core/node.ts:267](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L267)

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

[IoSelector](IoSelector.md).[traverse](IoSelector.md#traverse)

#### Defined in

[src/core/element.ts:319](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L319)

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

[IoSelector](IoSelector.md).[unbind](IoSelector.md#unbind)

#### Defined in

[src/core/node.ts:321](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L321)

___

### update

**update**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[update](IoSelector.md#update)

#### Defined in

[src/elements/layout/io-selector.ts:200](https://github.com/io-gui/iogui/blob/main/src/elements/layout/io-selector.ts#L200)

___

### updateScroll

**updateScroll**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelector](IoSelector.md).[updateScroll](IoSelector.md#updatescroll)

#### Defined in

[src/elements/layout/io-selector.ts:170](https://github.com/io-gui/iogui/blob/main/src/elements/layout/io-selector.ts#L170)
