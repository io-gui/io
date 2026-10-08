---
name: io-three Core Architecture
overview: Re-architect packages/three around app / view / frame layers (ADR-0001..0007). WebGPU only. One RenderScheduler renders typed dirty views; ThreeView holds per-view state; per-viewport InputRouter arbitrates navigation, tools and selection; one SelectionModel typed by attribute domain. Seven phases, each shippable, ThreeApplet kept as a shim.
todos:
  - id: adrs
    content: "Docs: Write ADR-0001..0007 in packages/three/docs/adr"
    status: completed
  - id: decide-open-questions
    content: "Decide: naming (ThreeEditor vs ThreeApplet), one vs many documents, undo strategy, BVH dependency"
    status: completed
  - id: adr-0008-review
    content: "Docs: Review ADR-0008 (commands, transactions, patches) and flip proposed to accepted"
    status: pending
  - id: webgpu-only
    content: "P1: Remove WebGL fallback; explicit error when WebGPU is unavailable"
    status: completed
  - id: change-bus
    content: "P1: ChangeBus with typed changes; ThreeView.listens(change) predicate"
    status: completed
  - id: render-scheduler
    content: "P1: RenderScheduler singleton: renderer init, rAF after core, typed dirty tags, phases, budget"
    status: completed
  - id: viewport-on-scheduler
    content: "P1: IoThreeViewport registers with scheduler; remove debounce draws and three-applet-needs-render"
    status: completed
  - id: applet-shim-p1
    content: "P1: ThreeApplet loses rAF loop, Timer, _width/_height; onAnimate via scheduler tick; fix demos"
    status: completed
  - id: three-view-model
    content: "P2: ThreeView model (kind, navigation, shading, overlays, profile) with JSON round-trip"
    status: completed
  - id: view-navigation
    content: "P2: ViewNavigation + buildViewCamera(); replace ViewCameras and overscan mutation"
    status: completed
  - id: viewport-takes-view
    content: "P2: IoThreeViewport({view}); cameraSelect compat mapping; views survive layout tab moves"
    status: completed
  - id: input-router
    content: "P3: InputRouter + Behavior: capture by priority, hover pass, stealing, keyboard routing"
    status: completed
  - id: keymaps
    content: "P3: Keymap tables, matcher and Blender/Maya navigation presets"
    status: completed
  - id: navigation-behaviors
    content: "P3: Orbit/pan/dolly/wheel/touch navigation behaviors; remove OrbitControls"
    status: completed
  - id: toolbase-adapter
    content: "P3: Tool.createBehaviors(view); ToolBase becomes adapter; registerViewport deprecated"
    status: completed
  - id: editor-document
    content: "P4: ThreeEditor + ThreeDocument; ThreeApplet becomes shim over them; clock on editor"
    status: completed
  - id: document-transactions
    content: "P4: ThreeDocument mutation API: patches, transactions, coalescing, rollback; commits feed change bus"
    status: completed
  - id: document-switching
    content: "P4: editor.document switchable at runtime; per-document session maps (selection, nav, undo)"
    status: completed
  - id: operators
    content: "P4: Operator contract, registry, modal operators as top-priority behavior running inside a transaction"
    status: completed
  - id: tool-registry
    content: "P4: Active tool per (viewKind, mode); interaction profile filters router behaviors"
    status: completed
  - id: selection-model
    content: "P5: SelectionModel (object domain), transactions, undo, change notifications"
    status: completed
  - id: object-picking
    content: "P5: Async Picker interface; plain Raycaster implementation for objects"
    status: completed
  - id: select-behaviors
    content: "P5: Click and box select as fallback behaviors; inspector follows selection.active"
    status: completed
  - id: pipeline-registry
    content: "P6: ViewPipeline contract + registry; ForwardPipeline; tone mapping from document settings"
    status: completed
  - id: postprocessing-pipeline
    content: "P6: PostProcessing-based pipeline exposing depth; continuous/converged support"
    status: completed
  - id: overlay-system
    content: "P6: Overlay providers (grid, selection outline, passepartout); overlay-only redraw"
    status: completed
  - id: gizmos-transform
    content: "P6: GizmoGroup + translate gizmo + modal transform operator"
    status: completed
  - id: uv-view
    content: "P6: uv view kind: UVPipeline, 2D navigation, edit set UV layout, select-only profile"
    status: completed
  - id: topology-cache
    content: "P7: Versioned topology cache (welded points, edge table, corners)"
    status: completed
  - id: geometry-adapters
    content: "P7: GeometryAdapter contract + Mesh/Points/LineSegments adapters"
    status: completed
  - id: id-pass-picking
    content: "P7: GPU ID pass picking for components (pixel and rectangle readback)"
    status: completed
  - id: component-selection
    content: "P7: Component selection (point/edge/primitive/corner bitsets), edit mode, UV sync"
    status: completed
  - id: docs-sync
    content: "Docs: CONTEXT.md glossary, README, io-gui-three skill updated at the end of each phase"
    status: pending
isProject: false
---

<!-- Plan: @io-gui/three core architecture -->

# io-three Core Architecture

## Observations

Evaluation of `packages/three` (2026-10-06, branch `docs`). The package already supports several viewports over one `ThreeApplet`: a shared `WebGPURenderer` with a `CanvasTarget` per viewport, IntersectionObserver visibility, and a `ToolBase` that can `registerViewport()` on many viewports at once. What it lacks is the structure a DCC-style app needs on top of that:

1. **Per-viewport state leaks into the applet.** `ThreeApplet._width/_height/onResized` are written by whichever viewport draws last.
2. **Rendering is a side effect of reactivity.** Viewports redraw on any `mutated()` and on a per-frame bubbling `three-applet-needs-render` event, with no budget, ordering or progressive rendering.
3. **View state is camera objects.** `ViewCameras` holds seven cameras + `OrbitControls`, mutates scene cameras for overscan, and picks scene cameras by name.
4. **Input has no arbitration.** `OrbitControls` and `ToolBase` both listen on the element; `ToolBase` stops every event.
5. **No app-level concepts.** No active tool, mode, keymap, operator, undo, selection or overlay layer.

Full analysis and prior art (Blender, Maya, Houdini, Unreal ITF): the design doc "io-three: Core Viewport & Interaction Architecture". Decisions: `packages/three/docs/adr/0001`–`0007`.

## Approach

Seven phases. Future work (undo, commands, collaboration) moved to [three_future_work.plan.md](./three_future_work.plan.md). Each phase ships on its own, keeps the 16 demos in `src/demos/examples` working, and ends with a docs sync. Order follows dependencies: frame layer, then view state, then input, then app concepts, then selection, then rendering variety, then components.

Compatibility rule for every phase: `ThreeApplet`, `ioThreeViewport({applet, cameraSelect, tool})` and `ToolBase` subclasses keep working until the final cleanup, with `debug:` deprecation warnings. External apps subclass `ToolBase` (for example a globe tool with drag orbit and wheel zoom), so the adapter matters.

Verification for every phase: `pnpm lint:check`, `tsc -b`, `npx vitest run packages/three`, and a manual run of the multi-viewport `IoCameraExample` plus one animated demo.

### Proposed source layout

```
packages/three/src/
  editor/     ThreeEditor.ts, ThreeDocument.ts, ChangeBus.ts
  view/       ThreeView.ts, ViewNavigation.ts, buildViewCamera.ts
  render/     RenderScheduler.ts, ViewPipeline.ts, pipelines/*, overlays/*
  input/      InputRouter.ts, Behavior.ts, ViewInputEvent.ts, Keymap.ts, behaviors/*
  tools/      Tool.ts, ToolBase.ts (adapter), Operator.ts, UndoStack.ts, gizmos/*
  selection/  SelectionModel.ts, ComponentSet.ts, Picker.ts, GeometryAdapter.ts, topology/*
  elements/   IoThreeViewport.ts (DOM only), math/*, ...
  nodes/      ThreeApplet.ts (shim)
```

---

## Before starting

### Decisions (2026-10-07)

**Todo:** `decide-open-questions`
**Status:** completed

- **Naming.** `ThreeEditor` is the app object. `ThreeApplet` remains only as a compatibility shim.
- **Documents.** One active `ThreeDocument` per editor, switchable at runtime via `editor.document`. Per-document session state (selection, navigation per view, undo) lives in editor maps keyed by document id. Recorded in ADR-0002.
- **Undo.** Commands run transactions of invertible patches; undo replays inverse patches; commands are Maya-style intents for repeat, journal, actions and macros; the patch stream is the future multi-user sync unit. Recorded in ADR-0008 (proposed). Only the mutation API (`document-transactions`) is built now, because undo is robust only if every edit goes through it from the start. The undo stack and commands are future work ([three_future_work.plan.md](./three_future_work.plan.md)).
- **Picking.** Async `Picker` interface, plain `Raycaster` first. `three-mesh-bvh` (optional peer) and rasterised ID buffers come later behind the same interface. Recorded in ADR-0007.

### `adr-0008-review`

Read ADR-0008 and either accept it or change it before `document-transactions` starts.

---

## Phase 1: Frame layer (ADR-0001, ADR-0003)

**Done 2026-10-07.** Notes from implementation:
- `ChangeBus` lives at `editor/ChangeBus.ts`; its record type is `DocumentChange` (core already exports `Change`). Kinds add `'other'` for `requestRender()`.
- The scheduler is generic over `ScheduledView` / `ScheduledTicker` interfaces and testable with `autoStart: false` + `step()`. The loop starts from a microtask so it runs after core's `FrameScheduler` in each frame (tested).
- Custom per-viewport renderers stay supported (log-depth demo needs one); see ADR-0001 consequences.
- `ThreeApplet` keeps `_renderer` / `onRendererInitialized` (demos do PMREM and compute setup there). `onResized(w, h, viewport)` now fires on viewport resize only, not every draw.
- WebGPU canvases are blank in headless Chromium screenshots; manual checks need a headed browser.

### `webgpu-only`

**Files:** `elements/IoThreeViewport.ts`, `IoThreeViewport.test.ts`, README, skill

Remove the WebGL branch of `attachSurface()` and `isWebGPUBackend()`. If `WebGPU.isAvailable()` is false, the scheduler throws one clear error and viewports render a static message.

### `change-bus`

**Files:** `editor/ChangeBus.ts` (+ test)

```ts
type ChangeKind = 'transform' | 'geometry' | 'material' | 'structure' | 'selection' | 'settings' | 'time'
interface Change { kind: ChangeKind; source: object /* document */; ids?: string[] }
```

`bus.notify(change)` queues; the scheduler drains it once per frame. No reactive events per change. In P1 the bus lives on the applet; it moves to `ThreeEditor` in P4.

### `render-scheduler`

**Files:** `render/RenderScheduler.ts` (+ test)

- Singleton. Owns `WebGPURenderer`, awaits `init()` once (replaces the retry debounce).
- Starts its rAF loop on first `register(view)`. Because `@io-gui/three` imports core first, its rAF callback runs after core's `FrameScheduler` in each frame; add a test that asserts this order.
- `tag(target, reason)` with `DirtyReason = 'content' | 'view' | 'overlay' | 'resize' | 'continuous'`.
- Phases: collect, tick, evaluate (`updateMatrixWorld` once per scene, `matrixWorldAutoUpdate` off during draw), draw (priority: focused, hovered, rest; 12 ms default budget), settle.
- In P1 the draw step calls the existing inline render (pipelines arrive in P6).

**Test:** two registered views, one tagged, one not: only the tagged one draws. Budget exceeded: the remaining view draws next frame. Untagged views never draw.

### `viewport-on-scheduler`

**Files:** `elements/IoThreeViewport.ts`, tests

Viewport registers on connect and unregisters on disconnect. Resize tags `resize`, IntersectionObserver sets visibility on the scheduler entry. Remove `renderViewportDebounced`, the `mutated()`/`appletMutated()`/`viewCamerasMutated()` draw triggers and the `three-applet-needs-render` / `three-applet-frame-object-all` listeners.

### `applet-shim-p1`

**Files:** `nodes/ThreeApplet.ts`, demos

Remove the module `rAFLoop`, per-applet `Timer`, `_renderer`, `_width`, `_height`, `updateViewportSize`. The scheduler tick calls `onAnimate(delta, time)` for playing applets and tags their views `content`. `onResized(width, height, view)` gets the view and is deprecated. Fix `CameraExample` and `CameraArrayExample`, which set camera aspect from `onResized`.

---

## Phase 2: View layer (ADR-0002, ADR-0005)

**Done 2026-10-07.** Notes from implementation:
- Files: `view/ThreeView.ts` (model + `getCamera()` builder, no separate `buildViewCamera.ts`), `view/ViewNavigation.ts`, `view/ViewOrbitControls.ts` (temporary OrbitControls bridge, removed in P3). `nodes/ViewCameras.ts` deleted.
- `shading`, `overlays` and `profile` were not added yet: they land with the phases that use them (P3 profile, P6 shading/overlays).
- Navigation frames a square; the camera builder fits it into any aspect ("contain"), so framing does not depend on viewport size. Orthographic size = `distance * tan(fov/2)`; orthographic clip is symmetric around the eye.
- ~~`cameraSelect` stays as a non-deprecated shorthand; default `''` leaves a passed-in view untouched. Scene cameras resolve to uuid; a camera added later (async load) is picked up on `frame-object`, applet mutation or draw.~~ Removed 2026-10-08: the camera is chosen on `ThreeView` (`setAxisView('free' | axis)`, `setCameraView(id?)`: `'uuid:…'`, `'name:…'`, or none for the first scene camera).
- `frame-object` is handled by the viewport; framing keeps the view direction (old code reset every camera to its default direction first).
- Breaking: `IoThreeViewport.overscan/clearColor/clearAlpha/viewCameras` removed (moved to `view`); `ViewCameras` export removed. External code using `viewport.viewCameras.camera` should use `viewport.getViewCamera()`.
- Gotcha: construct `OrbitControls` without the element and call `connect()`; passing it to the constructor makes `connect()` disconnect first and io-gui logs "Listener not found".

### `three-view-model`

**Files:** `view/ThreeView.ts` (+ test)

`ReactiveObject` with `kind`, `navigation`, `shading`, `overlays` (flags object), `profile`, `clearColor`, `clearAlpha`, `overscan`. `listens(change)` predicate (default: content changes of its document, selection changes when selection overlays are on). `toJSON` / `fromJSON` for layout persistence.

### `view-navigation`

**Files:** `view/ViewNavigation.ts`, `view/buildViewCamera.ts` (+ tests); delete `nodes/ViewCameras.ts` after migration

State: `target`, `rotation`, `distance`, `projection`, `fov`, `axisView`, `cameraSource` (uuid), `lockCameraToView`, `lockGroup`. `buildViewCamera(view, width, height)` returns a private camera with overscan applied, never touching scene cameras. Port `frameObject` and `clipPlanesFromBox` onto the state.

**Test:** building a camera from a view showing a scene camera leaves the scene camera's projection unchanged; axis views produce the six orthographic orientations; `frame` fits a box at several aspects (port existing `ViewCameras.test.ts` cases).

### `viewport-takes-view`

**Files:** `elements/IoThreeViewport.ts`, `IoCameraExample.ts`

`ioThreeViewport({view, applet})`. Without `view`, the viewport creates one (compat). `cameraSelect: 'top'` maps to `axisView`; `'scene:<name>'` resolves once to a uuid with a deprecation warning. Navigation changes tag only that view (`view` reason).

**Test:** move a viewport between layout tabs; navigation state is unchanged after remount.

---

## Phase 3: Input (ADR-0004)

**Done 2026-10-07.** Notes from implementation:
- Files: `input/InputRouter.ts`, `input/Behavior.ts` (+ `BehaviorPriority`), `input/ViewInputEvent.ts` (+ `InputHost` interface so routers work on stubs), `input/Keymap.ts` (+ `navigationKeymaps.default | blender | maya`), `input/behaviors/NavigationBehavior.ts`. `view/ViewOrbitControls.ts` and OrbitControls removed.
- Wheel events are one-shot (`begin` then `end`). Extra pointers go to the capturing behavior's `update` unless it `allowsStealing`; a thief takes over all captured pointers (ADR-0004 wording updated).
- The router focuses the viewport on a captured press (preventDefault would block focus) so key routing works; hovered viewport wins over focused.
- `default` keymap mirrors OrbitControls so demos feel unchanged; Blender/Maya presets add axis keys / frame keys. Axis views pan instead of orbit (`lockAxisViews`). Turntable orbit with pole clamp; perspective clip planes scale with dolly.
- Not done: zoom to cursor, frame selected (needs selection, P5), fly mode, `when.mode` in keymaps (needs editor mode, P4).
- `ToolBase` keeps its `on3DPointer*` API and per-viewport WeakMaps; `registerViewport()` now adds `tool.behavior` to the router (no DOM listeners). New `capturesInput(event)` hook, default true (captures all, as before minus the OrbitControls fight).

### `input-router`

**Files:** `input/InputRouter.ts`, `input/Behavior.ts`, `input/ViewInputEvent.ts` (+ tests)

One router per viewport, created by the viewport. Owns all pointer, wheel, key and contextmenu listeners and pointer capture. Capture by priority on press; hover pass when idle; `allowsStealing`; `preventDefault`/`stopPropagation` only on captured events. A module registry tracks the hovered viewport so key events go to it, else to the focused one. `ViewInputEvent` extends `Pointer3D` with `view`, `modifiers` and a lazy ray (no allocation on hover moves).

**Test:** two behaviors want LMB: the higher priority captures and the other sees nothing until release. An unclaimed wheel event is not `preventDefault`ed. Stealing cancels the lower behavior.

### `keymaps`

**Files:** `input/Keymap.ts`, `input/keymaps/{blender,maya}.ts` (+ tests)

Entries `{when: {viewKind?, mode?, tool?}, input: 'LMB drag' | 'MMB drag' | 'Alt+LMB drag' | 'wheel' | 'KeyG' ..., action, props}`. Layered lookup: modal, active tool, view kind + mode, global. Conflict listing helper for a future keymap editor.

### `navigation-behaviors`

**Files:** `input/behaviors/navigation.ts` (+ tests)

Orbit, pan, dolly, zoom to cursor, wheel, two-finger pan and pinch, frame selected/all, axis snap, all acting on `ViewNavigation`. 2D kinds get pan and zoom only. Remove `OrbitControls` and the bare `"three"` import-map entry it required, if nothing else needs it.

### `toolbase-adapter`

**Files:** `tools/Tool.ts`, `tools/ToolBase.ts`, `nodes/ToolBase.test.ts`

`Tool` is a shared `ReactiveObject` (settings) with `createBehaviors(view): Behavior[]`. `ToolBase` implements it by wrapping `on3DPointer*` into one behavior at tool priority, keeping per-view pointer state inside that behavior. `registerViewport()` / `unregisterViewport()` and `viewport.tool` keep working in P3 by asking the viewport's router to install or remove the tool's behaviors, with a deprecation warning.

**Test:** existing `ToolBase.test.ts` cases pass unchanged through the adapter; orbit (MMB) and a tool (LMB) both work in the same viewport.

---

## Phase 4: App layer (ADR-0002, ADR-0004)

**Done 2026-10-07.** Notes from implementation:
- Files: `editor/ThreeEditor.ts`, `editor/ThreeDocument.ts`, `editor/Transaction.ts`, `editor/Patch.ts`, `tools/Operator.ts` (+ `OperatorRegistry`, modal behavior, `Command`), `tools/Tool.ts` (`ToolDefinition`, `ToolRegistry`, `InteractionProfile`).
- The change bus lives on the document; change `source` is always the document. `editor.notify()` overrides any source. Document render-setting changes notify `'settings'`.
- `setAttribute` patches are deferred to geometry editing (P7) with blob storage (future work); `set` / `insert` / `remove` exist. `set` copies math objects in place and clones values for the record.
- `document.history` keeps the last 100 committed transactions; `revert()` / `reapply()` / commit listeners are the hooks for the future undo stack. Empty transactions are not recorded.
- Modal operators use `InputRouter.startModal()` / `endModal()` (new `Behavior.modal`): all pointer, wheel and key events go to the operator; Escape cancels. One running operator at a time; starting another or switching documents cancels it.
- `operators.lastCommand` records `{name: id, args: props}` of finished runs (command layer seed).
- Viewport has `editor` (and `applet` alias). Per-document navigation is session state on `ThreeView` (`switchDocument`), not serialized. A view first attached keeps its navigation; only real switches park/restore.
- `ThreeView.profile` added; active tool per `'<viewKind>:<mode>'` in `editor.activeTools`; keymap `when.mode` via `InputHost.mode`.
- `ToolBase` stays as the legacy adapter alongside tool definitions (no deprecation yet).

### `editor-document`

**Files:** `editor/ThreeEditor.ts`, `editor/ThreeDocument.ts`, `nodes/ThreeApplet.ts`

`ThreeDocument`: content `scene`, scene settings (environment, tone mapping, exposure), `notify()`. `ThreeEditor`: document, change bus, clock and playback, mode, later selection and tools. `ThreeApplet` becomes an editor with one document; `applet.scene`, `isPlaying`, `toneMapping` forward to it.

### `document-transactions` (ADR-0008)

**Files:** `editor/ThreeDocument.ts`, `editor/Transaction.ts`, `editor/Patch.ts` (+ tests)

`document.transact(tx => ...)` and `document.begin(): Transaction` for long-running edits. Patch ops: `set(id, path, value)`, `insert(parentId, index, object)`, `remove(id)`, `setAttribute(geometryId, name, range | data)`. Each op records the old value when applied. Same-path patches coalesce. `commit()` publishes the transaction to listeners and turns its paths into change-bus entries; `rollback()` applies inverses. Object lookup by `uuid` through a document index kept in sync by `insert`/`remove`.

No undo stack yet, but committed transactions are kept in a bounded in-memory log so tests can assert that applying inverses in reverse order restores the document exactly.

**Test:** translate + rename + reparent in one transaction, then apply the inverses: the scene serialises identically to before. Coalescing 100 drag moves leaves one patch per path.

### `document-switching` (ADR-0002)

**Files:** `editor/ThreeEditor.ts` (+ test)

Assigning `editor.document` cancels a running modal operator, swaps the per-document session state (selection, view navigation, later undo) from maps keyed by document id, and tags all views `content`. Switching back restores each view's camera.

### `operators`

**Files:** `tools/Operator.ts`, `tools/OperatorRegistry.ts` (+ tests)

Operator contract (`poll`, `invoke`, `modal`, `exec`, `cancel`), registry by id, `OperatorContext {editor, document, view?, selection}`. A running modal operator installs itself as the priority-1000 behavior on the router that started it, opens a transaction on start, writes through it while dragging, commits on release and rolls back on cancel. Each operator declares the command name and arguments it would emit, so `command-registry` can be added later without touching operators.

### `tool-registry`

**Files:** `tools/ToolRegistry.ts`, `input/InputRouter.ts`

`ToolDefinition {id, label, icon, viewKinds, modes, settings?, createBehaviors}`. Editor keeps `activeTool[viewKind][mode]`. Routers rebuild their behavior set when the active tool, mode or the view's `profile` changes. Profiles: `full`, `select`, `navigate`, `none`.

---

## Phase 5: Object selection (ADR-0007)

**Done 2026-10-07.** Notes from implementation:
- Files: `selection/SelectionModel.ts` (+ `SelectionEdit`), `selection/Picker.ts` (`Picker`, `RaycastPicker`, `defaultPicker`, `isSelectable`, `collectSelectable`), `input/behaviors/SelectBehavior.ts`, demo `demos/examples/IoSelectionExample.ts` (index.html: Three > Editor > Selection).
- `editor.selection` is a reactive property swapped per document from a map keyed by document uuid. Selection changes notify `'selection'` on the document bus; removed objects (remove patches) are pruned via a commit listener.
- Router clicks: presses that moved < 4 px, single pointer, not modal, offered after any capture ends via `Behavior.click`. Keymap grammar gained `LMB click`. This lets the default (OrbitControls-like) keymap orbit on LMB drag and select on LMB click.
- `keymaps.default | blender | maya` combine navigation and selection presets; viewport default is `keymaps.default`. `view.frameSelected` added (F / Numpad . / F).
- Picking: Line/Points thresholds are `PICK_RADIUS` (4 px) in world units at the target distance; `userData.selectable = false` opts out (helpers). Box select tests projected bounds (approximate) until the ID-buffer picker.
- Not done: outliner adapter (io-menus), selection highlight (P6 overlay), lasso, select-through.

### `selection-model`

**Files:** `selection/SelectionModel.ts` (+ test)

Object domain only in P5: `objects: Set<uuid>`, `active`, `domain`, `version`, `edit()` transactions committing one version bump, one change and one undo record.

### `object-picking`

**Files:** `selection/Picker.ts`, `selection/RaycastPicker.ts` (+ test)

`Picker` per view kind with async queries: `pick(view, x, y, filter): Promise<PickResult | null>` and `pickRect(view, rect, filter): Promise<PickResult[]>`, plus an optional synchronous `pickHover` fast path. First implementation: plain `Raycaster` against the content scene with the view camera's layers; box select by projected bounds. Keep the interface free of raycaster types so `bvh-picker` and `id-pass-picking` drop in later.

### `select-behaviors`

**Files:** `input/behaviors/select.ts`, demo

Click and box select in the fallback band (shift extends, ctrl toggles). Property editor in a demo binds to `selection.active`. Optional: outliner adapter to io-menus.

---

## Phase 6: Pipelines, overlays, gizmos, UV view (ADR-0006)

**Done 2026-10-07.** Notes from implementation:
- Files: `render/ViewPipeline.ts` (contract + registry, `DEFAULT_PIPELINES`), `render/ViewCompositor.ts`, `render/Overlay.ts` (+ registry), `render/screenQuad.ts`, `render/builtins.ts`, `render/pipelines/{RenderTargetPipeline,ForwardPipeline,PostProcessingPipeline,UVPipeline}.ts`, `render/overlays/{Grid,SelectionOutline,CameraFrame}Overlay.ts`, `tools/Gizmo.ts` (`Gizmo`, `GizmoGroup`, `GizmoLayer`), `tools/gizmos/TranslateGizmoGroup.ts`, `tools/operators/TranslateOperator.ts`, `tools/TranslateTool.ts`, demo `IoEditorViewsExample`.
- Every pipeline renders into its own half-float target (linear, no tone mapping). The compositor presents it with a screen quad that writes the pipeline depth (`material.depthNode`), then overlays, in **one** `renderer.render(overlayScene)` to the canvas. Tone mapping happens there: `view.toneMapping ?? pipeline.toneMapping ?? document.toneMapping`. No save/restore of renderer state. Overlay-only draws (`overlay` tag) skip the pipeline. Cost: one extra full-screen pass per draw; pixel output of existing demos is unchanged (checked against HEAD screenshots).
- `ScheduledView.listens` may return a `DirtyReason`; viewports return `'overlay'` for selection changes (UV pipeline: `'content'`; transforms ignored there).
- Overlay hook is `prepare(ctx)` (not `update`, which clashes with `Behavior.update` on `GizmoLayer`). Grid is off by default (existing demos have their own helpers); `selection`, `cameraFrame` and `gizmos` are on. Passepartout is now visible in demos that look through scene cameras with a different aspect (keyframes SceneCamera, log-depth).
- Selection outline: mask target of proxies sharing geometry (skinned, instanced, morph, lines), 8-tap edge pass. Not occlusion-aware (outlines show through occluders).
- `PostProcessingPipeline(renderer, (scenePass, camera) => node, {convergeFrames})` rebuilds its graph when the view camera object changes (TRAA holds the camera). TRAA demo converges in 33 draws, then stops.
- Gizmo flow: `GizmoLayer` (gizmo band) hit-tests in pixels; press → `gizmo.invoke` → `operators.run('transform.translate', {axis}, {host, event})` → modal. `InputRouter.startModal` marks open presses as non-clicks, so a gizmo press never selects through. Zero-move runs cancel (no command, no history).
- Translate operator: median pivot, root objects only (`SelectionModel.getRootObjects`), X/Y/Z keys toggle constraint, Enter/release confirm, RMB/Escape cancel; `exec` applies `props.delta` (repeatable command). `lastCommand` is now set before commit so commit listeners see it.
- UV view: `ThreeView.kind = 'uv'` → `uv` pipeline (grid, active texture, edit-set layouts via `buildUVGeometry` + `WireframeGeometry`, cached by attribute versions), `frameUV()`, orbit → pan, axis keys ignored. Picker = `RaycastPicker({root, resolve})` on the layouts; hosts expose `picker` and `SelectBehavior` prefers it.
- Not done: shading modes (solid/wireframe/matcap as pipelines), rotate/scale gizmos, keyboard-started grab (G) without a press, overlay MSAA, outline occlusion, ioLayout in the demo (CSS grid instead).

### `pipeline-registry`

`ViewPipeline {continuous, setSize, render(frame), getDepthTexture?, dispose}` + `registerPipeline(id, ctor)`. `ForwardPipeline` reproduces today's output. Tone mapping and background come from document settings with per-view override; no more save/restore on the renderer.

### `postprocessing-pipeline`

`PostProcessing` (three r182) pipeline with `pass(scene, camera)`, depth exposed for overlays, and `continuous` until converged (verify with a TRAA demo).

### `overlay-system`

`Overlay` providers per view kind with their own overlay scene and a depth-test flag. Grid, selection outline, passepartout for scene cameras. `overlay`-only redraws composite over the pipeline's cached result.

### `gizmos-transform`

`GizmoGroup {poll, setup, refresh, drawPrepare}`, gizmos with screen-space `hitTest` and `invoke` that starts an operator. Translate gizmo + modal transform operator: the end-to-end proof that gizmo, tool, navigation and selection coexist.

### `uv-view`

View kind `uv`: `UVPipeline` draws the 0–1 grid, optional texture and UV-space meshes of the edit set; pan/zoom navigation; `select` profile. Demo: 3D view + UV view side by side in `ioLayout`.

---

## Phase 7: Component selection (ADR-0007)

### `topology-cache`

Versioned cache per `BufferGeometry`: welded points, edge table, corner list. Invalidated by geometry version.

### `geometry-adapters`

`GeometryAdapter` contract (domain sizes, element positions, ID-pass draw, highlight draw) with `Mesh`, `Points`, `LineSegments` adapters.

### `id-pass-picking`

ID pass into an `R32Uint` target per view, async pixel / rectangle readback in the scheduler's settle phase, cached until `content` or `view` changes. X-ray mode uses CPU projection.

### `component-selection`

`ComponentSet` bitsets per object per domain, edit mode with an edit set, select-domain switching, highlight overlays reading bitsets as storage buffers, UV `corner` selection and `uvSync` mapping.

---

### P7 notes (Done 2026-10-07)

- `geometry/Topology.ts`: welded points by exact position, unique point-pair edges, triangles/segments, corners = triangle corners; cached per geometry by position/index count + version. Quad diagonals are edges (no polygon detection).
- `SelectionModel`: `ComponentSet` bitsets per uuid per domain; `edit().components(uuid, domain, size)` copy-on-write, `clearComponents`, `setDomain`. Sets of another size are ignored/replaced. Removed objects drop their components. `componentDomain` remembers the select mode across object mode.
- Adapters: `MeshAdapter`, `LineSegmentsAdapter`, `PointsAdapter`; `registerGeometryAdapter`. Edit set = selected objects + descendants with an adapter.
- ID pass: RGBA32F target at CSS-pixel size (slot, primitive + 1, view depth), not R32Uint; occluders = other visible meshes; one full readback cached by camera/size/edit set and invalidated on `content` tags. Faces from the buffer; points/edges CPU-projected with a 3x3 depth test (1 % tolerance). `view.xray` (new ThreeView prop) = no occlusion. Rest shape only.
- Highlights: `components` overlay (wire, instanced sprite points, selected faces) with a view-space depth bias, built from CPU state attributes rather than storage-buffer bitsets. Selection outline hidden in edit mode.
- Operators `object.editmode_toggle` (Tab) and `mesh.select_mode` (1/2/3, Blender-style conversion). `editModeKeymap` layered into all presets.
- UV edit: `UVComponentPicker` (CPU, UV space) + `UVEditCage`. uvSync off: shows faces selected in 3D, stores `corner` (UV vertex = corners of one buffer vertex). uvSync on: picks map to point/edge/primitive.
- Not done: active element, pre-selection hover, loop/linked select, component transform (needs `setAttribute` patches, future work), select-all limited to visible UVs.

## Docs

### `docs-sync`

At the end of each phase: update `packages/three/CONTEXT.md` (new terms: ThreeEditor, ThreeDocument, ThreeView, RenderScheduler, ViewPipeline, Overlay, InputRouter, Behavior, Tool, Operator, SelectionModel, attribute domain; retire ViewCameras), `README.md`, `skills/io-gui-three/SKILL.md`, and root `CONTEXT.md` relationships if they change. Flip ADR status to `completed` when its phase lands.
