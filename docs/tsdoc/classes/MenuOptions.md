[io-gui](../README.md) / MenuOptions

# Class: MenuOptions

## Hierarchy

- `__class`\<`ArrayConstructor`, `this`\>

  ↳ **`MenuOptions`**

## Table of contents

### Constructors

- [constructor](MenuOptions.md#constructor)

### Properties

- [\_bindings](MenuOptions.md#_bindings)
- [\_changeQueue](MenuOptions.md#_changequeue)
- [\_eventDispatcher](MenuOptions.md#_eventdispatcher)
- [\_properties](MenuOptions.md#_properties)
- [\_protochain](MenuOptions.md#_protochain)
- [delimiter](MenuOptions.md#delimiter)
- [first](MenuOptions.md#first)
- [last](MenuOptions.md#last)
- [path](MenuOptions.md#path)
- [scroll](MenuOptions.md#scroll)

### Accessors

- [Properties](MenuOptions.md#properties)

### Methods

- [Register](MenuOptions.md#register)
- [\_onItemSelectedChanged](MenuOptions.md#_onitemselectedchanged)
- [\_onSubOptionsPathChanged](MenuOptions.md#_onsuboptionspathchanged)
- [addEventListener](MenuOptions.md#addeventlistener)
- [applyProperties](MenuOptions.md#applyproperties)
- [bind](MenuOptions.md#bind)
- [changed](MenuOptions.md#changed)
- [dispatchEvent](MenuOptions.md#dispatchevent)
- [dispatchMutationEvent](MenuOptions.md#dispatchmutationevent)
- [dispatchQueue](MenuOptions.md#dispatchqueue)
- [dispatchQueueSync](MenuOptions.md#dispatchqueuesync)
- [dispose](MenuOptions.md#dispose)
- [firstChanged](MenuOptions.md#firstchanged)
- [getItem](MenuOptions.md#getitem)
- [init](MenuOptions.md#init)
- [inputValue](MenuOptions.md#inputvalue)
- [lastChanged](MenuOptions.md#lastchanged)
- [objectMutated](MenuOptions.md#objectmutated)
- [onObjectMutated](MenuOptions.md#onobjectmutated)
- [pathChanged](MenuOptions.md#pathchanged)
- [push](MenuOptions.md#push)
- [queue](MenuOptions.md#queue)
- [removeEventListener](MenuOptions.md#removeeventlistener)
- [selectDefault](MenuOptions.md#selectdefault)
- [setProperties](MenuOptions.md#setproperties)
- [setProperty](MenuOptions.md#setproperty)
- [throttle](MenuOptions.md#throttle)
- [unbind](MenuOptions.md#unbind)
- [updatePaths](MenuOptions.md#updatepaths)

## Constructors

### constructor

• **new MenuOptions**(`args?`, `properties?`): [`MenuOptions`](MenuOptions.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `args` | [`MenuItemArgsLoose`](../README.md#menuitemargsloose)[] | `[]` |
| `properties` | [`IoNodeArgs`](../README.md#ionodeargs) | `{}` |

#### Returns

[`MenuOptions`](MenuOptions.md)

#### Overrides

IoNodeMixin(Array).constructor

#### Defined in

[src/elements/menus/models/menu-options.ts:65](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L65)

## Properties

### \_bindings

• `Readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

IoNodeMixin(Array).\_bindings

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

IoNodeMixin(Array).\_changeQueue

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

IoNodeMixin(Array).\_eventDispatcher

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

___

### \_properties

• `Readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

IoNodeMixin(Array).\_properties

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

IoNodeMixin(Array).\_protochain

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

___

### delimiter

• **delimiter**: `string`

#### Defined in

[src/elements/menus/models/menu-options.ts:31](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L31)

___

### first

• **first**: `any`

#### Defined in

[src/elements/menus/models/menu-options.ts:19](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L19)

___

### last

• **last**: `any`

#### Defined in

[src/elements/menus/models/menu-options.ts:22](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L22)

___

### path

• **path**: `string`

#### Defined in

[src/elements/menus/models/menu-options.ts:28](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L28)

___

### scroll

• **scroll**: `any`

#### Defined in

[src/elements/menus/models/menu-options.ts:25](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L25)

## Accessors

### Properties

• `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoNodeMixin(Array).Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

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

IoNodeMixin(Array).Register

#### Defined in

[src/core/node.ts:426](https://github.com/io-gui/io/blob/main/src/core/node.ts#L426)

___

### \_onItemSelectedChanged

▸ **_onItemSelectedChanged**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`\<`any`\> |

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:227](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L227)

___

### \_onSubOptionsPathChanged

▸ **_onSubOptionsPathChanged**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`\<`any`\> |

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:244](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L244)

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

IoNodeMixin(Array).addEventListener

#### Defined in

[src/core/node.ts:352](https://github.com/io-gui/io/blob/main/src/core/node.ts#L352)

___

### applyProperties

▸ **applyProperties**(`props`): `void`

Sets multiple properties in batch.
[property]-changed` events will be broadcast in the end.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `any` | Map of property names and values. |

#### Returns

`void`

#### Inherited from

IoNodeMixin(Array).applyProperties

#### Defined in

[src/core/node.ts:194](https://github.com/io-gui/io/blob/main/src/core/node.ts#L194)

___

### bind

▸ **bind**(`prop`): [`Binding`](Binding.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `prop` | `string` |

#### Returns

[`Binding`](Binding.md)

#### Overrides

IoNodeMixin(Array).bind

#### Defined in

[src/elements/menus/models/menu-options.ts:264](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L264)

___

### changed

▸ **changed**(): `void`

#### Returns

`void`

#### Overrides

IoNodeMixin(Array).changed

#### Defined in

[src/elements/menus/models/menu-options.ts:281](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L281)

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

IoNodeMixin(Array).dispatchEvent

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

IoNodeMixin(Array).dispatchMutationEvent

#### Defined in

[src/core/node.ts:384](https://github.com/io-gui/io/blob/main/src/core/node.ts#L384)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

IoNodeMixin(Array).dispatchQueue

#### Defined in

[src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

IoNodeMixin(Array).dispatchQueueSync

#### Defined in

[src/core/node.ts:269](https://github.com/io-gui/io/blob/main/src/core/node.ts#L269)

___

### dispose

▸ **dispose**(): `void`

#### Returns

`void`

#### Overrides

IoNodeMixin(Array).dispose

#### Defined in

[src/elements/menus/models/menu-options.ts:273](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L273)

___

### firstChanged

▸ **firstChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:151](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L151)

___

### getItem

▸ **getItem**(`value`, `deep?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `value` | `any` | `undefined` |
| `deep` | `boolean` | `false` |

#### Returns

`any`

#### Defined in

[src/elements/menus/models/menu-options.ts:54](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L54)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Inherited from

IoNodeMixin(Array).init

#### Defined in

[src/core/node.ts:246](https://github.com/io-gui/io/blob/main/src/core/node.ts#L246)

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

IoNodeMixin(Array).inputValue

#### Defined in

[src/core/node.ts:234](https://github.com/io-gui/io/blob/main/src/core/node.ts#L234)

___

### lastChanged

▸ **lastChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:169](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L169)

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

IoNodeMixin(Array).objectMutated

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

IoNodeMixin(Array).onObjectMutated

#### Defined in

[src/core/node.ts:287](https://github.com/io-gui/io/blob/main/src/core/node.ts#L287)

___

### pathChanged

▸ **pathChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:119](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L119)

___

### push

▸ **push**(`...items`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...items` | [`MenuItem`](MenuItem.md)[] |

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:33](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L33)

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

IoNodeMixin(Array).queue

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

IoNodeMixin(Array).removeEventListener

#### Defined in

[src/core/node.ts:367](https://github.com/io-gui/io/blob/main/src/core/node.ts#L367)

___

### selectDefault

▸ **selectDefault**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/elements/menus/models/menu-options.ts:249](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L249)

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

IoNodeMixin(Array).setProperties

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

IoNodeMixin(Array).setProperty

#### Defined in

[src/core/node.ts:121](https://github.com/io-gui/io/blob/main/src/core/node.ts#L121)

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

IoNodeMixin(Array).throttle

#### Defined in

[src/core/node.ts:278](https://github.com/io-gui/io/blob/main/src/core/node.ts#L278)

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

IoNodeMixin(Array).unbind

#### Defined in

[src/core/node.ts:336](https://github.com/io-gui/io/blob/main/src/core/node.ts#L336)

___

### updatePaths

▸ **updatePaths**(`item?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item?` | [`MenuItem`](MenuItem.md) |

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:199](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L199)
