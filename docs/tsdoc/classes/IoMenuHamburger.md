[io-gui](../README.md) / IoMenuHamburger

# Class: IoMenuHamburger

It displays `option.icon`, `option.label` and `option.hint` property and it creates expandable `IoMenuOptions` from the `option.options` array. Options are expand in the direction specified by `direction` property. If `selectable` property is set, selecting an option sets its `value` to the entire menu tree and `selected` atribute is set on menu items whose `option.value` matches selected value.

## Hierarchy

- [`IoMenuItem`](IoMenuItem.md)

  ↳ **`IoMenuHamburger`**

## Table of contents

### Constructors

- [constructor](IoMenuHamburger.md#constructor)

### Properties

- [$](IoMenuHamburger.md#$)
- [$options](IoMenuHamburger.md#$options)
- [\_bindings](IoMenuHamburger.md#_bindings)
- [\_changeQueue](IoMenuHamburger.md#_changequeue)
- [\_eventDispatcher](IoMenuHamburger.md#_eventdispatcher)
- [\_properties](IoMenuHamburger.md#_properties)
- [\_protochain](IoMenuHamburger.md#_protochain)
- [appearance](IoMenuHamburger.md#appearance)
- [class](IoMenuHamburger.md#class)
- [contenteditable](IoMenuHamburger.md#contenteditable)
- [depth](IoMenuHamburger.md#depth)
- [direction](IoMenuHamburger.md#direction)
- [disabled](IoMenuHamburger.md#disabled)
- [expanded](IoMenuHamburger.md#expanded)
- [hidden](IoMenuHamburger.md#hidden)
- [icon](IoMenuHamburger.md#icon)
- [id](IoMenuHamburger.md#id)
- [invalid](IoMenuHamburger.md#invalid)
- [item](IoMenuHamburger.md#item)
- [label](IoMenuHamburger.md#label)
- [name](IoMenuHamburger.md#name)
- [placeholder](IoMenuHamburger.md#placeholder)
- [role](IoMenuHamburger.md#role)
- [selected](IoMenuHamburger.md#selected)
- [stroke](IoMenuHamburger.md#stroke)
- [tabindex](IoMenuHamburger.md#tabindex)
- [title](IoMenuHamburger.md#title)
- [value](IoMenuHamburger.md#value)

### Accessors

- [$parent](IoMenuHamburger.md#$parent)
- [hasmore](IoMenuHamburger.md#hasmore)
- [inlayer](IoMenuHamburger.md#inlayer)
- [textNode](IoMenuHamburger.md#textnode)
- [Listeners](IoMenuHamburger.md#listeners)
- [Properties](IoMenuHamburger.md#properties)
- [Style](IoMenuHamburger.md#style)

### Methods

- [Register](IoMenuHamburger.md#register)
- [\_expandHovered](IoMenuHamburger.md#_expandhovered)
- [\_flattenTextNode](IoMenuHamburger.md#_flattentextnode)
- [\_gethovered](IoMenuHamburger.md#_gethovered)
- [\_onBlur](IoMenuHamburger.md#_onblur)
- [\_onClick](IoMenuHamburger.md#_onclick)
- [\_onCollapse](IoMenuHamburger.md#_oncollapse)
- [\_onCollapseRoot](IoMenuHamburger.md#_oncollapseroot)
- [\_onFocus](IoMenuHamburger.md#_onfocus)
- [\_onFocusTo](IoMenuHamburger.md#_onfocusto)
- [\_onItemClicked](IoMenuHamburger.md#_onitemclicked)
- [\_onKeydown](IoMenuHamburger.md#_onkeydown)
- [\_onKeyup](IoMenuHamburger.md#_onkeyup)
- [\_onOverlayPointermove](IoMenuHamburger.md#_onoverlaypointermove)
- [\_onOverlayPointerup](IoMenuHamburger.md#_onoverlaypointerup)
- [\_onPointerdown](IoMenuHamburger.md#_onpointerdown)
- [\_onPointerdownAction](IoMenuHamburger.md#_onpointerdownaction)
- [\_onPointerleave](IoMenuHamburger.md#_onpointerleave)
- [\_onPointermove](IoMenuHamburger.md#_onpointermove)
- [\_onPointermoveAction](IoMenuHamburger.md#_onpointermoveaction)
- [\_onPointerup](IoMenuHamburger.md#_onpointerup)
- [\_onPointerupAction](IoMenuHamburger.md#_onpointerupaction)
- [addEventListener](IoMenuHamburger.md#addeventlistener)
- [applyProperties](IoMenuHamburger.md#applyproperties)
- [bind](IoMenuHamburger.md#bind)
- [changed](IoMenuHamburger.md#changed)
- [connectedCallback](IoMenuHamburger.md#connectedcallback)
- [disabledChanged](IoMenuHamburger.md#disabledchanged)
- [disconnectedCallback](IoMenuHamburger.md#disconnectedcallback)
- [dispatchEvent](IoMenuHamburger.md#dispatchevent)
- [dispatchMutationEvent](IoMenuHamburger.md#dispatchmutationevent)
- [dispatchQueue](IoMenuHamburger.md#dispatchqueue)
- [dispatchQueueSync](IoMenuHamburger.md#dispatchqueuesync)
- [dispose](IoMenuHamburger.md#dispose)
- [expandedChanged](IoMenuHamburger.md#expandedchanged)
- [focusTo](IoMenuHamburger.md#focusto)
- [getCaretPosition](IoMenuHamburger.md#getcaretposition)
- [init](IoMenuHamburger.md#init)
- [inputValue](IoMenuHamburger.md#inputvalue)
- [labelChanged](IoMenuHamburger.md#labelchanged)
- [objectMutated](IoMenuHamburger.md#objectmutated)
- [onObjectMutated](IoMenuHamburger.md#onobjectmutated)
- [preventDefault](IoMenuHamburger.md#preventdefault)
- [queue](IoMenuHamburger.md#queue)
- [removeEventListener](IoMenuHamburger.md#removeeventlistener)
- [setAttribute](IoMenuHamburger.md#setattribute)
- [setCaretPosition](IoMenuHamburger.md#setcaretposition)
- [setProperties](IoMenuHamburger.md#setproperties)
- [setProperty](IoMenuHamburger.md#setproperty)
- [template](IoMenuHamburger.md#template)
- [throttle](IoMenuHamburger.md#throttle)
- [traverse](IoMenuHamburger.md#traverse)
- [unbind](IoMenuHamburger.md#unbind)

## Constructors

### constructor

• **new IoMenuHamburger**(`...args`): [`IoMenuHamburger`](IoMenuHamburger.md)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

[`IoMenuHamburger`](IoMenuHamburger.md)

#### Inherited from

[IoMenuItem](IoMenuItem.md).[constructor](IoMenuItem.md#constructor)

#### Defined in

[src/core/node.ts:63](https://github.com/io-gui/io/blob/main/src/core/node.ts#L63)

## Properties

### $

• **$**: `Record`\<`string`, `any`\>

#### Inherited from

[IoMenuItem](IoMenuItem.md).[$](IoMenuItem.md#$)

#### Defined in

[src/core/element.ts:178](https://github.com/io-gui/io/blob/main/src/core/element.ts#L178)

___

### $options

• `Optional` **$options**: [`IoMenuOptions`](IoMenuOptions.md)

#### Inherited from

[IoMenuItem](IoMenuItem.md).[$options](IoMenuItem.md#$options)

#### Defined in

[src/elements/menus/io-menu-item.ts:56](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L56)

___

### \_bindings

• `Readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_bindings](IoMenuItem.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_changeQueue](IoMenuItem.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_eventDispatcher](IoMenuItem.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

___

### \_properties

• `Readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_properties](IoMenuItem.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_protochain](IoMenuItem.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

___

### appearance

• **appearance**: ``"inset"`` \| ``"flush"`` \| ``"outset"`` \| ``"neutral"``

#### Inherited from

[IoMenuItem](IoMenuItem.md).[appearance](IoMenuItem.md#appearance)

#### Defined in

[src/elements/basic/io-field.ts:86](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L86)

___

### class

• **class**: `string`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[class](IoMenuItem.md#class)

#### Defined in

[src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

___

### contenteditable

• **contenteditable**: `boolean`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[contenteditable](IoMenuItem.md#contenteditable)

#### Defined in

[src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

___

### depth

• **depth**: `number`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[depth](IoMenuItem.md#depth)

#### Defined in

[src/elements/menus/io-menu-item.ts:53](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L53)

___

### direction

• **direction**: `string`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[direction](IoMenuItem.md#direction)

#### Defined in

[src/elements/menus/io-menu-item.ts:50](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L50)

___

### disabled

• **disabled**: `boolean`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[disabled](IoMenuItem.md#disabled)

#### Defined in

[src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

___

### expanded

• **expanded**: `boolean`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[expanded](IoMenuItem.md#expanded)

#### Defined in

[src/elements/menus/io-menu-item.ts:47](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L47)

___

### hidden

• **hidden**: `boolean`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[hidden](IoMenuItem.md#hidden)

#### Defined in

[src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

___

### icon

• **icon**: `string`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[icon](IoMenuItem.md#icon)

#### Defined in

[src/elements/basic/io-field.ts:83](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L83)

___

### id

• **id**: `string`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[id](IoMenuItem.md#id)

#### Defined in

[src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

___

### invalid

• **invalid**: `boolean`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[invalid](IoMenuItem.md#invalid)

#### Defined in

[src/elements/basic/io-field.ts:95](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L95)

___

### item

• **item**: [`MenuItem`](MenuItem.md)

#### Inherited from

[IoMenuItem](IoMenuItem.md).[item](IoMenuItem.md#item)

#### Defined in

[src/elements/menus/io-menu-item.ts:44](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L44)

___

### label

• **label**: `string`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[label](IoMenuItem.md#label)

#### Defined in

[src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

___

### name

• **name**: `string`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[name](IoMenuItem.md#name)

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

___

### placeholder

• **placeholder**: `string`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[placeholder](IoMenuItem.md#placeholder)

#### Defined in

[src/elements/basic/io-field.ts:98](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L98)

___

### role

• **role**: `string`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[role](IoMenuItem.md#role)

#### Defined in

[src/core/element.ts:190](https://github.com/io-gui/io/blob/main/src/core/element.ts#L190)

___

### selected

• **selected**: `boolean`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[selected](IoMenuItem.md#selected)

#### Defined in

[src/elements/basic/io-field.ts:92](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L92)

___

### stroke

• **stroke**: `boolean`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[stroke](IoMenuItem.md#stroke)

#### Defined in

[src/elements/basic/io-field.ts:89](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L89)

___

### tabindex

• **tabindex**: `string`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[tabindex](IoMenuItem.md#tabindex)

#### Defined in

[src/elements/basic/io-field.ts:77](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L77)

___

### title

• **title**: `string`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[title](IoMenuItem.md#title)

#### Defined in

[src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

___

### value

• **value**: `any`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[value](IoMenuItem.md#value)

#### Defined in

[src/elements/basic/io-field.ts:80](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L80)

## Accessors

### $parent

• `get` **$parent**(): `any`

#### Returns

`any`

#### Inherited from

IoMenuItem.$parent

#### Defined in

[src/elements/menus/io-menu-item.ts:73](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L73)

___

### hasmore

• `get` **hasmore**(): `boolean`

#### Returns

`boolean`

#### Inherited from

IoMenuItem.hasmore

#### Defined in

[src/elements/menus/io-menu-item.ts:67](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L67)

___

### inlayer

• `get` **inlayer**(): `boolean`

#### Returns

`boolean`

#### Inherited from

IoMenuItem.inlayer

#### Defined in

[src/elements/menus/io-menu-item.ts:70](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L70)

___

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoMenuItem.textNode

#### Defined in

[src/core/element.ts:392](https://github.com/io-gui/io/blob/main/src/core/element.ts#L392)

• `set` **textNode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

IoMenuItem.textNode

#### Defined in

[src/core/element.ts:396](https://github.com/io-gui/io/blob/main/src/core/element.ts#L396)

___

### Listeners

• `get` **Listeners**(): `any`

#### Returns

`any`

#### Inherited from

IoMenuItem.Listeners

#### Defined in

[src/elements/menus/io-menu-item.ts:58](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L58)

___

### Properties

• `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoMenuItem.Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

___

### Style

• `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoMenuItem.Style

#### Defined in

[src/elements/menus/io-menu-hamburger.ts:6](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-hamburger.ts#L6)

## Methods

### Register

▸ **Register**(`ioNodeConstructor`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ioNodeConstructor` | typeof [`IoNode`](IoNode.md) |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[Register](IoMenuItem.md#register)

#### Defined in

[src/core/element.ts:304](https://github.com/io-gui/io/blob/main/src/core/element.ts#L304)

___

### \_expandHovered

▸ **_expandHovered**(): `void`

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_expandHovered](IoMenuItem.md#_expandhovered)

#### Defined in

[src/elements/menus/io-menu-item.ts:220](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L220)

___

### \_flattenTextNode

▸ **_flattenTextNode**(`element`): `void`

Helper function to flatten textContent into a single TextNode.
Update textContent via TextNode is better for layout performance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `element` | `HTMLElement` \| [`IoElement`](IoElement.md) | Element to flatten. |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_flattenTextNode](IoMenuItem.md#_flattentextnode)

#### Defined in

[src/core/element.ts:375](https://github.com/io-gui/io/blob/main/src/core/element.ts#L375)

___

### \_gethovered

▸ **_gethovered**(`event`): `undefined` \| `IoMenuElementType`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`undefined` \| `IoMenuElementType`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_gethovered](IoMenuItem.md#_gethovered)

#### Defined in

[src/elements/menus/io-menu-item.ts:204](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L204)

___

### \_onBlur

▸ **_onBlur**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `FocusEvent` |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_onBlur](IoMenuItem.md#_onblur)

#### Defined in

[src/elements/basic/io-field.ts:113](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L113)

___

### \_onClick

▸ **_onClick**(): `void`

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_onClick](IoMenuItem.md#_onclick)

#### Defined in

[src/elements/menus/io-menu-item.ts:96](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L96)

___

### \_onCollapse

▸ **_onCollapse**(): `void`

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_onCollapse](IoMenuItem.md#_oncollapse)

#### Defined in

[src/elements/menus/io-menu-item.ts:306](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L306)

___

### \_onCollapseRoot

▸ **_onCollapseRoot**(): `void`

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_onCollapseRoot](IoMenuItem.md#_oncollapseroot)

#### Defined in

[src/elements/menus/io-menu-item.ts:309](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L309)

___

### \_onFocus

▸ **_onFocus**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `FocusEvent` |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_onFocus](IoMenuItem.md#_onfocus)

#### Defined in

[src/elements/basic/io-field.ts:108](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L108)

___

### \_onFocusTo

▸ **_onFocusTo**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`\<`any`\> |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_onFocusTo](IoMenuItem.md#_onfocusto)

#### Defined in

[src/elements/basic/io-field.ts:159](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L159)

___

### \_onItemClicked

▸ **_onItemClicked**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_onItemClicked](IoMenuItem.md#_onitemclicked)

#### Defined in

[src/elements/menus/io-menu-item.ts:121](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L121)

___

### \_onKeydown

▸ **_onKeydown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `KeyboardEvent` |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_onKeydown](IoMenuItem.md#_onkeydown)

#### Defined in

[src/elements/menus/io-menu-item.ts:241](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L241)

___

### \_onKeyup

▸ **_onKeyup**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `KeyboardEvent` |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_onKeyup](IoMenuItem.md#_onkeyup)

#### Defined in

[src/elements/basic/io-field.ts:158](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L158)

___

### \_onOverlayPointermove

▸ **_onOverlayPointermove**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_onOverlayPointermove](IoMenuItem.md#_onoverlaypointermove)

#### Defined in

[src/elements/menus/io-menu-item.ts:90](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L90)

___

### \_onOverlayPointerup

▸ **_onOverlayPointerup**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_onOverlayPointerup](IoMenuItem.md#_onoverlaypointerup)

#### Defined in

[src/elements/menus/io-menu-item.ts:93](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L93)

___

### \_onPointerdown

▸ **_onPointerdown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_onPointerdown](IoMenuItem.md#_onpointerdown)

#### Defined in

[src/elements/menus/io-menu-item.ts:129](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L129)

___

### \_onPointerdownAction

▸ **_onPointerdownAction**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_onPointerdownAction](IoMenuItem.md#_onpointerdownaction)

#### Defined in

[src/elements/menus/io-menu-item.ts:137](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L137)

___

### \_onPointerleave

▸ **_onPointerleave**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_onPointerleave](IoMenuItem.md#_onpointerleave)

#### Defined in

[src/elements/basic/io-field.ts:125](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L125)

___

### \_onPointermove

▸ **_onPointermove**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_onPointermove](IoMenuItem.md#_onpointermove)

#### Defined in

[src/elements/menus/io-menu-item.ts:150](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L150)

___

### \_onPointermoveAction

▸ **_onPointermoveAction**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_onPointermoveAction](IoMenuItem.md#_onpointermoveaction)

#### Defined in

[src/elements/menus/io-menu-item.ts:154](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L154)

___

### \_onPointerup

▸ **_onPointerup**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_onPointerup](IoMenuItem.md#_onpointerup)

#### Defined in

[src/elements/menus/io-menu-item.ts:187](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L187)

___

### \_onPointerupAction

▸ **_onPointerupAction**(`event`, `skipCollapse?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `event` | `PointerEvent` | `undefined` |
| `skipCollapse` | `boolean` | `false` |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[_onPointerupAction](IoMenuItem.md#_onpointerupaction)

#### Defined in

[src/elements/menus/io-menu-item.ts:193](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L193)

___

### addEventListener

▸ **addEventListener**(`type`, `listener`, `options?`): `void`

Wrapper for addEventListener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | listener name. |
| `listener` | [`AnyEventListener`](../README.md#anyeventlistener) | listener handler. |
| `options?` | `AddEventListenerOptions` | event listener options. |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[addEventListener](IoMenuItem.md#addeventlistener)

#### Defined in

[src/core/node.ts:352](https://github.com/io-gui/io/blob/main/src/core/node.ts#L352)

___

### applyProperties

▸ **applyProperties**(`props`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `any` |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[applyProperties](IoMenuItem.md#applyproperties)

#### Defined in

[src/core/element.ts:400](https://github.com/io-gui/io/blob/main/src/core/element.ts#L400)

___

### bind

▸ **bind**(`prop`): [`Binding`](Binding.md)

Returns a binding to a specified property`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prop` | `string` | Property to bind to. |

#### Returns

[`Binding`](Binding.md)

Binding object.

#### Inherited from

[IoMenuItem](IoMenuItem.md).[bind](IoMenuItem.md#bind)

#### Defined in

[src/core/node.ts:319](https://github.com/io-gui/io/blob/main/src/core/node.ts#L319)

___

### changed

▸ **changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

[IoMenuItem](IoMenuItem.md).[changed](IoMenuItem.md#changed)

#### Defined in

[src/elements/menus/io-menu-hamburger.ts:19](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-hamburger.ts#L19)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[connectedCallback](IoMenuItem.md#connectedcallback)

#### Defined in

[src/elements/menus/io-menu-item.ts:77](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L77)

___

### disabledChanged

▸ **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[disabledChanged](IoMenuItem.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[disconnectedCallback](IoMenuItem.md#disconnectedcallback)

#### Defined in

[src/elements/menus/io-menu-item.ts:84](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L84)

___

### dispatchEvent

▸ **dispatchEvent**(`type`, `detail?`, `bubbles?`, `src?`): `void`

Wrapper for dispatchEvent.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `type` | `string` | `undefined` | event name to dispatch. |
| `detail` | `Object` | `{}` | event detail. |
| `bubbles` | `boolean` | `false` | event bubbles. |
| `src?` | `Node` \| `Document` \| `HTMLElement` \| `Window` | `undefined` | source node/element to dispatch event from. |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[dispatchEvent](IoMenuItem.md#dispatchevent)

#### Defined in

[src/core/node.ts:377](https://github.com/io-gui/io/blob/main/src/core/node.ts#L377)

___

### dispatchMutationEvent

▸ **dispatchMutationEvent**(`object`): `void`

Shorthand for dispatching `'object-mutated'` event on window.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `object` | `any` | object which mutated. |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[dispatchMutationEvent](IoMenuItem.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:384](https://github.com/io-gui/io/blob/main/src/core/node.ts#L384)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[dispatchQueue](IoMenuItem.md#dispatchqueue)

#### Defined in

[src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[dispatchQueueSync](IoMenuItem.md#dispatchqueuesync)

#### Defined in

[src/core/node.ts:269](https://github.com/io-gui/io/blob/main/src/core/node.ts#L269)

___

### dispose

▸ **dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[dispose](IoMenuItem.md#dispose)

#### Defined in

[src/core/node.ts:391](https://github.com/io-gui/io/blob/main/src/core/node.ts#L391)

___

### expandedChanged

▸ **expandedChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[expandedChanged](IoMenuItem.md#expandedchanged)

#### Defined in

[src/elements/menus/io-menu-item.ts:312](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L312)

___

### focusTo

▸ **focusTo**(`dir`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dir` | `string` |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[focusTo](IoMenuItem.md#focusto)

#### Defined in

[src/elements/basic/io-field.ts:266](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L266)

___

### getCaretPosition

▸ **getCaretPosition**(): `number`

#### Returns

`number`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[getCaretPosition](IoMenuItem.md#getcaretposition)

#### Defined in

[src/elements/basic/io-field.ts:270](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L270)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[init](IoMenuItem.md#init)

#### Defined in

[src/core/node.ts:246](https://github.com/io-gui/io/blob/main/src/core/node.ts#L246)

___

### inputValue

▸ **inputValue**(`value`): `void`

Sets value property and emits `value-input` event.
Use this when value property is set by user action (e.g. mouse click).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | Property value. |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[inputValue](IoMenuItem.md#inputvalue)

#### Defined in

[src/core/node.ts:234](https://github.com/io-gui/io/blob/main/src/core/node.ts#L234)

___

### labelChanged

▸ **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[labelChanged](IoMenuItem.md#labelchanged)

#### Defined in

[src/core/element.ts:422](https://github.com/io-gui/io/blob/main/src/core/element.ts#L422)

___

### objectMutated

▸ **objectMutated**(`prop`): `void`

This function is called after `onObjectMutated()` determines that one of
the object properties has mutated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prop` | `string` | Mutated object property name. |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[objectMutated](IoMenuItem.md#objectmutated)

#### Defined in

[src/core/node.ts:308](https://github.com/io-gui/io/blob/main/src/core/node.ts#L308)

___

### onObjectMutated

▸ **onObjectMutated**(`event`): `void`

Event handler for 'object-mutated' event emitted from the `window`.
Node should be listening for this event if it has an observed object property

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `CustomEvent`\<`any`\> | Event payload. |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[onObjectMutated](IoMenuItem.md#onobjectmutated)

#### Defined in

[src/core/node.ts:287](https://github.com/io-gui/io/blob/main/src/core/node.ts#L287)

___

### preventDefault

▸ **preventDefault**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Event` |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[preventDefault](IoMenuItem.md#preventdefault)

#### Defined in

[src/elements/menus/io-menu-item.ts:63](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L63)

___

### queue

▸ **queue**(`prop`, `value`, `oldValue`): `void`

Adds property change to the queue.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prop` | `string` | Property name. |
| `value` | `any` | Property value. |
| `oldValue` | `any` | Old property value. |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[queue](IoMenuItem.md#queue)

#### Defined in

[src/core/node.ts:253](https://github.com/io-gui/io/blob/main/src/core/node.ts#L253)

___

### removeEventListener

▸ **removeEventListener**(`type`, `listener?`, `options?`): `void`

Wrapper for removeEventListener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | event name to listen to. |
| `listener?` | [`AnyEventListener`](../README.md#anyeventlistener) | listener handler. |
| `options?` | `AddEventListenerOptions` | event listener options. |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[removeEventListener](IoMenuItem.md#removeeventlistener)

#### Defined in

[src/core/node.ts:367](https://github.com/io-gui/io/blob/main/src/core/node.ts#L367)

___

### setAttribute

▸ **setAttribute**(`attr`, `value`): `void`

Alias for HTMLElement setAttribute where falsey values remove the attribute.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `attr` | `string` | Attribute name. |
| `value` | `string` \| `number` \| `boolean` | Attribute value. |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[setAttribute](IoMenuItem.md#setattribute)

#### Defined in

[src/core/element.ts:413](https://github.com/io-gui/io/blob/main/src/core/element.ts#L413)

___

### setCaretPosition

▸ **setCaretPosition**(`position`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `number` |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[setCaretPosition](IoMenuItem.md#setcaretposition)

#### Defined in

[src/elements/basic/io-field.ts:283](https://github.com/io-gui/io/blob/main/src/elements/basic/io-field.ts#L283)

___

### setProperties

▸ **setProperties**(`props`): `void`

Sets multiple properties in batch.
[property]-changed` events will be broadcast in the end.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `any` | Map of property names and values. |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[setProperties](IoMenuItem.md#setproperties)

#### Defined in

[src/core/node.ts:216](https://github.com/io-gui/io/blob/main/src/core/node.ts#L216)

___

### setProperty

▸ **setProperty**(`name`, `value`, `skipDispatch?`): `void`

Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Property name to set value of. |
| `value` | `any` | Peroperty value. |
| `skipDispatch?` | `boolean` | flag to skip event dispatch. |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[setProperty](IoMenuItem.md#setproperty)

#### Defined in

[src/core/node.ts:121](https://github.com/io-gui/io/blob/main/src/core/node.ts#L121)

___

### template

▸ **template**(`vDOM`, `host?`, `cache?`): `void`

Renders DOM from virtual DOM arrays.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vDOM` | `any`[] | Array of vDOM children. |
| `host?` | `HTMLElement` | Optional template target. |
| `cache?` | `boolean` | Optional don't reuse existing elements and skip dispose |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[template](IoMenuItem.md#template)

#### Defined in

[src/core/element.ts:233](https://github.com/io-gui/io/blob/main/src/core/element.ts#L233)

___

### throttle

▸ **throttle**(`func`, `arg?`, `timeout?`): `void`

Throttles function execution to next frame (rAF) if the function has been executed in the current frame.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `func` | [`CallbackFunction`](../README.md#callbackfunction) | `undefined` | Function to throttle. |
| `arg` | `any` | `undefined` | argument for throttled function. |
| `timeout` | `number` | `1` | minimum delay in ms before executing the function. |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[throttle](IoMenuItem.md#throttle)

#### Defined in

[src/core/node.ts:278](https://github.com/io-gui/io/blob/main/src/core/node.ts#L278)

___

### traverse

▸ **traverse**(`vChildren`, `host?`, `cache?`): `void`

Recurively traverses vDOM.
TODO: test element.traverse() function!

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vChildren` | `any`[] | Array of vDOM children converted by `buildTree()` for easier parsing. |
| `host?` | `HTMLElement` | Optional template target. |
| `cache?` | `boolean` | Optional don't reuse existing elements and skip dispose |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[traverse](IoMenuItem.md#traverse)

#### Defined in

[src/core/element.ts:246](https://github.com/io-gui/io/blob/main/src/core/element.ts#L246)

___

### unbind

▸ **unbind**(`prop`): `void`

Unbinds a binding to a specified property`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prop` | `string` | Property to unbind. |

#### Returns

`void`

#### Inherited from

[IoMenuItem](IoMenuItem.md).[unbind](IoMenuItem.md#unbind)

#### Defined in

[src/core/node.ts:336](https://github.com/io-gui/io/blob/main/src/core/node.ts#L336)
