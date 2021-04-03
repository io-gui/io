## ProtoProperty

Property configuration object for a class **prototype**.
It is generated from property definitions in `static get Properties()` return object.

### ProtoProperty(prop: `ProtoProperty`, noDefaults: `boolean`)

Creates the property configuration object and sets the default values.

## Property

Property configuration object for a class **instance**.
It is copied from the corresponding `ProtoProperty`.

### Property(protoProp: `ProtoProperty`)

Creates the property configuration object and copies values from `ProtoProperty`.

## ProtoProperties

Collection of all property configurations for a class **prototype**.
Property configurations are inferred from all property definitions in the prototype chain.

### ProtoProperties(protochain: `ProtoChain`)

Creates all property configurations for specified prototype chain.

## Properties

Collection of all property configurations and values for a class **instance** compied from corresponding `ProtoProperties`.
It also takes care of attribute reflections, binding connections and queue dispatch scheduling.

### Properties(node: `Node`, protoProps: `ProtoProperties`)

Creates the properties for specified `Node`.

### .get(key: `string`) : *

Returns the property value.

### .set(key: `string`, value: `*`, skipDispatch: `boolean`)

Sets the property value, connects the bindings and sets attributes for properties with attribute reflection enabled.

### .connect()

Connects all property bindings and `Node` properties.

### .disconnect()

Disconnects all property bindings and `Node` properties.

### .dispose()

Disconnects all property bindings and `Node` properties.
Use this when properties are no loner needed.

