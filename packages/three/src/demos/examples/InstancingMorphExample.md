---
source: webgpu_instancing_morph
synced: d94661f706
tags: [moving-camera, types]
---

# InstancingMorph

[`webgpu_instancing_morph`](https://threejs.org/examples/#webgpu_instancing_morph), converted 2026-10-13

## Deviations

- **Time:** a 63 s loop of 42 gallops and one flight of the camera.
- **Camera:** the active camera flies over the herd with document time, as the source's does.
- **Types:** `SunLight.registerNode()` (r187) through a cast; `@types/three` 0.186 does not have it.

## Open

- `r187-followups`: drop the `registerNode()` cast with `@types/three` 0.187.
- `framing-scenery`: the million-unit ground dwarfs the herd in whole-scene framing.

## Upstream

- `b85bb7fcee` (#34622) WebGPURenderer: Replace "addLight" with "lightNode" reference. Ported 2026-10-21: `SunLight.registerNode()` at module level, typed through a cast.

## History

- 2026-10-13: Converted, with the source's camera kept as a scene camera. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, no console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), flying as before. Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34622), not ported yet.
- 2026-10-21: Changed: `SunLight.registerNode()` at module level for the deprecated `renderer.library.addLight()`, as the source does since #34622, typed through a cast as in LightsSunlight. Checked headlessly on the linked build: the herd loads and plays under its `SunLight` with shadows, without the deprecation warning or errors.
