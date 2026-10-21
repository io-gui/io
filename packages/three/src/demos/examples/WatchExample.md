---
source: webgl_watch
synced: d94661f706
---

# Watch

[`webgl_watch`](https://threejs.org/examples/#webgl_watch), converted 2026-10-17 (batch 3)

## Deviations

- **Time:** the hands start at 10:10 and follow document time, a 60 s loop; the source shows the wall clock.
- **Post:** the source's optional bloom (`postProcess`) is the document's `bloom`, off by default; its TAA is the TRAA views'.
- **Camera:** the active camera stands where the source's 6 s camera tween ends.

## History

- 2026-10-17: Converted (batch 3), with the camera tween dropped. Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), standing where its tween ends. Checked: the Scene Camera view against `examples/screenshots`.
