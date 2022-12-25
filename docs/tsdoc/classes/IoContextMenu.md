# Class: IoContextMenu

An invisible element that inserts a floating menu when its `parentElement` is clicked. Menu position is set by the pointer by default but it can be configured to expand to the side of the parent element by setting the `position` property. Default `button` property for menu expansion is `0` (left mouse button), but it can be configured for other buttons. You can have multiple `IoContextMenu` instances under the same `parentElement` as long as the `button` properties are different.

## Hierarchy

- [`IoElement`](IoElement.md)

  ↳ **`IoContextMenu`**

## Constructors

### constructor

**new IoContextMenu**(...`args`)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Inherited from

[IoElement](IoElement.md).[constructor](IoElement.md#constructor)

#### Defined in

[src/core/node.ts:63](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L63)

## Properties

### $

 **$**: `Record`<`string`, `any`\>

#### Inherited from

[IoElement](IoElement.md).[$](IoElement.md#$)

#### Defined in

[src/core/element.ts:243](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L243)

___

### \_bindings

 `Readonly` **\_bindings**: `Map`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoElement](IoElement.md).[_bindings](IoElement.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

 `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoElement](IoElement.md).[_changeQueue](IoElement.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

 `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoElement](IoElement.md).[_eventDispatcher](IoElement.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L57)

___

### \_properties

 `Readonly` **\_properties**: `Map`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoElement](IoElement.md).[_properties](IoElement.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L54)

___

### \_protochain

 `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoElement](IoElement.md).[_protochain](IoElement.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L53)

___

### button

 **button**: `number`

#### Defined in

[src/elements/menus/io-context-menu.ts:21](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-context-menu.ts#L21)

___

### class

 **class**: `string`

#### Inherited from

[IoElement](IoElement.md).[class](IoElement.md#class)

#### Defined in

[src/core/element.ts:252](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L252)

___

### contenteditable

 **contenteditable**: `boolean`

#### Inherited from

[IoElement](IoElement.md).[contenteditable](IoElement.md#contenteditable)

#### Defined in

[src/core/element.ts:249](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L249)

___

### disabled

 **disabled**: `boolean`

#### Inherited from

[IoElement](IoElement.md).[disabled](IoElement.md#disabled)

#### Defined in

[src/core/element.ts:273](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L273)

___

### expanded

 **expanded**: `boolean`

#### Defined in

[src/elements/menus/io-context-menu.ts:18](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-context-menu.ts#L18)

___

### hidden

 **hidden**: `boolean`

#### Inherited from

[IoElement](IoElement.md).[hidden](IoElement.md#hidden)

#### Defined in

[src/core/element.ts:270](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L270)

___

### id

 **id**: `string`

#### Inherited from

[IoElement](IoElement.md).[id](IoElement.md#id)

#### Defined in

[src/core/element.ts:267](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L267)

___

### label

 **label**: `string`

#### Inherited from

[IoElement](IoElement.md).[label](IoElement.md#label)

#### Defined in

[src/core/element.ts:258](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L258)

___

### name

 **name**: `string`

#### Inherited from

[IoElement](IoElement.md).[name](IoElement.md#name)

#### Defined in

[src/core/element.ts:261](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L261)

___

### options

 **options**: [`MenuOptions`](MenuOptions.md)

#### Defined in

[src/elements/menus/io-context-menu.ts:15](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-context-menu.ts#L15)

___

### role

 **role**: `string`

#### Inherited from

[IoElement](IoElement.md).[role](IoElement.md#role)

#### Defined in

[src/core/element.ts:255](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L255)

___

### tabindex

 **tabindex**: `string`

#### Inherited from

[IoElement](IoElement.md).[tabindex](IoElement.md#tabindex)

#### Defined in

[src/core/element.ts:246](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L246)

___

### title

 **title**: `string`

#### Inherited from

[IoElement](IoElement.md).[title](IoElement.md#title)

#### Defined in

[src/core/element.ts:264](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L264)

## Accessors

### textNode

`get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoElement.textNode

#### Defined in

[src/core/element.ts:391](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L391)

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

[src/core/element.ts:395](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L395)

___

### Properties

`Static` `get` **Properties**(): `any`

#### Returns

`any`

#### Overrides

IoElement.Properties

#### Defined in

[src/elements/menus/io-context-menu.ts:23](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-context-menu.ts#L23)

___

### Style

`Static` `get` **Style**(): `string`

#### Returns

`string`

#### Inherited from

IoElement.Style

#### Defined in

[src/core/element.ts:226](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L226)

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

[src/core/element.ts:374](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L374)

___

### \_onClick

**_onClick**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `MouseEvent` |

#### Returns

`void`

#### Defined in

[src/elements/menus/io-context-menu.ts:101](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-context-menu.ts#L101)

___

### \_onCollapse

**_onCollapse**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-context-menu.ts:104](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-context-menu.ts#L104)

___

### \_onContextmenu

**_onContextmenu**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `MouseEvent` |

#### Returns

`void`

#### Defined in

[src/elements/menus/io-context-menu.ts:59](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-context-menu.ts#L59)

___

### \_onItemClicked

**_onItemClicked**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`<`any`\> |

#### Returns

`void`

#### Defined in

[src/elements/menus/io-context-menu.ts:50](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-context-menu.ts#L50)

___

### \_onOverlayPointermove

**_onOverlayPointermove**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Defined in

[src/elements/menus/io-context-menu.ts:98](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-context-menu.ts#L98)

___

### \_onPointerdown

**_onPointerdown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Defined in

[src/elements/menus/io-context-menu.ts:62](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-context-menu.ts#L62)

___

### \_onPointermove

**_onPointermove**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Defined in

[src/elements/menus/io-context-menu.ts:83](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-context-menu.ts#L83)

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

[src/elements/menus/io-context-menu.ts:89](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-context-menu.ts#L89)

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

[src/core/node.ts:368](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L368)

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

[src/core/element.ts:399](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L399)

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

[src/core/node.ts:335](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L335)

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

[src/core/node.ts:263](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L263)

___

### connectedCallback

**connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Overrides

[IoElement](IoElement.md).[connectedCallback](IoElement.md#connectedcallback)

#### Defined in

[src/elements/menus/io-context-menu.ts:28](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-context-menu.ts#L28)

___

### disabledChanged

**disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[disabledChanged](IoElement.md#disabledchanged)

#### Defined in

[src/core/element.ts:428](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L428)

___

### disconnectedCallback

**disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Overrides

[IoElement](IoElement.md).[disconnectedCallback](IoElement.md#disconnectedcallback)

#### Defined in

[src/elements/menus/io-context-menu.ts:36](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-context-menu.ts#L36)

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

[src/core/node.ts:393](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L393)

___

### dispatchQueue

**dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[dispatchQueue](IoElement.md#dispatchqueue)

#### Defined in

[src/core/node.ts:277](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L277)

___

### dispatchQueueSync

**dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[dispatchQueueSync](IoElement.md#dispatchqueuesync)

#### Defined in

[src/core/node.ts:287](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L287)

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

[src/core/node.ts:400](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L400)

___

### getBoundingClientRect

**getBoundingClientRect**(): `any`

#### Returns

`any`

#### Defined in

[src/elements/menus/io-context-menu.ts:47](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-context-menu.ts#L47)

___

### init

**init**(): `void`

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[init](IoElement.md#init)

#### Defined in

[src/core/node.ts:264](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L264)

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

[src/core/node.ts:252](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L252)

___

### labelChanged

**labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[labelChanged](IoElement.md#labelchanged)

#### Defined in

[src/core/element.ts:421](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L421)

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

[src/core/node.ts:326](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L326)

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

[src/core/node.ts:305](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L305)

___

### optionsChanged

**optionsChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-context-menu.ts:107](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-context-menu.ts#L107)

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

[src/core/node.ts:271](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L271)

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

[src/core/node.ts:383](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L383)

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

[src/core/element.ts:412](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L412)

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

[src/core/node.ts:234](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L234)

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

[src/core/node.ts:129](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L129)

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

[IoElement](IoElement.md).[template](IoElement.md#template)

#### Defined in

[src/core/element.ts:298](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L298)

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

[src/core/node.ts:296](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L296)

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

[IoElement](IoElement.md).[traverse](IoElement.md#traverse)

#### Defined in

[src/core/element.ts:311](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L311)

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

[src/core/node.ts:352](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L352)
