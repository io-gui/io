# Class: IoMdViewSelector

## Hierarchy

- [`IoSelectorSidebar`](IoSelectorSidebar.md)

  ↳ **`IoMdViewSelector`**

## Constructors

### constructor

• **new IoMdViewSelector**(`props?`)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props?` | `any` |

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[constructor](IoSelectorSidebar.md#constructor)

#### Defined in

[elements/layout/selector.ts:100](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L100)

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

IoSelectorSidebar.compose

#### Defined in

[core/io-node.ts:54](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L54)

___

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoSelectorSidebar.textNode

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

IoSelectorSidebar.textNode

#### Defined in

[core/io-element.ts:220](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L220)

___

### Listeners

• `Static` `get` **Listeners**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `content-ready` | `string` |
| `scroll` | (`string` \| { `capture`: `boolean` = true; `passive`: `boolean` = true })[] |

#### Inherited from

IoSelectorSidebar.Listeners

#### Defined in

[elements/layout/selector.ts:94](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L94)

___

### Properties

• `Static` `get` **Properties**(): `any`

#### Returns

`any`

#### Inherited from

IoSelectorSidebar.Properties

#### Defined in

[elements/layout/selector-sidebar.ts:57](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector-sidebar.ts#L57)

___

### Style

• `Static` `get` **Style**(): `string`

#### Returns

`string`

#### Inherited from

IoSelectorSidebar.Style

#### Defined in

[elements/layout/selector-sidebar.ts:31](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector-sidebar.ts#L31)

___

### observedAttributes

• `Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoSelectorSidebar.observedAttributes

#### Defined in

[core/io-element.ts:73](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L73)

## Methods

### \_onFocusTo

▸ **_onFocusTo**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`<`any`\> |

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[_onFocusTo](IoSelectorSidebar.md#_onfocusto)

#### Defined in

[core/io-element.ts:265](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L265)

___

### \_onIoContentReady

▸ **_onIoContentReady**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`<`any`\> |

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[_onIoContentReady](IoSelectorSidebar.md#_oniocontentready)

#### Defined in

[elements/layout/selector.ts:109](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L109)

___

### \_onScroll

▸ **_onScroll**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[_onScroll](IoSelectorSidebar.md#_onscroll)

#### Defined in

[elements/layout/selector.ts:124](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L124)

___

### \_selectDefault

▸ **_selectDefault**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[_selectDefault](IoSelectorSidebar.md#_selectdefault)

#### Defined in

[elements/layout/selector.ts:104](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L104)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[addEventListener](IoSelectorSidebar.md#addeventlistener)

#### Defined in

[core/io-node.ts:322](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L322)

___

### applyAria

▸ **applyAria**(): `void`

Sets aria attributes.

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[applyAria](IoSelectorSidebar.md#applyaria)

#### Defined in

[core/io-element.ts:253](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L253)

___

### applyCompose

▸ **applyCompose**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[applyCompose](IoSelectorSidebar.md#applycompose)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[attributeChangedCallback](IoSelectorSidebar.md#attributechangedcallback)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[bind](IoSelectorSidebar.md#bind)

#### Defined in

[core/io-node.ts:266](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L266)

___

### changed

▸ **changed**(): `void`

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[changed](IoSelectorSidebar.md#changed)

#### Defined in

[core/io-node.ts:171](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L171)

___

### collapsedChanged

▸ **collapsedChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[collapsedChanged](IoSelectorSidebar.md#collapsedchanged)

#### Defined in

[elements/layout/selector-sidebar.ts:73](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector-sidebar.ts#L73)

___

### connect

▸ **connect**(`node?`): [`IoMdViewSelector`](IoMdViewSelector.md)

Connects the instance to another node or element.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | `HTMLElement` \| [`IoNode`](IoNode.md) \| `Document` \| `Window` | `window` | Node to connect to. |

#### Returns

[`IoMdViewSelector`](IoMdViewSelector.md)

this

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[connect](IoSelectorSidebar.md#connect)

#### Defined in

[core/io-node.ts:96](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L96)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[connectedCallback](IoSelectorSidebar.md#connectedcallback)

#### Defined in

[elements/layout/selector.ts:113](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L113)

___

### disconnect

▸ **disconnect**(`node?`): [`IoMdViewSelector`](IoMdViewSelector.md)

Disconnects the instance from an another node or element.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | `HTMLElement` \| [`IoNode`](IoNode.md) \| `Document` \| `Window` | `window` | Node to disconnect from. |

#### Returns

[`IoMdViewSelector`](IoMdViewSelector.md)

this

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[disconnect](IoSelectorSidebar.md#disconnect)

#### Defined in

[core/io-node.ts:114](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L114)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[disconnectedCallback](IoSelectorSidebar.md#disconnectedcallback)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[dispatchEvent](IoSelectorSidebar.md#dispatchevent)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[dispose](IoSelectorSidebar.md#dispose)

#### Defined in

[core/io-node.ts:156](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L156)

___

### elementsChanged

▸ **elementsChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[elementsChanged](IoSelectorSidebar.md#elementschanged)

#### Defined in

[elements/layout/selector.ts:161](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L161)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[filterObject](IoSelectorSidebar.md#filterobject)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[filterObjects](IoSelectorSidebar.md#filterobjects)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[flattenTextNode](IoSelectorSidebar.md#flattentextnode)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[focusTo](IoSelectorSidebar.md#focusto)

#### Defined in

[core/io-element.ts:372](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L372)

___

### getSlotted

▸ **getSlotted**(): (`string` \| { `collapsed`: `any` ; `options`: `any` ; `selected`: [`Binding`](Binding.md)  })[]

#### Returns

(`string` \| { `collapsed`: `any` ; `options`: `any` ; `selected`: [`Binding`](Binding.md)  })[]

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[getSlotted](IoSelectorSidebar.md#getslotted)

#### Defined in

[elements/layout/selector-sidebar.ts:74](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector-sidebar.ts#L74)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[import](IoSelectorSidebar.md#import)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[objectMutated](IoSelectorSidebar.md#objectmutated)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[objectMutatedThrottled](IoSelectorSidebar.md#objectmutatedthrottled)

#### Defined in

[core/io-node.ts:256](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L256)

___

### onResized

▸ **onResized**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[onResized](IoSelectorSidebar.md#onresized)

#### Defined in

[elements/layout/selector-sidebar.ts:70](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector-sidebar.ts#L70)

___

### optionsChanged

▸ **optionsChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[optionsChanged](IoSelectorSidebar.md#optionschanged)

#### Defined in

[elements/layout/selector.ts:157](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L157)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[preventDefault](IoSelectorSidebar.md#preventdefault)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[queue](IoSelectorSidebar.md#queue)

#### Defined in

[core/io-node.ts:203](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L203)

___

### queueDispatch

▸ **queueDispatch**(): `void`

Dispatches the queue.

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[queueDispatch](IoSelectorSidebar.md#queuedispatch)

#### Defined in

[core/io-node.ts:209](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L209)

___

### queueDispatchLazy

▸ **queueDispatchLazy**(): `void`

Dispatches the queue in the next rAF cycle.

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[queueDispatchLazy](IoSelectorSidebar.md#queuedispatchlazy)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[removeEventListener](IoSelectorSidebar.md#removeeventlistener)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[requestAnimationFrameOnce](IoSelectorSidebar.md#requestanimationframeonce)

#### Defined in

[core/io-node.ts:376](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L376)

___

### scrollTo

▸ **scrollTo**(`id`, `smooth?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `smooth?` | `boolean` |

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[scrollTo](IoSelectorSidebar.md#scrollto)

#### Defined in

[elements/layout/selector.ts:117](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L117)

___

### selectedChanged

▸ **selectedChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[selectedChanged](IoSelectorSidebar.md#selectedchanged)

#### Defined in

[elements/layout/selector.ts:153](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L153)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[set](IoSelectorSidebar.md#set)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[setAttribute](IoSelectorSidebar.md#setattribute)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[setProperties](IoSelectorSidebar.md#setproperties)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[stopPropagation](IoSelectorSidebar.md#stoppropagation)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[template](IoSelectorSidebar.md#template)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[throttle](IoSelectorSidebar.md#throttle)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[traverse](IoSelectorSidebar.md#traverse)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[unbind](IoSelectorSidebar.md#unbind)

#### Defined in

[core/io-node.ts:277](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L277)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Overrides

[IoSelectorSidebar](IoSelectorSidebar.md).[update](IoSelectorSidebar.md#update)

#### Defined in

[elements/extras/md-view-selector.ts:10](https://github.com/io-gui/iogui/blob/tsc/src/elements/extras/md-view-selector.ts#L10)

___

### updateScroll

▸ **updateScroll**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[updateScroll](IoSelectorSidebar.md#updatescroll)

#### Defined in

[elements/layout/selector.ts:164](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L164)
