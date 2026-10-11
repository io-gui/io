---
name: io-three Future Work
overview: Undo, commands and collaboration for packages/three (ADR-0008), plus related infrastructure, timeline follow-ups and scene helpers. Split out of three_core_architecture.plan.md (formerly Phase 8) after Phases 1-7 shipped. Not scheduled.
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
  - id: timeline-negative-delta
    content: "Pass the cause of a time change (playback delta, seek flag) to onAnimate, so live documents (ADR-0009) keep the wrap frame and ignore forward seeks"
    status: pending
  - id: timeline-frame-rate
    content: "Decide whether timeline.frameRate drives playback (video export)"
    status: pending
  - id: scene-helpers
    content: "Helpers (cameras, lights, skeletons) drawn automatically for any document as a per-view overlay"
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

### `timeline-negative-delta`

`Document.onAnimate(delta, time)` gets `delta` = the change of `timeline.currentTime`, so scrubbing back and loop wraps give negative deltas (accepted for now, 2026-10-10). Time-driven content is exact. Integrators (`mixer.update(delta)`, `rotation += delta * k`) jump back a whole duration at a wrap and only approximate earlier states when scrubbed back (mixer fades and `loop` events do not reverse). If this bites: a forward delta at wraps (continuous, but state stops following the timeline position), re-simulating from 0 on backward jumps, or `mixer.setTime(time)` where clips allow it.

Live documents ([ADR-0009](../../packages/three/docs/adr/0009-live-documents-use-the-timeline-as-a-clock.md), 2026-10-11) integrate only positive `delta`. They infer intent from its sign, which loses one frame at each wrap and treats scrubbing forward as playback. Unity (`FrameData.seekOccurred`, `timeLooped`, `evaluationType`) and Unreal (player status Playing / Scrubbing / Jumping / Stepping) pass the cause instead. Proposal: `Timeline.advance` marks its change as playback, and `onAnimate` gets a third argument such as `{playback: number, seek: boolean}`. `playback` is the transport's advance, positive across a wrap; `seek` is set for scrubbing and setting the time. Frame steps count as playback. Deferred: it changes the public `onAnimate` contract, `Editor.ts` / `Document.ts` have other uncommitted work, and only the two blending demos need it.

### `timeline-frame-rate`

`timeline.frameRate` only sets frame stepping, scrub snapping and divider steps; playback is continuous, paced by the display. Revisit with video export: fixed-step playback at `frameRate` with deterministic frame times.

### `scene-helpers`

Helpers should appear automatically for any document when enabled, instead of being authored into each example's scene. Per [ADR-0006](../../packages/three/docs/adr/0006-content-scene-holds-only-content.md) they belong in an overlay, not in `Document.scene`: helpers in the content scene leak into export, framing bounds, picking and every other view.

- A helpers overlay, toggled per view (`view.overlays`), builds `CameraHelper`, light helpers (directional, spot, point, hemisphere, rect area) and `SkeletonHelper`s for the document's scene in the view's overlay scene.
- It rebuilds on `structure` changes and updates helpers on `time` and `transform` changes, with the scene graph's `ChangeListener` pattern.
- A view looking through a scene camera skips that camera's helper. This resolves `camera-helper-view` in the conversion plan.
- Optional filters: helper kinds, selected objects only.
- When it lands, remove the authored helpers from the examples: the `Helpers` groups and `showHelpers` in CameraExample and AnimationRetargeting, and the skeleton helper behind `showSkeleton` in AnimationSkinningBlending. Until then the examples keep them ([three.js_example_conversion.plan.md](./three.js_example_conversion.plan.md), Scene graph and picking).
