---
source: webgl_loader_3dm
synced: d94661f706
---

# Loader3dm

[`webgl_loader_3dm`](https://threejs.org/examples/#webgl_loader_3dm), converted 2026-10-17 (batch 3)

## Deviations

- **Up axis:** the source makes Z the global up axis (`Object3D.DEFAULT_UP`); here a `Z Up` group turns the model to Y-up, and its light and the active camera with it, (x, y, z) to (x, z, -y).

## History

- 2026-10-17: Converted (batch 3). Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors; the addon warned about `iridescenceThicknessRange` (three's `cache-key-deprecated-accessor`, fixed upstream 2026-10-19).
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), turned like the model. Checked: the Scene Camera view against `examples/screenshots`.
