# Class: IoElement

Core `IoElement` class.

## Hierarchy

- `__class`<() => `HTMLElement`, `this`\>

  ↳ **`IoElement`**

  ↳↳ [`IoTheme`](IoTheme.md)

  ↳↳ [`IoGl`](IoGl.md)

  ↳↳ [`IoLabel`](IoLabel.md)

  ↳↳ [`IoField`](IoField.md)

  ↳↳ [`IoNumberLadder`](IoNumberLadder.md)

  ↳↳ [`IoIcon`](IoIcon.md)

  ↳↳ [`IoColorBase`](IoColorBase.md)

  ↳↳ [`IoColorPicker`](IoColorPicker.md)

  ↳↳ [`IoMdView`](IoMdView.md)

  ↳↳ [`IoElementDemo`](IoElementDemo.md)

  ↳↳ [`IoLayout`](IoLayout.md)

  ↳↳ [`IoContent`](IoContent.md)

  ↳↳ [`IoCollapsable`](IoCollapsable.md)

  ↳↳ [`IoSelector`](IoSelector.md)

  ↳↳ [`IoSidebar`](IoSidebar.md)

  ↳↳ [`IoVector`](IoVector.md)

  ↳↳ [`IoMatrix`](IoMatrix.md)

  ↳↳ [`IoMenuOptions`](IoMenuOptions.md)

  ↳↳ [`IoOptionMenu`](IoOptionMenu.md)

  ↳↳ [`IoContextMenu`](IoContextMenu.md)

  ↳↳ [`IoNotify`](IoNotify.md)

  ↳↳ [`IoInspector`](IoInspector.md)

  ↳↳ [`IoObject`](IoObject.md)

  ↳↳ [`IoProperties`](IoProperties.md)

  ↳↳ [`IoNumberSliderRange`](IoNumberSliderRange.md)

  ↳↳ [`IoNumberSlider`](IoNumberSlider.md)

## Constructors

### constructor

• **new IoElement**(`properties?`, ...`args`)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `properties` | `Record`<`string`, `any`\> | Initial property values. |
| `...args` | `any`[] | - |

#### Inherited from

IoNodeMixin(HTMLElement).constructor

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L55)

## Properties

### $

• **$**: `Record`<`string`, `any`\>

#### Defined in

[src/core/element.ts:211](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L211)

___

### \_bindings

• `Readonly` **\_bindings**: `Map`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

IoNodeMixin(HTMLElement).\_bindings

#### Defined in

[src/core/node.ts:48](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L48)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

IoNodeMixin(HTMLElement).\_changeQueue

#### Defined in

[src/core/node.ts:49](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L49)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

IoNodeMixin(HTMLElement).\_eventDispatcher

#### Defined in

[src/core/node.ts:50](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L50)

___

### \_properties

• `Readonly` **\_properties**: `Map`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

IoNodeMixin(HTMLElement).\_properties

#### Defined in

[src/core/node.ts:47](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L47)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

IoNodeMixin(HTMLElement).\_protochain

#### Defined in

[src/core/node.ts:46](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L46)

___

### class

• **class**: `string`

#### Defined in

[src/core/element.ts:220](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L220)

___

### contenteditable

• **contenteditable**: `boolean`

#### Defined in

[src/core/element.ts:217](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L217)

___

### disabled

• **disabled**: `boolean`

#### Defined in

[src/core/element.ts:241](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L241)

___

### hidden

• **hidden**: `boolean`

#### Defined in

[src/core/element.ts:238](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L238)

___

### id

• **id**: `string`

#### Defined in

[src/core/element.ts:235](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L235)

___

### label

• **label**: `string`

#### Defined in

[src/core/element.ts:226](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L226)

___

### name

• **name**: `string`

#### Defined in

[src/core/element.ts:229](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L229)

___

### role

• **role**: `string`

#### Defined in

[src/core/element.ts:223](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L223)

___

### tabindex

• **tabindex**: `string`

#### Defined in

[src/core/element.ts:214](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L214)

___

### title

• **title**: `string`

#### Defined in

[src/core/element.ts:232](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L232)

## Accessors

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Defined in

[src/core/element.ts:392](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L392)

• `set` **textNode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Defined in

[src/core/element.ts:396](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L396)

___

### Properties

• `Static` `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoNodeMixin(HTMLElement).Properties

#### Defined in

[src/core/node.ts:37](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L37)

___

### Style

• `Static` `get` **Style**(): `string`

#### Returns

`string`

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L196)

___

### observedAttributes

• `Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Defined in

[src/core/element.ts:243](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L243)

## Methods

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

#### Defined in

[src/core/element.ts:375](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L375)

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

IoNodeMixin(HTMLElement).addEventListener

#### Defined in

[src/core/node.ts:319](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L319)

___

### applyProperties

▸ **applyProperties**(`props`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `any` |

#### Returns

`void`

#### Overrides

IoNodeMixin(HTMLElement).applyProperties

#### Defined in

[src/core/element.ts:400](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L400)

___

### attributeChangedCallback

▸ **attributeChangedCallback**(`prop`, `oldValue`, `newValue`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `prop` | `string` |
| `oldValue` | `any` |
| `newValue` | `any` |

#### Returns

`void`

#### Defined in

[src/core/element.ts:253](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L253)

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

IoNodeMixin(HTMLElement).bind

#### Defined in

[src/core/node.ts:288](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L288)

___

### changed

▸ **changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

IoNodeMixin(HTMLElement).changed

#### Defined in

[src/core/node.ts:216](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L216)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Defined in

[src/core/element.ts:271](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L271)

___

### disabledChanged

▸ **disabledChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L429)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Defined in

[src/core/element.ts:279](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L279)

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

IoNodeMixin(HTMLElement).dispatchEvent

#### Defined in

[src/core/node.ts:344](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L344)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

IoNodeMixin(HTMLElement).dispatchQueue

#### Defined in

[src/core/node.ts:230](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L230)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

IoNodeMixin(HTMLElement).dispatchQueueSync

#### Defined in

[src/core/node.ts:240](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L240)

___

### dispose

▸ **dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

IoNodeMixin(HTMLElement).dispose

#### Defined in

[src/core/node.ts:351](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L351)

___

### disposeDeep

▸ **disposeDeep**(`host`, `child`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `host` | `HTMLElement` |
| `child` | `any` |

#### Returns

`void`

#### Defined in

[src/core/element.ts:295](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L295)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Inherited from

IoNodeMixin(HTMLElement).init

#### Defined in

[src/core/node.ts:217](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L217)

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

IoNodeMixin(HTMLElement).inputValue

#### Defined in

[src/core/node.ts:205](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L205)

___

### labelChanged

▸ **labelChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/core/element.ts:422](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L422)

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

IoNodeMixin(HTMLElement).objectMutated

#### Defined in

[src/core/node.ts:279](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L279)

___

### onObjectMutated

▸ **onObjectMutated**(`event`): `void`

Event handler for 'object-mutated' event emitted from the `window`.
Node should be listening for this event if it has an observed object property

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `CustomEvent`<`any`\> | Event payload. |

#### Returns

`void`

#### Inherited from

IoNodeMixin(HTMLElement).onObjectMutated

#### Defined in

[src/core/node.ts:258](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L258)

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

IoNodeMixin(HTMLElement).queue

#### Defined in

[src/core/node.ts:224](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L224)

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

IoNodeMixin(HTMLElement).removeEventListener

#### Defined in

[src/core/node.ts:334](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L334)

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

#### Defined in

[src/core/element.ts:413](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L413)

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

IoNodeMixin(HTMLElement).setProperties

#### Defined in

[src/core/node.ts:188](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L188)

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

IoNodeMixin(HTMLElement).setProperty

#### Defined in

[src/core/node.ts:109](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L109)

___

### template

▸ **template**(`vDOM`, `host?`): `void`

Renders DOM from virtual DOM arrays.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vDOM` | `any`[] | Array of vDOM children. |
| `host?` | `HTMLElement` | Optional template target. |

#### Returns

`void`

#### Defined in

[src/core/element.ts:289](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L289)

___

### throttle

▸ **throttle**(`func`, `arg?`, `sync?`): `void`

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

IoNodeMixin(HTMLElement).throttle

#### Defined in

[src/core/node.ts:249](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L249)

___

### traverse

▸ **traverse**(`vChildren`, `host?`): `void`

Recurively traverses vDOM.
TODO: test element.traverse() function!

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vChildren` | `any`[] | Array of vDOM children converted by `buildTree()` for easier parsing. |
| `host?` | `HTMLElement` | Optional template target. |

#### Returns

`void`

#### Defined in

[src/core/element.ts:319](https://github.com/io-gui/io/blob/tsc/src/core/element.ts#L319)

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

IoNodeMixin(HTMLElement).unbind

#### Defined in

[src/core/node.ts:303](https://github.com/io-gui/io/blob/tsc/src/core/node.ts#L303)
