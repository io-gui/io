[**io-gui**](../README.md) • **Docs**

***

[io-gui](../README.md) / IoField

# Class: IoField

Core `IoElement` class.

## Extends

- [`IoElement`](IoElement.md)

## Extended by

- [`IoButton`](IoButton.md)
- [`IoBoolean`](IoBoolean.md)
- [`IoString`](IoString.md)
- [`IoNumber`](IoNumber.md)
- [`IoNumberLadderStep`](IoNumberLadderStep.md)
- [`IoMenuItem`](IoMenuItem.md)

## Constructors

### new IoField()

> **new IoField**(...`args`): [`IoField`](IoField.md)

Creates a class instance and initializes the internals.

#### Parameters

• ...**args**: `any`[]

#### Returns

[`IoField`](IoField.md)

#### Inherited from

[`IoElement`](IoElement.md).[`constructor`](IoElement.md#constructors)

#### Defined in

[src/core/node.ts:63](https://github.com/io-gui/io/blob/main/src/core/node.ts#L63)

## Properties

### $

> **$**: `Record`\<`string`, `any`\>

#### Inherited from

[`IoElement`](IoElement.md).[`$`](IoElement.md#$)

#### Defined in

[src/core/element.ts:178](https://github.com/io-gui/io/blob/main/src/core/element.ts#L178)

***

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[`IoElement`](IoElement.md).[`_bindings`](IoElement.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[`IoElement`](IoElement.md).[`_changeQueue`](IoElement.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[`IoElement`](IoElement.md).[`_eventDispatcher`](IoElement.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[`IoElement`](IoElement.md).[`_properties`](IoElement.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[`IoElement`](IoElement.md).[`_protochain`](IoElement.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

***

### appearance

> **appearance**: `"inset"` \| `"flush"` \| `"outset"` \| `"neutral"`

#### Defined in

[src/elements/basic/io-field.ts:86](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L86)

***

### class

> **class**: `string`

#### Inherited from

[`IoElement`](IoElement.md).[`class`](IoElement.md#class)

#### Defined in

[src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

***

### contenteditable

> **contenteditable**: `boolean`

#### Inherited from

[`IoElement`](IoElement.md).[`contenteditable`](IoElement.md#contenteditable)

#### Defined in

[src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

***

### disabled

> **disabled**: `boolean`

#### Inherited from

[`IoElement`](IoElement.md).[`disabled`](IoElement.md#disabled)

#### Defined in

[src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

***

### hidden

> **hidden**: `boolean`

#### Inherited from

[`IoElement`](IoElement.md).[`hidden`](IoElement.md#hidden)

#### Defined in

[src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

***

### icon

> **icon**: `string`

#### Defined in

[src/elements/basic/io-field.ts:83](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L83)

***

### id

> **id**: `string`

#### Inherited from

[`IoElement`](IoElement.md).[`id`](IoElement.md#id)

#### Defined in

[src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

***

### invalid

> **invalid**: `boolean`

#### Defined in

[src/elements/basic/io-field.ts:95](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L95)

***

### label

> **label**: `string`

#### Inherited from

[`IoElement`](IoElement.md).[`label`](IoElement.md#label)

#### Defined in

[src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

***

### name

> **name**: `string`

#### Inherited from

[`IoElement`](IoElement.md).[`name`](IoElement.md#name)

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

***

### placeholder

> **placeholder**: `string`

#### Defined in

[src/elements/basic/io-field.ts:98](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L98)

***

### role

> **role**: `string`

#### Inherited from

[`IoElement`](IoElement.md).[`role`](IoElement.md#role)

#### Defined in

[src/core/element.ts:190](https://github.com/io-gui/io/blob/main/src/core/element.ts#L190)

***

### selected

> **selected**: `boolean`

#### Defined in

[src/elements/basic/io-field.ts:92](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L92)

***

### stroke

> **stroke**: `boolean`

#### Defined in

[src/elements/basic/io-field.ts:89](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L89)

***

### tabindex

> **tabindex**: `string`

#### Overrides

[`IoElement`](IoElement.md).[`tabindex`](IoElement.md#tabindex)

#### Defined in

[src/elements/basic/io-field.ts:77](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L77)

***

### title

> **title**: `string`

#### Inherited from

[`IoElement`](IoElement.md).[`title`](IoElement.md#title)

#### Defined in

[src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

***

### value

> **value**: `any`

#### Defined in

[src/elements/basic/io-field.ts:80](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L80)

## Accessors

### textNode

> `get` **textNode**(): `any`

> `set` **textNode**(`value`): `void`

#### Parameters

• **value**: `any`

#### Returns

`any`

#### Inherited from

[`IoElement`](IoElement.md).[`textNode`](IoElement.md#textnode)

#### Defined in

[src/core/element.ts:392](https://github.com/io-gui/io/blob/main/src/core/element.ts#L392)

***

### Listeners

> `get` `static` **Listeners**(): `object`

#### Returns

`object`

##### click

> **click**: `string` = `'_onClick'`

##### focus

> **focus**: `string` = `'_onFocus'`

##### focus-to

> **focus-to**: `string` = `'_onFocusTo'`

##### pointerdown

> **pointerdown**: `string` = `'_onPointerdown'`

#### Defined in

[src/elements/basic/io-field.ts:100](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L100)

***

### Properties

> `get` `static` **Properties**(): [`PropertyDeclarations`](../type-aliases/PropertyDeclarations.md)

#### Returns

[`PropertyDeclarations`](../type-aliases/PropertyDeclarations.md)

#### Inherited from

[`IoElement`](IoElement.md).[`Properties`](IoElement.md#properties)

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

***

### Style

> `get` `static` **Style**(): `string`

#### Returns

`string`

#### Overrides

[`IoElement`](IoElement.md).[`Style`](IoElement.md#style)

#### Defined in

[src/elements/basic/io-field.ts:16](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L16)

## Methods

### Register()

> **Register**(`ioNodeConstructor`): `void`

#### Parameters

• **ioNodeConstructor**: *typeof* [`IoNode`](IoNode.md)

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`Register`](IoElement.md#register)

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

#### Inherited from

[`IoElement`](IoElement.md).[`_flattenTextNode`](IoElement.md#_flattentextnode)

#### Defined in

[src/core/element.ts:375](https://github.com/io-gui/io/blob/main/src/core/element.ts#L375)

***

### \_onBlur()

> **\_onBlur**(`event`): `void`

#### Parameters

• **event**: `FocusEvent`

#### Returns

`void`

#### Defined in

[src/elements/basic/io-field.ts:113](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L113)

***

### \_onClick()

> **\_onClick**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/basic/io-field.ts:136](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L136)

***

### \_onFocus()

> **\_onFocus**(`event`): `void`

#### Parameters

• **event**: `FocusEvent`

#### Returns

`void`

#### Defined in

[src/elements/basic/io-field.ts:108](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L108)

***

### \_onFocusTo()

> **\_onFocusTo**(`event`): `void`

#### Parameters

• **event**: `CustomEvent`\<`any`\>

#### Returns

`void`

#### Defined in

[src/elements/basic/io-field.ts:159](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L159)

***

### \_onKeydown()

> **\_onKeydown**(`event`): `void`

#### Parameters

• **event**: `KeyboardEvent`

#### Returns

`void`

#### Defined in

[src/elements/basic/io-field.ts:139](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L139)

***

### \_onKeyup()

> **\_onKeyup**(`event`): `void`

#### Parameters

• **event**: `KeyboardEvent`

#### Returns

`void`

#### Defined in

[src/elements/basic/io-field.ts:158](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L158)

***

### \_onPointerdown()

> **\_onPointerdown**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Defined in

[src/elements/basic/io-field.ts:118](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L118)

***

### \_onPointerleave()

> **\_onPointerleave**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Defined in

[src/elements/basic/io-field.ts:125](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L125)

***

### \_onPointermove()

> **\_onPointermove**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Defined in

[src/elements/basic/io-field.ts:124](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L124)

***

### \_onPointerup()

> **\_onPointerup**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Defined in

[src/elements/basic/io-field.ts:130](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L130)

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

[`IoElement`](IoElement.md).[`addEventListener`](IoElement.md#addeventlistener)

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

[`IoElement`](IoElement.md).[`applyProperties`](IoElement.md#applyproperties)

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

[`IoElement`](IoElement.md).[`bind`](IoElement.md#bind)

#### Defined in

[src/core/node.ts:320](https://github.com/io-gui/io/blob/main/src/core/node.ts#L320)

***

### changed()

> **changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

[`IoElement`](IoElement.md).[`changed`](IoElement.md#changed)

#### Defined in

[src/elements/basic/io-field.ts:294](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L294)

***

### connectedCallback()

> **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`connectedCallback`](IoElement.md#connectedcallback)

#### Defined in

[src/core/element.ts:213](https://github.com/io-gui/io/blob/main/src/core/element.ts#L213)

***

### disabledChanged()

> **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`disabledChanged`](IoElement.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

***

### disconnectedCallback()

> **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`disconnectedCallback`](IoElement.md#disconnectedcallback)

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

[`IoElement`](IoElement.md).[`dispatchEvent`](IoElement.md#dispatchevent)

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

[`IoElement`](IoElement.md).[`dispatchMutationEvent`](IoElement.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:385](https://github.com/io-gui/io/blob/main/src/core/node.ts#L385)

***

### dispatchQueue()

> **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`dispatchQueue`](IoElement.md#dispatchqueue)

#### Defined in

[src/core/node.ts:260](https://github.com/io-gui/io/blob/main/src/core/node.ts#L260)

***

### dispatchQueueSync()

> **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`dispatchQueueSync`](IoElement.md#dispatchqueuesync)

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

[`IoElement`](IoElement.md).[`dispose`](IoElement.md#dispose)

#### Defined in

[src/core/node.ts:392](https://github.com/io-gui/io/blob/main/src/core/node.ts#L392)

***

### focusTo()

> **focusTo**(`dir`): `void`

#### Parameters

• **dir**: `string`

#### Returns

`void`

#### Defined in

[src/elements/basic/io-field.ts:266](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L266)

***

### getCaretPosition()

> **getCaretPosition**(): `number`

#### Returns

`number`

#### Defined in

[src/elements/basic/io-field.ts:270](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L270)

***

### init()

> **init**(): `void`

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`init`](IoElement.md#init)

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

[`IoElement`](IoElement.md).[`inputValue`](IoElement.md#inputvalue)

#### Defined in

[src/core/node.ts:235](https://github.com/io-gui/io/blob/main/src/core/node.ts#L235)

***

### labelChanged()

> **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`labelChanged`](IoElement.md#labelchanged)

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

[`IoElement`](IoElement.md).[`objectMutated`](IoElement.md#objectmutated)

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

[`IoElement`](IoElement.md).[`onObjectMutated`](IoElement.md#onobjectmutated)

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

[`IoElement`](IoElement.md).[`queue`](IoElement.md#queue)

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

[`IoElement`](IoElement.md).[`removeEventListener`](IoElement.md#removeeventlistener)

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

#### Inherited from

[`IoElement`](IoElement.md).[`setAttribute`](IoElement.md#setattribute)

#### Defined in

[src/core/element.ts:413](https://github.com/io-gui/io/blob/main/src/core/element.ts#L413)

***

### setCaretPosition()

> **setCaretPosition**(`position`): `void`

#### Parameters

• **position**: `number`

#### Returns

`void`

#### Defined in

[src/elements/basic/io-field.ts:283](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L283)

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

[`IoElement`](IoElement.md).[`setProperties`](IoElement.md#setproperties)

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

[`IoElement`](IoElement.md).[`setProperty`](IoElement.md#setproperty)

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

#### Inherited from

[`IoElement`](IoElement.md).[`template`](IoElement.md#template)

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

[`IoElement`](IoElement.md).[`throttle`](IoElement.md#throttle)

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

#### Inherited from

[`IoElement`](IoElement.md).[`traverse`](IoElement.md#traverse)

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

[`IoElement`](IoElement.md).[`unbind`](IoElement.md#unbind)

#### Defined in

[src/core/node.ts:337](https://github.com/io-gui/io/blob/main/src/core/node.ts#L337)
