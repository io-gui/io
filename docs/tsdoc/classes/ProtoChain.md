[**io-gui**](../README.md)

***

# Class: ProtoChain

Defined in: [src/core/internals/protoChain.ts:48](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L48)

ProtoChain manages class inheritance metadata and configuration.

This utility class traverses the prototype chain during class registration to:
- Aggregate property configurations
- Aggregate event listeners
- Aggregate CSS styles strings
- Auto-bind event handlers to maintain proper 'this' context

This class is internal and instantiated during the `Register()` process.

## Constructors

### new ProtoChain()

> **new ProtoChain**(`ioNodeConstructor`): [`ProtoChain`](ProtoChain.md)

Defined in: [src/core/internals/protoChain.ts:81](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L81)

Creates an instance of `ProtoChain` for specified class constructor.

#### Parameters

##### ioNodeConstructor

[`IoNodeConstructor`](../interfaces/IoNodeConstructor.md)\<`any`\>

Owner `IoNode` constructor.

#### Returns

[`ProtoChain`](ProtoChain.md)

## Properties

### constructors

> **constructors**: `ProtoConstructors` = `[]`

Defined in: [src/core/internals/protoChain.ts:52](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L52)

Array of inherited class constructors

***

### handlers

> **handlers**: `ProtoHandlers` = `[]`

Defined in: [src/core/internals/protoChain.ts:68](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L68)

Array of function names that start with "on[A-Z]" or "_on[A-Z]" for auto-binding.

***

### listeners

> **listeners**: `ProtoListeners` = `{}`

Defined in: [src/core/internals/protoChain.ts:60](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L60)

Aggregated listener definition declared in `static get Listeners()`

***

### observedIoNodeProperties

> **observedIoNodeProperties**: `string`[] = `[]`

Defined in: [src/core/internals/protoChain.ts:76](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L76)

Array of property names of mutation-observed IoNode properties.

***

### observedObjectProperties

> **observedObjectProperties**: `string`[] = `[]`

Defined in: [src/core/internals/protoChain.ts:72](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L72)

Array of property names of mutation-observed object properties.

***

### properties

> **properties**: `ProtoProperties` = `{}`

Defined in: [src/core/internals/protoChain.ts:56](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L56)

Aggregated property definition declared in `static get Properties()`

***

### styles

> **styles**: `string` = `''`

Defined in: [src/core/internals/protoChain.ts:64](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L64)

Aggregated CSS style definition declared in `static get Style()`

## Methods

### addHandlers()

> **addHandlers**(`proto`): `void`

Defined in: [src/core/internals/protoChain.ts:183](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L183)

Adds function names that start with "on[A-Z]" or "_on[A-Z]" to the handlers array.

#### Parameters

##### proto

[`IoNode`](IoNode.md)

Prototype object to search for handlers

#### Returns

`void`

***

### addListeners()

> **addListeners**(`listenerDefs`?): `void`

Defined in: [src/core/internals/protoChain.ts:155](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L155)

Merges or appends a listener definitions to the existing listeners array.

#### Parameters

##### listenerDefs?

[`ListenerDefinitions`](../type-aliases/ListenerDefinitions.md)

Listener definitions to add

#### Returns

`void`

***

### addPropertiesFromDecorators()

> **addPropertiesFromDecorators**(`ioNodeConstructor`): `void`

Defined in: [src/core/internals/protoChain.ts:116](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L116)

Adds properties defined in decorators to the properties array.

#### Parameters

##### ioNodeConstructor

[`IoNodeConstructor`](../interfaces/IoNodeConstructor.md)\<`any`\>

Owner `IoNode` constructor.

#### Returns

`void`

***

### addStaticProperties()

> **addStaticProperties**(`properties`, `prevHash`): `string`

Defined in: [src/core/internals/protoChain.ts:132](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L132)

Adds static properties from `static get Properties()` to the properties array.
Only process properties if they differ from superclass.
This prevents 'static get Properties()' from overriding subclass properties defined in decorators.

#### Parameters

##### properties

[`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md) = `{}`

Properties to add

##### prevHash

`string` = `''`

Previous properties hash

#### Returns

`string`

- Updated properties hash

***

### addStyles()

> **addStyles**(`style`?): `void`

Defined in: [src/core/internals/protoChain.ts:174](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L174)

Adds a style string to the styles array.

#### Parameters

##### style?

`string`

Style string to add

#### Returns

`void`

***

### autobindHandlers()

> **autobindHandlers**(`node`): `void`

Defined in: [src/core/internals/protoChain.ts:257](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L257)

Auto-binds event handler methods (starting with 'on[A-Z]' or '_on[A-Z]') to preserve their 'this' context.
NOTE: Defining handlers as arrow functions will not work because they are not defined before constructor has finished.

#### Parameters

##### node

[`IoNode`](IoNode.md)

Target node instance

#### Returns

`void`

***

### getObservedIoNodeProperties()

> **getObservedIoNodeProperties**(): `string`[]

Defined in: [src/core/internals/protoChain.ts:217](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L217)

Creates observedIoNodeProperties array.

#### Returns

`string`[]

- Array of property names that are observed as IoNode objects.

***

### getObservedObjectProperties()

> **getObservedObjectProperties**(): `string`[]

Defined in: [src/core/internals/protoChain.ts:202](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L202)

Creates observedObjectProperties array.

#### Returns

`string`[]

- Array of property names that are observed as native objects.

***

### validateProperties()

> **validateProperties**(): `void`

Defined in: [src/core/internals/protoChain.ts:234](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L234)

Debug only.
Validates property definitions.
Logs warnings for incorrect property definitions.

#### Returns

`void`
