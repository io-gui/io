# io-gui

## Classes

- [Binding](classes/Binding.md)
- [ChangeQueue](classes/ChangeQueue.md)
- [EventDispatcher](classes/EventDispatcher.md)
- [IoElement](classes/IoElement.md)
- [IoNode](classes/IoNode.md)
- [Property](classes/Property.md)
- [ProtoChain](classes/ProtoChain.md)
- [ProtoProperty](classes/ProtoProperty.md)

## Interfaces

- [Change](interfaces/Change.md)
- [ChangeEvent](interfaces/ChangeEvent.md)
- [IoNodeConstructor](interfaces/IoNodeConstructor.md)

## Type Aliases

### Listener

Ƭ **Listener**: [`AnyEventListener`, AddEventListenerOptions?]

#### Defined in

[src/core/internals/eventDispatcher.ts:57](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L57)

___

### ListenerDefinition

Ƭ **ListenerDefinition**: [`string` \| `AnyEventListener`, AddEventListenerOptions?]

#### Defined in

[src/core/internals/eventDispatcher.ts:8](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L8)

___

### ListenerDefinitionWeak

Ƭ **ListenerDefinitionWeak**: `string` \| `AnyEventListener` \| [`string` \| `AnyEventListener`, AddEventListenerOptions?]

#### Defined in

[src/core/internals/eventDispatcher.ts:6](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L6)

___

### Listeners

Ƭ **Listeners**: `Record`<`string`, [`Listener`](README.md#listener)[]\>

#### Defined in

[src/core/internals/eventDispatcher.ts:58](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L58)

___

### ListenersDeclaration

Ƭ **ListenersDeclaration**: `Record`<`string`, [`ListenerDefinitionWeak`](README.md#listenerdefinitionweak)\>

#### Defined in

[src/core/io-node.ts:7](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L7)

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

## Variables

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

[src/iogui.ts:27](https://github.com/io-gui/iogui/blob/tsc/src/iogui.ts#L27)

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

[src/core/io-node.ts:39](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L39)

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

[src/core/io-element.ts:396](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L396)

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

[src/core/io-node.ts:506](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L506)

___

### assignListenerDefinition

▸ **assignListenerDefinition**(`defs`, `def`): `void`

Assigns listener definition to an existing array of listener definitions.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `defs` | [`ListenerDefinition`](README.md#listenerdefinition)[] | Array of listener definitions |
| `def` | [`ListenerDefinition`](README.md#listenerdefinition) | Listener definition |

#### Returns

`void`

#### Defined in

[src/core/internals/eventDispatcher.ts:24](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L24)

___

### assignProtoProperty

▸ **assignProtoProperty**(`def`, `newDef`): `void`

Assigns property definition values to another property definition, unless they are default values.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `def` | [`ProtoProperty`](classes/ProtoProperty.md) | Property definition |
| `newDef` | [`ProtoProperty`](classes/ProtoProperty.md) | Existing property definition |

#### Returns

`void`

#### Defined in

[src/core/internals/property.ts:73](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/property.ts#L73)

___

### buildTree

▸ **buildTree**(): (`node`: `any`) => `any`

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

[src/core/internals/eventDispatcher.ts:15](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L15)

___

### listenerFromDefinition

▸ **listenerFromDefinition**(`node`, `def`): [`Listener`](README.md#listener)

Takes a node and a listener definition and returns a listener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | [`IoNode`](classes/IoNode.md) \| `HTMLElement` | `IoNode` instance |
| `def` | [`ListenerDefinition`](README.md#listenerdefinition) | Listener definition |

#### Returns

[`Listener`](README.md#listener)

Listener

#### Defined in

[src/core/internals/eventDispatcher.ts:42](https://github.com/io-gui/iogui/blob/tsc/src/core/internals/eventDispatcher.ts#L42)
