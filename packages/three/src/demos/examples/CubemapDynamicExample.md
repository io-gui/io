---
source: webgpu_cubemap_dynamic
synced: d94661f706
tags: [per-frame-gpu, moving-camera, stand-in-framing]
---

# CubemapDynamic

[`webgpu_cubemap_dynamic`](https://threejs.org/examples/#webgpu_cubemap_dynamic), converted 2026-10-18 (batch 4)

## Deviations

- **Capture:** the `CubeCamera` captures the scene around the sphere in `onBeforeDraw`, before every draw, so it follows edits too ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)).
- **Time:** the cube and the knot orbit and spin with document time, 1.2 and 1.8 rad/s (the source's 0.02 and 0.03 rad per frame), on a 10π s loop.
- **Camera:** the active camera turns about the middle once per loop; the source's `OrbitControls.autoRotate` takes 30 s.
- **Controls:** `envIntensity` is the scene's `environmentIntensity` and `knotEnvMap` the knot's `envMapIntensity`; the source's exposure is the document's (Rendering).
- **Knot:** its Pisa `envMap` is set once loaded.

## History

- 2026-10-18: Converted (batch 4) on `Document.onBeforeDraw` (ADR-0010). Checked: renders against `examples/screenshots`, every Document tab control changed headlessly, the batch's 16 documents in one page without console errors, and the hook's calls (none while paused or navigating, `delta` 0 when scrubbing back). The auto-rotating camera was dropped.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), turning once per loop for the source's auto-rotation. Checked: the Scene Camera view against `examples/screenshots`.
