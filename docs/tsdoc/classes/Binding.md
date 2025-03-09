[**io-gui**](../README.md)

***

# Class: Binding

Defined in: [src/core/internals/binding.ts:35](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L35)

Property binding class that enables two-way data synchronization between `IoNode` and `IoElement` nodes.

It manages bindings between a source node's property and one or more target nodes and properties.
Using a hub-and-spoke pub/sub event system, it maintains data consistency by automatically propagating
changes to all bound nodes and properties.

Key features:
- Listens for `[propName]-changed` events to detect changes
- Sets properties using `node.setProperty(propName, value)` method
- Supports one-to-many property bindings
- Prevents circular update loops
- Automatically cleans up listeners when disposed

Note: `debug: {}` code blocks are used in dev/debug builds for sanity checks.
They print error messages if unexpected state is detected.
In theory, they should never be reached.

## Example

```ts
// Create a two-way binding between nodeA.value and nodeB.value
const binding = new Binding(nodeA, 'value');
binding.addTarget(nodeB, 'value');
```

## Constructors

### new Binding()

> **new Binding**(`node`, `property`): [`Binding`](Binding.md)

Defined in: [src/core/internals/binding.ts:46](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L46)

Creates a binding object for specified source `node` and `property`.
It attaches a `[propName]-changed` listener to the source node.

#### Parameters

##### node

[`IoNode`](IoNode.md)

Source node

##### property

`string`

Name of the sourceproperty

#### Returns

[`Binding`](Binding.md)

## Properties

### node

> `readonly` **node**: [`IoNode`](IoNode.md)

Defined in: [src/core/internals/binding.ts:36](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L36)

***

### property

> `readonly` **property**: `string` = `''`

Defined in: [src/core/internals/binding.ts:37](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L37)

***

### targetProperties

> `readonly` **targetProperties**: `TargetProperties`

Defined in: [src/core/internals/binding.ts:39](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L39)

***

### targets

> `readonly` **targets**: [`IoNode`](IoNode.md)[] = `[]`

Defined in: [src/core/internals/binding.ts:38](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L38)

## Accessors

### value

#### Get Signature

> **get** **value**(): `any`

Defined in: [src/core/internals/binding.ts:54](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L54)

##### Returns

`any`

#### Set Signature

> **set** **value**(`value`): `void`

Defined in: [src/core/internals/binding.ts:51](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L51)

##### Parameters

###### value

`any`

##### Returns

`void`

## Methods

### addTarget()

> **addTarget**(`target`, `property`): `void`

Defined in: [src/core/internals/binding.ts:94](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L94)

Adds a target node and property.
Sets itself as the binding reference on the target `PropertyInstance`.
Adds a `[propName]-changed` listener to the target node.

#### Parameters

##### target

[`IoNode`](IoNode.md)

Target node

##### property

`string`

Target property

#### Returns

`void`

***

### dispose()

> **dispose**(): `void`

Defined in: [src/core/internals/binding.ts:204](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L204)

Dispose of the binding by removing all targets and listeners.
Use this when node is no longer needed.

#### Returns

`void`

***

### getTargetProperties()

> **getTargetProperties**(`target`): `Properties`

Defined in: [src/core/internals/binding.ts:83](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L83)

Helper function to get target properties from WeakMap
Retrieves a list of target properties for specified target node.

#### Parameters

##### target

[`IoNode`](IoNode.md)

Target node.

#### Returns

`Properties`

list of target property names.

***

### onSourceChanged()

> **onSourceChanged**(`event`): `void`

Defined in: [src/core/internals/binding.ts:182](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L182)

Event handler that updates bound properties on target nodes when source node emits `[propName]-changed` event.

#### Parameters

##### event

[`ChangeEvent`](../interfaces/ChangeEvent.md)

Property change event.

#### Returns

`void`

***

### onTargetChanged()

> **onTargetChanged**(`event`): `void`

Defined in: [src/core/internals/binding.ts:167](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L167)

Event handler that updates source property when one of the targets emits `[propName]-changed` event.

#### Parameters

##### event

[`ChangeEvent`](../interfaces/ChangeEvent.md)

Property change event.

#### Returns

`void`

***

### removeTarget()

> **removeTarget**(`target`, `property`?): `void`

Defined in: [src/core/internals/binding.ts:128](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L128)

Removes target node and property.
If `property` is not specified, it removes all target properties.
Removes binding reference from the target `PropertyInstance`.
Removes `[propName]-changed` listener from the target node.

#### Parameters

##### target

[`IoNode`](IoNode.md)

Target node

##### property?

`string`

Target property

#### Returns

`void`

***

### toJSON()

> **toJSON**(): `object`

Defined in: [src/core/internals/binding.ts:63](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L63)

Returns a JSON representation of the binding.
This is required for `protoChain` serializeProperties() to work more accurately.
NOTE: this does not provide completely accurate signiture of the binding but it's good enough.

#### Returns

`object`

JSON representation of the binding.

##### node

> **node**: `string`

##### property

> **property**: `string`

##### targetProperties

> **targetProperties**: `Record`\<`string`, `Properties`\>

##### targets

> **targets**: `string`[]
