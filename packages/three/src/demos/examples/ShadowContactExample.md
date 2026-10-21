---
source: webgpu_shadow_contact
synced: d94661f706
tags: [per-frame-gpu]
---

# ShadowContact

[`webgpu_shadow_contact`](https://threejs.org/examples/#webgpu_shadow_contact), converted 2026-10-18 (batch 4)

## Deviations

- **Capture:** the depth render from below runs in `onBeforeDraw`, before the views draw any change, with the renderer state saved and restored ([GPU work per frame](../ExamplesConversion.plan.md#gpu-work-per-frame)).
- **Time:** the objects spin with document time on a 10π/3 s loop.
- **Dropped:** `showWireframe`; the camera helper overlay shows the shadow camera.

## History

- 2026-10-18: Converted (batch 4) on `Document.onBeforeDraw` (ADR-0010). Checked: renders against the dev build's own page, whose shadow is fainter than the old screenshot; every Document tab control changed headlessly, the batch's 16 documents in one page without console errors, and the hook's calls (none while paused or navigating, `delta` 0 when scrubbing back).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
