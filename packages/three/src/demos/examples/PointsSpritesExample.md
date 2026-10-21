---
source: webgl_points_sprites
synced: d94661f706
tags: [pointer-dropped]
---

# PointsSprites

[`webgl_points_sprites`](https://threejs.org/examples/#webgl_points_sprites), converted 2026-10-17 (batch 3)

## Deviations

- **Points:** WebGPU draws `Points` 1 px wide; each layer has a child `Sprite` named `Sprites` that draws the flakes with its map, and the `Points`, without the map, stay for picking and framing.
- **Time:** the layers turn in whole turns per 40π s loop, and the hue runs six cycles per loop; the source cycles it every 20 s.
- **Camera:** the source's camera follows the pointer; the active camera rests where the pointer at the centre leaves it.

## Related

- [PointsBillboards](PointsBillboardsExample.md): the same point sprites and camera.

## History

- 2026-10-17: Converted (batch 3), with the pointer camera dropped. Checked: renders against `examples/screenshots` (Perspective and Front views), every Document tab control changed headlessly, the batch's 39 documents in one page without console errors.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), resting where the pointer at the centre leaves it. Checked: the Scene Camera view against `examples/screenshots`.
