# Class: Path

## Hierarchy

- [`IoNode`](IoNode.md)

  ↳ **`Path`**

## Constructors

### constructor

• **new Path**(`properties?`, ...`args`)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `properties` | `Record`<`string`, `any`\> | Initial property values. |
| `...args` | `any`[] | - |

#### Inherited from

[IoNode](IoNode.md).[constructor](IoNode.md#constructor)

#### Defined in

[core/io-node.ts:61](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L61)

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

[core/io-node.ts:54](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L54)

___

### Properties

• `Static` `get` **Properties**(): `Object`

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

[models/path.ts:4](https://github.com/io-gui/iogui/blob/tsc/src/models/path.ts#L4)

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

[core/io-node.ts:322](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L322)

___

### applyCompose

▸ **applyCompose**(): `void`

sets composed properties and invokes `changed()` function on change.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[applyCompose](IoNode.md#applycompose)

#### Defined in

[core/io-node.ts:175](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L175)

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

[core/io-node.ts:266](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L266)

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

[core/io-node.ts:171](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L171)

___

### connect

▸ **connect**(`node?`): [`Path`](Path.md)

Connects the instance to another node or element.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | `HTMLElement` \| [`IoNode`](IoNode.md) \| `Document` \| `Window` | `window` | Node to connect to. |

#### Returns

[`Path`](Path.md)

this

#### Inherited from

[IoNode](IoNode.md).[connect](IoNode.md#connect)

#### Defined in

[core/io-node.ts:96](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L96)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Connected callback.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[connectedCallback](IoNode.md#connectedcallback)

#### Defined in

[core/io-node.ts:132](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L132)

___

### disconnect

▸ **disconnect**(`node?`): [`Path`](Path.md)

Disconnects the instance from an another node or element.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | `HTMLElement` \| [`IoNode`](IoNode.md) \| `Document` \| `Window` | `window` | Node to disconnect from. |

#### Returns

[`Path`](Path.md)

this

#### Inherited from

[IoNode](IoNode.md).[disconnect](IoNode.md#disconnect)

#### Defined in

[core/io-node.ts:114](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L114)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Disconnected callback.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[disconnectedCallback](IoNode.md#disconnectedcallback)

#### Defined in

[core/io-node.ts:144](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L144)

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

[core/io-node.ts:346](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L346)

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

[core/io-node.ts:156](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L156)

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

[core/io-node.ts:379](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L379)

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

[core/io-node.ts:392](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L392)

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

[core/io-node.ts:409](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L409)

___

### leafChanged

▸ **leafChanged**(): `void`

#### Returns

`void`

#### Defined in

[models/path.ts:57](https://github.com/io-gui/iogui/blob/tsc/src/models/path.ts#L57)

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

[core/io-node.ts:230](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L230)

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

[core/io-node.ts:256](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L256)

___

### onMutation

▸ **onMutation**(): `void`

#### Returns

`void`

#### Defined in

[models/path.ts:27](https://github.com/io-gui/iogui/blob/tsc/src/models/path.ts#L27)

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

[core/io-node.ts:427](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L427)

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

[core/io-node.ts:203](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L203)

___

### queueDispatch

▸ **queueDispatch**(): `void`

Dispatches the queue.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[queueDispatch](IoNode.md#queuedispatch)

#### Defined in

[core/io-node.ts:209](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L209)

___

### queueDispatchLazy

▸ **queueDispatchLazy**(): `void`

Dispatches the queue in the next rAF cycle.

#### Returns

`void`

#### Inherited from

[IoNode](IoNode.md).[queueDispatchLazy](IoNode.md#queuedispatchlazy)

#### Defined in

[core/io-node.ts:220](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L220)

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

[core/io-node.ts:336](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L336)

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

[core/io-node.ts:376](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L376)

___

### rootChanged

▸ **rootChanged**(): `void`

#### Returns

`void`

#### Defined in

[models/path.ts:52](https://github.com/io-gui/iogui/blob/tsc/src/models/path.ts#L52)

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

[core/io-node.ts:289](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L289)

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

[core/io-node.ts:301](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L301)

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

[core/io-node.ts:434](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L434)

___

### stringChanged

▸ **stringChanged**(): `void`

#### Returns

`void`

#### Defined in

[models/path.ts:45](https://github.com/io-gui/iogui/blob/tsc/src/models/path.ts#L45)

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

[core/io-node.ts:355](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L355)

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

[core/io-node.ts:277](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L277)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Defined in

[models/path.ts:30](https://github.com/io-gui/iogui/blob/tsc/src/models/path.ts#L30)

___

### valueChanged

▸ **valueChanged**(): `void`

#### Returns

`void`

#### Defined in

[models/path.ts:13](https://github.com/io-gui/iogui/blob/tsc/src/models/path.ts#L13)
