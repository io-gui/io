---
source: misc_animation_keys
synced: d94661f706
---

# AnimationKeys

[`misc_animation_keys`](https://threejs.org/examples/#misc_animation_keys), converted 2026-10-11

## Deviations

None.

## Open

- `framing-motion`: views frame the box's bounds at rest on first show, and the box travels 30 units out of them. The active camera covers the whole path.

## History

- 2026-10-11: Converted. Checked headlessly: renders through the page's shared renderer at a fixed time, compared with `examples/screenshots`. The source's camera was kept as a scene camera, since first-show framing loses the box.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), outside the scene. Checked: the Scene Camera view against `examples/screenshots`.
