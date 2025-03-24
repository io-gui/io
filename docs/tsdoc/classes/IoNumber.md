[**io-gui**](../README.md)

***

# Class: IoNumber

Defined in: [src/elements/basic/io-number.ts:15](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L15)

Input element for `Number` data type.
It clamps the `value` to `min` / `max` and rounds it to the nearest `step` increment.
If `ladder` property is enabled, it displays an interactive float ladder element when clicked/taped.
Alternatively, ladder can be expanded by middle click or ctrl key regardless of ladder property.

## Extends

- [`IoField`](IoField.md)

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### new IoNumber()

> **new IoNumber**(...`args`): [`IoNumber`](IoNumber.md)

Defined in: [src/core/element.ts:213](https://github.com/io-gui/io/blob/main/src/core/element.ts#L213)

#### Parameters

##### args

...`any`[]

#### Returns

[`IoNumber`](IoNumber.md)

#### Inherited from

[`IoField`](IoField.md).[`constructor`](IoField.md#constructors)

## Properties

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

Defined in: [src/core/node.ts:45](https://github.com/io-gui/io/blob/main/src/core/node.ts#L45)

#### Inherited from

[`IoField`](IoField.md).[`_bindings`](IoField.md#_bindings)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

Defined in: [src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

#### Inherited from

[`IoField`](IoField.md).[`_changeQueue`](IoField.md#_changequeue)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

Defined in: [src/core/node.ts:47](https://github.com/io-gui/io/blob/main/src/core/node.ts#L47)

#### Inherited from

[`IoField`](IoField.md).[`_eventDispatcher`](IoField.md#_eventdispatcher)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

Defined in: [src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

#### Inherited from

[`IoField`](IoField.md).[`_properties`](IoField.md#_properties)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

Defined in: [src/core/node.ts:43](https://github.com/io-gui/io/blob/main/src/core/node.ts#L43)

#### Inherited from

[`IoField`](IoField.md).[`_protochain`](IoField.md#_protochain)

***

### $

> **$**: `Record`\<`string`, `any`\>

Defined in: [src/core/element.ts:181](https://github.com/io-gui/io/blob/main/src/core/element.ts#L181)

#### Inherited from

[`IoField`](IoField.md).[`$`](IoField.md#$)

***

### appearance

> **appearance**: `"inset"` \| `"flush"` \| `"outset"`

Defined in: [src/elements/basic/io-number.ts:67](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L67)

#### Overrides

[`IoField`](IoField.md).[`appearance`](IoField.md#appearance)

***

### class

> **class**: `string`

Defined in: [src/core/element.ts:190](https://github.com/io-gui/io/blob/main/src/core/element.ts#L190)

#### Inherited from

[`IoField`](IoField.md).[`class`](IoField.md#class)

***

### contenteditable

> **contenteditable**: `boolean`

Defined in: [src/elements/basic/io-number.ts:52](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L52)

#### Overrides

[`IoField`](IoField.md).[`contenteditable`](IoField.md#contenteditable)

***

### conversion

> **conversion**: `number`

Defined in: [src/elements/basic/io-number.ts:37](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L37)

***

### disabled

> **disabled**: `boolean`

Defined in: [src/core/element.ts:211](https://github.com/io-gui/io/blob/main/src/core/element.ts#L211)

#### Inherited from

[`IoField`](IoField.md).[`disabled`](IoField.md#disabled)

***

### hidden

> **hidden**: `boolean`

Defined in: [src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

#### Inherited from

[`IoField`](IoField.md).[`hidden`](IoField.md#hidden)

***

### icon

> **icon**: `string`

Defined in: [src/elements/basic/io-field.ts:102](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L102)

#### Inherited from

[`IoField`](IoField.md).[`icon`](IoField.md#icon)

***

### id

> **id**: `string`

Defined in: [src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

#### Inherited from

[`IoField`](IoField.md).[`id`](IoField.md#id)

***

### inputmode

> **inputmode**: `string`

Defined in: [src/elements/basic/io-number.ts:61](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L61)

***

### invalid

> **invalid**: `boolean`

Defined in: [src/elements/basic/io-field.ts:114](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L114)

#### Inherited from

[`IoField`](IoField.md).[`invalid`](IoField.md#invalid)

***

### label

> **label**: `string`

Defined in: [src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

#### Inherited from

[`IoField`](IoField.md).[`label`](IoField.md#label)

***

### ladder

> **ladder**: `boolean`

Defined in: [src/elements/basic/io-number.ts:49](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L49)

***

### max

> **max**: `number`

Defined in: [src/elements/basic/io-number.ts:46](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L46)

***

### min

> **min**: `number`

Defined in: [src/elements/basic/io-number.ts:43](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L43)

***

### name

> **name**: `string`

Defined in: [src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

#### Inherited from

[`IoField`](IoField.md).[`name`](IoField.md#name)

***

### pattern

> **pattern**: `string`

Defined in: [src/elements/basic/io-number.ts:58](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L58)

***

### placeholder

> **placeholder**: `string`

Defined in: [src/elements/basic/io-field.ts:117](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L117)

#### Inherited from

[`IoField`](IoField.md).[`placeholder`](IoField.md#placeholder)

***

### role

> **role**: `string`

Defined in: [src/elements/basic/io-number.ts:31](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L31)

#### Overrides

[`IoField`](IoField.md).[`role`](IoField.md#role)

***

### selected

> **selected**: `boolean`

Defined in: [src/elements/basic/io-field.ts:111](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L111)

#### Inherited from

[`IoField`](IoField.md).[`selected`](IoField.md#selected)

***

### spellcheck

> **spellcheck**: `string`

Defined in: [src/elements/basic/io-number.ts:64](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L64)

***

### step

> **step**: `number`

Defined in: [src/elements/basic/io-number.ts:40](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L40)

***

### stroke

> **stroke**: `boolean`

Defined in: [src/elements/basic/io-field.ts:108](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L108)

#### Inherited from

[`IoField`](IoField.md).[`stroke`](IoField.md#stroke)

***

### tabindex

> **tabindex**: `string`

Defined in: [src/elements/basic/io-field.ts:96](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L96)

#### Inherited from

[`IoField`](IoField.md).[`tabindex`](IoField.md#tabindex)

***

### title

> **title**: `string`

Defined in: [src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

#### Inherited from

[`IoField`](IoField.md).[`title`](IoField.md#title)

***

### type

> **type**: `string`

Defined in: [src/elements/basic/io-number.ts:55](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L55)

***

### value

> **value**: `number`

Defined in: [src/elements/basic/io-number.ts:34](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L34)

#### Overrides

[`IoField`](IoField.md).[`value`](IoField.md#value)

## Accessors

### textNode

#### Get Signature

> **get** **textNode**(): `any`

Defined in: [src/core/element.ts:414](https://github.com/io-gui/io/blob/main/src/core/element.ts#L414)

##### Returns

`any`

#### Set Signature

> **set** **textNode**(`value`): `void`

Defined in: [src/core/element.ts:418](https://github.com/io-gui/io/blob/main/src/core/element.ts#L418)

##### Parameters

###### value

`any`

##### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`textNode`](IoField.md#textnode)

***

### Listeners

#### Get Signature

> **get** `static` **Listeners**(): `object`

Defined in: [src/elements/basic/io-field.ts:119](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L119)

##### Returns

`object`

###### click

> **click**: `string` = `'_onClick'`

###### focus

> **focus**: `string` = `'_onFocus'`

###### focus-to

> **focus-to**: `string` = `'_onFocusTo'`

###### pointerdown

> **pointerdown**: `string` = `'_onPointerdown'`

#### Inherited from

[`IoField`](IoField.md).[`Listeners`](IoField.md#listeners)

***

### Properties

#### Get Signature

> **get** `static` **Properties**(): [`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

Defined in: [src/core/node.ts:35](https://github.com/io-gui/io/blob/main/src/core/node.ts#L35)

##### Returns

[`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

#### Inherited from

[`IoField`](IoField.md).[`Properties`](IoField.md#properties)

***

### Style

#### Get Signature

> **get** `static` **Style**(): `string`

Defined in: [src/elements/basic/io-number.ts:16](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L16)

##### Returns

`string`

#### Overrides

[`IoField`](IoField.md).[`Style`](IoField.md#style)

## Methods

### \_expandLadder()

> **\_expandLadder**(): `void`

Defined in: [src/elements/basic/io-number.ts:117](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L117)

#### Returns

`void`

***

### \_flattenTextNode()

> **\_flattenTextNode**(`element`): `void`

Defined in: [src/core/element.ts:397](https://github.com/io-gui/io/blob/main/src/core/element.ts#L397)

Helper function to flatten textContent into a single TextNode.
Update textContent via TextNode is better for layout performance.

#### Parameters

##### element

Element to flatten.

`HTMLElement` | [`IoElement`](IoElement.md)

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`_flattenTextNode`](IoField.md#_flattentextnode)

***

### \_onBlur()

> **\_onBlur**(`event`): `void`

Defined in: [src/elements/basic/io-number.ts:71](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L71)

#### Parameters

##### event

`FocusEvent`

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`_onBlur`](IoField.md#_onblur)

***

### \_onClick()

> **\_onClick**(): `void`

Defined in: [src/elements/basic/io-field.ts:155](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L155)

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`_onClick`](IoField.md#_onclick)

***

### \_onFocus()

> **\_onFocus**(`event`): `void`

Defined in: [src/elements/basic/io-number.ts:111](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L111)

#### Parameters

##### event

`FocusEvent`

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`_onFocus`](IoField.md#_onfocus)

***

### \_onFocusTo()

> **\_onFocusTo**(`event`): `void`

Defined in: [src/elements/basic/io-field.ts:178](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L178)

#### Parameters

##### event

`CustomEvent`

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`_onFocusTo`](IoField.md#_onfocusto)

***

### \_onKeydown()

> **\_onKeydown**(`event`): `void`

Defined in: [src/elements/basic/io-number.ts:121](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L121)

#### Parameters

##### event

`KeyboardEvent`

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`_onKeydown`](IoField.md#_onkeydown)

***

### \_onKeyup()

> **\_onKeyup**(`event`): `void`

Defined in: [src/elements/basic/io-number.ts:181](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L181)

#### Parameters

##### event

`KeyboardEvent`

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`_onKeyup`](IoField.md#_onkeyup)

***

### \_onPointerdown()

> **\_onPointerdown**(`event`): `void`

Defined in: [src/elements/basic/io-number.ts:83](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L83)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`_onPointerdown`](IoField.md#_onpointerdown)

***

### \_onPointerleave()

> **\_onPointerleave**(`event`): `void`

Defined in: [src/elements/basic/io-field.ts:144](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L144)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`_onPointerleave`](IoField.md#_onpointerleave)

***

### \_onPointermove()

> **\_onPointermove**(`event`): `void`

Defined in: [src/elements/basic/io-field.ts:142](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L142)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`_onPointermove`](IoField.md#_onpointermove)

***

### \_onPointerup()

> **\_onPointerup**(`event`): `void`

Defined in: [src/elements/basic/io-number.ts:90](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L90)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`_onPointerup`](IoField.md#_onpointerup)

***

### \_setFromTextNode()

> **\_setFromTextNode**(): `void`

Defined in: [src/elements/basic/io-number.ts:188](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L188)

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

[`IoField`](IoField.md).[`addEventListener`](IoField.md#addeventlistener)

***

### applyProperties()

> **applyProperties**(`props`): `void`

Defined in: [src/core/element.ts:422](https://github.com/io-gui/io/blob/main/src/core/element.ts#L422)

Sets multiple properties in batch.
[property]-changed` events will be broadcast in the end.

#### Parameters

##### props

`any`

Map of property names and values.

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`applyProperties`](IoField.md#applyproperties)

***

### bind()

> **bind**(`name`): [`Binding`](Binding.md)

Defined in: [src/core/node.ts:310](https://github.com/io-gui/io/blob/main/src/core/node.ts#L310)

Returns a binding to a specified property`.

#### Parameters

##### name

`string`

Property name to bind to.

#### Returns

[`Binding`](Binding.md)

Binding object.

#### Inherited from

[`IoField`](IoField.md).[`bind`](IoField.md#bind)

***

### changed()

> **changed**(): `void`

Defined in: [src/elements/basic/io-number.ts:201](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L201)

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`changed`](IoField.md#changed)

***

### connectedCallback()

> **connectedCallback**(): `void`

Defined in: [src/core/element.ts:229](https://github.com/io-gui/io/blob/main/src/core/element.ts#L229)

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`connectedCallback`](IoField.md#connectedcallback)

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

[`IoField`](IoField.md).[`debounce`](IoField.md#debounce)

***

### disabledChanged()

> **disabledChanged**(): `void`

Defined in: [src/core/element.ts:451](https://github.com/io-gui/io/blob/main/src/core/element.ts#L451)

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`disabledChanged`](IoField.md#disabledchanged)

***

### disconnectedCallback()

> **disconnectedCallback**(): `void`

Defined in: [src/core/element.ts:237](https://github.com/io-gui/io/blob/main/src/core/element.ts#L237)

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`disconnectedCallback`](IoField.md#disconnectedcallback)

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

[`IoField`](IoField.md).[`dispatchEvent`](IoField.md#dispatchevent)

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

[`IoField`](IoField.md).[`dispatchQueue`](IoField.md#dispatchqueue)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/core/node.ts:369](https://github.com/io-gui/io/blob/main/src/core/node.ts#L369)

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`dispose`](IoField.md#dispose)

***

### focusTo()

> **focusTo**(`dir`): `void`

Defined in: [src/elements/basic/io-field.ts:285](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L285)

#### Parameters

##### dir

`string`

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`focusTo`](IoField.md#focusto)

***

### getCaretPosition()

> **getCaretPosition**(): `number`

Defined in: [src/elements/basic/io-field.ts:289](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L289)

#### Returns

`number`

#### Inherited from

[`IoField`](IoField.md).[`getCaretPosition`](IoField.md#getcaretposition)

***

### init()

> **init**(): `void`

Defined in: [src/elements/basic/io-number.ts:198](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L198)

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`init`](IoField.md#init)

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

[`IoField`](IoField.md).[`inputValue`](IoField.md#inputvalue)

***

### labelChanged()

> **labelChanged**(): `void`

Defined in: [src/core/element.ts:444](https://github.com/io-gui/io/blob/main/src/core/element.ts#L444)

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`labelChanged`](IoField.md#labelchanged)

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

[`IoField`](IoField.md).[`onPropertyMutated`](IoField.md#onpropertymutated)

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

[`IoField`](IoField.md).[`queue`](IoField.md#queue)

***

### Register()

> **Register**(`ioNodeConstructor`): `void`

Defined in: [src/core/element.ts:326](https://github.com/io-gui/io/blob/main/src/core/element.ts#L326)

#### Parameters

##### ioNodeConstructor

*typeof* [`IoNode`](IoNode.md)

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`Register`](IoField.md#register)

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

[`IoField`](IoField.md).[`removeEventListener`](IoField.md#removeeventlistener)

***

### setAttribute()

> **setAttribute**(`attr`, `value`): `void`

Defined in: [src/core/element.ts:435](https://github.com/io-gui/io/blob/main/src/core/element.ts#L435)

Alias for HTMLElement setAttribute where falsey values remove the attribute.

#### Parameters

##### attr

`string`

Attribute name.

##### value

Attribute value.

`string` | `number` | `boolean`

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`setAttribute`](IoField.md#setattribute)

***

### setCaretPosition()

> **setCaretPosition**(`position`): `void`

Defined in: [src/elements/basic/io-field.ts:302](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L302)

#### Parameters

##### position

`number`

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`setCaretPosition`](IoField.md#setcaretposition)

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

[`IoField`](IoField.md).[`setProperties`](IoField.md#setproperties)

***

### setProperty()

> **setProperty**(`name`, `value`, `debounce`): `void`

Defined in: [src/core/element.ts:243](https://github.com/io-gui/io/blob/main/src/core/element.ts#L243)

Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.

#### Parameters

##### name

`string`

Property name to set value of.

##### value

`any`

Peroperty value.

##### debounce

`boolean` = `false`

flag to skip event dispatch.

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`setProperty`](IoField.md#setproperty)

***

### template()

> **template**(`vDOM`, `host`?, `cache`?): `void`

Defined in: [src/core/element.ts:255](https://github.com/io-gui/io/blob/main/src/core/element.ts#L255)

Renders DOM from virtual DOM arrays.

#### Parameters

##### vDOM

`any`[]

Array of vDOM children.

##### host?

`HTMLElement`

Optional template target.

##### cache?

`boolean`

Optional don't reuse existing elements and skip dispose

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`template`](IoField.md#template)

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

[`IoField`](IoField.md).[`throttle`](IoField.md#throttle)

***

### traverse()

> **traverse**(`vChildren`, `host`?, `cache`?): `void`

Defined in: [src/core/element.ts:268](https://github.com/io-gui/io/blob/main/src/core/element.ts#L268)

Recurively traverses vDOM.
TODO: test element.traverse() function!

#### Parameters

##### vChildren

`any`[]

Array of vDOM children converted by `buildTree()` for easier parsing.

##### host?

`HTMLElement`

Optional template target.

##### cache?

`boolean`

Optional don't reuse existing elements and skip dispose

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`traverse`](IoField.md#traverse)

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

[`IoField`](IoField.md).[`unbind`](IoField.md#unbind)
