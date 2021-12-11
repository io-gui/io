# Class: IoButton

## Hierarchy

- [`IoItem`](IoItem.md)

  ↳ **`IoButton`**

## Constructors

### constructor

• **new IoButton**(`properties?`)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | `Record`<`string`, `any`\> |

#### Inherited from

[IoItem](IoItem.md).[constructor](IoItem.md#constructor)

#### Defined in

[elements/core/item.ts:54](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L54)

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

[components/io-node.ts:55](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L55)

___

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoItem.textNode

#### Defined in

[components/io-element.ts:216](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L216)

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

[components/io-element.ts:220](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L220)

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

[elements/core/item.ts:47](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L47)

___

### Properties

• `Static` `get` **Properties**(): `any`

#### Returns

`any`

#### Overrides

IoItem.Properties

#### Defined in

[elements/core/button.ts:30](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/button.ts#L30)

___

### Style

• `Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoItem.Style

#### Defined in

[elements/core/button.ts:13](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/button.ts#L13)

___

### observedAttributes

• `Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoItem.observedAttributes

#### Defined in

[components/io-element.ts:73](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L73)

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

[IoItem](IoItem.md).[_onBlur](IoItem.md#_onblur)

#### Defined in

[elements/core/item.ts:64](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L64)

___

### \_onClick

▸ **_onClick**(): `void`

#### Returns

`void`

#### Overrides

[IoItem](IoItem.md).[_onClick](IoItem.md#_onclick)

#### Defined in

[elements/core/button.ts:65](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/button.ts#L65)

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

[elements/core/item.ts:59](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L59)

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

[components/io-element.ts:265](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L265)

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

[elements/core/button.ts:55](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/button.ts#L55)

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

[elements/core/button.ts:61](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/button.ts#L61)

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

[elements/core/button.ts:43](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/button.ts#L43)

___

### \_onPointerleave

▸ **_onPointerleave**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `PointerEvent` |

#### Returns

`void`

#### Overrides

[IoItem](IoItem.md).[_onPointerleave](IoItem.md#_onpointerleave)

#### Defined in

[elements/core/button.ts:47](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/button.ts#L47)

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

[elements/core/item.ts:75](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L75)

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

[elements/core/button.ts:51](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/button.ts#L51)

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

[components/io-node.ts:323](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L323)

___

### applyAria

▸ **applyAria**(): `void`

Sets aria attributes.

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[applyAria](IoItem.md#applyaria)

#### Defined in

[components/io-element.ts:253](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L253)

___

### applyCompose

▸ **applyCompose**(): `void`

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[applyCompose](IoItem.md#applycompose)

#### Defined in

[components/io-element.ts:246](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L246)

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

[components/io-element.ts:83](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L83)

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

[components/io-node.ts:267](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L267)

___

### changed

▸ **changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[changed](IoItem.md#changed)

#### Defined in

[elements/core/item.ts:134](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L134)

___

### connect

▸ **connect**(`node?`): [`IoButton`](IoButton.md)

Connects the instance to another node or element.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) \| `HTMLElement` \| `Document` \| `Window` | `window` | Node to connect to. |

#### Returns

[`IoButton`](IoButton.md)

this

#### Inherited from

[IoItem](IoItem.md).[connect](IoItem.md#connect)

#### Defined in

[components/io-node.ts:97](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L97)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[connectedCallback](IoItem.md#connectedcallback)

#### Defined in

[components/io-element.ts:101](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L101)

___

### disconnect

▸ **disconnect**(`node?`): [`IoButton`](IoButton.md)

Disconnects the instance from an another node or element.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) \| `HTMLElement` \| `Document` \| `Window` | `window` | Node to disconnect from. |

#### Returns

[`IoButton`](IoButton.md)

this

#### Inherited from

[IoItem](IoItem.md).[disconnect](IoItem.md#disconnect)

#### Defined in

[components/io-node.ts:115](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L115)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[disconnectedCallback](IoItem.md#disconnectedcallback)

#### Defined in

[components/io-element.ts:110](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L110)

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

[IoItem](IoItem.md).[dispatchEvent](IoItem.md#dispatchevent)

#### Defined in

[components/io-node.ts:347](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L347)

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

[components/io-node.ts:157](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L157)

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

[components/io-node.ts:380](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L380)

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

[components/io-node.ts:393](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L393)

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

[components/io-element.ts:199](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L199)

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

[components/io-element.ts:372](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L372)

___

### getCaretPosition

▸ **getCaretPosition**(): `number`

#### Returns

`number`

#### Inherited from

[IoItem](IoItem.md).[getCaretPosition](IoItem.md#getcaretposition)

#### Defined in

[elements/core/item.ts:110](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L110)

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

[components/io-node.ts:410](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L410)

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

[components/io-node.ts:231](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L231)

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

[components/io-node.ts:257](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L257)

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

[components/io-node.ts:428](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L428)

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

[components/io-node.ts:204](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L204)

___

### queueDispatch

▸ **queueDispatch**(): `void`

Dispatches the queue.

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[queueDispatch](IoItem.md#queuedispatch)

#### Defined in

[components/io-node.ts:210](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L210)

___

### queueDispatchLazy

▸ **queueDispatchLazy**(): `void`

Dispatches the queue in the next rAF cycle.

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[queueDispatchLazy](IoItem.md#queuedispatchlazy)

#### Defined in

[components/io-node.ts:221](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L221)

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

[components/io-node.ts:337](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L337)

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

[components/io-node.ts:377](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L377)

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

[components/io-node.ts:290](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L290)

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

[components/io-element.ts:237](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L237)

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

[elements/core/item.ts:123](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L123)

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

[components/io-element.ts:224](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L224)

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

[components/io-node.ts:435](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L435)

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

[components/io-element.ts:121](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L121)

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

[components/io-node.ts:356](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L356)

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

[components/io-element.ts:132](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L132)

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

[components/io-node.ts:278](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L278)
