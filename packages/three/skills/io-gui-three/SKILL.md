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
- Subclass **`ThreeApplet`** for scene + lifecycle; mount with **`IoThreeViewport({ applet, playing })`**.
- Prefer package math editors (`IoVector3`, …) for Three math types in inspectors.

## Gotchas

- **Importing the package registers editor configs** for Three.js classes (side-effect). Expected.
- Default **shared `WebGPURenderer`** across viewports; each viewport has its own **CanvasTarget**. Renderer state reset per draw.
- Renderer init is **async** — use `onRendererInitialized` / wait for `renderer.initialized` before GPU work.
- `playing: false` or non-visible viewport ⇒ no animate/draw.
- **Not core `IoGl`.** IoGl is 2D shader quads for sliders/colors; this package is full Three WebGPU.
- `ToolBase` registers on viewports and supplies Pointer3D rays — subclass for tools; don't re-wire pointer→ray ad hoc.

## Read next

- Glossary: [CONTEXT.md](../../CONTEXT.md)
- API: [README.md](../../README.md)
