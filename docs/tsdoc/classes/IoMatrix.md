# Class: IoMatrix

Core `IoElement` class.

## Hierarchy

- [`IoVector`](IoVector.md)

  ↳ **`IoMatrix`**

## Constructors

### constructor

**new IoMatrix**(`properties?`, ...`args`)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `properties` | `Record`<`string`, `any`\> | Initial property values. |
| `...args` | `any`[] | - |

#### Inherited from

[IoVector](IoVector.md).[constructor](IoVector.md#constructor)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

## Properties

### $

 **$**: `Record`<`string`, `any`\>

#### Inherited from

[IoVector](IoVector.md).[$](IoVector.md#$)

#### Defined in

[src/core/element.ts:211](https://github.com/io-gui/io/blob/main/src/core/element.ts#L211)

___

### \_bindings

 `Readonly` **\_bindings**: `Map`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoVector](IoVector.md).[_bindings](IoVector.md#_bindings)

#### Defined in

[src/core/node.ts:48](https://github.com/io-gui/io/blob/main/src/core/node.ts#L48)

___

### \_changeQueue

 `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoVector](IoVector.md).[_changeQueue](IoVector.md#_changequeue)

#### Defined in

[src/core/node.ts:49](https://github.com/io-gui/io/blob/main/src/core/node.ts#L49)

___

### \_eventDispatcher

 `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoVector](IoVector.md).[_eventDispatcher](IoVector.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:50](https://github.com/io-gui/io/blob/main/src/core/node.ts#L50)

___

### \_properties

 `Readonly` **\_properties**: `Map`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoVector](IoVector.md).[_properties](IoVector.md#_properties)

#### Defined in

[src/core/node.ts:47](https://github.com/io-gui/io/blob/main/src/core/node.ts#L47)

___

### \_protochain

 `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoVector](IoVector.md).[_protochain](IoVector.md#_protochain)

#### Defined in

[src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

___

### class

 **class**: `string`

#### Inherited from

[IoVector](IoVector.md).[class](IoVector.md#class)

#### Defined in

[src/core/element.ts:220](https://github.com/io-gui/io/blob/main/src/core/element.ts#L220)

___

### columns

 **columns**: `number`

#### Defined in

[src/elements/vectors/io-matrix.ts:44](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L44)

___

### contenteditable

 **contenteditable**: `boolean`

#### Inherited from

[IoVector](IoVector.md).[contenteditable](IoVector.md#contenteditable)

#### Defined in

[src/core/element.ts:217](https://github.com/io-gui/io/blob/main/src/core/element.ts#L217)

___

### conversion

 **conversion**: `number`

#### Inherited from

[IoVector](IoVector.md).[conversion](IoVector.md#conversion)

#### Defined in

[src/elements/vectors/io-vector.ts:31](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L31)

___

### disabled

 **disabled**: `boolean`

#### Inherited from

[IoVector](IoVector.md).[disabled](IoVector.md#disabled)

#### Defined in

[src/core/element.ts:241](https://github.com/io-gui/io/blob/main/src/core/element.ts#L241)

___

### hidden

 **hidden**: `boolean`

#### Inherited from

[IoVector](IoVector.md).[hidden](IoVector.md#hidden)

#### Defined in

[src/core/element.ts:238](https://github.com/io-gui/io/blob/main/src/core/element.ts#L238)

___

### id

 **id**: `string`

#### Inherited from

[IoVector](IoVector.md).[id](IoVector.md#id)

#### Defined in

[src/core/element.ts:235](https://github.com/io-gui/io/blob/main/src/core/element.ts#L235)

___

### keys

 **keys**: `never`[]

#### Inherited from

[IoVector](IoVector.md).[keys](IoVector.md#keys)

#### Defined in

[src/elements/vectors/io-vector.ts:52](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L52)

___

### label

 **label**: `string`

#### Inherited from

[IoVector](IoVector.md).[label](IoVector.md#label)

#### Defined in

[src/core/element.ts:226](https://github.com/io-gui/io/blob/main/src/core/element.ts#L226)

___

### ladder

 **ladder**: `boolean`

#### Inherited from

[IoVector](IoVector.md).[ladder](IoVector.md#ladder)

#### Defined in

[src/elements/vectors/io-vector.ts:49](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L49)

___

### linkable

 **linkable**: `boolean`

#### Inherited from

[IoVector](IoVector.md).[linkable](IoVector.md#linkable)

#### Defined in

[src/elements/vectors/io-vector.ts:43](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L43)

___

### linked

 **linked**: `boolean`

#### Inherited from

[IoVector](IoVector.md).[linked](IoVector.md#linked)

#### Defined in

[src/elements/vectors/io-vector.ts:46](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L46)

___

### max

 **max**: `number`

#### Inherited from

[IoVector](IoVector.md).[max](IoVector.md#max)

#### Defined in

[src/elements/vectors/io-vector.ts:40](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L40)

___

### min

 **min**: `number`

#### Inherited from

[IoVector](IoVector.md).[min](IoVector.md#min)

#### Defined in

[src/elements/vectors/io-vector.ts:37](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L37)

___

### name

 **name**: `string`

#### Inherited from

[IoVector](IoVector.md).[name](IoVector.md#name)

#### Defined in

[src/core/element.ts:229](https://github.com/io-gui/io/blob/main/src/core/element.ts#L229)

___

### role

 **role**: `string`

#### Inherited from

[IoVector](IoVector.md).[role](IoVector.md#role)

#### Defined in

[src/core/element.ts:223](https://github.com/io-gui/io/blob/main/src/core/element.ts#L223)

___

### step

 **step**: `number`

#### Inherited from

[IoVector](IoVector.md).[step](IoVector.md#step)

#### Defined in

[src/elements/vectors/io-vector.ts:34](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L34)

___

### tabindex

 **tabindex**: `string`

#### Inherited from

[IoVector](IoVector.md).[tabindex](IoVector.md#tabindex)

#### Defined in

[src/core/element.ts:214](https://github.com/io-gui/io/blob/main/src/core/element.ts#L214)

___

### title

 **title**: `string`

#### Inherited from

[IoVector](IoVector.md).[title](IoVector.md#title)

#### Defined in

[src/core/element.ts:232](https://github.com/io-gui/io/blob/main/src/core/element.ts#L232)

___

### value

 **value**: `number`[]

#### Overrides

[IoVector](IoVector.md).[value](IoVector.md#value)

#### Defined in

[src/elements/vectors/io-matrix.ts:41](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L41)

## Accessors

### textNode

`get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoVector.textNode

#### Defined in

[src/core/element.ts:392](https://github.com/io-gui/io/blob/main/src/core/element.ts#L392)

`set` **textNode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

IoVector.textNode

#### Defined in

[src/core/element.ts:396](https://github.com/io-gui/io/blob/main/src/core/element.ts#L396)

___

### Properties

`Static` `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoVector.Properties

#### Defined in

[src/core/node.ts:37](https://github.com/io-gui/io/blob/main/src/core/node.ts#L37)

___

### Style

`Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoVector.Style

#### Defined in

[src/elements/vectors/io-matrix.ts:17](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L17)

___

### observedAttributes

`Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoVector.observedAttributes

#### Defined in

[src/core/element.ts:243](https://github.com/io-gui/io/blob/main/src/core/element.ts#L243)

## Methods

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

[IoVector](IoVector.md).[_flattenTextNode](IoVector.md#_flattentextnode)

#### Defined in

[src/core/element.ts:375](https://github.com/io-gui/io/blob/main/src/core/element.ts#L375)

___

### \_onNumberPointerDown

**_onNumberPointerDown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[_onNumberPointerDown](IoVector.md#_onnumberpointerdown)

#### Defined in

[src/elements/vectors/io-vector.ts:56](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L56)

___

### \_onNumberValueInput

**_onNumberValueInput**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`<`any`\> |

#### Returns

`void`

#### Overrides

[IoVector](IoVector.md).[_onNumberValueInput](IoVector.md#_onnumbervalueinput)

#### Defined in

[src/elements/vectors/io-matrix.ts:46](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L46)

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

[IoVector](IoVector.md).[addEventListener](IoVector.md#addeventlistener)

#### Defined in

[src/core/node.ts:337](https://github.com/io-gui/io/blob/main/src/core/node.ts#L337)

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

[IoVector](IoVector.md).[applyProperties](IoVector.md#applyproperties)

#### Defined in

[src/core/element.ts:400](https://github.com/io-gui/io/blob/main/src/core/element.ts#L400)

___

### attributeChangedCallback

**attributeChangedCallback**(`prop`, `oldValue`, `newValue`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `prop` | `string` |
| `oldValue` | `any` |
| `newValue` | `any` |

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[attributeChangedCallback](IoVector.md#attributechangedcallback)

#### Defined in

[src/core/element.ts:253](https://github.com/io-gui/io/blob/main/src/core/element.ts#L253)

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

[IoVector](IoVector.md).[bind](IoVector.md#bind)

#### Defined in

[src/core/node.ts:306](https://github.com/io-gui/io/blob/main/src/core/node.ts#L306)

___

### changed

**changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[changed](IoVector.md#changed)

#### Defined in

[src/elements/vectors/io-vector.ts:90](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L90)

___

### connectedCallback

**connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[connectedCallback](IoVector.md#connectedcallback)

#### Defined in

[src/core/element.ts:271](https://github.com/io-gui/io/blob/main/src/core/element.ts#L271)

___

### disabledChanged

**disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[disabledChanged](IoVector.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

___

### disconnectedCallback

**disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[disconnectedCallback](IoVector.md#disconnectedcallback)

#### Defined in

[src/core/element.ts:279](https://github.com/io-gui/io/blob/main/src/core/element.ts#L279)

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

[IoVector](IoVector.md).[dispatchEvent](IoVector.md#dispatchevent)

#### Defined in

[src/core/node.ts:362](https://github.com/io-gui/io/blob/main/src/core/node.ts#L362)

___

### dispatchQueue

**dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[dispatchQueue](IoVector.md#dispatchqueue)

#### Defined in

[src/core/node.ts:248](https://github.com/io-gui/io/blob/main/src/core/node.ts#L248)

___

### dispatchQueueSync

**dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[dispatchQueueSync](IoVector.md#dispatchqueuesync)

#### Defined in

[src/core/node.ts:258](https://github.com/io-gui/io/blob/main/src/core/node.ts#L258)

___

### dispose

**dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[dispose](IoVector.md#dispose)

#### Defined in

[src/core/node.ts:369](https://github.com/io-gui/io/blob/main/src/core/node.ts#L369)

___

### disposeDeep

**disposeDeep**(`host`, `child`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `host` | `HTMLElement` |
| `child` | `any` |

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[disposeDeep](IoVector.md#disposedeep)

#### Defined in

[src/core/element.ts:295](https://github.com/io-gui/io/blob/main/src/core/element.ts#L295)

___

### getSlotted

**getSlotted**(): ``null`` \| `any`[]

#### Returns

``null`` \| `any`[]

#### Inherited from

[IoVector](IoVector.md).[getSlotted](IoVector.md#getslotted)

#### Defined in

[src/elements/vectors/io-vector.ts:110](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L110)

___

### init

**init**(): `void`

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[init](IoVector.md#init)

#### Defined in

[src/core/node.ts:235](https://github.com/io-gui/io/blob/main/src/core/node.ts#L235)

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

[IoVector](IoVector.md).[inputValue](IoVector.md#inputvalue)

#### Defined in

[src/core/node.ts:223](https://github.com/io-gui/io/blob/main/src/core/node.ts#L223)

___

### labelChanged

**labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[labelChanged](IoVector.md#labelchanged)

#### Defined in

[src/core/element.ts:422](https://github.com/io-gui/io/blob/main/src/core/element.ts#L422)

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

[IoVector](IoVector.md).[objectMutated](IoVector.md#objectmutated)

#### Defined in

[src/core/node.ts:297](https://github.com/io-gui/io/blob/main/src/core/node.ts#L297)

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

[IoVector](IoVector.md).[onObjectMutated](IoVector.md#onobjectmutated)

#### Defined in

[src/core/node.ts:276](https://github.com/io-gui/io/blob/main/src/core/node.ts#L276)

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

[IoVector](IoVector.md).[queue](IoVector.md#queue)

#### Defined in

[src/core/node.ts:242](https://github.com/io-gui/io/blob/main/src/core/node.ts#L242)

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

[IoVector](IoVector.md).[removeEventListener](IoVector.md#removeeventlistener)

#### Defined in

[src/core/node.ts:352](https://github.com/io-gui/io/blob/main/src/core/node.ts#L352)

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

[IoVector](IoVector.md).[setAttribute](IoVector.md#setattribute)

#### Defined in

[src/core/element.ts:413](https://github.com/io-gui/io/blob/main/src/core/element.ts#L413)

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

[IoVector](IoVector.md).[setProperties](IoVector.md#setproperties)

#### Defined in

[src/core/node.ts:206](https://github.com/io-gui/io/blob/main/src/core/node.ts#L206)

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

[IoVector](IoVector.md).[setProperty](IoVector.md#setproperty)

#### Defined in

[src/core/node.ts:109](https://github.com/io-gui/io/blob/main/src/core/node.ts#L109)

___

### template

**template**(`vDOM`, `host?`): `void`

Renders DOM from virtual DOM arrays.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vDOM` | `any`[] | Array of vDOM children. |
| `host?` | `HTMLElement` | Optional template target. |

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[template](IoVector.md#template)

#### Defined in

[src/core/element.ts:289](https://github.com/io-gui/io/blob/main/src/core/element.ts#L289)

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

[IoVector](IoVector.md).[throttle](IoVector.md#throttle)

#### Defined in

[src/core/node.ts:267](https://github.com/io-gui/io/blob/main/src/core/node.ts#L267)

___

### traverse

**traverse**(`vChildren`, `host?`): `void`

Recurively traverses vDOM.
TODO: test element.traverse() function!

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vChildren` | `any`[] | Array of vDOM children converted by `buildTree()` for easier parsing. |
| `host?` | `HTMLElement` | Optional template target. |

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[traverse](IoVector.md#traverse)

#### Defined in

[src/core/element.ts:319](https://github.com/io-gui/io/blob/main/src/core/element.ts#L319)

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

[IoVector](IoVector.md).[unbind](IoVector.md#unbind)

#### Defined in

[src/core/node.ts:321](https://github.com/io-gui/io/blob/main/src/core/node.ts#L321)

___

### valueChanged

**valueChanged**(): `void`

#### Returns

`void`

#### Overrides

[IoVector](IoVector.md).[valueChanged](IoVector.md#valuechanged)

#### Defined in

[src/elements/vectors/io-matrix.ts:56](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L56)
