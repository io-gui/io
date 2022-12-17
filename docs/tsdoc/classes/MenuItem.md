# Class: MenuItem

IoNodeMixin applied to `Object` class.

## Hierarchy

- [`IoNode`](IoNode.md)

  ↳ **`MenuItem`**

## Constructors

### constructor

**new MenuItem**(`args?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `args?` | [`MenuItemArgsWeak`](../README.md#menuitemargsweak) |

#### Overrides

[IoNode](IoNode.md).[constructor](IoNode.md#constructor)

#### Defined in

[src/elements/menus/models/menu-item.ts:60](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L60)

## Properties

### \_bindings

 `Readonly` **\_bindings**: `Map`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoNode](IoNode.md).[_bindings](IoNode.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

 `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoNode](IoNode.md).[_changeQueue](IoNode.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

 `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoNode](IoNode.md).[_eventDispatcher](IoNode.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

___

### \_properties

 `Readonly` **\_properties**: `Map`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoNode](IoNode.md).[_properties](IoNode.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

___

### \_protochain

 `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoNode](IoNode.md).[_protochain](IoNode.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

___

### action

 `Optional` **action**: (`value?`: `any`) => `void`

#### Type declaration

(`value?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value?` | `any` |

##### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-item.ts:41](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L41)

___

### disabled

 **disabled**: `boolean`

#### Defined in

[src/elements/menus/models/menu-item.ts:38](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L38)

___

### hint

 **hint**: `string`

#### Defined in

[src/elements/menus/models/menu-item.ts:35](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L35)

___

### icon

 **icon**: `string`

#### Defined in

[src/elements/menus/models/menu-item.ts:32](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L32)

___

### label

 **label**: `string`

#### Defined in

[src/elements/menus/models/menu-item.ts:29](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L29)

___

### mode

 **mode**: [`MenuItemSelectType`](../README.md#menuitemselecttype)

#### Defined in

[src/elements/menus/models/menu-item.ts:44](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L44)

___

### options

 `Optional` **options**: [`MenuOptions`](MenuOptions.md)

#### Defined in

[src/elements/menus/models/menu-item.ts:50](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L50)

___

### selected

 **selected**: `boolean`

#### Defined in

[src/elements/menus/models/menu-item.ts:47](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L47)

___

### value

 **value**: `any`

#### Defined in

[src/elements/menus/models/menu-item.ts:26](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L26)

## Accessors

### hasmore

`get` **hasmore**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/elements/menus/models/menu-item.ts:52](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L52)

___

### Properties

`Static` `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoNode.Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

## Methods

### \_onOptionsPathChanged

**_onOptionsPathChanged**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`<`any`\> |

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-item.ts:141](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L141)

___

### \_onSubItemSelected

**_onSubItemSelected**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-item.ts:137](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L137)

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

[IoNode](IoNode.md).[addEventListener](IoNode.md#addeventlistener)

#### Defined in

[src/core/node.ts:361](https://github.com/io-gui/io/blob/main/src/core/node.ts#L361)

___

### applyProperties

**applyProperties**(`props`): `void`

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

[src/core/node.ts:207](https://github.com/io-gui/io/blob/main/src/core/node.ts#L207)

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

[IoNode](IoNode.md).[bind](IoNode.md#bind)

#### Defined in

[src/core/node.ts:330](https://github.com/io-gui/io/blob/main/src/core/node.ts#L330)

___

### changed

**changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

[IoNode](IoNode.md).[changed](IoNode.md#changed)

#### Defined in

[src/elements/menus/models/menu-item.ts:163](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L163)

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

[IoNode](IoNode.md).[dispatchEvent](IoNode.md#dispatchevent)

#### Defined in

[src/core/node.ts:386](https://github.com/io-gui/io/blob/main/src/core/node.ts#L386)

___

### dispatchQueue

**dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[dispatchQueue](IoNode.md#dispatchqueue)

#### Defined in

[src/core/node.ts:272](https://github.com/io-gui/io/blob/main/src/core/node.ts#L272)

___

### dispatchQueueSync

**dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[dispatchQueueSync](IoNode.md#dispatchqueuesync)

#### Defined in

[src/core/node.ts:282](https://github.com/io-gui/io/blob/main/src/core/node.ts#L282)

___

### dispose

**dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Overrides

[IoNode](IoNode.md).[dispose](IoNode.md#dispose)

#### Defined in

[src/elements/menus/models/menu-item.ts:167](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L167)

___

### getSubitem

**getSubitem**(`value`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`any`

#### Defined in

[src/elements/menus/models/menu-item.ts:56](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L56)

___

### init

**init**(): `void`

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[init](IoNode.md#init)

#### Defined in

[src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

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

[IoNode](IoNode.md).[inputValue](IoNode.md#inputvalue)

#### Defined in

[src/core/node.ts:247](https://github.com/io-gui/io/blob/main/src/core/node.ts#L247)

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

[IoNode](IoNode.md).[objectMutated](IoNode.md#objectmutated)

#### Defined in

[src/core/node.ts:321](https://github.com/io-gui/io/blob/main/src/core/node.ts#L321)

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

[IoNode](IoNode.md).[onObjectMutated](IoNode.md#onobjectmutated)

#### Defined in

[src/core/node.ts:300](https://github.com/io-gui/io/blob/main/src/core/node.ts#L300)

___

### optionsChanged

**optionsChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-item.ts:145](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L145)

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

[IoNode](IoNode.md).[queue](IoNode.md#queue)

#### Defined in

[src/core/node.ts:266](https://github.com/io-gui/io/blob/main/src/core/node.ts#L266)

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

[IoNode](IoNode.md).[removeEventListener](IoNode.md#removeeventlistener)

#### Defined in

[src/core/node.ts:376](https://github.com/io-gui/io/blob/main/src/core/node.ts#L376)

___

### selectedChanged

**selectedChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-item.ts:152](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L152)

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

[IoNode](IoNode.md).[setProperties](IoNode.md#setproperties)

#### Defined in

[src/core/node.ts:229](https://github.com/io-gui/io/blob/main/src/core/node.ts#L229)

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

[IoNode](IoNode.md).[setProperty](IoNode.md#setproperty)

#### Defined in

[src/core/node.ts:129](https://github.com/io-gui/io/blob/main/src/core/node.ts#L129)

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

[IoNode](IoNode.md).[throttle](IoNode.md#throttle)

#### Defined in

[src/core/node.ts:291](https://github.com/io-gui/io/blob/main/src/core/node.ts#L291)

___

### toJSON

**toJSON**(): `Record`<`string`, `any`\>

#### Returns

`Record`<`string`, `any`\>

#### Defined in

[src/elements/menus/models/menu-item.ts:125](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L125)

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

[IoNode](IoNode.md).[unbind](IoNode.md#unbind)

#### Defined in

[src/core/node.ts:345](https://github.com/io-gui/io/blob/main/src/core/node.ts#L345)
