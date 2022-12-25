# Class: IoMenuItem

It displays `option.icon`, `option.label` and `option.hint` property and it creates expandable `IoMenuOptions` from the `option.options` array. Options are expand in the direction specified by `direction` property. If `selectable` property is set, selecting an option sets its `value` to the entire menu tree and `selected` atribute is set on menu items whose `option.value` matches selected value.

## Hierarchy

- [`IoField`](IoField.md)

  ↳ **`IoMenuItem`**

## Constructors

### constructor

**new IoMenuItem**(...`args`)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Inherited from

[IoField](IoField.md).[constructor](IoField.md#constructor)

#### Defined in

[src/core/node.ts:63](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L63)

## Properties

### $

 **$**: `Record`<`string`, `any`\>

#### Inherited from

[IoField](IoField.md).[$](IoField.md#$)

#### Defined in

[src/core/element.ts:243](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L243)

___

### $options

 `Optional` **$options**: [`IoMenuOptions`](IoMenuOptions.md)

#### Defined in

[src/elements/menus/io-menu-item.ts:72](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L72)

___

### \_bindings

 `Readonly` **\_bindings**: `Map`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoField](IoField.md).[_bindings](IoField.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

 `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoField](IoField.md).[_changeQueue](IoField.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

 `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoField](IoField.md).[_eventDispatcher](IoField.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L57)

___

### \_properties

 `Readonly` **\_properties**: `Map`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoField](IoField.md).[_properties](IoField.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L54)

___

### \_protochain

 `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoField](IoField.md).[_protochain](IoField.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L53)

___

### appearance

 **appearance**: ``"inset"`` \| ``"flush"`` \| ``"outset"`` \| ``"neutral"``

#### Inherited from

[IoField](IoField.md).[appearance](IoField.md#appearance)

#### Defined in

[src/elements/basic/io-field.ts:87](https://github.com/io-gui/iogui/blob/main/src/elements/basic/io-field.ts#L87)

___

### class

 **class**: `string`

#### Inherited from

[IoField](IoField.md).[class](IoField.md#class)

#### Defined in

[src/core/element.ts:252](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L252)

___

### contenteditable

 **contenteditable**: `boolean`

#### Inherited from

[IoField](IoField.md).[contenteditable](IoField.md#contenteditable)

#### Defined in

[src/core/element.ts:249](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L249)

___

### depth

 **depth**: `number`

#### Defined in

[src/elements/menus/io-menu-item.ts:69](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L69)

___

### direction

 **direction**: `string`

#### Defined in

[src/elements/menus/io-menu-item.ts:66](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L66)

___

### disabled

 **disabled**: `boolean`

#### Inherited from

[IoField](IoField.md).[disabled](IoField.md#disabled)

#### Defined in

[src/core/element.ts:273](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L273)

___

### expanded

 **expanded**: `boolean`

#### Defined in

[src/elements/menus/io-menu-item.ts:63](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L63)

___

### hidden

 **hidden**: `boolean`

#### Inherited from

[IoField](IoField.md).[hidden](IoField.md#hidden)

#### Defined in

[src/core/element.ts:270](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L270)

___

### icon

 **icon**: `string`

#### Inherited from

[IoField](IoField.md).[icon](IoField.md#icon)

#### Defined in

[src/elements/basic/io-field.ts:84](https://github.com/io-gui/iogui/blob/main/src/elements/basic/io-field.ts#L84)

___

### id

 **id**: `string`

#### Inherited from

[IoField](IoField.md).[id](IoField.md#id)

#### Defined in

[src/core/element.ts:267](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L267)

___

### invalid

 **invalid**: `boolean`

#### Inherited from

[IoField](IoField.md).[invalid](IoField.md#invalid)

#### Defined in

[src/elements/basic/io-field.ts:96](https://github.com/io-gui/iogui/blob/main/src/elements/basic/io-field.ts#L96)

___

### item

 **item**: [`MenuItem`](MenuItem.md)

#### Defined in

[src/elements/menus/io-menu-item.ts:60](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L60)

___

### label

 **label**: `string`

#### Inherited from

[IoField](IoField.md).[label](IoField.md#label)

#### Defined in

[src/core/element.ts:258](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L258)

___

### name

 **name**: `string`

#### Inherited from

[IoField](IoField.md).[name](IoField.md#name)

#### Defined in

[src/core/element.ts:261](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L261)

___

### placeholder

 **placeholder**: `string`

#### Inherited from

[IoField](IoField.md).[placeholder](IoField.md#placeholder)

#### Defined in

[src/elements/basic/io-field.ts:99](https://github.com/io-gui/iogui/blob/main/src/elements/basic/io-field.ts#L99)

___

### role

 **role**: `string`

#### Inherited from

[IoField](IoField.md).[role](IoField.md#role)

#### Defined in

[src/core/element.ts:255](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L255)

___

### selected

 **selected**: `boolean`

#### Inherited from

[IoField](IoField.md).[selected](IoField.md#selected)

#### Defined in

[src/elements/basic/io-field.ts:93](https://github.com/io-gui/iogui/blob/main/src/elements/basic/io-field.ts#L93)

___

### stroke

 **stroke**: `boolean`

#### Inherited from

[IoField](IoField.md).[stroke](IoField.md#stroke)

#### Defined in

[src/elements/basic/io-field.ts:90](https://github.com/io-gui/iogui/blob/main/src/elements/basic/io-field.ts#L90)

___

### tabindex

 **tabindex**: `string`

#### Inherited from

[IoField](IoField.md).[tabindex](IoField.md#tabindex)

#### Defined in

[src/elements/basic/io-field.ts:78](https://github.com/io-gui/iogui/blob/main/src/elements/basic/io-field.ts#L78)

___

### title

 **title**: `string`

#### Inherited from

[IoField](IoField.md).[title](IoField.md#title)

#### Defined in

[src/core/element.ts:264](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L264)

___

### value

 **value**: `any`

#### Inherited from

[IoField](IoField.md).[value](IoField.md#value)

#### Defined in

[src/elements/basic/io-field.ts:81](https://github.com/io-gui/iogui/blob/main/src/elements/basic/io-field.ts#L81)

## Accessors

### $parent

`get` **$parent**(): `any`

#### Returns

`any`

#### Defined in

[src/elements/menus/io-menu-item.ts:89](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L89)

___

### hasmore

`get` **hasmore**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/elements/menus/io-menu-item.ts:83](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L83)

___

### inlayer

`get` **inlayer**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/elements/menus/io-menu-item.ts:86](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L86)

___

### textNode

`get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoField.textNode

#### Defined in

[src/core/element.ts:391](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L391)

`set` **textNode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

IoField.textNode

#### Defined in

[src/core/element.ts:395](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L395)

___

### Listeners

`Static` `get` **Listeners**(): `any`

#### Returns

`any`

#### Overrides

IoField.Listeners

#### Defined in

[src/elements/menus/io-menu-item.ts:74](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L74)

___

### Properties

`Static` `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoField.Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L44)

___

### Style

`Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoField.Style

#### Defined in

[src/elements/menus/io-menu-item.ts:15](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L15)

## Methods

### \_expandHovered

**_expandHovered**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:236](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L236)

___

### \_flattenTextNode

**_flattenTextNode**(`element`): `void`

Helper function to flatten textContent into a single TextNode.
Update textContent via TextNode is better for layout performance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `element` | `HTMLElement` \| [`IoElement`](IoElement.md) | Element to flatten. |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[_flattenTextNode](IoField.md#_flattentextnode)

#### Defined in

[src/core/element.ts:374](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L374)

___

### \_gethovered

**_gethovered**(`event`): `undefined` \| `IoMenuElementType`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`undefined` \| `IoMenuElementType`

#### Defined in

[src/elements/menus/io-menu-item.ts:220](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L220)

___

### \_onBlur

**_onBlur**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `FocusEvent` |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[_onBlur](IoField.md#_onblur)

#### Defined in

[src/elements/basic/io-field.ts:114](https://github.com/io-gui/iogui/blob/main/src/elements/basic/io-field.ts#L114)

___

### \_onClick

**_onClick**(): `void`

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[_onClick](IoField.md#_onclick)

#### Defined in

[src/elements/menus/io-menu-item.ts:112](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L112)

___

### \_onCollapse

**_onCollapse**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:322](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L322)

___

### \_onCollapseRoot

**_onCollapseRoot**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:325](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L325)

___

### \_onFocus

**_onFocus**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `FocusEvent` |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[_onFocus](IoField.md#_onfocus)

#### Defined in

[src/elements/basic/io-field.ts:109](https://github.com/io-gui/iogui/blob/main/src/elements/basic/io-field.ts#L109)

___

### \_onFocusTo

**_onFocusTo**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`<`any`\> |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[_onFocusTo](IoField.md#_onfocusto)

#### Defined in

[src/elements/basic/io-field.ts:160](https://github.com/io-gui/iogui/blob/main/src/elements/basic/io-field.ts#L160)

___

### \_onItemClicked

**_onItemClicked**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:137](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L137)

___

### \_onKeydown

**_onKeydown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `KeyboardEvent` |

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[_onKeydown](IoField.md#_onkeydown)

#### Defined in

[src/elements/menus/io-menu-item.ts:257](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L257)

___

### \_onKeyup

**_onKeyup**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `KeyboardEvent` |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[_onKeyup](IoField.md#_onkeyup)

#### Defined in

[src/elements/basic/io-field.ts:159](https://github.com/io-gui/iogui/blob/main/src/elements/basic/io-field.ts#L159)

___

### \_onOverlayPointermove

**_onOverlayPointermove**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:106](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L106)

___

### \_onOverlayPointerup

**_onOverlayPointerup**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:109](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L109)

___

### \_onPointerdown

**_onPointerdown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[_onPointerdown](IoField.md#_onpointerdown)

#### Defined in

[src/elements/menus/io-menu-item.ts:145](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L145)

___

### \_onPointerdownAction

**_onPointerdownAction**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:153](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L153)

___

### \_onPointerleave

**_onPointerleave**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[_onPointerleave](IoField.md#_onpointerleave)

#### Defined in

[src/elements/basic/io-field.ts:126](https://github.com/io-gui/iogui/blob/main/src/elements/basic/io-field.ts#L126)

___

### \_onPointermove

**_onPointermove**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[_onPointermove](IoField.md#_onpointermove)

#### Defined in

[src/elements/menus/io-menu-item.ts:166](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L166)

___

### \_onPointermoveAction

**_onPointermoveAction**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:170](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L170)

___

### \_onPointerup

**_onPointerup**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[_onPointerup](IoField.md#_onpointerup)

#### Defined in

[src/elements/menus/io-menu-item.ts:203](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L203)

___

### \_onPointerupAction

**_onPointerupAction**(`event`, `skipCollapse?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `event` | `PointerEvent` | `undefined` |
| `skipCollapse` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:209](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L209)

___

### addEventListener

**addEventListener**(`type`, `listener`, `options?`): `void`

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

[IoField](IoField.md).[addEventListener](IoField.md#addeventlistener)

#### Defined in

[src/core/node.ts:368](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L368)

___

### applyProperties

**applyProperties**(`props`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `any` |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[applyProperties](IoField.md#applyproperties)

#### Defined in

[src/core/element.ts:399](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L399)

___

### bind

**bind**(`prop`): [`Binding`](Binding.md)

Returns a binding to a specified property`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prop` | `string` | Property to bind to. |

#### Returns

[`Binding`](Binding.md)

Binding object.

#### Inherited from

[IoField](IoField.md).[bind](IoField.md#bind)

#### Defined in

[src/core/node.ts:335](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L335)

___

### changed

**changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[changed](IoField.md#changed)

#### Defined in

[src/elements/menus/io-menu-item.ts:365](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L365)

___

### connectedCallback

**connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[connectedCallback](IoField.md#connectedcallback)

#### Defined in

[src/elements/menus/io-menu-item.ts:93](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L93)

___

### disabledChanged

**disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[disabledChanged](IoField.md#disabledchanged)

#### Defined in

[src/core/element.ts:428](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L428)

___

### disconnectedCallback

**disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Overrides

[IoField](IoField.md).[disconnectedCallback](IoField.md#disconnectedcallback)

#### Defined in

[src/elements/menus/io-menu-item.ts:100](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L100)

___

### dispatchEvent

**dispatchEvent**(`type`, `detail?`, `bubbles?`, `src?`): `void`

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

[IoField](IoField.md).[dispatchEvent](IoField.md#dispatchevent)

#### Defined in

[src/core/node.ts:393](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L393)

___

### dispatchQueue

**dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[dispatchQueue](IoField.md#dispatchqueue)

#### Defined in

[src/core/node.ts:277](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L277)

___

### dispatchQueueSync

**dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[dispatchQueueSync](IoField.md#dispatchqueuesync)

#### Defined in

[src/core/node.ts:287](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L287)

___

### dispose

**dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[dispose](IoField.md#dispose)

#### Defined in

[src/core/node.ts:400](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L400)

___

### expandedChanged

**expandedChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:328](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L328)

___

### focusTo

**focusTo**(`dir`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dir` | `string` |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[focusTo](IoField.md#focusto)

#### Defined in

[src/elements/basic/io-field.ts:267](https://github.com/io-gui/iogui/blob/main/src/elements/basic/io-field.ts#L267)

___

### getCaretPosition

**getCaretPosition**(): `number`

#### Returns

`number`

#### Inherited from

[IoField](IoField.md).[getCaretPosition](IoField.md#getcaretposition)

#### Defined in

[src/elements/basic/io-field.ts:271](https://github.com/io-gui/iogui/blob/main/src/elements/basic/io-field.ts#L271)

___

### init

**init**(): `void`

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[init](IoField.md#init)

#### Defined in

[src/core/node.ts:264](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L264)

___

### inputValue

**inputValue**(`value`): `void`

Sets value property and emits `value-input` event.
Use this when value property is set by user action (e.g. mouse click).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | Property value. |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[inputValue](IoField.md#inputvalue)

#### Defined in

[src/core/node.ts:252](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L252)

___

### labelChanged

**labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[labelChanged](IoField.md#labelchanged)

#### Defined in

[src/core/element.ts:421](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L421)

___

### objectMutated

**objectMutated**(`prop`): `void`

This function is called after `onObjectMutated()` determines that one of
the object properties has mutated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prop` | `string` | Mutated object property name. |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[objectMutated](IoField.md#objectmutated)

#### Defined in

[src/core/node.ts:326](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L326)

___

### onObjectMutated

**onObjectMutated**(`event`): `void`

Event handler for 'object-mutated' event emitted from the `window`.
Node should be listening for this event if it has an observed object property

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `CustomEvent`<`any`\> | Event payload. |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[onObjectMutated](IoField.md#onobjectmutated)

#### Defined in

[src/core/node.ts:305](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L305)

___

### preventDefault

**preventDefault**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Event` |

#### Returns

`void`

#### Defined in

[src/elements/menus/io-menu-item.ts:79](https://github.com/io-gui/iogui/blob/main/src/elements/menus/io-menu-item.ts#L79)

___

### queue

**queue**(`prop`, `value`, `oldValue`): `void`

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

[IoField](IoField.md).[queue](IoField.md#queue)

#### Defined in

[src/core/node.ts:271](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L271)

___

### removeEventListener

**removeEventListener**(`type`, `listener?`, `options?`): `void`

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

[IoField](IoField.md).[removeEventListener](IoField.md#removeeventlistener)

#### Defined in

[src/core/node.ts:383](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L383)

___

### setAttribute

**setAttribute**(`attr`, `value`): `void`

Alias for HTMLElement setAttribute where falsey values remove the attribute.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `attr` | `string` | Attribute name. |
| `value` | `string` \| `number` \| `boolean` | Attribute value. |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[setAttribute](IoField.md#setattribute)

#### Defined in

[src/core/element.ts:412](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L412)

___

### setCaretPosition

**setCaretPosition**(`position`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `number` |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[setCaretPosition](IoField.md#setcaretposition)

#### Defined in

[src/elements/basic/io-field.ts:284](https://github.com/io-gui/iogui/blob/main/src/elements/basic/io-field.ts#L284)

___

### setProperties

**setProperties**(`props`): `void`

Sets multiple properties in batch.
[property]-changed` events will be broadcast in the end.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `props` | `any` | Map of property names and values. |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[setProperties](IoField.md#setproperties)

#### Defined in

[src/core/node.ts:234](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L234)

___

### setProperty

**setProperty**(`name`, `value`, `skipDispatch?`): `void`

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

[IoField](IoField.md).[setProperty](IoField.md#setproperty)

#### Defined in

[src/core/node.ts:129](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L129)

___

### template

**template**(`vDOM`, `host?`, `cache?`): `void`

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

[IoField](IoField.md).[template](IoField.md#template)

#### Defined in

[src/core/element.ts:298](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L298)

___

### throttle

**throttle**(`func`, `arg?`, `sync?`): `void`

Throttles function execution to next frame (rAF) if the function has been executed in the current frame.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `func` | [`CallbackFunction`](../README.md#callbackfunction) | `undefined` | Function to throttle. |
| `arg` | `any` | `undefined` | argument for throttled function. |
| `sync` | `boolean` | `false` | execute immediately without rAF timeout. |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[throttle](IoField.md#throttle)

#### Defined in

[src/core/node.ts:296](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L296)

___

### traverse

**traverse**(`vChildren`, `host?`, `cache?`): `void`

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

[IoField](IoField.md).[traverse](IoField.md#traverse)

#### Defined in

[src/core/element.ts:311](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L311)

___

### unbind

**unbind**(`prop`): `void`

Unbinds a binding to a specified property`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prop` | `string` | Property to unbind. |

#### Returns

`void`

#### Inherited from

[IoField](IoField.md).[unbind](IoField.md#unbind)

#### Defined in

[src/core/node.ts:352](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L352)
