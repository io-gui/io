[**io-gui**](../README.md) • **Docs**

***

[io-gui](../README.md) / MenuOptions

# Class: MenuOptions

## Extends

- `IoNodeMixinConstructor`\<`ArrayConstructor`, `this`\>

## Constructors

### new MenuOptions()

> **new MenuOptions**(`args`, `properties`): [`MenuOptions`](MenuOptions.md)

#### Parameters

• **args**: [`MenuItemArgsLoose`](../type-aliases/MenuItemArgsLoose.md)[] = `[]`

• **properties**: [`IoNodeArgs`](../type-aliases/IoNodeArgs.md) = `{}`

#### Returns

[`MenuOptions`](MenuOptions.md)

#### Overrides

`IoNodeMixin(Array).constructor`

#### Defined in

[src/elements/menus/models/menu-options.ts:65](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L65)

## Properties

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

`IoNodeMixin(Array)._bindings`

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

`IoNodeMixin(Array)._changeQueue`

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

`IoNodeMixin(Array)._eventDispatcher`

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

`IoNodeMixin(Array)._properties`

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

`IoNodeMixin(Array)._protochain`

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

***

### delimiter

> **delimiter**: `string`

#### Defined in

[src/elements/menus/models/menu-options.ts:31](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L31)

***

### first

> **first**: `any`

#### Defined in

[src/elements/menus/models/menu-options.ts:19](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L19)

***

### last

> **last**: `any`

#### Defined in

[src/elements/menus/models/menu-options.ts:22](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L22)

***

### path

> **path**: `string`

#### Defined in

[src/elements/menus/models/menu-options.ts:28](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L28)

***

### scroll

> **scroll**: `any`

#### Defined in

[src/elements/menus/models/menu-options.ts:25](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L25)

## Accessors

### Properties

> `get` `static` **Properties**(): [`PropertyDeclarations`](../type-aliases/PropertyDeclarations.md)

#### Returns

[`PropertyDeclarations`](../type-aliases/PropertyDeclarations.md)

#### Inherited from

`IoNodeMixin(Array).Properties`

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

## Methods

### Register()

> **Register**(`ioNodeConstructor`): `void`

#### Parameters

• **ioNodeConstructor**: *typeof* [`IoNode`](IoNode.md)

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).Register`

#### Defined in

[src/core/node.ts:427](https://github.com/io-gui/io/blob/main/src/core/node.ts#L427)

***

### \_onItemSelectedChanged()

> **\_onItemSelectedChanged**(`event`): `void`

#### Parameters

• **event**: `CustomEvent`\<`any`\>

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:227](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L227)

***

### \_onSubOptionsPathChanged()

> **\_onSubOptionsPathChanged**(`event`): `void`

#### Parameters

• **event**: `CustomEvent`\<`any`\>

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:244](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L244)

***

### addEventListener()

> **addEventListener**(`type`, `listener`, `options`?): `void`

Wrapper for addEventListener.

#### Parameters

• **type**: `string`

listener name.

• **listener**: [`AnyEventListener`](../type-aliases/AnyEventListener.md)

listener handler.

• **options?**: `AddEventListenerOptions`

event listener options.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).addEventListener`

#### Defined in

[src/core/node.ts:353](https://github.com/io-gui/io/blob/main/src/core/node.ts#L353)

***

### applyProperties()

> **applyProperties**(`props`): `void`

Sets multiple properties in batch.
[property]-changed` events will be broadcast in the end.

#### Parameters

• **props**: `any`

Map of property names and values.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).applyProperties`

#### Defined in

[src/core/node.ts:195](https://github.com/io-gui/io/blob/main/src/core/node.ts#L195)

***

### bind()

> **bind**(`prop`): [`Binding`](Binding.md)

Returns a binding to a specified property`.

#### Parameters

• **prop**: `string`

Property to bind to.

#### Returns

[`Binding`](Binding.md)

Binding object.

#### Overrides

`IoNodeMixin(Array).bind`

#### Defined in

[src/elements/menus/models/menu-options.ts:264](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L264)

***

### changed()

> **changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

`IoNodeMixin(Array).changed`

#### Defined in

[src/elements/menus/models/menu-options.ts:281](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L281)

***

### dispatchEvent()

> **dispatchEvent**(`type`, `detail`, `bubbles`, `src`?): `void`

Wrapper for dispatchEvent.

#### Parameters

• **type**: `string`

event name to dispatch.

• **detail** = `{}`

event detail.

• **bubbles**: `boolean` = `false`

event bubbles.

• **src?**: `Node` \| `Document` \| `HTMLElement` \| `Window`

source node/element to dispatch event from.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).dispatchEvent`

#### Defined in

[src/core/node.ts:378](https://github.com/io-gui/io/blob/main/src/core/node.ts#L378)

***

### dispatchMutationEvent()

> **dispatchMutationEvent**(`object`): `void`

Shorthand for dispatching `'object-mutated'` event on window.

#### Parameters

• **object**: `any`

object which mutated.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).dispatchMutationEvent`

#### Defined in

[src/core/node.ts:385](https://github.com/io-gui/io/blob/main/src/core/node.ts#L385)

***

### dispatchQueue()

> **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).dispatchQueue`

#### Defined in

[src/core/node.ts:260](https://github.com/io-gui/io/blob/main/src/core/node.ts#L260)

***

### dispatchQueueSync()

> **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).dispatchQueueSync`

#### Defined in

[src/core/node.ts:270](https://github.com/io-gui/io/blob/main/src/core/node.ts#L270)

***

### dispose()

> **dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Overrides

`IoNodeMixin(Array).dispose`

#### Defined in

[src/elements/menus/models/menu-options.ts:273](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L273)

***

### firstChanged()

> **firstChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:151](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L151)

***

### getItem()

> **getItem**(`value`, `deep`): `any`

#### Parameters

• **value**: `any`

• **deep**: `boolean` = `false`

#### Returns

`any`

#### Defined in

[src/elements/menus/models/menu-options.ts:54](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L54)

***

### init()

> **init**(): `void`

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).init`

#### Defined in

[src/core/node.ts:247](https://github.com/io-gui/io/blob/main/src/core/node.ts#L247)

***

### inputValue()

> **inputValue**(`value`): `void`

Sets value property and emits `value-input` event.
Use this when value property is set by user action (e.g. mouse click).

#### Parameters

• **value**: `any`

Property value.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).inputValue`

#### Defined in

[src/core/node.ts:235](https://github.com/io-gui/io/blob/main/src/core/node.ts#L235)

***

### lastChanged()

> **lastChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:169](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L169)

***

### objectMutated()

> **objectMutated**(`prop`): `void`

This function is called after `onObjectMutated()` determines that one of
the object properties has mutated.

#### Parameters

• **prop**: `string`

Mutated object property name.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).objectMutated`

#### Defined in

[src/core/node.ts:309](https://github.com/io-gui/io/blob/main/src/core/node.ts#L309)

***

### onObjectMutated()

> **onObjectMutated**(`event`): `void`

Event handler for 'object-mutated' event emitted from the `window`.
Node should be listening for this event if it has an observed object property

#### Parameters

• **event**: `CustomEvent`\<`any`\>

Event payload.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).onObjectMutated`

#### Defined in

[src/core/node.ts:288](https://github.com/io-gui/io/blob/main/src/core/node.ts#L288)

***

### pathChanged()

> **pathChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:119](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L119)

***

### push()

> **push**(...`items`): `void`

#### Parameters

• ...**items**: [`MenuItem`](MenuItem.md)[]

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:33](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L33)

***

### queue()

> **queue**(`prop`, `value`, `oldValue`): `void`

Adds property change to the queue.

#### Parameters

• **prop**: `string`

Property name.

• **value**: `any`

Property value.

• **oldValue**: `any`

Old property value.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).queue`

#### Defined in

[src/core/node.ts:254](https://github.com/io-gui/io/blob/main/src/core/node.ts#L254)

***

### removeEventListener()

> **removeEventListener**(`type`, `listener`?, `options`?): `void`

Wrapper for removeEventListener.

#### Parameters

• **type**: `string`

event name to listen to.

• **listener?**: [`AnyEventListener`](../type-aliases/AnyEventListener.md)

listener handler.

• **options?**: `AddEventListenerOptions`

event listener options.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).removeEventListener`

#### Defined in

[src/core/node.ts:368](https://github.com/io-gui/io/blob/main/src/core/node.ts#L368)

***

### selectDefault()

> **selectDefault**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/elements/menus/models/menu-options.ts:249](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L249)

***

### setProperties()

> **setProperties**(`props`): `void`

Sets multiple properties in batch.
[property]-changed` events will be broadcast in the end.

#### Parameters

• **props**: `any`

Map of property names and values.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).setProperties`

#### Defined in

[src/core/node.ts:217](https://github.com/io-gui/io/blob/main/src/core/node.ts#L217)

***

### setProperty()

> **setProperty**(`name`, `value`, `skipDispatch`?): `void`

Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.

#### Parameters

• **name**: `string`

Property name to set value of.

• **value**: `any`

Peroperty value.

• **skipDispatch?**: `boolean`

flag to skip event dispatch.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).setProperty`

#### Defined in

[src/core/node.ts:122](https://github.com/io-gui/io/blob/main/src/core/node.ts#L122)

***

### throttle()

> **throttle**(`func`, `arg`, `timeout`): `void`

Throttles function execution to next frame (rAF) if the function has been executed in the current frame.

#### Parameters

• **func**: [`CallbackFunction`](../type-aliases/CallbackFunction.md)

Function to throttle.

• **arg**: `any` = `undefined`

argument for throttled function.

• **timeout**: `number` = `1`

minimum delay in ms before executing the function.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).throttle`

#### Defined in

[src/core/node.ts:279](https://github.com/io-gui/io/blob/main/src/core/node.ts#L279)

***

### unbind()

> **unbind**(`prop`): `void`

Unbinds a binding to a specified property`.

#### Parameters

• **prop**: `string`

Property to unbind.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).unbind`

#### Defined in

[src/core/node.ts:337](https://github.com/io-gui/io/blob/main/src/core/node.ts#L337)

***

### updatePaths()

> **updatePaths**(`item`?): `void`

#### Parameters

• **item?**: [`MenuItem`](MenuItem.md)

#### Returns

`void`

#### Defined in

[src/elements/menus/models/menu-options.ts:199](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L199)
