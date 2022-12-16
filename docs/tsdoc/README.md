# io-gui

## Namespaces

- [IoStorage](modules/IoStorage.md)

## Classes

- [Binding](classes/Binding.md)
- [ChangeQueue](classes/ChangeQueue.md)
- [Color](classes/Color.md)
- [EventDispatcher](classes/EventDispatcher.md)
- [IoBoolean](classes/IoBoolean.md)
- [IoBreadcrumbs](classes/IoBreadcrumbs.md)
- [IoButton](classes/IoButton.md)
- [IoCollapsable](classes/IoCollapsable.md)
- [IoColorBase](classes/IoColorBase.md)
- [IoColorPanel](classes/IoColorPanel.md)
- [IoColorPicker](classes/IoColorPicker.md)
- [IoColorRgba](classes/IoColorRgba.md)
- [IoColorSlider](classes/IoColorSlider.md)
- [IoColorSlider2dBase](classes/IoColorSlider2dBase.md)
- [IoColorSliderA](classes/IoColorSliderA.md)
- [IoColorSliderB](classes/IoColorSliderB.md)
- [IoColorSliderBase](classes/IoColorSliderBase.md)
- [IoColorSliderC](classes/IoColorSliderC.md)
- [IoColorSliderG](classes/IoColorSliderG.md)
- [IoColorSliderH](classes/IoColorSliderH.md)
- [IoColorSliderHs](classes/IoColorSliderHs.md)
- [IoColorSliderK](classes/IoColorSliderK.md)
- [IoColorSliderL](classes/IoColorSliderL.md)
- [IoColorSliderM](classes/IoColorSliderM.md)
- [IoColorSliderR](classes/IoColorSliderR.md)
- [IoColorSliderS](classes/IoColorSliderS.md)
- [IoColorSliderSL](classes/IoColorSliderSL.md)
- [IoColorSliderSv](classes/IoColorSliderSv.md)
- [IoColorSliderV](classes/IoColorSliderV.md)
- [IoColorSliderY](classes/IoColorSliderY.md)
- [IoColorSwatch](classes/IoColorSwatch.md)
- [IoContextMenu](classes/IoContextMenu.md)
- [IoElement](classes/IoElement.md)
- [IoField](classes/IoField.md)
- [IoGl](classes/IoGl.md)
- [IoIcon](classes/IoIcon.md)
- [IoIconset](classes/IoIconset.md)
- [IoInspector](classes/IoInspector.md)
- [IoLabel](classes/IoLabel.md)
- [IoLayer](classes/IoLayer.md)
- [IoMatrix](classes/IoMatrix.md)
- [IoMdNavigator](classes/IoMdNavigator.md)
- [IoMdView](classes/IoMdView.md)
- [IoMenuItem](classes/IoMenuItem.md)
- [IoMenuOptions](classes/IoMenuOptions.md)
- [IoMenuTree](classes/IoMenuTree.md)
- [IoNavigator](classes/IoNavigator.md)
- [IoNode](classes/IoNode.md)
- [IoNotify](classes/IoNotify.md)
- [IoNumber](classes/IoNumber.md)
- [IoNumberLadder](classes/IoNumberLadder.md)
- [IoNumberLadderStep](classes/IoNumberLadderStep.md)
- [IoNumberSlider](classes/IoNumberSlider.md)
- [IoNumberSliderRange](classes/IoNumberSliderRange.md)
- [IoObject](classes/IoObject.md)
- [IoOptionMenu](classes/IoOptionMenu.md)
- [IoProperties](classes/IoProperties.md)
- [IoScroller](classes/IoScroller.md)
- [IoSelector](classes/IoSelector.md)
- [IoSlider](classes/IoSlider.md)
- [IoSlider2d](classes/IoSlider2d.md)
- [IoSliderBase](classes/IoSliderBase.md)
- [IoSliderRange](classes/IoSliderRange.md)
- [IoStorageNode](classes/IoStorageNode.md)
- [IoString](classes/IoString.md)
- [IoSwitch](classes/IoSwitch.md)
- [IoTheme](classes/IoTheme.md)
- [IoVector](classes/IoVector.md)
- [MenuItem](classes/MenuItem.md)
- [MenuOptions](classes/MenuOptions.md)
- [ObjectConfig](classes/ObjectConfig.md)
- [ObjectGroups](classes/ObjectGroups.md)
- [ObjectWidgets](classes/ObjectWidgets.md)
- [PropertyInstance](classes/PropertyInstance.md)
- [ProtoChain](classes/ProtoChain.md)
- [ProtoProperty](classes/ProtoProperty.md)

## Interfaces

- [Change](interfaces/Change.md)
- [ChangeEvent](interfaces/ChangeEvent.md)
- [IoNodeConstructor](interfaces/IoNodeConstructor.md)

## Type Aliases

### AnyEventListener

 **AnyEventListener**: `EventListener` \| [`KeyboardEventListener`](README.md#keyboardeventlistener) \| [`PointerEventListener`](README.md#pointereventlistener) \| [`CustomEventListener`](README.md#customeventlistener) \| [`FocusEventListener`](README.md#focuseventlistener) \| [`TouchEventListener`](README.md#toucheventlistener)

#### Defined in

[src/core/node.ts:23](https://github.com/io-gui/io/blob/main/src/core/node.ts#L23)

___

### CallbackFunction

 **CallbackFunction**: (`arg?`: `any`) => `void`

#### Type declaration

(`arg?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `arg?` | `any` |

##### Returns

`void`

#### Defined in

[src/core/node.ts:16](https://github.com/io-gui/io/blob/main/src/core/node.ts#L16)

___

### Constructor

 **Constructor**: (...`args`: `any`[]) => `unknown`

#### Type declaration

(...`args`)

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Defined in

[src/core/node.ts:7](https://github.com/io-gui/io/blob/main/src/core/node.ts#L7)

___

### CustomEventListener

 **CustomEventListener**: (`event`: `CustomEvent`) => `void` \| `EventListener`

#### Type declaration

(`event`): `void` \| `EventListener`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent` |

##### Returns

`void` \| `EventListener`

#### Defined in

[src/core/node.ts:20](https://github.com/io-gui/io/blob/main/src/core/node.ts#L20)

___

### FocusEventListener

 **FocusEventListener**: (`event`: `FocusEvent`) => `void`

#### Type declaration

(`event`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `FocusEvent` |

##### Returns

`void`

#### Defined in

[src/core/node.ts:21](https://github.com/io-gui/io/blob/main/src/core/node.ts#L21)

___

### IoElementArgs

 **IoElementArgs**: [`IoNodeArgs`](README.md#ionodeargs) & { `[key: string]`: `any`; `cache?`: `boolean` ; `class?`: `string` ; `contenteditable?`: `boolean` ; `disabled?`: `boolean` ; `hidden?`: `boolean` ; `id?`: `string` ; `label?`: `string` ; `name?`: `string` ; `role?`: `string` ; `tabindex?`: `string` ; `title?`: `string`  }

#### Defined in

[src/core/element.ts:20](https://github.com/io-gui/io/blob/main/src/core/element.ts#L20)

___

### IoNodeArgs

 **IoNodeArgs**: `Object`

#### Index signature

▪ [key: `prefix`<`string`, ``"on-"``\>]: `string` \| (`event`: `CustomEvent`<`any`\>) => `void`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `lazy?` | `boolean` |

#### Defined in

[src/core/node.ts:32](https://github.com/io-gui/io/blob/main/src/core/node.ts#L32)

___

### KeyboardEventListener

 **KeyboardEventListener**: (`event`: `KeyboardEvent`) => `void`

#### Type declaration

(`event`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `KeyboardEvent` |

##### Returns

`void`

#### Defined in

[src/core/node.ts:18](https://github.com/io-gui/io/blob/main/src/core/node.ts#L18)

___

### Listener

 **Listener**: [[`CustomEventListener`](README.md#customeventlistener), AddEventListenerOptions?]

#### Defined in

[src/core/internals/eventDispatcher.ts:60](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L60)

___

### ListenerDeclaration

 **ListenerDeclaration**: [`string` \| [`CustomEventListener`](README.md#customeventlistener), AddEventListenerOptions?]

Declares default listeners.

#### Defined in

[src/core/internals/eventDispatcher.ts:6](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L6)

___

### ListenerDeclarationWeak

 **ListenerDeclarationWeak**: `string` \| [`CustomEventListener`](README.md#customeventlistener) \| [`ListenerDeclaration`](README.md#listenerdeclaration)

Allows weak declaration of listeners by specifying only partial declarations such as function or function name.

#### Defined in

[src/core/internals/eventDispatcher.ts:11](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L11)

___

### Listeners

 **Listeners**: `Record`<`string`, [`Listener`](README.md#listener)[]\>

#### Defined in

[src/core/internals/eventDispatcher.ts:61](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L61)

___

### ListenersDeclaration

 **ListenersDeclaration**: `Record`<`string`, [`ListenerDeclarationWeak`](README.md#listenerdeclarationweak)\>

#### Defined in

[src/core/internals/eventDispatcher.ts:63](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L63)

___

### MenuItemArgs

 **MenuItemArgs**: [`IoElementArgs`](README.md#ioelementargs) & { `action?`: () => `void` ; `hint?`: `string` ; `icon?`: `string` ; `options?`: [`MenuItemArgsWeak`](README.md#menuitemargsweak)[] \| [`MenuOptions`](classes/MenuOptions.md) ; `select?`: [`MenuItemSelectType`](README.md#menuitemselecttype) ; `selected?`: `boolean` ; `value?`: `any`  }

#### Defined in

[src/elements/menus/models/menu-item.ts:10](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L10)

___

### MenuItemArgsWeak

 **MenuItemArgsWeak**: `undefined` \| ``null`` \| `string` \| `number` \| [`MenuItemArgs`](README.md#menuitemargs)

#### Defined in

[src/elements/menus/models/menu-item.ts:8](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L8)

___

### MenuItemSelectType

 **MenuItemSelectType**: ``"pick"`` \| ``"toggle"`` \| ``"link"`` \| ``"none"``

#### Defined in

[src/elements/menus/models/menu-item.ts:6](https://github.com/io-gui/io/blob/main/src/elements/menus/models/menu-item.ts#L6)

___

### NudgeDirection

 **NudgeDirection**: ``"none"`` \| ``"pointer"`` \| ``"up"`` \| ``"left"`` \| ``"down"`` \| ``"right"``

#### Defined in

[src/core/layer.ts:18](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L18)

___

### PointerEventListener

 **PointerEventListener**: (`event`: `PointerEvent`) => `void`

#### Type declaration

(`event`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

##### Returns

`void`

#### Defined in

[src/core/node.ts:19](https://github.com/io-gui/io/blob/main/src/core/node.ts#L19)

___

### PropertyDeclaration

 **PropertyDeclaration**: `Object`

Declares default value, type and reactive behavior of the property.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `binding?` | [`Binding`](classes/Binding.md) |
| `notify?` | `boolean` |
| `observe?` | `boolean` |
| `reflect?` | `boolean` |
| `type?` | [`Constructor`](README.md#constructor) \| [`Constructor`](README.md#constructor)[] |
| `value?` | `any` |

#### Defined in

[src/core/internals/property.ts:7](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L7)

___

### PropertyDeclarationWeak

 **PropertyDeclarationWeak**: `string` \| `number` \| `boolean` \| `any`[] \| ``null`` \| `undefined` \| [`Constructor`](README.md#constructor) \| [`Binding`](classes/Binding.md) \| [`PropertyDeclaration`](README.md#propertydeclaration)

Allows weak declaration of properties by specifying only partial declarations such as default value or type.

#### Defined in

[src/core/internals/property.ts:19](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L19)

___

### PropertyDeclarations

 **PropertyDeclarations**: `Record`<`string`, [`PropertyDeclarationWeak`](README.md#propertydeclarationweak)\>

#### Defined in

[src/core/internals/property.ts:138](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L138)

___

### TouchEventListener

 **TouchEventListener**: (`event`: `TouchEvent`) => `void`

#### Type declaration

(`event`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `TouchEvent` |

##### Returns

`void`

#### Defined in

[src/core/node.ts:22](https://github.com/io-gui/io/blob/main/src/core/node.ts#L22)

___

### VDOMArray

 **VDOMArray**: [`string`, [`IoElementArgs`](README.md#ioelementargs) \| `string` \| [`VDOMArray`](README.md#vdomarray)[]] \| [`string`, [`IoElementArgs`](README.md#ioelementargs) \| `string`, [`VDOMArray`](README.md#vdomarray)[] \| `string`]

#### Defined in

[src/core/element.ts:39](https://github.com/io-gui/io/blob/main/src/core/element.ts#L39)

___

### VDOMElement

 **VDOMElement**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `children` | [`VDOMElement`](README.md#vdomelement)[] |
| `name` | `string` |
| `props` | [`IoElementArgs`](README.md#ioelementargs) |

#### Defined in

[src/core/element.ts:43](https://github.com/io-gui/io/blob/main/src/core/element.ts#L43)

## Variables

### IoColorPanelSingleton

 `Const` **IoColorPanelSingleton**: [`IoColorPanel`](classes/IoColorPanel.md)

#### Defined in

[src/elements/color/io-color-panel.ts:105](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-panel.ts#L105)

___

### IoIconsetSingleton

 `Const` **IoIconsetSingleton**: [`IoIconset`](classes/IoIconset.md)

#### Defined in

[src/elements/basic/io-iconset.ts:41](https://github.com/io-gui/io/blob/main/src/elements/basic/io-iconset.ts#L41)

___

### IoLayerSingleton

 `Const` **IoLayerSingleton**: [`IoLayer`](classes/IoLayer.md)

#### Defined in

[src/core/layer.ts:227](https://github.com/io-gui/io/blob/main/src/core/layer.ts#L227)

___

### IoNumberLadderSingleton

 `Const` **IoNumberLadderSingleton**: [`IoNumberLadder`](classes/IoNumberLadder.md)

#### Defined in

[src/elements/basic/io-number.ts:560](https://github.com/io-gui/io/blob/main/src/elements/basic/io-number.ts#L560)

___

### IoThemeSingleton

 `Const` **IoThemeSingleton**: [`IoTheme`](classes/IoTheme.md)

#### Defined in

[src/core/theme.ts:290](https://github.com/io-gui/io/blob/main/src/core/theme.ts#L290)

___

### LICENSE

 `Const` **LICENSE**: ``"MIT"``

**`License`**

Copyright ©2022 Aleksandar (Aki) Rodic

The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

#### Defined in

[src/iogui.ts:33](https://github.com/io-gui/io/blob/main/src/iogui.ts#L33)

___

### PropertyDecorators

 `Const` **PropertyDecorators**: `WeakMap`<[`Constructor`](README.md#constructor), [`PropertyDeclarations`](README.md#propertydeclarations)\>

#### Defined in

[src/core/internals/property.ts:140](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L140)

## Functions

### IoNodeMixin

**IoNodeMixin**<`T`\>(`superclass`): typeof `__class`

Core mixin for `Node` classes.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`IoNodeConstructor`](interfaces/IoNodeConstructor.md)<`any`, `T`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `superclass` | `T` | Class to extend. |

#### Returns

typeof `__class`

- Extended class constructor with `IoNodeMixin` applied to it.

#### Defined in

[src/core/node.ts:42](https://github.com/io-gui/io/blob/main/src/core/node.ts#L42)

___

### IoStorage

**IoStorage**(`props`): [`Binding`](classes/Binding.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `StorageProps` |

#### Returns

[`Binding`](classes/Binding.md)

#### Defined in

[src/core/storage.ts:255](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L255)

___

### Property

**Property**(`propertyDefinition`): (`target`: [`IoNode`](classes/IoNode.md), `propertyName`: `string`) => `void`

Allows property declarations using decorator pattern.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `propertyDefinition` | [`PropertyDeclarationWeak`](README.md#propertydeclarationweak) | Property declaration. |

#### Returns

`fn`

Property decorator function.

(`target`, `propertyName`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`IoNode`](classes/IoNode.md) |
| `propertyName` | `string` |

##### Returns

`void`

#### Defined in

[src/core/internals/property.ts:147](https://github.com/io-gui/io/blob/main/src/core/internals/property.ts#L147)

___

### RegisterIoElement

**RegisterIoElement**(`elementConstructor`): `void`

Register function for `IoElement`. Registers custom element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `elementConstructor` | typeof [`IoElement`](classes/IoElement.md) | Element class to register. |

#### Returns

`void`

#### Defined in

[src/core/element.ts:89](https://github.com/io-gui/io/blob/main/src/core/element.ts#L89)

___

### RegisterIoNode

**RegisterIoNode**(`target`): `void`

Register function to be called once per class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | typeof [`IoNode`](classes/IoNode.md) | Node class to register. |

#### Returns

`void`

#### Defined in

[src/core/node.ts:418](https://github.com/io-gui/io/blob/main/src/core/node.ts#L418)

___

### addMenuOptions

**addMenuOptions**(`options`, `depth`, `d?`): [`VDOMArray`](README.md#vdomarray)[]

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `options` | [`MenuOptions`](classes/MenuOptions.md) | `undefined` |
| `depth` | `number` | `undefined` |
| `d` | `number` | `0` |

#### Returns

[`VDOMArray`](README.md#vdomarray)[]

#### Defined in

[src/elements/menus/io-menu-tree.ts:8](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-tree.ts#L8)

___

### applyNativeElementProps

**applyNativeElementProps**(`element`, `props`): `void`

Sets element properties.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `element` | `HTMLElement` | Element to set properties on. |
| `props` | `any` | Element properties. |

#### Returns

`void`

#### Defined in

[src/core/element.ts:206](https://github.com/io-gui/io/blob/main/src/core/element.ts#L206)

___

### assignListenerDeclaration

**assignListenerDeclaration**(`defs`, `srcDef`): `void`

Assigns source listener declaration to an existing array of listener declarations.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `defs` | [`ListenerDeclaration`](README.md#listenerdeclaration)[] | Array of listener declarations |
| `srcDef` | [`ListenerDeclaration`](README.md#listenerdeclaration) | Source listener declaration |

#### Returns

`void`

#### Defined in

[src/core/internals/eventDispatcher.ts:27](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L27)

___

### buildTree

**buildTree**(): (`node`: [`VDOMArray`](README.md#vdomarray)) => `any`

#### Returns

`fn`

(`node`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`VDOMArray`](README.md#vdomarray) |

##### Returns

`any`

#### Defined in

[src/core/element.ts:79](https://github.com/io-gui/io/blob/main/src/core/element.ts#L79)

___

### disposeElementDeep

**disposeElementDeep**(`element`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | [`IoElement`](classes/IoElement.md) |

#### Returns

`void`

#### Defined in

[src/core/element.ts:175](https://github.com/io-gui/io/blob/main/src/core/element.ts#L175)

___

### filterOptions

**filterOptions**(`options`, `search`, `depth?`, `elements?`, `d?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `options` | [`MenuOptions`](classes/MenuOptions.md) | `undefined` |
| `search` | `string` | `undefined` |
| `depth` | `number` | `5` |
| `elements` | [`VDOMArray`](README.md#vdomarray)[] | `[]` |
| `d` | `number` | `0` |

#### Returns

`any`

#### Defined in

[src/elements/menus/io-menu-tree.ts:37](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-tree.ts#L37)

___

### genObjectStorageID

**genObjectStorageID**(`object`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `object` | `Record`<`string`, `any`\> |

#### Returns

`string`

#### Defined in

[src/core/storage.ts:98](https://github.com/io-gui/io/blob/main/src/core/storage.ts#L98)

___

### getMenuAncestors

**getMenuAncestors**(`element`): ([`IoMenuItem`](classes/IoMenuItem.md) \| [`IoMenuOptions`](classes/IoMenuOptions.md))[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `IoMenuElementType` |

#### Returns

([`IoMenuItem`](classes/IoMenuItem.md) \| [`IoMenuOptions`](classes/IoMenuOptions.md))[]

#### Defined in

[src/elements/menus/io-menu-item.ts:394](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L394)

___

### getMenuDescendants

**getMenuDescendants**(`element`): `IoMenuElementType`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `IoMenuElementType` |

#### Returns

`IoMenuElementType`[]

#### Defined in

[src/elements/menus/io-menu-item.ts:373](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L373)

___

### getMenuRoot

**getMenuRoot**(`element`): `IoMenuElementType`

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `IoMenuElementType` |

#### Returns

`IoMenuElementType`

#### Defined in

[src/elements/menus/io-menu-item.ts:404](https://github.com/io-gui/io/blob/main/src/elements/menus/io-menu-item.ts#L404)

___

### hardenListenerDeclaration

**hardenListenerDeclaration**(`def`): [`ListenerDeclaration`](README.md#listenerdeclaration)

Takes weakly typed listener declaration and returns stronly typed listener declaration.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `def` | [`ListenerDeclarationWeak`](README.md#listenerdeclarationweak) | Weakly typed listener declaration |

#### Returns

[`ListenerDeclaration`](README.md#listenerdeclaration)

Stronly typed listener declaration

#### Defined in

[src/core/internals/eventDispatcher.ts:18](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L18)

___

### listenerFromDefinition

**listenerFromDefinition**(`node`, `def`): [`Listener`](README.md#listener)

Takes a node and a listener declaration and returns a listener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `HTMLElement` \| [`IoNode`](classes/IoNode.md) | `IoNode` instance |
| `def` | [`ListenerDeclaration`](README.md#listenerdeclaration) | Listener declaration |

#### Returns

[`Listener`](README.md#listener)

Listener

#### Defined in

[src/core/internals/eventDispatcher.ts:45](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L45)
