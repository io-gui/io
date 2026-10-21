---
source: webgpu_sprites
synced: d94661f706
---

# Sprites

[`webgpu_sprites`](https://threejs.org/examples/#webgpu_sprites), converted 2026-10-11

## Deviations

- **Time:** an 8π s loop: the group turns at 0.5, 0.75 and 1 rad/s, and each sprite's spin is rounded to whole turns per loop.
- **Loading:** the sprites resize when the texture arrives.

## History

- 2026-10-11: Converted. Checked headlessly: renders through the page's shared renderer at a fixed time, compared with `examples/screenshots`.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011). Checked: the Scene Camera view against `examples/screenshots`.
