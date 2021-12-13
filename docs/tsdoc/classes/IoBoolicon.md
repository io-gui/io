# Class: IoBoolicon

## Hierarchy

- [`IoBoolean`](IoBoolean.md)

  ↳ **`IoBoolicon`**

## Constructors

### constructor

• **new IoBoolicon**(`properties?`)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `properties` | `Record`<`string`, `any`\> |

#### Inherited from

[IoBoolean](IoBoolean.md).[constructor](IoBoolean.md#constructor)

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

IoBoolean.compose

#### Defined in

[core/io-node.ts:55](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L55)

___

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoBoolean.textNode

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

IoBoolean.textNode

#### Defined in

[core/io-element.ts:220](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L220)

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

[elements/core/item.ts:47](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L47)

___

### Properties

• `Static` `get` **Properties**(): `any`

#### Returns

`any`

#### Overrides

IoBoolean.Properties

#### Defined in

[elements/core/boolicon.ts:40](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolicon.ts#L40)

___

### Style

• `Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoBoolean.Style

#### Defined in

[elements/core/boolicon.ts:14](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolicon.ts#L14)

___

### observedAttributes

• `Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoBoolean.observedAttributes

#### Defined in

[core/io-element.ts:73](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L73)

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

[elements/core/item.ts:64](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L64)

___

### \_onClick

▸ **_onClick**(): `void`

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[_onClick](IoBoolean.md#_onclick)

#### Defined in

[elements/core/boolean.ts:33](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L33)

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

[IoBoolean](IoBoolean.md).[_onFocusTo](IoBoolean.md#_onfocusto)

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

#### Inherited from

[IoBoolean](IoBoolean.md).[_onKeydown](IoBoolean.md#_onkeydown)

#### Defined in

[elements/core/item.ts:90](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L90)

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

[elements/core/item.ts:109](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L109)

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

[elements/core/item.ts:69](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L69)

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

[elements/core/item.ts:76](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L76)

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

#### Inherited from

[IoBoolean](IoBoolean.md).[_onPointerup](IoBoolean.md#_onpointerup)

#### Defined in

[elements/core/item.ts:81](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/item.ts#L81)

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

[IoBoolean](IoBoolean.md).[addEventListener](IoBoolean.md#addeventlistener)

#### Defined in

[core/io-node.ts:323](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L323)

___

### applyAria

▸ **applyAria**(): `void`

Sets aria attributes.

#### Returns

`void`

#### Overrides

[IoBoolean](IoBoolean.md).[applyAria](IoBoolean.md#applyaria)

#### Defined in

[elements/core/boolicon.ts:54](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolicon.ts#L54)

___

### applyCompose

▸ **applyCompose**(): `void`

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[applyCompose](IoBoolean.md#applycompose)

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

[IoBoolean](IoBoolean.md).[attributeChangedCallback](IoBoolean.md#attributechangedcallback)

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

[IoBoolean](IoBoolean.md).[bind](IoBoolean.md#bind)

#### Defined in

[core/io-node.ts:267](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L267)

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

[elements/core/boolicon.ts:50](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolicon.ts#L50)

___

### connect

▸ **connect**(`node?`): [`IoBoolicon`](IoBoolicon.md)

Connects the instance to another node or element.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | `HTMLElement` \| [`IoNode`](IoNode.md) \| `Document` \| `Window` | `window` | Node to connect to. |

#### Returns

[`IoBoolicon`](IoBoolicon.md)

this

#### Inherited from

[IoBoolean](IoBoolean.md).[connect](IoBoolean.md#connect)

#### Defined in

[core/io-node.ts:97](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L97)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[connectedCallback](IoBoolean.md#connectedcallback)

#### Defined in

[core/io-element.ts:101](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L101)

___

### disconnect

▸ **disconnect**(`node?`): [`IoBoolicon`](IoBoolicon.md)

Disconnects the instance from an another node or element.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | `HTMLElement` \| [`IoNode`](IoNode.md) \| `Document` \| `Window` | `window` | Node to disconnect from. |

#### Returns

[`IoBoolicon`](IoBoolicon.md)

this

#### Inherited from

[IoBoolean](IoBoolean.md).[disconnect](IoBoolean.md#disconnect)

#### Defined in

[core/io-node.ts:115](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L115)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[disconnectedCallback](IoBoolean.md#disconnectedcallback)

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

[IoBoolean](IoBoolean.md).[dispatchEvent](IoBoolean.md#dispatchevent)

#### Defined in

[core/io-node.ts:347](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L347)

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

[core/io-node.ts:157](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L157)

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

[IoBoolean](IoBoolean.md).[filterObject](IoBoolean.md#filterobject)

#### Defined in

[core/io-node.ts:380](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L380)

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

[IoBoolean](IoBoolean.md).[filterObjects](IoBoolean.md#filterobjects)

#### Defined in

[core/io-node.ts:393](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L393)

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

[IoBoolean](IoBoolean.md).[flattenTextNode](IoBoolean.md#flattentextnode)

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

[IoBoolean](IoBoolean.md).[focusTo](IoBoolean.md#focusto)

#### Defined in

[core/io-element.ts:372](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L372)

___

### getCaretPosition

▸ **getCaretPosition**(): `number`

#### Returns

`number`

#### Inherited from

[IoBoolean](IoBoolean.md).[getCaretPosition](IoBoolean.md#getcaretposition)

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

[IoBoolean](IoBoolean.md).[import](IoBoolean.md#import)

#### Defined in

[core/io-node.ts:410](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L410)

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

[core/io-node.ts:231](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L231)

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

[core/io-node.ts:257](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L257)

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

[core/io-node.ts:428](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L428)

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

[core/io-node.ts:204](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L204)

___

### queueDispatch

▸ **queueDispatch**(): `void`

Dispatches the queue.

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[queueDispatch](IoBoolean.md#queuedispatch)

#### Defined in

[core/io-node.ts:210](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L210)

___

### queueDispatchLazy

▸ **queueDispatchLazy**(): `void`

Dispatches the queue in the next rAF cycle.

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[queueDispatchLazy](IoBoolean.md#queuedispatchlazy)

#### Defined in

[core/io-node.ts:221](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L221)

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

[IoBoolean](IoBoolean.md).[removeEventListener](IoBoolean.md#removeeventlistener)

#### Defined in

[core/io-node.ts:337](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L337)

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

[IoBoolean](IoBoolean.md).[requestAnimationFrameOnce](IoBoolean.md#requestanimationframeonce)

#### Defined in

[core/io-node.ts:377](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L377)

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

[IoBoolean](IoBoolean.md).[set](IoBoolean.md#set)

#### Defined in

[core/io-node.ts:290](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L290)

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

[core/io-element.ts:237](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L237)

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

[IoBoolean](IoBoolean.md).[setProperties](IoBoolean.md#setproperties)

#### Defined in

[core/io-element.ts:224](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L224)

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

[core/io-node.ts:435](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L435)

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

[IoBoolean](IoBoolean.md).[template](IoBoolean.md#template)

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

[IoBoolean](IoBoolean.md).[throttle](IoBoolean.md#throttle)

#### Defined in

[core/io-node.ts:356](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L356)

___

### toggle

▸ **toggle**(): `void`

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[toggle](IoBoolean.md#toggle)

#### Defined in

[elements/core/boolean.ts:36](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L36)

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

[IoBoolean](IoBoolean.md).[traverse](IoBoolean.md#traverse)

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

[IoBoolean](IoBoolean.md).[unbind](IoBoolean.md#unbind)

#### Defined in

[core/io-node.ts:278](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L278)

___

### valueChanged

▸ **valueChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoBoolean](IoBoolean.md).[valueChanged](IoBoolean.md#valuechanged)

#### Defined in

[elements/core/boolean.ts:39](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L39)
