# Class: IoColorPanel

Input element for color displayed as a set of sliders.

<io-element-demo element="io-color-panel"
width= "192px"
height= "128px"
properties='{"mode": 0, "value": [1, 0.5, 0, 1], "horizontal": true}'
config='{"value": ["io-properties"], "mode": ["io-option-menu", {"options": [{"value": 0, "label": "0 - rgb"}, {"value": 1, "label": "1 - hsv"}, {"value": 2, "label": "2 - hsl"}, {"value": 3, "label": "3 - cmyk"}]}]}
'></io-element-demo>

This element has a singleton instance `IoColorPanelSingleton` used by `IoColorPicker` and other elements.

## Hierarchy

- [`IoColorBase`](IoColorBase.md)

  ↳ **`IoColorPanel`**

## Constructors

### constructor

**new IoColorPanel**(...`args`)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Inherited from

[IoColorBase](IoColorBase.md).[constructor](IoColorBase.md#constructor)

#### Defined in

[src/core/node.ts:64](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L64)

## Properties

### $

 **$**: `Record`<`string`, `any`\>

#### Inherited from

[IoColorBase](IoColorBase.md).[$](IoColorBase.md#$)

#### Defined in

[src/core/element.ts:232](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L232)

___

### \_bindings

 `Readonly` **\_bindings**: `Map`<`string`, [`Binding`](Binding.md)\>

#### Inherited from

[IoColorBase](IoColorBase.md).[_bindings](IoColorBase.md#_bindings)

#### Defined in

[src/core/node.ts:55](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L55)

___

### \_changeQueue

 `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoColorBase](IoColorBase.md).[_changeQueue](IoColorBase.md#_changequeue)

#### Defined in

[src/core/node.ts:56](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L56)

___

### \_eventDispatcher

 `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoColorBase](IoColorBase.md).[_eventDispatcher](IoColorBase.md#_eventdispatcher)

#### Defined in

[src/core/node.ts:57](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L57)

___

### \_properties

 `Readonly` **\_properties**: `Map`<`string`, [`PropertyInstance`](PropertyInstance.md)\>

#### Inherited from

[IoColorBase](IoColorBase.md).[_properties](IoColorBase.md#_properties)

#### Defined in

[src/core/node.ts:54](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L54)

___

### \_protochain

 `Readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

#### Inherited from

[IoColorBase](IoColorBase.md).[_protochain](IoColorBase.md#_protochain)

#### Defined in

[src/core/node.ts:53](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L53)

___

### class

 **class**: `string`

#### Inherited from

[IoColorBase](IoColorBase.md).[class](IoColorBase.md#class)

#### Defined in

[src/core/element.ts:241](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L241)

___

### cmyk

 **cmyk**: [`number`, `number`, `number`, `number`]

#### Inherited from

[IoColorBase](IoColorBase.md).[cmyk](IoColorBase.md#cmyk)

#### Defined in

[src/elements/color/io-color-base.ts:20](https://github.com/io-gui/iogui/blob/main/src/elements/color/io-color-base.ts#L20)

___

### contenteditable

 **contenteditable**: `boolean`

#### Inherited from

[IoColorBase](IoColorBase.md).[contenteditable](IoColorBase.md#contenteditable)

#### Defined in

[src/core/element.ts:238](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L238)

___

### d

 **d**: `boolean` = `true`

#### Inherited from

[IoColorBase](IoColorBase.md).[d](IoColorBase.md#d)

#### Defined in

[src/core/node.ts:59](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L59)

___

### disabled

 **disabled**: `boolean`

#### Inherited from

[IoColorBase](IoColorBase.md).[disabled](IoColorBase.md#disabled)

#### Defined in

[src/core/element.ts:262](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L262)

___

### expanded

 **expanded**: `boolean`

#### Defined in

[src/elements/color/io-color-panel.ts:58](https://github.com/io-gui/iogui/blob/main/src/elements/color/io-color-panel.ts#L58)

___

### hidden

 **hidden**: `boolean`

#### Inherited from

[IoColorBase](IoColorBase.md).[hidden](IoColorBase.md#hidden)

#### Defined in

[src/core/element.ts:259](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L259)

___

### hsl

 **hsl**: [`number`, `number`, `number`]

#### Inherited from

[IoColorBase](IoColorBase.md).[hsl](IoColorBase.md#hsl)

#### Defined in

[src/elements/color/io-color-base.ts:17](https://github.com/io-gui/iogui/blob/main/src/elements/color/io-color-base.ts#L17)

___

### hsv

 **hsv**: [`number`, `number`, `number`]

#### Inherited from

[IoColorBase](IoColorBase.md).[hsv](IoColorBase.md#hsv)

#### Defined in

[src/elements/color/io-color-base.ts:14](https://github.com/io-gui/iogui/blob/main/src/elements/color/io-color-base.ts#L14)

___

### id

 **id**: `string`

#### Inherited from

[IoColorBase](IoColorBase.md).[id](IoColorBase.md#id)

#### Defined in

[src/core/element.ts:256](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L256)

___

### label

 **label**: `string`

#### Inherited from

[IoColorBase](IoColorBase.md).[label](IoColorBase.md#label)

#### Defined in

[src/core/element.ts:247](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L247)

___

### name

 **name**: `string`

#### Inherited from

[IoColorBase](IoColorBase.md).[name](IoColorBase.md#name)

#### Defined in

[src/core/element.ts:250](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L250)

___

### rgba

 **rgba**: [`number`, `number`, `number`, `number`]

#### Inherited from

[IoColorBase](IoColorBase.md).[rgba](IoColorBase.md#rgba)

#### Defined in

[src/elements/color/io-color-base.ts:11](https://github.com/io-gui/iogui/blob/main/src/elements/color/io-color-base.ts#L11)

___

### role

 **role**: `string`

#### Inherited from

[IoColorBase](IoColorBase.md).[role](IoColorBase.md#role)

#### Defined in

[src/core/element.ts:244](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L244)

___

### tabindex

 **tabindex**: `string`

#### Inherited from

[IoColorBase](IoColorBase.md).[tabindex](IoColorBase.md#tabindex)

#### Defined in

[src/core/element.ts:235](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L235)

___

### title

 **title**: `string`

#### Inherited from

[IoColorBase](IoColorBase.md).[title](IoColorBase.md#title)

#### Defined in

[src/core/element.ts:253](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L253)

___

### value

 **value**: `Object`

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

[src/elements/color/io-color-base.ts:8](https://github.com/io-gui/iogui/blob/main/src/elements/color/io-color-base.ts#L8)

___

### vertical

 **vertical**: `boolean`

#### Defined in

[src/elements/color/io-color-panel.ts:61](https://github.com/io-gui/iogui/blob/main/src/elements/color/io-color-panel.ts#L61)

## Accessors

### textNode

`get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoColorBase.textNode

#### Defined in

[src/core/element.ts:388](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L388)

`set` **textNode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

IoColorBase.textNode

#### Defined in

[src/core/element.ts:392](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L392)

___

### Listeners

`Static` `get` **Listeners**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `keydown` | `string` |

#### Defined in

[src/elements/color/io-color-panel.ts:63](https://github.com/io-gui/iogui/blob/main/src/elements/color/io-color-panel.ts#L63)

___

### Properties

`Static` `get` **Properties**(): [`PropertyDeclarations`](../README.md#propertydeclarations)

#### Returns

[`PropertyDeclarations`](../README.md#propertydeclarations)

#### Inherited from

IoColorBase.Properties

#### Defined in

[src/core/node.ts:44](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L44)

___

### Style

`Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoColorBase.Style

#### Defined in

[src/elements/color/io-color-panel.ts:21](https://github.com/io-gui/iogui/blob/main/src/elements/color/io-color-panel.ts#L21)

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

[IoColorBase](IoColorBase.md).[_flattenTextNode](IoColorBase.md#_flattentextnode)

#### Defined in

[src/core/element.ts:371](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L371)

___

### \_onKeydown

**_onKeydown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `KeyboardEvent` |

#### Returns

`void`

#### Defined in

[src/elements/color/io-color-panel.ts:68](https://github.com/io-gui/iogui/blob/main/src/elements/color/io-color-panel.ts#L68)

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

[IoColorBase](IoColorBase.md).[addEventListener](IoColorBase.md#addeventlistener)

#### Defined in

[src/core/node.ts:362](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L362)

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

[IoColorBase](IoColorBase.md).[applyProperties](IoColorBase.md#applyproperties)

#### Defined in

[src/core/element.ts:396](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L396)

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

[IoColorBase](IoColorBase.md).[bind](IoColorBase.md#bind)

#### Defined in

[src/core/node.ts:331](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L331)

___

### changed

**changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

[IoColorBase](IoColorBase.md).[changed](IoColorBase.md#changed)

#### Defined in

[src/elements/color/io-color-panel.ts:77](https://github.com/io-gui/iogui/blob/main/src/elements/color/io-color-panel.ts#L77)

___

### connectedCallback

**connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[connectedCallback](IoColorBase.md#connectedcallback)

#### Defined in

[src/core/element.ts:267](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L267)

___

### disabledChanged

**disabledChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[disabledChanged](IoColorBase.md#disabledchanged)

#### Defined in

[src/core/element.ts:425](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L425)

___

### disconnectedCallback

**disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[disconnectedCallback](IoColorBase.md#disconnectedcallback)

#### Defined in

[src/core/element.ts:275](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L275)

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

[IoColorBase](IoColorBase.md).[dispatchEvent](IoColorBase.md#dispatchevent)

#### Defined in

[src/core/node.ts:387](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L387)

___

### dispatchQueue

**dispatchQueue**(): `void`

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[dispatchQueue](IoColorBase.md#dispatchqueue)

#### Defined in

[src/core/node.ts:273](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L273)

___

### dispatchQueueSync

**dispatchQueueSync**(): `void`

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[dispatchQueueSync](IoColorBase.md#dispatchqueuesync)

#### Defined in

[src/core/node.ts:283](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L283)

___

### dispose

**dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[dispose](IoColorBase.md#dispose)

#### Defined in

[src/core/node.ts:394](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L394)

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

[IoColorBase](IoColorBase.md).[disposeDeep](IoColorBase.md#disposedeep)

#### Defined in

[src/core/element.ts:291](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L291)

___

### init

**init**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[init](IoColorBase.md#init)

#### Defined in

[src/elements/color/io-color-base.ts:22](https://github.com/io-gui/iogui/blob/main/src/elements/color/io-color-base.ts#L22)

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

[IoColorBase](IoColorBase.md).[inputValue](IoColorBase.md#inputvalue)

#### Defined in

[src/core/node.ts:248](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L248)

___

### labelChanged

**labelChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[labelChanged](IoColorBase.md#labelchanged)

#### Defined in

[src/core/element.ts:418](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L418)

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

[IoColorBase](IoColorBase.md).[objectMutated](IoColorBase.md#objectmutated)

#### Defined in

[src/core/node.ts:322](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L322)

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

[IoColorBase](IoColorBase.md).[onObjectMutated](IoColorBase.md#onobjectmutated)

#### Defined in

[src/core/node.ts:301](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L301)

___

### onValueSet

**onValueSet**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/color/io-color-panel.ts:74](https://github.com/io-gui/iogui/blob/main/src/elements/color/io-color-panel.ts#L74)

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

[IoColorBase](IoColorBase.md).[queue](IoColorBase.md#queue)

#### Defined in

[src/core/node.ts:267](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L267)

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

[IoColorBase](IoColorBase.md).[removeEventListener](IoColorBase.md#removeeventlistener)

#### Defined in

[src/core/node.ts:377](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L377)

___

### rgbFromCmyk

**rgbFromCmyk**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[rgbFromCmyk](IoColorBase.md#rgbfromcmyk)

#### Defined in

[src/elements/color/io-color-base.ts:50](https://github.com/io-gui/iogui/blob/main/src/elements/color/io-color-base.ts#L50)

___

### rgbFromHsl

**rgbFromHsl**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[rgbFromHsl](IoColorBase.md#rgbfromhsl)

#### Defined in

[src/elements/color/io-color-base.ts:40](https://github.com/io-gui/iogui/blob/main/src/elements/color/io-color-base.ts#L40)

___

### rgbFromHsv

**rgbFromHsv**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[rgbFromHsv](IoColorBase.md#rgbfromhsv)

#### Defined in

[src/elements/color/io-color-base.ts:30](https://github.com/io-gui/iogui/blob/main/src/elements/color/io-color-base.ts#L30)

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

[IoColorBase](IoColorBase.md).[setAttribute](IoColorBase.md#setattribute)

#### Defined in

[src/core/element.ts:409](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L409)

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

[IoColorBase](IoColorBase.md).[setProperties](IoColorBase.md#setproperties)

#### Defined in

[src/core/node.ts:230](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L230)

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

[IoColorBase](IoColorBase.md).[setProperty](IoColorBase.md#setproperty)

#### Defined in

[src/core/node.ts:131](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L131)

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

[IoColorBase](IoColorBase.md).[template](IoColorBase.md#template)

#### Defined in

[src/core/element.ts:285](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L285)

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

[IoColorBase](IoColorBase.md).[throttle](IoColorBase.md#throttle)

#### Defined in

[src/core/node.ts:292](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L292)

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

[IoColorBase](IoColorBase.md).[traverse](IoColorBase.md#traverse)

#### Defined in

[src/core/element.ts:315](https://github.com/io-gui/iogui/blob/main/src/core/element.ts#L315)

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

[IoColorBase](IoColorBase.md).[unbind](IoColorBase.md#unbind)

#### Defined in

[src/core/node.ts:346](https://github.com/io-gui/iogui/blob/main/src/core/node.ts#L346)

___

### valueChanged

**valueChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[valueChanged](IoColorBase.md#valuechanged)

#### Defined in

[src/elements/color/io-color-base.ts:67](https://github.com/io-gui/iogui/blob/main/src/elements/color/io-color-base.ts#L67)

___

### valueFromRgb

**valueFromRgb**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[valueFromRgb](IoColorBase.md#valuefromrgb)

#### Defined in

[src/elements/color/io-color-base.ts:61](https://github.com/io-gui/iogui/blob/main/src/elements/color/io-color-base.ts#L61)

___

### valueMutated

**valueMutated**(): `void`

#### Returns

`void`

#### Inherited from

[IoColorBase](IoColorBase.md).[valueMutated](IoColorBase.md#valuemutated)

#### Defined in

[src/elements/color/io-color-base.ts:26](https://github.com/io-gui/iogui/blob/main/src/elements/color/io-color-base.ts#L26)
