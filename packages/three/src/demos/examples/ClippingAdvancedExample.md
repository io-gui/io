---
source: webgl_clipping_advanced
synced: d94661f706
---

# ClippingAdvanced

[`webgl_clipping_advanced`](https://threejs.org/examples/#webgl_clipping_advanced), converted 2026-10-17 (batch 3)

## Deviations

- **Clipping:** WebGPU clips with `ClippingGroup`s instead of per-material and renderer planes: `Global` around everything holds the renderer's five turning planes, `Local` holds the tetrahedron's four planes for the cubes (with `clipShadows`), and `visualize` puts each volume face in a group clipped by the other three.

## History

- 2026-10-17: Converted (batch 3). Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
