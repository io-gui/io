---
name: io-gui-three
description: >-
  Build Three.js WebGPU applets with ThreeApplet and IoThreeViewport, including
  shared renderer lifecycle and editor config side-effects. Use when working with
  @io-gui/three, viewports, ViewCameras, or ToolBase.
---

# @io-gui/three

## Defaults

- Import from `@io-gui/three` (pulls peer `three` / webgpu).
- Subclass **`ThreeApplet`** for scene + lifecycle; mount with **`IoThreeViewport({ applet })`**; set `applet.isPlaying` to animate.
- Prefer package math editors (`IoVector3`, …) for Three math types in inspectors.

## Gotchas

- **Importing the package registers editor configs** for Three.js classes (side-effect). Expected.
- **WebGPU only.** Default **shared `WebGPURenderer`** across viewports; each viewport has its own **CanvasTarget**. Renderer state reset per draw.
- **Only `renderScheduler` renders.** Viewports are tagged dirty and drawn next frame. After editing the scene outside `onAnimate`, call `applet.requestRender()` (or `applet.notify({kind, source: applet})`) or nothing redraws. Never call render methods on viewports.
- Renderer init is **async** — do GPU setup in `onRendererInitialized(renderer)`.
- `isPlaying: false` on the applet ⇒ no `onAnimate`; non-visible viewport ⇒ no draw.
- `onResized` on the applet is deprecated: size belongs to each viewport.
- **Not core `IoGl`.** IoGl is 2D shader quads for sliders/colors; this package is full Three WebGPU.
- `ToolBase` registers on viewports and supplies Pointer3D rays — subclass for tools; don't re-wire pointer→ray ad hoc.

## Read next

- Glossary: [CONTEXT.md](../../CONTEXT.md)
- API: [README.md](../../README.md)
