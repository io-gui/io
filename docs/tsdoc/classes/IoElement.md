# Class: IoElement

Core `IoElement` class.

## Hierarchy

- `__class`<{}, `this`\>

  ↳ **`IoElement`**

  ↳↳ [`IoGl`](IoGl.md)

  ↳↳ [`IoItem`](IoItem.md)

  ↳↳ [`IoContent`](IoContent.md)

  ↳↳ [`IoNumberSlider`](IoNumberSlider.md)

  ↳↳ [`IoNumberSliderRange`](IoNumberSliderRange.md)

  ↳↳ [`IoIcon`](IoIcon.md)

  ↳↳ [`IoMdView`](IoMdView.md)

  ↳↳ [`IoElementDemo`](IoElementDemo.md)

  ↳↳ [`IoLayout`](IoLayout.md)

  ↳↳ [`IoCollapsable`](IoCollapsable.md)

  ↳↳ [`IoSelector`](IoSelector.md)

  ↳↳ [`IoSidebar`](IoSidebar.md)

  ↳↳ [`IoVector`](IoVector.md)

  ↳↳ [`IoMatrix`](IoMatrix.md)

  ↳↳ [`IoMenuOptions`](IoMenuOptions.md)

  ↳↳ [`IoOptionMenu`](IoOptionMenu.md)

  ↳↳ [`IoContextMenu`](IoContextMenu.md)

  ↳↳ [`IoNotify`](IoNotify.md)

  ↳↳ [`IoInspector`](IoInspector.md)

  ↳↳ [`IoObject`](IoObject.md)

  ↳↳ [`IoProperties`](IoProperties.md)

## Constructors

### constructor

• **new IoElement**(`properties?`, ...`args`)

Creates a class instance and initializes the internals.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `properties` | `Record`<`string`, `any`\> | Initial property values. |
| `...args` | `any`[] | - |

#### Inherited from

IoNodeMixin(HTMLElement).constructor

#### Defined in

[core/io-node.ts:61](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L61)

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

IoNodeMixin(HTMLElement).compose

#### Defined in

[core/io-node.ts:54](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L54)

___

### textNode

• `get` **textNode**(): `any`

#### Returns

`any`

#### Defined in

[core/io-element.ts:216](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L216)

• `set` **textNode**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`void`

#### Defined in

[core/io-element.ts:220](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L220)

___

### Listeners

• `Static` `get` **Listeners**(): `any`

#### Returns

`any`

#### Defined in

[core/io-element.ts:68](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L68)

___

### Properties

• `Static` `get` **Properties**(): `any`

#### Returns

`any`

#### Overrides

IoNodeMixin(HTMLElement).Properties

#### Defined in

[core/io-element.ts:20](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L20)

___

### Style

• `Static` `get` **Style**(): `any`

#### Returns

`any`

#### Defined in

[core/io-element.ts:9](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L9)

___

### observedAttributes

• `Static` `get` **observedAttributes**(): `string`[]

#### Returns

`string`[]

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

#### Defined in

[core/io-element.ts:265](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L265)

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

IoNodeMixin(HTMLElement).addEventListener

#### Defined in

[core/io-node.ts:322](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L322)

___

### applyAria

▸ **applyAria**(): `void`

Sets aria attributes.

#### Returns

`void`

#### Defined in

[core/io-element.ts:253](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L253)

___

### applyCompose

▸ **applyCompose**(): `void`

#### Returns

`void`

#### Overrides

IoNodeMixin(HTMLElement).applyCompose

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

IoNodeMixin(HTMLElement).bind

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

IoNodeMixin(HTMLElement).changed

#### Defined in

[core/io-node.ts:171](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L171)

___

### connect

▸ **connect**(`node?`): [`IoElement`](IoElement.md)

Connects the instance to another node or element.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | `HTMLElement` \| [`IoNode`](IoNode.md) \| `Document` \| `Window` | `window` | Node to connect to. |

#### Returns

[`IoElement`](IoElement.md)

this

#### Inherited from

IoNodeMixin(HTMLElement).connect

#### Defined in

[core/io-node.ts:96](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L96)

___

### connectedCallback

▸ **connectedCallback**(): `void`

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Overrides

IoNodeMixin(HTMLElement).connectedCallback

#### Defined in

[core/io-element.ts:101](https://github.com/io-gui/iogui/blob/tsc/src/core/io-element.ts#L101)

___

### disconnect

▸ **disconnect**(`node?`): [`IoElement`](IoElement.md)

Disconnects the instance from an another node or element.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | `HTMLElement` \| [`IoNode`](IoNode.md) \| `Document` \| `Window` | `window` | Node to disconnect from. |

#### Returns

[`IoElement`](IoElement.md)

this

#### Inherited from

IoNodeMixin(HTMLElement).disconnect

#### Defined in

[core/io-node.ts:114](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L114)

___

### disconnectedCallback

▸ **disconnectedCallback**(): `void`

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Overrides

IoNodeMixin(HTMLElement).disconnectedCallback

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

IoNodeMixin(HTMLElement).dispatchEvent

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

IoNodeMixin(HTMLElement).dispose

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

IoNodeMixin(HTMLElement).filterObject

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

IoNodeMixin(HTMLElement).filterObjects

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

IoNodeMixin(HTMLElement).import

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

IoNodeMixin(HTMLElement).objectMutated

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

IoNodeMixin(HTMLElement).objectMutatedThrottled

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

IoNodeMixin(HTMLElement).preventDefault

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

IoNodeMixin(HTMLElement).queue

#### Defined in

[core/io-node.ts:203](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L203)

___

### queueDispatch

▸ **queueDispatch**(): `void`

Dispatches the queue.

#### Returns

`void`

#### Inherited from

IoNodeMixin(HTMLElement).queueDispatch

#### Defined in

[core/io-node.ts:209](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L209)

___

### queueDispatchLazy

▸ **queueDispatchLazy**(): `void`

Dispatches the queue in the next rAF cycle.

#### Returns

`void`

#### Inherited from

IoNodeMixin(HTMLElement).queueDispatchLazy

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

IoNodeMixin(HTMLElement).removeEventListener

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

IoNodeMixin(HTMLElement).requestAnimationFrameOnce

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

IoNodeMixin(HTMLElement).set

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

#### Overrides

IoNodeMixin(HTMLElement).setProperties

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

IoNodeMixin(HTMLElement).stopPropagation

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

IoNodeMixin(HTMLElement).throttle

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

IoNodeMixin(HTMLElement).unbind

#### Defined in

[core/io-node.ts:277](https://github.com/io-gui/iogui/blob/tsc/src/core/io-node.ts#L277)