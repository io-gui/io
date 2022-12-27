# Class: MenuOptions

## Hierarchy

- `__class`<`ArrayConstructor`, `this`\>

  ↳ **`MenuOptions`**

## Constructors

### constructor

**new MenuOptions**(`args?`, `properties?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `args` | [`MenuItemArgsLoose`](../README.md#menuitemargsloose)[] | `[]` |
| `properties` | [`IoNodeArgs`](../README.md#ionodeargs) | `{}` |

#### Overrides

IoNodeMixin(Array).constructor

#### Defined in

[src/elements/menus/models/menu-options.ts:65](https://github.com/io-gui/iogui/blob/main/src/elements/menus/models/menu-options.ts#L65)

## Properties

### \_bindings

 `Readonly` **\_bindings**: `Map`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

IoNodeMixin(Array).\_bindings

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

 `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

IoNodeMixin(Array).\_changeQueue

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

 `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

IoNodeMixin(Array).\_eventDispatcher

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L57)

___

### \_properties

 `Readonly` **\_properties**: `Map`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

IoNodeMixin(Array).\_properties

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L54)

___

### \_protochain

 `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

IoNodeMixin(Array).\_protochain

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L53)

___

### anchor

 **anchor**: `any`

#### Defined in

[src/elements/menus/models/menu-options.ts:25](https://github.com/io-gui/iogui/blob/main/src/elements/menus/models/menu-options.ts#L25)

___

### delimiter

 **delimiter**: `string`

#### Defined in

[src/elements/menus/models/menu-options.ts:31](https://github.com/io-gui/iogui/blob/main/src/elements/menus/models/menu-options.ts#L31)

___

### first

 **first**: `any`

#### Defined in

[src/elements/menus/models/menu-options.ts:19](https://github.com/io-gui/iogui/blob/main/src/elements/menus/models/menu-options.ts#L19)

___

### last

 **last**: `any`

#### Defined in

[src/elements/menus/models/menu-options.ts:22](https://github.com/io-gui/iogui/blob/main/src/elements/menus/models/menu-options.ts#L22)

___

### path

 **path**: `string`

#### Defined in

[src/elements/menus/models/menu-options.ts:28](https://github.com/io-gui/iogui/blob/main/src/elements/menus/models/menu-options.ts#L28)

## Accessors

### Properties

`Static` `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoNodeMixin(Array).Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L44)

## Methods

### \_onItemSelectedChanged

**_onItemSelectedChanged**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`<`any`\> |

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:227](https://github.com/io-gui/iogui/blob/main/src/elements/menus/models/menu-options.ts#L227)

___

### \_onSubOptionsPathChanged

**_onSubOptionsPathChanged**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`<`any`\> |

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:244](https://github.com/io-gui/iogui/blob/main/src/elements/menus/models/menu-options.ts#L244)

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

IoNodeMixin(Array).addEventListener

#### Defined in

[src/core/node.ts:368](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L368)

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

IoNodeMixin(Array).applyProperties

#### Defined in

[src/core/node.ts:212](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L212)

___

### bind

**bind**(`prop`): [`Binding`](Binding.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `prop` | `string` |

#### Returns

[`Binding`](Binding.md)

#### Overrides

IoNodeMixin(Array).bind

#### Defined in

[src/elements/menus/models/menu-options.ts:264](https://github.com/io-gui/iogui/blob/main/src/elements/menus/models/menu-options.ts#L264)

___

### changed

**changed**(): `void`

#### Returns

`void`

#### Overrides

IoNodeMixin(Array).changed

#### Defined in

[src/elements/menus/models/menu-options.ts:281](https://github.com/io-gui/iogui/blob/main/src/elements/menus/models/menu-options.ts#L281)

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

IoNodeMixin(Array).dispatchEvent

#### Defined in

[src/core/node.ts:393](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L393)

___

### dispatchQueue

**dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

IoNodeMixin(Array).dispatchQueue

#### Defined in

[src/core/node.ts:277](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L277)

___

### dispatchQueueSync

**dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

IoNodeMixin(Array).dispatchQueueSync

#### Defined in

[src/core/node.ts:287](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L287)

___

### dispose

**dispose**(): `void`

#### Returns

`void`

#### Overrides

IoNodeMixin(Array).dispose

#### Defined in

[src/elements/menus/models/menu-options.ts:273](https://github.com/io-gui/iogui/blob/main/src/elements/menus/models/menu-options.ts#L273)

___

### firstChanged

**firstChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:151](https://github.com/io-gui/iogui/blob/main/src/elements/menus/models/menu-options.ts#L151)

___

### getItem

**getItem**(`value`, `deep?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `value` | `any` | `undefined` |
| `deep` | `boolean` | `false` |

#### Returns

`any`

#### Defined in

[src/elements/menus/models/menu-options.ts:54](https://github.com/io-gui/iogui/blob/main/src/elements/menus/models/menu-options.ts#L54)

___

### init

**init**(): `void`

#### Returns

`void`

#### Inherited from

IoNodeMixin(Array).init

#### Defined in

[src/core/node.ts:264](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L264)

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

IoNodeMixin(Array).inputValue

#### Defined in

[src/core/node.ts:252](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L252)

___

### lastChanged

**lastChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:169](https://github.com/io-gui/iogui/blob/main/src/elements/menus/models/menu-options.ts#L169)

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

IoNodeMixin(Array).objectMutated

#### Defined in

[src/core/node.ts:326](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L326)

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

IoNodeMixin(Array).onObjectMutated

#### Defined in

[src/core/node.ts:305](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L305)

___

### pathChanged

**pathChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:119](https://github.com/io-gui/iogui/blob/main/src/elements/menus/models/menu-options.ts#L119)

___

### push

**push**(...`items`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...items` | [`MenuItem`](MenuItem.md)[] |

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:33](https://github.com/io-gui/iogui/blob/main/src/elements/menus/models/menu-options.ts#L33)

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

IoNodeMixin(Array).queue

#### Defined in

[src/core/node.ts:271](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L271)

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

IoNodeMixin(Array).removeEventListener

#### Defined in

[src/core/node.ts:383](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L383)

___

### selectDefault

**selectDefault**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/elements/menus/models/menu-options.ts:249](https://github.com/io-gui/iogui/blob/main/src/elements/menus/models/menu-options.ts#L249)

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

IoNodeMixin(Array).setProperties

#### Defined in

[src/core/node.ts:234](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L234)

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

IoNodeMixin(Array).setProperty

#### Defined in

[src/core/node.ts:129](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L129)

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

IoNodeMixin(Array).throttle

#### Defined in

[src/core/node.ts:296](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L296)

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

IoNodeMixin(Array).unbind

#### Defined in

[src/core/node.ts:352](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L352)

___

### updatePaths

**updatePaths**(`item?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item?` | [`MenuItem`](MenuItem.md) |

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:199](https://github.com/io-gui/iogui/blob/main/src/elements/menus/models/menu-options.ts#L199)
