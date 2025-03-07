[**io-gui**](../README.md)

***

[io-gui](../README.md) / MenuOptions

# Class: MenuOptions

Defined in: [src/elements/menus/models/menu-options.ts:16](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L16)

## Extends

- `IoNodeMixinConstructor`\<`ArrayConstructor`, `this`\>

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### new MenuOptions()

> **new MenuOptions**(`args`, `properties`): [`MenuOptions`](MenuOptions.md)

Defined in: [src/elements/menus/models/menu-options.ts:65](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L65)

#### Parameters

##### args

[`MenuItemArgsLoose`](../type-aliases/MenuItemArgsLoose.md)[] = `[]`

##### properties

[`IoNodeArgs`](../type-aliases/IoNodeArgs.md) = `{}`

#### Returns

[`MenuOptions`](MenuOptions.md)

#### Overrides

`IoNodeMixin(Array).constructor`

## Properties

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

Defined in: [src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

#### Inherited from

`IoNodeMixin(Array)._bindings`

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

Defined in: [src/core/node.ts:45](https://github.com/io-gui/io/blob/main/src/core/node.ts#L45)

#### Inherited from

`IoNodeMixin(Array)._changeQueue`

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

Defined in: [src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

#### Inherited from

`IoNodeMixin(Array)._eventDispatcher`

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

Defined in: [src/core/node.ts:43](https://github.com/io-gui/io/blob/main/src/core/node.ts#L43)

#### Inherited from

`IoNodeMixin(Array)._properties`

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

Defined in: [src/core/node.ts:42](https://github.com/io-gui/io/blob/main/src/core/node.ts#L42)

#### Inherited from

`IoNodeMixin(Array)._protochain`

***

### delimiter

> **delimiter**: `string`

Defined in: [src/elements/menus/models/menu-options.ts:31](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L31)

***

### first

> **first**: `any`

Defined in: [src/elements/menus/models/menu-options.ts:19](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L19)

***

### last

> **last**: `any`

Defined in: [src/elements/menus/models/menu-options.ts:22](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L22)

***

### path

> **path**: `string`

Defined in: [src/elements/menus/models/menu-options.ts:28](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L28)

***

### scroll

> **scroll**: `any`

Defined in: [src/elements/menus/models/menu-options.ts:25](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L25)

## Accessors

### Properties

#### Get Signature

> **get** `static` **Properties**(): [`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

Defined in: [src/core/node.ts:33](https://github.com/io-gui/io/blob/main/src/core/node.ts#L33)

##### Returns

[`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

#### Inherited from

`IoNodeMixin(Array).Properties`

## Methods

### \_onItemSelectedChanged()

> **\_onItemSelectedChanged**(`event`): `void`

Defined in: [src/elements/menus/models/menu-options.ts:227](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L227)

#### Parameters

##### event

`CustomEvent`

#### Returns

`void`

***

### \_onSubOptionsPathChanged()

> **\_onSubOptionsPathChanged**(`event`): `void`

Defined in: [src/elements/menus/models/menu-options.ts:244](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L244)

#### Parameters

##### event

`CustomEvent`

#### Returns

`void`

***

### addEventListener()

> **addEventListener**(`type`, `listener`, `options`?): `void`

Defined in: [src/core/node.ts:342](https://github.com/io-gui/io/blob/main/src/core/node.ts#L342)

Wrapper for addEventListener.

#### Parameters

##### type

`string`

listener name.

##### listener

[`AnyEventListener`](../type-aliases/AnyEventListener.md)

listener handler.

##### options?

`AddEventListenerOptions`

event listener options.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).addEventListener`

***

### applyProperties()

> **applyProperties**(`props`): `void`

Defined in: [src/core/node.ts:184](https://github.com/io-gui/io/blob/main/src/core/node.ts#L184)

Sets multiple properties in batch.
[property]-changed` events will be broadcast in the end.

#### Parameters

##### props

`any`

Map of property names and values.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).applyProperties`

***

### bind()

> **bind**(`prop`): [`Binding`](Binding.md)

Defined in: [src/elements/menus/models/menu-options.ts:264](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L264)

Returns a binding to a specified property`.

#### Parameters

##### prop

`string`

Property to bind to.

#### Returns

[`Binding`](Binding.md)

Binding object.

#### Overrides

`IoNodeMixin(Array).bind`

***

### changed()

> **changed**(): `void`

Defined in: [src/elements/menus/models/menu-options.ts:281](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L281)

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

`IoNodeMixin(Array).changed`

***

### dispatchEvent()

> **dispatchEvent**(`type`, `detail`, `bubbles`, `src`?): `void`

Defined in: [src/core/node.ts:367](https://github.com/io-gui/io/blob/main/src/core/node.ts#L367)

Wrapper for dispatchEvent.

#### Parameters

##### type

`string`

event name to dispatch.

##### detail

event detail.

##### bubbles

`boolean` = `false`

event bubbles.

##### src?

source node/element to dispatch event from.

`Node` | `Document` | `HTMLElement` | `Window`

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).dispatchEvent`

***

### dispatchMutationEvent()

> **dispatchMutationEvent**(`object`): `void`

Defined in: [src/core/node.ts:374](https://github.com/io-gui/io/blob/main/src/core/node.ts#L374)

Shorthand for dispatching `'object-mutated'` event on window.

#### Parameters

##### object

`any`

object which mutated.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).dispatchMutationEvent`

***

### dispatchQueue()

> **dispatchQueue**(): `void`

Defined in: [src/core/node.ts:249](https://github.com/io-gui/io/blob/main/src/core/node.ts#L249)

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).dispatchQueue`

***

### dispatchQueueSync()

> **dispatchQueueSync**(): `void`

Defined in: [src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).dispatchQueueSync`

***

### dispose()

> **dispose**(): `void`

Defined in: [src/elements/menus/models/menu-options.ts:273](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L273)

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Overrides

`IoNodeMixin(Array).dispose`

***

### firstChanged()

> **firstChanged**(): `void`

Defined in: [src/elements/menus/models/menu-options.ts:151](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L151)

#### Returns

`void`

***

### getItem()

> **getItem**(`value`, `deep`): `any`

Defined in: [src/elements/menus/models/menu-options.ts:54](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L54)

#### Parameters

##### value

`any`

##### deep

`boolean` = `false`

#### Returns

`any`

***

### init()

> **init**(): `void`

Defined in: [src/core/node.ts:236](https://github.com/io-gui/io/blob/main/src/core/node.ts#L236)

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).init`

***

### inputValue()

> **inputValue**(`value`): `void`

Defined in: [src/core/node.ts:224](https://github.com/io-gui/io/blob/main/src/core/node.ts#L224)

Sets value property and emits `value-input` event.
Use this when value property is set by user action (e.g. mouse click).

#### Parameters

##### value

`any`

Property value.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).inputValue`

***

### lastChanged()

> **lastChanged**(): `void`

Defined in: [src/elements/menus/models/menu-options.ts:169](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L169)

#### Returns

`void`

***

### objectMutated()

> **objectMutated**(`prop`): `void`

Defined in: [src/core/node.ts:298](https://github.com/io-gui/io/blob/main/src/core/node.ts#L298)

This function is called after `onObjectMutated()` determines that one of
the object properties has mutated.

#### Parameters

##### prop

`string`

Mutated object property name.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).objectMutated`

***

### onObjectMutated()

> **onObjectMutated**(`event`): `void`

Defined in: [src/core/node.ts:277](https://github.com/io-gui/io/blob/main/src/core/node.ts#L277)

Event handler for 'object-mutated' event emitted from the `window`.
Node should be listening for this event if it has an observed object property

#### Parameters

##### event

`CustomEvent`

Event payload.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).onObjectMutated`

***

### pathChanged()

> **pathChanged**(): `void`

Defined in: [src/elements/menus/models/menu-options.ts:119](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L119)

#### Returns

`void`

***

### push()

> **push**(...`items`): `void`

Defined in: [src/elements/menus/models/menu-options.ts:33](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L33)

#### Parameters

##### items

...[`MenuItem`](MenuItem.md)[]

#### Returns

`void`

***

### queue()

> **queue**(`prop`, `value`, `oldValue`): `void`

Defined in: [src/core/node.ts:243](https://github.com/io-gui/io/blob/main/src/core/node.ts#L243)

Adds property change to the queue.

#### Parameters

##### prop

`string`

Property name.

##### value

`any`

Property value.

##### oldValue

`any`

Old property value.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).queue`

***

### Register()

> **Register**(`ioNodeConstructor`): `void`

Defined in: [src/core/node.ts:416](https://github.com/io-gui/io/blob/main/src/core/node.ts#L416)

#### Parameters

##### ioNodeConstructor

*typeof* [`IoNode`](IoNode.md)

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).Register`

***

### removeEventListener()

> **removeEventListener**(`type`, `listener`?, `options`?): `void`

Defined in: [src/core/node.ts:357](https://github.com/io-gui/io/blob/main/src/core/node.ts#L357)

Wrapper for removeEventListener.

#### Parameters

##### type

`string`

event name to listen to.

##### listener?

[`AnyEventListener`](../type-aliases/AnyEventListener.md)

listener handler.

##### options?

`AddEventListenerOptions`

event listener options.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).removeEventListener`

***

### selectDefault()

> **selectDefault**(): `boolean`

Defined in: [src/elements/menus/models/menu-options.ts:249](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L249)

#### Returns

`boolean`

***

### setProperties()

> **setProperties**(`props`): `void`

Defined in: [src/core/node.ts:206](https://github.com/io-gui/io/blob/main/src/core/node.ts#L206)

Sets multiple properties in batch.
[property]-changed` events will be broadcast in the end.

#### Parameters

##### props

`any`

Map of property names and values.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).setProperties`

***

### setProperty()

> **setProperty**(`name`, `value`, `skipDispatch`?): `void`

Defined in: [src/core/node.ts:111](https://github.com/io-gui/io/blob/main/src/core/node.ts#L111)

Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.

#### Parameters

##### name

`string`

Property name to set value of.

##### value

`any`

Peroperty value.

##### skipDispatch?

`boolean`

flag to skip event dispatch.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).setProperty`

***

### throttle()

> **throttle**(`func`, `arg`, `timeout`): `void`

Defined in: [src/core/node.ts:268](https://github.com/io-gui/io/blob/main/src/core/node.ts#L268)

Throttles function execution to next frame (rAF) if the function has been executed in the current frame.

#### Parameters

##### func

[`CallbackFunction`](../type-aliases/CallbackFunction.md)

Function to throttle.

##### arg

`any` = `undefined`

argument for throttled function.

##### timeout

`number` = `1`

minimum delay in ms before executing the function.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).throttle`

***

### unbind()

> **unbind**(`prop`): `void`

Defined in: [src/core/node.ts:326](https://github.com/io-gui/io/blob/main/src/core/node.ts#L326)

Unbinds a binding to a specified property`.

#### Parameters

##### prop

`string`

Property to unbind.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).unbind`

***

### updatePaths()

> **updatePaths**(`item`?): `void`

Defined in: [src/elements/menus/models/menu-options.ts:199](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L199)

#### Parameters

##### item?

[`MenuItem`](MenuItem.md)

#### Returns

`void`
