[**io-gui**](../README.md)

***

# Class: Binding

Defined in: [src/core/internals/binding.ts:11](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L11)

Property binding class.
It facilitates data binding between source node/property and target nodes/properties
using `[property]-changed` events.

## Constructors

### new Binding()

> **new Binding**(`node`, `property`): [`Binding`](Binding.md)

Defined in: [src/core/internals/binding.ts:21](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L21)

Creates a binding object for specified `node` and `property`.

#### Parameters

##### node

[`IoNode`](IoNode.md)

Property owner node

##### property

`string`

Name of the property

#### Returns

[`Binding`](Binding.md)

## Properties

### node

> `readonly` **node**: [`IoNode`](IoNode.md)

Defined in: [src/core/internals/binding.ts:12](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L12)

***

### property

> `readonly` **property**: `string` = `''`

Defined in: [src/core/internals/binding.ts:13](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L13)

***

### targetProperties

> `readonly` **targetProperties**: `WeakMap`\<[`IoNode`](IoNode.md), `string`[]\>

Defined in: [src/core/internals/binding.ts:15](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L15)

***

### targets

> `readonly` **targets**: [`IoNode`](IoNode.md)[] = `[]`

Defined in: [src/core/internals/binding.ts:14](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L14)

## Accessors

### value

#### Get Signature

> **get** **value**(): `any`

Defined in: [src/core/internals/binding.ts:29](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L29)

##### Returns

`any`

#### Set Signature

> **set** **value**(`value`): `void`

Defined in: [src/core/internals/binding.ts:26](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L26)

##### Parameters

###### value

`any`

##### Returns

`void`

## Methods

### addTarget()

> **addTarget**(`node`, `property`): `void`

Defined in: [src/core/internals/binding.ts:43](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L43)

Adds a target `node` and `targetProp` and corresponding `[property]-changed` listener, unless already added.

#### Parameters

##### node

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

Defined in: [src/core/internals/binding.ts:145](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L145)

Dispose of the binding by removing all targets and listeners.
Use this when node is no longer needed.

#### Returns

`void`

***

### getTargetProperties()

> **getTargetProperties**(`target`): `TargetProperties`

Defined in: [src/core/internals/binding.ts:90](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L90)

Helper function to get target properties from WeakMap
Retrieves a list of target properties for specified target node.

#### Parameters

##### target

[`IoNode`](IoNode.md)

Target node.

#### Returns

`TargetProperties`

list of target property names.

***

### onSourceChanged()

> **onSourceChanged**(`event`): `void`

Defined in: [src/core/internals/binding.ts:119](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L119)

Event handler that updates bound properties on target nodes when source node emits `[property]-changed` event.

#### Parameters

##### event

[`ChangeEvent`](../interfaces/ChangeEvent.md)

Property change event.

#### Returns

`void`

***

### onTargetChanged()

> **onTargetChanged**(`event`): `void`

Defined in: [src/core/internals/binding.ts:100](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L100)

Event handler that updates source property when one of the targets emits `[property]-changed` event.

#### Parameters

##### event

[`ChangeEvent`](../interfaces/ChangeEvent.md)

Property change event.

#### Returns

`void`

***

### removeTarget()

> **removeTarget**(`node`, `property`?): `void`

Defined in: [src/core/internals/binding.ts:68](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L68)

Removes target `node` and `property` and corresponding `[property]-changed` listener.
If `property` is not specified, it removes all target properties.

#### Parameters

##### node

[`IoNode`](IoNode.md)

Target node

##### property?

`string`

Target property

#### Returns

`void`

***

### toJSON()

> **toJSON**(): `string`

Defined in: [src/core/internals/binding.ts:32](https://github.com/io-gui/io/blob/main/src/core/internals/binding.ts#L32)

#### Returns

`string`
