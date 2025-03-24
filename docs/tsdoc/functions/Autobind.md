[**io-gui**](../README.md)

***

# Function: Autobind()

> **Autobind**(`target`, `propertyKey`, `descriptor`): `object`

Defined in: [src/core/decorators/autobind.ts:8](https://github.com/io-gui/io/blob/main/src/core/decorators/autobind.ts#L8)

Autobinds a method to the instance.

## Parameters

### target

`Object`

The target object.

### propertyKey

The name of the property.

`string` | `symbol`

### descriptor

`PropertyDescriptor`

The descriptor of the property.

## Returns

`object`

The modified descriptor.

### configurable

> **configurable**: `boolean` = `true`

### enumerable

> **enumerable**: `boolean` = `false`

### get()

#### Returns

`any`

### set()

#### Parameters

##### value

`any`

#### Returns

`void`
