# Class: IoMenuOptions

It generates a list of `IoMenuItem` elements from `options` property. If `horizontal` property is set, menu items are displayed in horizontal direction.

## Hierarchy

- [`IoElement`](IoElement.md)

  ↳ **`IoMenuOptions`**

## Constructors

### constructor

**new IoMenuOptions**(...`args`)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Inherited from

[IoElement](IoElement.md).[constructor](IoElement.md#constructor)

#### Defined in

[src/core/node.ts:64](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L64)

## Properties

### $

 **$**: `Record`<`string`, `any`\>

#### Inherited from

[IoElement](IoElement.md).[$](IoElement.md#$)

#### Defined in

[src/core/element.ts:232](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L232)

___

### $parent

 `Optional` **$parent**: [`IoMenuItem`](IoMenuItem.md)

#### Defined in

[src/elements/menus/io-menu-options.ts:154](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L154)

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

[src/core/element.ts:241](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L241)

___

### contenteditable

 **contenteditable**: `boolean`

#### Inherited from

[IoElement](IoElement.md).[contenteditable](IoElement.md#contenteditable)

#### Defined in

[src/core/element.ts:238](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L238)

___

### d

 **d**: `boolean` = `true`

#### Inherited from

[IoElement](IoElement.md).[d](IoElement.md#d)

#### Defined in

[src/core/node.ts:59](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L59)

___

### depth

 **depth**: `number`

#### Defined in

[src/elements/menus/io-menu-options.ts:136](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L136)

___

### disabled

 **disabled**: `boolean`

#### Inherited from

[IoElement](IoElement.md).[disabled](IoElement.md#disabled)

#### Defined in

[src/core/element.ts:262](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L262)

___

### expanded

 **expanded**: `boolean`

#### Defined in

[src/elements/menus/io-menu-options.ts:121](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L121)

___

### hidden

 **hidden**: `boolean`

#### Inherited from

[IoElement](IoElement.md).[hidden](IoElement.md#hidden)

#### Defined in

[src/core/element.ts:259](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L259)

___

### horizontal

 **horizontal**: `boolean`

#### Defined in

[src/elements/menus/io-menu-options.ts:124](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L124)

___

### id

 **id**: `string`

#### Inherited from

[IoElement](IoElement.md).[id](IoElement.md#id)

#### Defined in

[src/core/element.ts:256](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L256)

___

### inlayer

 **inlayer**: `boolean`

#### Defined in

[src/elements/menus/io-menu-options.ts:145](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L145)

___

### label

 **label**: `string`

#### Inherited from

[IoElement](IoElement.md).[label](IoElement.md#label)

#### Defined in

[src/core/element.ts:247](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L247)

___

### name

 **name**: `string`

#### Inherited from

[IoElement](IoElement.md).[name](IoElement.md#name)

#### Defined in

[src/core/element.ts:250](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L250)

___

### noPartialCollapse

 **noPartialCollapse**: `boolean`

#### Defined in

[src/elements/menus/io-menu-options.ts:139](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L139)

___

### options

 **options**: [`MenuOptions`](MenuOptions.md)

#### Defined in

[src/elements/menus/io-menu-options.ts:118](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L118)

___

### overflow

 **overflow**: `string`

#### Defined in

[src/elements/menus/io-menu-options.ts:142](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L142)

___

### position

 **position**: [`NudgeDirection`](../README.md#nudgedirection)

#### Defined in

[src/elements/menus/io-menu-options.ts:133](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L133)

___

### role

 **role**: `string`

#### Overrides

[IoElement](IoElement.md).[role](IoElement.md#role)

#### Defined in

[src/elements/menus/io-menu-options.ts:151](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L151)

___

### search

 **search**: `string`

#### Defined in

[src/elements/menus/io-menu-options.ts:130](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L130)

___

### searchable

 **searchable**: `boolean`

#### Defined in

[src/elements/menus/io-menu-options.ts:127](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L127)

___

### slotted

 **slotted**: [`VDOMArray`](../README.md#vdomarray)[]

#### Defined in

[src/elements/menus/io-menu-options.ts:148](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L148)

___

### tabindex

 **tabindex**: `string`

#### Inherited from

[IoElement](IoElement.md).[tabindex](IoElement.md#tabindex)

#### Defined in

[src/core/element.ts:235](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L235)

___

### title

 **title**: `string`

#### Inherited from

[IoElement](IoElement.md).[title](IoElement.md#title)

#### Defined in

[src/core/element.ts:253](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L253)

## Accessors

### textNode

`get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoElement.textNode

#### Defined in

[src/core/element.ts:388](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L388)

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

[src/core/element.ts:392](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L392)

___

### Listeners

`Static` `get` **Listeners**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `item-clicked` | `string` |
| `touchstart` | `string` |

#### Defined in

[src/elements/menus/io-menu-options.ts:159](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L159)

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

[src/elements/menus/io-menu-options.ts:17](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L17)

## Methods

### \_filterOptions

**_filterOptions**(`options`, `search`, `_depth?`, `_chain?`, `_i?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `options` | `any` | `undefined` |
| `search` | `string` | `undefined` |
| `_depth` | `number` | `5` |
| `_chain` | `any`[] | `[]` |
| `_i` | `number` | `0` |

#### Returns

`any`

#### Defined in

[src/elements/menus/io-menu-options.ts:293](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L293)

___

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

[src/core/element.ts:371](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L371)

___

### \_onClipHeight

**_onClipHeight**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-options.ts:273](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L273)

___

### \_onCollapse

**_onCollapse**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-options.ts:233](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L233)

___

### \_onExpandInLayer

**_onExpandInLayer**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-options.ts:260](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L260)

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

[src/elements/menus/io-menu-options.ts:166](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L166)

___

### \_onSetOverflow

**_onSetOverflow**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-options.ts:190](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L190)

___

### \_stopPropagation

**_stopPropagation**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `MouseEvent` |

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-options.ts:179](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L179)

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

[src/core/node.ts:362](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L362)

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

[src/core/element.ts:396](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L396)

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

[src/core/node.ts:331](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L331)

___

### changed

**changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

[IoElement](IoElement.md).[changed](IoElement.md#changed)

#### Defined in

[src/elements/menus/io-menu-options.ts:319](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L319)

___

### connectedCallback

**connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[connectedCallback](IoElement.md#connectedcallback)

#### Defined in

[src/core/element.ts:267](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L267)

___

### disabledChanged

**disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[disabledChanged](IoElement.md#disabledchanged)

#### Defined in

[src/core/element.ts:425](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L425)

___

### disconnectedCallback

**disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[disconnectedCallback](IoElement.md#disconnectedcallback)

#### Defined in

[src/core/element.ts:275](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L275)

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

[src/core/node.ts:387](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L387)

___

### dispatchQueue

**dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[dispatchQueue](IoElement.md#dispatchqueue)

#### Defined in

[src/core/node.ts:273](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L273)

___

### dispatchQueueSync

**dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[dispatchQueueSync](IoElement.md#dispatchqueuesync)

#### Defined in

[src/core/node.ts:283](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L283)

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

[src/core/node.ts:394](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L394)

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

[src/core/element.ts:291](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L291)

___

### expandedChanged

**expandedChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-options.ts:241](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L241)

___

### init

**init**(): `void`

#### Returns

`void`

#### Overrides

[IoElement](IoElement.md).[init](IoElement.md#init)

#### Defined in

[src/elements/menus/io-menu-options.ts:183](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L183)

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

[src/core/node.ts:248](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L248)

___

### labelChanged

**labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[labelChanged](IoElement.md#labelchanged)

#### Defined in

[src/core/element.ts:418](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L418)

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

[src/core/node.ts:322](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L322)

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

[src/core/node.ts:301](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L301)

___

### onResized

**onResized**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-options.ts:186](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L186)

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

[src/core/node.ts:267](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L267)

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

[src/core/node.ts:377](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L377)

___

### searchChanged

**searchChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-options.ts:254](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-options.ts#L254)

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

[src/core/element.ts:409](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L409)

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

[src/core/node.ts:230](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L230)

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

[src/core/node.ts:131](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L131)

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

[src/core/element.ts:285](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L285)

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

[src/core/node.ts:292](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L292)

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

[src/core/element.ts:315](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L315)

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

[src/core/node.ts:346](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L346)
