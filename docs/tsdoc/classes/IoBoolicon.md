# Class: IoBoolicon

Core `IoElement` class.

## Hierarchy

- [`IoBoolean`](IoBoolean.md)

  ↳ **`IoBoolicon`**

## Constructors

### constructor

• **new IoBoolicon**(`properties?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | `Record`<`string`, `any`\> |

#### Inherited from

[IoBoolean](IoBoolean.md).[constructor](IoBoolean.md#constructor)

#### Defined in

[src/elements/core/item.ts:55](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L55)

## Properties

### \_bindings

• `Readonly` **\_bindings**: `Record`<`string`, [`Binding`](Binding.md)\> = `{}`

#### Inherited from

[IoBoolean](IoBoolean.md).[_bindings](IoBoolean.md#_bindings)

#### Defined in

[src/core/io-node.ts:49](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L49)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoBoolean](IoBoolean.md).[_changeQueue](IoBoolean.md#_changequeue)

#### Defined in

[src/core/io-node.ts:51](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L51)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoBoolean](IoBoolean.md).[_eventDispatcher](IoBoolean.md#_eventdispatcher)

#### Defined in

[src/core/io-node.ts:52](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L52)

___

### \_properties

• `Readonly` **\_properties**: `Record`<`string`, [`Property`](Property.md)\> = `{}`

#### Inherited from

[IoBoolean](IoBoolean.md).[_properties](IoBoolean.md#_properties)

#### Defined in

[src/core/io-node.ts:48](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L48)

## Accessors

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoBoolean.textNode

#### Defined in

[src/core/io-element.ts:207](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L207)

• `set` **textNode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

IoBoolean.textNode

#### Defined in

[src/core/io-element.ts:211](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L211)

___

### Listeners

• `Static` `get` **Listeners**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `click` | `string` |
| `focus` | `string` |
| `pointerdown` | `string` |

#### Inherited from

IoBoolean.Listeners

#### Defined in

[src/elements/core/item.ts:48](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L48)

___

### Properties

• `Static` `get` **Properties**(): `any`

#### Returns

`any`

#### Overrides

IoBoolean.Properties

#### Defined in

[src/elements/core/boolicon.ts:40](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolicon.ts#L40)

___

### Style

• `Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoBoolean.Style

#### Defined in

[src/elements/core/boolicon.ts:14](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolicon.ts#L14)

___

### observedAttributes

• `Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoBoolean.observedAttributes

#### Defined in

[src/core/io-element.ts:65](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L65)

## Methods

### \_onBlur

▸ **_onBlur**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `FocusEvent` |

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[_onBlur](IoBoolean.md#_onblur)

#### Defined in

[src/elements/core/item.ts:65](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L65)

___

### \_onClick

▸ **_onClick**(): `void`

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[_onClick](IoBoolean.md#_onclick)

#### Defined in

[src/elements/core/boolean.ts:33](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L33)

___

### \_onFocus

▸ **_onFocus**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `FocusEvent` |

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[_onFocus](IoBoolean.md#_onfocus)

#### Defined in

[src/elements/core/item.ts:60](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L60)

___

### \_onFocusTo

▸ **_onFocusTo**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`<`any`\> |

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[_onFocusTo](IoBoolean.md#_onfocusto)

#### Defined in

[src/core/io-element.ts:252](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L252)

___

### \_onKeydown

▸ **_onKeydown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `KeyboardEvent` |

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[_onKeydown](IoBoolean.md#_onkeydown)

#### Defined in

[src/elements/core/item.ts:91](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L91)

___

### \_onKeyup

▸ **_onKeyup**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `KeyboardEvent` |

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[_onKeyup](IoBoolean.md#_onkeyup)

#### Defined in

[src/elements/core/item.ts:110](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L110)

___

### \_onPointerdown

▸ **_onPointerdown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[_onPointerdown](IoBoolean.md#_onpointerdown)

#### Defined in

[src/elements/core/item.ts:70](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L70)

___

### \_onPointerleave

▸ **_onPointerleave**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[_onPointerleave](IoBoolean.md#_onpointerleave)

#### Defined in

[src/elements/core/item.ts:77](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L77)

___

### \_onPointermove

▸ **_onPointermove**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[_onPointermove](IoBoolean.md#_onpointermove)

#### Defined in

[src/elements/core/item.ts:76](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L76)

___

### \_onPointerup

▸ **_onPointerup**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[_onPointerup](IoBoolean.md#_onpointerup)

#### Defined in

[src/elements/core/item.ts:82](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L82)

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

[IoBoolean](IoBoolean.md).[addEventListener](IoBoolean.md#addeventlistener)

#### Defined in

[src/core/io-node.ts:338](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L338)

___

### applyAria

▸ **applyAria**(): `void`

Sets aria attributes.

#### Returns

`void`

#### Overrides

[IoBoolean](IoBoolean.md).[applyAria](IoBoolean.md#applyaria)

#### Defined in

[src/elements/core/boolicon.ts:54](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolicon.ts#L54)

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

[IoBoolean](IoBoolean.md).[applyProperties](IoBoolean.md#applyproperties)

#### Defined in

[src/core/io-element.ts:215](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L215)

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

#### Inherited from

[IoBoolean](IoBoolean.md).[attributeChangedCallback](IoBoolean.md#attributechangedcallback)

#### Defined in

[src/core/io-element.ts:75](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L75)

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

[IoBoolean](IoBoolean.md).[bind](IoBoolean.md#bind)

#### Defined in

[src/core/io-node.ts:311](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L311)

___

### changed

▸ **changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Overrides

[IoBoolean](IoBoolean.md).[changed](IoBoolean.md#changed)

#### Defined in

[src/elements/core/boolicon.ts:50](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolicon.ts#L50)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[connectedCallback](IoBoolean.md#connectedcallback)

#### Defined in

[src/core/io-element.ts:93](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L93)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[disconnectedCallback](IoBoolean.md#disconnectedcallback)

#### Defined in

[src/core/io-element.ts:102](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L102)

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

[IoBoolean](IoBoolean.md).[dispatchEvent](IoBoolean.md#dispatchevent)

#### Defined in

[src/core/io-node.ts:363](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L363)

___

### dispose

▸ **dispose**(): `void`

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[dispose](IoBoolean.md#dispose)

#### Defined in

[src/core/io-node.ts:219](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L219)

___

### filterObject

▸ **filterObject**(`object`, `predicate`, `_depth?`, `_chain?`, `_i?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `object` | `any` | `undefined` |
| `predicate` | [`PredicateFunction`](../README.md#predicatefunction) | `undefined` |
| `_depth` | `number` | `5` |
| `_chain` | `any`[] | `[]` |
| `_i` | `number` | `0` |

#### Returns

`any`

#### Inherited from

[IoBoolean](IoBoolean.md).[filterObject](IoBoolean.md#filterobject)

#### Defined in

[src/core/io-node.ts:396](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L396)

___

### filterObjects

▸ **filterObjects**(`object`, `predicate`, `_depth?`, `_chain?`, `_i?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `object` | `any` | `undefined` |
| `predicate` | [`PredicateFunction`](../README.md#predicatefunction) | `undefined` |
| `_depth` | `number` | `5` |
| `_chain` | `any`[] | `[]` |
| `_i` | `number` | `0` |

#### Returns

`any`

#### Inherited from

[IoBoolean](IoBoolean.md).[filterObjects](IoBoolean.md#filterobjects)

#### Defined in

[src/core/io-node.ts:409](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L409)

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

#### Inherited from

[IoBoolean](IoBoolean.md).[flattenTextNode](IoBoolean.md#flattentextnode)

#### Defined in

[src/core/io-element.ts:190](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L190)

___

### focusTo

▸ **focusTo**(`dir`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dir` | `string` |

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[focusTo](IoBoolean.md#focusto)

#### Defined in

[src/core/io-element.ts:359](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L359)

___

### getCaretPosition

▸ **getCaretPosition**(): `number`

#### Returns

`number`

#### Inherited from

[IoBoolean](IoBoolean.md).[getCaretPosition](IoBoolean.md#getcaretposition)

#### Defined in

[src/elements/core/item.ts:111](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L111)

___

### import

▸ **import**(`path`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`Promise`<`unknown`\>

#### Inherited from

[IoBoolean](IoBoolean.md).[import](IoBoolean.md#import)

#### Defined in

[src/core/io-node.ts:426](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L426)

___

### objectMutated

▸ **objectMutated**(`event`): `void`

Event handler for 'object-mutated' event emitted from the `window`.
Node should be listening for this event if it has an object property
with `observe: "sync" || "async"` configuration.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `CustomEvent`<`any`\> | Event payload. |

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[objectMutated](IoBoolean.md#objectmutated)

#### Defined in

[src/core/io-node.ts:275](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L275)

___

### objectMutatedThrottled

▸ **objectMutatedThrottled**(`prop`): `void`

This function is called after `objectMutated()` determines that one of
the object properties has mutated.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prop` | `string` | Mutated object property name. |

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[objectMutatedThrottled](IoBoolean.md#objectmutatedthrottled)

#### Defined in

[src/core/io-node.ts:302](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L302)

___

### preventDefault

▸ **preventDefault**(`event`): `void`

Handler function with `event.preventDefault()`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `Event` | Event object. |

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[preventDefault](IoBoolean.md#preventdefault)

#### Defined in

[src/core/io-node.ts:444](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L444)

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

[IoBoolean](IoBoolean.md).[queue](IoBoolean.md#queue)

#### Defined in

[src/core/io-node.ts:248](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L248)

___

### queueDispatch

▸ **queueDispatch**(): `void`

Dispatches the queue.

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[queueDispatch](IoBoolean.md#queuedispatch)

#### Defined in

[src/core/io-node.ts:254](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L254)

___

### queueDispatchLazy

▸ **queueDispatchLazy**(): `void`

Dispatches the queue in the next rAF cycle.

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[queueDispatchLazy](IoBoolean.md#queuedispatchlazy)

#### Defined in

[src/core/io-node.ts:265](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L265)

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

[IoBoolean](IoBoolean.md).[removeEventListener](IoBoolean.md#removeeventlistener)

#### Defined in

[src/core/io-node.ts:353](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L353)

___

### requestAnimationFrameOnce

▸ **requestAnimationFrameOnce**(`func`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `func` | [`CallbackFunction`](../README.md#callbackfunction) |

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[requestAnimationFrameOnce](IoBoolean.md#requestanimationframeonce)

#### Defined in

[src/core/io-node.ts:393](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L393)

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

[IoBoolean](IoBoolean.md).[setAttribute](IoBoolean.md#setattribute)

#### Defined in

[src/core/io-element.ts:228](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L228)

___

### setCaretPosition

▸ **setCaretPosition**(`position`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `number` |

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[setCaretPosition](IoBoolean.md#setcaretposition)

#### Defined in

[src/elements/core/item.ts:124](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L124)

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

[IoBoolean](IoBoolean.md).[setProperties](IoBoolean.md#setproperties)

#### Defined in

[src/core/io-node.ts:190](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L190)

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

[IoBoolean](IoBoolean.md).[setProperty](IoBoolean.md#setproperty)

#### Defined in

[src/core/io-node.ts:110](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L110)

___

### setValue

▸ **setValue**(`value`): `void`

Sets value property and emits `value-set` event.
Use this when value property is set by user action (e.g. mouse click).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | Property value. |

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[setValue](IoBoolean.md#setvalue)

#### Defined in

[src/core/io-node.ts:208](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L208)

___

### stopPropagation

▸ **stopPropagation**(`event`): `void`

Handler function with `event.stopPropagation()`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `CustomEvent`<`any`\> | Event object. |

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[stopPropagation](IoBoolean.md#stoppropagation)

#### Defined in

[src/core/io-node.ts:451](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L451)

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

#### Inherited from

[IoBoolean](IoBoolean.md).[template](IoBoolean.md#template)

#### Defined in

[src/core/io-element.ts:112](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L112)

___

### throttle

▸ **throttle**(`func`, `arg?`, `asynchronous?`): `void`

Throttles function execution to next frame (rAF) if the function has been executed in the current frame.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `func` | [`CallbackFunction`](../README.md#callbackfunction) | Function to throttle. |
| `arg?` | `any` | argument for throttled function. |
| `asynchronous?` | `boolean` | execute with timeout. |

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[throttle](IoBoolean.md#throttle)

#### Defined in

[src/core/io-node.ts:372](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L372)

___

### toggle

▸ **toggle**(): `void`

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[toggle](IoBoolean.md#toggle)

#### Defined in

[src/elements/core/boolean.ts:36](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L36)

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

#### Inherited from

[IoBoolean](IoBoolean.md).[traverse](IoBoolean.md#traverse)

#### Defined in

[src/core/io-element.ts:123](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L123)

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

[IoBoolean](IoBoolean.md).[unbind](IoBoolean.md#unbind)

#### Defined in

[src/core/io-node.ts:324](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L324)

___

### valueChanged

▸ **valueChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[valueChanged](IoBoolean.md#valuechanged)

#### Defined in

[src/elements/core/boolean.ts:39](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L39)
