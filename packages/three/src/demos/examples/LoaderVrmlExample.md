---
source: webgl_loader_vrml
synced: d94661f706
tags: [camera-in-scene, verify-per-view]
---

# LoaderVrml

[`webgl_loader_vrml`](https://threejs.org/examples/#webgl_loader_vrml), converted 2026-10-14

## Deviations

- **Background:** a file's `Background` node becomes 10000-unit sky and ground spheres beyond the views' far plane, so `followCamera` redraws them around each drawing camera, in the loader's order. They are unselectable and left out of framing ([Async content](../ExamplesConversion.plan.md#async-content)).

## History

- 2026-10-14: Converted. Fixed while checking: framing ignored the file's transforms; textured files stayed black, as nothing redrew when their textures arrived. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused (file switches), the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), in the scene as in the source. Checked: the Scene Camera view against `examples/screenshots`.
