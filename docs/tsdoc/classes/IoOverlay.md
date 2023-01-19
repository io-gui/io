# Class: IoOverlay

This element is designed to be used as a singleton `IoOverlaySingleton`.
It is a pointer-blocking element covering the entire window at a very high z-index.
It is designed to be displayed on top all other elements and contain elements like modals, popovers, floating menus etc.
When clicked, IoOverlay collapses all child elements by setting their `expanded` property to `false`.
Child elements should emmit bubbling `"expanded"` event when expanded/collapsed.

## Hierarchy

- [`IoElement`](IoElement.md)

  ↳ **`IoOverlay`**

## Constructors

### constructor

**new IoOverlay**(`properties?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | `Record`<`string`, `any`\> |

#### Overrides

[IoElement](IoElement.md).[constructor](IoElement.md#constructor)

#### Defined in

[src/core/overlay.ts:83](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L83)

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

[src/core/overlay.ts:62](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L62)

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
| `pointerdown` | `string` |
| `pointermove` | `string` |
| `pointerup` | `string` |
| `scroll` | `string` |
| `touchend` | `string` |
| `touchmove` | (`string` \| { `passive`: `boolean` = false })[] |
| `touchstart` | (`string` \| { `passive`: `boolean` = false })[] |
| `wheel` | (`string` \| { `passive`: `boolean` = false })[] |

#### Defined in

[src/core/overlay.ts:64](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L64)

___

### Properties

`Static` `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoElement.Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L44)

___

### Style

`Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoElement.Style

#### Defined in

[src/core/overlay.ts:29](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L29)

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

### \_onCollapse

**_onCollapse**(): `void`

#### Returns

`void`

#### Defined in

[src/core/overlay.ts:99](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L99)

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

[src/core/overlay.ts:102](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L102)

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

[src/core/overlay.ts:105](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L105)

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

[src/core/overlay.ts:94](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L94)

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

[src/core/overlay.ts:108](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L108)

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

### appendChild

**appendChild**(`child`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `child` | `HTMLElement` |

#### Returns

`void`

#### Defined in

[src/core/overlay.ts:204](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L204)

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

#### Inherited from

[IoElement](IoElement.md).[connectedCallback](IoElement.md#connectedcallback)

#### Defined in

[src/core/element.ts:278](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L278)

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

#### Inherited from

[IoElement](IoElement.md).[disconnectedCallback](IoElement.md#disconnectedcallback)

#### Defined in

[src/core/element.ts:286](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L286)

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

### expandedChanged

**expandedChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/core/overlay.ts:226](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L226)

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

[src/core/overlay.ts:113](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L113)

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

[src/core/overlay.ts:145](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L145)

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

[src/core/overlay.ts:155](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L155)

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

[src/core/overlay.ts:135](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L135)

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

[src/core/overlay.ts:124](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L124)

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

### onChildExpanded

**onChildExpanded**(): `void`

#### Returns

`void`

#### Defined in

[src/core/overlay.ts:214](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L214)

___

### onChildExpandedDelayed

**onChildExpandedDelayed**(): `void`

#### Returns

`void`

#### Defined in

[src/core/overlay.ts:217](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L217)

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

### onResized

**onResized**(): `void`

#### Returns

`void`

#### Defined in

[src/core/overlay.ts:91](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L91)

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

### removeChild

**removeChild**(`child`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `child` | `HTMLElement` |

#### Returns

`void`

#### Defined in

[src/core/overlay.ts:209](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L209)

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

### setElementPosition

**setElementPosition**(`element`, `direction`, `srcRect`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `HTMLElement` |
| `direction` | [`NudgeDirection`](../README.md#nudgedirection) |
| `srcRect` | `DOMRect` |

#### Returns

`void`

#### Defined in

[src/core/overlay.ts:160](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L160)

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

### stopPropagation

**stopPropagation**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Event` |

#### Returns

`void`

#### Defined in

[src/core/overlay.ts:88](https://github.com/io-gui/iogui/blob/main/src/core/overlay.ts#L88)

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