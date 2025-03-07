[**io-gui**](../README.md)

***

[io-gui](../README.md) / listenerFromDefinition

# Function: listenerFromDefinition()

> **listenerFromDefinition**(`node`, `def`): [`Listener`](../type-aliases/Listener.md)

Defined in: [src/core/internals/eventDispatcher.ts:57](https://github.com/io-gui/io/blob/main/src/core/internals/eventDispatcher.ts#L57)

Converts a listener definition into a normalized Listener tuple.
If the first item is a string, it looks up the method on the node.

## Parameters

### node

The node instance containing potential method references

`EventTarget` | [`IoNode`](../classes/IoNode.md)

### def

[`ListenerDefinition`](../type-aliases/ListenerDefinition.md)

The listener definition to normalize

## Returns

[`Listener`](../type-aliases/Listener.md)

Normalized [listener, options?] tuple
