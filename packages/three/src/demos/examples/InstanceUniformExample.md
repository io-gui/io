---
source: webgpu_instance_uniform
synced: d94661f706
tags: [types]
---

# InstanceUniform

[`webgpu_instance_uniform`](https://threejs.org/examples/#webgpu_instance_uniform), converted 2026-10-11

## Deviations

- **Controls:** each teapot's `color` is a property of a `Mesh` subclass, editable in the Inspector.
- **Time:** the teapots spin with document time on a 20 s loop.
- **Types:** `emissiveNode` is typed through a cast; `@types/three` 0.186 declares it only on lit materials.

## History

- 2026-10-11: Converted. Checked headlessly: renders through the page's shared renderer at a fixed time, compared with `examples/screenshots`.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
