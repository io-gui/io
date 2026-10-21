---
source: webgl_instancing_scatter
synced: d94661f706
---

# InstancingScatter

[`webgl_instancing_scatter`](https://threejs.org/examples/#webgl_instancing_scatter), converted 2026-10-17 (batch 3)

## Deviations

- **Time:** the flowers' lives derive from document time, eight per 8π s loop, π s each (the source's 3.3 s). Each life samples its spot from a seeded generator, so scrubbing and looping show the same garden; `resample` reseeds.
- **Controls:** the source's `backgroundColor` and `surfaceColor` are not in the Document tab.

## History

- 2026-10-17: Converted (batch 3). Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
