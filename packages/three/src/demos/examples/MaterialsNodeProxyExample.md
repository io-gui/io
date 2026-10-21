---
source: webgpu_materials_node_proxy
synced: d94661f706
tags: [timeline-time, types]
---

# MaterialsNodeProxy

[`webgpu_materials_node_proxy`](https://threejs.org/examples/#webgpu_materials_node_proxy), converted 2026-10-20 (batch 5)

## Deviations

- **Time:** the waves run on `timeline.timeNode`, a 4π s loop.
- **Dropped:** the shader build count and compile time, which need a renderer debug hook and `compileAsync`.
- **Types:** `ProxyNodeMaterial` (r187) is imported with `@ts-expect-error`, and `materialReference()` is cast; `@types/three` 0.186 has neither.

## Open

- `r187-followups`: drop the `@ts-expect-error` import and the casts with `@types/three` 0.187.

## History

- 2026-10-20: Converted (batch 5) from the source at `d94661f706`, which is newer than r186. Ran on the linked r187dev build. Checked headlessly: the active view against `examples/screenshots`, property edits and scrubbing, all batch 5 documents in one page without errors.
