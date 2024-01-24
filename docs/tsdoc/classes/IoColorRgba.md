[io-gui](../README.md) / IoColorRgba

# Class: IoColorRgba

Input element for color displayed as vector and an interactive picker.

## Hierarchy

- [`IoColorBase`](IoColorBase.md)

  ↳ **`IoColorRgba`**

## Table of contents

### Constructors

- [constructor](IoColorRgba.md#constructor)

### Properties

- [$](IoColorRgba.md#$)
- [\_bindings](IoColorRgba.md#_bindings)
- [\_changeQueue](IoColorRgba.md#_changequeue)
- [\_eventDispatcher](IoColorRgba.md#_eventdispatcher)
- [\_properties](IoColorRgba.md#_properties)
- [\_protochain](IoColorRgba.md#_protochain)
- [class](IoColorRgba.md#class)
- [cmyk](IoColorRgba.md#cmyk)
- [contenteditable](IoColorRgba.md#contenteditable)
- [disabled](IoColorRgba.md#disabled)
- [hidden](IoColorRgba.md#hidden)
- [hsl](IoColorRgba.md#hsl)
- [hsv](IoColorRgba.md#hsv)
- [id](IoColorRgba.md#id)
- [label](IoColorRgba.md#label)
- [name](IoColorRgba.md#name)
- [rgba](IoColorRgba.md#rgba)
- [role](IoColorRgba.md#role)
- [tabindex](IoColorRgba.md#tabindex)
- [title](IoColorRgba.md#title)
- [value](IoColorRgba.md#value)

### Accessors

- [textNode](IoColorRgba.md#textnode)
- [Properties](IoColorRgba.md#properties)
- [Style](IoColorRgba.md#style)

### Methods

- [Register](IoColorRgba.md#register)
- [\_flattenTextNode](IoColorRgba.md#_flattentextnode)
- [\_onNumberValueInput](IoColorRgba.md#_onnumbervalueinput)
- [addEventListener](IoColorRgba.md#addeventlistener)
- [applyProperties](IoColorRgba.md#applyproperties)
- [bind](IoColorRgba.md#bind)
- [changed](IoColorRgba.md#changed)
- [connectedCallback](IoColorRgba.md#connectedcallback)
- [disabledChanged](IoColorRgba.md#disabledchanged)
- [disconnectedCallback](IoColorRgba.md#disconnectedcallback)
- [dispatchEvent](IoColorRgba.md#dispatchevent)
- [dispatchMutationEvent](IoColorRgba.md#dispatchmutationevent)
- [dispatchQueue](IoColorRgba.md#dispatchqueue)
- [dispatchQueueSync](IoColorRgba.md#dispatchqueuesync)
- [dispose](IoColorRgba.md#dispose)
- [init](IoColorRgba.md#init)
- [inputValue](IoColorRgba.md#inputvalue)
- [labelChanged](IoColorRgba.md#labelchanged)
- [objectMutated](IoColorRgba.md#objectmutated)
- [onObjectMutated](IoColorRgba.md#onobjectmutated)
- [queue](IoColorRgba.md#queue)
- [removeEventListener](IoColorRgba.md#removeeventlistener)
- [rgbFromCmyk](IoColorRgba.md#rgbfromcmyk)
- [rgbFromHsl](IoColorRgba.md#rgbfromhsl)
- [rgbFromHsv](IoColorRgba.md#rgbfromhsv)
- [setAttribute](IoColorRgba.md#setattribute)
- [setProperties](IoColorRgba.md#setproperties)
- [setProperty](IoColorRgba.md#setproperty)
- [template](IoColorRgba.md#template)
- [throttle](IoColorRgba.md#throttle)
- [traverse](IoColorRgba.md#traverse)
- [unbind](IoColorRgba.md#unbind)
- [valueChanged](IoColorRgba.md#valuechanged)
- [valueFromRgb](IoColorRgba.md#valuefromrgb)
- [valueMutated](IoColorRgba.md#valuemutated)

## Constructors

### constructor

• **new IoColorRgba**(`...args`): [`IoColorRgba`](IoColorRgba.md)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

[`IoColorRgba`](IoColorRgba.md)

#### Inherited from

[IoColorBase](IoColorBase.md).[constructor](IoColorBase.md#constructor)

#### Defined in

[src/core/node.ts:63](https://github.com/io-gui/io/blob/main/src/core/node.ts#L63)

## Properties

### $

• **$**: `Record`\<`string`, `any`\>

#### Inherited from

[IoColorBase](IoColorBase.md).[$](IoColorBase.md#$)

#### Defined in

[src/core/element.ts:178](https://github.com/io-gui/io/blob/main/src/core/element.ts#L178)

___

### \_bindings

• `Readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoColorBase](IoColorBase.md).[_bindings](IoColorBase.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/io/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoColorBase](IoColorBase.md).[_changeQueue](IoColorBase.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/io/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoColorBase](IoColorBase.md).[_eventDispatcher](IoColorBase.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/io/blob/main/src/core/node.ts#L57)

___

### \_properties

• `Readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoColorBase](IoColorBase.md).[_properties](IoColorBase.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/io/blob/main/src/core/node.ts#L54)

___

### \_protochain

• `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoColorBase](IoColorBase.md).[_protochain](IoColorBase.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/io/blob/main/src/core/node.ts#L53)

___

### class

• **class**: `string`

#### Inherited from

[IoColorBase](IoColorBase.md).[class](IoColorBase.md#class)

#### Defined in

[src/core/element.ts:187](https://github.com/io-gui/io/blob/main/src/core/element.ts#L187)

___

### cmyk

• **cmyk**: [`number`, `number`, `number`, `number`]

#### Inherited from

[IoColorBase](IoColorBase.md).[cmyk](IoColorBase.md#cmyk)

#### Defined in

[src/elements/color/io-color-base.ts:20](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L20)

___

### contenteditable

• **contenteditable**: `boolean`

#### Inherited from

[IoColorBase](IoColorBase.md).[contenteditable](IoColorBase.md#contenteditable)

#### Defined in

[src/core/element.ts:184](https://github.com/io-gui/io/blob/main/src/core/element.ts#L184)

___

### disabled

• **disabled**: `boolean`

#### Inherited from

[IoColorBase](IoColorBase.md).[disabled](IoColorBase.md#disabled)

#### Defined in

[src/core/element.ts:208](https://github.com/io-gui/io/blob/main/src/core/element.ts#L208)

___

### hidden

• **hidden**: `boolean`

#### Inherited from

[IoColorBase](IoColorBase.md).[hidden](IoColorBase.md#hidden)

#### Defined in

[src/core/element.ts:205](https://github.com/io-gui/io/blob/main/src/core/element.ts#L205)

___

### hsl

• **hsl**: [`number`, `number`, `number`]

#### Inherited from

[IoColorBase](IoColorBase.md).[hsl](IoColorBase.md#hsl)

#### Defined in

[src/elements/color/io-color-base.ts:17](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L17)

___

### hsv

• **hsv**: [`number`, `number`, `number`]

#### Inherited from

[IoColorBase](IoColorBase.md).[hsv](IoColorBase.md#hsv)

#### Defined in

[src/elements/color/io-color-base.ts:14](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L14)

___

### id

• **id**: `string`

#### Inherited from

[IoColorBase](IoColorBase.md).[id](IoColorBase.md#id)

#### Defined in

[src/core/element.ts:202](https://github.com/io-gui/io/blob/main/src/core/element.ts#L202)

___

### label

• **label**: `string`

#### Inherited from

[IoColorBase](IoColorBase.md).[label](IoColorBase.md#label)

#### Defined in

[src/core/element.ts:193](https://github.com/io-gui/io/blob/main/src/core/element.ts#L193)

___

### name

• **name**: `string`

#### Inherited from

[IoColorBase](IoColorBase.md).[name](IoColorBase.md#name)

#### Defined in

[src/core/element.ts:196](https://github.com/io-gui/io/blob/main/src/core/element.ts#L196)

___

### rgba

• **rgba**: [`number`, `number`, `number`, `number`]

#### Inherited from

[IoColorBase](IoColorBase.md).[rgba](IoColorBase.md#rgba)

#### Defined in

[src/elements/color/io-color-base.ts:11](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L11)

___

### role

• **role**: `string`

#### Inherited from

[IoColorBase](IoColorBase.md).[role](IoColorBase.md#role)

#### Defined in

[src/core/element.ts:190](https://github.com/io-gui/io/blob/main/src/core/element.ts#L190)

___

### tabindex

• **tabindex**: `string`

#### Inherited from

[IoColorBase](IoColorBase.md).[tabindex](IoColorBase.md#tabindex)

#### Defined in

[src/core/element.ts:181](https://github.com/io-gui/io/blob/main/src/core/element.ts#L181)

___

### title

• **title**: `string`

#### Inherited from

[IoColorBase](IoColorBase.md).[title](IoColorBase.md#title)

#### Defined in

[src/core/element.ts:199](https://github.com/io-gui/io/blob/main/src/core/element.ts#L199)

___

### value

• **value**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `a?` | `number` |
| `b` | `number` |
| `g` | `number` |
| `r` | `number` |

#### Inherited from

[IoColorBase](IoColorBase.md).[value](IoColorBase.md#value)

#### Defined in

[src/elements/color/io-color-base.ts:8](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L8)

## Accessors

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoColorBase.textNode

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

IoColorBase.textNode

#### Defined in

[src/core/element.ts:396](https://github.com/io-gui/io/blob/main/src/core/element.ts#L396)

___

### Properties

• `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoColorBase.Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

___

### Style

• `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoColorBase.Style

#### Defined in

[src/elements/color/io-color-rgba.ts:9](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-rgba.ts#L9)

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

[IoColorBase](IoColorBase.md).[Register](IoColorBase.md#register)

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

[IoColorBase](IoColorBase.md).[_flattenTextNode](IoColorBase.md#_flattentextnode)

#### Defined in

[src/core/element.ts:375](https://github.com/io-gui/io/blob/main/src/core/element.ts#L375)

___

### \_onNumberValueInput

▸ **_onNumberValueInput**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`\<`any`\> |

#### Returns

`void`

#### Defined in

[src/elements/color/io-color-rgba.ts:30](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-rgba.ts#L30)

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

[IoColorBase](IoColorBase.md).[addEventListener](IoColorBase.md#addeventlistener)

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

[IoColorBase](IoColorBase.md).[applyProperties](IoColorBase.md#applyproperties)

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

[IoColorBase](IoColorBase.md).[bind](IoColorBase.md#bind)

#### Defined in

[src/core/node.ts:319](https://github.com/io-gui/io/blob/main/src/core/node.ts#L319)

___

### changed

▸ **changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

[IoColorBase](IoColorBase.md).[changed](IoColorBase.md#changed)

#### Defined in

[src/elements/color/io-color-rgba.ts:42](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-rgba.ts#L42)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[connectedCallback](IoColorBase.md#connectedcallback)

#### Defined in

[src/core/element.ts:213](https://github.com/io-gui/io/blob/main/src/core/element.ts#L213)

___

### disabledChanged

▸ **disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[disabledChanged](IoColorBase.md#disabledchanged)

#### Defined in

[src/core/element.ts:429](https://github.com/io-gui/io/blob/main/src/core/element.ts#L429)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[disconnectedCallback](IoColorBase.md#disconnectedcallback)

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

[IoColorBase](IoColorBase.md).[dispatchEvent](IoColorBase.md#dispatchevent)

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

[IoColorBase](IoColorBase.md).[dispatchMutationEvent](IoColorBase.md#dispatchmutationevent)

#### Defined in

[src/core/node.ts:384](https://github.com/io-gui/io/blob/main/src/core/node.ts#L384)

___

### dispatchQueue

▸ **dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[dispatchQueue](IoColorBase.md#dispatchqueue)

#### Defined in

[src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

___

### dispatchQueueSync

▸ **dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[dispatchQueueSync](IoColorBase.md#dispatchqueuesync)

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

[IoColorBase](IoColorBase.md).[dispose](IoColorBase.md#dispose)

#### Defined in

[src/core/node.ts:391](https://github.com/io-gui/io/blob/main/src/core/node.ts#L391)

___

### init

▸ **init**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[init](IoColorBase.md#init)

#### Defined in

[src/elements/color/io-color-base.ts:22](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L22)

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

[IoColorBase](IoColorBase.md).[inputValue](IoColorBase.md#inputvalue)

#### Defined in

[src/core/node.ts:234](https://github.com/io-gui/io/blob/main/src/core/node.ts#L234)

___

### labelChanged

▸ **labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[labelChanged](IoColorBase.md#labelchanged)

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

[IoColorBase](IoColorBase.md).[objectMutated](IoColorBase.md#objectmutated)

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

[IoColorBase](IoColorBase.md).[onObjectMutated](IoColorBase.md#onobjectmutated)

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

[IoColorBase](IoColorBase.md).[queue](IoColorBase.md#queue)

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

[IoColorBase](IoColorBase.md).[removeEventListener](IoColorBase.md#removeeventlistener)

#### Defined in

[src/core/node.ts:367](https://github.com/io-gui/io/blob/main/src/core/node.ts#L367)

___

### rgbFromCmyk

▸ **rgbFromCmyk**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[rgbFromCmyk](IoColorBase.md#rgbfromcmyk)

#### Defined in

[src/elements/color/io-color-base.ts:50](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L50)

___

### rgbFromHsl

▸ **rgbFromHsl**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[rgbFromHsl](IoColorBase.md#rgbfromhsl)

#### Defined in

[src/elements/color/io-color-base.ts:40](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L40)

___

### rgbFromHsv

▸ **rgbFromHsv**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[rgbFromHsv](IoColorBase.md#rgbfromhsv)

#### Defined in

[src/elements/color/io-color-base.ts:30](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L30)

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

[IoColorBase](IoColorBase.md).[setAttribute](IoColorBase.md#setattribute)

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

[IoColorBase](IoColorBase.md).[setProperties](IoColorBase.md#setproperties)

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

[IoColorBase](IoColorBase.md).[setProperty](IoColorBase.md#setproperty)

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

[IoColorBase](IoColorBase.md).[template](IoColorBase.md#template)

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

[IoColorBase](IoColorBase.md).[throttle](IoColorBase.md#throttle)

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

[IoColorBase](IoColorBase.md).[traverse](IoColorBase.md#traverse)

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

[IoColorBase](IoColorBase.md).[unbind](IoColorBase.md#unbind)

#### Defined in

[src/core/node.ts:336](https://github.com/io-gui/io/blob/main/src/core/node.ts#L336)

___

### valueChanged

▸ **valueChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[valueChanged](IoColorBase.md#valuechanged)

#### Defined in

[src/elements/color/io-color-base.ts:67](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L67)

___

### valueFromRgb

▸ **valueFromRgb**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[valueFromRgb](IoColorBase.md#valuefromrgb)

#### Defined in

[src/elements/color/io-color-base.ts:61](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L61)

___

### valueMutated

▸ **valueMutated**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[valueMutated](IoColorBase.md#valuemutated)

#### Defined in

[src/elements/color/io-color-base.ts:26](https://github.com/io-gui/io/blob/main/src/elements/color/io-color-base.ts#L26)
