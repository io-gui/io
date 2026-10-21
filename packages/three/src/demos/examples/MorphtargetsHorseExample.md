---
source: webgl_morphtargets_horse
synced: d94661f706
---

# MorphtargetsHorse

[`webgl_morphtargets_horse`](https://threejs.org/examples/#webgl_morphtargets_horse), converted 2026-10-11

## Deviations

- **Camera:** the active camera stands where the source's orbit (one turn a minute) starts.

## History

- 2026-10-11: Converted, with the orbiting camera dropped. Checked headlessly: renders through the page's shared renderer at a fixed time, compared with `examples/screenshots`.
- 2026-10-19: Changed: the source's camera is the active camera (ADR-0011), standing where its orbit starts. Checked: the Scene Camera view against `examples/screenshots`.
