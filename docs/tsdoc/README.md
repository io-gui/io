# io-gui

## Classes

- [Binding](classes/Binding.md)
- [ChangeQueue](classes/ChangeQueue.md)
- [EventDispatcher](classes/EventDispatcher.md)
- [IoBoolean](classes/IoBoolean.md)
- [IoButton](classes/IoButton.md)
- [IoCollapsable](classes/IoCollapsable.md)
- [IoColorPanel](classes/IoColorPanel.md)
- [IoColorPicker](classes/IoColorPicker.md)
- [IoColorSlider](classes/IoColorSlider.md)
- [IoColorSliderAlpha](classes/IoColorSliderAlpha.md)
- [IoColorSliderBlue](classes/IoColorSliderBlue.md)
- [IoColorSliderCyan](classes/IoColorSliderCyan.md)
- [IoColorSliderGreen](classes/IoColorSliderGreen.md)
- [IoColorSliderHs](classes/IoColorSliderHs.md)
- [IoColorSliderHue](classes/IoColorSliderHue.md)
- [IoColorSliderKey](classes/IoColorSliderKey.md)
- [IoColorSliderLevel](classes/IoColorSliderLevel.md)
- [IoColorSliderMagenta](classes/IoColorSliderMagenta.md)
- [IoColorSliderRed](classes/IoColorSliderRed.md)
- [IoColorSliderSaturation](classes/IoColorSliderSaturation.md)
- [IoColorSliderSl](classes/IoColorSliderSl.md)
- [IoColorSliderSv](classes/IoColorSliderSv.md)
- [IoColorSliderValue](classes/IoColorSliderValue.md)
- [IoColorSliderYellow](classes/IoColorSliderYellow.md)
- [IoColorVector](classes/IoColorVector.md)
- [IoContent](classes/IoContent.md)
- [IoContextMenu](classes/IoContextMenu.md)
- [IoElement](classes/IoElement.md)
- [IoElementDemo](classes/IoElementDemo.md)
- [IoField](classes/IoField.md)
- [IoGl](classes/IoGl.md)
- [IoIcon](classes/IoIcon.md)
- [IoInspector](classes/IoInspector.md)
- [IoLabel](classes/IoLabel.md)
- [IoLadder](classes/IoLadder.md)
- [IoLayout](classes/IoLayout.md)
- [IoMatrix](classes/IoMatrix.md)
- [IoMdView](classes/IoMdView.md)
- [IoMdViewSelector](classes/IoMdViewSelector.md)
- [IoMenuItem](classes/IoMenuItem.md)
- [IoMenuOptions](classes/IoMenuOptions.md)
- [IoNode](classes/IoNode.md)
- [IoNotify](classes/IoNotify.md)
- [IoNumber](classes/IoNumber.md)
- [IoNumberSlider](classes/IoNumberSlider.md)
- [IoNumberSliderRange](classes/IoNumberSliderRange.md)
- [IoObject](classes/IoObject.md)
- [IoOptionMenu](classes/IoOptionMenu.md)
- [IoProperties](classes/IoProperties.md)
- [IoSelector](classes/IoSelector.md)
- [IoSelectorSidebar](classes/IoSelectorSidebar.md)
- [IoSelectorTabs](classes/IoSelectorTabs.md)
- [IoServiceLoader](classes/IoServiceLoader.md)
- [IoSidebar](classes/IoSidebar.md)
- [IoSlider](classes/IoSlider.md)
- [IoSliderRange](classes/IoSliderRange.md)
- [IoString](classes/IoString.md)
- [IoSwitch](classes/IoSwitch.md)
- [IoVector](classes/IoVector.md)
- [Item](classes/Item.md)
- [Options](classes/Options.md)
- [Path](classes/Path.md)
- [PropertyInstance](classes/PropertyInstance.md)
- [ProtoChain](classes/ProtoChain.md)
- [ProtoProperty](classes/ProtoProperty.md)

## Interfaces

- [Change](interfaces/Change.md)
- [ChangeEvent](interfaces/ChangeEvent.md)
- [IoNodeConstructor](interfaces/IoNodeConstructor.md)

## Type Aliases

### AnyEventListener

Ƭ **AnyEventListener**: `EventListener` \| [`KeyboardEventListener`](README.md#keyboardeventlistener) \| [`PointerEventListener`](README.md#pointereventlistener) \| [`CustomEventListener`](README.md#customeventlistener) \| [`FocusEventListener`](README.md#focuseventlistener) \| [`TouchEventListener`](README.md#toucheventlistener)

#### Defined in

[src/core/node.ts:23](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L23)

___

### CallbackFunction

Ƭ **CallbackFunction**: (`arg?`: `any`) => `void`

#### Type declaration

▸ (`arg?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `arg?` | `any` |

##### Returns

`void`

#### Defined in

[src/core/node.ts:16](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L16)

___

### Constructor

Ƭ **Constructor**: (...`args`: `any`[]) => `unknown`

#### Type declaration

• (...`args`)

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Defined in

[src/core/node.ts:7](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L7)

___

### CustomEventListener

Ƭ **CustomEventListener**: (`event`: `CustomEvent`) => `void` \| `EventListener`

#### Type declaration

▸ (`event`): `void` \| `EventListener`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent` |

##### Returns

`void` \| `EventListener`

#### Defined in

[src/core/node.ts:20](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L20)

___

### FocusEventListener

Ƭ **FocusEventListener**: (`event`: `FocusEvent`) => `void`

#### Type declaration

▸ (`event`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `FocusEvent` |

##### Returns

`void`

#### Defined in

[src/core/node.ts:21](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L21)

___

### KeyboardEventListener

Ƭ **KeyboardEventListener**: (`event`: `KeyboardEvent`) => `void`

#### Type declaration

▸ (`event`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `KeyboardEvent` |

##### Returns

`void`

#### Defined in

[src/core/node.ts:18](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L18)

___

### Listener

Ƭ **Listener**: [[`CustomEventListener`](README.md#customeventlistener), AddEventListenerOptions?]

#### Defined in

[src/core/internals/eventDispatcher.ts:60](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L60)

___

### ListenerDeclaration

Ƭ **ListenerDeclaration**: [`string` \| [`CustomEventListener`](README.md#customeventlistener), AddEventListenerOptions?]

Declares default listeners.

#### Defined in

[src/core/internals/eventDispatcher.ts:6](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L6)

___

### ListenerDeclarationWeak

Ƭ **ListenerDeclarationWeak**: `string` \| [`CustomEventListener`](README.md#customeventlistener) \| [`ListenerDeclaration`](README.md#listenerdeclaration)

Allows weak declaration of listeners by specifying only partial declarations such as function or function name.

#### Defined in

[src/core/internals/eventDispatcher.ts:11](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L11)

___

### Listeners

Ƭ **Listeners**: `Record`<`string`, [`Listener`](README.md#listener)[]\>

#### Defined in

[src/core/internals/eventDispatcher.ts:61](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L61)

___

### ListenersDeclaration

Ƭ **ListenersDeclaration**: `Record`<`string`, [`ListenerDeclarationWeak`](README.md#listenerdeclarationweak)\>

#### Defined in

[src/core/internals/eventDispatcher.ts:63](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L63)

___

### PointerEventListener

Ƭ **PointerEventListener**: (`event`: `PointerEvent`) => `void`

#### Type declaration

▸ (`event`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

##### Returns

`void`

#### Defined in

[src/core/node.ts:19](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L19)

___

### PropertyDeclaration

Ƭ **PropertyDeclaration**: `Object`

Declares default value, type and reactive behavior of the property.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `binding?` | [`Binding`](classes/Binding.md) |
| `notify?` | `boolean` |
| `observe?` | `boolean` |
| `reflect?` | `Reflect` |
| `type?` | [`Constructor`](README.md#constructor) |
| `value?` | `any` |

#### Defined in

[src/core/internals/property.ts:9](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L9)

___

### PropertyDeclarationWeak

Ƭ **PropertyDeclarationWeak**: `string` \| `number` \| `boolean` \| `any`[] \| ``null`` \| `undefined` \| [`Constructor`](README.md#constructor) \| [`Binding`](classes/Binding.md) \| [`PropertyDeclaration`](README.md#propertydeclaration)

Allows weak declaration of properties by specifying only partial declarations such as default value or type.

#### Defined in

[src/core/internals/property.ts:21](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L21)

___

### PropertyDeclarations

Ƭ **PropertyDeclarations**: `Record`<`string`, [`PropertyDeclarationWeak`](README.md#propertydeclarationweak)\>

#### Defined in

[src/core/internals/property.ts:136](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L136)

___

### TouchEventListener

Ƭ **TouchEventListener**: (`event`: `TouchEvent`) => `void`

#### Type declaration

▸ (`event`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `TouchEvent` |

##### Returns

`void`

#### Defined in

[src/core/node.ts:22](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L22)

## Variables

### IoIconsetSingleton

• `Const` **IoIconsetSingleton**: `IoIconset`

#### Defined in

[src/elements/core/iconset.ts:44](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/iconset.ts#L44)

___

### IoLadderSingleton

• `Const` **IoLadderSingleton**: [`IoLadder`](classes/IoLadder.md)

#### Defined in

[src/elements/core/ladder.ts:326](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/ladder.ts#L326)

___

### IoLayerSingleton

• `Const` **IoLayerSingleton**: `IoLayer`

#### Defined in

[src/elements/core/layer.ts:222](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/layer.ts#L222)

___

### IoThemeSingleton

• `Const` **IoThemeSingleton**: `IoTheme`

#### Defined in

[src/elements/core/theme.ts:323](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/theme.ts#L323)

___

### LICENSE

• `Const` **LICENSE**: ``"MIT"``

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

[src/iogui.ts:29](https://github.com/io-gui/iogui/blob/tsc/src/iogui.ts#L29)

___

### PropertyDecorators

• `Const` **PropertyDecorators**: `WeakMap`<[`Constructor`](README.md#constructor), [`PropertyDeclarations`](README.md#propertydeclarations)\>

#### Defined in

[src/core/internals/property.ts:138](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L138)

## Functions

### IoNodeMixin

▸ **IoNodeMixin**<`T`\>(`superclass`): typeof `__class`

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

[src/core/node.ts:35](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L35)

___

### IoProperty

▸ **IoProperty**(`propertyDefinition`): (`target`: [`IoNode`](classes/IoNode.md), `propertyName`: `string`) => `void`

Allows property declarations using decorator pattern.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `propertyDefinition` | [`PropertyDeclarationWeak`](README.md#propertydeclarationweak) | Property declaration. |

#### Returns

`fn`

Property decorator function.

▸ (`target`, `propertyName`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`IoNode`](classes/IoNode.md) |
| `propertyName` | `string` |

##### Returns

`void`

#### Defined in

[src/core/internals/property.ts:145](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L145)

___

### IoStorage

▸ **IoStorage**(`props`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `StorageProps` |

#### Returns

`any`

#### Defined in

[src/elements/core/storage.ts:214](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/storage.ts#L214)

___

### RegisterIoElement

▸ **RegisterIoElement**(`elementConstructor`): `void`

Register function for `IoElement`. Registers custom element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `elementConstructor` | typeof [`IoElement`](classes/IoElement.md) | Element class to register. |

#### Returns

`void`

#### Defined in

[src/core/element.ts:32](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L32)

___

### RegisterIoNode

▸ **RegisterIoNode**(`target`): `void`

Register function to be called once per class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | typeof [`IoNode`](classes/IoNode.md) | Node class to register. |

#### Returns

`void`

#### Defined in

[src/core/node.ts:374](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L374)

___

### assignListenerDeclaration

▸ **assignListenerDeclaration**(`defs`, `srcDef`): `void`

Assigns source listener declaration to an existing array of listener declarations.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `defs` | [`ListenerDeclaration`](README.md#listenerdeclaration)[] | Array of listener declarations |
| `srcDef` | [`ListenerDeclaration`](README.md#listenerdeclaration) | Source listener declaration |

#### Returns

`void`

#### Defined in

[src/core/internals/eventDispatcher.ts:27](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L27)

___

### buildTree

▸ **buildTree**(): (`node`: `VirtualDOMElement`) => `any`

#### Returns

`fn`

▸ (`node`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `VirtualDOMElement` |

##### Returns

`any`

#### Defined in

[src/core/element.ts:200](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L200)

___

### hardenListenerDeclaration

▸ **hardenListenerDeclaration**(`def`): [`ListenerDeclaration`](README.md#listenerdeclaration)

Takes weakly typed listener declaration and returns stronly typed listener declaration.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `def` | [`ListenerDeclarationWeak`](README.md#listenerdeclarationweak) | Weakly typed listener declaration |

#### Returns

[`ListenerDeclaration`](README.md#listenerdeclaration)

Stronly typed listener declaration

#### Defined in

[src/core/internals/eventDispatcher.ts:18](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L18)

___

### listenerFromDefinition

▸ **listenerFromDefinition**(`node`, `def`): [`Listener`](README.md#listener)

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

[src/core/internals/eventDispatcher.ts:45](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L45)
