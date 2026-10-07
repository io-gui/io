---
name: io-gui-three
description: >-
  Build Three.js WebGPU applets with ThreeApplet and IoThreeViewport, including
  shared renderer lifecycle and editor config side-effects. Use when working with
  @io-gui/three, viewports, ThreeView, view navigation, or ToolBase.
---

# @io-gui/three

## Defaults

- Import from `@io-gui/three` (pulls peer `three` / webgpu).
- New apps: **`ThreeEditor`** (app) + **`ThreeDocument`** (`editor.document.scene`); mount with **`ioThreeViewport({ editor })`**. `ThreeApplet` (subclass, `ioThreeViewport({ applet })`) still works as a shim. Set `isPlaying` to animate.
- **Edit the document through transactions** (`document.transact(tx => tx.set(obj, 'position', v))`), or operators (`editor.operators.run(id, props)`), not by writing Three.js objects directly: that is what keeps undo, redraw and future sync working. Interactive edits are modal operators (`invoke` returns `'running'`, `modal` gets events, Escape rolls back).
- **Selection** is `editor.selection` (per document): change it with `selection.set(uuids)` / `selection.edit()...commit()`, read `getObjects()` / `getActiveObject()`, bind UI to `selection.version` / `selection.active`. Picking goes through a `Picker` (`defaultPicker`, async). Set `userData.selectable = false` on helpers (grids, gizmo meshes) so they cannot be picked.
- Tools are `ToolDefinition`s on `editor.tools`, activated per view kind + mode (`editor.setActiveTool('3d', 'object', id)`); `view.profile` (`full | select | navigate | none`) filters what a viewport installs.
- Prefer package math editors (`IoVector3`, …) for Three math types in inspectors.

## Gotchas

- **Importing the package registers editor configs** for Three.js classes (side-effect). Expected.
- **WebGPU only.** Default **shared `WebGPURenderer`** across viewports; each viewport has its own **CanvasTarget**. Renderer state reset per draw.
- **Only `renderScheduler` renders.** Viewports are tagged dirty and drawn next frame. After editing the scene outside `onAnimate`, call `applet.requestRender()` (or `applet.notify({kind, source: applet})`) or nothing redraws. Never call render methods on viewports.
- Renderer init is **async** — do GPU setup in `onRendererInitialized(renderer)`.
- `isPlaying: false` on the applet ⇒ no `onAnimate`; non-visible viewport ⇒ no draw.
- `onResized` on the applet is deprecated: size belongs to each viewport.
- **View state lives on `ThreeView`**, not the viewport: `viewport.view.navigation` (target, rotation, distance, axis view, scene camera by uuid), `overscan`, `clearColor`. Pass a `view` to keep navigation across remounts. Use `viewport.getViewCamera()` for picking; never mutate scene cameras to fit a viewport. After editing `view.navigation` directly, call `view.markNavigationChanged()`.
- **Not core `IoGl`.** IoGl is 2D shader quads for sliders/colors; this package is full Three WebGPU.
- **All viewport input goes through `viewport.inputRouter`** (priority capture). Never add pointer/wheel listeners to a viewport directly, and never use `OrbitControls` on it: navigation is `NavigationBehavior` + a `Keymap` (`navigationKeymaps.default | blender | maya`, or pass `keymap`).
- `ToolBase` registers one behavior per viewport router and supplies Pointer3D rays — subclass for tools; don't re-wire pointer→ray ad hoc. It captures every press and wheel by default; override `capturesInput(event)` to leave buttons or the wheel to navigation.

## Read next

- Glossary: [CONTEXT.md](../../CONTEXT.md)
- API: [README.md](../../README.md)
