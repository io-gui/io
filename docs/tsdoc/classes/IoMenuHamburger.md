[**io-gui**](../README.md)

***

# Class: IoMenuHamburger

Defined in: [src/elements/menus/io-menu-hamburger.ts:5](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-hamburger.ts#L5)

It displays `option.icon`, `option.label` and `option.hint` property and it creates expandable `IoMenuOptions` from the `option.options` array. Options are expand in the direction specified by `direction` property. If `selectable` property is set, selecting an option sets its `value` to the entire menu tree and `selected` atribute is set on menu items whose `option.value` matches selected value.

## Extends

- [`IoMenuItem`](IoMenuItem.md)

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### new IoMenuHamburger()

> **new IoMenuHamburger**(...`args`): [`IoMenuHamburger`](IoMenuHamburger.md)

Defined in: [src/core/element.ts:213](https://github.com/io-gui/io/blob/main/src/core/element.ts#L213)

#### Parameters

##### args

...`any`[]

#### Returns

[`IoMenuHamburger`](IoMenuHamburger.md)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`constructor`](IoMenuItem.md#constructors)

## Properties

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

Defined in: [src/core/node.ts:45](https://github.com/io-gui/io/blob/main/src/core/node.ts#L45)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_bindings`](IoMenuItem.md#_bindings)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

Defined in: [src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_changeQueue`](IoMenuItem.md#_changequeue)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

Defined in: [src/core/node.ts:47](https://github.com/io-gui/io/blob/main/src/core/node.ts#L47)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_eventDispatcher`](IoMenuItem.md#_eventdispatcher)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

Defined in: [src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_properties`](IoMenuItem.md#_properties)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

Defined in: [src/core/node.ts:43](https://github.com/io-gui/io/blob/main/src/core/node.ts#L43)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_protochain`](IoMenuItem.md#_protochain)

***

### $

> **$**: `Record`\<`string`, `any`\>

Defined in: [src/core/element.ts:181](https://github.com/io-gui/io/blob/main/src/core/element.ts#L181)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`$`](IoMenuItem.md#$)

***

### $options?

> `optional` **$options**: [`IoMenuOptions`](IoMenuOptions.md)

Defined in: [src/elements/menus/io-menu-item.ts:54](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L54)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`$options`](IoMenuItem.md#$options)

***

### appearance

> **appearance**: `"inset"` \| `"flush"` \| `"outset"` \| `"neutral"`

Defined in: [src/elements/basic/io-field.ts:105](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L105)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`appearance`](IoMenuItem.md#appearance)

***

### class

> **class**: `string`

Defined in: [src/core/element.ts:190](https://github.com/io-gui/io/blob/main/src/core/element.ts#L190)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`class`](IoMenuItem.md#class)

***

### contenteditable

> **contenteditable**: `boolean`

Defined in: [src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`contenteditable`](IoMenuItem.md#contenteditable)

***

### depth

> **depth**: `number`

Defined in: [src/elements/menus/io-menu-item.ts:52](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L52)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`depth`](IoMenuItem.md#depth)

***

### direction

> **direction**: `string`

Defined in: [src/elements/menus/io-menu-item.ts:49](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L49)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`direction`](IoMenuItem.md#direction)

***

### disabled

> **disabled**: `boolean`

Defined in: [src/core/element.ts:211](https://github.com/io-gui/io/blob/main/src/core/element.ts#L211)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`disabled`](IoMenuItem.md#disabled)

***

### expanded

> **expanded**: `boolean`

Defined in: [src/elements/menus/io-menu-item.ts:46](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L46)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`expanded`](IoMenuItem.md#expanded)

***

### hidden

> **hidden**: `boolean`

Defined in: [src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`hidden`](IoMenuItem.md#hidden)

***

### icon

> **icon**: `string`

Defined in: [src/elements/basic/io-field.ts:102](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L102)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`icon`](IoMenuItem.md#icon)

***

### id

> **id**: `string`

Defined in: [src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`id`](IoMenuItem.md#id)

***

### invalid

> **invalid**: `boolean`

Defined in: [src/elements/basic/io-field.ts:114](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L114)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`invalid`](IoMenuItem.md#invalid)

***

### item

> **item**: [`MenuItem`](MenuItem.md)

Defined in: [src/elements/menus/io-menu-item.ts:43](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L43)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`item`](IoMenuItem.md#item)

***

### label

> **label**: `string`

Defined in: [src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`label`](IoMenuItem.md#label)

***

### name

> **name**: `string`

Defined in: [src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`name`](IoMenuItem.md#name)

***

### placeholder

> **placeholder**: `string`

Defined in: [src/elements/basic/io-field.ts:117](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L117)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`placeholder`](IoMenuItem.md#placeholder)

***

### role

> **role**: `string`

Defined in: [src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`role`](IoMenuItem.md#role)

***

### selected

> **selected**: `boolean`

Defined in: [src/elements/basic/io-field.ts:111](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L111)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`selected`](IoMenuItem.md#selected)

***

### stroke

> **stroke**: `boolean`

Defined in: [src/elements/basic/io-field.ts:108](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L108)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`stroke`](IoMenuItem.md#stroke)

***

### tabindex

> **tabindex**: `string`

Defined in: [src/elements/basic/io-field.ts:96](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L96)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`tabindex`](IoMenuItem.md#tabindex)

***

### title

> **title**: `string`

Defined in: [src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`title`](IoMenuItem.md#title)

***

### value

> **value**: `any`

Defined in: [src/elements/basic/io-field.ts:99](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L99)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`value`](IoMenuItem.md#value)

## Accessors

### $parent

#### Get Signature

> **get** **$parent**(): `any`

Defined in: [src/elements/menus/io-menu-item.ts:71](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L71)

##### Returns

`any`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`$parent`](IoMenuItem.md#$parent)

***

### hasmore

#### Get Signature

> **get** **hasmore**(): `boolean`

Defined in: [src/elements/menus/io-menu-item.ts:65](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L65)

##### Returns

`boolean`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`hasmore`](IoMenuItem.md#hasmore)

***

### inlayer

#### Get Signature

> **get** **inlayer**(): `boolean`

Defined in: [src/elements/menus/io-menu-item.ts:68](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L68)

##### Returns

`boolean`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`inlayer`](IoMenuItem.md#inlayer)

***

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

[`IoMenuItem`](IoMenuItem.md).[`textNode`](IoMenuItem.md#textnode)

***

### Listeners

#### Get Signature

> **get** `static` **Listeners**(): `any`

Defined in: [src/elements/menus/io-menu-item.ts:56](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L56)

##### Returns

`any`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`Listeners`](IoMenuItem.md#listeners)

***

### Properties

#### Get Signature

> **get** `static` **Properties**(): [`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

Defined in: [src/core/node.ts:35](https://github.com/io-gui/io/blob/main/src/core/node.ts#L35)

##### Returns

[`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`Properties`](IoMenuItem.md#properties)

***

### Style

#### Get Signature

> **get** `static` **Style**(): `string`

Defined in: [src/elements/menus/io-menu-hamburger.ts:6](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-hamburger.ts#L6)

##### Returns

`string`

#### Overrides

[`IoMenuItem`](IoMenuItem.md).[`Style`](IoMenuItem.md#style)

## Methods

### \_expandHovered()

> **\_expandHovered**(): `void`

Defined in: [src/elements/menus/io-menu-item.ts:218](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L218)

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_expandHovered`](IoMenuItem.md#_expandhovered)

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

[`IoMenuItem`](IoMenuItem.md).[`_flattenTextNode`](IoMenuItem.md#_flattentextnode)

***

### \_gethovered()

> **\_gethovered**(`event`): `undefined` \| `IoMenuElementType`

Defined in: [src/elements/menus/io-menu-item.ts:202](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L202)

#### Parameters

##### event

`PointerEvent`

#### Returns

`undefined` \| `IoMenuElementType`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_gethovered`](IoMenuItem.md#_gethovered)

***

### \_onBlur()

> **\_onBlur**(`event`): `void`

Defined in: [src/elements/basic/io-field.ts:132](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L132)

#### Parameters

##### event

`FocusEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onBlur`](IoMenuItem.md#_onblur)

***

### \_onClick()

> **\_onClick**(): `void`

Defined in: [src/elements/menus/io-menu-item.ts:94](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L94)

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onClick`](IoMenuItem.md#_onclick)

***

### \_onCollapse()

> **\_onCollapse**(): `void`

Defined in: [src/elements/menus/io-menu-item.ts:304](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L304)

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onCollapse`](IoMenuItem.md#_oncollapse)

***

### \_onCollapseRoot()

> **\_onCollapseRoot**(): `void`

Defined in: [src/elements/menus/io-menu-item.ts:307](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L307)

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onCollapseRoot`](IoMenuItem.md#_oncollapseroot)

***

### \_onFocus()

> **\_onFocus**(`event`): `void`

Defined in: [src/elements/basic/io-field.ts:127](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L127)

#### Parameters

##### event

`FocusEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onFocus`](IoMenuItem.md#_onfocus)

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

[`IoMenuItem`](IoMenuItem.md).[`_onFocusTo`](IoMenuItem.md#_onfocusto)

***

### \_onItemClicked()

> **\_onItemClicked**(`event`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:119](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L119)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onItemClicked`](IoMenuItem.md#_onitemclicked)

***

### \_onKeydown()

> **\_onKeydown**(`event`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:239](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L239)

#### Parameters

##### event

`KeyboardEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onKeydown`](IoMenuItem.md#_onkeydown)

***

### \_onKeyup()

> **\_onKeyup**(`event`): `void`

Defined in: [src/elements/basic/io-field.ts:177](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L177)

#### Parameters

##### event

`KeyboardEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onKeyup`](IoMenuItem.md#_onkeyup)

***

### \_onOverlayPointermove()

> **\_onOverlayPointermove**(`event`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:88](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L88)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onOverlayPointermove`](IoMenuItem.md#_onoverlaypointermove)

***

### \_onOverlayPointerup()

> **\_onOverlayPointerup**(`event`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:91](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L91)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onOverlayPointerup`](IoMenuItem.md#_onoverlaypointerup)

***

### \_onPointerdown()

> **\_onPointerdown**(`event`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:127](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L127)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onPointerdown`](IoMenuItem.md#_onpointerdown)

***

### \_onPointerdownAction()

> **\_onPointerdownAction**(`event`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:135](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L135)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onPointerdownAction`](IoMenuItem.md#_onpointerdownaction)

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

[`IoMenuItem`](IoMenuItem.md).[`_onPointerleave`](IoMenuItem.md#_onpointerleave)

***

### \_onPointermove()

> **\_onPointermove**(`event`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:148](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L148)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onPointermove`](IoMenuItem.md#_onpointermove)

***

### \_onPointermoveAction()

> **\_onPointermoveAction**(`event`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:152](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L152)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onPointermoveAction`](IoMenuItem.md#_onpointermoveaction)

***

### \_onPointerup()

> **\_onPointerup**(`event`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:185](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L185)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onPointerup`](IoMenuItem.md#_onpointerup)

***

### \_onPointerupAction()

> **\_onPointerupAction**(`event`, `skipCollapse`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:191](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L191)

#### Parameters

##### event

`PointerEvent`

##### skipCollapse

`boolean` = `false`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`_onPointerupAction`](IoMenuItem.md#_onpointerupaction)

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

[`IoMenuItem`](IoMenuItem.md).[`addEventListener`](IoMenuItem.md#addeventlistener)

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

[`IoMenuItem`](IoMenuItem.md).[`applyProperties`](IoMenuItem.md#applyproperties)

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

[`IoMenuItem`](IoMenuItem.md).[`bind`](IoMenuItem.md#bind)

***

### changed()

> **changed**(): `void`

Defined in: [src/elements/menus/io-menu-hamburger.ts:19](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-hamburger.ts#L19)

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

[`IoMenuItem`](IoMenuItem.md).[`changed`](IoMenuItem.md#changed)

***

### connectedCallback()

> **connectedCallback**(): `void`

Defined in: [src/elements/menus/io-menu-item.ts:75](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L75)

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`connectedCallback`](IoMenuItem.md#connectedcallback)

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

[`IoMenuItem`](IoMenuItem.md).[`debounce`](IoMenuItem.md#debounce)

***

### disabledChanged()

> **disabledChanged**(): `void`

Defined in: [src/core/element.ts:451](https://github.com/io-gui/io/blob/main/src/core/element.ts#L451)

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`disabledChanged`](IoMenuItem.md#disabledchanged)

***

### disconnectedCallback()

> **disconnectedCallback**(): `void`

Defined in: [src/elements/menus/io-menu-item.ts:82](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L82)

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`disconnectedCallback`](IoMenuItem.md#disconnectedcallback)

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

[`IoMenuItem`](IoMenuItem.md).[`dispatchEvent`](IoMenuItem.md#dispatchevent)

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

[`IoMenuItem`](IoMenuItem.md).[`dispatchQueue`](IoMenuItem.md#dispatchqueue)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/core/node.ts:369](https://github.com/io-gui/io/blob/main/src/core/node.ts#L369)

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`dispose`](IoMenuItem.md#dispose)

***

### expandedChanged()

> **expandedChanged**(): `void`

Defined in: [src/elements/menus/io-menu-item.ts:310](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L310)

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`expandedChanged`](IoMenuItem.md#expandedchanged)

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

[`IoMenuItem`](IoMenuItem.md).[`focusTo`](IoMenuItem.md#focusto)

***

### getCaretPosition()

> **getCaretPosition**(): `number`

Defined in: [src/elements/basic/io-field.ts:289](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L289)

#### Returns

`number`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`getCaretPosition`](IoMenuItem.md#getcaretposition)

***

### init()

> **init**(): `void`

Defined in: [src/core/node.ts:241](https://github.com/io-gui/io/blob/main/src/core/node.ts#L241)

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`init`](IoMenuItem.md#init)

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

[`IoMenuItem`](IoMenuItem.md).[`inputValue`](IoMenuItem.md#inputvalue)

***

### itemChanged()

> **itemChanged**(): `void`

Defined in: [src/elements/menus/io-menu-item.ts:347](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L347)

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`itemChanged`](IoMenuItem.md#itemchanged)

***

### labelChanged()

> **labelChanged**(): `void`

Defined in: [src/core/element.ts:444](https://github.com/io-gui/io/blob/main/src/core/element.ts#L444)

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`labelChanged`](IoMenuItem.md#labelchanged)

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

[`IoMenuItem`](IoMenuItem.md).[`onPropertyMutated`](IoMenuItem.md#onpropertymutated)

***

### preventDefault()

> **preventDefault**(`event`): `void`

Defined in: [src/elements/menus/io-menu-item.ts:61](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L61)

#### Parameters

##### event

`Event`

#### Returns

`void`

#### Inherited from

[`IoMenuItem`](IoMenuItem.md).[`preventDefault`](IoMenuItem.md#preventdefault)

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

[`IoMenuItem`](IoMenuItem.md).[`queue`](IoMenuItem.md#queue)

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

[`IoMenuItem`](IoMenuItem.md).[`Register`](IoMenuItem.md#register)

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

[`IoMenuItem`](IoMenuItem.md).[`removeEventListener`](IoMenuItem.md#removeeventlistener)

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

[`IoMenuItem`](IoMenuItem.md).[`setAttribute`](IoMenuItem.md#setattribute)

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

[`IoMenuItem`](IoMenuItem.md).[`setCaretPosition`](IoMenuItem.md#setcaretposition)

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

[`IoMenuItem`](IoMenuItem.md).[`setProperties`](IoMenuItem.md#setproperties)

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

[`IoMenuItem`](IoMenuItem.md).[`setProperty`](IoMenuItem.md#setproperty)

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

[`IoMenuItem`](IoMenuItem.md).[`template`](IoMenuItem.md#template)

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

[`IoMenuItem`](IoMenuItem.md).[`throttle`](IoMenuItem.md#throttle)

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

[`IoMenuItem`](IoMenuItem.md).[`traverse`](IoMenuItem.md#traverse)

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

[`IoMenuItem`](IoMenuItem.md).[`unbind`](IoMenuItem.md#unbind)
