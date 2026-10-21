---
source: webgl_buffergeometry
synced: d94661f706
---

# Buffergeometry

[`webgl_buffergeometry`](https://threejs.org/examples/#webgl_buffergeometry), converted 2026-10-11

## Deviations

- **Geometry:** the attribute arrays stay in memory. The source frees them once uploaded; framing and picking read them.

## History

- 2026-10-11: Converted. Checked headlessly: renders through the page's shared renderer at a fixed time, compared with `examples/screenshots`.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
