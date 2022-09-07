# Class: IoSlider

Core `IoElement` class.

## Hierarchy

- [`IoGl`](IoGl.md)

  ↳ **`IoSlider`**

  ↳↳ [`IoSliderRange`](IoSliderRange.md)

## Constructors

### constructor

• **new IoSlider**(`properties?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | `Record`<`string`, `any`\> |

#### Inherited from

[IoGl](IoGl.md).[constructor](IoGl.md#constructor)

#### Defined in

[src/elements/core/gl.ts:214](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L214)

## Properties

### \_bindings

• `Readonly` **\_bindings**: `Record`<`string`, [`Binding`](Binding.md)\> = `{}`

#### Inherited from

[IoGl](IoGl.md).[_bindings](IoGl.md#_bindings)

#### Defined in

[src/core/io-node.ts:49](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L49)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoGl](IoGl.md).[_changeQueue](IoGl.md#_changequeue)

#### Defined in

[src/core/io-node.ts:51](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L51)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoGl](IoGl.md).[_eventDispatcher](IoGl.md#_eventdispatcher)

#### Defined in

[src/core/io-node.ts:52](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L52)

___

### \_properties

• `Readonly` **\_properties**: `Record`<`string`, [`Property`](Property.md)\> = `{}`

#### Inherited from

[IoGl](IoGl.md).[_properties](IoGl.md#_properties)

#### Defined in

[src/core/io-node.ts:48](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L48)

___

### css

• **css**: `IoTheme`

#### Inherited from

[IoGl](IoGl.md).[css](IoGl.md#css)

#### Defined in

[src/elements/core/gl.ts:213](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L213)

## Accessors

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoGl.textNode

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

IoGl.textNode

#### Defined in

[src/core/io-element.ts:211](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L211)

___

### Frag

• `Static` `get` **Frag**(): `string`

#### Returns

`string`

#### Overrides

IoGl.Frag

#### Defined in

[src/elements/core/slider.ts:260](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L260)

___

### GlUtils

• `Static` `get` **GlUtils**(): `string`

#### Returns

`string`

#### Overrides

IoGl.GlUtils

#### Defined in

[src/elements/core/slider.ts:223](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L223)

___

### Listeners

• `Static` `get` **Listeners**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `contextmenu` | `string` |
| `focus` | `string` |
| `pointerdown` | `string` |
| `touchstart` | `string` |

#### Overrides

IoGl.Listeners

#### Defined in

[src/elements/core/slider.ts:62](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L62)

___

### Properties

• `Static` `get` **Properties**(): `any`

#### Returns

`any`

#### Overrides

IoGl.Properties

#### Defined in

[src/elements/core/slider.ts:45](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L45)

___

### Style

• `Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoGl.Style

#### Defined in

[src/elements/core/slider.ts:16](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L16)

___

### Vert

• `Static` `get` **Vert**(): `string`

#### Returns

`string`

#### Inherited from

IoGl.Vert

#### Defined in

[src/elements/core/gl.ts:90](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L90)

___

### observedAttributes

• `Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoGl.observedAttributes

#### Defined in

[src/core/io-element.ts:65](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L65)

## Methods

### \_getCoordFromValue

▸ **_getCoordFromValue**(`value`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`number`

#### Defined in

[src/elements/core/slider.ts:134](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L134)

___

### \_getPointerCoord

▸ **_getPointerCoord**(`event`): `number`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`number`[]

#### Defined in

[src/elements/core/slider.ts:123](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L123)

___

### \_getValueFromCoord

▸ **_getValueFromCoord**(`coord`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `coord` | `number` |

#### Returns

`number`

#### Defined in

[src/elements/core/slider.ts:129](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L129)

___

### \_onBlur

▸ **_onBlur**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:74](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L74)

___

### \_onContextmenu

▸ **_onContextmenu**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Event` |

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:78](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L78)

___

### \_onFocus

▸ **_onFocus**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:70](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L70)

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

[IoGl](IoGl.md).[_onFocusTo](IoGl.md#_onfocusto)

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

#### Defined in

[src/elements/core/slider.ts:150](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L150)

___

### \_onPointerdown

▸ **_onPointerdown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:109](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L109)

___

### \_onPointermove

▸ **_onPointermove**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:114](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L114)

___

### \_onPointermoveThrottled

▸ **_onPointermoveThrottled**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:137](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L137)

___

### \_onPointerup

▸ **_onPointerup**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:118](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L118)

___

### \_onRender

▸ **_onRender**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[_onRender](IoGl.md#_onrender)

#### Defined in

[src/elements/core/gl.ts:303](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L303)

___

### \_onTouchend

▸ **_onTouchend**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:105](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L105)

___

### \_onTouchmove

▸ **_onTouchmove**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `TouchEvent` |

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:88](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L88)

___

### \_onTouchstart

▸ **_onTouchstart**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `TouchEvent` |

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:81](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L81)

___

### \_setDecrease

▸ **_setDecrease**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:196](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L196)

___

### \_setIncrease

▸ **_setIncrease**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:191](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L191)

___

### \_setMax

▸ **_setMax**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:206](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L206)

___

### \_setMin

▸ **_setMin**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:201](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L201)

___

### \_setValue

▸ **_setValue**(`x`, `y?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y?` | `number` |

#### Returns

`void`

#### Defined in

[src/elements/core/slider.ts:147](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L147)

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

[IoGl](IoGl.md).[addEventListener](IoGl.md#addeventlistener)

#### Defined in

[src/core/io-node.ts:338](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L338)

___

### applyAria

▸ **applyAria**(): `void`

Sets aria attributes.

#### Returns

`void`

#### Overrides

[IoGl](IoGl.md).[applyAria](IoGl.md#applyaria)

#### Defined in

[src/elements/core/slider.ts:215](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L215)

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

[IoGl](IoGl.md).[applyProperties](IoGl.md#applyproperties)

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

[IoGl](IoGl.md).[attributeChangedCallback](IoGl.md#attributechangedcallback)

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

[IoGl](IoGl.md).[bind](IoGl.md#bind)

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

[IoGl](IoGl.md).[changed](IoGl.md#changed)

#### Defined in

[src/elements/core/slider.ts:212](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L212)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[connectedCallback](IoGl.md#connectedcallback)

#### Defined in

[src/core/io-element.ts:93](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L93)

___

### cssMutated

▸ **cssMutated**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[cssMutated](IoGl.md#cssmutated)

#### Defined in

[src/elements/core/gl.ts:288](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L288)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[disconnectedCallback](IoGl.md#disconnectedcallback)

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

[IoGl](IoGl.md).[dispatchEvent](IoGl.md#dispatchevent)

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

[IoGl](IoGl.md).[dispose](IoGl.md#dispose)

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

[IoGl](IoGl.md).[filterObject](IoGl.md#filterobject)

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

[IoGl](IoGl.md).[filterObjects](IoGl.md#filterobjects)

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

[IoGl](IoGl.md).[flattenTextNode](IoGl.md#flattentextnode)

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

[IoGl](IoGl.md).[focusTo](IoGl.md#focusto)

#### Defined in

[src/core/io-element.ts:359](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L359)

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

[IoGl](IoGl.md).[import](IoGl.md#import)

#### Defined in

[src/core/io-node.ts:426](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L426)

___

### initPropertyUniform

▸ **initPropertyUniform**(`name`, `property`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `property` | [`Property`](Property.md) |

#### Returns

`string`

#### Inherited from

[IoGl](IoGl.md).[initPropertyUniform](IoGl.md#initpropertyuniform)

#### Defined in

[src/elements/core/gl.ts:145](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L145)

___

### initShader

▸ **initShader**(): `WebGLProgram`

#### Returns

`WebGLProgram`

#### Inherited from

[IoGl](IoGl.md).[initShader](IoGl.md#initshader)

#### Defined in

[src/elements/core/gl.ts:161](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L161)

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

[IoGl](IoGl.md).[objectMutated](IoGl.md#objectmutated)

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

[IoGl](IoGl.md).[objectMutatedThrottled](IoGl.md#objectmutatedthrottled)

#### Defined in

[src/core/io-node.ts:302](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L302)

___

### onResized

▸ **onResized**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[onResized](IoGl.md#onresized)

#### Defined in

[src/elements/core/gl.ts:261](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L261)

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

[IoGl](IoGl.md).[preventDefault](IoGl.md#preventdefault)

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

[IoGl](IoGl.md).[queue](IoGl.md#queue)

#### Defined in

[src/core/io-node.ts:248](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L248)

___

### queueDispatch

▸ **queueDispatch**(): `void`

Dispatches the queue.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[queueDispatch](IoGl.md#queuedispatch)

#### Defined in

[src/core/io-node.ts:254](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L254)

___

### queueDispatchLazy

▸ **queueDispatchLazy**(): `void`

Dispatches the queue in the next rAF cycle.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[queueDispatchLazy](IoGl.md#queuedispatchlazy)

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

[IoGl](IoGl.md).[removeEventListener](IoGl.md#removeeventlistener)

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

[IoGl](IoGl.md).[requestAnimationFrameOnce](IoGl.md#requestanimationframeonce)

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

[IoGl](IoGl.md).[setAttribute](IoGl.md#setattribute)

#### Defined in

[src/core/io-element.ts:228](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L228)

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

[IoGl](IoGl.md).[setProperties](IoGl.md#setproperties)

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

[IoGl](IoGl.md).[setProperty](IoGl.md#setproperty)

#### Defined in

[src/core/io-node.ts:110](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L110)

___

### setShaderProgram

▸ **setShaderProgram**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[setShaderProgram](IoGl.md#setshaderprogram)

#### Defined in

[src/elements/core/gl.ts:331](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L331)

___

### setUniform

▸ **setUniform**(`name`, `type`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `type` | `UniformTypes` |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[setUniform](IoGl.md#setuniform)

#### Defined in

[src/elements/core/gl.ts:348](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L348)

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

[IoGl](IoGl.md).[setValue](IoGl.md#setvalue)

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

[IoGl](IoGl.md).[stopPropagation](IoGl.md#stoppropagation)

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

[IoGl](IoGl.md).[template](IoGl.md#template)

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

[IoGl](IoGl.md).[throttle](IoGl.md#throttle)

#### Defined in

[src/core/io-node.ts:372](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L372)

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

[IoGl](IoGl.md).[traverse](IoGl.md#traverse)

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

[IoGl](IoGl.md).[unbind](IoGl.md#unbind)

#### Defined in

[src/core/io-node.ts:324](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L324)

___

### updateCssUniforms

▸ **updateCssUniforms**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[updateCssUniforms](IoGl.md#updatecssuniforms)

#### Defined in

[src/elements/core/gl.ts:343](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L343)

___

### updatePropertyUniform

▸ **updatePropertyUniform**(`name`, `property`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `property` | [`Property`](Property.md) |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[updatePropertyUniform](IoGl.md#updatepropertyuniform)

#### Defined in

[src/elements/core/gl.ts:337](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L337)
