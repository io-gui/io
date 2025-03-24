[**io-gui**](../README.md)

***

# Interface: ChangeEvent

Defined in: [src/core/internals/changeQueue.ts:13](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L13)

## Extends

- `Omit`\<`CustomEvent`\<[`Change`](Change.md)\>, `"target"`\>

## Properties

### detail

> `readonly` **detail**: [`Change`](Change.md)

Defined in: [src/core/internals/changeQueue.ts:15](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L15)

Returns any custom data event was created with. Typically used for synthetic events.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/CustomEvent/detail)

#### Overrides

`Omit.detail`

***

### path

> `readonly` **path**: [`IoNode`](../classes/IoNode.md)[]

Defined in: [src/core/internals/changeQueue.ts:16](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L16)

***

### target

> `readonly` **target**: [`IoNode`](../classes/IoNode.md)

Defined in: [src/core/internals/changeQueue.ts:14](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L14)
