# @iogui/iogui

## Classes

- [Binding](classes/Binding.md)
- [Change](classes/Change.md)
- [ChangeQueue](classes/ChangeQueue.md)
- [EventDispatcher](classes/EventDispatcher.md)
- [FunctionBinder](classes/FunctionBinder.md)
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
- [ProtoListeners](classes/ProtoListeners.md)
- [ProtoProperties](classes/ProtoProperties.md)
- [ProtoProperty](classes/ProtoProperty.md)

## Interfaces

- [ChangeEvent](interfaces/ChangeEvent.md)

## Type aliases

### Listener

Ƭ **Listener**: [`EventListener`, AddEventListenerOptions?]

#### Defined in

[core/internals/eventDispatcher.ts:7](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L7)

___

### Listeners

Ƭ **Listeners**: `Record`<`string`, [`Listener`](README.md#listener)\>

#### Defined in

[core/internals/eventDispatcher.ts:8](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L8)

___

### ListenersArray

Ƭ **ListenersArray**: `Record`<`string`, [`Listener`](README.md#listener)[]\>

#### Defined in

[core/internals/eventDispatcher.ts:9](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L9)

___

### ProtoListenerArrayType

Ƭ **ProtoListenerArrayType**: [keyof [`IoNode`](classes/IoNode.md) \| `EventListener`, AddEventListenerOptions?]

#### Defined in

[core/internals/eventDispatcher.ts:5](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L5)

___

### ProtoListenerRecord

Ƭ **ProtoListenerRecord**: `Record`<`string`, [`ProtoListenerType`](README.md#protolistenertype)\>

#### Defined in

[core/internals/eventDispatcher.ts:6](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L6)

___

### ProtoListenerType

Ƭ **ProtoListenerType**: keyof [`IoNode`](classes/IoNode.md) \| `EventListener` \| [`ProtoListenerArrayType`](README.md#protolistenerarraytype)

#### Defined in

[core/internals/eventDispatcher.ts:4](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L4)

___

### ProtoPropertyDefinition

Ƭ **ProtoPropertyDefinition**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `binding?` | [`Binding`](classes/Binding.md) |
| `enumerable?` | `boolean` |
| `notify?` | `boolean` |
| `observe?` | `boolean` |
| `readonly?` | `boolean` |
| `reflect?` | `ReflectType` |
| `strict?` | `boolean` |
| `type?` | `Constructor` |
| `value?` | `any` |

#### Defined in

[core/internals/properties.ts:7](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/properties.ts#L7)

___

### ProtoPropertyRecord

Ƭ **ProtoPropertyRecord**: `Record`<`string`, [`ProtoPropertyType`](README.md#protopropertytype)\>

#### Defined in

[core/internals/properties.ts:20](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/properties.ts#L20)

___

### ProtoPropertyType

Ƭ **ProtoPropertyType**: `string` \| `number` \| `boolean` \| `Constructor` \| ``null`` \| [`Binding`](classes/Binding.md) \| [`ProtoPropertyDefinition`](README.md#protopropertydefinition)

#### Defined in

[core/internals/properties.ts:19](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/properties.ts#L19)

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
| `T` | extends `Constructor`<`any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `superclass` | `T` | Class to extend. |

#### Returns

typeof `__class`

- Extended class constructor with `IoNodeMixin` applied to it.

#### Defined in

[core/io-node.ts:29](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L29)

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

▸ `Const` **RegisterIoNode**(`node`): `void`

Register function to be called once per class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | typeof [`IoNode`](classes/IoNode.md) | Node class to register. |

#### Returns

`void`

#### Defined in

[core/io-node.ts:446](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L446)

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
