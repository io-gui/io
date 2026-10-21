---
source: webgl_loader_nrrd
synced: d94661f706
tags: [camera-in-scene]
---

# LoaderNrrd

[`webgl_loader_nrrd`](https://threejs.org/examples/#webgl_loader_nrrd), converted 2026-10-17 (batch 3)

## Deviations

- **Controls:** the slider ranges come from `I.nrrd`'s dimensions and value range, since editor configs are per class.
- **Slices:** they paint on the canvases the addon creates in the DOM; the conversion leaves them there.

## History

- 2026-10-17: Converted (batch 3). Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors; the addon warned about its canvas readback.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), in the scene as in the source. Checked: the Scene Camera view against `examples/screenshots`.
