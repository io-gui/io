---
name: Io-Gui Improvement Roadmap
overview: Prioritized roadmap of architectural, performance, tooling, testing, and documentation improvements for the Io-Gui framework, derived from a 4-track deep analysis of core, packages, tooling, and hot paths.
todos:
  - id: quick-wins
    content: "Quick wins: GL uniform cache (C1), dev loop fix (D1), three override fix (D2), stale docs (F1), ChangeQueue map (C6)"
    status: pending
  - id: test-safety-net
    content: "Test safety net: coverage config (E3), three package smoke tests (E1)"
    status: pending
  - id: core-refactors-small
    content: "Core: setProperty decomposition (A2), object-mutation observer consolidation (A3), event system fixes (A5)"
    status: pending
  - id: leak-fixes
    content: Leak/cleanup fixes across core + menus/colors (A4)
    status: completed
  - id: node-element-unify
    content: Unify ReactiveNode/IoElement + parent graph (A1)
    status: pending
  - id: vdom-keys
    content: VDOM keyed diffing + render allocation reduction (C2)
    status: completed
  - id: theme-stylesheet
    content: Theme via CSSStyleSheet, drop JSON clones (C3)
    status: completed
  - id: package-layer
    content: "Package layer: layout→editors decouple (B1), pointer-drag helper (B2), IoSlider base fix (B3), composite re-render reduction (C4), tab-drag cache (C5)"
    status: pending
  - id: packaging-builds
    content: Packaging metadata + incremental builds (D3, D4)
    status: completed
  - id: ongoing
    content: "Ongoing: CI/lint/releases (D5-D7), remaining tests (E2/E4), TSDoc + API docs (F2/F3)"
    status: completed
isProject: false
---

# Io-Gui Improvement Roadmap

Findings from 4 parallel deep-dives: core architecture, non-core packages, tooling/docs, runtime hot paths. Organized by theme, prioritized P0 → P2 within each. Preserve well-designed systems: change coalescing ([packages/core/src/core/ChangeQueue.ts](packages/core/src/core/ChangeQueue.ts) ~L71–82), rAF double-buffer queue, DOM/synthetic event dedup, text-node flattening, debug-block stripping.

## A. Architecture (core)

- **A1 (P0) Unify ReactiveNode / IoElement.** ~200 lines duplicated between [packages/core/src/nodes/ReactiveNode.ts](packages/core/src/nodes/ReactiveNode.ts) and [packages/core/src/elements/IoElement.ts](packages/core/src/elements/IoElement.ts); behavior diverges (`_parents` commented out in IoElement ~L93, `dispatchMutation` skipped for elements in ChangeQueue ~L124, different event payload shapes). Extract shared reactive-core mixin/composition; unify parent graph so `_isIoElement` values get `addParent()` too (ReactiveNode ~L322–334).
- **A2 (P0) Decompose `setProperty`** (ReactiveNode ~L269–376, existing P0 TODO ~L318). God-function mixes binding swap, NodeArray splice, observer start/stop, parent wiring, shared-value scan. Split: value write → observer delta → parent delta → binding delta → queue.
- **A3 (P1) Consolidate object-mutation observation.** One `window` listener per object-typed property ([packages/core/src/core/ReactiveProperty.ts](packages/core/src/core/ReactiveProperty.ts) ~L177–182); listeners removed only on dispose, not `stop()`. Use one listener per node (or central registry keyed by object).
- **A4 (P1) Fix leak/cleanup gaps:** stale `_parents` after parent dispose; orphan EventDispatcher on native VDOM elements detached outside `disposeChildren`; `throttleNextFrame` WeakMap entries not cleared on dispose ([packages/core/src/core/Queue.ts](packages/core/src/core/Queue.ts) ~L24); `IoContextMenu`/`IoColorPicker`/`IoMenuOptions` listener cleanup on disconnect mid-gesture.
- **A5 (P1) Event system:** implement `stopPropagation` (EventDispatcher ~L340 TODO); fix `setProtoListeners` keeping only last proto listener (~L145); reuse `visited` Set and avoid `path = [...path, node]` per hop.
- **A6 (P2) API consistency:** merge `applyProperties`/`setProperties` paths; rename inverted `noDispose` VDOM flag; reconsider `window[ClassName]` global registration; make `Color` reactive or document replace-only contract; `IoSelector` `selected` vs `value` naming.

## B. Architecture (packages)

- **B1 (P1) Break layout→editors dependency.** [packages/layout/src/elements/IoTab.ts](packages/layout/src/elements/IoTab.ts) imports `IoContextEditorSingleton` — inverted layering; invert via event/injection so layout doesn't pull the whole editors stack.
- **B2 (P1) Lift pointer-drag helper to core.** Same capture/move/up/cancel pattern duplicated in `IoField`, `IoNumber`, `IoString`, `IoNumberLadderStep`, `IoSlider`, `IoSliderBase`, `IoDivider`, tab drag. Also lift `clamp`, overlay-singleton expand/nudge, `io-focus-to` nav, loading-spinner CSS.
- **B3 (P1) Fix `IoSlider` not extending `IoSliderBase`** — duplicated styles/handlers in [packages/sliders/src/elements/IoSlider.ts](packages/sliders/src/elements/IoSlider.ts).
- **B4 (P2) three package hygiene:** internal circular imports (`IoThreeViewport` ↔ `ViewCameras` ↔ `ToolBase`); fragile deep import `three/src/renderers/webgpu/WebGPUBackend.js`; ~120 side-effect editor configs loaded at import — make config registration opt-in/lazy. Remove dead `IoInspector.dispose()` removeEventListener with no matching add.

## C. Performance (hot paths)

- **C1 (P0) Cache GL uniform locations.** `gl.getUniformLocation` per uniform per frame + brute-force all-props uniform update ([packages/core/src/elements/IoGL.ts](packages/core/src/elements/IoGL.ts) ~L268–311). Localized, big win for all sliders.
- **C2 (P0) VDOM keyed diffing.** Tag-only positional diff destroys/recreates DOM on reorder (IoElement `traverse` ~L242); add `key` support + in-place prop diff; remove per-render `filter()` allocations and `this.$ = {}` reset churn.
- **C3 (P1) Theme CSS via CSSStyleSheet API.** Full string rebuild + `innerHTML` rewrite on any theme change, plus `JSON.parse(JSON.stringify())` clones and stringify-based Color duck-typing ([packages/core/src/nodes/Theme.ts](packages/core/src/nodes/Theme.ts) ~L244–302).
- **C4 (P1) Reduce full re-renders in composites.** `changed() → render()` whole subtree on single prop change (`IoNumberSlider`, `IoSplit`, `IoTabDragIcon`, editors).
- **C5 (P1) Tab-drag spatial cache.** `querySelectorAll` + `getBoundingClientRect` per pointermove ([packages/layout/src/elements/IoTabDragIcon.ts](packages/layout/src/elements/IoTabDragIcon.ts) ~L96–149); cache rects per drag frame.
- **C6 (P2) Micro-optimizations:** ChangeQueue property→index Map instead of `findIndex`; remove `JSON.stringify` equality in `applyPropListeners` and `IoSliderBase`; `hasValueAtOtherProperty` O(n) scan twice per set; ThreeApplet direct viewport render callback instead of per-rAF bubbling event; ToolBase Vector2/Ray pooling; split-drag rect caching.

## D. Tooling / Build

- **D1 (P0) Fix dev loop.** `pnpm dev` runs Vite only but `index.html`/`dev.html` import maps point at `./packages/*/dist/` — fresh clone serves stale/missing dist. Add concurrent `tsc -b -w` or point dev import maps at source.
- **D2 (P0) Fix machine-specific `three` override** in [pnpm-workspace.yaml](pnpm-workspace.yaml) (`link:../../Library/pnpm/...`) — breaks installs on other machines/CI.
- **D3 (P1) Packaging metadata:** `exports` points at `src/*.ts` while `main`/`types` point at `dist/` — inconsistent resolution; blanket `sideEffects: true` kills tree-shaking (narrow to entry/registration files); markdown bundles `marked`/`dompurify` and three bundles Three.js into dist despite peer model — decide and document.
- **D4 (P1) Incremental builds:** add TS `composite` + project references (or turborepo); drop `clean` from dev builds.
- **D5 (P2) CI hygiene:** split lint (no `--fix`) / build / test steps; skip full bundle on PR CI; parallelize `bundle.js`; align pnpm versions (packages pin 9.5.0, CI uses latest-10); remove `paths-ignore: docs/**` skip.
- **D6 (P2) Lint:** enable deferred rules (`no-explicit-any`, `no-unused-expressions`, `ban-ts-comment`) incrementally; scope `no-unused-labels` to `debug` only.
- **D7 (P2) Releases:** adopt Changesets for coordinated multi-package alpha releases.

## E. Testing

- **E1 (P0) Tests for `@io-gui/three`** — zero tests across ~186 files; start with viewport registration, ToolBase pointer math, ViewCameras smoke tests.
- **E2 (P1) Fill menus gap** (only 2 tests): `IoMenuItem`, `IoContextMenu`, `IoMenuOptions`, `IoMenuTree`.
- **E3 (P1) Vitest coverage** with thresholds on core first; add regression tests before B3/C2 refactors.
- **E4 (P2) Smaller gaps:** markdown theme/sanitize, NavigatorDrawer, Breadcrumbs/PropertyLink/ContextEditor, tab-drag elements.

## F. Documentation

- **F1 (P1) Update stale docs:** `.github/CONTRIBUTING.md` references web-test-runner, `pnpm serve`, `build/` output dir, `IoNode` (now `ReactiveNode`); `.cursor/rules/io-gui.mdc` likewise; root README npm badge points to legacy `io-core` package.
- **F2 (P1) TSDoc on central public APIs:** `IoElement`, `ReactiveNode`, `Storage`, `Color` have no class-level docs; READMEs compensate but generated API docs impossible.
- **F3 (P2) TypeDoc/API Extractor** for `@io-gui/core` public surface; expand `docs/` beyond 2 files.

## Suggested implementation order

1. Quick wins, low risk: C1, D1, D2, F1, C6 (ChangeQueue map)
2. Foundation for everything else: E3 + E1 (test safety net), then A2, A3, A5
3. Big refactors: A1 (node/element unification), C2 (VDOM keys), C3 (Theme)
4. Package layer: B1–B3, C4, C5, D3, D4
5. Ongoing: D5–D7, E2/E4, F2/F3

## Unresolved questions

- A1 unification: mixin over HTMLElement vs shared free functions (current partial approach) — preference?
- D3: is single-file-bundle-with-inlined-deps intentional for publish artifacts, or should peers stay external?
- C2 VDOM keys: full keyed reconciliation or minimal `key` opt-in for lists only?
- Scope: implement everything eventually, or should this roadmap be trimmed to a subset for the next milestone?