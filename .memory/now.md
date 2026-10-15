# Current Focus

three.js shared-refresh (#34162) follow-up, 2026-10-15:
- #34996 merged 2026-10-14 (+ Mugen87 cleanup c5e5061ed0), in dev build ca10fb69aa. io links ../three.js (now on dev ec2b7458ea) -> recheck FogHeight forward views.
- #35002 (observer texture transforms etc.) closed: Mugen87 wants step-by-step + issues first; merged refractionRatio/clearcoatRoughnessMap/thicknessMap himself as #35022 (not in the dev build yet). He wants iridescenceThicknessRange next.
- Issue kits https://claude.ai/artifact/VcLnhjZSTRQ4jQPZH39eiz: 1 iridescenceThicknessRange, 2 texture transforms, 3 LightProbe (r186 regression), 4 Sprite.center (older), 5 envMap standard/physical (older, no small fix). User files them; then small PRs from a personal fork (org fork blocks maintainer edits).
- MaterialsTextureRotation works in io only because same-format view targets share render objects (target switch -> FULL); upstream still stale.

examples-webgl merged into dev (19cfc623, not pushed). Worktree /Users/aki/Projects/io-examples-webgl kept: remove when user agrees.

Open:
- webgpu_* candidate rows unclaimed (peer session paused them).
