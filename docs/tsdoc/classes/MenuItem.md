# Class: MenuItem

IoNodeMixin applied to `Object` class.

## Hierarchy

- [`IoNode`](IoNode.md)

  ↳ **`MenuItem`**

## Constructors

### constructor

**new MenuItem**(`option`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | `any` |

#### Overrides

[IoNode](IoNode.md).[constructor](IoNode.md#constructor)

#### Defined in

[src/elements/menus/models/menu-item.ts:48](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L48)

## Properties

### \_bindings

 `Readonly` **\_bindings**: `Map`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoNode](IoNode.md).[_bindings](IoNode.md#_bindings)

#### Defined in

[src/core/node.ts:48](https://github.com/io-gui/io/blob/main/src/core/node.ts#L48)

___

### \_changeQueue

 `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoNode](IoNode.md).[_changeQueue](IoNode.md#_changequeue)

#### Defined in

[src/core/node.ts:49](https://github.com/io-gui/io/blob/main/src/core/node.ts#L49)

___

### \_eventDispatcher

 `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoNode](IoNode.md).[_eventDispatcher](IoNode.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:50](https://github.com/io-gui/io/blob/main/src/core/node.ts#L50)

___

### \_properties

 `Readonly` **\_properties**: `Map`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoNode](IoNode.md).[_properties](IoNode.md#_properties)

#### Defined in

[src/core/node.ts:47](https://github.com/io-gui/io/blob/main/src/core/node.ts#L47)

___

### \_protochain

 `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoNode](IoNode.md).[_protochain](IoNode.md#_protochain)

#### Defined in

[src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

___

### action

 **action**: () => `undefined` \| `void`

#### Type declaration

(): `undefined` \| `void`

##### Returns

`undefined` \| `void`

#### Defined in

[src/elements/menus/models/menu-item.ts:25](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L25)

___

### hint

 **hint**: `string`

#### Defined in

[src/elements/menus/models/menu-item.ts:22](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L22)

___

### icon

 **icon**: `string`

#### Defined in

[src/elements/menus/models/menu-item.ts:19](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L19)

___

### label

 **label**: `string`

#### Defined in

[src/elements/menus/models/menu-item.ts:16](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L16)

___

### options

 **options**: [`MenuOptions`](MenuOptions.md)

#### Defined in

[src/elements/menus/models/menu-item.ts:34](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L34)

___

### select

 **select**: ``"none"`` \| ``"toggle"`` \| ``"pick"``

#### Defined in

[src/elements/menus/models/menu-item.ts:28](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L28)

___

### selected

 **selected**: `boolean`

#### Defined in

[src/elements/menus/models/menu-item.ts:31](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L31)

___

### value

 **value**: `any`

#### Defined in

[src/elements/menus/models/menu-item.ts:13](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L13)

## Accessors

### hasmore

`get` **hasmore**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/elements/menus/models/menu-item.ts:40](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L40)

___

### path

`get` **path**(): [`MenuPath`](MenuPath.md)

#### Returns

[`MenuPath`](MenuPath.md)

#### Defined in

[src/elements/menus/models/menu-item.ts:36](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L36)

___

### Properties

`Static` `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoNode.Properties

#### Defined in

[src/core/node.ts:37](https://github.com/io-gui/io/blob/main/src/core/node.ts#L37)

## Methods

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

[src/core/node.ts:337](https://github.com/io-gui/io/blob/main/src/core/node.ts#L337)

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

[src/core/node.ts:185](https://github.com/io-gui/io/blob/main/src/core/node.ts#L185)

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

[src/core/node.ts:306](https://github.com/io-gui/io/blob/main/src/core/node.ts#L306)

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

[src/elements/menus/models/menu-item.ts:103](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L103)

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

[src/core/node.ts:362](https://github.com/io-gui/io/blob/main/src/core/node.ts#L362)

___

### dispatchQueue

**dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[dispatchQueue](IoNode.md#dispatchqueue)

#### Defined in

[src/core/node.ts:248](https://github.com/io-gui/io/blob/main/src/core/node.ts#L248)

___

### dispatchQueueSync

**dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[dispatchQueueSync](IoNode.md#dispatchqueuesync)

#### Defined in

[src/core/node.ts:258](https://github.com/io-gui/io/blob/main/src/core/node.ts#L258)

___

### dispose

**dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[dispose](IoNode.md#dispose)

#### Defined in

[src/core/node.ts:369](https://github.com/io-gui/io/blob/main/src/core/node.ts#L369)

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

[src/elements/menus/models/menu-item.ts:44](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L44)

___

### init

**init**(): `void`

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[init](IoNode.md#init)

#### Defined in

[src/core/node.ts:235](https://github.com/io-gui/io/blob/main/src/core/node.ts#L235)

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

[src/core/node.ts:223](https://github.com/io-gui/io/blob/main/src/core/node.ts#L223)

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

[src/core/node.ts:297](https://github.com/io-gui/io/blob/main/src/core/node.ts#L297)

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

[src/core/node.ts:276](https://github.com/io-gui/io/blob/main/src/core/node.ts#L276)

___

### onOptionsSelectedPathChanged

**onOptionsSelectedPathChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-item.ts:81](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L81)

___

### optionsChanged

**optionsChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-item.ts:86](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L86)

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

[src/core/node.ts:242](https://github.com/io-gui/io/blob/main/src/core/node.ts#L242)

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

[src/core/node.ts:352](https://github.com/io-gui/io/blob/main/src/core/node.ts#L352)

___

### selectedChanged

**selectedChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-item.ts:90](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L90)

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

[src/core/node.ts:206](https://github.com/io-gui/io/blob/main/src/core/node.ts#L206)

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

[src/core/node.ts:109](https://github.com/io-gui/io/blob/main/src/core/node.ts#L109)

___

### setSelectedPath

**setSelectedPath**(`selected`, `path?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `selected` | `any` | `undefined` |
| `path` | `any`[] | `[]` |

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-item.ts:98](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L98)

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

[src/core/node.ts:267](https://github.com/io-gui/io/blob/main/src/core/node.ts#L267)

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

[src/core/node.ts:321](https://github.com/io-gui/io/blob/main/src/core/node.ts#L321)
