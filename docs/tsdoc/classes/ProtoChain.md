[**io-gui**](../README.md)

***

# Class: ProtoChain

Defined in: [src/core/internals/protoChain.ts:33](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L33)

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

Defined in: [src/core/internals/protoChain.ts:62](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L62)

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

Defined in: [src/core/internals/protoChain.ts:37](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L37)

Array of inherited class constructors

***

### handlers

> **handlers**: `ProtoHandlers` = `[]`

Defined in: [src/core/internals/protoChain.ts:53](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L53)

Array of function names that start with "on[A-Z]" or "_on[A-Z]" for auto-binding.

***

### listeners

> **listeners**: `ProtoListeners` = `{}`

Defined in: [src/core/internals/protoChain.ts:45](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L45)

Aggregated listener definition declared in `static get Listeners()`

***

### mutationObservedProperties

> **mutationObservedProperties**: `string`[] = `[]`

Defined in: [src/core/internals/protoChain.ts:57](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L57)

Array of property names of mutation-observed object properties.

***

### properties

> **properties**: `ProtoProperties` = `{}`

Defined in: [src/core/internals/protoChain.ts:41](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L41)

Aggregated property definition declared in `static get Properties()`

***

### styles

> **styles**: `string` = `''`

Defined in: [src/core/internals/protoChain.ts:49](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L49)

Aggregated CSS style definition declared in `static get Style()`

## Methods

### addHandlers()

> **addHandlers**(`proto`): `void`

Defined in: [src/core/internals/protoChain.ts:167](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L167)

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

Defined in: [src/core/internals/protoChain.ts:139](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L139)

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

Defined in: [src/core/internals/protoChain.ts:94](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L94)

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

Defined in: [src/core/internals/protoChain.ts:110](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L110)

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

Defined in: [src/core/internals/protoChain.ts:158](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L158)

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

Defined in: [src/core/internals/protoChain.ts:224](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L224)

Auto-binds event handler methods (starting with 'on[A-Z]' or '_on[A-Z]') to preserve their 'this' context.

#### Parameters

##### node

[`IoNode`](IoNode.md)

Target node instance

#### Returns

`void`

***

### getMutationObservedProperties()

> **getMutationObservedProperties**(): `void`

Defined in: [src/core/internals/protoChain.ts:186](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L186)

Adds property names to the mutationObservedProperties array if the property has the 'observe' flag.

#### Returns

`void`

***

### serializeProperties()

> **serializeProperties**(`properties`): `string`

Defined in: [src/core/internals/protoChain.ts:127](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L127)

Serializes the properties object to a JSON string.
Note: JSON.stringify() is used to create a unique fingerprint of the properties object.
NOTE: this does not provide completely accurate signiture of the binding but it's good enough.
Not a hash in the cryptographic sense but serves the purpose.

#### Parameters

##### properties

[`PropertyDefinitions`](../type-aliases/PropertyDefinitions.md)

#### Returns

`string`

- Serialized properties

***

### validateProperties()

> **validateProperties**(): `void`

Defined in: [src/core/internals/protoChain.ts:202](https://github.com/io-gui/io/blob/main/src/core/internals/protoChain.ts#L202)

Debug only.
Validates property definitions.
Logs warnings for incorrect property definitions.

#### Returns

`void`
