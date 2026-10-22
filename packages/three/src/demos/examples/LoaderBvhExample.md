---
source: webgl_loader_bvh
synced: d94661f706
tags: [stand-in-framing]
---

# LoaderBvh

[`webgl_loader_bvh`](https://threejs.org/examples/#webgl_loader_bvh), converted 2026-10-17 (batch 3)

## Deviations

- **Skeleton:** the skeleton helpers overlay draws the bones, for the source's `SkeletonHelper`. The Scene Camera view draws no helpers, so it shows nothing: the bare skeleton is the whole content.

## History

- 2026-10-17: Converted (batch 3). Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`; it shows nothing (`scene-camera-helpers`).
- 2026-10-21: Changed: `scene-camera-helpers` closed: the Scene Camera view draws no helpers, by decision, so its empty view is a deviation.
