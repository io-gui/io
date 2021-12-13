# Class: IoServiceLoader

## Hierarchy

- [`IoNode`](IoNode.md)

  ↳ **`IoServiceLoader`**

## Constructors

### constructor

• **new IoServiceLoader**(`props?`)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props?` | `any` |

#### Overrides

[IoNode](IoNode.md).[constructor](IoNode.md#constructor)

#### Defined in

[elements/extras/service-loader.ts:19](https://github.com/io-gui/iogui/blob/tsc/src/elements/extras/service-loader.ts#L19)

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

IoNode.compose

#### Defined in

[core/io-node.ts:55](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L55)

___

### Properties

• `Static` `get` **Properties**(): `any`

#### Returns

`any`

#### Overrides

IoNode.Properties

#### Defined in

[elements/extras/service-loader.ts:11](https://github.com/io-gui/iogui/blob/tsc/src/elements/extras/service-loader.ts#L11)

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

[IoNode](IoNode.md).[addEventListener](IoNode.md#addeventlistener)

#### Defined in

[core/io-node.ts:323](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L323)

___

### applyCompose

▸ **applyCompose**(): `void`

sets composed properties and invokes `changed()` function on change.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[applyCompose](IoNode.md#applycompose)

#### Defined in

[core/io-node.ts:176](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L176)

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

[core/io-node.ts:267](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L267)

___

### changed

▸ **changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[changed](IoNode.md#changed)

#### Defined in

[core/io-node.ts:172](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L172)

___

### connect

▸ **connect**(`node?`): [`IoServiceLoader`](IoServiceLoader.md)

Connects the instance to another node or element.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | `HTMLElement` \| [`IoNode`](IoNode.md) \| `Document` \| `Window` | `window` | Node to connect to. |

#### Returns

[`IoServiceLoader`](IoServiceLoader.md)

this

#### Inherited from

[IoNode](IoNode.md).[connect](IoNode.md#connect)

#### Defined in

[core/io-node.ts:97](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L97)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Connected callback.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[connectedCallback](IoNode.md#connectedcallback)

#### Defined in

[core/io-node.ts:133](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L133)

___

### disconnect

▸ **disconnect**(`node?`): [`IoServiceLoader`](IoServiceLoader.md)

Disconnects the instance from an another node or element.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | `HTMLElement` \| [`IoNode`](IoNode.md) \| `Document` \| `Window` | `window` | Node to disconnect from. |

#### Returns

[`IoServiceLoader`](IoServiceLoader.md)

this

#### Inherited from

[IoNode](IoNode.md).[disconnect](IoNode.md#disconnect)

#### Defined in

[core/io-node.ts:115](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L115)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Disconnected callback.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[disconnectedCallback](IoNode.md#disconnectedcallback)

#### Defined in

[core/io-node.ts:145](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L145)

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
| `src?` | `HTMLElement` \| `Node` \| `Document` \| `Window` | `undefined` | source node/element to dispatch event from. |

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[dispatchEvent](IoNode.md#dispatchevent)

#### Defined in

[core/io-node.ts:347](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L347)

___

### dispose

▸ **dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[dispose](IoNode.md#dispose)

#### Defined in

[core/io-node.ts:157](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L157)

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

[IoNode](IoNode.md).[filterObject](IoNode.md#filterobject)

#### Defined in

[core/io-node.ts:380](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L380)

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

[IoNode](IoNode.md).[filterObjects](IoNode.md#filterobjects)

#### Defined in

[core/io-node.ts:393](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L393)

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

[IoNode](IoNode.md).[import](IoNode.md#import)

#### Defined in

[core/io-node.ts:410](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L410)

___

### init

▸ **init**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[elements/extras/service-loader.ts:24](https://github.com/io-gui/iogui/blob/tsc/src/elements/extras/service-loader.ts#L24)

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

[IoNode](IoNode.md).[objectMutated](IoNode.md#objectmutated)

#### Defined in

[core/io-node.ts:231](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L231)

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

[IoNode](IoNode.md).[objectMutatedThrottled](IoNode.md#objectmutatedthrottled)

#### Defined in

[core/io-node.ts:257](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L257)

___

### onServiceWorkerMessage

▸ **onServiceWorkerMessage**(`message`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `any` |

#### Returns

`void`

#### Defined in

[elements/extras/service-loader.ts:48](https://github.com/io-gui/iogui/blob/tsc/src/elements/extras/service-loader.ts#L48)

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

[IoNode](IoNode.md).[preventDefault](IoNode.md#preventdefault)

#### Defined in

[core/io-node.ts:428](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L428)

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

[core/io-node.ts:204](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L204)

___

### queueDispatch

▸ **queueDispatch**(): `void`

Dispatches the queue.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[queueDispatch](IoNode.md#queuedispatch)

#### Defined in

[core/io-node.ts:210](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L210)

___

### queueDispatchLazy

▸ **queueDispatchLazy**(): `void`

Dispatches the queue in the next rAF cycle.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[queueDispatchLazy](IoNode.md#queuedispatchlazy)

#### Defined in

[core/io-node.ts:221](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L221)

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

[IoNode](IoNode.md).[removeEventListener](IoNode.md#removeeventlistener)

#### Defined in

[core/io-node.ts:337](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L337)

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

[IoNode](IoNode.md).[requestAnimationFrameOnce](IoNode.md#requestanimationframeonce)

#### Defined in

[core/io-node.ts:377](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L377)

___

### requestNotification

▸ **requestNotification**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[elements/extras/service-loader.ts:44](https://github.com/io-gui/iogui/blob/tsc/src/elements/extras/service-loader.ts#L44)

___

### serviceWorkerChanged

▸ **serviceWorkerChanged**(): `void`

#### Returns

`void`

#### Defined in

[elements/extras/service-loader.ts:36](https://github.com/io-gui/iogui/blob/tsc/src/elements/extras/service-loader.ts#L36)

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

[IoNode](IoNode.md).[set](IoNode.md#set)

#### Defined in

[core/io-node.ts:290](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L290)

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

[core/io-node.ts:302](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L302)

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

[IoNode](IoNode.md).[stopPropagation](IoNode.md#stoppropagation)

#### Defined in

[core/io-node.ts:435](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L435)

___

### subscribe

▸ **subscribe**(): `void`

#### Returns

`void`

#### Defined in

[elements/extras/service-loader.ts:39](https://github.com/io-gui/iogui/blob/tsc/src/elements/extras/service-loader.ts#L39)

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

[IoNode](IoNode.md).[throttle](IoNode.md#throttle)

#### Defined in

[core/io-node.ts:356](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L356)

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

[core/io-node.ts:278](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L278)
