[io-gui](../README.md) / MenuItem

# Class: MenuItem

IoNodeMixin applied to `Object` class.

## Hierarchy

- [`IoNode`](IoNode.md)

  ↳ **`MenuItem`**

## Table of contents

### Constructors

- [constructor](MenuItem.md#constructor)

### Properties

- [\_bindings](MenuItem.md#_bindings)
- [\_changeQueue](MenuItem.md#_changequeue)
- [\_eventDispatcher](MenuItem.md#_eventdispatcher)
- [\_properties](MenuItem.md#_properties)
- [\_protochain](MenuItem.md#_protochain)
- [action](MenuItem.md#action)
- [disabled](MenuItem.md#disabled)
- [hidden](MenuItem.md#hidden)
- [hint](MenuItem.md#hint)
- [icon](MenuItem.md#icon)
- [label](MenuItem.md#label)
- [mode](MenuItem.md#mode)
- [options](MenuItem.md#options)
- [selected](MenuItem.md#selected)
- [value](MenuItem.md#value)

### Accessors

- [hasmore](MenuItem.md#hasmore)
- [Properties](MenuItem.md#properties)

### Methods

- [Register](MenuItem.md#register)
- [\_onOptionsPathChanged](MenuItem.md#_onoptionspathchanged)
- [\_onSubItemSelected](MenuItem.md#_onsubitemselected)
- [addEventListener](MenuItem.md#addeventlistener)
- [applyProperties](MenuItem.md#applyproperties)
- [bind](MenuItem.md#bind)
- [changed](MenuItem.md#changed)
- [dispatchEvent](MenuItem.md#dispatchevent)
- [dispatchMutationEvent](MenuItem.md#dispatchmutationevent)
- [dispatchQueue](MenuItem.md#dispatchqueue)
- [dispatchQueueSync](MenuItem.md#dispatchqueuesync)
- [dispose](MenuItem.md#dispose)
- [getSubitem](MenuItem.md#getsubitem)
- [init](MenuItem.md#init)
- [inputValue](MenuItem.md#inputvalue)
- [objectMutated](MenuItem.md#objectmutated)
- [onObjectMutated](MenuItem.md#onobjectmutated)
- [optionsChanged](MenuItem.md#optionschanged)
- [queue](MenuItem.md#queue)
- [removeEventListener](MenuItem.md#removeeventlistener)
- [selectedChanged](MenuItem.md#selectedchanged)
- [setProperties](MenuItem.md#setproperties)
- [setProperty](MenuItem.md#setproperty)
- [throttle](MenuItem.md#throttle)
- [toJSON](MenuItem.md#tojson)
- [unbind](MenuItem.md#unbind)

## Constructors

### constructor

• **new MenuItem**(`args?`): [`MenuItem`](MenuItem.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `args?` | [`MenuItemArgsLoose`](../README.md#menuitemargsloose) |

#### Returns

[`MenuItem`](MenuItem.md)

#### Overrides

[IoNode](IoNode.md).[constructor](IoNode.md#constructor)

#### Defined in

[src/elements/menus/models/menu-item.ts:65](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L65)

## Properties

### \_bindings

• `Readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoNode](IoNode.md).[_bindings](IoNode.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoNode](IoNode.md).[_changeQueue](IoNode.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoNode](IoNode.md).[_eventDispatcher](IoNode.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

___

### \_properties

• `Readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoNode](IoNode.md).[_properties](IoNode.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoNode](IoNode.md).[_protochain](IoNode.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

___

### action

• `Optional` **action**: (`value?`: `any`) => `void`

#### Type declaration

▸ (`value?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value?` | `any` |

##### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-item.ts:46](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L46)

___

### disabled

• **disabled**: `boolean`

#### Defined in

[src/elements/menus/models/menu-item.ts:43](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L43)

___

### hidden

• **hidden**: `boolean`

#### Defined in

[src/elements/menus/models/menu-item.ts:40](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L40)

___

### hint

• **hint**: `string`

#### Defined in

[src/elements/menus/models/menu-item.ts:37](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L37)

___

### icon

• **icon**: `string`

#### Defined in

[src/elements/menus/models/menu-item.ts:34](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L34)

___

### label

• **label**: `string`

#### Defined in

[src/elements/menus/models/menu-item.ts:31](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L31)

___

### mode

• **mode**: [`MenuItemSelectType`](../README.md#menuitemselecttype)

#### Defined in

[src/elements/menus/models/menu-item.ts:49](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L49)

___

### options

• `Optional` **options**: [`MenuOptions`](MenuOptions.md)

#### Defined in

[src/elements/menus/models/menu-item.ts:55](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L55)

___

### selected

• **selected**: `boolean`

#### Defined in

[src/elements/menus/models/menu-item.ts:52](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L52)

___

### value

• **value**: `any`

#### Defined in

[src/elements/menus/models/menu-item.ts:28](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L28)

## Accessors

### hasmore

• `get` **hasmore**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/elements/menus/models/menu-item.ts:57](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L57)

___

### Properties

• `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoNode.Properties

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

[IoNode](IoNode.md).[Register](IoNode.md#register)

#### Defined in

[src/core/node.ts:426](https://github.com/io-gui/io/blob/main/src/core/node.ts#L426)

___

### \_onOptionsPathChanged

▸ **_onOptionsPathChanged**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`\<`any`\> |

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-item.ts:148](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L148)

___

### \_onSubItemSelected

▸ **_onSubItemSelected**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-item.ts:144](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L144)

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

[IoNode](IoNode.md).[addEventListener](IoNode.md#addeventlistener)

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

[IoNode](IoNode.md).[applyProperties](IoNode.md#applyproperties)

#### Defined in

[src/core/node.ts:194](https://github.com/io-gui/io/blob/main/src/core/node.ts#L194)

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

[IoNode](IoNode.md).[bind](IoNode.md#bind)

#### Defined in

[src/core/node.ts:319](https://github.com/io-gui/io/blob/main/src/core/node.ts#L319)

___

### changed

▸ **changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

[IoNode](IoNode.md).[changed](IoNode.md#changed)

#### Defined in

[src/elements/menus/models/menu-item.ts:170](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L170)

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

[IoNode](IoNode.md).[dispatchEvent](IoNode.md#dispatchevent)

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

[IoNode](IoNode.md).[dispatchMutationEvent](IoNode.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:384](https://github.com/io-gui/io/blob/main/src/core/node.ts#L384)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[dispatchQueue](IoNode.md#dispatchqueue)

#### Defined in

[src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[dispatchQueueSync](IoNode.md#dispatchqueuesync)

#### Defined in

[src/core/node.ts:269](https://github.com/io-gui/io/blob/main/src/core/node.ts#L269)

___

### dispose

▸ **dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Overrides

[IoNode](IoNode.md).[dispose](IoNode.md#dispose)

#### Defined in

[src/elements/menus/models/menu-item.ts:174](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L174)

___

### getSubitem

▸ **getSubitem**(`value`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`any`

#### Defined in

[src/elements/menus/models/menu-item.ts:61](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L61)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[init](IoNode.md#init)

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

[IoNode](IoNode.md).[inputValue](IoNode.md#inputvalue)

#### Defined in

[src/core/node.ts:234](https://github.com/io-gui/io/blob/main/src/core/node.ts#L234)

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

[IoNode](IoNode.md).[objectMutated](IoNode.md#objectmutated)

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

[IoNode](IoNode.md).[onObjectMutated](IoNode.md#onobjectmutated)

#### Defined in

[src/core/node.ts:287](https://github.com/io-gui/io/blob/main/src/core/node.ts#L287)

___

### optionsChanged

▸ **optionsChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-item.ts:152](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L152)

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

[IoNode](IoNode.md).[queue](IoNode.md#queue)

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

[IoNode](IoNode.md).[removeEventListener](IoNode.md#removeeventlistener)

#### Defined in

[src/core/node.ts:367](https://github.com/io-gui/io/blob/main/src/core/node.ts#L367)

___

### selectedChanged

▸ **selectedChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-item.ts:159](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L159)

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

[IoNode](IoNode.md).[setProperties](IoNode.md#setproperties)

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

[IoNode](IoNode.md).[setProperty](IoNode.md#setproperty)

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

[IoNode](IoNode.md).[throttle](IoNode.md#throttle)

#### Defined in

[src/core/node.ts:278](https://github.com/io-gui/io/blob/main/src/core/node.ts#L278)

___

### toJSON

▸ **toJSON**(): `Record`\<`string`, `any`\>

#### Returns

`Record`\<`string`, `any`\>

#### Defined in

[src/elements/menus/models/menu-item.ts:131](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L131)

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

[IoNode](IoNode.md).[unbind](IoNode.md#unbind)

#### Defined in

[src/core/node.ts:336](https://github.com/io-gui/io/blob/main/src/core/node.ts#L336)
