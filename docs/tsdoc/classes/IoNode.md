# Class: IoNode

IoNodeMixin applied to `Object` class.

## Hierarchy

- `__class`<`ObjectConstructor`, `this`\>

  ↳ **`IoNode`**

  ↳↳ [`Item`](Item.md)

  ↳↳ [`Path`](Path.md)

  ↳↳ [`IoServiceLoader`](IoServiceLoader.md)

## Constructors

### constructor

• **new IoNode**(`properties?`, ...`args`)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `properties` | `Record`<`string`, `any`\> | Initial property values. |
| `...args` | `any`[] | - |

#### Inherited from

IoNodeMixin(Object).constructor

#### Defined in

[core/io-node.ts:77](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L77)

## Properties

### \_bindings

• `Readonly` **\_bindings**: `Record`<`string`, [`Binding`](Binding.md)\> = `{}`

#### Inherited from

IoNodeMixin(Object).\_bindings

#### Defined in

[core/io-node.ts:69](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L69)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

IoNodeMixin(Object).\_changeQueue

#### Defined in

[core/io-node.ts:71](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L71)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

IoNodeMixin(Object).\_eventDispatcher

#### Defined in

[core/io-node.ts:72](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L72)

___

### \_properties

• `Readonly` **\_properties**: `Record`<`string`, [`Property`](Property.md)\> = `{}`

#### Inherited from

IoNodeMixin(Object).\_properties

#### Defined in

[core/io-node.ts:68](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L68)

## Accessors

### compose

• `get` **compose**(): `ComposedProperties`

`compose` object lets you reactively assign property values to other object's properties.
For example, you can assign `this.value` property to the `this.objectProp.result` property.

```
get compose () {
  return {
    objectProp: {result: this.value}
  };
 }
```

Node class does not use `compose` by itself but this feature is available to its sublasses.

#### Returns

`ComposedProperties`

#### Inherited from

IoNodeMixin(Object).compose

#### Defined in

[core/io-node.ts:65](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L65)

___

### Properties

• `Static` `get` **Properties**(): [`PropertiesDeclaration`](../README.md#propertiesdeclaration)

#### Returns

[`PropertiesDeclaration`](../README.md#propertiesdeclaration)

#### Inherited from

IoNodeMixin(Object).Properties

#### Defined in

[core/io-node.ts:41](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L41)

## Methods

### addEventListener

▸ **addEventListener**(`type`, `listener`, `options?`): `void`

Wrapper for addEventListener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | listener name. |
| `listener` | `AnyEventListener` | listener handler. |
| `options?` | `AddEventListenerOptions` | event listener options. |

#### Returns

`void`

#### Inherited from

IoNodeMixin(Object).addEventListener

#### Defined in

[core/io-node.ts:363](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L363)

___

### applyCompose

▸ **applyCompose**(): `void`

sets composed properties and invokes `changed()` function on change.

#### Returns

`void`

#### Inherited from

IoNodeMixin(Object).applyCompose

#### Defined in

[core/io-node.ts:212](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L212)

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

IoNodeMixin(Object).bind

#### Defined in

[core/io-node.ts:303](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L303)

___

### changed

▸ **changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

IoNodeMixin(Object).changed

#### Defined in

[core/io-node.ts:208](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L208)

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
| `src?` | `HTMLElement` \| `Node` \| `Window` \| `Document` | `undefined` | source node/element to dispatch event from. |

#### Returns

`void`

#### Inherited from

IoNodeMixin(Object).dispatchEvent

#### Defined in

[core/io-node.ts:387](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L387)

___

### dispose

▸ **dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

IoNodeMixin(Object).dispose

#### Defined in

[core/io-node.ts:186](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L186)

___

### filterObject

▸ **filterObject**(`object`, `predicate`, `_depth?`, `_chain?`, `_i?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `object` | `any` | `undefined` |
| `predicate` | `PredicateFunction` | `undefined` |
| `_depth` | `number` | `5` |
| `_chain` | `any`[] | `[]` |
| `_i` | `number` | `0` |

#### Returns

`any`

#### Inherited from

IoNodeMixin(Object).filterObject

#### Defined in

[core/io-node.ts:420](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L420)

___

### filterObjects

▸ **filterObjects**(`object`, `predicate`, `_depth?`, `_chain?`, `_i?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `object` | `any` | `undefined` |
| `predicate` | `PredicateFunction` | `undefined` |
| `_depth` | `number` | `5` |
| `_chain` | `any`[] | `[]` |
| `_i` | `number` | `0` |

#### Returns

`any`

#### Inherited from

IoNodeMixin(Object).filterObjects

#### Defined in

[core/io-node.ts:433](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L433)

___

### import

▸ **import**(`path`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`Promise`<`unknown`\>

#### Inherited from

IoNodeMixin(Object).import

#### Defined in

[core/io-node.ts:450](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L450)

___

### objectMutated

▸ **objectMutated**(`event`): `void`

Event handler for 'object-mutated' event emitted from the `window`.
Node should be listening for this event if it has an object property
with `observe: "sync" || "async"` configuration.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `CustomEvent`<`any`\> | Event payload. |

#### Returns

`void`

#### Inherited from

IoNodeMixin(Object).objectMutated

#### Defined in

[core/io-node.ts:267](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L267)

___

### objectMutatedThrottled

▸ **objectMutatedThrottled**(`prop`): `void`

This function is called after `objectMutated()` determines that one of
the object properties has mutated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prop` | `string` | Mutated object property name. |

#### Returns

`void`

#### Inherited from

IoNodeMixin(Object).objectMutatedThrottled

#### Defined in

[core/io-node.ts:293](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L293)

___

### preventDefault

▸ **preventDefault**(`event`): `void`

Handler function with `event.preventDefault()`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `Event` | Event object. |

#### Returns

`void`

#### Inherited from

IoNodeMixin(Object).preventDefault

#### Defined in

[core/io-node.ts:468](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L468)

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

IoNodeMixin(Object).queue

#### Defined in

[core/io-node.ts:240](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L240)

___

### queueDispatch

▸ **queueDispatch**(): `void`

Dispatches the queue.

#### Returns

`void`

#### Inherited from

IoNodeMixin(Object).queueDispatch

#### Defined in

[core/io-node.ts:246](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L246)

___

### queueDispatchLazy

▸ **queueDispatchLazy**(): `void`

Dispatches the queue in the next rAF cycle.

#### Returns

`void`

#### Inherited from

IoNodeMixin(Object).queueDispatchLazy

#### Defined in

[core/io-node.ts:257](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L257)

___

### removeEventListener

▸ **removeEventListener**(`type`, `listener?`, `options?`): `void`

Wrapper for removeEventListener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | event name to listen to. |
| `listener?` | `AnyEventListener` | listener handler. |
| `options?` | `AddEventListenerOptions` | event listener options. |

#### Returns

`void`

#### Inherited from

IoNodeMixin(Object).removeEventListener

#### Defined in

[core/io-node.ts:377](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L377)

___

### requestAnimationFrameOnce

▸ **requestAnimationFrameOnce**(`func`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `func` | `CallbackFunction` |

#### Returns

`void`

#### Inherited from

IoNodeMixin(Object).requestAnimationFrameOnce

#### Defined in

[core/io-node.ts:417](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L417)

___

### set

▸ **set**(`prop`, `value`, `force?`): `void`

Sets a property and emits `[property]-set` event.
Use this when property is set by user action (e.g. mouse click).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prop` | `string` | Property name. |
| `value` | `any` | Property value. |
| `force?` | `boolean` | Force value set. |

#### Returns

`void`

#### Inherited from

IoNodeMixin(Object).set

#### Defined in

[core/io-node.ts:330](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L330)

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

IoNodeMixin(Object).setProperties

#### Defined in

[core/io-node.ts:342](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L342)

___

### setPropertyValue

▸ **setPropertyValue**(`name`, `value`, `skipDispatch?`): `void`

Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Property name to set value of. |
| `value` | `any` | Peroperty value. |
| `skipDispatch?` | `boolean` | - |

#### Returns

`void`

#### Inherited from

IoNodeMixin(Object).setPropertyValue

#### Defined in

[core/io-node.ts:130](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L130)

___

### stopPropagation

▸ **stopPropagation**(`event`): `void`

Handler function with `event.stopPropagation()`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `CustomEvent`<`any`\> | Event object. |

#### Returns

`void`

#### Inherited from

IoNodeMixin(Object).stopPropagation

#### Defined in

[core/io-node.ts:475](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L475)

___

### throttle

▸ **throttle**(`func`, `arg?`, `asynchronous?`): `void`

Throttles function execution to next frame (rAF) if the function has been executed in the current frame.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `func` | `CallbackFunction` | Function to throttle. |
| `arg?` | `any` | argument for throttled function. |
| `asynchronous?` | `boolean` | execute with timeout. |

#### Returns

`void`

#### Inherited from

IoNodeMixin(Object).throttle

#### Defined in

[core/io-node.ts:396](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L396)

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

IoNodeMixin(Object).unbind

#### Defined in

[core/io-node.ts:315](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L315)
