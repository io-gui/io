## ProtoProperty

Property configuration object for a class prototype.
It is generated from property definitions in `static get Properties()` return object.

### ProtoProperty(prop: `ProtoProperty`, noDefaults: `boolean`)

Creates the property configuration object and sets default values.

## ProtoProperties

Collection of all property configurations for a class prototype.
Property configurations are inferred from all property definitions in the prototype chain.

### ProtoProperties(protochain: `ProtoChain`)

Creates all property configurations for specified prototype chain.

## Property

Property configuration object for a class **instance**.
It is copied from the corresponding `ProtoProperty`.

### Property(protoProp: `ProtoProperty`)

Created the property configuration object and copies values from `ProtoProperty`.

## Properties

`Properties` class.

