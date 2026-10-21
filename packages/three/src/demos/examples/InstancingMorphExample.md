---
source: webgpu_instancing_morph
synced: d94661f706
tags: [moving-camera]
---

# InstancingMorph

[`webgpu_instancing_morph`](https://threejs.org/examples/#webgpu_instancing_morph), converted 2026-10-13

## Deviations

- **Time:** a 63 s loop of 42 gallops and one flight of the camera.
- **Camera:** the active camera flies over the herd with document time, as the source's does.
- **Light:** the `SunLight` is registered with `renderer.library.addLight()` in `onRendererInitialized`, the r186 API; the source now calls `SunLight.registerNode()` (Upstream).

## Open

- `r187-followups`: `SunLight.registerNode()` for the deprecated `renderer.library.addLight()`.
- `framing-scenery`: the million-unit ground dwarfs the herd in whole-scene framing.

## Upstream

- `b85bb7fcee` (#34622) WebGPURenderer: Replace "addLight" with "lightNode" reference. Not ported: still `renderer.library.addLight()`, deprecated in r187 (`r187-followups`).

## History

- 2026-10-13: Converted, with the source's camera kept as a scene camera. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, no console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), flying as before. Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34622), not ported yet.
