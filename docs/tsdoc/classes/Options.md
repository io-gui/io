# Class: Options

## Hierarchy

- `__class`<`ArrayConstructor`, `this`\>

  ↳ **`Options`**

## Constructors

### constructor

• **new Options**(`options?`, `props?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `options` | `any`[] | `[]` |
| `props` | `Object` | `{}` |

#### Overrides

IoNodeMixin(Array).constructor

#### Defined in

[src/models/options.ts:20](https://github.com/io-gui/iogui/blob/tsc/src/models/options.ts#L20)

## Properties

### \_bindings

• `Readonly` **\_bindings**: `Record`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

IoNodeMixin(Array).\_bindings

#### Defined in

[src/core/node.ts:48](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L48)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

IoNodeMixin(Array).\_changeQueue

#### Defined in

[src/core/node.ts:49](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L49)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

IoNodeMixin(Array).\_eventDispatcher

#### Defined in

[src/core/node.ts:50](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L50)

___

### \_properties

• `Readonly` **\_properties**: `Record`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

IoNodeMixin(Array).\_properties

#### Defined in

[src/core/node.ts:47](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L47)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

IoNodeMixin(Array).\_protochain

#### Defined in

[src/core/node.ts:46](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L46)

## Accessors

### Properties

• `Static` `get` **Properties**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `items` | { `type`: `ArrayConstructor` = Array } |
| `items.type` | `ArrayConstructor` |
| `lazy` | `boolean` |
| `path` | { `type`: typeof [`Path`](Path.md) = Path } |
| `path.type` | typeof [`Path`](Path.md) |

#### Overrides

IoNodeMixin(Array).Properties

#### Defined in

[src/models/options.ts:9](https://github.com/io-gui/iogui/blob/tsc/src/models/options.ts#L9)

## Methods

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

[src/core/node.ts:317](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L317)

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

[src/core/node.ts:169](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L169)

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

IoNodeMixin(Array).bind

#### Defined in

[src/core/node.ts:290](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L290)

___

### changed

▸ **changed**(): `void`

#### Returns

`void`

#### Overrides

IoNodeMixin(Array).changed

#### Defined in

[src/models/options.ts:123](https://github.com/io-gui/iogui/blob/tsc/src/models/options.ts#L123)

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

[src/core/node.ts:342](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L342)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

IoNodeMixin(Array).dispatchQueue

#### Defined in

[src/core/node.ts:232](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L232)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

IoNodeMixin(Array).dispatchQueueSync

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

IoNodeMixin(Array).dispose

#### Defined in

[src/core/node.ts:349](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L349)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Inherited from

IoNodeMixin(Array).init

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

IoNodeMixin(Array).inputValue

#### Defined in

[src/core/node.ts:207](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L207)

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

[src/core/node.ts:281](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L281)

___

### onItemSelectedChanged

▸ **onItemSelectedChanged**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `any` |

#### Returns

`void`

#### Defined in

[src/models/options.ts:73](https://github.com/io-gui/iogui/blob/tsc/src/models/options.ts#L73)

___

### onItemSelectedPathChanged

▸ **onItemSelectedPathChanged**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `any` |

#### Returns

`void`

#### Defined in

[src/models/options.ts:63](https://github.com/io-gui/iogui/blob/tsc/src/models/options.ts#L63)

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

IoNodeMixin(Array).onObjectMutated

#### Defined in

[src/core/node.ts:260](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L260)

___

### option

▸ **option**(`value`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`any`

#### Defined in

[src/models/options.ts:36](https://github.com/io-gui/iogui/blob/tsc/src/models/options.ts#L36)

___

### pathChanged

▸ **pathChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/models/options.ts:42](https://github.com/io-gui/iogui/blob/tsc/src/models/options.ts#L42)

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

IoNodeMixin(Array).removeEventListener

#### Defined in

[src/core/node.ts:332](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L332)

___

### selectDefault

▸ **selectDefault**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/models/options.ts:109](https://github.com/io-gui/iogui/blob/tsc/src/models/options.ts#L109)

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

IoNodeMixin(Array).setProperty

#### Defined in

[src/core/node.ts:109](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L109)

___

### setSelectedPath

▸ **setSelectedPath**(`path?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `path` | `any`[] | `[]` |

#### Returns

`void`

#### Defined in

[src/models/options.ts:96](https://github.com/io-gui/iogui/blob/tsc/src/models/options.ts#L96)

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

IoNodeMixin(Array).throttle

#### Defined in

[src/core/node.ts:251](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L251)

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

[src/core/node.ts:303](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L303)
