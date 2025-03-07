[**io-gui**](../README.md)

***

# Function: hardenListenerDefinition()

> **hardenListenerDefinition**(`listenerDefinition`): [`ListenerDefinition`](../type-aliases/ListenerDefinition.md)

Defined in: [src/core/internals/eventDispatcher.ts:43](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L43)

Converts a loose listener definition into a strongly typed ListenerDefinition array format.
This ensures consistent handling of listeners regardless of how they were initially defined.

## Parameters

### listenerDefinition

[`ListenerDefinitionLoose`](../type-aliases/ListenerDefinitionLoose.md)

Loosely typed listener definition

## Returns

[`ListenerDefinition`](../type-aliases/ListenerDefinition.md)

Normalized listener definition in [string | listener, options?] format
