# Current Focus

2026-10-11: ThreeScenegraph round 2 done (uncommitted): expanded by default (disclosure = collapsed uuids), reveal on active change (expand ancestors + scroll), rename via double-click/F2 -> built-in `object.rename` operator, horizontal scroll for deep rows (grid `minmax(max-content, auto)`). See archive (17).
- align-self baseline removed (user OK). User has other uncommitted edits (layout, deleted EditorDocument1/2, examples, half indent) — do not touch.
- 2026-10-11 examples: audit + r186 port + ADR-0009 live documents (SkinningBlending option A) done, uncommitted. Follow-up deferred: onAnimate time-change cause (future plan timeline-negative-delta). See archive (18 examples, 19-21).
- Design doc (Claude Docs) for io-three: https://claude.ai/code/artifact/cb23d4fe-d4ad-406c-9d62-919db30887dd (mentions WebGL fallback; ADR-0001 supersedes).
- 2026-10-11 conversion plan: Candidates table added (274 rows, blocker tags + non-candidate lists). See archive (22).
- 2026-10-11 low-hanging conversions: 27 docs (24 completed, 3 transmission in progress), uncommitted. Next candidates: more unblocked TODO rows. Harness: scratchpad snap.mjs (shared renderer). See archive (23).
- 2026-10-11 dev: three linked to sibling ../three.js (branch render-pipeline-fix, r187dev) via `link:` in packages/three; vite fs.allow for it. One three patch: NodeMaterialObserver FULL refresh on output target change (fixes multi-view transmission bleed). Size defect already fixed upstream (#34636 FramebufferTexture.copy) -> no io shim, no per-view scope needed on dev. io-gui branch render-pipeline-fix (shim + scope, r186) superseded once on three dev. Uncommitted both repos. See archive (26).
