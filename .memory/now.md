# Current Focus

io-three core re-architecture. ADRs `packages/three/docs/adr/0001-0007` (accepted). Plan `.cursor/plans/three_core_architecture.plan.md` (7 phases).
- Decided: Editor; one active doc switchable at runtime; undo = commands -> transactions of invertible patches (ADR-0008 proposed, awaiting user review); plain Raycaster behind async Picker.
- ADR-0008 accepted. P1-P7 committed. Core plan complete. Future work (undo/commands/collab/BVH/blobs, ex-P8) lives in `.cursor/plans/three_future_work.plan.md`; start only when asked.
- 2026-10-07: removed back-compat (ThreeApplet, ToolBase, viewport applet/tool props, editor onResized) committed. 2026-10-08: viewport `cameraSelect` removed -> `View.setAxisView('free'|axis)` (clears scene camera) / `setCameraView(id?)` (`uuid:`/`name:`, none = first scene camera; lazy -> uuid, free view meanwhile; no prefix warns). AxisView gained `'free'` (was null). Committed (8f89549b).
- 2026-10-08: review fixes (scheduler starvation aging, outline proxy resync, getObject miss cache + selection prune) uncommitted. transact() join left as design choice.
- ADR drift + minor review fixes committed. Open: LMB orbit vs tool LMB (ADR-0004), later.
- 2026-10-08: PR #111 cleanup uncommitted (core events/Field, Registry, KeyedPool, StateCage, UV cage path, utils/camera + sceneGraph). See archive. Transaction.set assigns / Transaction.copy copies (uncommitted).
- 2026-10-09: IoSelectionExample + IoEditorViewsExample merged into IoEditorExample (Three > Editor). Then: EditorDocument1/2.ts (Document subclasses) loaded via dynamic import from heading buttons, View.switchDocument keeps axis view. Document.onRendererInitialized (once per renderer, called by viewport) for compute docs. 2026-10-10: GeometriesExample + GeometryColorsExample converted to documents (Io* versions removed). Document.onAnimate (ticked by editor while playing); Play toggle in Editor heading. Document.autoplay (applied by IoEditorExample loader; Geometries autoplays). All examples now documents; editor at src/demos/IoEditorExample.ts (Demos > Three), Camera view follows docs. Uncommitted; user editing IoEditorExample (ioLayout) + ThreeEditorStatus concurrently.
- Inspector: `selection.active` is uuid; property editor wants the object. Selector cache ignores later `value` props — bind a reactive object property.
- Add-tab menu: `element.group` nests those entries under one option.
- Layout CSS: auto size = `flex: 1 1 0%` (zero basis, equal auto siblings), user's f9db9c29; layoutSize tests + layout CONTEXT updated 2026-10-10.
- Editors: nested IoObject forwarded `properties: []` (`init: null` → empty array). IoPropertyEditor only drew Advanced when `properties === undefined`. Fixed: empty list is no filter; IoObject omits it.
- Design doc (Claude Docs): https://claude.ai/code/artifact/cb23d4fe-d4ad-406c-9d62-919db30887dd — still mentions WebGL fallback options; ADR-0001 supersedes.

## 2026-10-10 ThreeTimeline (done, uncommitted)
- Timeline node on Document (currentTime/duration/frameRate/loop/autoplay, timeNode); ThreeTimeline + ThreeTimelineRange (IoGl) in IoEditorExample above status; `three:` iconset; examples time-driven / mixers aligned; docs + io-icons.mdc rule + icons skill. Tests 172 pass, tsc clean.
- Follow-ups done: io:slider rename, getIcon miss markup, hasIcon, IoBoolean any namespace, heading Play toggle removed, playwright 1248 in repo path, docs (core ctor order/IoGl, io-gui.mdc testing). Deferred: frameRate playback, negative delta (plan todos), core two-phase construction (opinion only).
