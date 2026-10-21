---
source: webgl_loader_collada_kinematics
synced: d94661f706
---

# LoaderColladaKinematics

[`webgl_loader_collada_kinematics`](https://threejs.org/examples/#webgl_loader_collada_kinematics), converted 2026-10-17 (batch 3)

## Deviations

- **Time:** the source chains tween.js tweens with `setTimeout`; here ten random poses are drawn once and the moves between them derive from document time, the loop starting from the last.
- **Camera:** the active camera stands where the source's slow orbit starts.

## History

- 2026-10-17: Converted (batch 3), with the orbiting camera dropped. Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), standing where its orbit starts. Checked: the Scene Camera view against `examples/screenshots`.
