---
source: webgl_shadowmap_performance
synced: d94661f706
---

# ShadowmapPerformance

[`webgl_shadowmap_performance`](https://threejs.org/examples/#webgl_shadowmap_performance), converted 2026-10-17 (batch 3)

## Deviations

- **Horses:** they run a fixed 3000-unit lane, eleven runs per 60 s loop derived from document time; the source respawns them up to 500 units back. The gallop advances by `delta`.
- **Camera:** the first-person controls are dropped; the active camera stands where the source's starts.

## Upstream

- `7300402f96` (#34586) Examples: Only use SunLight in larger scenes. Ported: `DirectionalLight` with its shadow camera, bias and map size.

## History

- 2026-10-17: Converted (batch 3), with the source's camera kept as a scene camera. Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), outside the scene. Checked: the Scene Camera view against `examples/screenshots`.
- 2026-10-21: Synced to `d94661f706`: one upstream change since r186 (#34586), already ported.
