---
name: io-gui-three
description: >-
  Build Three.js WebGPU applets with ThreeApplet and IoThreeViewport, including
  shared renderer lifecycle and editor config side-effects. Use when working with
  @io-gui/three, viewports, ThreeView, view navigation, pipelines, overlays,
  gizmos, the UV view, edit mode / component selection, or ToolBase.
---

# @io-gui/three

## Defaults

- Import from `@io-gui/three` (pulls peer `three` / webgpu).
- New apps: **`ThreeEditor`** (app) + **`ThreeDocument`** (`editor.document.scene`); mount with **`ioThreeViewport({ editor })`**. `ThreeApplet` (subclass, `ioThreeViewport({ applet })`) still works as a shim. Set `isPlaying` to animate.
- **Edit the document through transactions** (`document.transact(tx => tx.set(obj, 'position', v))`), or operators (`editor.operators.run(id, props)`), not by writing Three.js objects directly: that is what keeps undo, redraw and future sync working. Interactive edits are modal operators (`invoke` returns `'running'`, `modal` gets events, Escape rolls back).
- **Selection** is `editor.selection` (per document): change it with `selection.set(uuids)` / `selection.edit()...commit()`, read `getObjects()` / `getActiveObject()`, bind UI to `selection.version` / `selection.active`. Picking goes through a `Picker` (`defaultPicker`, async). Set `userData.selectable = false` on helpers (grids, gizmo meshes) so they cannot be picked.
- Tools are `ToolDefinition`s on `editor.tools`, activated per view kind + mode (`editor.setActiveTool('3d', 'object', id)`); `view.profile` (`full | select | navigate | none`) filters what a viewport installs. Built in: the Move tool `transform.translate` (gizmo + modal operator of the same id).
- **Never add helpers (grids, outlines, handles) to `document.scene`.** Draw them as overlays (`registerOverlay`, `view.setOverlay(id, on)`) or gizmo groups (`ToolDefinition.createGizmoGroups`). Different rendering per view = a registered `ViewPipeline` named by `view.pipeline` (e.g. a `PostProcessingPipeline`), not renderer tweaks in `onAnimate`.
- UV view: `new ThreeView({kind: 'uv', profile: 'select'})` shows the selected meshes' UV layouts.
- **Components** (edit mode, `editor.operators.run('object.editmode_toggle')` / Tab; `mesh.select_mode` / 1 2 3): stored as `ComponentSet` bitsets in `editor.selection` (`edit().components(uuid, domain, size)`, `getComponents(uuid, domain)`). Get sizes and indices from `getTopology(geometry, 'mesh')` or `getGeometryAdapter(object)`; `point` is a welded position, not a buffer vertex. The UV view stores `corner` selection unless `selection.uvSync`.
- Prefer package math editors (`IoVector3`, …) for Three math types in inspectors.

## Gotchas

- **Importing the package registers editor configs** for Three.js classes (side-effect). Expected.
- **WebGPU only.** Default **shared `WebGPURenderer`** across viewports; each viewport has its own **CanvasTarget**. Tone mapping, clear color and render target are set per draw by the viewport's compositor: set `document.toneMapping` or `view.toneMapping`, not `renderer.toneMapping`.
- Pipelines output **linear** color; the viewport tone-maps when presenting. A `PostProcessingPipeline` keeps `outputColorTransform = false`; don't add `renderOutput()` to its graph.
- **Only `renderScheduler` renders.** Viewports are tagged dirty and drawn next frame. After editing the scene outside `onAnimate`, call `applet.requestRender()` (or `applet.notify({kind, source: applet})`) or nothing redraws. Never call render methods on viewports.
- Renderer init is **async** — do GPU setup in `onRendererInitialized(renderer)`.
- `isPlaying: false` on the applet ⇒ no `onAnimate`; non-visible viewport ⇒ no draw.
- `onResized` on the applet is deprecated: size belongs to each viewport.
- **View state lives on `ThreeView`**, not the viewport: `viewport.view.navigation` (target, rotation, distance, axis view, scene camera by uuid), `overscan`, `clearColor`. Pass a `view` to keep navigation across remounts. Use `viewport.getViewCamera()` for picking; never mutate scene cameras to fit a viewport. After editing `view.navigation` directly, call `view.markNavigationChanged()`.
- Component indices are valid for one topology: after changing a geometry's positions or index, old sets are ignored (size mismatch). Component picking uses the rest shape (no skinning / morphs) and triangles (quad diagonals are edges).
- **Not core `IoGl`.** IoGl is 2D shader quads for sliders/colors; this package is full Three WebGPU.
- **All viewport input goes through `viewport.inputRouter`** (priority capture). Never add pointer/wheel listeners to a viewport directly, and never use `OrbitControls` on it: navigation is `NavigationBehavior` + a `Keymap` (`navigationKeymaps.default | blender | maya`, or pass `keymap`).
- `ToolBase` registers one behavior per viewport router and supplies Pointer3D rays — subclass for tools; don't re-wire pointer→ray ad hoc. It captures every press and wheel by default; override `capturesInput(event)` to leave buttons or the wheel to navigation.

## Read next

- Glossary: [CONTEXT.md](../../CONTEXT.md)
- API: [README.md](../../README.md)
