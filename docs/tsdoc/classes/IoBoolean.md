# Class: IoBoolean

## Hierarchy

- [`IoItem`](IoItem.md)

  ↳ **`IoBoolean`**

  ↳↳ [`IoBoolicon`](IoBoolicon.md)

  ↳↳ [`IoSwitch`](IoSwitch.md)

## Constructors

### constructor

• **new IoBoolean**(`properties?`)

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

[core/io-node.ts:54](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L54)

___

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoItem.textNode

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

IoItem.textNode

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

[elements/core/boolean.ts:21](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L21)

___

### Style

• `Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoItem.Style

#### Defined in

[elements/core/boolean.ts:13](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L13)

___

### observedAttributes

• `Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoItem.observedAttributes

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

[IoItem](IoItem.md).[_onKeydown](IoItem.md#_onkeydown)

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

[IoItem](IoItem.md).[_onKeyup](IoItem.md#_onkeyup)

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

[IoItem](IoItem.md).[_onPointerdown](IoItem.md#_onpointerdown)

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

[IoItem](IoItem.md).[_onPointerleave](IoItem.md#_onpointerleave)

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

#### Inherited from

[IoItem](IoItem.md).[_onPointerup](IoItem.md#_onpointerup)

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

[IoItem](IoItem.md).[addEventListener](IoItem.md#addeventlistener)

#### Defined in

[core/io-node.ts:322](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L322)

___

### applyAria

▸ **applyAria**(): `void`

Sets aria attributes.

#### Returns

`void`

#### Overrides

[IoItem](IoItem.md).[applyAria](IoItem.md#applyaria)

#### Defined in

[elements/core/boolean.ts:46](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L46)

___

### applyCompose

▸ **applyCompose**(): `void`

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[applyCompose](IoItem.md#applycompose)

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

[IoItem](IoItem.md).[attributeChangedCallback](IoItem.md#attributechangedcallback)

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

[IoItem](IoItem.md).[bind](IoItem.md#bind)

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

[IoItem](IoItem.md).[changed](IoItem.md#changed)

#### Defined in

[elements/core/boolean.ts:42](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L42)

___

### connect

▸ **connect**(`node?`): [`IoBoolean`](IoBoolean.md)

Connects the instance to another node or element.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | `HTMLElement` \| [`IoNode`](IoNode.md) \| `Document` \| `Window` | `window` | Node to connect to. |

#### Returns

[`IoBoolean`](IoBoolean.md)

this

#### Inherited from

[IoItem](IoItem.md).[connect](IoItem.md#connect)

#### Defined in

[core/io-node.ts:96](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L96)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[connectedCallback](IoItem.md#connectedcallback)

#### Defined in

[core/io-element.ts:101](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L101)

___

### disconnect

▸ **disconnect**(`node?`): [`IoBoolean`](IoBoolean.md)

Disconnects the instance from an another node or element.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | `HTMLElement` \| [`IoNode`](IoNode.md) \| `Document` \| `Window` | `window` | Node to disconnect from. |

#### Returns

[`IoBoolean`](IoBoolean.md)

this

#### Inherited from

[IoItem](IoItem.md).[disconnect](IoItem.md#disconnect)

#### Defined in

[core/io-node.ts:114](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L114)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[disconnectedCallback](IoItem.md#disconnectedcallback)

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

[IoItem](IoItem.md).[dispatchEvent](IoItem.md#dispatchevent)

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

[IoItem](IoItem.md).[dispose](IoItem.md#dispose)

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

[IoItem](IoItem.md).[filterObject](IoItem.md#filterobject)

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

[IoItem](IoItem.md).[filterObjects](IoItem.md#filterobjects)

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

[IoItem](IoItem.md).[flattenTextNode](IoItem.md#flattentextnode)

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

[IoItem](IoItem.md).[focusTo](IoItem.md#focusto)

#### Defined in

[core/io-element.ts:372](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L372)

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

[core/io-node.ts:409](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L409)

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

[IoItem](IoItem.md).[objectMutatedThrottled](IoItem.md#objectmutatedthrottled)

#### Defined in

[core/io-node.ts:256](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L256)

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

[IoItem](IoItem.md).[queue](IoItem.md#queue)

#### Defined in

[core/io-node.ts:203](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L203)

___

### queueDispatch

▸ **queueDispatch**(): `void`

Dispatches the queue.

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[queueDispatch](IoItem.md#queuedispatch)

#### Defined in

[core/io-node.ts:209](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L209)

___

### queueDispatchLazy

▸ **queueDispatchLazy**(): `void`

Dispatches the queue in the next rAF cycle.

#### Returns

`void`

#### Inherited from

[IoItem](IoItem.md).[queueDispatchLazy](IoItem.md#queuedispatchlazy)

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

[IoItem](IoItem.md).[removeEventListener](IoItem.md#removeeventlistener)

#### Defined in

[core/io-node.ts:336](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L336)

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

[IoItem](IoItem.md).[set](IoItem.md#set)

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

[IoItem](IoItem.md).[setAttribute](IoItem.md#setattribute)

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

[IoItem](IoItem.md).[stopPropagation](IoItem.md#stoppropagation)

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

[IoItem](IoItem.md).[template](IoItem.md#template)

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

[IoItem](IoItem.md).[throttle](IoItem.md#throttle)

#### Defined in

[core/io-node.ts:355](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L355)

___

### toggle

▸ **toggle**(): `void`

#### Returns

`void`

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

[IoItem](IoItem.md).[traverse](IoItem.md#traverse)

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

[IoItem](IoItem.md).[unbind](IoItem.md#unbind)

#### Defined in

[core/io-node.ts:277](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L277)

___

### valueChanged

▸ **valueChanged**(): `void`

#### Returns

`void`

#### Defined in

[elements/core/boolean.ts:39](https://github.com/io-gui/iogui/blob/tsc/src/elements/core/boolean.ts#L39)
