---
source: webgpu_geometry_loft
synced: d94661f706
---

# GeometryLoft

[`webgpu_geometry_loft`](https://threejs.org/examples/#webgpu_geometry_loft), converted 2026-10-15

## Deviations

- **Time:** the floor turns once per 100π/3 s loop of document time; the source adds 0.001 rad per frame.

## Open

- `framing-scenery`: views frame the pedestals, so the perspective view opens inside the curtain; the axis views look at the curtain (radius 55) from outside.

## Upstream

- `7300402f96` (#34586) Examples: Only use SunLight in larger scenes. Ported: `DirectionalLight` with its shadow camera.

## History

- 2026-10-15: Converted. Checked in the editor (headless Chromium on the GPU): renders against `examples/screenshots`, scene graph names, Document tab controls changed with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34586), already ported.
