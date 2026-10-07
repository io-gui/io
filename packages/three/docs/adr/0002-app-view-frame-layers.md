---
status: accepted
---

# Three layers: app, view and frame; view state outlives its element

io-three is split into three layers with one job each:

- **App layer.** One `ThreeEditor` per app. It owns the `ThreeDocument` (the content scene), the `SelectionModel`, the current mode, tools and operators, undo, the clock and the change bus.
- **View layer.** Any number of `ThreeView` models. Each holds the view kind (`3d`, `uv`, `image`, `preview`), navigation state, shading / pipeline choice, overlay flags and the interaction profile. It is shown by an `IoThreeViewport` element that owns only DOM concerns: `CanvasTarget`, CSS size, pixel ratio, visibility, focus and its `InputRouter`.
- **Frame layer.** One `RenderScheduler` (ADR-0003).

`ThreeView` is a serialisable `ReactiveObject`, not part of the element. `ioLayout` may dispose and recreate an element when a tab moves, and a view's camera, shading and overlays must survive that. Layouts can then serialise views.

Views never call each other or the renderer. They read the app layer and are tagged dirty by it. Viewports receive their `ThreeView` and `ThreeEditor` through properties, never by DOM lookup, so a viewport in a floating panel works like one next to its siblings.

The old `ThreeApplet` mixed the document, the clock, per-viewport size (`_width`, `_height`, `onResized`) and renderer hooks in one object. With two viewports of different aspect, `onResized` flipped between them every frame.

## One active document, switchable at runtime

A `ThreeEditor` has exactly one active `ThreeDocument` at a time, and `editor.document` can be reassigned while the app runs (open file, new scene, revert). Views read `editor.document`; they never hold their own document reference, so a switch reaches every view with one assignment. Per-document session state lives on the editor in maps keyed by document id: selection, undo stack, and each view's navigation (so switching back restores camera positions). On switch the editor cancels any running modal operator, then tags every view with `content`.

Previews that need their own scene (material balls, asset thumbnails) use private documents rendered by preview views. They are not "the" document and cannot be edited through the editor.

## Consequences

- `ThreeApplet` stays as a compatibility shim: an editor with one document and an `onAnimate` hook, so existing demos and apps keep working during migration.
- Viewport size is never app or document state. Anything that depends on aspect is computed per view at draw time.
- `ViewCameras`, `cameraSelect`, `overscan` and `clearColor` move from the viewport element onto `ThreeView`.
