---
source: webgpu_lightprobes_complex
synced: d94661f706
tags: [renderer-on-change]
---

# LightprobesComplex

[`webgpu_lightprobes_complex`](https://threejs.org/examples/#webgpu_lightprobes_complex), converted 2026-10-20 (batch 5)

## Deviations

- **Bake:** each grid bakes in `onBeforeDraw`, once per renderer and grid; `resolution` replaces the grids at once, without the source's debounce. Both grids are hidden while either bakes, as the source bakes them before adding them.
- **Controls:** `gi` for the source's `enabled`.
- **Probes:** the probe helpers overlay draws both grids' probes in the editor's views, so the source's helpers and `showProbes` are dropped; the Camera view draws no helpers.

## Related

- [Lightprobes](LightprobesExample.md): one grid, the same bake.

## History

- 2026-10-20: Converted (batch 5), once `onBeforeDraw` served `renderer-on-change`. Ran on the linked r187dev build `d94661f706`. Checked headlessly: the active view against `examples/screenshots`, property edits and scrubbing, all batch 5 documents in one page without errors.
- 2026-10-21: Changed: the probe helpers overlay draws the probes, three's `LightProbeGridHelper` with its own material (the overlay pass has no MRT); the authored helpers and `showProbes` are dropped, and the bakes hide only the grids. Workaround removed: `triage-fragment-node-mrt`, with the helpers. Checked headlessly on the linked r187dev build `d94661f706`: the probes in the Front (TRAA) and Perspective views, none in the Camera view, without console errors.
