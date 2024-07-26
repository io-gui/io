[**io-gui**](../README.md) • **Docs**

***

[io-gui](../README.md) / IoMenuHamburger

# Class: IoMenuHamburger

It displays `option.icon`, `option.label` and `option.hint` property and it creates expandable `IoMenuOptions` from the `option.options` array. Options are expand in the direction specified by `direction` property. If `selectable` property is set, selecting an option sets its `value` to the entire menu tree and `selected` atribute is set on menu items whose `option.value` matches selected value.

## Extends

- [`IoMenuItem`](IoMenuItem.md)

## Constructors

### new IoMenuHamburger()

> **new IoMenuHamburger**(...`args`): [`IoMenuHamburger`](IoMenuHamburger.md)

Creates a class instance and initializes the internals.

#### Parameters

• ...**args**: `any`[]

#### Returns

[`IoMenuHamburger`](IoMenuHamburger.md)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`constructor`](IoMenuItem.md#constructors)

#### Defined in

[src/core/node.ts:63](https://github.com/io-gui/io/blob/main/src/core/node.ts#L63)

## Properties

### $

> **$**: `Record`\<`string`, `any`\>

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`$`](IoMenuItem.md#$)

#### Defined in

[src/core/element.ts:178](https://github.com/io-gui/io/blob/main/src/core/element.ts#L178)

***

### $options?

> `optional` **$options**: [`IoMenuOptions`](IoMenuOptions.md)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`$options`](IoMenuItem.md#$options)

#### Defined in

[src/elements/menus/io-menu-item.ts:56](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L56)

***

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_bindings`](IoMenuItem.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_changeQueue`](IoMenuItem.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_eventDispatcher`](IoMenuItem.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_properties`](IoMenuItem.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_protochain`](IoMenuItem.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

***

### appearance

> **appearance**: `"inset"` \| `"flush"` \| `"outset"` \| `"neutral"`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`appearance`](IoMenuItem.md#appearance)

#### Defined in

[src/elements/basic/io-field.ts:95](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L95)

***

### class

> **class**: `string`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`class`](IoMenuItem.md#class)

#### Defined in

[src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

***

### contenteditable

> **contenteditable**: `boolean`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`contenteditable`](IoMenuItem.md#contenteditable)

#### Defined in

[src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

***

### depth

> **depth**: `number`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`depth`](IoMenuItem.md#depth)

#### Defined in

[src/elements/menus/io-menu-item.ts:53](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L53)

***

### direction

> **direction**: `string`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`direction`](IoMenuItem.md#direction)

#### Defined in

[src/elements/menus/io-menu-item.ts:50](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L50)

***

### disabled

> **disabled**: `boolean`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`disabled`](IoMenuItem.md#disabled)

#### Defined in

[src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

***

### expanded

> **expanded**: `boolean`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`expanded`](IoMenuItem.md#expanded)

#### Defined in

[src/elements/menus/io-menu-item.ts:47](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L47)

***

### hidden

> **hidden**: `boolean`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`hidden`](IoMenuItem.md#hidden)

#### Defined in

[src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

***

### icon

> **icon**: `string`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`icon`](IoMenuItem.md#icon)

#### Defined in

[src/elements/basic/io-field.ts:92](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L92)

***

### id

> **id**: `string`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`id`](IoMenuItem.md#id)

#### Defined in

[src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

***

### invalid

> **invalid**: `boolean`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`invalid`](IoMenuItem.md#invalid)

#### Defined in

[src/elements/basic/io-field.ts:104](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L104)

***

### item

> **item**: [`MenuItem`](MenuItem.md)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`item`](IoMenuItem.md#item)

#### Defined in

[src/elements/menus/io-menu-item.ts:44](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L44)

***

### label

> **label**: `string`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`label`](IoMenuItem.md#label)

#### Defined in

[src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

***

### name

> **name**: `string`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`name`](IoMenuItem.md#name)

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

***

### placeholder

> **placeholder**: `string`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`placeholder`](IoMenuItem.md#placeholder)

#### Defined in

[src/elements/basic/io-field.ts:107](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L107)

***

### role

> **role**: `string`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`role`](IoMenuItem.md#role)

#### Defined in

[src/core/element.ts:190](https://github.com/io-gui/io/blob/main/src/core/element.ts#L190)

***

### selected

> **selected**: `boolean`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`selected`](IoMenuItem.md#selected)

#### Defined in

[src/elements/basic/io-field.ts:101](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L101)

***

### stroke

> **stroke**: `boolean`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`stroke`](IoMenuItem.md#stroke)

#### Defined in

[src/elements/basic/io-field.ts:98](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L98)

***

### tabindex

> **tabindex**: `string`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`tabindex`](IoMenuItem.md#tabindex)

#### Defined in

[src/elements/basic/io-field.ts:86](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L86)

***

### title

> **title**: `string`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`title`](IoMenuItem.md#title)

#### Defined in

[src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

***

### value

> **value**: `any`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`value`](IoMenuItem.md#value)

#### Defined in

[src/elements/basic/io-field.ts:89](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L89)

## Accessors

### $parent

> `get` **$parent**(): `any`

#### Returns

`any`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`$parent`](IoMenuItem.md#$parent)

#### Defined in

[src/elements/menus/io-menu-item.ts:73](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L73)

***

### hasmore

> `get` **hasmore**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`hasmore`](IoMenuItem.md#hasmore)

#### Defined in

[src/elements/menus/io-menu-item.ts:67](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L67)

***

### inlayer

> `get` **inlayer**(): `boolean`

#### Returns

`boolean`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`inlayer`](IoMenuItem.md#inlayer)

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

[`IoMenuItem`](IoMenuItem.md).[`textNode`](IoMenuItem.md#textnode)

#### Defined in

[src/core/element.ts:392](https://github.com/io-gui/io/blob/main/src/core/element.ts#L392)

***

### Listeners

> `get` `static` **Listeners**(): `any`

#### Returns

`any`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`Listeners`](IoMenuItem.md#listeners)

#### Defined in

[src/elements/menus/io-menu-item.ts:58](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L58)

***

### Properties

> `get` `static` **Properties**(): [`PropertyDeclarations`](../type-aliases/PropertyDeclarations.md)

#### Returns

[`PropertyDeclarations`](../type-aliases/PropertyDeclarations.md)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`Properties`](IoMenuItem.md#properties)

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

***

### Style

> `get` `static` **Style**(): `string`

#### Returns

`string`

#### Overrides

[`IoMenuItem`](IoMenuItem.md).[`Style`](IoMenuItem.md#style)

#### Defined in

[src/elements/menus/io-menu-hamburger.ts:6](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-hamburger.ts#L6)

## Methods

### Register()

> **Register**(`ioNodeConstructor`): `void`

#### Parameters

• **ioNodeConstructor**: *typeof* [`IoNode`](IoNode.md)

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`Register`](IoMenuItem.md#register)

#### Defined in

[src/core/element.ts:304](https://github.com/io-gui/io/blob/main/src/core/element.ts#L304)

***

### \_expandHovered()

> **\_expandHovered**(): `void`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_expandHovered`](IoMenuItem.md#_expandhovered)

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

[`IoMenuItem`](IoMenuItem.md).[`_flattenTextNode`](IoMenuItem.md#_flattentextnode)

#### Defined in

[src/core/element.ts:375](https://github.com/io-gui/io/blob/main/src/core/element.ts#L375)

***

### \_gethovered()

> **\_gethovered**(`event`): `undefined` \| `IoMenuElementType`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`undefined` \| `IoMenuElementType`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_gethovered`](IoMenuItem.md#_gethovered)

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

[`IoMenuItem`](IoMenuItem.md).[`_onBlur`](IoMenuItem.md#_onblur)

#### Defined in

[src/elements/basic/io-field.ts:122](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L122)

***

### \_onClick()

> **\_onClick**(): `void`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onClick`](IoMenuItem.md#_onclick)

#### Defined in

[src/elements/menus/io-menu-item.ts:96](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L96)

***

### \_onCollapse()

> **\_onCollapse**(): `void`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onCollapse`](IoMenuItem.md#_oncollapse)

#### Defined in

[src/elements/menus/io-menu-item.ts:306](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L306)

***

### \_onCollapseRoot()

> **\_onCollapseRoot**(): `void`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onCollapseRoot`](IoMenuItem.md#_oncollapseroot)

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

[`IoMenuItem`](IoMenuItem.md).[`_onFocus`](IoMenuItem.md#_onfocus)

#### Defined in

[src/elements/basic/io-field.ts:117](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L117)

***

### \_onFocusTo()

> **\_onFocusTo**(`event`): `void`

#### Parameters

• **event**: `CustomEvent`\<`any`\>

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onFocusTo`](IoMenuItem.md#_onfocusto)

#### Defined in

[src/elements/basic/io-field.ts:167](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L167)

***

### \_onItemClicked()

> **\_onItemClicked**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onItemClicked`](IoMenuItem.md#_onitemclicked)

#### Defined in

[src/elements/menus/io-menu-item.ts:121](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L121)

***

### \_onKeydown()

> **\_onKeydown**(`event`): `void`

#### Parameters

• **event**: `KeyboardEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onKeydown`](IoMenuItem.md#_onkeydown)

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

[`IoMenuItem`](IoMenuItem.md).[`_onKeyup`](IoMenuItem.md#_onkeyup)

#### Defined in

[src/elements/basic/io-field.ts:166](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L166)

***

### \_onOverlayPointermove()

> **\_onOverlayPointermove**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onOverlayPointermove`](IoMenuItem.md#_onoverlaypointermove)

#### Defined in

[src/elements/menus/io-menu-item.ts:90](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L90)

***

### \_onOverlayPointerup()

> **\_onOverlayPointerup**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onOverlayPointerup`](IoMenuItem.md#_onoverlaypointerup)

#### Defined in

[src/elements/menus/io-menu-item.ts:93](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L93)

***

### \_onPointerdown()

> **\_onPointerdown**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onPointerdown`](IoMenuItem.md#_onpointerdown)

#### Defined in

[src/elements/menus/io-menu-item.ts:129](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L129)

***

### \_onPointerdownAction()

> **\_onPointerdownAction**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onPointerdownAction`](IoMenuItem.md#_onpointerdownaction)

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

[`IoMenuItem`](IoMenuItem.md).[`_onPointerleave`](IoMenuItem.md#_onpointerleave)

#### Defined in

[src/elements/basic/io-field.ts:133](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L133)

***

### \_onPointermove()

> **\_onPointermove**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onPointermove`](IoMenuItem.md#_onpointermove)

#### Defined in

[src/elements/menus/io-menu-item.ts:150](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L150)

***

### \_onPointermoveAction()

> **\_onPointermoveAction**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onPointermoveAction`](IoMenuItem.md#_onpointermoveaction)

#### Defined in

[src/elements/menus/io-menu-item.ts:154](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L154)

***

### \_onPointerup()

> **\_onPointerup**(`event`): `void`

#### Parameters

• **event**: `PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onPointerup`](IoMenuItem.md#_onpointerup)

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

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onPointerupAction`](IoMenuItem.md#_onpointerupaction)

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

[`IoMenuItem`](IoMenuItem.md).[`addEventListener`](IoMenuItem.md#addeventlistener)

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

[`IoMenuItem`](IoMenuItem.md).[`applyProperties`](IoMenuItem.md#applyproperties)

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

[`IoMenuItem`](IoMenuItem.md).[`bind`](IoMenuItem.md#bind)

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

[`IoMenuItem`](IoMenuItem.md).[`changed`](IoMenuItem.md#changed)

#### Defined in

[src/elements/menus/io-menu-hamburger.ts:19](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-hamburger.ts#L19)

***

### connectedCallback()

> **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`connectedCallback`](IoMenuItem.md#connectedcallback)

#### Defined in

[src/elements/menus/io-menu-item.ts:77](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L77)

***

### disabledChanged()

> **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`disabledChanged`](IoMenuItem.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

***

### disconnectedCallback()

> **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`disconnectedCallback`](IoMenuItem.md#disconnectedcallback)

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

[`IoMenuItem`](IoMenuItem.md).[`dispatchEvent`](IoMenuItem.md#dispatchevent)

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

[`IoMenuItem`](IoMenuItem.md).[`dispatchMutationEvent`](IoMenuItem.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:385](https://github.com/io-gui/io/blob/main/src/core/node.ts#L385)

***

### dispatchQueue()

> **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`dispatchQueue`](IoMenuItem.md#dispatchqueue)

#### Defined in

[src/core/node.ts:260](https://github.com/io-gui/io/blob/main/src/core/node.ts#L260)

***

### dispatchQueueSync()

> **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`dispatchQueueSync`](IoMenuItem.md#dispatchqueuesync)

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

[`IoMenuItem`](IoMenuItem.md).[`dispose`](IoMenuItem.md#dispose)

#### Defined in

[src/core/node.ts:392](https://github.com/io-gui/io/blob/main/src/core/node.ts#L392)

***

### expandedChanged()

> **expandedChanged**(): `void`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`expandedChanged`](IoMenuItem.md#expandedchanged)

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

[`IoMenuItem`](IoMenuItem.md).[`focusTo`](IoMenuItem.md#focusto)

#### Defined in

[src/elements/basic/io-field.ts:274](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L274)

***

### getCaretPosition()

> **getCaretPosition**(): `number`

#### Returns

`number`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`getCaretPosition`](IoMenuItem.md#getcaretposition)

#### Defined in

[src/elements/basic/io-field.ts:278](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L278)

***

### init()

> **init**(): `void`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`init`](IoMenuItem.md#init)

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

[`IoMenuItem`](IoMenuItem.md).[`inputValue`](IoMenuItem.md#inputvalue)

#### Defined in

[src/core/node.ts:235](https://github.com/io-gui/io/blob/main/src/core/node.ts#L235)

***

### labelChanged()

> **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`labelChanged`](IoMenuItem.md#labelchanged)

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

[`IoMenuItem`](IoMenuItem.md).[`objectMutated`](IoMenuItem.md#objectmutated)

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

[`IoMenuItem`](IoMenuItem.md).[`onObjectMutated`](IoMenuItem.md#onobjectmutated)

#### Defined in

[src/core/node.ts:288](https://github.com/io-gui/io/blob/main/src/core/node.ts#L288)

***

### preventDefault()

> **preventDefault**(`event`): `void`

#### Parameters

• **event**: `Event`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`preventDefault`](IoMenuItem.md#preventdefault)

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

[`IoMenuItem`](IoMenuItem.md).[`queue`](IoMenuItem.md#queue)

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

[`IoMenuItem`](IoMenuItem.md).[`removeEventListener`](IoMenuItem.md#removeeventlistener)

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

[`IoMenuItem`](IoMenuItem.md).[`setAttribute`](IoMenuItem.md#setattribute)

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

[`IoMenuItem`](IoMenuItem.md).[`setCaretPosition`](IoMenuItem.md#setcaretposition)

#### Defined in

[src/elements/basic/io-field.ts:291](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L291)

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

[`IoMenuItem`](IoMenuItem.md).[`setProperties`](IoMenuItem.md#setproperties)

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

[`IoMenuItem`](IoMenuItem.md).[`setProperty`](IoMenuItem.md#setproperty)

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

[`IoMenuItem`](IoMenuItem.md).[`template`](IoMenuItem.md#template)

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

[`IoMenuItem`](IoMenuItem.md).[`throttle`](IoMenuItem.md#throttle)

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

[`IoMenuItem`](IoMenuItem.md).[`traverse`](IoMenuItem.md#traverse)

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

[`IoMenuItem`](IoMenuItem.md).[`unbind`](IoMenuItem.md#unbind)

#### Defined in

[src/core/node.ts:337](https://github.com/io-gui/io/blob/main/src/core/node.ts#L337)
