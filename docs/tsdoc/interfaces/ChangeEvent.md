[**io-gui**](../README.md) • **Docs**

***

[io-gui](../README.md) / ChangeEvent

# Interface: ChangeEvent

## Extends

- `CustomEvent`

## Properties

### detail

> `readonly` **detail**: [`Change`](Change.md)

Returns any custom data event was created with. Typically used for synthetic events.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/CustomEvent/detail)

#### Overrides

`CustomEvent.detail`

#### Defined in

[src/core/internals/changeQueue.ts:85](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L85)

***

### path

> `readonly` **path**: `EventTarget`[]

#### Defined in

[src/core/internals/changeQueue.ts:86](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L86)

***

### target

> `readonly` **target**: `EventTarget`

Returns the object to which event is dispatched (its target).

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Event/target)

#### Overrides

`CustomEvent.target`

#### Defined in

[src/core/internals/changeQueue.ts:84](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L84)
