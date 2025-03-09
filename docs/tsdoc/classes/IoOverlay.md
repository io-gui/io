[**io-gui**](../README.md)

***

# Class: IoOverlay

Defined in: [src/core/overlay.ts:29](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L29)

This element is designed to be used as a singleton `IoOverlaySingleton`.
It is a pointer-blocking element covering the entire window at a very high z-index.
It is designed to be displayed on top all other elements and contain elements like modals, popovers, floating menus etc.
When clicked, IoOverlay collapses all child elements by setting their `expanded` property to `false`.
Child elements should emmit bubbling `"expanded"` event when expanded/collapsed.

## Extends

- [`IoElement`](IoElement.md)

## Indexable

\[`key`: `string`\]: `any`

## Constructors

### new IoOverlay()

> **new IoOverlay**(`properties`): [`IoOverlay`](IoOverlay.md)

Defined in: [src/core/overlay.ts:78](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L78)

#### Parameters

##### properties

`Record`\<`string`, `any`\> = `{}`

#### Returns

[`IoOverlay`](IoOverlay.md)

#### Overrides

[`IoElement`](IoElement.md).[`constructor`](IoElement.md#constructors)

## Properties

### \_bindings

> `readonly` **\_bindings**: `Map`\<`string`, [`Binding`](Binding.md)\>

Defined in: [src/core/node.ts:44](https://github.com/io-gui/io/blob/main/src/core/node.ts#L44)

#### Inherited from

[`IoElement`](IoElement.md).[`_bindings`](IoElement.md#_bindings)

***

### \_changeQueue

> `readonly` **\_changeQueue**: [`ChangeQueue`](ChangeQueue.md)

Defined in: [src/core/node.ts:45](https://github.com/io-gui/io/blob/main/src/core/node.ts#L45)

#### Inherited from

[`IoElement`](IoElement.md).[`_changeQueue`](IoElement.md#_changequeue)

***

### \_eventDispatcher

> `readonly` **\_eventDispatcher**: [`EventDispatcher`](EventDispatcher.md)

Defined in: [src/core/node.ts:46](https://github.com/io-gui/io/blob/main/src/core/node.ts#L46)

#### Inherited from

[`IoElement`](IoElement.md).[`_eventDispatcher`](IoElement.md#_eventdispatcher)

***

### \_properties

> `readonly` **\_properties**: `Map`\<`string`, [`PropertyInstance`](PropertyInstance.md)\>

Defined in: [src/core/node.ts:43](https://github.com/io-gui/io/blob/main/src/core/node.ts#L43)

#### Inherited from

[`IoElement`](IoElement.md).[`_properties`](IoElement.md#_properties)

***

### \_protochain

> `readonly` **\_protochain**: [`ProtoChain`](ProtoChain.md)

Defined in: [src/core/node.ts:42](https://github.com/io-gui/io/blob/main/src/core/node.ts#L42)

#### Inherited from

[`IoElement`](IoElement.md).[`_protochain`](IoElement.md#_protochain)

***

### $

> **$**: `Record`\<`string`, `any`\>

Defined in: [src/core/element.ts:179](https://github.com/io-gui/io/blob/main/src/core/element.ts#L179)

#### Inherited from

[`IoElement`](IoElement.md).[`$`](IoElement.md#$)

***

### class

> **class**: `string`

Defined in: [src/core/element.ts:188](https://github.com/io-gui/io/blob/main/src/core/element.ts#L188)

#### Inherited from

[`IoElement`](IoElement.md).[`class`](IoElement.md#class)

***

### contenteditable

> **contenteditable**: `boolean`

Defined in: [src/core/element.ts:185](https://github.com/io-gui/io/blob/main/src/core/element.ts#L185)

#### Inherited from

[`IoElement`](IoElement.md).[`contenteditable`](IoElement.md#contenteditable)

***

### disabled

> **disabled**: `boolean`

Defined in: [src/core/element.ts:209](https://github.com/io-gui/io/blob/main/src/core/element.ts#L209)

#### Inherited from

[`IoElement`](IoElement.md).[`disabled`](IoElement.md#disabled)

***

### expanded

> **expanded**: `boolean`

Defined in: [src/core/overlay.ts:57](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L57)

***

### hidden

> **hidden**: `boolean`

Defined in: [src/core/element.ts:206](https://github.com/io-gui/io/blob/main/src/core/element.ts#L206)

#### Inherited from

[`IoElement`](IoElement.md).[`hidden`](IoElement.md#hidden)

***

### id

> **id**: `string`

Defined in: [src/core/element.ts:203](https://github.com/io-gui/io/blob/main/src/core/element.ts#L203)

#### Inherited from

[`IoElement`](IoElement.md).[`id`](IoElement.md#id)

***

### label

> **label**: `string`

Defined in: [src/core/element.ts:194](https://github.com/io-gui/io/blob/main/src/core/element.ts#L194)

#### Inherited from

[`IoElement`](IoElement.md).[`label`](IoElement.md#label)

***

### name

> **name**: `string`

Defined in: [src/core/element.ts:197](https://github.com/io-gui/io/blob/main/src/core/element.ts#L197)

#### Inherited from

[`IoElement`](IoElement.md).[`name`](IoElement.md#name)

***

### role

> **role**: `string`

Defined in: [src/core/element.ts:191](https://github.com/io-gui/io/blob/main/src/core/element.ts#L191)

#### Inherited from

[`IoElement`](IoElement.md).[`role`](IoElement.md#role)

***

### tabindex

> **tabindex**: `string`

Defined in: [src/core/element.ts:182](https://github.com/io-gui/io/blob/main/src/core/element.ts#L182)

#### Inherited from

[`IoElement`](IoElement.md).[`tabindex`](IoElement.md#tabindex)

***

### title

> **title**: `string`

Defined in: [src/core/element.ts:200](https://github.com/io-gui/io/blob/main/src/core/element.ts#L200)

#### Inherited from

[`IoElement`](IoElement.md).[`title`](IoElement.md#title)

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

[`IoElement`](IoElement.md).[`textNode`](IoElement.md#textnode)

***

### Listeners

#### Get Signature

> **get** `static` **Listeners**(): `object`

Defined in: [src/core/overlay.ts:59](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L59)

##### Returns

`object`

###### contextmenu

> **contextmenu**: `string` = `'_onContextmenu'`

###### focusin

> **focusin**: `string` = `'_onFocusIn'`

###### keydown

> **keydown**: (`string` \| \{ `passive`: `boolean`; \})[]

###### keyup

> **keyup**: (`string` \| \{ `passive`: `boolean`; \})[]

###### mousedown

> **mousedown**: (`string` \| \{ `passive`: `boolean`; \})[]

###### mousemove

> **mousemove**: (`string` \| \{ `passive`: `boolean`; \})[]

###### mouseup

> **mouseup**: (`string` \| \{ `passive`: `boolean`; \})[]

###### pointerdown

> **pointerdown**: (`string` \| \{ `passive`: `boolean`; \})[]

###### pointermove

> **pointermove**: (`string` \| \{ `passive`: `boolean`; \})[]

###### pointerup

> **pointerup**: `string` = `'_onPointerup'`

###### scroll

> **scroll**: `string` = `'_onScroll'`

###### touchend

> **touchend**: (`string` \| \{ `passive`: `boolean`; \})[]

###### touchmove

> **touchmove**: (`string` \| \{ `passive`: `boolean`; \})[]

###### touchstart

> **touchstart**: (`string` \| \{ `passive`: `boolean`; \})[]

###### wheel

> **wheel**: (`string` \| \{ `passive`: `boolean`; \})[]

***

### Properties

#### Get Signature

> **get** `static` **Properties**(): [`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

Defined in: [src/core/node.ts:33](https://github.com/io-gui/io/blob/main/src/core/node.ts#L33)

##### Returns

[`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

#### Inherited from

[`IoElement`](IoElement.md).[`Properties`](IoElement.md#properties)

***

### Style

#### Get Signature

> **get** `static` **Style**(): `string`

Defined in: [src/core/overlay.ts:30](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L30)

##### Returns

`string`

#### Overrides

[`IoElement`](IoElement.md).[`Style`](IoElement.md#style)

## Methods

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

[`IoElement`](IoElement.md).[`_flattenTextNode`](IoElement.md#_flattentextnode)

***

### \_onCollapse()

> **\_onCollapse**(): `void`

Defined in: [src/core/overlay.ts:94](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L94)

#### Returns

`void`

***

### \_onContextmenu()

> **\_onContextmenu**(`event`): `void`

Defined in: [src/core/overlay.ts:97](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L97)

#### Parameters

##### event

`Event`

#### Returns

`void`

***

### \_onFocusIn()

> **\_onFocusIn**(`event`): `void`

Defined in: [src/core/overlay.ts:100](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L100)

#### Parameters

##### event

`FocusEvent`

#### Returns

`void`

***

### \_onPointerup()

> **\_onPointerup**(`event`): `void`

Defined in: [src/core/overlay.ts:89](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L89)

#### Parameters

##### event

`PointerEvent`

#### Returns

`void`

***

### \_onScroll()

> **\_onScroll**(`event`): `void`

Defined in: [src/core/overlay.ts:103](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L103)

#### Parameters

##### event

`Event`

#### Returns

`void`

***

### addEventListener()

> **addEventListener**(`type`, `listener`, `options`?): `void`

Defined in: [src/core/node.ts:343](https://github.com/io-gui/io/blob/main/src/core/node.ts#L343)

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

[`IoElement`](IoElement.md).[`addEventListener`](IoElement.md#addeventlistener)

***

### appendChild()

> **appendChild**(`child`): `void`

Defined in: [src/core/overlay.ts:199](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L199)

#### Parameters

##### child

`HTMLElement`

#### Returns

`void`

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

[`IoElement`](IoElement.md).[`applyProperties`](IoElement.md#applyproperties)

***

### bind()

> **bind**(`prop`): [`Binding`](Binding.md)

Defined in: [src/core/node.ts:310](https://github.com/io-gui/io/blob/main/src/core/node.ts#L310)

Returns a binding to a specified property`.

#### Parameters

##### prop

`string`

Property to bind to.

#### Returns

[`Binding`](Binding.md)

Binding object.

#### Inherited from

[`IoElement`](IoElement.md).[`bind`](IoElement.md#bind)

***

### changed()

> **changed**(): `void`

Defined in: [src/core/node.ts:240](https://github.com/io-gui/io/blob/main/src/core/node.ts#L240)

default change handler.
Invoked when one of the properties change.

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`changed`](IoElement.md#changed)

***

### connectedCallback()

> **connectedCallback**(): `void`

Defined in: [src/core/element.ts:214](https://github.com/io-gui/io/blob/main/src/core/element.ts#L214)

Add resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`connectedCallback`](IoElement.md#connectedcallback)

***

### disabledChanged()

> **disabledChanged**(): `void`

Defined in: [src/core/element.ts:430](https://github.com/io-gui/io/blob/main/src/core/element.ts#L430)

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`disabledChanged`](IoElement.md#disabledchanged)

***

### disconnectedCallback()

> **disconnectedCallback**(): `void`

Defined in: [src/core/element.ts:222](https://github.com/io-gui/io/blob/main/src/core/element.ts#L222)

Removes resize listener if `onResized()` is defined in subclass.

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`disconnectedCallback`](IoElement.md#disconnectedcallback)

***

### dispatchEvent()

> **dispatchEvent**(`type`, `detail`, `bubbles`, `src`?): `void`

Defined in: [src/core/node.ts:368](https://github.com/io-gui/io/blob/main/src/core/node.ts#L368)

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

[`IoElement`](IoElement.md).[`dispatchEvent`](IoElement.md#dispatchevent)

***

### dispatchMutationEvent()

> **dispatchMutationEvent**(`object`): `void`

Defined in: [src/core/node.ts:375](https://github.com/io-gui/io/blob/main/src/core/node.ts#L375)

Shorthand for dispatching `'object-mutated'` event on window.

#### Parameters

##### object

`any`

object which mutated.

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`dispatchMutationEvent`](IoElement.md#dispatchmutationevent)

***

### dispatchQueue()

> **dispatchQueue**(`lazy`): `void`

Defined in: [src/core/node.ts:254](https://github.com/io-gui/io/blob/main/src/core/node.ts#L254)

Dispatches the queue in the next rAF cycle if `lazy` property is set. Otherwise it dispatches the queue immediately.

#### Parameters

##### lazy

`boolean` = `false`

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`dispatchQueue`](IoElement.md#dispatchqueue)

***

### dispose()

> **dispose**(): `void`

Defined in: [src/core/node.ts:382](https://github.com/io-gui/io/blob/main/src/core/node.ts#L382)

Disposes all internals.
Use this when instance is no longer needed.

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`dispose`](IoElement.md#dispose)

***

### expandedChanged()

> **expandedChanged**(): `void`

Defined in: [src/core/overlay.ts:221](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L221)

#### Returns

`void`

***

### init()

> **init**(): `void`

Defined in: [src/core/node.ts:241](https://github.com/io-gui/io/blob/main/src/core/node.ts#L241)

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`init`](IoElement.md#init)

***

### inputValue()

> **inputValue**(`value`): `void`

Defined in: [src/core/node.ts:229](https://github.com/io-gui/io/blob/main/src/core/node.ts#L229)

Sets value property and emits `value-input` event.
Use this when value property is set by user action (e.g. mouse click).

#### Parameters

##### value

`any`

Property value.

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`inputValue`](IoElement.md#inputvalue)

***

### labelChanged()

> **labelChanged**(): `void`

Defined in: [src/core/element.ts:423](https://github.com/io-gui/io/blob/main/src/core/element.ts#L423)

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`labelChanged`](IoElement.md#labelchanged)

***

### nudgeDown()

> **nudgeDown**(`element`, `x`, `y`, `elemRect`, `force`?): `boolean`

Defined in: [src/core/overlay.ts:108](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L108)

#### Parameters

##### element

`HTMLElement`

##### x

`number`

##### y

`number`

##### elemRect

`DOMRect`

##### force?

`boolean`

#### Returns

`boolean`

***

### nudgeLeft()

> **nudgeLeft**(`element`, `x`, `y`, `elemRect`, `force`?): `boolean`

Defined in: [src/core/overlay.ts:140](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L140)

#### Parameters

##### element

`HTMLElement`

##### x

`number`

##### y

`number`

##### elemRect

`DOMRect`

##### force?

`boolean`

#### Returns

`boolean`

***

### nudgePointer()

> **nudgePointer**(`element`, `x`, `y`, `elemRect`): `boolean`

Defined in: [src/core/overlay.ts:150](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L150)

#### Parameters

##### element

`HTMLElement`

##### x

`number`

##### y

`number`

##### elemRect

`DOMRect`

#### Returns

`boolean`

***

### nudgeRight()

> **nudgeRight**(`element`, `x`, `y`, `elemRect`, `force`?): `boolean`

Defined in: [src/core/overlay.ts:130](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L130)

#### Parameters

##### element

`HTMLElement`

##### x

`number`

##### y

`number`

##### elemRect

`DOMRect`

##### force?

`boolean`

#### Returns

`boolean`

***

### nudgeUp()

> **nudgeUp**(`element`, `x`, `y`, `elemRect`, `force`?): `boolean`

Defined in: [src/core/overlay.ts:119](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L119)

#### Parameters

##### element

`HTMLElement`

##### x

`number`

##### y

`number`

##### elemRect

`DOMRect`

##### force?

`boolean`

#### Returns

`boolean`

***

### objectMutated()

> **objectMutated**(`prop`): `void`

Defined in: [src/core/node.ts:299](https://github.com/io-gui/io/blob/main/src/core/node.ts#L299)

This function is called after `onObjectMutated()` determines that one of
the object properties has mutated.

#### Parameters

##### prop

`string`

Mutated object property name.

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`objectMutated`](IoElement.md#objectmutated)

***

### onChildExpanded()

> **onChildExpanded**(): `void`

Defined in: [src/core/overlay.ts:209](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L209)

#### Returns

`void`

***

### onChildExpandedDelayed()

> **onChildExpandedDelayed**(): `void`

Defined in: [src/core/overlay.ts:212](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L212)

#### Returns

`void`

***

### onObjectMutated()

> **onObjectMutated**(`event`): `void`

Defined in: [src/core/node.ts:278](https://github.com/io-gui/io/blob/main/src/core/node.ts#L278)

Event handler for 'object-mutated' event emitted from the `window`.
Node should be listening for this event if it has an observed object property

#### Parameters

##### event

`CustomEvent`

Event payload.

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`onObjectMutated`](IoElement.md#onobjectmutated)

***

### onResized()

> **onResized**(): `void`

Defined in: [src/core/overlay.ts:86](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L86)

#### Returns

`void`

***

### queue()

> **queue**(`prop`, `value`, `oldValue`): `void`

Defined in: [src/core/node.ts:248](https://github.com/io-gui/io/blob/main/src/core/node.ts#L248)

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

[`IoElement`](IoElement.md).[`queue`](IoElement.md#queue)

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

[`IoElement`](IoElement.md).[`Register`](IoElement.md#register)

***

### removeChild()

> **removeChild**(`child`): `void`

Defined in: [src/core/overlay.ts:204](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L204)

#### Parameters

##### child

`HTMLElement`

#### Returns

`void`

***

### removeEventListener()

> **removeEventListener**(`type`, `listener`?, `options`?): `void`

Defined in: [src/core/node.ts:358](https://github.com/io-gui/io/blob/main/src/core/node.ts#L358)

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

[`IoElement`](IoElement.md).[`removeEventListener`](IoElement.md#removeeventlistener)

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

[`IoElement`](IoElement.md).[`setAttribute`](IoElement.md#setattribute)

***

### setElementPosition()

> **setElementPosition**(`element`, `direction`, `srcRect`): `void`

Defined in: [src/core/overlay.ts:155](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L155)

#### Parameters

##### element

`HTMLElement`

##### direction

[`NudgeDirection`](../type-aliases/NudgeDirection.md)

##### srcRect

`DOMRect`

#### Returns

`void`

***

### setProperties()

> **setProperties**(`props`): `void`

Defined in: [src/core/node.ts:211](https://github.com/io-gui/io/blob/main/src/core/node.ts#L211)

Sets multiple properties in batch.
[property]-changed` events will be broadcast in the end.

#### Parameters

##### props

`any`

Map of property names and values.

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`setProperties`](IoElement.md#setproperties)

***

### setProperty()

> **setProperty**(`name`, `value`, `lazyDispatch`?): `void`

Defined in: [src/core/node.ts:119](https://github.com/io-gui/io/blob/main/src/core/node.ts#L119)

Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.

#### Parameters

##### name

`string`

Property name to set value of.

##### value

`any`

Peroperty value.

##### lazyDispatch?

`boolean` = `false`

flag to skip event dispatch.

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`setProperty`](IoElement.md#setproperty)

***

### stopPropagation()

> **stopPropagation**(`event`): `void`

Defined in: [src/core/overlay.ts:83](https://github.com/io-gui/io/blob/main/src/core/overlay.ts#L83)

#### Parameters

##### event

`Event`

#### Returns

`void`

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

[`IoElement`](IoElement.md).[`template`](IoElement.md#template)

***

### throttle()

> **throttle**(`func`, `arg`, `timeout`): `void`

Defined in: [src/core/node.ts:269](https://github.com/io-gui/io/blob/main/src/core/node.ts#L269)

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

[`IoElement`](IoElement.md).[`throttle`](IoElement.md#throttle)

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

[`IoElement`](IoElement.md).[`traverse`](IoElement.md#traverse)

***

### unbind()

> **unbind**(`prop`): `void`

Defined in: [src/core/node.ts:327](https://github.com/io-gui/io/blob/main/src/core/node.ts#L327)

Unbinds a binding to a specified property`.

#### Parameters

##### prop

`string`

Property to unbind.

#### Returns

`void`

#### Inherited from

[`IoElement`](IoElement.md).[`unbind`](IoElement.md#unbind)
