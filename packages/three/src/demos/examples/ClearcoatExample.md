---
source: webgpu_clearcoat
synced: d94661f706
---

# Clearcoat

[`webgpu_clearcoat`](https://threejs.org/examples/#webgpu_clearcoat), converted 2026-10-11

## Deviations

- **Time:** the spheres turn once per 8π s loop, 0.25 rad/s instead of the source's 0.3, so the loop is seamless.

## History

- 2026-10-11: Converted. Checked headlessly: renders through the page's shared renderer at a fixed time, compared with `examples/screenshots`.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
