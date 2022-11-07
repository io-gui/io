# Class: Path

IoNodeMixin applied to `Object` class.

## Hierarchy

- [`IoNode`](IoNode.md)

  ↳ **`Path`**

## Constructors

### constructor

**new Path**(...`args`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Overrides

[IoNode](IoNode.md).[constructor](IoNode.md#constructor)

#### Defined in

[src/models/path.ts:14](https://github.com/io-gui/io/blob/main/src/models/path.ts#L14)

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

## Accessors

### Properties

`Static` `get` **Properties**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `delimiter` | `string` |
| `leaf` | ``null`` |
| `root` | ``null`` |
| `string` | `StringConstructor` |
| `value` | `ArrayConstructor` |

#### Overrides

IoNode.Properties

#### Defined in

[src/models/path.ts:5](https://github.com/io-gui/io/blob/main/src/models/path.ts#L5)

## Methods

### addEventListener

**addEventListener**(`type`, `listener`, `options?`): `void`

Wrapper for addEventListener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | listener name. |
| `listener` | [`AnyEventListener`](../none#anyeventlistener) | listener handler. |
| `options?` | `AddEventListenerOptions` | event listener options. |

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[addEventListener](IoNode.md#addeventlistener)

#### Defined in

[src/core/node.ts:319](https://github.com/io-gui/io/blob/main/src/core/node.ts#L319)

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

[src/core/node.ts:167](https://github.com/io-gui/io/blob/main/src/core/node.ts#L167)

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

[src/core/node.ts:288](https://github.com/io-gui/io/blob/main/src/core/node.ts#L288)

___

### changed

**changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[changed](IoNode.md#changed)

#### Defined in

[src/core/node.ts:216](https://github.com/io-gui/io/blob/main/src/core/node.ts#L216)

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

[src/core/node.ts:344](https://github.com/io-gui/io/blob/main/src/core/node.ts#L344)

___

### dispatchQueue

**dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[dispatchQueue](IoNode.md#dispatchqueue)

#### Defined in

[src/core/node.ts:230](https://github.com/io-gui/io/blob/main/src/core/node.ts#L230)

___

### dispatchQueueSync

**dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[dispatchQueueSync](IoNode.md#dispatchqueuesync)

#### Defined in

[src/core/node.ts:240](https://github.com/io-gui/io/blob/main/src/core/node.ts#L240)

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

[src/core/node.ts:351](https://github.com/io-gui/io/blob/main/src/core/node.ts#L351)

___

### init

**init**(): `void`

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[init](IoNode.md#init)

#### Defined in

[src/core/node.ts:217](https://github.com/io-gui/io/blob/main/src/core/node.ts#L217)

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

[src/core/node.ts:205](https://github.com/io-gui/io/blob/main/src/core/node.ts#L205)

___

### leafChanged

**leafChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/models/path.ts:66](https://github.com/io-gui/io/blob/main/src/models/path.ts#L66)

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

[src/core/node.ts:279](https://github.com/io-gui/io/blob/main/src/core/node.ts#L279)

___

### onMutation

**onMutation**(): `void`

#### Returns

`void`

#### Defined in

[src/models/path.ts:33](https://github.com/io-gui/io/blob/main/src/models/path.ts#L33)

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

[src/core/node.ts:258](https://github.com/io-gui/io/blob/main/src/core/node.ts#L258)

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

[src/core/node.ts:224](https://github.com/io-gui/io/blob/main/src/core/node.ts#L224)

___

### removeEventListener

**removeEventListener**(`type`, `listener?`, `options?`): `void`

Wrapper for removeEventListener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | event name to listen to. |
| `listener?` | [`AnyEventListener`](../none#anyeventlistener) | listener handler. |
| `options?` | `AddEventListenerOptions` | event listener options. |

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[removeEventListener](IoNode.md#removeeventlistener)

#### Defined in

[src/core/node.ts:334](https://github.com/io-gui/io/blob/main/src/core/node.ts#L334)

___

### rootChanged

**rootChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/models/path.ts:61](https://github.com/io-gui/io/blob/main/src/models/path.ts#L61)

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

[src/core/node.ts:188](https://github.com/io-gui/io/blob/main/src/core/node.ts#L188)

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

### stringChanged

**stringChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/models/path.ts:54](https://github.com/io-gui/io/blob/main/src/models/path.ts#L54)

___

### throttle

**throttle**(`func`, `arg?`, `sync?`): `void`

Throttles function execution to next frame (rAF) if the function has been executed in the current frame.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `func` | [`CallbackFunction`](../none#callbackfunction) | `undefined` | Function to throttle. |
| `arg` | `any` | `undefined` | argument for throttled function. |
| `sync` | `boolean` | `false` | execute immediately without rAF timeout. |

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[throttle](IoNode.md#throttle)

#### Defined in

[src/core/node.ts:249](https://github.com/io-gui/io/blob/main/src/core/node.ts#L249)

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

[src/core/node.ts:303](https://github.com/io-gui/io/blob/main/src/core/node.ts#L303)

___

### update

**update**(): `void`

#### Returns

`void`

#### Defined in

[src/models/path.ts:36](https://github.com/io-gui/io/blob/main/src/models/path.ts#L36)

___

### valueChanged

**valueChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/models/path.ts:18](https://github.com/io-gui/io/blob/main/src/models/path.ts#L18)
