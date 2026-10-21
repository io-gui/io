---
source: webgpu_occlusion
synced: d94661f706
tags: [verify-per-view]
---

# Occlusion

[`webgpu_occlusion`](https://threejs.org/examples/#webgpu_occlusion), converted 2026-10-15 (batch 2)

## Deviations

None: the node reads the result of the view's previous draw, as in the source.

## Open

- `occlusion-recheck`: with several views, views drawn alike shared occlusion results, so the plane could flicker or show another view's result. Recheck with two views on the linked build, which has #35066.

## Upstream

- `occlusion-upstream`: three kept occlusion results per render context, shared between draws into targets of the same format whatever the camera, since r183 (#32546). Issue kit 2026-10-16 (https://claude.ai/artifact/R4gDW6w2E2bwT9LwE2A11K). Fixed by #35066, Backend: Keep occlusion query results per camera, in the dev build `c9a92ccae3` (2026-10-17).

## History

- 2026-10-15: Converted (batch 2). Checked: renders against `examples/screenshots` (Perspective and Front views), scene graph names, Document tab controls, the batch's 30 documents in one page without console errors.
- 2026-10-16: Changed: a redraw-until-settled workaround for the shared results was tried and reverted, to stay with the source.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
