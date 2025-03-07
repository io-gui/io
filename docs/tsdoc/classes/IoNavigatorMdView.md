[**io-gui**](../README.md)

***

[io-gui](../README.md) / IoNavigatorMdView

# Class: IoNavigatorMdView

Defined in: [src/elements/content/io-navigator-md-view.ts:8](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-md-view.ts#L8)

Core `IoElement` class.

## Extends

- [`IoNavigatorBase`](IoNavigatorBase.md)

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### new IoNavigatorMdView()

> **new IoNavigatorMdView**(...`args`): [`IoNavigatorMdView`](IoNavigatorMdView.md)

Defined in: [src/core/node.ts:52](https://github.com/io-gui/io/blob/main/src/core/node.ts#L52)

Creates a class instance and initializes the internals.

#### Parameters

##### args

...`any`[]

#### Returns

[`IoNavigatorMdView`](IoNavigatorMdView.md)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`constructor`](IoNavigatorBase.md#constructors)

## Properties

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

Defined in: [src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`_bindings`](IoNavigatorBase.md#_bindings)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

Defined in: [src/core/node.ts:45](https://github.com/io-gui/io/blob/main/src/core/node.ts#L45)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`_changeQueue`](IoNavigatorBase.md#_changequeue)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

Defined in: [src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`_eventDispatcher`](IoNavigatorBase.md#_eventdispatcher)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

Defined in: [src/core/node.ts:43](https://github.com/io-gui/io/blob/main/src/core/node.ts#L43)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`_properties`](IoNavigatorBase.md#_properties)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

Defined in: [src/core/node.ts:42](https://github.com/io-gui/io/blob/main/src/core/node.ts#L42)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`_protochain`](IoNavigatorBase.md#_protochain)

***

### $

> **$**: `Record`\<`string`, `any`\>

Defined in: [src/core/element.ts:179](https://github.com/io-gui/io/blob/main/src/core/element.ts#L179)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`$`](IoNavigatorBase.md#$)

***

### class

> **class**: `string`

Defined in: [src/core/element.ts:188](https://github.com/io-gui/io/blob/main/src/core/element.ts#L188)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`class`](IoNavigatorBase.md#class)

***

### collapsed

> **collapsed**: `boolean`

Defined in: [src/elements/content/io-navigator-base.ts:96](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L96)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`collapsed`](IoNavigatorBase.md#collapsed)

***

### collapseWidth

> **collapseWidth**: `number`

Defined in: [src/elements/content/io-navigator-base.ts:99](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L99)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`collapseWidth`](IoNavigatorBase.md#collapsewidth)

***

### contenteditable

> **contenteditable**: `boolean`

Defined in: [src/core/element.ts:185](https://github.com/io-gui/io/blob/main/src/core/element.ts#L185)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`contenteditable`](IoNavigatorBase.md#contenteditable)

***

### depth

> **depth**: `number`

Defined in: [src/elements/content/io-navigator-base.ts:93](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L93)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`depth`](IoNavigatorBase.md#depth)

***

### disabled

> **disabled**: `boolean`

Defined in: [src/core/element.ts:209](https://github.com/io-gui/io/blob/main/src/core/element.ts#L209)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`disabled`](IoNavigatorBase.md#disabled)

***

### elements

> **elements**: [`VDOMArray`](../type-aliases/VDOMArray.md)[]

Defined in: [src/elements/content/io-navigator-base.ts:84](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L84)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`elements`](IoNavigatorBase.md#elements)

***

### hidden

> **hidden**: `boolean`

Defined in: [src/core/element.ts:206](https://github.com/io-gui/io/blob/main/src/core/element.ts#L206)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`hidden`](IoNavigatorBase.md#hidden)

***

### id

> **id**: `string`

Defined in: [src/core/element.ts:203](https://github.com/io-gui/io/blob/main/src/core/element.ts#L203)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`id`](IoNavigatorBase.md#id)

***

### label

> **label**: `string`

Defined in: [src/core/element.ts:194](https://github.com/io-gui/io/blob/main/src/core/element.ts#L194)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`label`](IoNavigatorBase.md#label)

***

### menu

> **menu**: `"left"` \| `"top"` \| `"bottom"` \| `"right"`

Defined in: [src/elements/content/io-navigator-base.ts:90](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L90)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`menu`](IoNavigatorBase.md#menu)

***

### name

> **name**: `string`

Defined in: [src/core/element.ts:197](https://github.com/io-gui/io/blob/main/src/core/element.ts#L197)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`name`](IoNavigatorBase.md#name)

***

### options

> **options**: [`MenuOptions`](MenuOptions.md)

Defined in: [src/elements/content/io-navigator-base.ts:87](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L87)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`options`](IoNavigatorBase.md#options)

***

### role

> **role**: `string`

Defined in: [src/core/element.ts:191](https://github.com/io-gui/io/blob/main/src/core/element.ts#L191)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`role`](IoNavigatorBase.md#role)

***

### sanitize

> **sanitize**: `boolean`

Defined in: [src/elements/content/io-navigator-md-view.ts:14](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-md-view.ts#L14)

***

### slotted

> **slotted**: [`VDOMArray`](../type-aliases/VDOMArray.md)[]

Defined in: [src/elements/content/io-navigator-base.ts:81](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L81)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`slotted`](IoNavigatorBase.md#slotted)

***

### strip

> **strip**: `string`[]

Defined in: [src/elements/content/io-navigator-md-view.ts:11](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-md-view.ts#L11)

***

### tabindex

> **tabindex**: `string`

Defined in: [src/core/element.ts:182](https://github.com/io-gui/io/blob/main/src/core/element.ts#L182)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`tabindex`](IoNavigatorBase.md#tabindex)

***

### title

> **title**: `string`

Defined in: [src/core/element.ts:200](https://github.com/io-gui/io/blob/main/src/core/element.ts#L200)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`title`](IoNavigatorBase.md#title)

## Accessors

### textNode

#### Get Signature

> **get** **textNode**(): `any`

Defined in: [src/core/element.ts:393](https://github.com/io-gui/io/blob/main/src/core/element.ts#L393)

##### Returns

`any`

#### Set Signature

> **set** **textNode**(`value`): `void`

Defined in: [src/core/element.ts:397](https://github.com/io-gui/io/blob/main/src/core/element.ts#L397)

##### Parameters

###### value

`any`

##### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`textNode`](IoNavigatorBase.md#textnode)

***

### Properties

#### Get Signature

> **get** `static` **Properties**(): [`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

Defined in: [src/core/node.ts:33](https://github.com/io-gui/io/blob/main/src/core/node.ts#L33)

##### Returns

[`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`Properties`](IoNavigatorBase.md#properties)

***

### Style

#### Get Signature

> **get** `static` **Style**(): `string`

Defined in: [src/elements/content/io-navigator-base.ts:7](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L7)

##### Returns

`string`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`Style`](IoNavigatorBase.md#style)

## Methods

### \_computeCollapsed()

> **\_computeCollapsed**(): `void`

Defined in: [src/elements/content/io-navigator-base.ts:110](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L110)

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`_computeCollapsed`](IoNavigatorBase.md#_computecollapsed)

***

### \_flattenTextNode()

> **\_flattenTextNode**(`element`): `void`

Defined in: [src/core/element.ts:376](https://github.com/io-gui/io/blob/main/src/core/element.ts#L376)

Helper function to flatten textContent into a single TextNode.
Update textContent via TextNode is better for layout performance.

#### Parameters

##### element

Element to flatten.

`HTMLElement` | [`IoElement`](IoElement.md)

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`_flattenTextNode`](IoNavigatorBase.md#_flattentextnode)

***

### addEventListener()

> **addEventListener**(`type`, `listener`, `options`?): `void`

Defined in: [src/core/node.ts:342](https://github.com/io-gui/io/blob/main/src/core/node.ts#L342)

Wrapper for addEventListener.

#### Parameters

##### type

`string`

listener name.

##### listener

[`AnyEventListener`](../type-aliases/AnyEventListener.md)

listener handler.

##### options?

`AddEventListenerOptions`

event listener options.

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`addEventListener`](IoNavigatorBase.md#addeventlistener)

***

### applyProperties()

> **applyProperties**(`props`): `void`

Defined in: [src/core/element.ts:401](https://github.com/io-gui/io/blob/main/src/core/element.ts#L401)

Sets multiple properties in batch.
[property]-changed` events will be broadcast in the end.

#### Parameters

##### props

`any`

Map of property names and values.

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`applyProperties`](IoNavigatorBase.md#applyproperties)

***

### bind()

> **bind**(`prop`): [`Binding`](Binding.md)

Defined in: [src/core/node.ts:309](https://github.com/io-gui/io/blob/main/src/core/node.ts#L309)

Returns a binding to a specified property`.

#### Parameters

##### prop

`string`

Property to bind to.

#### Returns

[`Binding`](Binding.md)

Binding object.

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`bind`](IoNavigatorBase.md#bind)

***

### changed()

> **changed**(): `void`

Defined in: [src/elements/content/io-navigator-base.ts:118](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L118)

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`changed`](IoNavigatorBase.md#changed)

***

### connectedCallback()

> **connectedCallback**(): `void`

Defined in: [src/core/element.ts:214](https://github.com/io-gui/io/blob/main/src/core/element.ts#L214)

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`connectedCallback`](IoNavigatorBase.md#connectedcallback)

***

### disabledChanged()

> **disabledChanged**(): `void`

Defined in: [src/core/element.ts:430](https://github.com/io-gui/io/blob/main/src/core/element.ts#L430)

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`disabledChanged`](IoNavigatorBase.md#disabledchanged)

***

### disconnectedCallback()

> **disconnectedCallback**(): `void`

Defined in: [src/core/element.ts:222](https://github.com/io-gui/io/blob/main/src/core/element.ts#L222)

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`disconnectedCallback`](IoNavigatorBase.md#disconnectedcallback)

***

### dispatchEvent()

> **dispatchEvent**(`type`, `detail`, `bubbles`, `src`?): `void`

Defined in: [src/core/node.ts:367](https://github.com/io-gui/io/blob/main/src/core/node.ts#L367)

Wrapper for dispatchEvent.

#### Parameters

##### type

`string`

event name to dispatch.

##### detail

event detail.

##### bubbles

`boolean` = `false`

event bubbles.

##### src?

source node/element to dispatch event from.

`Node` | `Document` | `HTMLElement` | `Window`

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`dispatchEvent`](IoNavigatorBase.md#dispatchevent)

***

### dispatchMutationEvent()

> **dispatchMutationEvent**(`object`): `void`

Defined in: [src/core/node.ts:374](https://github.com/io-gui/io/blob/main/src/core/node.ts#L374)

Shorthand for dispatching `'object-mutated'` event on window.

#### Parameters

##### object

`any`

object which mutated.

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`dispatchMutationEvent`](IoNavigatorBase.md#dispatchmutationevent)

***

### dispatchQueue()

> **dispatchQueue**(): `void`

Defined in: [src/core/node.ts:249](https://github.com/io-gui/io/blob/main/src/core/node.ts#L249)

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`dispatchQueue`](IoNavigatorBase.md#dispatchqueue)

***

### dispatchQueueSync()

> **dispatchQueueSync**(): `void`

Defined in: [src/core/node.ts:259](https://github.com/io-gui/io/blob/main/src/core/node.ts#L259)

Dispatches the queue immediately.

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`dispatchQueueSync`](IoNavigatorBase.md#dispatchqueuesync)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/core/node.ts:381](https://github.com/io-gui/io/blob/main/src/core/node.ts#L381)

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`dispose`](IoNavigatorBase.md#dispose)

***

### getSlotted()

> **getSlotted**(): [`VDOMArray`](../type-aliases/VDOMArray.md)

Defined in: [src/elements/content/io-navigator-md-view.ts:16](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-md-view.ts#L16)

#### Returns

[`VDOMArray`](../type-aliases/VDOMArray.md)

#### Overrides

[`IoNavigatorBase`](IoNavigatorBase.md).[`getSlotted`](IoNavigatorBase.md#getslotted)

***

### init()

> **init**(): `void`

Defined in: [src/elements/content/io-navigator-base.ts:101](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L101)

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`init`](IoNavigatorBase.md#init)

***

### inputValue()

> **inputValue**(`value`): `void`

Defined in: [src/core/node.ts:224](https://github.com/io-gui/io/blob/main/src/core/node.ts#L224)

Sets value property and emits `value-input` event.
Use this when value property is set by user action (e.g. mouse click).

#### Parameters

##### value

`any`

Property value.

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`inputValue`](IoNavigatorBase.md#inputvalue)

***

### labelChanged()

> **labelChanged**(): `void`

Defined in: [src/core/element.ts:423](https://github.com/io-gui/io/blob/main/src/core/element.ts#L423)

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`labelChanged`](IoNavigatorBase.md#labelchanged)

***

### objectMutated()

> **objectMutated**(`prop`): `void`

Defined in: [src/core/node.ts:298](https://github.com/io-gui/io/blob/main/src/core/node.ts#L298)

This function is called after `onObjectMutated()` determines that one of
the object properties has mutated.

#### Parameters

##### prop

`string`

Mutated object property name.

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`objectMutated`](IoNavigatorBase.md#objectmutated)

***

### onObjectMutated()

> **onObjectMutated**(`event`): `void`

Defined in: [src/core/node.ts:277](https://github.com/io-gui/io/blob/main/src/core/node.ts#L277)

Event handler for 'object-mutated' event emitted from the `window`.
Node should be listening for this event if it has an observed object property

#### Parameters

##### event

`CustomEvent`

Event payload.

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`onObjectMutated`](IoNavigatorBase.md#onobjectmutated)

***

### onResized()

> **onResized**(): `void`

Defined in: [src/elements/content/io-navigator-base.ts:106](https://github.com/io-gui/io/blob/main/src/elements/content/io-navigator-base.ts#L106)

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`onResized`](IoNavigatorBase.md#onresized)

***

### queue()

> **queue**(`prop`, `value`, `oldValue`): `void`

Defined in: [src/core/node.ts:243](https://github.com/io-gui/io/blob/main/src/core/node.ts#L243)

Adds property change to the queue.

#### Parameters

##### prop

`string`

Property name.

##### value

`any`

Property value.

##### oldValue

`any`

Old property value.

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`queue`](IoNavigatorBase.md#queue)

***

### Register()

> **Register**(`ioNodeConstructor`): `void`

Defined in: [src/core/element.ts:305](https://github.com/io-gui/io/blob/main/src/core/element.ts#L305)

#### Parameters

##### ioNodeConstructor

*typeof* [`IoNode`](IoNode.md)

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`Register`](IoNavigatorBase.md#register)

***

### removeEventListener()

> **removeEventListener**(`type`, `listener`?, `options`?): `void`

Defined in: [src/core/node.ts:357](https://github.com/io-gui/io/blob/main/src/core/node.ts#L357)

Wrapper for removeEventListener.

#### Parameters

##### type

`string`

event name to listen to.

##### listener?

[`AnyEventListener`](../type-aliases/AnyEventListener.md)

listener handler.

##### options?

`AddEventListenerOptions`

event listener options.

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`removeEventListener`](IoNavigatorBase.md#removeeventlistener)

***

### setAttribute()

> **setAttribute**(`attr`, `value`): `void`

Defined in: [src/core/element.ts:414](https://github.com/io-gui/io/blob/main/src/core/element.ts#L414)

Alias for HTMLElement setAttribute where falsey values remove the attribute.

#### Parameters

##### attr

`string`

Attribute name.

##### value

Attribute value.

`string` | `number` | `boolean`

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`setAttribute`](IoNavigatorBase.md#setattribute)

***

### setProperties()

> **setProperties**(`props`): `void`

Defined in: [src/core/node.ts:206](https://github.com/io-gui/io/blob/main/src/core/node.ts#L206)

Sets multiple properties in batch.
[property]-changed` events will be broadcast in the end.

#### Parameters

##### props

`any`

Map of property names and values.

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`setProperties`](IoNavigatorBase.md#setproperties)

***

### setProperty()

> **setProperty**(`name`, `value`, `skipDispatch`?): `void`

Defined in: [src/core/node.ts:111](https://github.com/io-gui/io/blob/main/src/core/node.ts#L111)

Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.

#### Parameters

##### name

`string`

Property name to set value of.

##### value

`any`

Peroperty value.

##### skipDispatch?

`boolean`

flag to skip event dispatch.

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`setProperty`](IoNavigatorBase.md#setproperty)

***

### template()

> **template**(`vDOM`, `host`?, `cache`?): `void`

Defined in: [src/core/element.ts:234](https://github.com/io-gui/io/blob/main/src/core/element.ts#L234)

Renders DOM from virtual DOM arrays.

#### Parameters

##### vDOM

`any`[]

Array of vDOM children.

##### host?

`HTMLElement`

Optional template target.

##### cache?

`boolean`

Optional don't reuse existing elements and skip dispose

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`template`](IoNavigatorBase.md#template)

***

### throttle()

> **throttle**(`func`, `arg`, `timeout`): `void`

Defined in: [src/core/node.ts:268](https://github.com/io-gui/io/blob/main/src/core/node.ts#L268)

Throttles function execution to next frame (rAF) if the function has been executed in the current frame.

#### Parameters

##### func

[`CallbackFunction`](../type-aliases/CallbackFunction.md)

Function to throttle.

##### arg

`any` = `undefined`

argument for throttled function.

##### timeout

`number` = `1`

minimum delay in ms before executing the function.

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`throttle`](IoNavigatorBase.md#throttle)

***

### traverse()

> **traverse**(`vChildren`, `host`?, `cache`?): `void`

Defined in: [src/core/element.ts:247](https://github.com/io-gui/io/blob/main/src/core/element.ts#L247)

Recurively traverses vDOM.
TODO: test element.traverse() function!

#### Parameters

##### vChildren

`any`[]

Array of vDOM children converted by `buildTree()` for easier parsing.

##### host?

`HTMLElement`

Optional template target.

##### cache?

`boolean`

Optional don't reuse existing elements and skip dispose

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`traverse`](IoNavigatorBase.md#traverse)

***

### unbind()

> **unbind**(`prop`): `void`

Defined in: [src/core/node.ts:326](https://github.com/io-gui/io/blob/main/src/core/node.ts#L326)

Unbinds a binding to a specified property`.

#### Parameters

##### prop

`string`

Property to unbind.

#### Returns

`void`

#### Inherited from

[`IoNavigatorBase`](IoNavigatorBase.md).[`unbind`](IoNavigatorBase.md#unbind)
