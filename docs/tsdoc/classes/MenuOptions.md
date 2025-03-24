[**io-gui**](../README.md)

***

# Class: MenuOptions

Defined in: [src/elements/menus/models/menu-options.ts:16](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L16)

## Extends

- `IoNodeMixinConstructor`\<`ArrayConstructor`, `this`\>

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### new MenuOptions()

> **new MenuOptions**(`args`, `properties`): [`MenuOptions`](MenuOptions.md)

Defined in: [src/elements/menus/models/menu-options.ts:61](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L61)

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

Defined in: [src/core/node.ts:45](https://github.com/io-gui/io/blob/main/src/core/node.ts#L45)

#### Inherited from

`IoNodeMixin(Array)._bindings`

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

Defined in: [src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

#### Inherited from

`IoNodeMixin(Array)._changeQueue`

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

Defined in: [src/core/node.ts:47](https://github.com/io-gui/io/blob/main/src/core/node.ts#L47)

#### Inherited from

`IoNodeMixin(Array)._eventDispatcher`

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

Defined in: [src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

#### Inherited from

`IoNodeMixin(Array)._properties`

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

Defined in: [src/core/node.ts:43](https://github.com/io-gui/io/blob/main/src/core/node.ts#L43)

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

Defined in: [src/core/node.ts:35](https://github.com/io-gui/io/blob/main/src/core/node.ts#L35)

##### Returns

[`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

#### Inherited from

`IoNodeMixin(Array).Properties`

## Methods

### \_onItemSelectedChanged()

> **\_onItemSelectedChanged**(`event`): `void`

Defined in: [src/elements/menus/models/menu-options.ts:213](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L213)

#### Parameters

##### event

`CustomEvent`

#### Returns

`void`

***

### \_onSubOptionsPathChanged()

> **\_onSubOptionsPathChanged**(`event`): `void`

Defined in: [src/elements/menus/models/menu-options.ts:230](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L230)

#### Parameters

##### event

`CustomEvent`

#### Returns

`void`

***

### addEventListener()

> **addEventListener**(`type`, `listener`, `options`?): `void`

Defined in: [src/core/node.ts:339](https://github.com/io-gui/io/blob/main/src/core/node.ts#L339)

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

Defined in: [src/core/node.ts:116](https://github.com/io-gui/io/blob/main/src/core/node.ts#L116)

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

Defined in: [src/elements/menus/models/menu-options.ts:250](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L250)

Returns a binding to a specified property`.

#### Parameters

##### prop

`string`

#### Returns

[`Binding`](Binding.md)

Binding object.

#### Overrides

`IoNodeMixin(Array).bind`

***

### changed()

> **changed**(): `void`

Defined in: [src/core/node.ts:239](https://github.com/io-gui/io/blob/main/src/core/node.ts#L239)

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).changed`

***

### debounce()

> **debounce**(`func`, `arg`, `timeout`): `void`

Defined in: [src/core/node.ts:279](https://github.com/io-gui/io/blob/main/src/core/node.ts#L279)

Debounces function execution to next frame (rAF).

#### Parameters

##### func

[`CallbackFunction`](../type-aliases/CallbackFunction.md)

Function to throttle.

##### arg

`any` = `undefined`

argument for debounced function.

##### timeout

`number` = `1`

minimum delay in ms before executing the function.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).debounce`

***

### dispatchEvent()

> **dispatchEvent**(`type`, `detail`, `bubbles`, `src`?): `void`

Defined in: [src/core/node.ts:362](https://github.com/io-gui/io/blob/main/src/core/node.ts#L362)

Wrapper for dispatchEvent.

#### Parameters

##### type

`string`

event name to dispatch.

##### detail

`any` = `undefined`

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

### dispatchQueue()

> **dispatchQueue**(`debounce`): `void`

Defined in: [src/core/node.ts:255](https://github.com/io-gui/io/blob/main/src/core/node.ts#L255)

Dispatches the queue in the next rAF cycle if `reactivity` property is set to `"debounced"`. Otherwise it dispatches the queue immediately.

#### Parameters

##### debounce

`boolean` = `false`

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).dispatchQueue`

***

### dispose()

> **dispose**(): `void`

Defined in: [src/elements/menus/models/menu-options.ts:257](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L257)

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Overrides

`IoNodeMixin(Array).dispose`

***

### firstChanged()

> **firstChanged**(): `void`

Defined in: [src/elements/menus/models/menu-options.ts:141](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L141)

#### Returns

`void`

***

### getItem()

> **getItem**(`value`, `deep`): `any`

Defined in: [src/elements/menus/models/menu-options.ts:50](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L50)

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

Defined in: [src/core/node.ts:241](https://github.com/io-gui/io/blob/main/src/core/node.ts#L241)

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).init`

***

### inputValue()

> **inputValue**(`value`): `void`

Defined in: [src/core/node.ts:227](https://github.com/io-gui/io/blob/main/src/core/node.ts#L227)

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

Defined in: [src/elements/menus/models/menu-options.ts:157](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L157)

#### Returns

`void`

***

### onPropertyMutated()

> **onPropertyMutated**(`event`): `void`

Defined in: [src/core/node.ts:291](https://github.com/io-gui/io/blob/main/src/core/node.ts#L291)

Event handler for 'object-mutated' events emitted from the properties which are IoNode instances.
Aditionally, it handles events emitted from the `window` object (used for observing non-IoNode object properties).
NOTE: non-IoNode objects don't emit 'object-mutated' event automatically - something needs to emit this for them.
This is used to evoke '[propName]Mutated()' mutation handler

#### Parameters

##### event

`CustomEvent`

Event payload.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).onPropertyMutated`

***

### pathChanged()

> **pathChanged**(): `void`

Defined in: [src/elements/menus/models/menu-options.ts:113](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L113)

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

> **queue**(`name`, `value`, `oldValue`): `void`

Defined in: [src/core/node.ts:248](https://github.com/io-gui/io/blob/main/src/core/node.ts#L248)

Adds property change to the queue.

#### Parameters

##### name

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

Defined in: [src/core/node.ts:404](https://github.com/io-gui/io/blob/main/src/core/node.ts#L404)

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

Defined in: [src/core/node.ts:352](https://github.com/io-gui/io/blob/main/src/core/node.ts#L352)

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

Defined in: [src/elements/menus/models/menu-options.ts:235](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L235)

#### Returns

`boolean`

***

### setProperties()

> **setProperties**(`props`): `void`

Defined in: [src/core/node.ts:135](https://github.com/io-gui/io/blob/main/src/core/node.ts#L135)

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

> **setProperty**(`name`, `value`, `debounce`?): `void`

Defined in: [src/core/node.ts:151](https://github.com/io-gui/io/blob/main/src/core/node.ts#L151)

Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.

#### Parameters

##### name

`string`

Property name to set value of.

##### value

`any`

Peroperty value.

##### debounce?

`boolean` = `false`

flag to skip event dispatch.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).setProperty`

***

### throttle()

> **throttle**(`func`, `arg`): `void`

Defined in: [src/core/node.ts:270](https://github.com/io-gui/io/blob/main/src/core/node.ts#L270)

Throttles function execution once per frame (rAF).

#### Parameters

##### func

[`CallbackFunction`](../type-aliases/CallbackFunction.md)

Function to throttle.

##### arg

`any` = `undefined`

argument for throttled function.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).throttle`

***

### unbind()

> **unbind**(`name`): `void`

Defined in: [src/core/node.ts:323](https://github.com/io-gui/io/blob/main/src/core/node.ts#L323)

Unbinds a binding to a specified property`.

#### Parameters

##### name

`string`

Property name to unbind.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(Array).unbind`

***

### updatePaths()

> **updatePaths**(`item`?): `void`

Defined in: [src/elements/menus/models/menu-options.ts:185](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-options.ts#L185)

#### Parameters

##### item?

[`MenuItem`](MenuItem.md)

#### Returns

`void`
