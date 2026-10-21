---
source: webgl_geometry_cube
synced: d94661f706
---

# GeometryCube

[`webgl_geometry_cube`](https://threejs.org/examples/#webgl_geometry_cube), converted 2026-10-11

## Deviations

- **Time:** the cube spins with document time on a 20 s loop; the source adds 0.005 and 0.01 rad per frame.

## History

- 2026-10-11: Converted. Checked headlessly: renders through the page's shared renderer at a fixed time, compared with `examples/screenshots`.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
