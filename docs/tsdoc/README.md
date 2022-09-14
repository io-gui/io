# io-gui

## Classes

- [Binding](classes/Binding.md)
- [ChangeQueue](classes/ChangeQueue.md)
- [EventDispatcher](classes/EventDispatcher.md)
- [IoBoolean](classes/IoBoolean.md)
- [IoBoolicon](classes/IoBoolicon.md)
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
- [IoGl](classes/IoGl.md)
- [IoIcon](classes/IoIcon.md)
- [IoInspector](classes/IoInspector.md)
- [IoItem](classes/IoItem.md)
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
- [Property](classes/Property.md)
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

[src/core/io-node.ts:25](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L25)

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

[src/core/io-node.ts:17](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L17)

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

[src/core/io-node.ts:22](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L22)

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

[src/core/io-node.ts:23](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L23)

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

[src/core/io-node.ts:20](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L20)

___

### Listener

Ƭ **Listener**: [[`CustomEventListener`](README.md#customeventlistener), AddEventListenerOptions?]

#### Defined in

[src/core/internals/eventDispatcher.ts:54](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L54)

___

### ListenerDefinition

Ƭ **ListenerDefinition**: [`string` \| [`CustomEventListener`](README.md#customeventlistener), AddEventListenerOptions?]

#### Defined in

[src/core/internals/eventDispatcher.ts:5](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L5)

___

### ListenerDefinitionWeak

Ƭ **ListenerDefinitionWeak**: `string` \| [`CustomEventListener`](README.md#customeventlistener) \| [`string` \| [`CustomEventListener`](README.md#customeventlistener), AddEventListenerOptions?]

#### Defined in

[src/core/internals/eventDispatcher.ts:3](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L3)

___

### Listeners

Ƭ **Listeners**: `Record`<`string`, [`Listener`](README.md#listener)[]\>

#### Defined in

[src/core/internals/eventDispatcher.ts:55](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L55)

___

### ListenersDeclaration

Ƭ **ListenersDeclaration**: `Record`<`string`, [`ListenerDefinitionWeak`](README.md#listenerdefinitionweak)\>

#### Defined in

[src/core/io-node.ts:7](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L7)

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

[src/core/io-node.ts:21](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L21)

___

### PredicateFunction

Ƭ **PredicateFunction**: (`object`: `any`) => `boolean`

#### Type declaration

▸ (`object`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `object` | `any` |

##### Returns

`boolean`

#### Defined in

[src/core/io-node.ts:18](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L18)

___

### PropertiesDeclaration

Ƭ **PropertiesDeclaration**: `Record`<`string`, [`PropertyDefinitionWeak`](README.md#propertydefinitionweak)\>

#### Defined in

[src/core/io-node.ts:8](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L8)

___

### PropertyDefinitionStrong

Ƭ **PropertyDefinitionStrong**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `binding?` | [`Binding`](classes/Binding.md) |
| `notify?` | `boolean` |
| `observe?` | `boolean` |
| `reflect?` | `ReflectType` |
| `type?` | `Constructor` |
| `value?` | `any` |

#### Defined in

[src/core/internals/property.ts:6](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L6)

___

### PropertyDefinitionWeak

Ƭ **PropertyDefinitionWeak**: `string` \| `number` \| `boolean` \| `any`[] \| ``null`` \| `undefined` \| `Constructor` \| [`Binding`](classes/Binding.md) \| [`PropertyDefinitionStrong`](README.md#propertydefinitionstrong)

#### Defined in

[src/core/internals/property.ts:15](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L15)

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

[src/core/io-node.ts:24](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L24)

## Variables

### IoIconsetSingleton

• `Const` **IoIconsetSingleton**: `IoIconset`

#### Defined in

[src/elements/core/iconset.ts:45](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/iconset.ts#L45)

___

### IoLadderSingleton

• `Const` **IoLadderSingleton**: [`IoLadder`](classes/IoLadder.md)

#### Defined in

[src/elements/core/ladder.ts:329](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/ladder.ts#L329)

___

### IoLayerSingleton

• `Const` **IoLayerSingleton**: `IoLayer`

#### Defined in

[src/elements/core/layer.ts:224](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/layer.ts#L224)

___

### IoThemeSingleton

• `Const` **IoThemeSingleton**: `IoTheme`

#### Defined in

[src/elements/core/theme.ts:309](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/theme.ts#L309)

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

[src/core/io-node.ts:36](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L36)

___

### IoStorageFactory

▸ **IoStorageFactory**(`props`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `StorageProps` |

#### Returns

`any`

#### Defined in

[src/elements/core/storage.ts:213](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/storage.ts#L213)

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

[src/core/io-element.ts:392](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L392)

___

### RegisterIoNode

▸ **RegisterIoNode**(`nodeConstructor`): `void`

Register function to be called once per class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodeConstructor` | typeof [`IoNode`](classes/IoNode.md) | Node class to register. |

#### Returns

`void`

#### Defined in

[src/core/io-node.ts:463](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L463)

___

### assignListenerDefinition

▸ **assignListenerDefinition**(`defs`, `srcDef`): `void`

Assigns source listener definition to an existing array of listener definitions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `defs` | [`ListenerDefinition`](README.md#listenerdefinition)[] | Array of listener definitions |
| `srcDef` | [`ListenerDefinition`](README.md#listenerdefinition) | Source listener definition |

#### Returns

`void`

#### Defined in

[src/core/internals/eventDispatcher.ts:21](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L21)

___

### assignProtoProperty

▸ **assignProtoProperty**(`def`, `srcDef`): `void`

Assigns property definition values to another property definition, unless they are default values.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `def` | [`ProtoProperty`](classes/ProtoProperty.md) | Target property definition |
| `srcDef` | [`ProtoProperty`](classes/ProtoProperty.md) | Source property definition |

#### Returns

`void`

#### Defined in

[src/core/internals/property.ts:63](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L63)

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

[src/core/io-element.ts:562](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L562)

___

### hardenListenerDefinition

▸ **hardenListenerDefinition**(`def`): [`ListenerDefinition`](README.md#listenerdefinition)

Takes weakly typed listener definition and returns stronly typed listener definition.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `def` | [`ListenerDefinitionWeak`](README.md#listenerdefinitionweak) | Weakly typed listener definition |

#### Returns

[`ListenerDefinition`](README.md#listenerdefinition)

Stronly typed listener definition

#### Defined in

[src/core/internals/eventDispatcher.ts:12](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L12)

___

### listenerFromDefinition

▸ **listenerFromDefinition**(`node`, `def`): [`Listener`](README.md#listener)

Takes a node and a listener definition and returns a listener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `HTMLElement` \| [`IoNode`](classes/IoNode.md) | `IoNode` instance |
| `def` | [`ListenerDefinition`](README.md#listenerdefinition) | Listener definition |

#### Returns

[`Listener`](README.md#listener)

Listener

#### Defined in

[src/core/internals/eventDispatcher.ts:39](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L39)
