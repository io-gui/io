---
source: webgpu_lightprobes_complex
synced: d94661f706
tags: [renderer-on-change]
---

# LightprobesComplex

[`webgpu_lightprobes_complex`](https://threejs.org/examples/#webgpu_lightprobes_complex), converted 2026-10-20 (batch 5)

## Deviations

- **Bake:** each grid bakes in `onBeforeDraw`, once per renderer and grid; `resolution` replaces the grids at once, without the source's debounce. Both grids and their helpers are hidden while either bakes, as the source bakes them before adding them.
- **Controls:** `gi` for the source's `enabled`.

## Workarounds

- `triage-fragment-node-mrt`: `useBasicMaterial()` gives each `LightProbeGridHelper` a `MeshBasicNodeMaterial` with the helper's `fragmentNode` as its `colorNode`; a `fragmentNode` writes only the first color output, which the TRAA views' MRT pass rejects. **Restore:** the helpers' own material.

## Related

- [Lightprobes](LightprobesExample.md): one grid, the same bake and helper workaround.

## History

- 2026-10-20: Converted (batch 5), once `onBeforeDraw` served `renderer-on-change`. Ran on the linked r187dev build `d94661f706`. Checked headlessly: the active view against `examples/screenshots`, property edits and scrubbing, all batch 5 documents in one page without errors.
