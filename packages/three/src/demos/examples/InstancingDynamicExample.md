---
source: webgl_instancing_dynamic
synced: d94661f706
---

# InstancingDynamic

[`webgl_instancing_dynamic`](https://threejs.org/examples/#webgl_instancing_dynamic), converted 2026-10-17 (batch 3)

## Deviations

- **Time:** the tint waves, which the source starts every 3 s with `setInterval` and tween.js, are scheduled in timeline time, the first at 0 s. The bobbing rounds to six per 9 s loop.
- **Camera:** the active camera stands where the source's orbit (a third of a turn per loop) starts.

## History

- 2026-10-17: Converted (batch 3), with the orbiting camera dropped. Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), standing where its orbit starts. Checked: the Scene Camera view against `examples/screenshots`.
