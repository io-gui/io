---
status: accepted
---

# Document edits are commands that run transactions of invertible patches

Every change to a `ThreeDocument` goes through three levels:

- **Command**: a named, serialisable intent with explicit arguments, for example `{name: 'transform.translate', args: {ids, delta, space}}`. Commands are what get repeated ("repeat last"), journaled, scripted, bound to menus and keymaps as actions, and grouped into macros. This is Maya's model: tools are interactive drivers that end by issuing a command.
- **Transaction**: one atomic group of patches produced by running a command. It is the unit of undo, of change notification and of network sync.
- **Patch**: the smallest invertible edit, keyed by stable id: `set(id, path, value)`, `insert(parentId, index, node)`, `remove(id)`, `setAttribute(geometryId, name, range | blobRef)`. The document's mutation API records the old value as each patch is applied, so the inverse is computed by the data layer, not written by hand.

Undo applies a transaction's inverse patches; redo re-applies its forward patches. No command implements `undo()`.

Interactive operators (ADR-0004) open a transaction when a drag starts. Moves write into it, and patches to the same path coalesce (first old value, last new value). Release commits one transaction and emits the equivalent command to the journal; cancel rolls back. Blender's "Adjust Last Operation" falls out of this: undo the last transaction, then re-run its command with changed arguments.

The change bus (ADR-0003) is fed by committed patches. A patch's `path` determines its change kind (`transform`, `geometry`, `material`, `structure`, `settings`), so views are tagged without extra `notify()` calls.

## Considered Options

- **Command-owned undo (Maya `MPxCommand.undoIt`, Unreal-style hand-written inverses).** Rejected as the source of truth: every command must invert itself perfectly, bugs accumulate silently, and inverses do not compose with other users' edits. We keep Maya's command layer for repeat, scripting and actions, but not for undo.
- **Snapshots (Blender memfile undo).** Robust and generic, but memory-heavy for geometry, and snapshots cannot be merged with concurrent remote edits. Large data still gets snapshot-like behaviour through immutable blobs (below).
- **Do nothing now, add undo later.** Rejected: undo is only robust if *every* mutation goes through one API from the start. Retrofitting means auditing every tool, inspector and demo that writes Three.js objects directly.

## Multi-user path

Patches keyed by stable ids are also the sync unit. The intended model is Figma's: the server orders transactions, properties resolve last-writer-wins, and child order uses fractional indices instead of array positions. Undo stays per user. Each user's stack holds only their own transactions, and an inverse patch is skipped if someone else has changed that path since (the rule behind Yjs `UndoManager` tracked origins). None of this needs building now. It only requires stable ids, path-addressed patches and no hidden mutations, which this ADR already demands.

## Consequences

- Operators, tools and inspectors stop writing Three.js objects directly. `io-editors` property edits on document objects must route through a transaction, which needs a write hook in `ioPropertyEditor`.
- Which fields of a Three.js class are document state needs a per-class schema. The existing per-class editor configs (`src/configs/**`) are the natural place to start.
- Geometry and texture data are stored as immutable, content-addressed blobs. A patch swaps the blob reference, so undoing a sculpt stroke or modifier swaps a reference instead of copying megabytes. Small edits can patch ranges.
- Selection, hover, view navigation and the active tool are session state, not document state (ADR-0007). They never sync to other users. Selection changes may optionally be recorded on the local undo stack.
- Plain Three.js writes made outside the API still render after `view.tag()`, but they are invisible to undo and sync. Debug builds should warn when a document object changes without a patch.
