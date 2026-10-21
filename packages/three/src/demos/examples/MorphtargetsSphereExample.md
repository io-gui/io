---
source: webgl_morphtargets_sphere
synced: d94661f706
tags: [stand-in-framing]
---

# MorphtargetsSphere

[`webgl_morphtargets_sphere`](https://threejs.org/examples/#webgl_morphtargets_sphere), converted 2026-10-17 (batch 3)

## Deviations

- **Points:** WebGPU draws `Points` 1 px wide, and quads from an instanced attribute do not see morph targets, so the discs are a child `Sprite` whose position node adds each morph target's offsets weighted by the mesh's influences.
- **Time:** the morph swings three times per 4π s loop.

## History

- 2026-10-17: Converted (batch 3). Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
