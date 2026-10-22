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
    status: completed
  - id: document-bloom
    content: "Bloom as a document render setting (Document.bloom) with a per-view override (View.bloom), added by pipelines after their passes"
    status: completed
  - id: view-msaa
    content: "MSAA as a view setting (View.msaa) that pipelines apply to their scene targets"
    status: completed
  - id: document-active-camera
    content: "Document.activeCamera (ADR-0011): the camera a document is presented through, in or outside the scene graph; views set with setCameraView() follow it. View camera methods take the document"
    status: completed
  - id: view-camera-select
    content: "Camera select per view: the document's camera, the free view, any scene camera, and lights looked through as cameras (Maya-style virtual cameras for aiming spot lights). A view override like View.bloom: the document's activeCamera stays untouched, so 'Document' switches back. Lights need a camera built from their pose (spot: fov from angle; directional/rect: orthographic). Serialize the choice with the view"
    status: pending
  - id: document-frame-hook
    content: "Per-frame GPU work for documents: Document.onBeforeDraw(renderer, delta), run by the RenderScheduler once per frame and renderer before views draw the document's changes; delta = time played forward only (ADR-0010)"
    status: completed
  - id: clipping-helpers
    content: "Clipping plane helpers for ClippingGroups as a helper overlay (clippingHelpers)"
    status: completed
  - id: probe-helpers
    content: "Light probe and probe grid helpers as a helper overlay (probeHelpers)"
    status: completed
  - id: overlay-toggles
    content: "UI to switch individual overlays per view: a viewport overlays menu of the registered overlays for the view kind, as checkboxes writing View.overlays. Planned with the effect switches as view-display-ui in three_effects.plan.md"
    status: pending
  - id: bloom-emissive
    content: "Bloom from an emissive MRT output instead of the scene color (webgpu_water blooms only emissive). Taken over by mrt-channels in three_effects.plan.md"
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

Done 2026-10-13 (`render/overlays/HelperOverlay.ts`). Decided in a grilling session:

- **One helper overlay per kind**, each a flag in `View.overlays`: `cameraHelpers`, `lightHelpers`, `skeletonHelpers`. Filtering by kind is these flags; View gets no new setting. Like every overlay they are off until a view turns them on (2026-10-13: per-overlay defaults removed for consistency; the demo lists its overlays in `OVERLAYS_3D`).
- **Built per draw, not from change listeners.** Like the component and outline overlays, `prepare()` walks the content scene and keeps one helper per object in a `KeyedPool`. Every structure, time and transform change already redraws overlays, so the helpers follow without a listener.
- **What is drawn.** Shown objects only (hidden ancestors hide helpers). A view looking through a scene camera skips that camera's helper (resolves `camera-helper-view` in the conversion plan).
  - Cameras: `CameraHelper`, always the full frustum to `far`, neutral gray.
  - Lights: point, directional and hemisphere icons at a constant screen size (each view sizes its own); spot cones (distance, angle) and rect area panels (`RectAreaLightHelper`, outline and panel) at their real size. Ambient lights and light probes have none (probes have their own overlay since 2026-10-21, `probe-helpers`).
  - Skeletons: a `SkeletonHelper` per root bone (a bone whose parent is not a bone), so skeletons show while their meshes are hidden, and bone hierarchies without a skinned mesh (BVH) draw too.
- **Selection.** Helpers of selected objects and their descendants draw in the outline colors (active brighter); a skeleton also highlights when one of its skinned meshes is selected. Not in edit mode, like the outline. No "selected only" filter until someone needs it.
- **Not pickable.** Helpers live in the overlay scene, so clicking a light's icon does not select the light. Selecting lights and cameras in the viewport needs the `Picker` to consult overlays; later.
- **Examples.** The authored helpers are gone: the `Helpers` groups and `showHelpers` in CameraExample, AnimationRetargeting and LightsRectarealight (the overlay draws its light panels), and the skeleton helper behind `showSkeleton` in AnimationSkinningBlending, whose `showModel` now hides only the meshes ([three.js_example_conversion.plan.md](./three.js_example_conversion.plan.md), Scene graph and picking).
- **No overlay UI yet.** Views switch overlays only in code (`View.overlays`), so the demo turns them on in code. A viewport overlays menu (registered overlays for the view kind, by label, as checkboxes) would let users switch any of them; not built (`overlay-toggles`).

### `clipping-helpers`

Done 2026-10-16: a fourth helper kind, `clippingHelpers`, for `ClippingGroup`s (`HelperOverlay.ts`), replacing the `PlaneHelper`s that webgl_clipping_intersection authored into its scene.

- **One square per clipping plane**, as `PlaneHelper` draws it, but sized and placed from what the group clips: centered on the group's bounding sphere center projected onto the plane, as wide as the sphere's diameter. Clipping planes are in world space (three ignores the group's transform), so nothing else moves them.
- **Outline always, fill while selected.** A fill spanning the clipped content tinted whole views (Clipping's planes span its 9-unit ground). Planes take the color of their normal's main axis (the translate gizmo's axis colors), and the selection colors when the group is selected. A disabled group (`enabled = false`) draws nothing.
- The outline is a closed `Line`: WebGPU has no line loops.

### `probe-helpers`

Done 2026-10-21: a fifth helper kind, `probeHelpers`, for `LightProbe`s and `LightProbeGrid`s (`HelperOverlay.ts`), replacing the probe helpers that five converted examples authored into their scenes behind `showProbes` (Lightprobe, Lightprobes, LightprobesComplex, LightprobesSponza, GeneratorCity).

- **Light probes:** three's `LightProbeHelper` (`LightProbeHelperGPU.js`) at the light icons' constant screen size, at the probe's world position through its own matrix: the helper's render hook would place it at the probe's local position, a draw late. The hook still takes the probe's intensity and coefficients.
- **Probe grids:** three's `LightProbeGridHelper`, spheres an eighth of the smallest probe spacing (of the largest side for a single probe), close to the sources' sizes. Hidden until the grid's first bake creates its atlas; updated when the atlas, resolution, position or size change, rebuilt when the spacing does.
- **Own materials.** Both helpers shade with a `fragmentNode`, which the TRAA views' scene pass (MRT) rejects (`triage-fragment-node-mrt` in the upstream fixes plan). The overlay pass has no MRT, so they draw as three ships them, and the bakes no longer hide helpers from their captures. A probe helper that is an example's subject stays content (LightprobeCubecamera).
- **No selection colors:** the spheres show the probes' irradiance.

### `overlay-toggles`

Switch individual overlays per view from the UI: a viewport overlays menu listing the registered overlays for the view's kind, by label, as checkboxes writing `View.overlays`. Views switch overlays only in code until then (the demo host's `VIEW_OVERLAYS`). Planned together with per-view effect switches: `view-display-ui` in [three_effects.plan.md](./three_effects.plan.md).

### `document-bloom`

Done 2026-10-16. Bloom is part of a document's look, like tone mapping, so it follows the same rule ([ADR-0006](../../packages/three/docs/adr/0006-content-scene-holds-only-content.md)): the document holds the setting, a view may override it. To be superseded by [three_effects.plan.md](./three_effects.plan.md) (2026-10-22): `Bloom` becomes the first `Effect` in `Document.effects`, and `View.bloom` and `BloomStage` go.

- **`Document.bloom`** is a `Bloom` (`enabled`, `strength`, `radius`, `threshold`: three's `BloomNode` inputs), shown in the Document tab's Rendering group. Examples declare their source's bloom (`TslVfxTornado`, `MaterialsRetroreflection`).
- **`View.bloom`**: `true` or `false` overrides, `null` follows `document.bloom.enabled`. The demo host's Scene Camera view follows the document; its perspective and axis views are off, so editing views stay unaffected. The host's View tab shows the focused viewport's view (bloom, MSAA, ...).
- **Where.** `RenderTargetPipeline` runs a `BloomStage` after `draw()`: the target's color plus `bloom()` into a target of its own, which becomes the output color. So it covers forward and post-processed pipelines alike, after TRAA and before the viewport tone-maps, as the sources compose it (`scenePass + bloom(scenePass)`). Strength, radius and threshold are uniforms; switching bloom changes only which target is presented. One stage per view, sized with it.
- **Not covered:** bloom of an emissive MRT output (webgpu_water), `bloom-emissive`.

### `view-msaa`

Done 2026-10-16. `View.msaa` draws the content with 4 samples (WebGPU allows 1 or 4), which also makes `alphaToCoverage` work: three applies it only to multisampled targets, and the views were single-sampled.

- The compositor calls `pipeline.setSamples(4 | 0)` when the flag changes and redraws. `RenderTargetPipeline` multisamples its target (three re-creates the textures); `PostProcessingPipeline` multisamples its scene pass, unless created with `{msaa: false}`.
- **TRAA cannot**: it copies the scene depth into its history (`copyTextureToTexture`), which WebGPU refuses for a multisampled texture. The demo host registers its TRAA pipeline with `msaa: false`, so the axis views ignore the flag (TRAA anti-aliases already).
- **Present material keyed by sample count.** The pipeline's depth then binds as a multisampled texture, but three's shader cache key ignores how bound textures are sampled, so a rebuilt present material reused the single-sampled binding layout (invalid bind group on every draw). The compositor appends the sample count to the material's `customProgramCacheKey`. Possibly worth an upstream issue.

### `document-frame-hook`

Done 2026-10-18. `Document.onBeforeDraw(renderer, delta)` ([ADR-0010](../../packages/three/docs/adr/0010-documents-do-frame-gpu-work-before-views-draw.md)): the frame's GPU work (compute, `CubeCamera.update`, renders into targets), run by the scheduler once per frame and renderer before views draw the document's changes. `delta` counts only time played forward, so GPU simulations are live content (ADR-0009).

### `document-active-camera`

Done 2026-10-19. `Document.activeCamera` ([ADR-0011](../../packages/three/docs/adr/0011-documents-name-an-active-camera.md)): the camera the document is presented through, like Blender's scene camera. It need not be in the scene graph. Views set with `setCameraView()` follow it, falling back to the first scene camera; the demo host's Scene Camera view does. View camera methods (`getCamera`, `getSourceCamera`, `getWorldPerPixel`) take the document. Converted examples keep their source camera as the active camera (conversion plan, Map).

### `view-camera-select`

Not scheduled (raised 2026-10-19). A camera select per view listing what it can look through: the document's camera, the free view, every scene camera, and lights looked through as cameras, as Maya's look-through: a virtual camera aims a spot light by navigating.

- **Switching back.** Choosing a camera in a view must not overwrite `Document.activeCamera`: it is a view override, like `View.bloom` over `Document.bloom`. The view keeps its own choice, with `null` meaning "follow the document" (what `setCameraView()` sets now). The document's camera stays known, so the select's "Document" entry switches back at any time, also after the document changes its camera.
- **Lights as cameras.** A view builds a camera from the light's pose (ADR-0005: scene objects are never mutated to fit a view). Spot lights get a perspective camera with the cone's angle as fov; directional and rect area lights get an orthographic one along their direction (rect area: its size). Navigating while looking through a light moves the light through an undoable operator, as planned `lockCameraToView` does for cameras.
- **Persistence.** Today `setCameraView()` and named camera requests are not serialized with the view. The select's value should be (`View.toJSON`): `document`, `free`, or an object id.
- **The list.** Cameras and lights of the document's scene, plus the active camera when it is outside the scene. Labels by name or `<ClassName>`, as the scene graph does.

