[io-gui](../README.md) / IoMatrix

# Class: IoMatrix

Input element for vector arrays dispalayed as 2D matrices. Array `value` can have 4, 9, and 16 elements for 2x2, 3x3 and 4x4 matrices.

<io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 1]}'></io-element-demo>

<io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 0, 1, 0, 0, 0, 1]}'></io-element-demo>

<io-element-demo element="io-matrix" properties='{"value": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]}'></io-element-demo>

## Hierarchy

- [`IoVector`](IoVector.md)

  ↳ **`IoMatrix`**

## Table of contents

### Constructors

- [constructor](IoMatrix.md#constructor)

### Properties

- [$](IoMatrix.md#$)
- [\_bindings](IoMatrix.md#_bindings)
- [\_changeQueue](IoMatrix.md#_changequeue)
- [\_eventDispatcher](IoMatrix.md#_eventdispatcher)
- [\_properties](IoMatrix.md#_properties)
- [\_protochain](IoMatrix.md#_protochain)
- [class](IoMatrix.md#class)
- [columns](IoMatrix.md#columns)
- [contenteditable](IoMatrix.md#contenteditable)
- [conversion](IoMatrix.md#conversion)
- [disabled](IoMatrix.md#disabled)
- [hidden](IoMatrix.md#hidden)
- [id](IoMatrix.md#id)
- [keys](IoMatrix.md#keys)
- [label](IoMatrix.md#label)
- [ladder](IoMatrix.md#ladder)
- [linkable](IoMatrix.md#linkable)
- [linked](IoMatrix.md#linked)
- [max](IoMatrix.md#max)
- [min](IoMatrix.md#min)
- [name](IoMatrix.md#name)
- [role](IoMatrix.md#role)
- [step](IoMatrix.md#step)
- [tabindex](IoMatrix.md#tabindex)
- [title](IoMatrix.md#title)
- [value](IoMatrix.md#value)

### Accessors

- [textNode](IoMatrix.md#textnode)
- [Properties](IoMatrix.md#properties)
- [Style](IoMatrix.md#style)

### Methods

- [Register](IoMatrix.md#register)
- [\_flattenTextNode](IoMatrix.md#_flattentextnode)
- [\_onNumberPointerDown](IoMatrix.md#_onnumberpointerdown)
- [\_onNumberValueInput](IoMatrix.md#_onnumbervalueinput)
- [addEventListener](IoMatrix.md#addeventlistener)
- [applyProperties](IoMatrix.md#applyproperties)
- [bind](IoMatrix.md#bind)
- [changed](IoMatrix.md#changed)
- [connectedCallback](IoMatrix.md#connectedcallback)
- [disabledChanged](IoMatrix.md#disabledchanged)
- [disconnectedCallback](IoMatrix.md#disconnectedcallback)
- [dispatchEvent](IoMatrix.md#dispatchevent)
- [dispatchMutationEvent](IoMatrix.md#dispatchmutationevent)
- [dispatchQueue](IoMatrix.md#dispatchqueue)
- [dispatchQueueSync](IoMatrix.md#dispatchqueuesync)
- [dispose](IoMatrix.md#dispose)
- [getSlotted](IoMatrix.md#getslotted)
- [init](IoMatrix.md#init)
- [inputValue](IoMatrix.md#inputvalue)
- [labelChanged](IoMatrix.md#labelchanged)
- [objectMutated](IoMatrix.md#objectmutated)
- [onObjectMutated](IoMatrix.md#onobjectmutated)
- [queue](IoMatrix.md#queue)
- [removeEventListener](IoMatrix.md#removeeventlistener)
- [setAttribute](IoMatrix.md#setattribute)
- [setProperties](IoMatrix.md#setproperties)
- [setProperty](IoMatrix.md#setproperty)
- [template](IoMatrix.md#template)
- [throttle](IoMatrix.md#throttle)
- [traverse](IoMatrix.md#traverse)
- [unbind](IoMatrix.md#unbind)
- [valueChanged](IoMatrix.md#valuechanged)

## Constructors

### constructor

• **new IoMatrix**(`...args`): [`IoMatrix`](IoMatrix.md)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

[`IoMatrix`](IoMatrix.md)

#### Inherited from

[IoVector](IoVector.md).[constructor](IoVector.md#constructor)

#### Defined in

[src/core/node.ts:63](https://github.com/io-gui/io/blob/main/src/core/node.ts#L63)

## Properties

### $

• **$**: `Record`\<`string`, `any`\>

#### Inherited from

[IoVector](IoVector.md).[$](IoVector.md#$)

#### Defined in

[src/core/element.ts:178](https://github.com/io-gui/io/blob/main/src/core/element.ts#L178)

___

### \_bindings

• `Readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoVector](IoVector.md).[_bindings](IoVector.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoVector](IoVector.md).[_changeQueue](IoVector.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoVector](IoVector.md).[_eventDispatcher](IoVector.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

___

### \_properties

• `Readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoVector](IoVector.md).[_properties](IoVector.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoVector](IoVector.md).[_protochain](IoVector.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

___

### class

• **class**: `string`

#### Inherited from

[IoVector](IoVector.md).[class](IoVector.md#class)

#### Defined in

[src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

___

### columns

• **columns**: `number`

#### Defined in

[src/elements/vectors/io-matrix.ts:42](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L42)

___

### contenteditable

• **contenteditable**: `boolean`

#### Inherited from

[IoVector](IoVector.md).[contenteditable](IoVector.md#contenteditable)

#### Defined in

[src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

___

### conversion

• **conversion**: `number`

#### Inherited from

[IoVector](IoVector.md).[conversion](IoVector.md#conversion)

#### Defined in

[src/elements/vectors/io-vector.ts:40](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L40)

___

### disabled

• **disabled**: `boolean`

#### Inherited from

[IoVector](IoVector.md).[disabled](IoVector.md#disabled)

#### Defined in

[src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

___

### hidden

• **hidden**: `boolean`

#### Inherited from

[IoVector](IoVector.md).[hidden](IoVector.md#hidden)

#### Defined in

[src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

___

### id

• **id**: `string`

#### Inherited from

[IoVector](IoVector.md).[id](IoVector.md#id)

#### Defined in

[src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

___

### keys

• **keys**: `string`[]

#### Inherited from

[IoVector](IoVector.md).[keys](IoVector.md#keys)

#### Defined in

[src/elements/vectors/io-vector.ts:61](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L61)

___

### label

• **label**: `string`

#### Inherited from

[IoVector](IoVector.md).[label](IoVector.md#label)

#### Defined in

[src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

___

### ladder

• **ladder**: `boolean`

#### Inherited from

[IoVector](IoVector.md).[ladder](IoVector.md#ladder)

#### Defined in

[src/elements/vectors/io-vector.ts:58](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L58)

___

### linkable

• **linkable**: `boolean`

#### Inherited from

[IoVector](IoVector.md).[linkable](IoVector.md#linkable)

#### Defined in

[src/elements/vectors/io-vector.ts:52](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L52)

___

### linked

• **linked**: `boolean`

#### Inherited from

[IoVector](IoVector.md).[linked](IoVector.md#linked)

#### Defined in

[src/elements/vectors/io-vector.ts:55](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L55)

___

### max

• **max**: `number`

#### Inherited from

[IoVector](IoVector.md).[max](IoVector.md#max)

#### Defined in

[src/elements/vectors/io-vector.ts:49](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L49)

___

### min

• **min**: `number`

#### Inherited from

[IoVector](IoVector.md).[min](IoVector.md#min)

#### Defined in

[src/elements/vectors/io-vector.ts:46](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L46)

___

### name

• **name**: `string`

#### Inherited from

[IoVector](IoVector.md).[name](IoVector.md#name)

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

___

### role

• **role**: `string`

#### Inherited from

[IoVector](IoVector.md).[role](IoVector.md#role)

#### Defined in

[src/core/element.ts:190](https://github.com/io-gui/io/blob/main/src/core/element.ts#L190)

___

### step

• **step**: `number`

#### Inherited from

[IoVector](IoVector.md).[step](IoVector.md#step)

#### Defined in

[src/elements/vectors/io-vector.ts:43](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L43)

___

### tabindex

• **tabindex**: `string`

#### Inherited from

[IoVector](IoVector.md).[tabindex](IoVector.md#tabindex)

#### Defined in

[src/core/element.ts:181](https://github.com/io-gui/io/blob/main/src/core/element.ts#L181)

___

### title

• **title**: `string`

#### Inherited from

[IoVector](IoVector.md).[title](IoVector.md#title)

#### Defined in

[src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

___

### value

• **value**: `number`[]

#### Overrides

[IoVector](IoVector.md).[value](IoVector.md#value)

#### Defined in

[src/elements/vectors/io-matrix.ts:39](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L39)

## Accessors

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoVector.textNode

#### Defined in

[src/core/element.ts:392](https://github.com/io-gui/io/blob/main/src/core/element.ts#L392)

• `set` **textNode**(`value`): `void`

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

• `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoVector.Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

___

### Style

• `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoVector.Style

#### Defined in

[src/elements/vectors/io-matrix.ts:15](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L15)

## Methods

### Register

▸ **Register**(`ioNodeConstructor`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ioNodeConstructor` | typeof [`IoNode`](IoNode.md) |

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[Register](IoVector.md#register)

#### Defined in

[src/core/element.ts:304](https://github.com/io-gui/io/blob/main/src/core/element.ts#L304)

___

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

#### Inherited from

[IoVector](IoVector.md).[_flattenTextNode](IoVector.md#_flattentextnode)

#### Defined in

[src/core/element.ts:375](https://github.com/io-gui/io/blob/main/src/core/element.ts#L375)

___

### \_onNumberPointerDown

▸ **_onNumberPointerDown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[_onNumberPointerDown](IoVector.md#_onnumberpointerdown)

#### Defined in

[src/elements/vectors/io-vector.ts:65](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L65)

___

### \_onNumberValueInput

▸ **_onNumberValueInput**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`\<`any`\> |

#### Returns

`void`

#### Overrides

[IoVector](IoVector.md).[_onNumberValueInput](IoVector.md#_onnumbervalueinput)

#### Defined in

[src/elements/vectors/io-matrix.ts:44](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L44)

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

[IoVector](IoVector.md).[addEventListener](IoVector.md#addeventlistener)

#### Defined in

[src/core/node.ts:352](https://github.com/io-gui/io/blob/main/src/core/node.ts#L352)

___

### applyProperties

▸ **applyProperties**(`props`): `void`

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

[IoVector](IoVector.md).[bind](IoVector.md#bind)

#### Defined in

[src/core/node.ts:319](https://github.com/io-gui/io/blob/main/src/core/node.ts#L319)

___

### changed

▸ **changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[changed](IoVector.md#changed)

#### Defined in

[src/elements/vectors/io-vector.ts:99](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L99)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[connectedCallback](IoVector.md#connectedcallback)

#### Defined in

[src/core/element.ts:213](https://github.com/io-gui/io/blob/main/src/core/element.ts#L213)

___

### disabledChanged

▸ **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[disabledChanged](IoVector.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[disconnectedCallback](IoVector.md#disconnectedcallback)

#### Defined in

[src/core/element.ts:221](https://github.com/io-gui/io/blob/main/src/core/element.ts#L221)

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

[IoVector](IoVector.md).[dispatchEvent](IoVector.md#dispatchevent)

#### Defined in

[src/core/node.ts:377](https://github.com/io-gui/io/blob/main/src/core/node.ts#L377)

___

### dispatchMutationEvent

▸ **dispatchMutationEvent**(`object`): `void`

Shorthand for dispatching `'object-mutated'` event on window.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `object` | `any` | object which mutated. |

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[dispatchMutationEvent](IoVector.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:384](https://github.com/io-gui/io/blob/main/src/core/node.ts#L384)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[dispatchQueue](IoVector.md#dispatchqueue)

#### Defined in

[src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[dispatchQueueSync](IoVector.md#dispatchqueuesync)

#### Defined in

[src/core/node.ts:269](https://github.com/io-gui/io/blob/main/src/core/node.ts#L269)

___

### dispose

▸ **dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[dispose](IoVector.md#dispose)

#### Defined in

[src/core/node.ts:391](https://github.com/io-gui/io/blob/main/src/core/node.ts#L391)

___

### getSlotted

▸ **getSlotted**(): ``null`` \| `any`[]

#### Returns

``null`` \| `any`[]

#### Inherited from

[IoVector](IoVector.md).[getSlotted](IoVector.md#getslotted)

#### Defined in

[src/elements/vectors/io-vector.ts:119](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-vector.ts#L119)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[init](IoVector.md#init)

#### Defined in

[src/core/node.ts:246](https://github.com/io-gui/io/blob/main/src/core/node.ts#L246)

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

[IoVector](IoVector.md).[inputValue](IoVector.md#inputvalue)

#### Defined in

[src/core/node.ts:234](https://github.com/io-gui/io/blob/main/src/core/node.ts#L234)

___

### labelChanged

▸ **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[labelChanged](IoVector.md#labelchanged)

#### Defined in

[src/core/element.ts:422](https://github.com/io-gui/io/blob/main/src/core/element.ts#L422)

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

[IoVector](IoVector.md).[objectMutated](IoVector.md#objectmutated)

#### Defined in

[src/core/node.ts:308](https://github.com/io-gui/io/blob/main/src/core/node.ts#L308)

___

### onObjectMutated

▸ **onObjectMutated**(`event`): `void`

Event handler for 'object-mutated' event emitted from the `window`.
Node should be listening for this event if it has an observed object property

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `CustomEvent`\<`any`\> | Event payload. |

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[onObjectMutated](IoVector.md#onobjectmutated)

#### Defined in

[src/core/node.ts:287](https://github.com/io-gui/io/blob/main/src/core/node.ts#L287)

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

[IoVector](IoVector.md).[queue](IoVector.md#queue)

#### Defined in

[src/core/node.ts:253](https://github.com/io-gui/io/blob/main/src/core/node.ts#L253)

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

[IoVector](IoVector.md).[removeEventListener](IoVector.md#removeeventlistener)

#### Defined in

[src/core/node.ts:367](https://github.com/io-gui/io/blob/main/src/core/node.ts#L367)

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

#### Inherited from

[IoVector](IoVector.md).[setAttribute](IoVector.md#setattribute)

#### Defined in

[src/core/element.ts:413](https://github.com/io-gui/io/blob/main/src/core/element.ts#L413)

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

[IoVector](IoVector.md).[setProperties](IoVector.md#setproperties)

#### Defined in

[src/core/node.ts:216](https://github.com/io-gui/io/blob/main/src/core/node.ts#L216)

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

[IoVector](IoVector.md).[setProperty](IoVector.md#setproperty)

#### Defined in

[src/core/node.ts:121](https://github.com/io-gui/io/blob/main/src/core/node.ts#L121)

___

### template

▸ **template**(`vDOM`, `host?`, `cache?`): `void`

Renders DOM from virtual DOM arrays.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vDOM` | `any`[] | Array of vDOM children. |
| `host?` | `HTMLElement` | Optional template target. |
| `cache?` | `boolean` | Optional don't reuse existing elements and skip dispose |

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[template](IoVector.md#template)

#### Defined in

[src/core/element.ts:233](https://github.com/io-gui/io/blob/main/src/core/element.ts#L233)

___

### throttle

▸ **throttle**(`func`, `arg?`, `timeout?`): `void`

Throttles function execution to next frame (rAF) if the function has been executed in the current frame.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `func` | [`CallbackFunction`](../README.md#callbackfunction) | `undefined` | Function to throttle. |
| `arg` | `any` | `undefined` | argument for throttled function. |
| `timeout` | `number` | `1` | minimum delay in ms before executing the function. |

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[throttle](IoVector.md#throttle)

#### Defined in

[src/core/node.ts:278](https://github.com/io-gui/io/blob/main/src/core/node.ts#L278)

___

### traverse

▸ **traverse**(`vChildren`, `host?`, `cache?`): `void`

Recurively traverses vDOM.
TODO: test element.traverse() function!

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vChildren` | `any`[] | Array of vDOM children converted by `buildTree()` for easier parsing. |
| `host?` | `HTMLElement` | Optional template target. |
| `cache?` | `boolean` | Optional don't reuse existing elements and skip dispose |

#### Returns

`void`

#### Inherited from

[IoVector](IoVector.md).[traverse](IoVector.md#traverse)

#### Defined in

[src/core/element.ts:246](https://github.com/io-gui/io/blob/main/src/core/element.ts#L246)

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

[IoVector](IoVector.md).[unbind](IoVector.md#unbind)

#### Defined in

[src/core/node.ts:336](https://github.com/io-gui/io/blob/main/src/core/node.ts#L336)

___

### valueChanged

▸ **valueChanged**(): `void`

#### Returns

`void`

#### Overrides

[IoVector](IoVector.md).[valueChanged](IoVector.md#valuechanged)

#### Defined in

[src/elements/vectors/io-matrix.ts:54](https://github.com/io-gui/io/blob/main/src/elements/vectors/io-matrix.ts#L54)
