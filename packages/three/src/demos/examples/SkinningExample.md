---
source: webgpu_skinning
synced: d94661f706
tags: [camera-in-scene]
---

# Skinning

[`webgpu_skinning`](https://threejs.org/examples/#webgpu_skinning), converted 2026-10-11

## Deviations

None.

## History

- 2026-10-11: Converted, with the point light at the source camera's position. Checked headlessly: renders through the page's shared renderer at a fixed time, compared with `examples/screenshots`.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), in the scene with the light on it again. Checked: the Scene Camera view against `examples/screenshots`.
