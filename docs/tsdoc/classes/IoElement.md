# Class: IoElement

Core `IoElement` class.

## Hierarchy

- `__class`<() => `HTMLElement`, `this`\>

  ↳ **`IoElement`**

  ↳↳ [`IoGl`](IoGl.md)

  ↳↳ [`IoLabel`](IoLabel.md)

  ↳↳ [`IoField`](IoField.md)

  ↳↳ [`IoNumberSlider`](IoNumberSlider.md)

  ↳↳ [`IoNumberSliderRange`](IoNumberSliderRange.md)

  ↳↳ [`IoIcon`](IoIcon.md)

  ↳↳ [`IoLadder`](IoLadder.md)

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

[src/core/node.ts:55](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L55)

## Properties

### $

• **$**: `Record`<`string`, `any`\>

#### Defined in

[src/core/element.ts:219](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L219)

___

### \_bindings

• `Readonly` **\_bindings**: `Record`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

IoNodeMixin(HTMLElement).\_bindings

#### Defined in

[src/core/node.ts:48](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L48)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

IoNodeMixin(HTMLElement).\_changeQueue

#### Defined in

[src/core/node.ts:49](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L49)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

IoNodeMixin(HTMLElement).\_eventDispatcher

#### Defined in

[src/core/node.ts:50](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L50)

___

### \_properties

• `Readonly` **\_properties**: `Record`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

IoNodeMixin(HTMLElement).\_properties

#### Defined in

[src/core/node.ts:47](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L47)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

IoNodeMixin(HTMLElement).\_protochain

#### Defined in

[src/core/node.ts:46](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L46)

___

### class

• **class**: `string`

#### Defined in

[src/core/element.ts:228](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L228)

___

### contenteditable

• **contenteditable**: `boolean`

#### Defined in

[src/core/element.ts:225](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L225)

___

### disabled

• **disabled**: `boolean`

#### Defined in

[src/core/element.ts:249](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L249)

___

### hidden

• **hidden**: `boolean`

#### Defined in

[src/core/element.ts:246](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L246)

___

### id

• **id**: `string`

#### Defined in

[src/core/element.ts:243](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L243)

___

### label

• **label**: `string`

#### Defined in

[src/core/element.ts:234](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L234)

___

### name

• **name**: `string`

#### Defined in

[src/core/element.ts:237](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L237)

___

### role

• **role**: `string`

#### Defined in

[src/core/element.ts:231](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L231)

___

### tabindex

• **tabindex**: `string`

#### Defined in

[src/core/element.ts:222](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L222)

___

### title

• **title**: `string`

#### Defined in

[src/core/element.ts:240](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L240)

## Accessors

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Defined in

[src/core/element.ts:409](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L409)

• `set` **textNode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Defined in

[src/core/element.ts:413](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L413)

___

### Listeners

• `Static` `get` **Listeners**(): `any`

#### Returns

`any`

#### Defined in

[src/core/element.ts:251](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L251)

___

### Properties

• `Static` `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoNodeMixin(HTMLElement).Properties

#### Defined in

[src/core/node.ts:37](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L37)

___

### Style

• `Static` `get` **Style**(): `any`

#### Returns

`any`

#### Defined in

[src/core/element.ts:211](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L211)

___

### observedAttributes

• `Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Defined in

[src/core/element.ts:256](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L256)

## Methods

### \_onFocusTo

▸ **_onFocusTo**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`<`any`\> |

#### Returns

`void`

#### Defined in

[src/core/element.ts:453](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L453)

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

[src/core/node.ts:317](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L317)

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

[src/core/element.ts:417](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L417)

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

[src/core/element.ts:266](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L266)

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

[src/core/node.ts:290](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L290)

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

[src/core/node.ts:218](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L218)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Defined in

[src/core/element.ts:284](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L284)

___

### disabledChanged

▸ **disabledChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/core/element.ts:446](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L446)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Defined in

[src/core/element.ts:292](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L292)

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

[src/core/node.ts:342](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L342)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

IoNodeMixin(HTMLElement).dispatchQueue

#### Defined in

[src/core/node.ts:232](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L232)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

IoNodeMixin(HTMLElement).dispatchQueueSync

#### Defined in

[src/core/node.ts:242](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L242)

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

[src/core/node.ts:349](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L349)

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

[src/core/element.ts:308](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L308)

___

### flattenTextNode

▸ **flattenTextNode**(`element`): `void`

Helper function to flatten textContent into a single TextNode.
Update textContent via TextNode is better for layout performance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `element` | `HTMLElement` \| [`IoElement`](IoElement.md) | Element to flatten. |

#### Returns

`void`

#### Defined in

[src/core/element.ts:392](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L392)

___

### focusTo

▸ **focusTo**(`dir`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dir` | `string` |

#### Returns

`void`

#### Defined in

[src/core/element.ts:560](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L560)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Inherited from

IoNodeMixin(HTMLElement).init

#### Defined in

[src/core/node.ts:219](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L219)

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

[src/core/node.ts:207](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L207)

___

### labelChanged

▸ **labelChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/core/element.ts:439](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L439)

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

[src/core/node.ts:281](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L281)

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

[src/core/node.ts:260](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L260)

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

[src/core/node.ts:226](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L226)

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

[src/core/node.ts:332](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L332)

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

[src/core/element.ts:430](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L430)

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

[src/core/node.ts:190](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L190)

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

[src/core/node.ts:109](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L109)

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

[src/core/element.ts:302](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L302)

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

[src/core/node.ts:251](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L251)

___

### traverse

▸ **traverse**(`vChildren`, `host?`): `void`

Recurively traverses vDOM.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vChildren` | `any`[] | Array of vDOM children converted by `buildTree()` for easier parsing. |
| `host?` | `HTMLElement` | Optional template target. |

#### Returns

`void`

#### Defined in

[src/core/element.ts:332](https://github.com/io-gui/iogui/blob/tsc/src/core/element.ts#L332)

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

[src/core/node.ts:303](https://github.com/io-gui/iogui/blob/tsc/src/core/node.ts#L303)
