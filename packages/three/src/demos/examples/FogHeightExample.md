---
source: webgpu_fog_height
synced: d94661f706
---

# FogHeight

[`webgpu_fog_height`](https://threejs.org/examples/#webgpu_fog_height), converted 2026-10-13

## Deviations

None.

## Open

- `shared-refresh`: recheck that the fog controls reach forward views on the linked build, which has #34996.

## Upstream

- #34996 (merged 2026-10-14): `NodeMaterialObserver` refreshes objects under a custom `scene.fogNode`. Before it the fog controls did not reach forward views, the source's own page included. In the linked build; ships in r187.

## History

- 2026-10-13: Converted, with the fog's uniforms in the render group so the controls reach forward views (`shared-refresh`). Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, no console errors. The source's camera was kept as a scene camera, since the fog depends on distance.
- 2026-10-14: Workaround removed: the render group for the fog's uniforms, to stay with the source, once #34996 was merged.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), outside the scene. Checked: the Scene Camera view against `examples/screenshots`.
