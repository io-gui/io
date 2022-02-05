# Class: IoNumber

## Hierarchy

- [`IoItem`](IoItem.md)

  ↳ **`IoNumber`**

## Constructors

### constructor

• **new IoNumber**(`properties?`)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | `Record`<`string`, `any`\> |

#### Overrides

[IoItem](IoItem.md).[constructor](IoItem.md#constructor)

#### Defined in

[elements/core/number.ts:80](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/number.ts#L80)

## Properties

### \_bindings

• `Readonly` **\_bindings**: `Record`<`string`, [`Binding`](Binding.md)\> = `{}`

#### Inherited from

[IoItem](IoItem.md).[_bindings](IoItem.md#_bindings)

#### Defined in

[core/io-node.ts:69](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L69)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoItem](IoItem.md).[_changeQueue](IoItem.md#_changequeue)

#### Defined in

[core/io-node.ts:71](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L71)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoItem](IoItem.md).[_eventDispatcher](IoItem.md#_eventdispatcher)

#### Defined in

[core/io-node.ts:72](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L72)

___

### \_properties

• `Readonly` **\_properties**: `Record`<`string`, [`Property`](Property.md)\> = `{}`

#### Inherited from

[IoItem](IoItem.md).[_properties](IoItem.md#_properties)

#### Defined in

[core/io-node.ts:68](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L68)

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

IoItem.compose

#### Defined in

[core/io-node.ts:65](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L65)

___

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoItem.textNode

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

IoItem.textNode

#### Defined in

[core/io-element.ts:218](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L218)

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

IoItem.Listeners

#### Defined in

[elements/core/item.ts:48](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L48)

___

### Properties

• `Static` `get` **Properties**(): `any`

#### Returns

`any`

#### Overrides

IoItem.Properties

#### Defined in

[elements/core/number.ts:52](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/number.ts#L52)

___

### Style

• `Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoItem.Style

#### Defined in

[elements/core/number.ts:21](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/number.ts#L21)

___

### observedAttributes

• `Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoItem.observedAttributes

#### Defined in

[core/io-element.ts:72](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L72)

## Methods

### \_expandLadder

▸ **_expandLadder**(): `void`

#### Returns

`void`

#### Defined in

[elements/core/number.ts:130](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/number.ts#L130)

___

### \_onBlur

▸ **_onBlur**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `FocusEvent` |

#### Returns

`void`

#### Overrides

[IoItem](IoItem.md).[_onBlur](IoItem.md#_onblur)

#### Defined in

[elements/core/number.ts:118](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/number.ts#L118)

___

### \_onClick

▸ **_onClick**(): `void`

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[_onClick](IoItem.md#_onclick)

#### Defined in

[elements/core/item.ts:88](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L88)

___

### \_onFocus

▸ **_onFocus**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `FocusEvent` |

#### Returns

`void`

#### Overrides

[IoItem](IoItem.md).[_onFocus](IoItem.md#_onfocus)

#### Defined in

[elements/core/number.ts:112](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/number.ts#L112)

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

[IoItem](IoItem.md).[_onFocusTo](IoItem.md#_onfocusto)

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

#### Overrides

[IoItem](IoItem.md).[_onKeydown](IoItem.md#_onkeydown)

#### Defined in

[elements/core/number.ts:134](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/number.ts#L134)

___

### \_onKeyup

▸ **_onKeyup**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `KeyboardEvent` |

#### Returns

`void`

#### Overrides

[IoItem](IoItem.md).[_onKeyup](IoItem.md#_onkeyup)

#### Defined in

[elements/core/number.ts:194](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/number.ts#L194)

___

### \_onPointerdown

▸ **_onPointerdown**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Overrides

[IoItem](IoItem.md).[_onPointerdown](IoItem.md#_onpointerdown)

#### Defined in

[elements/core/number.ts:84](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/number.ts#L84)

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

[IoItem](IoItem.md).[_onPointerleave](IoItem.md#_onpointerleave)

#### Defined in

[elements/core/item.ts:77](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L77)

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

[IoItem](IoItem.md).[_onPointermove](IoItem.md#_onpointermove)

#### Defined in

[elements/core/item.ts:76](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L76)

___

### \_onPointerup

▸ **_onPointerup**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Overrides

[IoItem](IoItem.md).[_onPointerup](IoItem.md#_onpointerup)

#### Defined in

[elements/core/number.ts:91](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/number.ts#L91)

___

### \_setFromTextNode

▸ **_setFromTextNode**(): `void`

#### Returns

`void`

#### Defined in

[elements/core/number.ts:201](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/number.ts#L201)

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

[IoItem](IoItem.md).[addEventListener](IoItem.md#addeventlistener)

#### Defined in

[core/io-node.ts:363](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L363)

___

### applyAria

▸ **applyAria**(): `void`

Sets aria attributes.

#### Returns

`void`

#### Overrides

[IoItem](IoItem.md).[applyAria](IoItem.md#applyaria)

#### Defined in

[elements/core/number.ts:227](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/number.ts#L227)

___

### applyCompose

▸ **applyCompose**(): `void`

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[applyCompose](IoItem.md#applycompose)

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

[IoItem](IoItem.md).[attributeChangedCallback](IoItem.md#attributechangedcallback)

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

[IoItem](IoItem.md).[bind](IoItem.md#bind)

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

[IoItem](IoItem.md).[changed](IoItem.md#changed)

#### Defined in

[elements/core/number.ts:211](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/number.ts#L211)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[connectedCallback](IoItem.md#connectedcallback)

#### Defined in

[core/io-element.ts:100](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L100)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[disconnectedCallback](IoItem.md#disconnectedcallback)

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

[IoItem](IoItem.md).[dispatchEvent](IoItem.md#dispatchevent)

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

[IoItem](IoItem.md).[dispose](IoItem.md#dispose)

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

[IoItem](IoItem.md).[filterObject](IoItem.md#filterobject)

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

[IoItem](IoItem.md).[filterObjects](IoItem.md#filterobjects)

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

[IoItem](IoItem.md).[flattenTextNode](IoItem.md#flattentextnode)

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

[IoItem](IoItem.md).[focusTo](IoItem.md#focusto)

#### Defined in

[core/io-element.ts:370](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L370)

___

### getCaretPosition

▸ **getCaretPosition**(): `number`

#### Returns

`number`

#### Inherited from

[IoItem](IoItem.md).[getCaretPosition](IoItem.md#getcaretposition)

#### Defined in

[elements/core/item.ts:111](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L111)

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

[IoItem](IoItem.md).[import](IoItem.md#import)

#### Defined in

[core/io-node.ts:450](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L450)

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

[IoItem](IoItem.md).[objectMutated](IoItem.md#objectmutated)

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

[IoItem](IoItem.md).[objectMutatedThrottled](IoItem.md#objectmutatedthrottled)

#### Defined in

[core/io-node.ts:293](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L293)

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

[IoItem](IoItem.md).[preventDefault](IoItem.md#preventdefault)

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

[IoItem](IoItem.md).[queue](IoItem.md#queue)

#### Defined in

[core/io-node.ts:240](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L240)

___

### queueDispatch

▸ **queueDispatch**(): `void`

Dispatches the queue.

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[queueDispatch](IoItem.md#queuedispatch)

#### Defined in

[core/io-node.ts:246](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L246)

___

### queueDispatchLazy

▸ **queueDispatchLazy**(): `void`

Dispatches the queue in the next rAF cycle.

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[queueDispatchLazy](IoItem.md#queuedispatchlazy)

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

[IoItem](IoItem.md).[removeEventListener](IoItem.md#removeeventlistener)

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

[IoItem](IoItem.md).[requestAnimationFrameOnce](IoItem.md#requestanimationframeonce)

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

[IoItem](IoItem.md).[set](IoItem.md#set)

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

[IoItem](IoItem.md).[setAttribute](IoItem.md#setattribute)

#### Defined in

[core/io-element.ts:235](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L235)

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

[IoItem](IoItem.md).[setCaretPosition](IoItem.md#setcaretposition)

#### Defined in

[elements/core/item.ts:124](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L124)

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

[IoItem](IoItem.md).[setProperties](IoItem.md#setproperties)

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

[IoItem](IoItem.md).[setPropertyValue](IoItem.md#setpropertyvalue)

#### Defined in

[core/io-node.ts:130](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L130)

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

[IoItem](IoItem.md).[stopPropagation](IoItem.md#stoppropagation)

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

[IoItem](IoItem.md).[template](IoItem.md#template)

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

[IoItem](IoItem.md).[throttle](IoItem.md#throttle)

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

[IoItem](IoItem.md).[traverse](IoItem.md#traverse)

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

[IoItem](IoItem.md).[unbind](IoItem.md#unbind)

#### Defined in

[core/io-node.ts:315](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L315)
