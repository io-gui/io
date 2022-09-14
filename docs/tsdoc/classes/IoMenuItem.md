# Class: IoMenuItem

Core `IoElement` class.

## Hierarchy

- [`IoItem`](IoItem.md)

  ↳ **`IoMenuItem`**

## Constructors

### constructor

• **new IoMenuItem**(`properties?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | `Record`<`string`, `any`\> |

#### Inherited from

[IoItem](IoItem.md).[constructor](IoItem.md#constructor)

#### Defined in

[src/elements/core/item.ts:55](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L55)

## Properties

### \_bindings

• `Readonly` **\_bindings**: `Record`<`string`, [`Binding`](Binding.md)\> = `{}`

#### Inherited from

[IoItem](IoItem.md).[_bindings](IoItem.md#_bindings)

#### Defined in

[src/core/io-node.ts:49](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L49)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoItem](IoItem.md).[_changeQueue](IoItem.md#_changequeue)

#### Defined in

[src/core/io-node.ts:51](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L51)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoItem](IoItem.md).[_eventDispatcher](IoItem.md#_eventdispatcher)

#### Defined in

[src/core/io-node.ts:52](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L52)

___

### \_properties

• `Readonly` **\_properties**: `Record`<`string`, [`Property`](Property.md)\> = `{}`

#### Inherited from

[IoItem](IoItem.md).[_properties](IoItem.md#_properties)

#### Defined in

[src/core/io-node.ts:48](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L48)

## Accessors

### hasmore

• `get` **hasmore**(): `any`

#### Returns

`any`

#### Defined in

[src/elements/menus/menu-item.ts:110](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L110)

___

### inlayer

• `get` **inlayer**(): `any`

#### Returns

`any`

#### Defined in

[src/elements/menus/menu-item.ts:113](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L113)

___

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoItem.textNode

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

IoItem.textNode

#### Defined in

[src/core/io-element.ts:211](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L211)

___

### Listeners

• `Static` `get` **Listeners**(): `any`

#### Returns

`any`

#### Overrides

IoItem.Listeners

#### Defined in

[src/elements/menus/menu-item.ts:101](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L101)

___

### Properties

• `Static` `get` **Properties**(): `any`

#### Returns

`any`

#### Overrides

IoItem.Properties

#### Defined in

[src/elements/menus/menu-item.ts:81](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L81)

___

### Style

• `Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoItem.Style

#### Defined in

[src/elements/menus/menu-item.ts:26](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L26)

___

### observedAttributes

• `Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoItem.observedAttributes

#### Defined in

[src/core/io-element.ts:65](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L65)

## Methods

### \_expandHovered

▸ **_expandHovered**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/menu-item.ts:213](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L213)

___

### \_gethovered

▸ **_gethovered**(`event`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`any`

#### Defined in

[src/elements/menus/menu-item.ts:207](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L207)

___

### \_onBlur

▸ **_onBlur**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `FocusEvent` |

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[_onBlur](IoItem.md#_onblur)

#### Defined in

[src/elements/core/item.ts:65](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L65)

___

### \_onClick

▸ **_onClick**(): `void`

#### Returns

`void`

#### Overrides

[IoItem](IoItem.md).[_onClick](IoItem.md#_onclick)

#### Defined in

[src/elements/menus/menu-item.ts:128](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L128)

___

### \_onCollapse

▸ **_onCollapse**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/menu-item.ts:310](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L310)

___

### \_onCollapseRoot

▸ **_onCollapseRoot**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/menu-item.ts:313](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L313)

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

[IoItem](IoItem.md).[_onFocus](IoItem.md#_onfocus)

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

[IoItem](IoItem.md).[_onFocusTo](IoItem.md#_onfocusto)

#### Defined in

[src/core/io-element.ts:252](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L252)

___

### \_onItemClicked

▸ **_onItemClicked**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Defined in

[src/elements/menus/menu-item.ts:149](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L149)

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

[src/elements/menus/menu-item.ts:246](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L246)

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

[IoItem](IoItem.md).[_onKeyup](IoItem.md#_onkeyup)

#### Defined in

[src/elements/core/item.ts:110](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L110)

___

### \_onLayerPointermove

▸ **_onLayerPointermove**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Defined in

[src/elements/menus/menu-item.ts:227](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L227)

___

### \_onLayerPointerup

▸ **_onLayerPointerup**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Defined in

[src/elements/menus/menu-item.ts:230](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L230)

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

[src/elements/menus/menu-item.ts:157](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L157)

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

#### Overrides

[IoItem](IoItem.md).[_onPointermove](IoItem.md#_onpointermove)

#### Defined in

[src/elements/menus/menu-item.ts:174](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L174)

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

[src/elements/menus/menu-item.ts:233](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L233)

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

[IoItem](IoItem.md).[addEventListener](IoItem.md#addeventlistener)

#### Defined in

[src/core/io-node.ts:338](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L338)

___

### applyAria

▸ **applyAria**(): `void`

Sets aria attributes.

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[applyAria](IoItem.md#applyaria)

#### Defined in

[src/core/io-element.ts:240](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L240)

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

[IoItem](IoItem.md).[applyProperties](IoItem.md#applyproperties)

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

[IoItem](IoItem.md).[attributeChangedCallback](IoItem.md#attributechangedcallback)

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

[IoItem](IoItem.md).[bind](IoItem.md#bind)

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

[IoItem](IoItem.md).[changed](IoItem.md#changed)

#### Defined in

[src/elements/menus/menu-item.ts:356](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L356)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Overrides

[IoItem](IoItem.md).[connectedCallback](IoItem.md#connectedcallback)

#### Defined in

[src/elements/menus/menu-item.ts:116](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L116)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Overrides

[IoItem](IoItem.md).[disconnectedCallback](IoItem.md#disconnectedcallback)

#### Defined in

[src/elements/menus/menu-item.ts:122](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L122)

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

[IoItem](IoItem.md).[dispatchEvent](IoItem.md#dispatchevent)

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

[IoItem](IoItem.md).[dispose](IoItem.md#dispose)

#### Defined in

[src/core/io-node.ts:219](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L219)

___

### expandedChanged

▸ **expandedChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/menu-item.ts:316](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L316)

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

[IoItem](IoItem.md).[filterObject](IoItem.md#filterobject)

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

[IoItem](IoItem.md).[filterObjects](IoItem.md#filterobjects)

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

[IoItem](IoItem.md).[flattenTextNode](IoItem.md#flattentextnode)

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

[IoItem](IoItem.md).[focusTo](IoItem.md#focusto)

#### Defined in

[src/core/io-element.ts:359](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L359)

___

### getCaretPosition

▸ **getCaretPosition**(): `number`

#### Returns

`number`

#### Inherited from

[IoItem](IoItem.md).[getCaretPosition](IoItem.md#getcaretposition)

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

[IoItem](IoItem.md).[import](IoItem.md#import)

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

[IoItem](IoItem.md).[objectMutated](IoItem.md#objectmutated)

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

[IoItem](IoItem.md).[objectMutatedThrottled](IoItem.md#objectmutatedthrottled)

#### Defined in

[src/core/io-node.ts:302](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L302)

___

### onOptionChanged

▸ **onOptionChanged**(): `void`

#### Returns

`void`

#### Defined in

[src/elements/menus/menu-item.ts:353](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L353)

___

### optionChanged

▸ **optionChanged**(`change`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `change` | `CustomEvent`<`any`\> |

#### Returns

`void`

#### Defined in

[src/elements/menus/menu-item.ts:345](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L345)

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

#### Overrides

[IoItem](IoItem.md).[preventDefault](IoItem.md#preventdefault)

#### Defined in

[src/elements/menus/menu-item.ts:106](https://github.com/io-gui/iogui/blob/tsc/src/elements/menus/menu-item.ts#L106)

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

[src/core/io-node.ts:248](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L248)

___

### queueDispatch

▸ **queueDispatch**(): `void`

Dispatches the queue.

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[queueDispatch](IoItem.md#queuedispatch)

#### Defined in

[src/core/io-node.ts:254](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L254)

___

### queueDispatchLazy

▸ **queueDispatchLazy**(): `void`

Dispatches the queue in the next rAF cycle.

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[queueDispatchLazy](IoItem.md#queuedispatchlazy)

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

[IoItem](IoItem.md).[removeEventListener](IoItem.md#removeeventlistener)

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

[IoItem](IoItem.md).[requestAnimationFrameOnce](IoItem.md#requestanimationframeonce)

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

[IoItem](IoItem.md).[setAttribute](IoItem.md#setattribute)

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

[IoItem](IoItem.md).[setCaretPosition](IoItem.md#setcaretposition)

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

[IoItem](IoItem.md).[setProperties](IoItem.md#setproperties)

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

[IoItem](IoItem.md).[setProperty](IoItem.md#setproperty)

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

[IoItem](IoItem.md).[setValue](IoItem.md#setvalue)

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

[IoItem](IoItem.md).[stopPropagation](IoItem.md#stoppropagation)

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

[IoItem](IoItem.md).[template](IoItem.md#template)

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

[IoItem](IoItem.md).[throttle](IoItem.md#throttle)

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

[IoItem](IoItem.md).[traverse](IoItem.md#traverse)

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

[IoItem](IoItem.md).[unbind](IoItem.md#unbind)

#### Defined in

[src/core/io-node.ts:324](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L324)
