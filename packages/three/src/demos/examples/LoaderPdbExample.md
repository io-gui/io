---
source: webgl_loader_pdb
synced: d94661f706
tags: [camera-in-scene]
---

# LoaderPdb

[`webgl_loader_pdb`](https://threejs.org/examples/#webgl_loader_pdb), converted 2026-10-17 (batch 3)

## Deviations

- **Dropped:** the `CSS2DRenderer` labels; the atoms are named by element in the scene graph instead.
- **Time:** the molecule tumbles with document time on a 50π s loop.

## History

- 2026-10-17: Converted (batch 3). Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), in the scene as in the source. Checked: the Scene Camera view against `examples/screenshots`.
