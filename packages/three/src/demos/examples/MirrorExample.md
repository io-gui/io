---
source: webgpu_mirror
synced: d94661f706
tags: [verify-per-view]
---

# Mirror

[`webgpu_mirror`](https://threejs.org/examples/#webgpu_mirror), converted 2026-10-15 (batch 2)

## Deviations

- **Time:** the half sphere turns at 0.1 rad/s on a 20π s loop; the source turns it 0.002 rad per frame.
- **Reflections:** each view draws its own; the reflector keeps a virtual camera per drawing camera.

## History

- 2026-10-15: Converted (batch 2). Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
