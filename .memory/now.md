# Current Focus

io-three core re-architecture. ADRs `packages/three/docs/adr/0001-0007` (accepted). Plan `.cursor/plans/three_core_architecture.plan.md` (7 phases, todos pending).
- Decided: ThreeEditor; one active doc switchable at runtime; undo = commands -> transactions of invertible patches (ADR-0008 proposed, awaiting user review); plain Raycaster behind async Picker.
- ADR-0008 accepted. P1-P4 committed. P5 selection DONE (uncommitted). Next: P6 pipelines, overlays (selection outline), gizmos + transform operator, uv view.
- Design doc (Claude Docs): https://claude.ai/code/artifact/cb23d4fe-d4ad-406c-9d62-919db30887dd — still mentions WebGL fallback options; ADR-0001 supersedes.
