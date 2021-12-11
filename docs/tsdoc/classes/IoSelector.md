# Class: IoSelector

## Hierarchy

- [`IoElement`](IoElement.md)

  ↳ **`IoSelector`**

  ↳↳ [`IoSelectorSidebar`](IoSelectorSidebar.md)

  ↳↳ [`IoSelectorTabs`](IoSelectorTabs.md)

## Constructors

### constructor

• **new IoSelector**(`props?`)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props?` | `any` |

#### Overrides

[IoElement](IoElement.md).[constructor](IoElement.md#constructor)

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

IoElement.compose

#### Defined in

[components/io-node.ts:55](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L55)

___

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Inherited from

IoElement.textNode

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

IoElement.textNode

#### Defined in

[components/io-element.ts:220](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L220)

___

### Listeners

• `Static` `get` **Listeners**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `content-ready` | `string` |
| `scroll` | (`string` \| { `capture`: `boolean` = true; `passive`: `boolean` = true })[] |

#### Overrides

IoElement.Listeners

#### Defined in

[elements/layout/selector.ts:94](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L94)

___

### Properties

• `Static` `get` **Properties**(): `any`

#### Returns

`any`

#### Overrides

IoElement.Properties

#### Defined in

[elements/layout/selector.ts:71](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L71)

___

### Style

• `Static` `get` **Style**(): `string`

#### Returns

`string`

#### Overrides

IoElement.Style

#### Defined in

[elements/layout/selector.ts:31](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L31)

___

### observedAttributes

• `Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

#### Inherited from

IoElement.observedAttributes

#### Defined in

[components/io-element.ts:73](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L73)

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

[IoElement](IoElement.md).[_onFocusTo](IoElement.md#_onfocusto)

#### Defined in

[components/io-element.ts:265](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L265)

___

### \_onIoContentReady

▸ **_onIoContentReady**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `CustomEvent`<`any`\> |

#### Returns

`void`

#### Defined in

[elements/layout/selector.ts:109](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L109)

___

### \_onScroll

▸ **_onScroll**(): `void`

#### Returns

`void`

#### Defined in

[elements/layout/selector.ts:124](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L124)

___

### \_selectDefault

▸ **_selectDefault**(): `void`

#### Returns

`void`

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

[IoElement](IoElement.md).[addEventListener](IoElement.md#addeventlistener)

#### Defined in

[components/io-node.ts:323](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L323)

___

### applyAria

▸ **applyAria**(): `void`

Sets aria attributes.

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[applyAria](IoElement.md#applyaria)

#### Defined in

[components/io-element.ts:253](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L253)

___

### applyCompose

▸ **applyCompose**(): `void`

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[applyCompose](IoElement.md#applycompose)

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

[IoElement](IoElement.md).[attributeChangedCallback](IoElement.md#attributechangedcallback)

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

[IoElement](IoElement.md).[bind](IoElement.md#bind)

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

[IoElement](IoElement.md).[changed](IoElement.md#changed)

#### Defined in

[components/io-node.ts:172](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L172)

___

### connect

▸ **connect**(`node?`): [`IoSelector`](IoSelector.md)

Connects the instance to another node or element.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) \| `HTMLElement` \| `Document` \| `Window` | `window` | Node to connect to. |

#### Returns

[`IoSelector`](IoSelector.md)

this

#### Inherited from

[IoElement](IoElement.md).[connect](IoElement.md#connect)

#### Defined in

[components/io-node.ts:97](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L97)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Overrides

[IoElement](IoElement.md).[connectedCallback](IoElement.md#connectedcallback)

#### Defined in

[elements/layout/selector.ts:113](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L113)

___

### disconnect

▸ **disconnect**(`node?`): [`IoSelector`](IoSelector.md)

Disconnects the instance from an another node or element.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | [`IoNode`](IoNode.md) \| `HTMLElement` \| `Document` \| `Window` | `window` | Node to disconnect from. |

#### Returns

[`IoSelector`](IoSelector.md)

this

#### Inherited from

[IoElement](IoElement.md).[disconnect](IoElement.md#disconnect)

#### Defined in

[components/io-node.ts:115](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L115)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[disconnectedCallback](IoElement.md#disconnectedcallback)

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

[IoElement](IoElement.md).[dispatchEvent](IoElement.md#dispatchevent)

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

[IoElement](IoElement.md).[dispose](IoElement.md#dispose)

#### Defined in

[components/io-node.ts:157](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L157)

___

### elementsChanged

▸ **elementsChanged**(): `void`

#### Returns

`void`

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

[IoElement](IoElement.md).[filterObject](IoElement.md#filterobject)

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

[IoElement](IoElement.md).[filterObjects](IoElement.md#filterobjects)

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

[IoElement](IoElement.md).[flattenTextNode](IoElement.md#flattentextnode)

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

[IoElement](IoElement.md).[focusTo](IoElement.md#focusto)

#### Defined in

[components/io-element.ts:372](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L372)

___

### getSlotted

▸ **getSlotted**(): `any`

#### Returns

`any`

#### Defined in

[elements/layout/selector.ts:177](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L177)

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

[IoElement](IoElement.md).[import](IoElement.md#import)

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

[IoElement](IoElement.md).[objectMutated](IoElement.md#objectmutated)

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

[IoElement](IoElement.md).[objectMutatedThrottled](IoElement.md#objectmutatedthrottled)

#### Defined in

[components/io-node.ts:257](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L257)

___

### optionsChanged

▸ **optionsChanged**(): `void`

#### Returns

`void`

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

[IoElement](IoElement.md).[preventDefault](IoElement.md#preventdefault)

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

[IoElement](IoElement.md).[queue](IoElement.md#queue)

#### Defined in

[components/io-node.ts:204](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L204)

___

### queueDispatch

▸ **queueDispatch**(): `void`

Dispatches the queue.

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[queueDispatch](IoElement.md#queuedispatch)

#### Defined in

[components/io-node.ts:210](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L210)

___

### queueDispatchLazy

▸ **queueDispatchLazy**(): `void`

Dispatches the queue in the next rAF cycle.

#### Returns

`void`

#### Inherited from

[IoElement](IoElement.md).[queueDispatchLazy](IoElement.md#queuedispatchlazy)

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

[IoElement](IoElement.md).[removeEventListener](IoElement.md#removeeventlistener)

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

[IoElement](IoElement.md).[requestAnimationFrameOnce](IoElement.md#requestanimationframeonce)

#### Defined in

[components/io-node.ts:377](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L377)

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

#### Defined in

[elements/layout/selector.ts:117](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L117)

___

### selectedChanged

▸ **selectedChanged**(): `void`

#### Returns

`void`

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

[IoElement](IoElement.md).[set](IoElement.md#set)

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

[IoElement](IoElement.md).[setAttribute](IoElement.md#setattribute)

#### Defined in

[components/io-element.ts:237](https://github.com/io-gui/iogui/blob/tsc/src/components/io-element.ts#L237)

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

[IoElement](IoElement.md).[setProperties](IoElement.md#setproperties)

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

[IoElement](IoElement.md).[stopPropagation](IoElement.md#stoppropagation)

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

[IoElement](IoElement.md).[template](IoElement.md#template)

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

[IoElement](IoElement.md).[throttle](IoElement.md#throttle)

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

[IoElement](IoElement.md).[traverse](IoElement.md#traverse)

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

[IoElement](IoElement.md).[unbind](IoElement.md#unbind)

#### Defined in

[components/io-node.ts:278](https://github.com/io-gui/iogui/blob/tsc/src/components/io-node.ts#L278)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Defined in

[elements/layout/selector.ts:180](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L180)

___

### updateScroll

▸ **updateScroll**(): `void`

#### Returns

`void`

#### Defined in

[elements/layout/selector.ts:164](https://github.com/io-gui/iogui/blob/tsc/src/elements/layout/selector.ts#L164)
