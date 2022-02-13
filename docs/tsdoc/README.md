# @iogui/iogui

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
- [PropertyDefinition](classes/PropertyDefinition.md)
- [ProtoChain](classes/ProtoChain.md)

## Interfaces

- [Change](interfaces/Change.md)
- [ChangeEvent](interfaces/ChangeEvent.md)
- [IoNodeConstructor](interfaces/IoNodeConstructor.md)

## Type aliases

### Listener

Ƭ **Listener**: [`EventListener`, AddEventListenerOptions?]

#### Defined in

[core/internals/eventDispatcher.ts:55](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L55)

___

### ListenerDefinition

Ƭ **ListenerDefinition**: [`string` \| `EventListener`, AddEventListenerOptions?]

#### Defined in

[core/internals/eventDispatcher.ts:5](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L5)

___

### ListenerDefinitionWeak

Ƭ **ListenerDefinitionWeak**: `string` \| `EventListener` \| [`string` \| `EventListener`, AddEventListenerOptions?]

#### Defined in

[core/internals/eventDispatcher.ts:3](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L3)

___

### Listeners

Ƭ **Listeners**: `Record`<`string`, [`Listener`](README.md#listener)[]\>

#### Defined in

[core/internals/eventDispatcher.ts:56](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L56)

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

### PropertyDefinitionWeak

Ƭ **PropertyDefinitionWeak**: `string` \| `number` \| `boolean` \| `any`[] \| ``null`` \| `undefined` \| `AnyConstructor` \| [`Binding`](classes/Binding.md) \| { `binding?`: [`Binding`](classes/Binding.md) ; `enumerable?`: `boolean` ; `notify?`: `boolean` ; `observe?`: `boolean` ; `readonly?`: `boolean` ; `reflect?`: `ReflectType` ; `strict?`: `boolean` ; `type?`: `AnyConstructor` ; `value?`: `any`  }

#### Defined in

[core/internals/property.ts:6](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L6)

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

[core/io-node.ts:39](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L39)

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

[elements/core/storage.ts:213](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/storage.ts#L213)

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

[core/io-element.ts:408](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L408)

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

[core/io-node.ts:486](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L486)

___

### assignListenerDefinition

▸ `Const` **assignListenerDefinition**(`defs`, `def`): `void`

Assigns listener definition to an existing array of listener definitions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `defs` | [`ListenerDefinition`](README.md#listenerdefinition)[] | Array of listener definitions |
| `def` | [`ListenerDefinition`](README.md#listenerdefinition) | Listener definition |

#### Returns

`void`

#### Defined in

[core/internals/eventDispatcher.ts:21](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L21)

___

### assignPropertyDefinition

▸ `Const` **assignPropertyDefinition**(`def`, `newDef`): `void`

Assigns property definition values to another property definition, unless they are default values.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `def` | [`PropertyDefinition`](classes/PropertyDefinition.md) | Property definition |
| `newDef` | [`PropertyDefinition`](classes/PropertyDefinition.md) | Existing property definition |

#### Returns

`void`

#### Defined in

[core/internals/property.ts:77](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L77)

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

[core/io-element.ts:573](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L573)

___

### hardenListenerDefinition

▸ `Const` **hardenListenerDefinition**(`def`): [`ListenerDefinition`](README.md#listenerdefinition)

Takes weakly typed listener definition and returns stronly typed listener definition.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `def` | [`ListenerDefinitionWeak`](README.md#listenerdefinitionweak) | Weakly typed listener definition |

#### Returns

[`ListenerDefinition`](README.md#listenerdefinition)

Stronly typed listener definition

#### Defined in

[core/internals/eventDispatcher.ts:12](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L12)

___

### listenerFromDefinition

▸ `Const` **listenerFromDefinition**(`node`, `def`): [`Listener`](README.md#listener)

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

[core/internals/eventDispatcher.ts:40](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L40)
