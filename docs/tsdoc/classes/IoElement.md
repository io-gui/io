[**io-gui**](../README.md) • **Docs**

***

[io-gui](../README.md) / IoElement

# Class: IoElement

Core `IoElement` class.

## Extends

- `IoNodeMixinConstructor`\<() => `HTMLElement`, `this`\>

## Extended by

- [`IoGl`](IoGl.md)
- [`IoOverlay`](IoOverlay.md)
- [`IoLabel`](IoLabel.md)
- [`IoField`](IoField.md)
- [`IoNumberLadder`](IoNumberLadder.md)
- [`IoIcon`](IoIcon.md)
- [`IoColorBase`](IoColorBase.md)
- [`IoColorPicker`](IoColorPicker.md)
- [`IoCollapsable`](IoCollapsable.md)
- [`IoMdView`](IoMdView.md)
- [`IoSelector`](IoSelector.md)
- [`IoScroller`](IoScroller.md)
- [`IoNavigatorBase`](IoNavigatorBase.md)
- [`IoVector`](IoVector.md)
- [`IoMenuTree`](IoMenuTree.md)
- [`IoMenuOptions`](IoMenuOptions.md)
- [`IoOptionMenu`](IoOptionMenu.md)
- [`IoContextMenu`](IoContextMenu.md)
- [`IoNotify`](IoNotify.md)
- [`IoBreadcrumbs`](IoBreadcrumbs.md)
- [`IoInspector`](IoInspector.md)
- [`IoObject`](IoObject.md)
- [`IoProperties`](IoProperties.md)
- [`IoNumberSliderRange`](IoNumberSliderRange.md)
- [`IoNumberSlider`](IoNumberSlider.md)

## Constructors

### new IoElement()

> **new IoElement**(...`args`): [`IoElement`](IoElement.md)

Creates a class instance and initializes the internals.

#### Parameters

• ...**args**: `any`[]

#### Returns

[`IoElement`](IoElement.md)

#### Inherited from

`IoNodeMixin(HTMLElement).constructor`

#### Defined in

[src/core/node.ts:63](https://github.com/io-gui/io/blob/main/src/core/node.ts#L63)

## Properties

### $

> **$**: `Record`\<`string`, `any`\>

#### Defined in

[src/core/element.ts:178](https://github.com/io-gui/io/blob/main/src/core/element.ts#L178)

***

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

`IoNodeMixin(HTMLElement)._bindings`

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

`IoNodeMixin(HTMLElement)._changeQueue`

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

`IoNodeMixin(HTMLElement)._eventDispatcher`

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

`IoNodeMixin(HTMLElement)._properties`

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

`IoNodeMixin(HTMLElement)._protochain`

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

***

### class

> **class**: `string`

#### Defined in

[src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

***

### contenteditable

> **contenteditable**: `boolean`

#### Defined in

[src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

***

### disabled

> **disabled**: `boolean`

#### Defined in

[src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

***

### hidden

> **hidden**: `boolean`

#### Defined in

[src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

***

### id

> **id**: `string`

#### Defined in

[src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

***

### label

> **label**: `string`

#### Defined in

[src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

***

### name

> **name**: `string`

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

***

### role

> **role**: `string`

#### Defined in

[src/core/element.ts:190](https://github.com/io-gui/io/blob/main/src/core/element.ts#L190)

***

### tabindex

> **tabindex**: `string`

#### Defined in

[src/core/element.ts:181](https://github.com/io-gui/io/blob/main/src/core/element.ts#L181)

***

### title

> **title**: `string`

#### Defined in

[src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

## Accessors

### textNode

> `get` **textNode**(): `any`

> `set` **textNode**(`value`): `void`

#### Parameters

• **value**: `any`

#### Returns

`any`

#### Defined in

[src/core/element.ts:392](https://github.com/io-gui/io/blob/main/src/core/element.ts#L392)

***

### Properties

> `get` `static` **Properties**(): [`PropertyDeclarations`](../type-aliases/PropertyDeclarations.md)

#### Returns

[`PropertyDeclarations`](../type-aliases/PropertyDeclarations.md)

#### Inherited from

`IoNodeMixin(HTMLElement).Properties`

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

***

### Style

> `get` `static` **Style**(): `string`

#### Returns

`string`

#### Defined in

[src/core/element.ts:157](https://github.com/io-gui/io/blob/main/src/core/element.ts#L157)

## Methods

### Register()

> **Register**(`ioNodeConstructor`): `void`

#### Parameters

• **ioNodeConstructor**: *typeof* [`IoNode`](IoNode.md)

#### Returns

`void`

#### Overrides

`IoNodeMixin(HTMLElement).Register`

#### Defined in

[src/core/element.ts:304](https://github.com/io-gui/io/blob/main/src/core/element.ts#L304)

***

### \_flattenTextNode()

> **\_flattenTextNode**(`element`): `void`

Helper function to flatten textContent into a single TextNode.
Update textContent via TextNode is better for layout performance.

#### Parameters

• **element**: `HTMLElement` \| [`IoElement`](IoElement.md)

Element to flatten.

#### Returns

`void`

#### Defined in

[src/core/element.ts:375](https://github.com/io-gui/io/blob/main/src/core/element.ts#L375)

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

`IoNodeMixin(HTMLElement).addEventListener`

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

#### Overrides

`IoNodeMixin(HTMLElement).applyProperties`

#### Defined in

[src/core/element.ts:400](https://github.com/io-gui/io/blob/main/src/core/element.ts#L400)

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

#### Inherited from

`IoNodeMixin(HTMLElement).bind`

#### Defined in

[src/core/node.ts:320](https://github.com/io-gui/io/blob/main/src/core/node.ts#L320)

***

### changed()

> **changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(HTMLElement).changed`

#### Defined in

[src/core/node.ts:246](https://github.com/io-gui/io/blob/main/src/core/node.ts#L246)

***

### connectedCallback()

> **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Defined in

[src/core/element.ts:213](https://github.com/io-gui/io/blob/main/src/core/element.ts#L213)

***

### disabledChanged()

> **disabledChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

***

### disconnectedCallback()

> **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Defined in

[src/core/element.ts:221](https://github.com/io-gui/io/blob/main/src/core/element.ts#L221)

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

`IoNodeMixin(HTMLElement).dispatchEvent`

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

`IoNodeMixin(HTMLElement).dispatchMutationEvent`

#### Defined in

[src/core/node.ts:385](https://github.com/io-gui/io/blob/main/src/core/node.ts#L385)

***

### dispatchQueue()

> **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(HTMLElement).dispatchQueue`

#### Defined in

[src/core/node.ts:260](https://github.com/io-gui/io/blob/main/src/core/node.ts#L260)

***

### dispatchQueueSync()

> **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(HTMLElement).dispatchQueueSync`

#### Defined in

[src/core/node.ts:270](https://github.com/io-gui/io/blob/main/src/core/node.ts#L270)

***

### dispose()

> **dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

`IoNodeMixin(HTMLElement).dispose`

#### Defined in

[src/core/node.ts:392](https://github.com/io-gui/io/blob/main/src/core/node.ts#L392)

***

### init()

> **init**(): `void`

#### Returns

`void`

#### Inherited from

`IoNodeMixin(HTMLElement).init`

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

`IoNodeMixin(HTMLElement).inputValue`

#### Defined in

[src/core/node.ts:235](https://github.com/io-gui/io/blob/main/src/core/node.ts#L235)

***

### labelChanged()

> **labelChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/core/element.ts:422](https://github.com/io-gui/io/blob/main/src/core/element.ts#L422)

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

`IoNodeMixin(HTMLElement).objectMutated`

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

`IoNodeMixin(HTMLElement).onObjectMutated`

#### Defined in

[src/core/node.ts:288](https://github.com/io-gui/io/blob/main/src/core/node.ts#L288)

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

`IoNodeMixin(HTMLElement).queue`

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

`IoNodeMixin(HTMLElement).removeEventListener`

#### Defined in

[src/core/node.ts:368](https://github.com/io-gui/io/blob/main/src/core/node.ts#L368)

***

### setAttribute()

> **setAttribute**(`attr`, `value`): `void`

Alias for HTMLElement setAttribute where falsey values remove the attribute.

#### Parameters

• **attr**: `string`

Attribute name.

• **value**: `string` \| `number` \| `boolean`

Attribute value.

#### Returns

`void`

#### Defined in

[src/core/element.ts:413](https://github.com/io-gui/io/blob/main/src/core/element.ts#L413)

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

`IoNodeMixin(HTMLElement).setProperties`

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

`IoNodeMixin(HTMLElement).setProperty`

#### Defined in

[src/core/node.ts:122](https://github.com/io-gui/io/blob/main/src/core/node.ts#L122)

***

### template()

> **template**(`vDOM`, `host`?, `cache`?): `void`

Renders DOM from virtual DOM arrays.

#### Parameters

• **vDOM**: `any`[]

Array of vDOM children.

• **host?**: `HTMLElement`

Optional template target.

• **cache?**: `boolean`

Optional don't reuse existing elements and skip dispose

#### Returns

`void`

#### Defined in

[src/core/element.ts:233](https://github.com/io-gui/io/blob/main/src/core/element.ts#L233)

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

`IoNodeMixin(HTMLElement).throttle`

#### Defined in

[src/core/node.ts:279](https://github.com/io-gui/io/blob/main/src/core/node.ts#L279)

***

### traverse()

> **traverse**(`vChildren`, `host`?, `cache`?): `void`

Recurively traverses vDOM.
TODO: test element.traverse() function!

#### Parameters

• **vChildren**: `any`[]

Array of vDOM children converted by `buildTree()` for easier parsing.

• **host?**: `HTMLElement`

Optional template target.

• **cache?**: `boolean`

Optional don't reuse existing elements and skip dispose

#### Returns

`void`

#### Defined in

[src/core/element.ts:246](https://github.com/io-gui/io/blob/main/src/core/element.ts#L246)

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

`IoNodeMixin(HTMLElement).unbind`

#### Defined in

[src/core/node.ts:337](https://github.com/io-gui/io/blob/main/src/core/node.ts#L337)
