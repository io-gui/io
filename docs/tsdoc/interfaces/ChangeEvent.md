[io-gui](../README.md) / ChangeEvent

# Interface: ChangeEvent

## Hierarchy

- `CustomEvent`

  ↳ **`ChangeEvent`**

## Table of contents

### Properties

- [detail](ChangeEvent.md#detail)
- [path](ChangeEvent.md#path)
- [target](ChangeEvent.md#target)

## Properties

### detail

• `Readonly` **detail**: [`Change`](Change.md)

#### Overrides

CustomEvent.detail

#### Defined in

[src/core/internals/changeQueue.ts:85](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L85)

___

### path

• `Readonly` **path**: `EventTarget`[]

#### Defined in

[src/core/internals/changeQueue.ts:86](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L86)

___

### target

• `Readonly` **target**: `EventTarget`

#### Overrides

CustomEvent.target

#### Defined in

[src/core/internals/changeQueue.ts:84](https://github.com/io-gui/io/blob/main/src/core/internals/changeQueue.ts#L84)
