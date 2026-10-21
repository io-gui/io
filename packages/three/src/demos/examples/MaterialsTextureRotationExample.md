---
source: webgl_materials_texture_rotation
synced: d94661f706
tags: [camera-in-scene]
---

# MaterialsTextureRotation

[`webgl_materials_texture_rotation`](https://threejs.org/examples/#webgl_materials_texture_rotation), converted 2026-10-14

## Deviations

None.

## Open

- `shared-refresh`: a lone forward view keeps the texture's first transform; TRAA views follow. With several views the controls do reach forward views, as same-format view targets share render objects and each switch forces a full refresh.

## Upstream

- `shared-refresh`: texture `offset`, `repeat`, `rotation`, `center` and `matrix` are built-in state the node material observer does not track, so changes never reach unchanged objects. In the issue kits of 2026-10-15 (https://claude.ai/artifact/VcLnhjZSTRQ4jQPZH39eiz); not tracked upstream yet.

## History

- 2026-10-14: Converted. Checked in the editor (headless Chromium on the GPU): renders, scene graph names, Document tab controls with playback paused, the batch's 30 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), in the scene as in the source. Checked: the Scene Camera view against `examples/screenshots`.
