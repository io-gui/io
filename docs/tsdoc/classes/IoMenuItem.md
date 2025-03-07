[**io-gui**](../README.md)

***

# Class: IoMenuItem

Defined in: [src/elements/menus/io-menu-item.ts:16](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L16)

It displays `option.icon`, `option.label` and `option.hint` property and it creates expandable `IoMenuOptions` from the `option.options` array. Options are expand in the direction specified by `direction` property. If `selectable` property is set, selecting an option sets its `value` to the entire menu tree and `selected` atribute is set on menu items whose `option.value` matches selected value.

## Extends

- [`IoField`](IoField.md)

## Extended by

- [`IoMenuHamburger`](IoMenuHamburger.md)

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### new IoMenuItem()

> **new IoMenuItem**(...`args`): [`IoMenuItem`](IoMenuItem.md)

Defined in: [src/core/node.ts:52](https://github.com/io-gui/io/blob/main/src/core/node.ts#L52)

Creates a class instance and initializes the internals.

#### Parameters

##### args

...`any`[]

#### Returns

[`IoMenuItem`](IoMenuItem.md)

#### Inherited from

[`IoField`](IoField.md).[`constructor`](IoField.md#constructors)

## Properties

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

Defined in: [src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

#### Inherited from

[`IoField`](IoField.md).[`_bindings`](IoField.md#_bindings)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

Defined in: [src/core/node.ts:45](https://github.com/io-gui/io/blob/main/src/core/node.ts#L45)

#### Inherited from

[`IoField`](IoField.md).[`_changeQueue`](IoField.md#_changequeue)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

Defined in: [src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

#### Inherited from

[`IoField`](IoField.md).[`_eventDispatcher`](IoField.md#_eventdispatcher)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

Defined in: [src/core/node.ts:43](https://github.com/io-gui/io/blob/main/src/core/node.ts#L43)

#### Inherited from

[`IoField`](IoField.md).[`_properties`](IoField.md#_properties)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

Defined in: [src/core/node.ts:42](https://github.com/io-gui/io/blob/main/src/core/node.ts#L42)

#### Inherited from

[`IoField`](IoField.md).[`_protochain`](IoField.md#_protochain)

***

### $

> **$**: `Record`\<`string`, `any`\>

Defined in: [src/core/element.ts:179](https://github.com/io-gui/io/blob/main/src/core/element.ts#L179)

#### Inherited from

[`IoField`](IoField.md).[`$`](IoField.md#$)

***

### $options?

> `optional` **$options**: [`IoMenuOptions`](IoMenuOptions.md)

Defined in: [src/elements/menus/io-menu-item.ts:55](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L55)

***

### appearance

> **appearance**: `"inset"` \| `"flush"` \| `"outset"` \| `"neutral"`

Defined in: [src/elements/basic/io-field.ts:96](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L96)

#### Inherited from

[`IoField`](IoField.md).[`appearance`](IoField.md#appearance)

***

### class

> **class**: `string`

Defined in: [src/core/element.ts:188](https://github.com/io-gui/io/blob/main/src/core/element.ts#L188)

#### Inherited from

[`IoField`](IoField.md).[`class`](IoField.md#class)

***

### contenteditable

> **contenteditable**: `boolean`

Defined in: [src/core/element.ts:185](https://github.com/io-gui/io/blob/main/src/core/element.ts#L185)

#### Inherited from

[`IoField`](IoField.md).[`contenteditable`](IoField.md#contenteditable)

***

### depth

> **depth**: `number`

Defined in: [src/elements/menus/io-menu-item.ts:52](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L52)

***

### direction

> **direction**: `string`

Defined in: [src/elements/menus/io-menu-item.ts:49](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L49)

***

### disabled

> **disabled**: `boolean`

Defined in: [src/core/element.ts:209](https://github.com/io-gui/io/blob/main/src/core/element.ts#L209)

#### Inherited from

[`IoField`](IoField.md).[`disabled`](IoField.md#disabled)

***

### expanded

> **expanded**: `boolean`

Defined in: [src/elements/menus/io-menu-item.ts:46](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L46)

***

### hidden

> **hidden**: `boolean`

Defined in: [src/core/element.ts:206](https://github.com/io-gui/io/blob/main/src/core/element.ts#L206)

#### Inherited from

[`IoField`](IoField.md).[`hidden`](IoField.md#hidden)

***

### icon

> **icon**: `string`

Defined in: [src/elements/basic/io-field.ts:93](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L93)

#### Inherited from

[`IoField`](IoField.md).[`icon`](IoField.md#icon)

***

### id

> **id**: `string`

Defined in: [src/core/element.ts:203](https://github.com/io-gui/io/blob/main/src/core/element.ts#L203)

#### Inherited from

[`IoField`](IoField.md).[`id`](IoField.md#id)

***

### invalid

> **invalid**: `boolean`

Defined in: [src/elements/basic/io-field.ts:105](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L105)

#### Inherited from

[`IoField`](IoField.md).[`invalid`](IoField.md#invalid)

***

### item

> **item**: [`MenuItem`](MenuItem.md)

Defined in: [src/elements/menus/io-menu-item.ts:43](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L43)

***

### label

> **label**: `string`

Defined in: [src/core/element.ts:194](https://github.com/io-gui/io/blob/main/src/core/element.ts#L194)

#### Inherited from

[`IoField`](IoField.md).[`label`](IoField.md#label)

***

### name

> **name**: `string`

Defined in: [src/core/element.ts:197](https://github.com/io-gui/io/blob/main/src/core/element.ts#L197)

#### Inherited from

[`IoField`](IoField.md).[`name`](IoField.md#name)

***

### placeholder

> **placeholder**: `string`

Defined in: [src/elements/basic/io-field.ts:108](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L108)

#### Inherited from

[`IoField`](IoField.md).[`placeholder`](IoField.md#placeholder)

***

### role

> **role**: `string`

Defined in: [src/core/element.ts:191](https://github.com/io-gui/io/blob/main/src/core/element.ts#L191)

#### Inherited from

[`IoField`](IoField.md).[`role`](IoField.md#role)

***

### selected

> **selected**: `boolean`

Defined in: [src/elements/basic/io-field.ts:102](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L102)

#### Inherited from

[`IoField`](IoField.md).[`selected`](IoField.md#selected)

***

### stroke

> **stroke**: `boolean`

Defined in: [src/elements/basic/io-field.ts:99](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L99)

#### Inherited from

[`IoField`](IoField.md).[`stroke`](IoField.md#stroke)

***

### tabindex

> **tabindex**: `string`

Defined in: [src/elements/basic/io-field.ts:87](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L87)

#### Inherited from

[`IoField`](IoField.md).[`tabindex`](IoField.md#tabindex)

***

### title

> **title**: `string`

Defined in: [src/core/element.ts:200](https://github.com/io-gui/io/blob/main/src/core/element.ts#L200)

#### Inherited from

[`IoField`](IoField.md).[`title`](IoField.md#title)

***

### value

> **value**: `any`

Defined in: [src/elements/basic/io-field.ts:90](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L90)

#### Inherited from

[`IoField`](IoField.md).[`value`](IoField.md#value)

## Accessors

### $parent

#### Get Signature

> **get** **$parent**(): `any`

Defined in: [src/elements/menus/io-menu-item.ts:72](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L72)

##### Returns

`any`

***

### hasmore

#### Get Signature

> **get** **hasmore**(): `boolean`

Defined in: [src/elements/menus/io-menu-item.ts:66](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L66)

##### Returns

`boolean`

***

### inlayer

#### Get Signature

> **get** **inlayer**(): `boolean`

Defined in: [src/elements/menus/io-menu-item.ts:69](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L69)

##### Returns

`boolean`

***

### textNode

#### Get Signature

> **get** **textNode**(): `any`

Defined in: [src/core/element.ts:393](https://github.com/io-gui/io/blob/main/src/core/element.ts#L393)

##### Returns

`any`

#### Set Signature

> **set** **textNode**(`value`): `void`

Defined in: [src/core/element.ts:397](https://github.com/io-gui/io/blob/main/src/core/element.ts#L397)

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

> **get** `static` **Listeners**(): `any`

Defined in: [src/elements/menus/io-menu-item.ts:57](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L57)

##### Returns

`any`

#### Overrides

[`IoField`](IoField.md).[`Listeners`](IoField.md#listeners)

***

### Properties

#### Get Signature

> **get** `static` **Properties**(): [`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

Defined in: [src/core/node.ts:33](https://github.com/io-gui/io/blob/main/src/core/node.ts#L33)

##### Returns

[`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

#### Inherited from

[`IoField`](IoField.md).[`Properties`](IoField.md#properties)

***

### Style

#### Get Signature

> **get** `static` **Style**(): `string`

Defined in: [src/elements/menus/io-menu-item.ts:17](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L17)

##### Returns

`string`

#### Overrides

[`IoField`](IoField.md).[`Style`](IoField.md#style)

## Methods

### \_expandHovered()

> **\_expandHovered**(): `void`

Defined in: [src/elements/menus/io-menu-item.ts:219](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L219)

#### Returns

`void`

***

### \_flattenTextNode()

> **\_flattenTextNode**(`element`): `void`

Defined in: [src/core/element.ts:376](https://github.com/io-gui/io/blob/main/src/core/element.ts#L376)

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

### \_gethovered()

> **\_gethovered**(`event`): `undefined` \| `IoMenuElementType`

Defined in: [src/elements/menus/io-menu-item.ts:203](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L203)

#### Parameters

##### event

`PointerEvent`

#### Returns

`undefined` \| `IoMenuElementType`

***

### \_onBlur()

> **\_onBlur**(`event`): `void`

Defined in: [src/elements/basic/io-field.ts:123](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L123)

#### Parameters

##### event

`FocusEvent`

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`_onBlur`](IoField.md#_onblur)

***

### \_onClick()

> **\_onClick**(): `void`

Defined in: [src/elements/menus/io-menu-item.ts:95](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L95)

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`_onClick`](IoField.md#_onclick)

***

### \_onCollapse()

> **\_onCollapse**(): `void`

Defined in: [src/elements/menus/io-menu-item.ts:305](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L305)

#### Returns

`void`

***

### \_onCollapseRoot()

> **\_onCollapseRoot**(): `void`

Defined in: [src/elements/menus/io-menu-item.ts:308](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L308)

#### Returns

`void`

***

### \_onFocus()

> **\_onFocus**(`event`): `void`

Defined in: [src/elements/basic/io-field.ts:118](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L118)

#### Parameters

##### event

`FocusEvent`

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`_onFocus`](IoField.md#_onfocus)

***

### \_onFocusTo()

> **\_onFocusTo**(`event`): `void`

Defined in: [src/elements/basic/io-field.ts:168](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L168)

#### Parameters

##### event

`CustomEvent`

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`_onFocusTo`](IoField.md#_onfocusto)

***

### \_onItemClicked()

> **\_onItemClicked**(`event`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:120](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L120)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

***

### \_onKeydown()

> **\_onKeydown**(`event`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:240](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L240)

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

Defined in: [src/elements/basic/io-field.ts:167](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L167)

#### Parameters

##### event

`KeyboardEvent`

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`_onKeyup`](IoField.md#_onkeyup)

***

### \_onOverlayPointermove()

> **\_onOverlayPointermove**(`event`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:89](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L89)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

***

### \_onOverlayPointerup()

> **\_onOverlayPointerup**(`event`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:92](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L92)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

***

### \_onPointerdown()

> **\_onPointerdown**(`event`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:128](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L128)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`_onPointerdown`](IoField.md#_onpointerdown)

***

### \_onPointerdownAction()

> **\_onPointerdownAction**(`event`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:136](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L136)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

***

### \_onPointerleave()

> **\_onPointerleave**(`event`): `void`

Defined in: [src/elements/basic/io-field.ts:134](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L134)

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

Defined in: [src/elements/menus/io-menu-item.ts:149](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L149)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`_onPointermove`](IoField.md#_onpointermove)

***

### \_onPointermoveAction()

> **\_onPointermoveAction**(`event`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:153](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L153)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

***

### \_onPointerup()

> **\_onPointerup**(`event`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:186](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L186)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`_onPointerup`](IoField.md#_onpointerup)

***

### \_onPointerupAction()

> **\_onPointerupAction**(`event`, `skipCollapse`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:192](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L192)

#### Parameters

##### event

`PointerEvent`

##### skipCollapse

`boolean` = `false`

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

[`IoField`](IoField.md).[`addEventListener`](IoField.md#addeventlistener)

***

### applyProperties()

> **applyProperties**(`props`): `void`

Defined in: [src/core/element.ts:401](https://github.com/io-gui/io/blob/main/src/core/element.ts#L401)

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

> **bind**(`prop`): [`Binding`](Binding.md)

Defined in: [src/core/node.ts:309](https://github.com/io-gui/io/blob/main/src/core/node.ts#L309)

Returns a binding to a specified property`.

#### Parameters

##### prop

`string`

Property to bind to.

#### Returns

[`Binding`](Binding.md)

Binding object.

#### Inherited from

[`IoField`](IoField.md).[`bind`](IoField.md#bind)

***

### changed()

> **changed**(): `void`

Defined in: [src/elements/menus/io-menu-item.ts:348](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L348)

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`changed`](IoField.md#changed)

***

### connectedCallback()

> **connectedCallback**(): `void`

Defined in: [src/elements/menus/io-menu-item.ts:76](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L76)

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`connectedCallback`](IoField.md#connectedcallback)

***

### disabledChanged()

> **disabledChanged**(): `void`

Defined in: [src/core/element.ts:430](https://github.com/io-gui/io/blob/main/src/core/element.ts#L430)

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`disabledChanged`](IoField.md#disabledchanged)

***

### disconnectedCallback()

> **disconnectedCallback**(): `void`

Defined in: [src/elements/menus/io-menu-item.ts:83](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L83)

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`disconnectedCallback`](IoField.md#disconnectedcallback)

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

[`IoField`](IoField.md).[`dispatchEvent`](IoField.md#dispatchevent)

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

[`IoField`](IoField.md).[`dispatchMutationEvent`](IoField.md#dispatchmutationevent)

***

### dispatchQueue()

> **dispatchQueue**(): `void`

Defined in: [src/core/node.ts:249](https://github.com/io-gui/io/blob/main/src/core/node.ts#L249)

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`dispatchQueue`](IoField.md#dispatchqueue)

***

### dispatchQueueSync()

> **dispatchQueueSync**(): `void`

Defined in: [src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`dispatchQueueSync`](IoField.md#dispatchqueuesync)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/core/node.ts:381](https://github.com/io-gui/io/blob/main/src/core/node.ts#L381)

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`dispose`](IoField.md#dispose)

***

### expandedChanged()

> **expandedChanged**(): `void`

Defined in: [src/elements/menus/io-menu-item.ts:311](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L311)

#### Returns

`void`

***

### focusTo()

> **focusTo**(`dir`): `void`

Defined in: [src/elements/basic/io-field.ts:275](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L275)

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

Defined in: [src/elements/basic/io-field.ts:279](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L279)

#### Returns

`number`

#### Inherited from

[`IoField`](IoField.md).[`getCaretPosition`](IoField.md#getcaretposition)

***

### init()

> **init**(): `void`

Defined in: [src/core/node.ts:236](https://github.com/io-gui/io/blob/main/src/core/node.ts#L236)

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`init`](IoField.md#init)

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

[`IoField`](IoField.md).[`inputValue`](IoField.md#inputvalue)

***

### labelChanged()

> **labelChanged**(): `void`

Defined in: [src/core/element.ts:423](https://github.com/io-gui/io/blob/main/src/core/element.ts#L423)

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`labelChanged`](IoField.md#labelchanged)

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

[`IoField`](IoField.md).[`objectMutated`](IoField.md#objectmutated)

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

[`IoField`](IoField.md).[`onObjectMutated`](IoField.md#onobjectmutated)

***

### preventDefault()

> **preventDefault**(`event`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:62](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L62)

#### Parameters

##### event

`Event`

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

[`IoField`](IoField.md).[`queue`](IoField.md#queue)

***

### Register()

> **Register**(`ioNodeConstructor`): `void`

Defined in: [src/core/element.ts:305](https://github.com/io-gui/io/blob/main/src/core/element.ts#L305)

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

[`IoField`](IoField.md).[`removeEventListener`](IoField.md#removeeventlistener)

***

### setAttribute()

> **setAttribute**(`attr`, `value`): `void`

Defined in: [src/core/element.ts:414](https://github.com/io-gui/io/blob/main/src/core/element.ts#L414)

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

Defined in: [src/elements/basic/io-field.ts:292](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L292)

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

[`IoField`](IoField.md).[`setProperties`](IoField.md#setproperties)

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

[`IoField`](IoField.md).[`setProperty`](IoField.md#setproperty)

***

### template()

> **template**(`vDOM`, `host`?, `cache`?): `void`

Defined in: [src/core/element.ts:234](https://github.com/io-gui/io/blob/main/src/core/element.ts#L234)

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

[`IoField`](IoField.md).[`throttle`](IoField.md#throttle)

***

### traverse()

> **traverse**(`vChildren`, `host`?, `cache`?): `void`

Defined in: [src/core/element.ts:247](https://github.com/io-gui/io/blob/main/src/core/element.ts#L247)

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

[`IoField`](IoField.md).[`unbind`](IoField.md#unbind)
