---
source: webgpu_lines_fat_wireframe
synced: d94661f706
---

# LinesFatWireframe

[`webgpu_lines_fat_wireframe`](https://threejs.org/examples/#webgpu_lines_fat_wireframe), converted 2026-10-15 (batch 2)

## Deviations

- **Dropped:** the inset view, which draws the same camera's view small; views of any size show the pixel widths.

## Related

- [LinesFat](LinesFatExample.md): the same fat lines along a curve.

## History

- 2026-10-15: Converted (batch 2), with the source's camera kept as a scene camera. Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), outside the scene. Checked: the Scene Camera view against `examples/screenshots`.
