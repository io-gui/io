---
name: io-three Future Work
overview: Undo, commands and collaboration for packages/three (ADR-0008), plus related infrastructure. Split out of three_core_architecture.plan.md (formerly Phase 8) after Phases 1-7 shipped. Not scheduled.
todos:
  - id: document-schema
    content: "Per-class schema of document fields, seeded from src/configs"
    status: pending
  - id: editor-writes-through-transactions
    content: "ioPropertyEditor write hook so inspector edits become patches"
    status: pending
  - id: undo-stack
    content: "Per-document local UndoStack of transactions; optional selection steps"
    status: pending
  - id: command-registry
    content: "Command registry + journal: repeat last, actions, macros, adjust last operation"
    status: pending
  - id: blob-storage
    content: "Immutable content-addressed blobs for geometry/texture data"
    status: pending
  - id: bvh-picker
    content: "three-mesh-bvh accelerated Picker as optional peer dependency"
    status: pending
  - id: collaboration
    content: "Multi-user sync of transactions (server order, LWW, fractional index, per-user undo)"
    status: pending
isProject: false
---

<!-- Plan: @io-gui/three future work -->

# io-three Future Work

Formerly Phase 8 of [three_core_architecture.plan.md](./three_core_architecture.plan.md). Not scheduled. Builds on what Phases 1-7 left in place: every edit goes through `document.transact()` / operators as invertible patches, `document.history` with `revert()` / `reapply()` and commit listeners, `operators.lastCommand`, and the async `Picker` interface ([ADR-0008](../../packages/three/docs/adr/0008-commands-transactions-and-patches.md)).

### `document-schema`

Which fields of each Three.js class are document state (synced, undoable) versus runtime caches. Seed from the per-class configs in `src/configs/**`. Debug builds warn when a schema field changes without a patch.

### `editor-writes-through-transactions`

A write hook in `ioPropertyEditor` (in `@io-gui/editors`) so editing a document object's property in an inspector becomes a transaction. Needs an editors-package API decision.

### `undo-stack`

Per-document local stack of committed transactions. Undo applies inverses; redo re-applies. Optional selection steps. Undo grouping for command macros.

### `command-registry`

Maya-style commands: a registry of named commands with argument schemas, a journal (script-editor style echo), "repeat last", commands as menu and keymap actions, macros, and "adjust last operation" (undo, then re-run with changed arguments).

### `blob-storage`

Immutable, content-addressed blobs for geometry and texture data, so patches swap references and undo of heavy edits is cheap.

### `bvh-picker`

`three-mesh-bvh` as an optional peer dependency implementing `Picker` for objects.

### `collaboration`

Transactions over the network: server ordering, last-writer-wins per path, fractional indices for child order, per-user undo that skips paths changed by others since. Selection, hover and navigation stay local.
