# @iogui/iogui

## Classes

- [Binding](classes/Binding.md)
- [Change](classes/Change.md)
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
- [Properties](classes/Properties.md)
- [Property](classes/Property.md)
- [PropertyBinder](classes/PropertyBinder.md)
- [ProtoChain](classes/ProtoChain.md)

## Interfaces

- [ChangeEvent](interfaces/ChangeEvent.md)
- [IoNodeConstructor](interfaces/IoNodeConstructor.md)

## Type aliases

### Listener

Ƭ **Listener**: [`EventListener`, AddEventListenerOptions?]

#### Defined in

core/internals/eventDispatcher.ts:34

___

### ListenerDefinition

Ƭ **ListenerDefinition**: [keyof [`IoNode`](classes/IoNode.md) \| `EventListener`, AddEventListenerOptions?]

#### Defined in

core/internals/eventDispatcher.ts:5

___

### ListenerDefinitionWeak

Ƭ **ListenerDefinitionWeak**: keyof [`IoNode`](classes/IoNode.md) \| `EventListener` \| [keyof [`IoNode`](classes/IoNode.md) \| `EventListener`, AddEventListenerOptions?]

#### Defined in

core/internals/eventDispatcher.ts:3

___

### Listeners

Ƭ **Listeners**: `Record`<`string`, [`Listener`](README.md#listener)[]\>

#### Defined in

core/internals/eventDispatcher.ts:35

___

### ListenersDeclaration

Ƭ **ListenersDeclaration**: `Record`<`string`, [`ListenerDefinitionWeak`](README.md#listenerdefinitionweak)\>

#### Defined in

[core/io-node.ts:7](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L7)

___

### PropertiesDeclaration

Ƭ **PropertiesDeclaration**: `Record`<`string`, [`PropertyDefinitionWeak`](README.md#propertydefinitionweak)\>

#### Defined in

[core/io-node.ts:8](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L8)

___

### PropertyDefinition

Ƭ **PropertyDefinition**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `binding?` | [`Binding`](classes/Binding.md) |
| `enumerable` | `boolean` |
| `notify` | `boolean` |
| `observe` | `boolean` |
| `readonly` | `boolean` |
| `reflect` | `ReflectType` |
| `strict` | `boolean` |
| `type?` | `AnyConstructor` |
| `value?` | `any` |

#### Defined in

[core/internals/properties.ts:6](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/properties.ts#L6)

___

### PropertyDefinitionWeak

Ƭ **PropertyDefinitionWeak**: `string` \| `number` \| `boolean` \| ``null`` \| `AnyConstructor` \| [`Binding`](classes/Binding.md) \| { `binding?`: [`Binding`](classes/Binding.md) ; `enumerable?`: `boolean` ; `notify?`: `boolean` ; `observe?`: `boolean` ; `readonly?`: `boolean` ; `reflect?`: `ReflectType` ; `strict?`: `boolean` ; `type?`: `AnyConstructor` ; `value?`: `any`  }

#### Defined in

[core/internals/properties.ts:18](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/properties.ts#L18)

## Variables

### IoIconsetSingleton

• **IoIconsetSingleton**: `IoIconset`

#### Defined in

[elements/core/iconset.ts:45](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/iconset.ts#L45)

___

### IoLadderSingleton

• **IoLadderSingleton**: `IoLadder`

#### Defined in

[elements/core/ladder.ts:329](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/ladder.ts#L329)

___

### IoLayerSingleton

• **IoLayerSingleton**: `IoLayer`

#### Defined in

[elements/core/layer.ts:224](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/layer.ts#L224)

___

### IoThemeSingleton

• **IoThemeSingleton**: `IoTheme`

#### Defined in

[elements/core/theme.ts:309](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/theme.ts#L309)

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

[core/io-node.ts:38](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L38)

___

### IoStorageFactory

▸ `Const` **IoStorageFactory**(`props`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `StorageProps` |

#### Returns

`any`

#### Defined in

[elements/core/storage.ts:215](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/storage.ts#L215)

___

### RegisterIoElement

▸ `Const` **RegisterIoElement**(`element`): `void`

Register function for `IoElement`. Registers custom element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `element` | typeof [`IoElement`](classes/IoElement.md) | Element class to register. |

#### Returns

`void`

#### Defined in

[core/io-element.ts:398](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L398)

___

### RegisterIoNode

▸ `Const` **RegisterIoNode**(`nodeConstructor`): `void`

Register function to be called once per class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodeConstructor` | typeof [`IoNode`](classes/IoNode.md) | Node class to register. |

#### Returns

`void`

#### Defined in

[core/io-node.ts:455](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L455)

___

### assignListenerDefinition

▸ `Const` **assignListenerDefinition**(`definitions`, `listenerDefinition`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `definitions` | [`ListenerDefinition`](README.md#listenerdefinition)[] |
| `listenerDefinition` | [`ListenerDefinition`](README.md#listenerdefinition) |

#### Returns

`void`

#### Defined in

core/internals/eventDispatcher.ts:19

___

### assignPropertyDefinition

▸ `Const` **assignPropertyDefinition**(`propDef`, `newPropDef`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `propDef` | [`PropertyDefinition`](README.md#propertydefinition) |
| `newPropDef` | [`PropertyDefinition`](README.md#propertydefinition) |

#### Returns

`void`

#### Defined in

[core/internals/properties.ts:92](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/properties.ts#L92)

___

### buildTree

▸ `Const` **buildTree**(): (`node`: `any`) => `any`

#### Returns

`fn`

▸ (`node`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `any` |

##### Returns

`any`

#### Defined in

[core/io-element.ts:603](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L603)

___

### hardenListenerDefinition

▸ `Const` **hardenListenerDefinition**(`listenerDefinition`): [`ListenerDefinition`](README.md#listenerdefinition)

#### Parameters

| Name | Type |
| :------ | :------ |
| `listenerDefinition` | [`ListenerDefinitionWeak`](README.md#listenerdefinitionweak) |

#### Returns

[`ListenerDefinition`](README.md#listenerdefinition)

#### Defined in

core/internals/eventDispatcher.ts:7

___

### hardenPropertyDefinition

▸ `Const` **hardenPropertyDefinition**(`propDef`): [`PropertyDefinition`](README.md#propertydefinition)

#### Parameters

| Name | Type |
| :------ | :------ |
| `propDef` | [`PropertyDefinitionWeak`](README.md#propertydefinitionweak) |

#### Returns

[`PropertyDefinition`](README.md#propertydefinition)

#### Defined in

[core/internals/properties.ts:30](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/properties.ts#L30)

___

### listenerFromDefinition

▸ `Const` **listenerFromDefinition**(`node`, `listenerDefinition`): [`Listener`](README.md#listener)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`IoNode`](classes/IoNode.md) |
| `listenerDefinition` | [`ListenerDefinition`](README.md#listenerdefinition) |

#### Returns

[`Listener`](README.md#listener)

#### Defined in

core/internals/eventDispatcher.ts:29
