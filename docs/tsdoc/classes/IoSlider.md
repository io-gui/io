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

[core/io-node.ts:54](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L54)

___

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoGl.textNode

#### Defined in

[core/io-element.ts:216](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L216)

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

[core/io-element.ts:220](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L220)

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

[core/io-element.ts:73](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L73)

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

[core/io-element.ts:265](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L265)

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

[core/io-node.ts:322](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L322)

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

[core/io-element.ts:246](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L246)

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

[core/io-element.ts:83](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L83)

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

[core/io-node.ts:266](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L266)

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

### connect

▸ **connect**(`node?`): [`IoSlider`](IoSlider.md)

Connects the instance to another node or element.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | `HTMLElement` \| [`IoNode`](IoNode.md) \| `Document` \| `Window` | `window` | Node to connect to. |

#### Returns

[`IoSlider`](IoSlider.md)

this

#### Inherited from

[IoGl](IoGl.md).[connect](IoGl.md#connect)

#### Defined in

[core/io-node.ts:96](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L96)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[connectedCallback](IoGl.md#connectedcallback)

#### Defined in

[core/io-element.ts:101](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L101)

___

### cssMutated

▸ **cssMutated**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[cssMutated](IoGl.md#cssmutated)

#### Defined in

[elements/core/gl.ts:291](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L291)

___

### disconnect

▸ **disconnect**(`node?`): [`IoSlider`](IoSlider.md)

Disconnects the instance from an another node or element.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | `HTMLElement` \| [`IoNode`](IoNode.md) \| `Document` \| `Window` | `window` | Node to disconnect from. |

#### Returns

[`IoSlider`](IoSlider.md)

this

#### Inherited from

[IoGl](IoGl.md).[disconnect](IoGl.md#disconnect)

#### Defined in

[core/io-node.ts:114](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L114)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[disconnectedCallback](IoGl.md#disconnectedcallback)

#### Defined in

[core/io-element.ts:110](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L110)

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
| `src?` | `HTMLElement` \| `Node` \| `Document` \| `Window` | `undefined` | source node/element to dispatch event from. |

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[dispatchEvent](IoGl.md#dispatchevent)

#### Defined in

[core/io-node.ts:346](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L346)

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

[core/io-node.ts:156](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L156)

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

[core/io-node.ts:379](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L379)

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

[core/io-node.ts:392](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L392)

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

[core/io-element.ts:199](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L199)

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

[core/io-element.ts:372](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L372)

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

[core/io-node.ts:409](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L409)

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

[core/io-node.ts:230](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L230)

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

[core/io-node.ts:256](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L256)

___

### onResized

▸ **onResized**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[onResized](IoGl.md#onresized)

#### Defined in

[elements/core/gl.ts:264](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L264)

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

[core/io-node.ts:427](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L427)

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

[core/io-node.ts:203](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L203)

___

### queueDispatch

▸ **queueDispatch**(): `void`

Dispatches the queue.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[queueDispatch](IoGl.md#queuedispatch)

#### Defined in

[core/io-node.ts:209](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L209)

___

### queueDispatchLazy

▸ **queueDispatchLazy**(): `void`

Dispatches the queue in the next rAF cycle.

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[queueDispatchLazy](IoGl.md#queuedispatchlazy)

#### Defined in

[core/io-node.ts:220](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L220)

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

[core/io-node.ts:336](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L336)

___

### render

▸ **render**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[render](IoGl.md#render)

#### Defined in

[elements/core/gl.ts:306](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L306)

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

[core/io-node.ts:376](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L376)

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

[core/io-node.ts:289](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L289)

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

[core/io-element.ts:237](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L237)

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

[core/io-element.ts:224](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L224)

___

### setShaderProgram

▸ **setShaderProgram**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[setShaderProgram](IoGl.md#setshaderprogram)

#### Defined in

[elements/core/gl.ts:334](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L334)

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

[elements/core/gl.ts:351](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L351)

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

[core/io-node.ts:434](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L434)

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

[core/io-element.ts:121](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L121)

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

[core/io-node.ts:355](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L355)

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

[core/io-element.ts:132](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L132)

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

[core/io-node.ts:277](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L277)

___

### updateCssUniforms

▸ **updateCssUniforms**(): `void`

#### Returns

`void`

#### Inherited from

[IoGl](IoGl.md).[updateCssUniforms](IoGl.md#updatecssuniforms)

#### Defined in

[elements/core/gl.ts:346](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L346)

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

[elements/core/gl.ts:340](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/gl.ts#L340)