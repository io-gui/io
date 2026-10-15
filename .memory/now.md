# Current Focus

three.js shared-refresh (#34162) regressions, two independent upstream fixes:
- #34996 open (custom scene.fogNode/environmentNode -> FULL), branch `fixes/scene-node-uniforms` pushed, no review yet.
- 2nd fix ready 2026-10-14: ../three.js `fixes/observer-texture-transforms` (off dev 286e2d8cba), UNCOMMITTED. Observer tracks texture uv transforms + refractionRatio, clearcoatRoughnessMap, thicknessMap, iridescenceThicknessRange. User commits, pushes, opens PR via kit https://claude.ai/artifact/SKMjUYdcMTe2NrYMfv1eQW. Kit v2: 11-tile fiddle (all cases + color control). Gaps predate #34162: before it only 1st render object per node builder state was force-refreshed. Sweep 2026-10-14: also LightProbe (same class, LightProbeNode renderGroup), + pre-existing shared-shader bugs: iridescenceThicknessRange binding (suggest add to PR), Sprite.center, envMap PMREM. Awaiting user choice.
- io: FogHeight renderGroup workaround removed (uncommitted). FogHeight + MaterialsTextureRotation stale in forward views until both land; recheck then.

examples-webgl merged into dev (19cfc623, not pushed). Worktree /Users/aki/Projects/io-examples-webgl kept: remove when user agrees.

Open:
- webgpu_* candidate rows unclaimed (peer session paused them).
