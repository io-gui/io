# Class: IoSlider

## Hierarchy

- [`IoGl`](IoGl.md)

  ↳ **`IoSlider`**

  ↳↳ [`IoSliderRange`](IoSliderRange.md)

## Constructors

### constructor

• **new IoSlider**(`properties?`)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | `Record`<`string`, `any`\> |

#### Inherited from

[IoGl](IoGl.md).[constructor](IoGl.md#constructor)

#### Defined in

[elements/core/gl.ts:215](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L215)

## Properties

### \_bindings

• `Readonly` **\_bindings**: `Record`<`string`, [`Binding`](Binding.md)\> = `{}`

#### Inherited from

[IoGl](IoGl.md).[_bindings](IoGl.md#_bindings)

#### Defined in

[core/io-node.ts:69](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L69)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoGl](IoGl.md).[_changeQueue](IoGl.md#_changequeue)

#### Defined in

[core/io-node.ts:71](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L71)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoGl](IoGl.md).[_eventDispatcher](IoGl.md#_eventdispatcher)

#### Defined in

[core/io-node.ts:72](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L72)

___

### \_properties

• `Readonly` **\_properties**: `Record`<`string`, [`Property`](Property.md)\> = `{}`

#### Inherited from

[IoGl](IoGl.md).[_properties](IoGl.md#_properties)

#### Defined in

[core/io-node.ts:68](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L68)

___

### css

• **css**: `IoTheme`

#### Inherited from

[IoGl](IoGl.md).[css](IoGl.md#css)

#### Defined in

[elements/core/gl.ts:214](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L214)

## Accessors

### compose

• `get` **compose**(): `ComposedProperties`

`compose` object lets you reactively assign property values to other object's properties.
For example, you can assign `this.value` property to the `this.objectProp.result` property.

```
get compose () {
  return {
    objectProp: {result: this.value}
  };
 }
```

Node class does not use `compose` by itself but this feature is available to its sublasses.

#### Returns

`ComposedProperties`

#### Inherited from

IoGl.compose

#### Defined in

[core/io-node.ts:65](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L65)

___

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoGl.textNode

#### Defined in

[core/io-element.ts:214](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L214)

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

[core/io-element.ts:218](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L218)

___

### Frag

• `Static` `get` **Frag**(): `string`

#### Returns

`string`

#### Overrides

IoGl.Frag

#### Defined in

[elements/core/slider.ts:260](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L260)

___

### GlUtils

• `Static` `get` **GlUtils**(): `string`

#### Returns

`string`

#### Overrides

IoGl.GlUtils

#### Defined in

[elements/core/slider.ts:223](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L223)

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

[elements/core/slider.ts:62](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L62)

___

### Properties

• `Static` `get` **Properties**(): `any`

#### Returns

`any`

#### Overrides

IoGl.Properties

#### Defined in

[elements/core/slider.ts:45](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L45)

___

### Style

• `Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoGl.Style

#### Defined in

[elements/core/slider.ts:16](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L16)

___

### Vert

• `Static` `get` **Vert**(): `string`

#### Returns

`string`

#### Inherited from

IoGl.Vert

#### Defined in

[elements/core/gl.ts:91](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L91)

___

### observedAttributes

• `Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoGl.observedAttributes

#### Defined in

[core/io-element.ts:72](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L72)

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

[elements/core/slider.ts:134](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L134)

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

[elements/core/slider.ts:123](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L123)

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

[elements/core/slider.ts:129](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L129)

___

### \_onBlur

▸ **_onBlur**(): `void`

#### Returns

`void`

#### Defined in

[elements/core/slider.ts:74](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L74)

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

[elements/core/slider.ts:78](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L78)

___

### \_onFocus

▸ **_onFocus**(): `void`

#### Returns

`void`

#### Defined in

[elements/core/slider.ts:70](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L70)

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

[core/io-element.ts:263](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L263)

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

[elements/core/slider.ts:150](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L150)

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

[elements/core/slider.ts:109](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L109)

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

[elements/core/slider.ts:114](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L114)

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

[elements/core/slider.ts:137](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L137)

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

[elements/core/slider.ts:118](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L118)

___

### \_onTouchend

▸ **_onTouchend**(): `void`

#### Returns

`void`

#### Defined in

[elements/core/slider.ts:105](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L105)

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

[elements/core/slider.ts:88](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L88)

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

[elements/core/slider.ts:81](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L81)

___

### \_render

▸ **_render**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[_render](IoGl.md#_render)

#### Defined in

[elements/core/gl.ts:305](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L305)

___

### \_setDecrease

▸ **_setDecrease**(): `void`

#### Returns

`void`

#### Defined in

[elements/core/slider.ts:196](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L196)

___

### \_setIncrease

▸ **_setIncrease**(): `void`

#### Returns

`void`

#### Defined in

[elements/core/slider.ts:191](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L191)

___

### \_setMax

▸ **_setMax**(): `void`

#### Returns

`void`

#### Defined in

[elements/core/slider.ts:206](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L206)

___

### \_setMin

▸ **_setMin**(): `void`

#### Returns

`void`

#### Defined in

[elements/core/slider.ts:201](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L201)

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

[elements/core/slider.ts:147](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L147)

___

### addEventListener

▸ **addEventListener**(`type`, `listener`, `options?`): `void`

Wrapper for addEventListener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | listener name. |
| `listener` | `AnyEventListener` | listener handler. |
| `options?` | `AddEventListenerOptions` | event listener options. |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[addEventListener](IoGl.md#addeventlistener)

#### Defined in

[core/io-node.ts:363](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L363)

___

### applyAria

▸ **applyAria**(): `void`

Sets aria attributes.

#### Returns

`void`

#### Overrides

[IoGl](IoGl.md).[applyAria](IoGl.md#applyaria)

#### Defined in

[elements/core/slider.ts:215](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L215)

___

### applyCompose

▸ **applyCompose**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[applyCompose](IoGl.md#applycompose)

#### Defined in

[core/io-element.ts:244](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L244)

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

[core/io-element.ts:82](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L82)

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

[core/io-node.ts:303](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L303)

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

[elements/core/slider.ts:212](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/slider.ts#L212)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[connectedCallback](IoGl.md#connectedcallback)

#### Defined in

[core/io-element.ts:100](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L100)

___

### cssMutated

▸ **cssMutated**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[cssMutated](IoGl.md#cssmutated)

#### Defined in

[elements/core/gl.ts:290](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L290)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[disconnectedCallback](IoGl.md#disconnectedcallback)

#### Defined in

[core/io-element.ts:109](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L109)

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
| `src?` | `HTMLElement` \| `Node` \| `Window` \| `Document` | `undefined` | source node/element to dispatch event from. |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[dispatchEvent](IoGl.md#dispatchevent)

#### Defined in

[core/io-node.ts:387](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L387)

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

[core/io-node.ts:186](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L186)

___

### filterObject

▸ **filterObject**(`object`, `predicate`, `_depth?`, `_chain?`, `_i?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `object` | `any` | `undefined` |
| `predicate` | `PredicateFunction` | `undefined` |
| `_depth` | `number` | `5` |
| `_chain` | `any`[] | `[]` |
| `_i` | `number` | `0` |

#### Returns

`any`

#### Inherited from

[IoGl](IoGl.md).[filterObject](IoGl.md#filterobject)

#### Defined in

[core/io-node.ts:420](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L420)

___

### filterObjects

▸ **filterObjects**(`object`, `predicate`, `_depth?`, `_chain?`, `_i?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `object` | `any` | `undefined` |
| `predicate` | `PredicateFunction` | `undefined` |
| `_depth` | `number` | `5` |
| `_chain` | `any`[] | `[]` |
| `_i` | `number` | `0` |

#### Returns

`any`

#### Inherited from

[IoGl](IoGl.md).[filterObjects](IoGl.md#filterobjects)

#### Defined in

[core/io-node.ts:433](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L433)

___

### flattenTextNode

▸ **flattenTextNode**(`element`): `void`

Helper function to flatten textContent into a single TextNode.
Update textContent via TextNode is better for layout performance.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `element` | [`IoElement`](IoElement.md) \| `HTMLElement` | Element to flatten. |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[flattenTextNode](IoGl.md#flattentextnode)

#### Defined in

[core/io-element.ts:197](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L197)

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

[core/io-element.ts:370](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L370)

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

[core/io-node.ts:450](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L450)

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

[elements/core/gl.ts:146](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L146)

___

### initShader

▸ **initShader**(): `WebGLProgram`

#### Returns

`WebGLProgram`

#### Inherited from

[IoGl](IoGl.md).[initShader](IoGl.md#initshader)

#### Defined in

[elements/core/gl.ts:162](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L162)

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

[core/io-node.ts:267](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L267)

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

[core/io-node.ts:293](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L293)

___

### onResized

▸ **onResized**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[onResized](IoGl.md#onresized)

#### Defined in

[elements/core/gl.ts:263](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L263)

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

[core/io-node.ts:468](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L468)

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

[core/io-node.ts:240](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L240)

___

### queueDispatch

▸ **queueDispatch**(): `void`

Dispatches the queue.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[queueDispatch](IoGl.md#queuedispatch)

#### Defined in

[core/io-node.ts:246](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L246)

___

### queueDispatchLazy

▸ **queueDispatchLazy**(): `void`

Dispatches the queue in the next rAF cycle.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[queueDispatchLazy](IoGl.md#queuedispatchlazy)

#### Defined in

[core/io-node.ts:257](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L257)

___

### removeEventListener

▸ **removeEventListener**(`type`, `listener?`, `options?`): `void`

Wrapper for removeEventListener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | event name to listen to. |
| `listener?` | `AnyEventListener` | listener handler. |
| `options?` | `AddEventListenerOptions` | event listener options. |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[removeEventListener](IoGl.md#removeeventlistener)

#### Defined in

[core/io-node.ts:377](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L377)

___

### requestAnimationFrameOnce

▸ **requestAnimationFrameOnce**(`func`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `func` | `CallbackFunction` |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[requestAnimationFrameOnce](IoGl.md#requestanimationframeonce)

#### Defined in

[core/io-node.ts:417](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L417)

___

### set

▸ **set**(`prop`, `value`, `force?`): `void`

Sets a property and emits `[property]-set` event.
Use this when property is set by user action (e.g. mouse click).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `prop` | `string` | Property name. |
| `value` | `any` | Property value. |
| `force?` | `boolean` | Force value set. |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[set](IoGl.md#set)

#### Defined in

[core/io-node.ts:330](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L330)

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

[core/io-element.ts:235](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L235)

___

### setProperties

▸ **setProperties**(`props`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `any` |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[setProperties](IoGl.md#setproperties)

#### Defined in

[core/io-element.ts:222](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L222)

___

### setPropertyValue

▸ **setPropertyValue**(`name`, `value`, `skipDispatch?`): `void`

Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Property name to set value of. |
| `value` | `any` | Peroperty value. |
| `skipDispatch?` | `boolean` | - |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[setPropertyValue](IoGl.md#setpropertyvalue)

#### Defined in

[core/io-node.ts:130](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L130)

___

### setShaderProgram

▸ **setShaderProgram**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[setShaderProgram](IoGl.md#setshaderprogram)

#### Defined in

[elements/core/gl.ts:333](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L333)

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

[elements/core/gl.ts:350](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L350)

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

[core/io-node.ts:475](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L475)

___

### template

▸ **template**(`vDOM`, `host?`): `void`

Renders DOM from virtual DOM arrays.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vDOM` | `any`[] | Array of vDOM children. |
| `host?` | `HTMLElement` | - |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[template](IoGl.md#template)

#### Defined in

[core/io-element.ts:119](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L119)

___

### throttle

▸ **throttle**(`func`, `arg?`, `asynchronous?`): `void`

Throttles function execution to next frame (rAF) if the function has been executed in the current frame.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `func` | `CallbackFunction` | Function to throttle. |
| `arg?` | `any` | argument for throttled function. |
| `asynchronous?` | `boolean` | execute with timeout. |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[throttle](IoGl.md#throttle)

#### Defined in

[core/io-node.ts:396](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L396)

___

### traverse

▸ **traverse**(`vChildren`, `host`): `void`

Recurively traverses vDOM.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vChildren` | `any`[] | Array of vDOM children converted by `buildTree()` for easier parsing. |
| `host` | `HTMLElement` | - |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[traverse](IoGl.md#traverse)

#### Defined in

[core/io-element.ts:130](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L130)

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

[core/io-node.ts:315](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L315)

___

### updateCssUniforms

▸ **updateCssUniforms**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[updateCssUniforms](IoGl.md#updatecssuniforms)

#### Defined in

[elements/core/gl.ts:345](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L345)

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

[elements/core/gl.ts:339](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L339)
