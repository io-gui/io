---
source: webgl_clipping_intersection
synced: d94661f706
---

# ClippingIntersection

[`webgl_clipping_intersection`](https://threejs.org/examples/#webgl_clipping_intersection), converted 2026-10-15 (batch 2)

## Deviations

- **Clipping:** the source's per-material clipping planes are one `ClippingGroup`, whose planes the clipping helpers overlay draws; the source's `PlaneHelper`s and `showHelpers` toggle are dropped.
- **`alphaToCoverage`:** smooths the cut edges only in views drawn with MSAA (`View.msaa`); TRAA views ignore it.

## History

- 2026-10-15: Converted (batch 2). Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-16: Changed: the `PlaneHelper`s and `showHelpers` dropped for the clipping helpers overlay; `alphaToCoverage` works in views with `View.msaa`.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
