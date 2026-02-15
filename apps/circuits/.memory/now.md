# NOW - Circuits App

## Current Task
Darken layer-0 line rendering in scene materials.

## Key Context
- `Layer0LinesStateMaterial` and `Layer1LinesStateMaterial` both extend `StateTextureMaterialBase`.
- `StateTextureMaterialBase` builds `outputNode` for all instanced state-texture meshes.
- A brightness multiplier can tint only selected materials without changing texture data.

## Open Questions / Next Check
- Verify layer-0 lines are visibly darker than layer-1 lines in browser.
