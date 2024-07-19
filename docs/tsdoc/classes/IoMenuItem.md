[**io-gui**](../README.md) • **Docs**

***

[io-gui](../README.md) / IoMenuItem

# Class: IoMenuItem

It displays `option.icon`, `option.label` and `option.hint` property and it creates expandable `IoMenuOptions` from the `option.options` array. Options are expand in the direction specified by `direction` property. If `selectable` property is set, selecting an option sets its `value` to the entire menu tree and `selected` atribute is set on menu items whose `option.value` matches selected value.

## Extends

- [`IoField`](IoField.md)

## Extended by

- [`IoMenuHamburger`](IoMenuHamburger.md)

## Constructors

### new IoMenuItem()

> **new IoMenuItem**(...`args`): [`IoMenuItem`](IoMenuItem.md)

Creates a class instance and initializes the internals.

#### Parameters

• ...**args**: `any`[]

#### Returns

[`IoMenuItem`](IoMenuItem.md)

#### Inherited from

[`IoField`](IoField.md).[`constructor`](IoField.md#constructors)

#### Defined in

[src/core/node.ts:63](https://github.com/io-gui/io/blob/main/src/core/node.ts#L63)

## Properties

### $

> **$**: `Record`\<`string`, `any`\>

#### Inherited from

[`IoField`](IoField.md).[`$`](IoField.md#$)

#### Defined in

[src/core/element.ts:178](https://github.com/io-gui/io/blob/main/src/core/element.ts#L178)

***

### $options?

> `optional` **$options**: [`IoMenuOptions`](IoMenuOptions.md)

#### Defined in

[src/elements/menus/io-menu-item.ts:56](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L56)

***

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[`IoField`](IoField.md).[`_bindings`](IoField.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[`IoField`](IoField.md).[`_changeQueue`](IoField.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[`IoField`](IoField.md).[`_eventDispatcher`](IoField.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[`IoField`](IoField.md).[`_properties`](IoField.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[`IoField`](IoField.md).[`_protochain`](IoField.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

***

### appearance

> **appearance**: `"inset"` \| `"flush"` \| `"outset"` \| `"neutral"`

#### Inherited from

[`IoField`](IoField.md).[`appearance`](IoField.md#appearance)

#### Defined in

[src/elements/basic/io-field.ts:86](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L86)

***

### class

> **class**: `string`

#### Inherited from

[`IoField`](IoField.md).[`class`](IoField.md#class)

#### Defined in

[src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

***

### contenteditable

> **contenteditable**: `boolean`

#### Inherited from

[`IoField`](IoField.md).[`contenteditable`](IoField.md#contenteditable)

#### Defined in

[src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

***

### depth

> **depth**: `number`

#### Defined in

[src/elements/menus/io-menu-item.ts:53](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L53)

***

### direction

> **direction**: `string`

#### Defined in

[src/elements/menus/io-menu-item.ts:50](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L50)

***

### disabled

> **disabled**: `boolean`

#### Inherited from

[`IoField`](IoField.md).[`disabled`](IoField.md#disabled)

#### Defined in

[src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

***

### expanded

> **expanded**: `boolean`

#### Defined in

[src/elements/menus/io-menu-item.ts:47](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L47)

***

### hidden

> **hidden**: `boolean`

#### Inherited from

[`IoField`](IoField.md).[`hidden`](IoField.md#hidden)

#### Defined in

[src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

***

### icon

> **icon**: `string`

#### Inherited from

[`IoField`](IoField.md).[`icon`](IoField.md#icon)

#### Defined in

[src/elements/basic/io-field.ts:83](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L83)

***

### id

> **id**: `string`

#### Inherited from

[`IoField`](IoField.md).[`id`](IoField.md#id)

#### Defined in

[src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

***

### invalid

> **invalid**: `boolean`

#### Inherited from

[`IoField`](IoField.md).[`invalid`](IoField.md#invalid)

#### Defined in

[src/elements/basic/io-field.ts:95](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L95)

***

### item

> **item**: [`MenuItem`](MenuItem.md)

#### Defined in

[src/elements/menus/io-menu-item.ts:44](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L44)

***

### label

> **label**: `string`

#### Inherited from

[`IoField`](IoField.md).[`label`](IoField.md#label)

#### Defined in

[src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

***

### name

> **name**: `string`

#### Inherited from

[`IoField`](IoField.md).[`name`](IoField.md#name)

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

***

### placeholder

> **placeholder**: `string`

#### Inherited from

[`IoField`](IoField.md).[`placeholder`](IoField.md#placeholder)

#### Defined in

[src/elements/basic/io-field.ts:98](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L98)

***

### role

> **role**: `string`

#### Inherited from

[`IoField`](IoField.md).[`role`](IoField.md#role)

#### Defined in

[src/core/element.ts:190](https://github.com/io-gui/io/blob/main/src/core/element.ts#L190)

***

### selected

> **selected**: `boolean`

#### Inherited from

[`IoField`](IoField.md).[`selected`](IoField.md#selected)

#### Defined in

[src/elements/basic/io-field.ts:92](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L92)

***

### stroke

> **stroke**: `boolean`

#### Inherited from

[`IoField`](IoField.md).[`stroke`](IoField.md#stroke)

#### Defined in

[src/elements/basic/io-field.ts:89](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L89)

***

### tabindex

> **tabindex**: `string`

#### Inherited from

[`IoField`](IoField.md).[`tabindex`](IoField.md#tabindex)

#### Defined in

[src/elements/basic/io-field.ts:77](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L77)

***

### title

> **title**: `string`

#### Inherited from

[`IoField`](IoField.md).[`title`](IoField.md#title)

#### Defined in

[src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

***

### value

> **value**: `any`

#### Inherited from

[`IoField`](IoField.md).[`value`](IoField.md#value)

#### Defined in

[src/elements/basic/io-field.ts:80](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L80)

## Accessors

### $parent

> `get` **$parent**(): `any`

#### Returns

`any`

#### Defined in

[src/elements/menus/io-menu-item.ts:73](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L73)

***

### hasmore

> `get` **hasmore**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/elements/menus/io-menu-item.ts:67](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L67)

***

### inlayer

> `get` **inlayer**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/elements/menus/io-menu-item.ts:70](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L70)

***

### textNode

> `get` **textNode**(): `any`

> `set` **textNode**(`value`): `void`

#### Parameters

• **value**: `any`

#### Returns

`any`

#### Inherited from

[`IoField`](IoField.md).[`textNode`](IoField.md#textnode)

#### Defined in

[src/core/element.ts:392](https://github.com/io-gui/io/blob/main/src/core/element.ts#L392)

***

### Listeners

> `get` `static` **Listeners**(): `any`

#### Returns

`any`

#### Overrides

[`IoField`](IoField.md).[`Listeners`](IoField.md#listeners)

#### Defined in

[src/elements/menus/io-menu-item.ts:58](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L58)

***

### Properties

> `get` `static` **Properties**(): [`PropertyDeclarations`](../type-aliases/PropertyDeclarations.md)

#### Returns

[`PropertyDeclarations`](../type-aliases/PropertyDeclarations.md)

#### Inherited from

[`IoField`](IoField.md).[`Properties`](IoField.md#properties)

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

***

### Style

> `get` `static` **Style**(): `string`

#### Returns

`string`

#### Overrides

[`IoField`](IoField.md).[`Style`](IoField.md#style)

#### Defined in

[src/elements/menus/io-menu-item.ts:17](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L17)

## Methods

### Register()

> **Register**(`ioNodeConstructor`): `void`

#### Parameters

• **ioNodeConstructor**: *typeof* [`IoNode`](IoNode.md)

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`Register`](IoField.md#register)

#### Defined in

[src/core/element.ts:304](https://github.com/io-gui/io/blob/main/src/core/element.ts#L304)

***

### \_expandHovered()

> **\_expandHovered**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:220](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L220)

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

[`IoField`](IoField.md).[`_flattenTextNode`](IoField.md#_flattentextnode)

#### Defined in

[src/core/element.ts:375](https://github.com/io-gui/io/blob/main/src/core/element.ts#L375)

***

### \_gethovered()

> **\_gethovered**(`event`): `undefined` \| `IoMenuElementType`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`undefined` \| `IoMenuElementType`

#### Defined in

[src/elements/menus/io-menu-item.ts:204](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L204)

***

### \_onBlur()

> **\_onBlur**(`event`): `void`

#### Parameters

• **event**: `FocusEvent`

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`_onBlur`](IoField.md#_onblur)

#### Defined in

[src/elements/basic/io-field.ts:113](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L113)

***

### \_onClick()

> **\_onClick**(): `void`

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`_onClick`](IoField.md#_onclick)

#### Defined in

[src/elements/menus/io-menu-item.ts:96](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L96)

***

### \_onCollapse()

> **\_onCollapse**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:306](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L306)

***

### \_onCollapseRoot()

> **\_onCollapseRoot**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:309](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L309)

***

### \_onFocus()

> **\_onFocus**(`event`): `void`

#### Parameters

• **event**: `FocusEvent`

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`_onFocus`](IoField.md#_onfocus)

#### Defined in

[src/elements/basic/io-field.ts:108](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L108)

***

### \_onFocusTo()

> **\_onFocusTo**(`event`): `void`

#### Parameters

• **event**: `CustomEvent`\<`any`\>

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`_onFocusTo`](IoField.md#_onfocusto)

#### Defined in

[src/elements/basic/io-field.ts:159](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L159)

***

### \_onItemClicked()

> **\_onItemClicked**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:121](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L121)

***

### \_onKeydown()

> **\_onKeydown**(`event`): `void`

#### Parameters

• **event**: `KeyboardEvent`

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`_onKeydown`](IoField.md#_onkeydown)

#### Defined in

[src/elements/menus/io-menu-item.ts:241](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L241)

***

### \_onKeyup()

> **\_onKeyup**(`event`): `void`

#### Parameters

• **event**: `KeyboardEvent`

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`_onKeyup`](IoField.md#_onkeyup)

#### Defined in

[src/elements/basic/io-field.ts:158](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L158)

***

### \_onOverlayPointermove()

> **\_onOverlayPointermove**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:90](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L90)

***

### \_onOverlayPointerup()

> **\_onOverlayPointerup**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:93](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L93)

***

### \_onPointerdown()

> **\_onPointerdown**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`_onPointerdown`](IoField.md#_onpointerdown)

#### Defined in

[src/elements/menus/io-menu-item.ts:129](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L129)

***

### \_onPointerdownAction()

> **\_onPointerdownAction**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:137](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L137)

***

### \_onPointerleave()

> **\_onPointerleave**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`_onPointerleave`](IoField.md#_onpointerleave)

#### Defined in

[src/elements/basic/io-field.ts:125](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L125)

***

### \_onPointermove()

> **\_onPointermove**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`_onPointermove`](IoField.md#_onpointermove)

#### Defined in

[src/elements/menus/io-menu-item.ts:150](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L150)

***

### \_onPointermoveAction()

> **\_onPointermoveAction**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:154](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L154)

***

### \_onPointerup()

> **\_onPointerup**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`_onPointerup`](IoField.md#_onpointerup)

#### Defined in

[src/elements/menus/io-menu-item.ts:187](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L187)

***

### \_onPointerupAction()

> **\_onPointerupAction**(`event`, `skipCollapse`): `void`

#### Parameters

• **event**: `PointerEvent`

• **skipCollapse**: `boolean` = `false`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:193](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L193)

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

[`IoField`](IoField.md).[`addEventListener`](IoField.md#addeventlistener)

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

[`IoField`](IoField.md).[`applyProperties`](IoField.md#applyproperties)

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

[`IoField`](IoField.md).[`bind`](IoField.md#bind)

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

[`IoField`](IoField.md).[`changed`](IoField.md#changed)

#### Defined in

[src/elements/menus/io-menu-item.ts:349](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L349)

***

### connectedCallback()

> **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`connectedCallback`](IoField.md#connectedcallback)

#### Defined in

[src/elements/menus/io-menu-item.ts:77](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L77)

***

### disabledChanged()

> **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`disabledChanged`](IoField.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

***

### disconnectedCallback()

> **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Overrides

[`IoField`](IoField.md).[`disconnectedCallback`](IoField.md#disconnectedcallback)

#### Defined in

[src/elements/menus/io-menu-item.ts:84](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L84)

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

[`IoField`](IoField.md).[`dispatchEvent`](IoField.md#dispatchevent)

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

[`IoField`](IoField.md).[`dispatchMutationEvent`](IoField.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:385](https://github.com/io-gui/io/blob/main/src/core/node.ts#L385)

***

### dispatchQueue()

> **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`dispatchQueue`](IoField.md#dispatchqueue)

#### Defined in

[src/core/node.ts:260](https://github.com/io-gui/io/blob/main/src/core/node.ts#L260)

***

### dispatchQueueSync()

> **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`dispatchQueueSync`](IoField.md#dispatchqueuesync)

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

[`IoField`](IoField.md).[`dispose`](IoField.md#dispose)

#### Defined in

[src/core/node.ts:392](https://github.com/io-gui/io/blob/main/src/core/node.ts#L392)

***

### expandedChanged()

> **expandedChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:312](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L312)

***

### focusTo()

> **focusTo**(`dir`): `void`

#### Parameters

• **dir**: `string`

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`focusTo`](IoField.md#focusto)

#### Defined in

[src/elements/basic/io-field.ts:266](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L266)

***

### getCaretPosition()

> **getCaretPosition**(): `number`

#### Returns

`number`

#### Inherited from

[`IoField`](IoField.md).[`getCaretPosition`](IoField.md#getcaretposition)

#### Defined in

[src/elements/basic/io-field.ts:270](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L270)

***

### init()

> **init**(): `void`

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`init`](IoField.md#init)

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

[`IoField`](IoField.md).[`inputValue`](IoField.md#inputvalue)

#### Defined in

[src/core/node.ts:235](https://github.com/io-gui/io/blob/main/src/core/node.ts#L235)

***

### labelChanged()

> **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`labelChanged`](IoField.md#labelchanged)

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

[`IoField`](IoField.md).[`objectMutated`](IoField.md#objectmutated)

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

[`IoField`](IoField.md).[`onObjectMutated`](IoField.md#onobjectmutated)

#### Defined in

[src/core/node.ts:288](https://github.com/io-gui/io/blob/main/src/core/node.ts#L288)

***

### preventDefault()

> **preventDefault**(`event`): `void`

#### Parameters

• **event**: `Event`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:63](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L63)

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

[`IoField`](IoField.md).[`queue`](IoField.md#queue)

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

[`IoField`](IoField.md).[`removeEventListener`](IoField.md#removeeventlistener)

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

[`IoField`](IoField.md).[`setAttribute`](IoField.md#setattribute)

#### Defined in

[src/core/element.ts:413](https://github.com/io-gui/io/blob/main/src/core/element.ts#L413)

***

### setCaretPosition()

> **setCaretPosition**(`position`): `void`

#### Parameters

• **position**: `number`

#### Returns

`void`

#### Inherited from

[`IoField`](IoField.md).[`setCaretPosition`](IoField.md#setcaretposition)

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

[`IoField`](IoField.md).[`setProperties`](IoField.md#setproperties)

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

[`IoField`](IoField.md).[`setProperty`](IoField.md#setproperty)

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

[`IoField`](IoField.md).[`template`](IoField.md#template)

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

[`IoField`](IoField.md).[`throttle`](IoField.md#throttle)

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

[`IoField`](IoField.md).[`traverse`](IoField.md#traverse)

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

[`IoField`](IoField.md).[`unbind`](IoField.md#unbind)

#### Defined in

[src/core/node.ts:337](https://github.com/io-gui/io/blob/main/src/core/node.ts#L337)
