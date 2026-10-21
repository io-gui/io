---
source: webgpu_volume_perlin
synced: d94661f706
---

# VolumePerlin

[`webgpu_volume_perlin`](https://threejs.org/examples/#webgpu_volume_perlin), converted 2026-10-10

## Deviations

None.

## History

- 2026-10-10: Converted from the earlier `ThreeApplet` version to a `Document` (`289e7bf9`).
- 2026-10-11: Checked against r186 and HEAD: compiles and renders on r186 without WebGPU validation errors (headless). Fixed: the `refine` bisection, ported from the source; the mesh named.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
