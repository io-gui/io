# Current Focus

io-three core re-architecture. ADRs `packages/three/docs/adr/0001-0007` (accepted). Plan `.cursor/plans/three_core_architecture.plan.md` (7 phases).
- Decided: ThreeEditor; one active doc switchable at runtime; undo = commands -> transactions of invertible patches (ADR-0008 proposed, awaiting user review); plain Raycaster behind async Picker.
- ADR-0008 accepted. P1-P7 committed. Core plan complete. Future work (undo/commands/collab/BVH/blobs, ex-P8) lives in `.cursor/plans/three_future_work.plan.md`; start only when asked.
- 2026-10-07: removed back-compat (ThreeApplet, ToolBase, viewport applet/tool props, editor onResized); demos use ThreeEditor + `this.document.scene`. Uncommitted.
- Design doc (Claude Docs): https://claude.ai/code/artifact/cb23d4fe-d4ad-406c-9d62-919db30887dd — still mentions WebGL fallback options; ADR-0001 supersedes.
