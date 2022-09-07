# Class: IoMdViewSelector

Core `IoElement` class.

## Hierarchy

- [`IoSelectorSidebar`](IoSelectorSidebar.md)

  ↳ **`IoMdViewSelector`**

## Constructors

### constructor

• **new IoMdViewSelector**(`props?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `props?` | `any` |

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[constructor](IoSelectorSidebar.md#constructor)

#### Defined in

[src/elements/layout/selector.ts:103](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L103)

## Properties

### \_bindings

• `Readonly` **\_bindings**: `Record`<`string`, [`Binding`](Binding.md)\> = `{}`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[_bindings](IoSelectorSidebar.md#_bindings)

#### Defined in

[src/core/io-node.ts:49](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L49)

___

### \_changeQueue

• `Readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[_changeQueue](IoSelectorSidebar.md#_changequeue)

#### Defined in

[src/core/io-node.ts:51](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L51)

___

### \_eventDispatcher

• `Readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[_eventDispatcher](IoSelectorSidebar.md#_eventdispatcher)

#### Defined in

[src/core/io-node.ts:52](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L52)

___

### \_properties

• `Readonly` **\_properties**: `Record`<`string`, [`Property`](Property.md)\> = `{}`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[_properties](IoSelectorSidebar.md#_properties)

#### Defined in

[src/core/io-node.ts:48](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L48)

## Accessors

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoSelectorSidebar.textNode

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

IoSelectorSidebar.textNode

#### Defined in

[src/core/io-element.ts:211](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L211)

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

[src/elements/layout/selector.ts:97](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L97)

___

### Properties

• `Static` `get` **Properties**(): `any`

#### Returns

`any`

#### Inherited from

IoSelectorSidebar.Properties

#### Defined in

[src/elements/layout/selector-sidebar.ts:57](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector-sidebar.ts#L57)

___

### Style

• `Static` `get` **Style**(): `string`

#### Returns

`string`

#### Inherited from

IoSelectorSidebar.Style

#### Defined in

[src/elements/layout/selector-sidebar.ts:31](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector-sidebar.ts#L31)

___

### observedAttributes

• `Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoSelectorSidebar.observedAttributes

#### Defined in

[src/core/io-element.ts:65](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L65)

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

[src/core/io-element.ts:252](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L252)

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

[src/elements/layout/selector.ts:114](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L114)

___

### \_onScroll

▸ **_onScroll**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[_onScroll](IoSelectorSidebar.md#_onscroll)

#### Defined in

[src/elements/layout/selector.ts:129](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L129)

___

### \_selectDefault

▸ **_selectDefault**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[_selectDefault](IoSelectorSidebar.md#_selectdefault)

#### Defined in

[src/elements/layout/selector.ts:107](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L107)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[addEventListener](IoSelectorSidebar.md#addeventlistener)

#### Defined in

[src/core/io-node.ts:338](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L338)

___

### applyAria

▸ **applyAria**(): `void`

Sets aria attributes.

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[applyAria](IoSelectorSidebar.md#applyaria)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[applyProperties](IoSelectorSidebar.md#applyproperties)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[attributeChangedCallback](IoSelectorSidebar.md#attributechangedcallback)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[bind](IoSelectorSidebar.md#bind)

#### Defined in

[src/core/io-node.ts:311](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L311)

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

[src/core/io-node.ts:241](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L241)

___

### collapsedChanged

▸ **collapsedChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[collapsedChanged](IoSelectorSidebar.md#collapsedchanged)

#### Defined in

[src/elements/layout/selector-sidebar.ts:73](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector-sidebar.ts#L73)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[connectedCallback](IoSelectorSidebar.md#connectedcallback)

#### Defined in

[src/elements/layout/selector.ts:118](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L118)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[disconnectedCallback](IoSelectorSidebar.md#disconnectedcallback)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[dispatchEvent](IoSelectorSidebar.md#dispatchevent)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[dispose](IoSelectorSidebar.md#dispose)

#### Defined in

[src/core/io-node.ts:219](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L219)

___

### elementsChanged

▸ **elementsChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[elementsChanged](IoSelectorSidebar.md#elementschanged)

#### Defined in

[src/elements/layout/selector.ts:166](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L166)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[filterObject](IoSelectorSidebar.md#filterobject)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[filterObjects](IoSelectorSidebar.md#filterobjects)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[flattenTextNode](IoSelectorSidebar.md#flattentextnode)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[focusTo](IoSelectorSidebar.md#focusto)

#### Defined in

[src/core/io-element.ts:359](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L359)

___

### getSlotted

▸ **getSlotted**(): (`string` \| { `collapsed`: `any` ; `options`: `any` ; `selected`: [`Binding`](Binding.md)  })[]

#### Returns

(`string` \| { `collapsed`: `any` ; `options`: `any` ; `selected`: [`Binding`](Binding.md)  })[]

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[getSlotted](IoSelectorSidebar.md#getslotted)

#### Defined in

[src/elements/layout/selector-sidebar.ts:74](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector-sidebar.ts#L74)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[objectMutated](IoSelectorSidebar.md#objectmutated)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[objectMutatedThrottled](IoSelectorSidebar.md#objectmutatedthrottled)

#### Defined in

[src/core/io-node.ts:302](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L302)

___

### onResized

▸ **onResized**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[onResized](IoSelectorSidebar.md#onresized)

#### Defined in

[src/elements/layout/selector-sidebar.ts:70](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector-sidebar.ts#L70)

___

### optionsChanged

▸ **optionsChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[optionsChanged](IoSelectorSidebar.md#optionschanged)

#### Defined in

[src/elements/layout/selector.ts:162](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L162)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[queue](IoSelectorSidebar.md#queue)

#### Defined in

[src/core/io-node.ts:248](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L248)

___

### queueDispatch

▸ **queueDispatch**(): `void`

Dispatches the queue.

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[queueDispatch](IoSelectorSidebar.md#queuedispatch)

#### Defined in

[src/core/io-node.ts:254](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L254)

___

### queueDispatchLazy

▸ **queueDispatchLazy**(): `void`

Dispatches the queue in the next rAF cycle.

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[queueDispatchLazy](IoSelectorSidebar.md#queuedispatchlazy)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[removeEventListener](IoSelectorSidebar.md#removeeventlistener)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[requestAnimationFrameOnce](IoSelectorSidebar.md#requestanimationframeonce)

#### Defined in

[src/core/io-node.ts:393](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L393)

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

[src/elements/layout/selector.ts:122](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L122)

___

### selectedChanged

▸ **selectedChanged**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[selectedChanged](IoSelectorSidebar.md#selectedchanged)

#### Defined in

[src/elements/layout/selector.ts:158](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L158)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[setProperties](IoSelectorSidebar.md#setproperties)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[setProperty](IoSelectorSidebar.md#setproperty)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[setValue](IoSelectorSidebar.md#setvalue)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[stopPropagation](IoSelectorSidebar.md#stoppropagation)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[template](IoSelectorSidebar.md#template)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[throttle](IoSelectorSidebar.md#throttle)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[traverse](IoSelectorSidebar.md#traverse)

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

[IoSelectorSidebar](IoSelectorSidebar.md).[unbind](IoSelectorSidebar.md#unbind)

#### Defined in

[src/core/io-node.ts:324](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L324)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Overrides

[IoSelectorSidebar](IoSelectorSidebar.md).[update](IoSelectorSidebar.md#update)

#### Defined in

[src/elements/extras/md-view-selector.ts:10](https://github.com/io-gui/iogui/blob/tsc/src/elements/extras/md-view-selector.ts#L10)

___

### updateScroll

▸ **updateScroll**(): `void`

#### Returns

`void`

#### Inherited from

[IoSelectorSidebar](IoSelectorSidebar.md).[updateScroll](IoSelectorSidebar.md#updatescroll)

#### Defined in

[src/elements/layout/selector.ts:169](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L169)
