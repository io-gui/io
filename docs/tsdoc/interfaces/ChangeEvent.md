[**io-gui**](../README.md)

***

[io-gui](../README.md) / ChangeEvent

# Interface: ChangeEvent

Defined in: [src/core/internals/changeQueue.ts:83](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L83)

## Extends

- `Omit`\<`CustomEvent`\<[`Change`](Change.md)\>, `"target"`\>

## Properties

### detail

> `readonly` **detail**: [`Change`](Change.md)

Defined in: [src/core/internals/changeQueue.ts:85](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L85)

Returns any custom data event was created with. Typically used for synthetic events.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/CustomEvent/detail)

#### Overrides

`Omit.detail`

***

### path

> `readonly` **path**: [`IoNode`](../classes/IoNode.md)[]

Defined in: [src/core/internals/changeQueue.ts:86](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L86)

***

### target

> `readonly` **target**: [`IoNode`](../classes/IoNode.md)

Defined in: [src/core/internals/changeQueue.ts:84](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L84)
